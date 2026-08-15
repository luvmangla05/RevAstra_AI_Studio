/**
 * server/repositories/db.ts
 * -------------------------
 * JSON database repository for RevAstra.
 *
 * NOTE: This JSON-based persistence layer is TEMPORARY development infrastructure.
 * It is designed to be replaced by Supabase + PostgreSQL in Phase v0.4.
 * See MIGRATION.md for the migration path.
 *
 * Current limitations:
 * - No concurrent write safety (single-process only)
 * - No transaction support
 * - No query indexing — full scans on every read
 * - Not suitable for multi-tenant production at scale
 *
 * @license Apache-2.0
 */

import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const EXAMPLE_FILE = path.join(DATA_DIR, "db.example.json");

// ---------------------------------------------------------------------------
// Database State Interface
// ---------------------------------------------------------------------------

export interface DBState {
  users?: any[];
  leads: any[];
  tasks?: any[];
  quotations?: any[];
  assessments: any[];
  conversations: any[];
  projects: any[];
  quotes: any[];
  activities?: any[];  // Lead activity timeline
  reports?: any[];
  voiceSettings?: {
    voiceName: string;
    sessionLimitSeconds: number;
    costLimitDollars: number;
    systemInstruction: string;
  };
}

// ---------------------------------------------------------------------------
// Default database state
// ---------------------------------------------------------------------------

export const DEFAULT_STATE: DBState = {
  users: [],
  tasks: [
    {
      id: "t_demo1",
      title: "Follow up with Rajesh Singhania on WhatsApp Brochure",
      leadName: "Rajesh Singhania",
      leadPhone: "+91 98765 43210",
      type: "whatsapp",
      dueDate: new Date().toISOString().split("T")[0],
      dueTime: "11:00",
      priority: "high",
      status: "pending",
      notes: "Send the 3 BHK pricing sheet and video walkthrough.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "t_demo2",
      title: "Schedule Site Visit for Priya Sharma at Supreme Crest",
      leadName: "Priya Sharma",
      leadPhone: "+91 99112 23344",
      type: "site_visit",
      dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      dueTime: "15:00",
      priority: "high",
      status: "pending",
      notes: "Confirm cab pickup from Noida Sector 62.",
      createdAt: new Date().toISOString(),
    },
  ],
  quotations: [
    {
      id: "q_demo101",
      quotationNumber: "REV-2026-0042",
      clientName: "Rajesh Singhania",
      companyName: "Supreme Builders Ltd",
      clientEmail: "singhania.r@supremebuilders.in",
      clientPhone: "+91 98765 43210",
      clientAddress: "Plot 12, Tech Zone, Greater Noida, UP",
      clientGstin: "09AAACS1234F1Z1",
      items: [
        { id: "i1", description: "WhatsApp Business API Auto-Brochure Bot Setup", quantity: 1, unitPrice: 25000, total: 25000 },
        { id: "i2", description: "Meta Lead Form Instant Sync & Auto-Qualifier", quantity: 1, unitPrice: 15000, total: 15000 },
      ],
      subtotal: 40000,
      discountAmount: 5000,
      taxableAmount: 35000,
      gstRate: 18,
      cgstAmount: 3150,
      sgstAmount: 3150,
      igstAmount: 0,
      isInterstate: false,
      grandTotal: 41300,
      paymentTerms: "50% advance upon PO, 50% upon deployment.",
      status: "approved",
      validUntil: new Date(Date.now() + 86400000 * 15).toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    },
  ],
  leads: [
    {
      id: "l_demo1",
      name: "Rajesh Singhania",
      email: "singhania.r@supremebuilders.in",
      phone: "+91 98765 43210",
      companyName: "Supreme Builders",
      industry: "builders",
      stage: "site_visit_scheduled",
      source: "Chanakya Chatbot",
      createdAt: new Date().toISOString(),
      score: 85,
    },
    {
      id: "l_demo2",
      name: "Priya Sharma",
      email: "priya@apexestates.co",
      phone: "+91 99112 23344",
      companyName: "Apex Estates",
      industry: "real-estate",
      stage: "new",
      source: "Growth System Builder",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      score: 75,
    },
  ],
  activities: [],
  assessments: [],
  conversations: [],
  projects: [],
  quotes: [],
  reports: [],
  voiceSettings: {
    voiceName: "Zephyr",
    sessionLimitSeconds: 180,
    costLimitDollars: 0.2,
    systemInstruction:
      "You are Chanakya, RevAstra's AI RevOps consultant. Speak like an experienced Indian business consultant having a relaxed one-to-one conversation. Be warm, composed, concise and practical. Use short sentences and natural pauses. Avoid sounding scripted, theatrical, overexcited or robotic. Ask one useful question at a time.",
  },
};

// ---------------------------------------------------------------------------
// Core DB operations
// ---------------------------------------------------------------------------

/** Ensure the data directory and db.json file exist. */
export function initDB(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    if (fs.existsSync(EXAMPLE_FILE)) {
      fs.copyFileSync(EXAMPLE_FILE, DB_FILE);
      console.log("[DB] Initialized db.json from db.example.json");
    } else {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_STATE, null, 2));
      console.log("[DB] Initialized db.json from DEFAULT_STATE");
    }
  }
}

/** Read the database. Falls back to DEFAULT_STATE on corruption. */
export function readDB(): DBState {
  initDB();
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(data);
    // Ensure new collections exist even in older db files
    return {
      ...DEFAULT_STATE,
      ...parsed,
      activities: parsed.activities || [],
      reports: parsed.reports || [],
    };
  } catch (err) {
    console.error("[DB] Error reading database file — returning DEFAULT_STATE:", err);
    return { ...DEFAULT_STATE };
  }
}

/** Write the database. */
export function writeDB(state: DBState): void {
  initDB();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2));
  } catch (err) {
    console.error("[DB] Error writing database file:", err);
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Lead normalization
// ---------------------------------------------------------------------------

const LEGACY_STAGE_MAP: Record<string, string> = {
  new: "new",
  contacted: "contacted",
  qualified: "site_visit_scheduled",
  proposal_sent: "quotation_sent",
  won: "closed_won",
  lost: "closed_lost",
};

/** Normalize a raw lead object to the canonical CRMLead structure. */
export function normalizeLead(item: any): any {
  if (!item) return item;
  const companyName = item.companyName || item.company || "";
  const stage = item.stage || LEGACY_STAGE_MAP[item.status] || "new";

  return {
    id: item.id || `l_${Math.random().toString(36).substring(2, 9)}`,
    name: item.name || "",
    phone: item.phone || "",
    email: item.email || "",
    companyName,
    company: companyName, // backward-compat alias
    city: item.city || "",
    state: item.state,
    industry: item.industry,
    source: item.source || "Direct Lead",
    stage,
    status: stage, // backward-compat alias
    value: typeof item.value === "number" ? item.value : 0,
    score: typeof item.score === "number" ? item.score : 0,
    notes: item.notes || "",
    assignedTo: item.assignedTo,
    lastContactedAt: item.lastContactedAt,
    nextFollowUpAt: item.nextFollowUpAt,
    createdAt: item.createdAt || new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Activity helpers
// ---------------------------------------------------------------------------

export function createActivity(
  leadId: string,
  type: string,
  description: string,
  metadata?: Record<string, unknown>
): any {
  return {
    id: `act_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
    leadId,
    type,
    description,
    createdAt: new Date().toISOString(),
    ...(metadata ? { metadata } : {}),
  };
}
