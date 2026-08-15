/**
 * server/routes/tasks.ts
 * ----------------------
 * CRM Task CRUD endpoints with Zod validation.
 *
 * Routes:
 *   GET    /api/crm/tasks
 *   POST   /api/crm/tasks
 *   PUT    /api/crm/tasks/:id
 *   DELETE /api/crm/tasks/:id
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

const TaskTypeEnum = z.enum(["call", "whatsapp", "site_visit", "quotation", "meeting", "other"]);
const TaskPriorityEnum = z.enum(["high", "medium", "low"]);
const TaskStatusEnum = z.enum(["pending", "completed", "overdue"]);

const CreateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(500),
  leadName: z.string().max(200).optional().default(""),
  leadPhone: z.string().max(25).optional().default(""),
  /** Optional link to a CRM lead ID */
  leadId: z.string().optional(),
  type: TaskTypeEnum.optional().default("other"),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "dueDate must be YYYY-MM-DD format"),
  dueTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "dueTime must be HH:MM format")
    .optional(),
  priority: TaskPriorityEnum.optional().default("medium"),
  status: TaskStatusEnum.optional().default("pending"),
  notes: z.string().max(2000).optional().default(""),
});

const UpdateTaskSchema = CreateTaskSchema.partial();

// ---------------------------------------------------------------------------
// GET /api/crm/tasks
// ---------------------------------------------------------------------------

router.get("/", (_req: Request, res: Response) => {
  const db = readDB();
  res.json(db.tasks || []);
});

// ---------------------------------------------------------------------------
// POST /api/crm/tasks
// ---------------------------------------------------------------------------

router.post("/", (req: Request, res: Response) => {
  const parsed = CreateTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const db = readDB();
  db.tasks = db.tasks || [];

  const newTask = {
    id: "t_" + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    ...parsed.data,
  };
  db.tasks.unshift(newTask);

  // Log activity if linked to a lead
  if (parsed.data.leadId) {
    db.activities = db.activities || [];
    db.activities.unshift(
      createActivity(
        parsed.data.leadId,
        "task_created",
        `Task created: "${parsed.data.title}"`,
        { taskId: newTask.id }
      )
    );
  }

  writeDB(db);
  res.status(201).json(newTask);
});

// ---------------------------------------------------------------------------
// PUT /api/crm/tasks/:id
// ---------------------------------------------------------------------------

router.put("/:id", (req: Request, res: Response) => {
  const parsed = UpdateTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const db = readDB();
  db.tasks = db.tasks || [];
  const index = db.tasks.findIndex((t: any) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  const previousStatus = db.tasks[index].status;
  db.tasks[index] = { ...db.tasks[index], ...parsed.data };

  // Log task completion activity if linked to a lead
  const task = db.tasks[index];
  if (
    parsed.data.status === "completed" &&
    previousStatus !== "completed" &&
    task.leadId
  ) {
    db.activities = db.activities || [];
    db.activities.unshift(
      createActivity(
        task.leadId,
        "task_completed",
        `Task completed: "${task.title}"`,
        { taskId: task.id }
      )
    );
  }

  writeDB(db);
  res.json(db.tasks[index]);
});

// ---------------------------------------------------------------------------
// DELETE /api/crm/tasks/:id
// ---------------------------------------------------------------------------

router.delete("/:id", (req: Request, res: Response) => {
  const db = readDB();
  db.tasks = db.tasks || [];
  const index = db.tasks.findIndex((t: any) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }
  const deleted = db.tasks.splice(index, 1)[0];
  writeDB(db);
  res.json({ success: true, deleted });
});

export default router;
