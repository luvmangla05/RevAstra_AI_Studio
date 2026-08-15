/**
 * server/routes/health.ts
 * -----------------------
 * Health check endpoint for production monitoring.
 *
 * GET /api/health
 *
 * Returns operational status information safe for public exposure.
 * NEVER returns API keys, passwords, tokens, or secret values.
 *
 * @license Apache-2.0
 */

import { Router } from "express";
import { config } from "../config/index.js";
import { readDB } from "../repositories/db.js";

const router = Router();

router.get("/", (_req, res) => {
  let databaseStatus = "available";
  try {
    readDB(); // Verify DB is readable
  } catch {
    databaseStatus = "error";
  }

  res.json({
    status: "ok",
    environment: config.nodeEnv,
    geminiConfigured: !!config.gemini.apiKey,
    textModel: config.gemini.textModel,
    liveModel: config.gemini.liveModel,
    database: databaseStatus,
    timestamp: new Date().toISOString(),
  });
});

export default router;
