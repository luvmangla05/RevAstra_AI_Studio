/**
 * server/routes/leads.ts
 * ----------------------
 * CRM Lead CRUD endpoints with Zod validation, duplicate detection,
 * CSV import/export, and lead activity timeline integration.
 *
 * Routes:
 *   GET    /api/db/leads
 *   POST   /api/db/leads
 *   PUT    /api/db/leads/:id
 *   DELETE /api/db/leads/:id
 *   POST   /api/db/leads/import-csv
 *   GET    /api/db/leads/export-csv
 *
 * @license Apache-2.0
 */

import { Router, Request, Response } from "express";
import { z } from "zod";
import { readDB, writeDB, normalizeLead, createActivity } from "../repositories/db.js";
import { findDuplicates } from "../utils/duplicateDetection.js";

const router = Router();

// ---------------------------------------------------------------------------
// Zod Schemas
// ---------------------------------------------------------------------------

const CRMStageEnum = z.enum([
  "new",
  "contacted",
  "site_visit_scheduled",
  "site_visit_done",
  "quotation_sent",
  "negotiation",
  "closed_won",
  "closed_lost",
]);

const CreateLeadSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  phone: z.string().min(7, "Phone must be at least 7 characters").max(25),
  email: z.union([z.string().email("Invalid email format"), z.literal("")]).optional(),
  companyName: z.string().max(200).optional().default(""),
  city: z.string().max(100).optional().default(""),
  state: z.string().max(100).optional(),
  industry: z.string().max(100).optional(),
  source: z.string().max(200).optional().default("Direct Lead"),
  stage: CRMStageEnum.optional().default("new"),
  value: z.number().min(0).optional().default(0),
  score: z.number().min(0).max(100).optional().default(0),
  notes: z.string().max(5000).optional().default(""),
  assignedTo: z.string().max(200).optional(),
  lastContactedAt: z.string().datetime({ offset: true }).optional().or(z.string().max(0).optional()),
  nextFollowUpAt: z.string().datetime({ offset: true }).optional().or(z.string().max(0).optional()),
  /** Set to true to bypass duplicate detection warning */
  forceCreate: z.boolean().optional().default(false),
});

const UpdateLeadSchema = CreateLeadSchema.partial().omit({ forceCreate: true });

// ---------------------------------------------------------------------------
// GET /api/db/leads
// ---------------------------------------------------------------------------

router.get("/", (_req: Request, res: Response) => {
  const db = readDB();
  const normalizedLeads = (db.leads || []).map(normalizeLead);
  res.json(normalizedLeads);
});

// ---------------------------------------------------------------------------
// POST /api/db/leads
// ---------------------------------------------------------------------------

router.post("/", (req: Request, res: Response) => {
  const parsed = CreateLeadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const data = parsed.data;
  const db = readDB();

  // Duplicate detection
  if (!data.forceCreate) {
    const duplicates = findDuplicates(db, data.phone, data.email || "");
    if (duplicates.length > 0) {
      return res.status(409).json({
        error: "DUPLICATE_DETECTED",
        warning: `A lead with this ${duplicates[0].matchedOn === "both" ? "phone and email" : duplicates[0].matchedOn} already exists.`,
        duplicates,
      });
    }
  }

  const normalized = normalizeLead({
    id: "l_" + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    ...data,
  });

  db.leads.unshift(normalized);

  // Log activity
  db.activities = db.activities || [];
  db.activities.unshift(createActivity(normalized.id, "lead_created", `Lead "${normalized.name}" created`));

  writeDB(db);
  res.status(201).json(normalized);
});

// ---------------------------------------------------------------------------
// PUT /api/db/leads/:id
// ---------------------------------------------------------------------------

router.put("/:id", (req: Request, res: Response) => {
  const parsed = UpdateLeadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const db = readDB();
  const index = db.leads.findIndex((l) => l.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Lead not found" });
  }

  const previousStage = db.leads[index].stage;
  const updated = normalizeLead({ ...db.leads[index], ...parsed.data });
  db.leads[index] = updated;

  // Log stage change activity
  db.activities = db.activities || [];
  if (parsed.data.stage && parsed.data.stage !== previousStage) {
    db.activities.unshift(
      createActivity(
        updated.id,
        "stage_changed",
        `Stage changed from "${previousStage}" to "${parsed.data.stage}"`,
        { from: previousStage, to: parsed.data.stage }
      )
    );
  }

  // Log note activity if notes changed
  if (parsed.data.notes && parsed.data.notes !== db.leads[index].notes) {
    db.activities.unshift(
      createActivity(updated.id, "note_added", `Notes updated for "${updated.name}"`)
    );
  }

  writeDB(db);
  res.json(updated);
});

// ---------------------------------------------------------------------------
// DELETE /api/db/leads/:id
// ---------------------------------------------------------------------------

router.delete("/:id", (req: Request, res: Response) => {
  const db = readDB();
  db.leads = db.leads || [];
  const index = db.leads.findIndex((l) => l.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Lead not found" });
  }
  const deleted = db.leads.splice(index, 1)[0];
  writeDB(db);
  res.json({ success: true, deleted });
});

// ---------------------------------------------------------------------------
// POST /api/db/leads/import-csv
// ---------------------------------------------------------------------------
// Accepts raw CSV text in the request body as application/text or JSON { csv: "..." }
// Column mapping (case-insensitive header matching):
//   Name, Phone, Email, Company, City, Industry, Source, Stage, Value, Notes

