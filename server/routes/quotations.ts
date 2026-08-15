/**
 * server/routes/quotations.ts
 * ---------------------------
 * CRM Quotation CRUD endpoints with Zod validation.
 *
 * Routes:
 *   GET    /api/crm/quotations
 *   POST   /api/crm/quotations
 *   PUT    /api/crm/quotations/:id
 *   DELETE /api/crm/quotations/:id
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

const QuotationItemSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1).max(500),
  hsnSacCode: z.string().max(20).optional(),
  quantity: z.number().min(0),
  unitPrice: z.number().min(0),
  total: z.number().min(0),
});

const QuotationStatusEnum = z.enum([
  "draft",
  "pending_owner_approval",
  "approved",
  "sent_to_client",
  "accepted",
  "rejected",
]);

const CreateQuotationSchema = z.object({
  clientName: z.string().min(1, "Client name is required").max(200),
  companyName: z.string().max(200).optional().default(""),
  clientEmail: z.union([z.string().email(), z.literal("")]).optional().default(""),
  clientPhone: z.string().max(25).optional().default(""),
  clientAddress: z.string().max(500).optional().default(""),
  clientGstin: z.string().max(20).optional().default(""),
  /** Optional link to a CRM lead */
  leadId: z.string().optional(),
  items: z.array(QuotationItemSchema).min(1, "At least one item is required"),
  subtotal: z.number().min(0),
  discountAmount: z.number().min(0).optional().default(0),
  taxableAmount: z.number().min(0),
  gstRate: z.number().min(0).max(28).optional().default(18),
  cgstAmount: z.number().min(0).optional().default(0),
  sgstAmount: z.number().min(0).optional().default(0),
  igstAmount: z.number().min(0).optional().default(0),
  isInterstate: z.boolean().optional().default(false),
  grandTotal: z.number().min(0),
  paymentTerms: z.string().max(500).optional().default(""),
  status: QuotationStatusEnum.optional().default("draft"),
  validUntil: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "validUntil must be YYYY-MM-DD")
    .optional(),
}).refine(
  (data) => {
    // Validate grand total matches taxable amount + GST roughly
    const expectedGst = data.isInterstate ? data.igstAmount || 0 : (data.cgstAmount || 0) + (data.sgstAmount || 0);
    const expectedTotal = data.taxableAmount + expectedGst;
    // Allow ±5 INR tolerance for rounding
    return Math.abs(data.grandTotal - expectedTotal) <= 5;
  },
  {
    message: "Grand total does not match taxable amount + GST. Please verify calculations.",
    path: ["grandTotal"],
  }
);

const UpdateQuotationSchema = CreateQuotationSchema.partial().omit({ items: true }).extend({
  items: z.array(QuotationItemSchema).optional(),
}).innerType ? CreateQuotationSchema.partial() : CreateQuotationSchema.partial();

// ---------------------------------------------------------------------------
// GET /api/crm/quotations
// ---------------------------------------------------------------------------

router.get("/", (_req: Request, res: Response) => {
  const db = readDB();
  res.json(db.quotations || []);
});

// ---------------------------------------------------------------------------
// POST /api/crm/quotations
// ---------------------------------------------------------------------------

router.post("/", (req: Request, res: Response) => {
  const parsed = CreateQuotationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const db = readDB();
  db.quotations = db.quotations || [];

  const newQuotation = {
    id: "q_" + Math.random().toString(36).substr(2, 9),
    quotationNumber: `REV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    ...parsed.data,
  };

  db.quotations.unshift(newQuotation);

  // Log activity if linked to a lead
  if (parsed.data.leadId) {
    db.activities = db.activities || [];
    db.activities.unshift(
      createActivity(
        parsed.data.leadId,
        "quotation_created",
        `Quotation ${newQuotation.quotationNumber} created for ${parsed.data.clientName}`,
        { quotationId: newQuotation.id }
      )
    );
  }

  writeDB(db);
  res.status(201).json(newQuotation);
});

// ---------------------------------------------------------------------------
// PUT /api/crm/quotations/:id
// ---------------------------------------------------------------------------

router.put("/:id", (req: Request, res: Response) => {
  // Partial update — skip the grand total refine for partial updates
  const PartialUpdate = z.object({
    clientName: z.string().min(1).max(200).optional(),
    companyName: z.string().max(200).optional(),
    clientEmail: z.union([z.string().email(), z.literal("")]).optional(),
    clientPhone: z.string().max(25).optional(),
    clientAddress: z.string().max(500).optional(),
    clientGstin: z.string().max(20).optional(),
    leadId: z.string().optional(),
    items: z.array(QuotationItemSchema).optional(),
    subtotal: z.number().min(0).optional(),
    discountAmount: z.number().min(0).optional(),
    taxableAmount: z.number().min(0).optional(),
    gstRate: z.number().min(0).max(28).optional(),
    cgstAmount: z.number().min(0).optional(),
    sgstAmount: z.number().min(0).optional(),
    igstAmount: z.number().min(0).optional(),
    isInterstate: z.boolean().optional(),
    grandTotal: z.number().min(0).optional(),
    paymentTerms: z.string().max(500).optional(),
    status: QuotationStatusEnum.optional(),
    validUntil: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  });

  const parsed = PartialUpdate.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const db = readDB();
  db.quotations = db.quotations || [];
  const index = db.quotations.findIndex((q: any) => q.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Quotation not found" });
  }

  const previous = db.quotations[index];
  db.quotations[index] = { ...previous, ...parsed.data };

  // Log "sent" activity if status changed to sent_to_client
  const leadId = parsed.data.leadId || previous.leadId;
  if (
    parsed.data.status === "sent_to_client" &&
    previous.status !== "sent_to_client" &&
    leadId
  ) {
    db.activities = db.activities || [];
    db.activities.unshift(
      createActivity(
        leadId,
        "quotation_sent",
        `Quotation ${previous.quotationNumber} sent to client`,
        { quotationId: previous.id }
      )
    );
  }

  writeDB(db);
  res.json(db.quotations[index]);
});

// ---------------------------------------------------------------------------
// DELETE /api/crm/quotations/:id
// ---------------------------------------------------------------------------

router.delete("/:id", (req: Request, res: Response) => {
  const db = readDB();
  db.quotations = db.quotations || [];
  const index = db.quotations.findIndex((q: any) => q.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Quotation not found" });
  }
  const deleted = db.quotations.splice(index, 1)[0];
  writeDB(db);
  res.json({ success: true, deleted });
});

export default router;
