/**
 * server/config/index.ts
 * ----------------------
 * Central configuration module for RevAstra Server.
 *
 * All environment variables are read here with safe defaults.
 * This module is the ONLY place that reads process.env in the server.
 *
 * NEVER import this in frontend/client code.
 * NEVER expose config.gemini.apiKey to any HTTP response.
 *
 * @license Apache-2.0
 */

import dotenv from "dotenv";
dotenv.config();

export const config = {
  /** HTTP port — use PORT env var in production hosting */
  port: Number(process.env.PORT || 3000),

  /** Runtime environment */
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",

  /** Application public URL */
  appUrl: process.env.APP_URL || "http://localhost:3000",

  /** Gemini AI configuration — NEVER expose apiKey to client */
  gemini: {
    /** Secret API key — server-side only */
    apiKey: process.env.GEMINI_API_KEY,

    /** Model for standard Chanakya chat and general text completions */
    textModel: process.env.GEMINI_TEXT_MODEL || "gemini-2.5-flash",

    /** Model for deep thinking mode (higher quality, slower) */
    thinkingModel: process.env.GEMINI_THINKING_MODEL || "gemini-2.5-pro",

    /** Model for assessment and structured report generation */
    assessmentModel: process.env.GEMINI_ASSESSMENT_MODEL || "gemini-2.5-flash",

    /** Model for Chanakya Live voice sessions */
    liveModel: process.env.GEMINI_LIVE_MODEL || "gemini-2.0-flash-exp",

    /** Maximum retry attempts for transient API failures */
    maxRetries: Number(process.env.MAX_RETRIES || 3),
  },

  /** Usage limits */
  limits: {
    maxAnonymousMessages: Number(process.env.MAX_ANONYMOUS_MESSAGES || 15),
    maxVoiceMinutes: Number(process.env.MAX_VOICE_MINUTES || 5),
  },

  /** Developer mock mode — simulates AI responses without API calls */
  mockMode: process.env.VITE_AI_MOCK_MODE === "true",
} as const;

/**
 * Returns a safe, client-exposable subset of config.
 * Never includes apiKey or secrets.
 */
export function getSafeConfig() {
  return {
    environment: config.nodeEnv,
    geminiConfigured: !!config.gemini.apiKey,
    textModel: config.gemini.textModel,
    liveModel: config.gemini.liveModel,
    mockMode: config.mockMode,
  };
}