router.post("/import-csv", (req: Request, res: Response) => {
  try {
    let csvText: string;
    if (typeof req.body === "string") {
      csvText = req.body;
    } else if (req.body && typeof req.body.csv === "string") {
      csvText = req.body.csv;
    } else {
      return res.status(400).json({ error: "Request body must be raw CSV text or { csv: '...' }" });
    }

    const lines = csvText.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2) {
      return res.status(400).json({ error: "CSV must have a header row and at least one data row." });
    }

    // Parse header row — normalize to lowercase, strip quotes/spaces
    const headers = parseCSVRow(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, "_"));

    const colIndex = (names: string[]): number => {
      for (const n of names) {
        const idx = headers.indexOf(n);
        if (idx !== -1) return idx;
      }
      return -1;
    };

    const nameCol = colIndex(["name", "full_name", "lead_name", "contact_name"]);
    const phoneCol = colIndex(["phone", "phone_number", "mobile", "contact"]);
    const emailCol = colIndex(["email", "email_address"]);
    const companyCol = colIndex(["company", "company_name", "organization"]);
    const cityCol = colIndex(["city", "location"]);
    const industryCol = colIndex(["industry", "sector"]);
    const sourceCol = colIndex(["source", "lead_source"]);
    const stageCol = colIndex(["stage", "status", "pipeline_stage"]);
    const valueCol = colIndex(["value", "deal_value", "estimate", "budget"]);
    const notesCol = colIndex(["notes", "remarks", "comments"]);

    if (nameCol === -1) {
      return res.status(400).json({ error: "CSV must have a 'Name' column." });
    }
    if (phoneCol === -1) {
      return res.status(400).json({ error: "CSV must have a 'Phone' column." });
    }

    const db = readDB();
    const imported: any[] = [];
    const skipped: Array<{ row: number; reason: string; data: string }> = [];

    const VALID_STAGES = new Set([
      "new", "contacted", "site_visit_scheduled", "site_visit_done",
      "quotation_sent", "negotiation", "closed_won", "closed_lost",
    ]);

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVRow(lines[i]);
      const get = (idx: number) => (idx !== -1 ? (cols[idx] || "").trim() : "");

      const name = get(nameCol);
      const phone = get(phoneCol);

      if (!name) {
        skipped.push({ row: i + 1, reason: "Missing name", data: lines[i] });
        continue;
      }
      if (!phone || phone.replace(/\D/g, "").length < 7) {
        skipped.push({ row: i + 1, reason: "Missing or invalid phone number", data: lines[i] });
        continue;
      }

      const rawStage = get(stageCol).toLowerCase().replace(/\s+/g, "_");
      const stage = VALID_STAGES.has(rawStage) ? rawStage : "new";

      const rawValue = get(valueCol).replace(/[₹,\s]/g, "");
      const value = rawValue ? Number(rawValue) || 0 : 0;

      const email = get(emailCol);

      // Skip duplicates silently during bulk import (report in summary)
      const duplicates = findDuplicates(db, phone, email);
      if (duplicates.length > 0) {
        skipped.push({
          row: i + 1,
          reason: `Duplicate lead (matches existing: ${duplicates[0].name})`,
          data: lines[i],
        });
        continue;
      }

      const lead = normalizeLead({
        id: "l_" + Math.random().toString(36).substr(2, 9),
        name,
        phone,
        email,
        companyName: get(companyCol),
        city: get(cityCol),
        industry: get(industryCol) || undefined,
        source: get(sourceCol) || "CSV Import",
        stage,
        value,
        notes: get(notesCol),
        score: 0,
        createdAt: new Date().toISOString(),
      });

      db.leads.unshift(lead);
      db.activities = db.activities || [];
      db.activities.unshift(createActivity(lead.id, "lead_created", `Lead "${lead.name}" imported from CSV`));
      imported.push(lead);
    }

    if (imported.length > 0) {
      writeDB(db);
    }

    res.json({
      imported: imported.length,
      skipped: skipped.length,
      skippedRows: skipped,
      leads: imported,
    });
  } catch (err: any) {
    console.error("[CSV Import] Error:", err);
    res.status(500).json({ error: "Failed to parse CSV file", details: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /api/db/leads/export-csv
// ---------------------------------------------------------------------------

router.get("/export-csv", (_req: Request, res: Response) => {
  const db = readDB();
  const leads = (db.leads || []).map(normalizeLead);

  const headers = [
    "Name", "Phone", "Email", "Company", "City", "State",
    "Industry", "Source", "Stage", "Value (INR)", "Score",
    "Notes", "Assigned To", "Last Contacted", "Next Follow Up", "Created At",
  ];

  const rows = leads.map((l) => [
    csvEscape(l.name),
    csvEscape(l.phone),
    csvEscape(l.email),
    csvEscape(l.companyName),
    csvEscape(l.city),
    csvEscape(l.state || ""),
    csvEscape(l.industry || ""),
    csvEscape(l.source),
    csvEscape(l.stage),
    l.value || 0,
    l.score || 0,
    csvEscape(l.notes || ""),
    csvEscape(l.assignedTo || ""),
    csvEscape(l.lastContactedAt || ""),
    csvEscape(l.nextFollowUpAt || ""),
    csvEscape(l.createdAt),
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="revastra-leads-${new Date().toISOString().split("T")[0]}.csv"`
  );
  res.send("\uFEFF" + csv); // BOM for Excel UTF-8 compatibility
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseCSVRow(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function csvEscape(value: string | number): string {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export default router;
