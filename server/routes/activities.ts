/**
 * server/routes/activities.ts
 * ---------------------------
 * Lead Activity Timeline endpoints.
 *
 * Routes:
 *   GET  /api/crm/activities/:leadId   — Activities for a specific lead
 *   POST /api/crm/activities           — Create a manual activity (e.g. note, contact attempt)
 *
 * Activity types:
 *   lead_created | note_added | stage_changed | task_created | task_completed
 *   quotation_created | quotation_sent | contact_attempted
 *
 * Design note:
 *   This structure is designed for easy migration to PostgreSQL.
 *   Each activity has: id, leadId, type, description, createdAt, metadata?
 *
 * @license Apache-2.0
 */

import { Router, Request, Response } from "express";
import { z } from "zod";
import { readDB, writeDB, createActivity } from "../repositories/db.js";

const router = Router();

// ---------------------------------------------------------------------------
// Zod Schemas
// ---------------------------------------------------------------------------

const ActivityTypeEnum = z.enum([
  "lead_created",
  "note_added",
  "stage_changed",
  "task_created",
  "task_completed",
  "quotation_created",
  "quotation_sent",
  "contact_attempted",
]);

const CreateActivitySchema = z.object({
  leadId: z.string().min(1, "leadId is required"),
  type: ActivityTypeEnum,
  description: z.string().min(1).max(1000),
  metadata: z.record(z.unknown()).optional(),
});

// ---------------------------------------------------------------------------
// GET /api/crm/activities/:leadId
// ---------------------------------------------------------------------------

router.get("/:leadId", (req: Request, res: Response) => {
  const db = readDB();
  const activities = (db.activities || []).filter(
    (a: any) => a.leadId === req.params.leadId
  );
  // Sort newest first
  activities.sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  res.json(activities);
});

// ---------------------------------------------------------------------------
// POST /api/crm/activities
// ---------------------------------------------------------------------------

router.post("/", (req: Request, res: Response) => {
  const parsed = CreateActivitySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const db = readDB();

  // Verify the lead exists
  const leadExists = (db.leads || []).some((l: any) => l.id === parsed.data.leadId);
  if (!leadExists) {
    return res.status(404).json({ error: "Lead not found" });
  }

  const activity = createActivity(
    parsed.data.leadId,
    parsed.data.type,
    parsed.data.description,
    parsed.data.metadata as Record<string, unknown> | undefined
  );

  db.activities = db.activities || [];
  db.activities.unshift(activity);
  writeDB(db);

  res.status(201).json(activity);
});

export default router;
