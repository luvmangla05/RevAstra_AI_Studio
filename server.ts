// server.ts 
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { z } from "zod";
import http from "http";
import { WebSocketServer } from "ws";

dotenv.config();

const __filename = typeof import.meta?.url === "string" ? fileURLToPath(import.meta.url) : "";
const __dirname = __filename ? path.dirname(__filename) : "";

const app = express();
const PORT = 3000;

// Set up server-side storage
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

interface DBState {
  users?: any[];
  leads: any[];
  tasks?: any[];
  quotations?: any[];
  assessments: any[];
  conversations: any[];
  projects: any[];
  quotes: any[];
  voiceSettings?: {
    voiceName: string;
    sessionLimitSeconds: number;
    costLimitDollars: number;
    systemInstruction: string;
  };
}

const DEFAULT_STATE: DBState = {
  users: [],
  tasks: [
    {
      id: "t_demo1",
      title: "Follow up with Rajesh Singhania on WhatsApp Brochure",
      leadName: "Rajesh Singhania",
      leadPhone: "+91 98765 43210",
      type: "whatsapp",
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: "11:00",
      priority: "high",
      status: "pending",
      notes: "Send the 3 BHK pricing sheet and video walkthrough.",
      createdAt: new Date().toISOString()
    },
    {
      id: "t_demo2",
      title: "Schedule Site Visit for Priya Sharma at Supreme Crest",
      leadName: "Priya Sharma",
      leadPhone: "+91 99112 23344",
      type: "site_visit",
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      dueTime: "15:00",
      priority: "high",
      status: "pending",
      notes: "Confirm cab pickup from Noida Sector 62.",
      createdAt: new Date().toISOString()
    }
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
        { id: "i2", description: "Meta Lead Form Instant Sync & Auto-Qualifier", quantity: 1, unitPrice: 15000, total: 15000 }
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
      validUntil: new Date(Date.now() + 86400000 * 15).toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    }
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
      score: 85
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
      score: 75
    }
  ],
  assessments: [
    {
      id: "a_demo1",
      contactName: "Priya Sharma",
      email: "priya@apexestates.co",
      phone: "+91 99112 23344",
      companyName: "Apex Estates",
      industry: "real-estate",
      marketCountry: "India",
      locationsCount: 3,
      monthlyEnquiries: "100-500",
      leadSources: ["Meta Ads", "Property Portals"],
      servicesNeeded: ["Creative Production", "AI Automation", "CRM Setup"],
      biggestProblem: "Delayed lead response and manual listing matching",
      trackingMethod: "Google Sheets",
      responseSpeed: "Within 2-4 hours",
      followUpConsistency: "Inconsistent, done manually",
      desiredOutcomes: ["Instant auto-response", "Viewing booking links"],
      existingTools: ["Excel", "WhatsApp Web"],
      teamSize: 12,
      urgency: "Immediate (Next 14 days)",
      budgetRange: "₹50,000 - ₹1,50,000",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      scores: {
        creative: 40,
        marketing: 50,
        leadCapture: 30,
        salesProcess: 25,
        automation: 15,
        leakRisk: 85,
        complexity: 60
      },
      recommendedPackage: "arjuna"
    }
  ],
  conversations: [
    {
      id: "c_demo1",
      visitorName: "Rajesh Singhania",
      visitorEmail: "singhania.r@supremebuilders.in",
      visitorPhone: "+91 98765 43210",
      industry: "builders",
      messages: [
        { id: "1", sender: "chanakya", text: "Namaste, I’m Chanakya—RevAstra’s AI RevOps consultant. What are you trying to improve: lead generation, content, follow-up, appointments, sales visibility or automation?", timestamp: new Date(Date.now() - 600000).toISOString() },
        { id: "2", sender: "user", text: "We are a builder in Noida. We get many leads on Meta but our team takes hours to share the brochure and leads complain.", timestamp: new Date(Date.now() - 500000).toISOString() },
        { id: "3", sender: "chanakya", text: "I understand. For Noida builders, speed is money. When brochure sharing is delayed, buyers buy elsewhere. What is your average response time, and how do you distribute brochures currently?", timestamp: new Date(Date.now() - 400000).toISOString() },
        { id: "4", sender: "user", text: "It takes 2 to 3 hours because agents do it manually via WhatsApp.", timestamp: new Date(Date.now() - 300000).toISOString() },
        { id: "5", sender: "chanakya", text: "A delay of 2-3 hours decreases booking conversions by up to 80%. If we implement our instant automated WhatsApp brochure delivery system, you can respond in 5 seconds. Rajesh, let's schedule a strategy call to deploy this.", timestamp: new Date(Date.now() - 200000).toISOString() }
      ],
      lastActive: new Date().toISOString(),
      score: 85,
      isEscalated: true,
      notes: "High intent builder. Complains of manual brochure delays."
    }
  ],
  projects: [
    {
      id: "p_demo1",
      clientName: "Supreme Builders",
      projectName: "The Sovereign Crest",
      industry: "builders",
      status: "production",
      creativeProgress: 60,
      marketingProgress: 30,
      automationProgress: 10,
      deliverables: [
        { name: "Drone Video Shoot & Aerial Footage", type: "video", status: "ready_for_review", url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80" },
        { name: "3 BHK Concept Reel edits", type: "video", status: "approved" },
        { name: "Project Lead Capture Landing Page", type: "landing_page", status: "in_progress" },
        { name: "WhatsApp Brochure Bot Setup", type: "agent", status: "pending" }
      ],
      createdAt: new Date().toISOString()
    }
  ],
  quotes: [
    {
      id: "q_demo1",
      name: "Rajesh Singhania",
      email: "singhania.r@supremebuilders.in",
      phone: "+91 98765 43210",
      company: "Supreme Builders",
      selectedPackage: "arjuna",
      status: "pending",
      createdAt: new Date().toISOString()
    }
  ],
  voiceSettings: {
    voiceName: "Zephyr",
    sessionLimitSeconds: 180,
    costLimitDollars: 0.20,
    systemInstruction: "You are Chanakya, RevAstra’s AI RevOps consultant. Speak like an experienced Indian business consultant having a relaxed one-to-one conversation. Be warm, composed, concise and practical. Use short sentences and natural pauses. Avoid sounding scripted, theatrical, overexcited or robotic. Ask one useful question at a time."
  }
};

// Ensure db directory and file exist
function initDB() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const EXAMPLE_FILE = path.join(DATA_DIR, "db.example.json");
    if (fs.existsSync(EXAMPLE_FILE)) {
      fs.copyFileSync(EXAMPLE_FILE, DB_FILE);
    } else {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_STATE, null, 2));
    }
  }
}


function readDB(): DBState {
  initDB();
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database file, resetting to default state", err);
    return DEFAULT_STATE;
  }
}

function writeDB(state: DBState) {
  initDB();
  fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2));
}

// Initialize database
initDB();

app.use(express.json());

// Initialize Gemini client on server-side dynamically on demand
let aiInstance: any = null;
let ai: any = null;

async function getGeminiClient() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined in the environment. Falling back to deterministic responses.");
      return null;
    }
    try {
      console.log("Dynamically loading @google/genai SDK on user request...");
      const { GoogleGenAI } = await import("@google/genai");
      aiInstance = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      ai = aiInstance;
      console.log("Gemini API Client dynamically initialized successfully.");
    } catch (e) {
      console.warn("Failed to dynamically initialize Gemini Client: ", e);
    }
  }
  return aiInstance;
}


// REST DATABASE ENDPOINTS

// AUTHENTICATION ENDPOINTS
app.post("/api/auth/register", (req, res) => {
  const db = readDB();
  const { email, password, name } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  db.users = db.users || [];
  const existing = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: "An account with this email already exists" });
  }

  const newUser = {
    id: "usr_" + Math.random().toString(36).substring(2, 9),
    email,
    name: name || email.split('@')[0],
    isVerified: true,
    plan: "shunya",
    onboardingCompleted: false,
    usage: {
      chanakyaQueriesUsed: 0,
      conversationAnalysesUsed: 0,
      leadsAdded: 0,
      quotationsCreated: 0,
      researchedLeadsUsed: 0
    },
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDB(db);

  const token = "tok_" + Math.random().toString(36).substring(2, 15);
  res.status(201).json({ user: newUser, token });
});

app.post("/api/auth/login", (req, res) => {
  const db = readDB();
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  db.users = db.users || [];
  let user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    // Auto register for seamless access or fallback
    user = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      email,
      name: email.split('@')[0],
      isVerified: true,
      plan: "shunya",
      onboardingCompleted: false,
      usage: {
        chanakyaQueriesUsed: 0,
        conversationAnalysesUsed: 0,
        leadsAdded: 0,
        quotationsCreated: 0,
        researchedLeadsUsed: 0
      },
      createdAt: new Date().toISOString()
    };
    db.users.push(user);
    writeDB(db);
  }

  const token = "tok_" + Math.random().toString(36).substring(2, 15);
  res.json({ user, token });
});

app.post("/api/user/profile", (req, res) => {
  const db = readDB();
  const { onboardingData, email } = req.body;
  db.users = db.users || [];
  if (email && db.users.length > 0) {
    const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      user.onboardingCompleted = true;
      user.onboardingData = onboardingData;
      user.businessName = onboardingData.businessName || user.businessName;
    }
  }
  writeDB(db);
  res.json({ success: true, onboardingData });
});

app.post("/api/user/billing", (req, res) => {
  const db = readDB();
  const { plan, email } = req.body;
  db.users = db.users || [];
  if (email && db.users.length > 0) {
    const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      user.plan = plan;
    }
  }
  writeDB(db);
  res.json({ success: true, plan });
});

// Tasks Endpoints
app.get("/api/crm/tasks", (req, res) => {
  const db = readDB();
  res.json(db.tasks || []);
});

app.post("/api/crm/tasks", (req, res) => {
  const db = readDB();
  db.tasks = db.tasks || [];
  const newTask = {
    id: "t_" + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    status: "pending",
    ...req.body
  };
  db.tasks.unshift(newTask);
  writeDB(db);
  res.status(201).json(newTask);
});

app.put("/api/crm/tasks/:id", (req, res) => {
  const db = readDB();
  db.tasks = db.tasks || [];
  const index = db.tasks.findIndex((t: any) => t.id === req.params.id);
  if (index !== -1) {
    db.tasks[index] = { ...db.tasks[index], ...req.body };
    writeDB(db);
    res.json(db.tasks[index]);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

app.delete("/api/crm/tasks/:id", (req, res) => {
  const db = readDB();
  db.tasks = db.tasks || [];
  const index = db.tasks.findIndex((t: any) => t.id === req.params.id);
  if (index !== -1) {
    const deleted = db.tasks.splice(index, 1)[0];
    writeDB(db);
    res.json({ success: true, deleted });
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

// Quotations Endpoints
app.get("/api/crm/quotations", (req, res) => {
  const db = readDB();
  res.json(db.quotations || []);
});

app.post("/api/crm/quotations", (req, res) => {
  const db = readDB();
  db.quotations = db.quotations || [];
  const newQuotation = {
    id: "q_" + Math.random().toString(36).substr(2, 9),
    quotationNumber: `REV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    status: "draft",
    ...req.body
  };
  db.quotations.unshift(newQuotation);
  writeDB(db);
  res.status(201).json(newQuotation);
});

app.put("/api/crm/quotations/:id", (req, res) => {
  const db = readDB();
  db.quotations = db.quotations || [];
  const index = db.quotations.findIndex((q: any) => q.id === req.params.id);
  if (index !== -1) {
    db.quotations[index] = { ...db.quotations[index], ...req.body };
    writeDB(db);
    res.json(db.quotations[index]);
  } else {
    res.status(404).json({ error: "Quotation not found" });
  }
});

app.delete("/api/crm/quotations/:id", (req, res) => {
  const db = readDB();
  db.quotations = db.quotations || [];
  const index = db.quotations.findIndex((q: any) => q.id === req.params.id);
  if (index !== -1) {
    const deleted = db.quotations.splice(index, 1)[0];
    writeDB(db);
    res.json({ success: true, deleted });
  } else {
    res.status(404).json({ error: "Quotation not found" });
  }
});

// Helper to normalize lead objects to CRMLead structure cleanly
function normalizeLead(item: any): any {
  if (!item) return item;
  const legacyStatusToStage: Record<string, string> = {
    new: 'new',
    contacted: 'contacted',
    qualified: 'site_visit_scheduled',
    proposal_sent: 'quotation_sent',
    won: 'closed_won',
    lost: 'closed_lost'
  };

  const companyName = item.companyName || item.company || '';
  const stage = item.stage || legacyStatusToStage[item.status] || 'new';

  return {
    id: item.id || `l_${Math.random().toString(36).substring(2, 9)}`,
    name: item.name || '',
    phone: item.phone || '',
    email: item.email || '',
    companyName: companyName,
    company: companyName, // Backward-compatibility alias
    city: item.city || '',
    state: item.state,
    industry: item.industry,
    source: item.source || 'Direct Lead',
    stage: stage,
    status: stage, // Backward-compatibility alias
    value: typeof item.value === 'number' ? item.value : 0,
    score: typeof item.score === 'number' ? item.score : 0,
    notes: item.notes || '',
    assignedTo: item.assignedTo,
    lastContactedAt: item.lastContactedAt,
    nextFollowUpAt: item.nextFollowUpAt,
    createdAt: item.createdAt || new Date().toISOString()
  };
}

// Leads Endpoints
app.get("/api/db/leads", (req, res) => {
  const db = readDB();
  const normalizedLeads = (db.leads || []).map(normalizeLead);
  res.json(normalizedLeads);
});

app.post("/api/db/leads", (req, res) => {
  const db = readDB();
  const normalized = normalizeLead({
    id: req.body.id || "l_" + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    ...req.body
  });
  db.leads.unshift(normalized);
  writeDB(db);
  res.status(201).json(normalized);
});

app.put("/api/db/leads/:id", (req, res) => {
  const db = readDB();
  const index = db.leads.findIndex(l => l.id === req.params.id);
  if (index !== -1) {
    const updated = normalizeLead({
      ...db.leads[index],
      ...req.body
    });
    db.leads[index] = updated;
    writeDB(db);
    res.json(updated);
  } else {
    res.status(404).json({ error: "Lead not found" });
  }
});

app.delete("/api/db/leads/:id", (req, res) => {
  const db = readDB();
  db.leads = db.leads || [];
  const index = db.leads.findIndex(l => l.id === req.params.id);
  if (index !== -1) {
    const deleted = db.leads.splice(index, 1)[0];
    writeDB(db);
    res.json({ success: true, deleted });
  } else {
    res.status(404).json({ error: "Lead not found" });
  }
});


// Assessments Endpoints
app.get("/api/db/assessments", (req, res) => {
  const db = readDB();
  res.json(db.assessments);
});

app.get("/api/db/assessments/:id", (req, res) => {
  const db = readDB();
  const assessment = db.assessments.find(a => a.id === req.params.id);
  if (assessment) {
    res.json(assessment);
  } else {
    res.status(404).json({ error: "Assessment not found" });
  }
});

app.post("/api/db/assessments", async (req, res) => {
  const db = readDB();
  const assessmentData = req.body;
  const assessmentId = "a_" + Math.random().toString(36).substr(2, 9);
  
  // Calculate deterministic diagnostic scores
  const scoreBase = {
    creative: 45,
    marketing: 40,
    leadCapture: 35,
    salesProcess: 30,
    automation: 10,
    leakRisk: 70,
    complexity: 50
  };

  // Adjust scores based on inputs
  if (assessmentData.creativeFeedback === 'needs_overhaul' || assessmentData.leadSources?.length === 0) {
    scoreBase.creative -= 15;
    scoreBase.leakRisk += 10;
  }
  if (assessmentData.responseSpeed === 'instantly' || assessmentData.responseSpeed?.includes("5 seconds")) {
    scoreBase.leadCapture += 35;
    scoreBase.leakRisk -= 25;
    scoreBase.automation += 25;
  } else if (assessmentData.responseSpeed?.includes("hours") || assessmentData.responseSpeed === 'delayed') {
    scoreBase.leadCapture -= 10;
    scoreBase.leakRisk += 15;
  }
  if (assessmentData.followUpConsistency === 'automated' || assessmentData.followUpConsistency?.includes("automated")) {
    scoreBase.salesProcess += 30;
    scoreBase.automation += 35;
    scoreBase.leakRisk -= 25;
  } else if (assessmentData.followUpConsistency === 'none' || assessmentData.followUpConsistency?.includes("manual")) {
    scoreBase.leakRisk += 15;
  }

  // Bound scores between 10 and 95
  const scores = {
    creative: Math.max(15, Math.min(95, scoreBase.creative)),
    marketing: Math.max(15, Math.min(95, scoreBase.marketing)),
    leadCapture: Math.max(15, Math.min(95, scoreBase.leadCapture)),
    salesProcess: Math.max(15, Math.min(95, scoreBase.salesProcess)),
    automation: Math.max(10, Math.min(95, scoreBase.automation)),
    leakRisk: Math.max(15, Math.min(95, scoreBase.leakRisk)),
    complexity: Math.max(20, Math.min(95, scoreBase.complexity))
  };

  // Package recommendation
  let recPackage = "saarthi";
  if (scores.leakRisk > 65 || scores.complexity > 60) {
    recPackage = "arjuna";
  }
  if (assessmentData.servicesNeeded?.includes("AI website agents") || assessmentData.servicesNeeded?.includes("WhatsApp bots") || assessmentData.servicesNeeded?.includes("AI & WhatsApp Automation")) {
    recPackage = "astra";
  }
  if (assessmentData.teamSize > 25 || assessmentData.locationsCount > 4) {
    recPackage = "brahmastra";
  }

  // Calculate deterministic maturity levels as requested by user
  const maturityLevels = {
    creativeReadiness: (assessmentData.servicesNeeded?.includes("Creative Production") || assessmentData.servicesNeeded?.includes("Cinematic Photos")) ? "Needs Attention" : "Developing",
    marketingReadiness: (assessmentData.leadSources && assessmentData.leadSources.length > 0) ? "Developing" : "Needs Attention",
    leadManagementMaturity: assessmentData.trackingMethod === "Spreadsheets" || assessmentData.trackingMethod === "Google Sheets" || assessmentData.trackingMethod === "Excel" ? "Developing" : (assessmentData.trackingMethod === "CRM" ? "High" : "Needs Attention"),
    followUpMaturity: (assessmentData.followUpConsistency?.toLowerCase().includes("automated") || assessmentData.followUpConsistency?.toLowerCase().includes("active")) ? "High" : (assessmentData.followUpConsistency?.toLowerCase().includes("manual") ? "Developing" : "Needs Attention"),
    automationReadiness: (assessmentData.servicesNeeded?.includes("AI website agents") || assessmentData.servicesNeeded?.includes("WhatsApp bots") || assessmentData.servicesNeeded?.includes("AI & WhatsApp Automation")) ? "High" : "Developing",
    reportingMaturity: assessmentData.trackingMethod === "CRM" ? "High" : "Needs Attention",
    operationalComplexity: (assessmentData.locationsCount > 3 || assessmentData.teamSize > 15) ? "High" : "Medium",
    urgency: assessmentData.urgency?.toLowerCase().includes("immediate") ? "High" : "Medium",
    recommendedPackage: recPackage === "saarthi" ? "Saarthi — Growth Foundation" : (recPackage === "arjuna" ? "Arjuna — Growth Accelerator" : (recPackage === "astra" ? "Astra — AI Growth Operating System" : "Brahmastra — Enterprise Custom System"))
  };

  let analysisText = "";

  // Schema to validate Gemini output using Zod
  const ChanakyaResponseSchema = z.object({
    analysisText: z.string().min(50)
  });

  // Call Gemini API server-side to generate a polished, personalized Strategic Explanation
  if (ai) {
    try {
      const prompt = `
        Act as Chanakya, RevAstra's senior AI Growth Strategist.
        You are analyzing the business metrics of "${assessmentData.companyName}" (${assessmentData.industry}).
        
        Computed Readiness Matrix (You MUST use these levels directly, do NOT invent or change them):
        - Creative Readiness: ${maturityLevels.creativeReadiness}
        - Marketing Campaigns Readiness: ${maturityLevels.marketingReadiness}
        - Lead-Management Maturity: ${maturityLevels.leadManagementMaturity}
        - Follow-Up Maturity: ${maturityLevels.followUpMaturity}
        - Automation Readiness: ${maturityLevels.automationReadiness}
        - Reporting Maturity: ${maturityLevels.reportingMaturity}
        - Operational Complexity: ${maturityLevels.operationalComplexity}
        - Urgency: ${maturityLevels.urgency}
        - Recommended starting system: ${maturityLevels.recommendedPackage}

        Write a professional, consultative strategic growth analysis based strictly on these computed parameters.
        Focus on how the RevAstra connected systems help prioritize leads using fit and intent signals, support faster first response, and improve follow-up consistency.
        Speak with the tone of an experienced Indian business advisor who is direct, wise, composed, and helpful.
        Avoid weapon terminology, mythological warfare, or exaggerated claims (e.g., do not mention "99% accuracy", "83% higher booking", "100% visibility", or "guaranteed conversions").
        
        You MUST output a valid JSON object matching this schema:
        {
          "analysisText": "Your strategic growth analysis paragraph goes here."
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are Chanakya, a senior business consultant. You deliver professional, structured strategic advice in JSON format.",
        }
      });

      const responseText = response.text || "{}";
      const parsedJSON = JSON.parse(responseText);
      
      // Validate using Zod
      const validated = ChanakyaResponseSchema.parse(parsedJSON);
      analysisText = validated.analysisText;
    } catch (err) {
      console.warn("Gemini assessment explanation failed or failed Zod validation. Using fallback. Error:", err);
    }
  }

  if (!analysisText) {
    analysisText = `Strategic Growth Diagnosis for ${assessmentData.companyName}: Based on your assessed parameters, we have formulated a structured system recommendation to address current pipeline gaps. 

With a computed Follow-Up Maturity of "${maturityLevels.followUpMaturity}" and Lead-Management Maturity of "${maturityLevels.leadManagementMaturity}", establishing automated lead-handling systems is highly recommended. The proposed ${maturityLevels.recommendedPackage} will help prioritize leads using fit and intent signals, support faster first response, and significantly improve follow-up consistency. This setup establishes clearer pipeline visibility, helps organize lead ownership, and coordinates appointments or site-visits with professional precision.`;
  }

  const newAssessment = {
    id: assessmentId,
    ...assessmentData,
    createdAt: new Date().toISOString(),
    scores,
    maturityLevels,
    recommendedPackage: recPackage,
    analysisText
  };

  db.assessments.unshift(newAssessment);
  
  // Also create a living lead automatically from this assessment submission!
  const newLead = normalizeLead({
    id: "l_" + Math.random().toString(36).substr(2, 9),
    name: assessmentData.contactName,
    email: assessmentData.email,
    phone: assessmentData.phone,
    companyName: assessmentData.companyName,
    industry: assessmentData.industry || 'other',
    stage: "new",
    source: "Growth System Builder",
    createdAt: new Date().toISOString(),
    score: Math.round((100 - scores.leakRisk + scores.creative) / 2)
  });
  db.leads.unshift(newLead);

  writeDB(db);
  res.status(201).json(newAssessment);
});

// Chanakya Conversations Endpoints
app.get("/api/db/conversations", (req, res) => {
  const db = readDB();
  res.json(db.conversations);
});

app.get("/api/db/conversations/:id", (req, res) => {
  const db = readDB();
  const conv = db.conversations.find(c => c.id === req.params.id);
  if (conv) {
    res.json(conv);
  } else {
    res.status(404).json({ error: "Conversation not found" });
  }
});

app.post("/api/db/conversations", (req, res) => {
  const db = readDB();
  const newConv = {
    id: "c_" + Math.random().toString(36).substr(2, 9),
    messages: [],
    lastActive: new Date().toISOString(),
    isEscalated: false,
    ...req.body
  };
  db.conversations.unshift(newConv);
  writeDB(db);
  res.status(201).json(newConv);
});

app.put("/api/db/conversations/:id", (req, res) => {
  const db = readDB();
  const index = db.conversations.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    db.conversations[index] = { ...db.conversations[index], ...req.body, lastActive: new Date().toISOString() };
    writeDB(db);
    res.json(db.conversations[index]);
  } else {
    res.status(404).json({ error: "Conversation not found" });
  }
});

// Projects Endpoints
app.get("/api/db/projects", (req, res) => {
  const db = readDB();
  res.json(db.projects);
});

app.post("/api/db/projects", (req, res) => {
  const db = readDB();
  const newProject = {
    id: "p_" + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    ...req.body
  };
  db.projects.unshift(newProject);
  writeDB(db);
  res.status(201).json(newProject);
});

// Quotes Endpoints
app.get("/api/db/quotes", (req, res) => {
  const db = readDB();
  res.json(db.quotes);
});

app.post("/api/db/quotes", (req, res) => {
  const db = readDB();
  const newQuote = {
    id: "q_" + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    status: "pending",
    ...req.body
  };
  db.quotes.unshift(newQuote);

  // Auto-generate a lead from this quote request
  const newLead = normalizeLead({
    id: "l_" + Math.random().toString(36).substr(2, 9),
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    companyName: req.body.company || req.body.companyName || "Direct Lead",
    industry: "other",
    stage: "new",
    source: `Quote Request: ${req.body.selectedPackage}`,
    createdAt: new Date().toISOString(),
    score: 80
  });
  db.leads.unshift(newLead);

  writeDB(db);
  res.status(201).json(newQuote);
});

// Voice Settings Endpoints
app.get("/api/db/voice-settings", (req, res) => {
  const db = readDB() as any;
  if (!db.voiceSettings) {
    db.voiceSettings = {
      voiceName: "Zephyr",
      sessionLimitSeconds: 180,
      costLimitDollars: 0.20,
      systemInstruction: "You are Chanakya, RevAstra’s AI RevOps consultant. Speak like an experienced Indian business consultant having a relaxed one-to-one conversation. Be warm, composed, concise and practical. Use short sentences and natural pauses. Avoid sounding scripted, theatrical, overexcited or robotic. Ask one useful question at a time."
    };
    writeDB(db);
  }
  res.json(db.voiceSettings);
});

app.post("/api/db/voice-settings", (req, res) => {
  const db = readDB() as any;
  db.voiceSettings = {
    ...db.voiceSettings,
    ...req.body
  };
  writeDB(db);
  res.json(db.voiceSettings);
});


// SECURE SERVER-SIDE GEMINI COMPLETIONS (CHANAKYA CONVERSATION AGENT)

app.post("/api/chanakya/chat", async (req, res) => {
  const { messages, visitorInfo, industry, useSearch, useMaps, location, useThinking, speed } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  // Support Developer Mock Mode
  if (process.env.VITE_AI_MOCK_MODE === "true") {
    console.log("Mock Mode Active: Generating mock Chanakya reply.");
    const lastUserMsg = messages[messages.length - 1]?.text?.toLowerCase() || "";
    let reply = `[MOCK MODE] I have received your request. To optimize your lead conversion, automation is key. What CRM do you currently utilize?`;
    if (lastUserMsg.includes("lead") || lastUserMsg.includes("marketing")) {
      reply = `[MOCK MODE] Absolutely. Speed to lead is vital. With our automated WhatsApp triggers, we convert clicks to site-visits in under 5 seconds. What is your current lead response time?`;
    }
    return res.json({ text: reply, mock: true });
  }

  // Format message history for standard Gemini model
  const formattedHistory = messages.map((m: any) => {
    return `${m.sender === 'user' ? 'Visitor' : 'Chanakya'}: ${m.text}`;
  }).join("\n");

  const systemPrompt = `
    You are Chanakya, the live AI RevOps Consultant & Growth OS Advisor for RevAstra (revastra.pro) — the AI Growth Operating System for Indian businesses.
    
    RevAstra is an AI Growth Operating System beginning with free business tools (Free CRM, Lead Auditor, Sales Process Auditor, Conversation Analyser, Quotation Assistant) and expanding into managed CRM, lead intelligence, sales automation, video content, trained agents, and enterprise revenue operations.
    
    Indian Business Context & Field Familiarity:
    - Delhi NCR, Mumbai, Bengaluru, Tier 1/2/3 Indian business hubs.
    - WhatsApp-based lead handling & instant brochure delivery on WhatsApp.
    - Meta Lead Ads (Facebook/Instagram lead forms), Property Portals (Housing, 99acres, MagicBricks), Channel Partner (CP) networks.
    - Site visits, showroom walk-ins, IndiaMART & Justdial enquiries.
    - Transitioning from manual Excel / Google Sheets / WhatsApp Web tracking to automated CRM pipelines.
    - Fluency in English, Hindi, and Hinglish.
    - GST quotation structures (CGST, SGST, IGST, HSN/SAC codes).
    - Owner-led approvals and practical MSME budget constraints in INR (₹).

    STRICT BUSINESS SCOPE GUARDRAILS (CRITICAL):
    You may ONLY answer questions related to:
    - Sales, Leads, CRM & Pipeline Management
    - Growth Marketing, Lead Generation & Meta/Google Ads
    - Customer Conversations & WhatsApp Lead Handling
    - Quotations, Pricing & GST Structure
    - Business Operations, Task Workflows & Reminders
    - Social Media Content & Short-Form Reels Production
    - Business Systems & RevAstra Services / Plans

    If the user asks about unrelated topics (e.g. general trivia, recipes, coding homework, sports, movies, personal advice):
    Politely redirect them: "Namaste. I am Chanakya, RevAstra's AI Growth Advisor. I am strictly specialized in revenue operations, sales systems, lead handling, and CRM automation for Indian businesses. How can I assist with your sales or growth systems today?"

    Our 5 RevAstra Plans:
    1. SHUNYA (₹0 / month): Free AI Growth Foundation with Managed CRM, Lead Auditor, Quotation Assistant, basic reports, 1 user.
    2. SAARTHI (₹4,999/mo founding, reg. ₹14,999/mo): Growth Accelerator with assisted CRM setup, bulk lead import, lead prioritisation, 30 researched leads/mo, WhatsApp chat analysis, email/LinkedIn templates.
    3. ARJUNA (₹20,000/mo founding, reg. ₹45,000/mo): AI Growth & Content System with 10 short-form reels/mo, 1 planned shoot, agentic dashboard, up to 2 users, priority support.
    4. ASTRA (₹40,000/mo founding, reg. ₹90,000/mo): AI Revenue Operating System with trained custom business agents, voice-agent workflows, 20 reels/mo (2 shoots), sales dashboard for 4 users (2 full, 2 view/comment).
    5. BRAHMASTRA (Custom Enterprise): Multi-brand architecture, enterprise CRM, custom agents, audit logs, SLA, dedicated account management.

    STRICT VOCABULARY RULES:
    Do NOT use the words: "unlimited", "guaranteed", or "fully autonomous".

    Rules for Chanakya's conduct:
    - Clearly disclosed as an AI Growth Advisor.
    - Natural multilingual response in English, Hindi, or Hinglish depending on the user.
    - Practical, crisp, authoritative, empathetic to Indian business owners.
    - Ask ONE relevant question at a time to diagnose their bottleneck.
    - Succinct responses (under 4 sentences) for high chat engagement.

    Current Visitor Info: ${JSON.stringify(visitorInfo || {})}
    Selected Industry context: ${industry || 'Not selected'}
    
    Conversation History:
    ${formattedHistory}
    
    Respond as Chanakya. Do not include any prefix like "Chanakya:". Output only your next response.
  `;

  const activeAi = await getGeminiClient();

  if (activeAi) {
    try {
      // 10. Use configured efficient Flash model for normal text conversation
      let modelName = process.env.GEMINI_TEXT_MODEL || "gemini-2.5-flash";
      const config: any = {};

      if (useThinking) {
        modelName = "gemini-2.5-pro"; // capability model
        config.thinkingConfig = {
          thinkingLevel: "HIGH"
        };
      } else if (speed === "fast") {
        modelName = "gemini-2.5-flash";
      }

      // Configure Grounding Tools
      // Note: googleMaps and googleSearch cannot be used together
      if (useMaps) {
        config.tools = [{ googleMaps: {} }];
        if (location && typeof location.latitude === "number" && typeof location.longitude === "number") {
          config.toolConfig = {
            retrievalConfig: {
              latLng: {
                latitude: location.latitude,
                longitude: location.longitude
              }
            }
          };
        }
      } else if (useSearch) {
        config.tools = [{ googleSearch: {} }];
      }

      console.log(`Running standard chat on model ${modelName} (Thinking: ${!!useThinking}, Search: ${!!useSearch}, Maps: ${!!useMaps})`);

      const response = await activeAi.models.generateContent({
        model: modelName,
        contents: systemPrompt,
        config: config
      });

      const responseText = response.text || "I am reflecting on your growth requirements. Could you tell me more about your current response times for incoming leads?";
      res.json({
        text: responseText,
        groundingMetadata: response.candidates?.[0]?.groundingMetadata || null
      });
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      console.error("Gemini Chanakya call failed safely (no keys exposed in logs):", errMsg);
      
      const isRateLimit = errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || err?.status === 429;
      if (isRateLimit) {
        return res.status(429).json({
          error: "RESOURCE_EXHAUSTED",
          message: "Chanakya is receiving unusually high traffic. Continue in text mode or try again shortly."
        });
      }

      // Graceful fallback for other errors
      const lastUserMessage = messages[messages.length - 1]?.text?.toLowerCase() || "";
      let reply = "";
      if (lastUserMessage.includes("lead") || lastUserMessage.includes("customer") || lastUserMessage.includes("marketing") || lastUserMessage.includes("generation")) {
        reply = "A leak in your marketing pipeline is often caused by response delay. In my experience, response time is the single greatest multiplier of customer acquisition. How quickly does your sales team reach out to a lead today?";
      } else if (lastUserMessage.includes("real estate") || lastUserMessage.includes("builder") || lastUserMessage.includes("property")) {
        reply = "Ah, real estate is a noble pursuit. For developers and brokers, automated brochure delivery on WhatsApp and direct site-visit booking links can increase conversions by 300%. Have you explored integrating instant automated follow-ups yet?";
      } else if (lastUserMessage.includes("price") || lastUserMessage.includes("cost") || lastUserMessage.includes("package") || lastUserMessage.includes("pricing")) {
        reply = "Our growth systems are designed to be custom-tailored to your exact business parameters. We have structures ranging from the Saarthi Foundation to our complete AI-powered Astra Operating System. Would you like to check out our detailed Growth System Builder at /growth-system-builder to calculate an instant recommendation?";
      } else if (lastUserMessage.includes("follow") || lastUserMessage.includes("speed") || lastUserMessage.includes("slow") || lastUserMessage.includes("delay")) {
        reply = "Namaste. Fast follow-ups are the fortress of modern sales. If a lead waits 30 minutes, interest drops by 390%. With Chanakya AI and WhatsApp API, we can automate instant brochure delivery in under 5 seconds. How are you currently managing follow-ups?";
      } else if (lastUserMessage.includes("automate") || lastUserMessage.includes("crm") || lastUserMessage.includes("pipeline") || lastUserMessage.includes("system")) {
        reply = "To construct a resilient empire, one must replace manual labor with clockwork systems. Integrating a customized CRM with automated WhatsApp sequences guarantees no lead remains untouched. What CRM or tracking method do you use today?";
      } else {
        reply = "Namaste. To construct a perfect growth system, one must organize attention and automate conversion. Could you tell me a bit about your current biggest business obstacle: lead generation, creative production, or automated follow-up?";
      }
      res.json({ text: reply });
    }
  } else {
    // Highly sophisticated deterministic fallback tree to guarantee 100% functional response if API Key is missing!
    const lastUserMessage = messages[messages.length - 1]?.text?.toLowerCase() || "";
    let reply = "";

    if (lastUserMessage.includes("lead") || lastUserMessage.includes("customer") || lastUserMessage.includes("marketing") || lastUserMessage.includes("generation")) {
      reply = "A leak in your marketing pipeline is often caused by response delay. In my experience, response time is the single greatest multiplier of customer acquisition. How quickly does your sales team reach out to a lead today?";
    } else if (lastUserMessage.includes("real estate") || lastUserMessage.includes("builder") || lastUserMessage.includes("property")) {
      reply = "Ah, real estate is a noble pursuit. For developers and brokers, automated brochure delivery on WhatsApp and direct site-visit booking links can increase conversions by 300%. Have you explored integrating instant automated follow-ups yet?";
    } else if (lastUserMessage.includes("price") || lastUserMessage.includes("cost") || lastUserMessage.includes("package") || lastUserMessage.includes("pricing")) {
      reply = "Our growth systems are designed to be custom-tailored to your exact business parameters. We have structures ranging from the Saarthi Foundation to our complete AI-powered Astra Operating System. Would you like to check out our detailed Growth System Builder at /growth-system-builder to calculate an instant recommendation?";
    } else if (lastUserMessage.includes("follow") || lastUserMessage.includes("speed") || lastUserMessage.includes("slow") || lastUserMessage.includes("delay")) {
      reply = "Namaste. Fast follow-ups are the fortress of modern sales. If a lead waits 30 minutes, interest drops by 390%. With Chanakya AI and WhatsApp API, we can automate instant brochure delivery in under 5 seconds. How are you currently managing follow-ups?";
    } else if (lastUserMessage.includes("automate") || lastUserMessage.includes("crm") || lastUserMessage.includes("pipeline") || lastUserMessage.includes("system")) {
      reply = "To construct a resilient empire, one must replace manual labor with clockwork systems. Integrating a customized CRM with automated WhatsApp sequences guarantees no lead remains untouched. What CRM or tracking method do you use today?";
    } else {
      reply = "Namaste. To construct a perfect growth system, one must organize attention and automate conversion. Could you tell me a bit about your current biggest business obstacle: lead generation, creative production, or automated follow-up?";
    }

    res.json({ text: reply });
  }
});


// SECURE SERVER-SIDE GEMINI BUSINESS LEAK AUDIT (CHANAKYA AUDIT AGENT)
app.post("/api/chanakya/audit", async (req, res) => {
  await getGeminiClient();
  const { companyName, companyWebsite, primaryLeak, responseTime, adSpend, followUpMethod, contactEmail, contactPhone } = req.body;

  if (!companyName || !companyWebsite) {
    return res.status(400).json({ error: "Company name and website are required." });
  }

  // Calculate some initial baseline score and waste based on metrics
  let leakScore = 40; // Base score
  let wastePercentage = 20;

  if (responseTime === "30m-1h") {
    leakScore += 15;
    wastePercentage += 15;
  } else if (responseTime === "same-day") {
    leakScore += 30;
    wastePercentage += 35;
  } else if (responseTime === "next-day") {
    leakScore += 50;
    wastePercentage += 55;
  }

  if (primaryLeak === "response-time") {
    leakScore += 10;
  } else if (primaryLeak === "follow-up") {
    leakScore += 15;
  } else if (primaryLeak === "closing") {
    leakScore += 5;
  }

  if (followUpMethod === "manual") {
    leakScore += 15;
    wastePercentage += 10;
  } else if (followUpMethod === "basic-email") {
    leakScore += 10;
    wastePercentage += 5;
  } else if (followUpMethod === "none") {
    leakScore += 25;
    wastePercentage += 20;
  }

  // Cap leakScore and wastePercentage at 98%
  leakScore = Math.min(98, Math.max(15, leakScore));
  wastePercentage = Math.min(95, Math.max(10, wastePercentage));

  // Determine estimated budget leak in Rupees
  let monthlySpendNum = 20000; // default minimum
  if (adSpend === "50k-2l") monthlySpendNum = 120000;
  else if (adSpend === "2l-10l") monthlySpendNum = 60000;
  else if (adSpend === "10l-plus") monthlySpendNum = 1500000;

  const estimatedWasteVal = Math.round(monthlySpendNum * (wastePercentage / 100));
  const formattedWaste = estimatedWasteVal >= 100000 
    ? `₹${(estimatedWasteVal / 100000).toFixed(1)} Lakhs / month`
    : `₹${estimatedWasteVal.toLocaleString("en-IN")} / month`;

  // System Prompt for generating Chanakya Audit Report
  const auditSystemPrompt = `
    You are Chanakya, the live AI RevOps Consultant for RevAstra AI.
    Provide a highly personalized, deeply strategic, and professional Business Leak Audit analysis for:
    - Company Name: ${companyName}
    - Company Website: ${companyWebsite}
    - Primary Leak Area identified: ${primaryLeak}
    - Lead Response Time: ${responseTime}
    - Ad Spend Category: ${adSpend}
    - Current Follow-up Method: ${followUpMethod}
    
    Our framework is "Trishul RevOps":
    1. Creative Production (Capturing Attention)
    2. Performance Ads & Automated Lead Scoring (Capturing Demand)
    3. WhatsApp Automation & Instant Delivery Systems (Automating Conversion)
    
    You must output a raw JSON object containing EXACTLY this structure:
    {
      "diagnosis": "A concise, wise strategic diagnosis in English/Hinglish (under 3 sentences) reflecting Chanakya's strategic lens, discussing the 'pipeline leaks' and how this is draining their attention investment.",
      "suggestions": [
        { "title": "Strategic Pillar 1", "description": "Specific action advice for their company and responses." },
        { "title": "Strategic Pillar 2", "description": "Specific action advice for their company and responses." },
        { "title": "Strategic Pillar 3", "description": "Specific action advice for their company and responses." }
      ]
    }
    
    Do NOT include markdown block markers like \`\`\`json. Output ONLY the raw valid JSON string.
  `;

  let responseData;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: auditSystemPrompt,
      });

      const responseText = (response && typeof response.text === "string") ? response.text : "{}";
      const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      responseData = JSON.parse(cleaned);
    } catch (err) {
      console.warn("Gemini Chanakya Audit call failed (falling back gracefully)");
    }
  }

  // Fallback if AI is missing or JSON parsing failed
  if (!responseData || !responseData.diagnosis || !responseData.suggestions) {
    responseData = {
      diagnosis: `Namaste, leaders of ${companyName}. An audit of your digital gates at ${companyWebsite} reveals a critical alignment gap. When response takes ${responseTime === "instant" ? "minutes" : responseTime}, the flame of visitor attention cools rapidly, resulting in a ${leakScore}% leak risk.`,
      suggestions: [
        {
          title: "Instant Follow-Up System",
          description: `Deploy a Chanakya website conversational agent on ${companyWebsite} to immediately qualify visitors and dispatch brochures via WhatsApp.`
        },
        {
          title: "Trishul Strategic Lead Scoring",
          description: `Establish automated lead scoring to rank incoming inquiries so your closing team prioritizes high-intent buyers instantly.`
        },
        {
          title: "Astra Pipeline Sync",
          description: `Replace manual sheets with unified tracking to guarantee that no lead remains unanswered or uncalled after 10 minutes.`
        }
      ]
    };
  }

  // Create a real Lead in the database for tracking!
  const db = readDB();
  const newLeadId = `l_audit_${Date.now().toString().slice(-6)}`;
  const newLead = normalizeLead({
    id: newLeadId,
    name: companyName,
    email: contactEmail || "audit-request@revastra.pro",
    phone: contactPhone || "+91 99999 99999",
    companyName: companyName,
    industry: "business-leak-audit",
    stage: "new",
    source: `Chanakya Leak Audit: ${companyWebsite}`,
    createdAt: new Date().toISOString(),
    score: 100 - leakScore // High leak = lower initial health score
  });
  
  db.leads.unshift(newLead);
  
  // Create an assessment record for references
  const newAssessment = {
    id: `a_audit_${Date.now().toString().slice(-6)}`,
    contactName: companyName,
    email: contactEmail || "audit-request@revastra.pro",
    phone: contactPhone || "+91 99999 99999",
    companyName: companyName,
    industry: "business-leak-audit",
    biggestProblem: `Primary Leak: ${primaryLeak}, Response Time: ${responseTime}`,
    createdAt: new Date().toISOString(),
    scores: {
      leakRisk: leakScore,
      automation: followUpMethod === "manual" ? 20 : 60,
    },
    recommendedPackage: leakScore > 70 ? "astra" : "arjuna"
  };
  db.assessments.unshift(newAssessment);

  writeDB(db);

  res.json({
    ...responseData,
    leakScore,
    wastePercentage,
    financialWaste: formattedWaste,
    leadId: newLeadId
  });
});


// CHANAKYA STRUCTURED CONSULTATION REPORT ENDPOINTS

app.post("/api/chanakya/report", async (req, res) => {
  await getGeminiClient();
  const { 
    companyName,
    contactName,
    email,
    phone,
    industry,
    businessType,
    leadSources,
    enquiryVolume,
    responseSpeed,
    crm,
    followUpProcess,
    teamSize,
    desiredOutcome,
    conversationHistory
  } = req.body;

  // 1. Deterministic Scoring
  const numTeamSize = Number(teamSize) || 1;
  
  let leadCapture = 50;
  const speed = (responseSpeed || "").toLowerCase();
  if (speed.includes("instant") || speed.includes("5 sec") || speed.includes("5 minutes")) {
    leadCapture = 90;
  } else if (speed.includes("30 mins") || speed.includes("30 minutes") || speed.includes("hour")) {
    leadCapture = 65;
  } else if (speed.includes("same day") || speed.includes("day") || speed.includes("delayed")) {
    leadCapture = 35;
  }

  let responseDelayRisk = 50;
  if (speed.includes("instant") || speed.includes("5 sec") || speed.includes("5 minutes")) {
    responseDelayRisk = 15;
  } else if (speed.includes("30 mins") || speed.includes("30 minutes")) {
    responseDelayRisk = 45;
  } else {
    responseDelayRisk = 85;
  }

  let crmHygiene = 35;
  const crmVal = (crm || "").toLowerCase();
  if (crmVal.includes("hubspot") || crmVal.includes("salesforce") || crmVal.includes("zoho") || crmVal.includes("leadsquared") || crmVal.includes("crm")) {
    crmHygiene = 80;
  } else if (crmVal.includes("sheet") || crmVal.includes("excel") || crmVal.includes("spreadsheet")) {
    crmHygiene = 45;
  } else if (crmVal.includes("none") || crmVal.includes("no")) {
    crmHygiene = 15;
  }

  let followUpMaturity = 40;
  const fUp = (followUpProcess || "").toLowerCase();
  if (fUp.includes("automated") || fUp.includes("active") || fUp.includes("auto")) {
    followUpMaturity = 85;
  } else if (fUp.includes("manual") || fUp.includes("inconsistent") || fUp.includes("rep")) {
    followUpMaturity = 45;
  } else if (fUp.includes("none") || fUp.includes("no")) {
    followUpMaturity = 10;
  }

  let automationReadiness = 45;
  if (numTeamSize > 15) automationReadiness += 20;
  if (crmHygiene < 50) automationReadiness += 15;
  if (followUpMaturity < 50) automationReadiness += 15;
  automationReadiness = Math.min(95, Math.max(15, automationReadiness));

  const scores = {
    leadCapture,
    responseDelayRisk,
    crmHygiene,
    followUpMaturity,
    automationReadiness
  };

  // 2. Package Recommendation (Saarthi, Arjuna, Astra, Brahmastra)
  let recommendedPackage = "Saarthi";
  if (numTeamSize > 25 || (enquiryVolume && (enquiryVolume.includes("1000") || enquiryVolume.toLowerCase().includes("thousands")))) {
    recommendedPackage = "Brahmastra";
  } else if (speed.includes("day") || fUp.includes("manual") || fUp.includes("none") || crmVal.includes("none") || crmVal.includes("sheet")) {
    recommendedPackage = "Astra";
  } else {
    recommendedPackage = "Arjuna";
  }

  // 3. AI Generated Report Explanation using Gemini and Zod Validation
  let aiExplanations = {
    businessSummary: `Business Summary for ${companyName || 'your enterprise'}: Operating in the ${industry || 'specified'} space as a ${businessType || 'business'}. Currently handling approximately ${enquiryVolume || 'unspecified amount of'} inquiries via sources like ${leadSources || 'traditional channels'}.`,
    primaryBottleneck: `Primary Bottleneck: The primary point of pipeline leakage is identified in the response flow. With an average response time of "${responseSpeed || 'manual speed'}", high-value leads face critical drop-off before booking or conversion.`,
    supportingGaps: `Supporting Gaps: The use of "${crm || 'current tools'}" combined with a "${followUpProcess || 'manual'}" follow-up process results in manual handling delays and an absence of proactive automated qualification.`,
    systemMaturity: `System Maturity: Computed system readiness scores place the operational framework at a developing stage (Lead Capture: ${leadCapture}%, Follow-up Maturity: ${followUpMaturity}%). Pipeline transparency requires structural alignment.`,
    recommendedWorkflow: `Recommended Workflow: Transition to a fully connected RevAstra pipeline. Leads captured from ${leadSources || 'campaigns'} should trigger a direct 5-second auto-responder with an interactive brochure, followed by automated WhatsApp drip sequences.`,
    recommendedServices: [
      "Custom Creative Content & Reel Edits to capture attention",
      "Official WhatsApp API Integration & Automated Brochure Delivery",
      "High-Conversion Dedicated Landing Pages"
    ],
    implementationPriorities: [
      "Deploy instant 5-second auto-response webhooks",
      "Migrate pipeline tracking from sheets to an automated CRM",
      "Enable automated multi-channel follow-up drip reminders"
    ],
    nextStep: "Arrange a systems-mapping strategy call with our Senior RevOps architect Loukesh to blueprint the custom integration path."
  };

  const ReportExplanationSchema = z.object({
    businessSummary: z.string().min(10),
    primaryBottleneck: z.string().min(10),
    supportingGaps: z.string().min(10),
    systemMaturity: z.string().min(10),
    recommendedWorkflow: z.string().min(10),
    recommendedServices: z.array(z.string()).min(1),
    implementationPriorities: z.array(z.string()).min(1),
    nextStep: z.string().min(10)
  });

  if (ai) {
    try {
      const prompt = `
        Act as Chanakya, RevAstra's chief RevOps Strategist.
        Generate a structured growth report based on these parameters:
        - Company Name: ${companyName}
        - Industry: ${industry}
        - Business Type: ${businessType}
        - Lead Sources: ${leadSources}
        - Weekly/Monthly Enquiry Volume: ${enquiryVolume}
        - Response Speed: ${responseSpeed}
        - CRM Tracking Tool: ${crm}
        - Follow-up Process: ${followUpProcess}
        - Team Size: ${teamSize}
        - Desired Outcome: ${desiredOutcome}

        Our systems scores are:
        - Lead Capture & Speed Score: ${leadCapture}/100
        - Response Delay Risk: ${responseDelayRisk}/100
        - CRM Hygiene & Systems Integrity: ${crmHygiene}/100
        - Follow-up Maturity: ${followUpMaturity}/100
        - Automation Readiness Score: ${automationReadiness}/100
        - Recommended Package: ${recommendedPackage}

        Instructions:
        1. Write in a wise, strategic, consultative tone inspired by analytical system design.
        2. Do NOT invent revenue figures or percentages of sales growth. Only describe relative gaps, process leaks, and structure.
        3. Do NOT use weapon descriptions or mythological metaphors. Speak with executive clarity.
        4. Provide highly tailored recommendations, highlighting our specific products: Saarthi, Arjuna, Astra, and Brahmastra.
        
        You MUST respond strictly with a valid JSON matching this schema:
        {
          "businessSummary": "A concise overview of their operation, channels, and scale.",
          "primaryBottleneck": "Deep-dive analysis of their absolute biggest process bottleneck (e.g. lead response delay or manual sheet friction).",
          "supportingGaps": "Details of secondary process leaks like CRM hygiene or inconsistent follow-ups.",
          "systemMaturity": "A clear systems audit analyzing their current operational scores and readiness.",
          "recommendedWorkflow": "A step-by-step description of how the recommended connected RevAstra pipeline should function.",
          "recommendedServices": ["List item 1", "List item 2", "List item 3"],
          "implementationPriorities": ["Priority 1", "Priority 2", "Priority 3"],
          "nextStep": "Clear call-to-action regarding booking a call or connecting with Loukesh."
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are Chanakya, delivering structured strategic RevOps audits in valid JSON.",
        }
      });

      const responseText = response.text || "{}";
      const parsedJSON = JSON.parse(responseText);
      const validated = ReportExplanationSchema.parse(parsedJSON);
      aiExplanations = validated;
    } catch (err) {
      console.warn("Chanakya report generation failed, using structured fallback:", err);
    }
  }

  const reportId = "rep_" + Math.random().toString(36).substr(2, 9);
  const newReport = {
    id: reportId,
    companyName,
    contactName,
    email,
    phone,
    industry,
    businessType,
    leadSources,
    enquiryVolume,
    responseSpeed,
    crm,
    followUpProcess,
    teamSize,
    desiredOutcome,
    scores,
    recommendedPackage,
    createdAt: new Date().toISOString(),
    aiExplanations
  };

  const db = readDB() as any;
  db.reports = db.reports || [];
  db.reports.unshift(newReport);

  // Also save a corresponding lead record so they appear in dashboard
  const newLead = normalizeLead({
    id: "l_rep_" + Math.random().toString(36).substr(2, 9),
    name: contactName || "Chanakya Consultation Guest",
    email: email || "consultation@revastra.pro",
    phone: phone || "None provided",
    companyName: companyName || "Consultation Client",
    industry: industry || "other",
    stage: "site_visit_scheduled",
    source: `Chanakya AI Consultation Report`,
    createdAt: new Date().toISOString(),
    score: Math.round((leadCapture + followUpMaturity + crmHygiene) / 3)
  });
  db.leads.unshift(newLead);

  // Also save conversation to conversations
  if (conversationHistory && Array.isArray(conversationHistory)) {
    const newConv = {
      id: "conv_" + reportId,
      visitorName: contactName,
      visitorEmail: email,
      visitorPhone: phone,
      industry: industry,
      messages: conversationHistory,
      lastActive: new Date().toISOString(),
      score: Math.round((leadCapture + followUpMaturity + crmHygiene) / 3),
      isEscalated: false,
      notes: `Consultation report ${reportId} created for ${companyName}`
    };
    db.conversations = db.conversations || [];
    db.conversations.unshift(newConv);
  }

  writeDB(db);

  res.status(201).json(newReport);
});

// GET report endpoint
app.get("/api/db/reports/:id", (req, res) => {
  const db = readDB() as any;
  const reports = db.reports || [];
  const found = reports.find((r: any) => r.id === req.params.id);
  if (found) {
    res.json(found);
  } else {
    res.status(404).json({ error: "Consultation Report not found" });
  }
});


// Serve static assets or use Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = http.createServer(app);
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (request, socket, head) => {
    const pathname = new URL(request.url || "", `http://${request.headers.host}`).pathname;
    if (pathname === "/api/chanakya/live") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    }
  });

  wss.on("connection", async (ws) => {
    await getGeminiClient();
    console.log("New Chanakya Live Audio Client connected.");
    let session: any = null;
    let timer: NodeJS.Timeout | null = null;
    let startTimestamp = Date.now();
    
    // Costs trackers
    let totalInputSeconds = 0;
    let totalOutputSeconds = 0;
    
    ws.on("message", async (message) => {
      try {
        const payload = JSON.parse(message.toString());
        
        if (payload.type === "start") {
          const db = readDB() as any;
          const settings = db.voiceSettings || {
            voiceName: "Zephyr",
            sessionLimitSeconds: 180,
            costLimitDollars: 0.20,
            systemInstruction: "You are Chanakya, RevAstra’s AI RevOps consultant. Speak like an experienced Indian business consultant having a relaxed one-to-one conversation. Be warm, composed, concise and practical. Use short sentences and natural pauses. Avoid sounding scripted, theatrical, overexcited or robotic. Ask one useful question at a time."
          };
          
          const voiceName = payload.config?.voiceName || settings.voiceName;
          const sessionLimit = payload.config?.sessionLimitSeconds || settings.sessionLimitSeconds;
          const costLimit = payload.config?.costLimitDollars || settings.costLimitDollars;
          
          console.log(`Starting Chanakya Live session with Voice: ${voiceName}, Limit: ${sessionLimit}s, Cost limit: $${costLimit}`);
          
          if (!process.env.GEMINI_API_KEY || !ai) {
            ws.send(JSON.stringify({
              type: "error",
              text: "Voice is temporarily unavailable. I’ve kept the conversation open in text mode."
            }));
            ws.close();
            return;
          }
          
          // Initialize Gemini Live connect
          try {
            session = await (ai as any).live.connect({
              model: "gemini-3.1-flash-live-preview",
              config: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                  voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceName } },
                },
                systemInstruction: settings.systemInstruction,
                outputAudioTranscription: {},
                inputAudioTranscription: {},
              },
              callbacks: {
                onmessage: (msg: any) => {
                  // Handle model audio output
                  const audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                  if (audio) {
                    // Track output audio seconds to calculate cost
                    // 24kHz 16-bit mono PCM is 48000 bytes per second.
                    const rawLength = (audio.length * 3) / 4;
                    const seconds = rawLength / 48000;
                    totalOutputSeconds += seconds;
                    
                    ws.send(JSON.stringify({ type: "audio", audio }));
                    
                    // Check cost limit
                    checkLimits();
                  }
                  
                  // Handle interruption
                  if (msg.serverContent?.interrupted) {
                    ws.send(JSON.stringify({ type: "interrupted" }));
                  }
                  
                  // Handle model output transcription
                  const modelParts = msg.serverContent?.modelTurn?.parts;
                  if (modelParts) {
                    const modelText = modelParts.find((p: any) => p.text)?.text;
                    if (modelText) {
                      ws.send(JSON.stringify({
                        type: "transcript",
                        sender: "chanakya",
                        text: modelText,
                        isFinal: msg.serverContent?.turnComplete || false
                      }));
                    }
                  }
                  
                  // Handle user input transcription
                  const userTranscript = msg.serverContent?.inputAudioTranscription?.text || 
                                         (msg.serverContent?.inputAudioTranscription?.parts && 
                                          msg.serverContent.inputAudioTranscription.parts.find((p: any) => p.text)?.text);
                  if (userTranscript) {
                    ws.send(JSON.stringify({
                      type: "transcript",
                      sender: "user",
                      text: userTranscript,
                      isFinal: true
                    }));
                  }
                },
                onclose: () => {
                  console.log("Gemini Live session closed.");
                  ws.send(JSON.stringify({ type: "status", text: "Session closed by Gemini." }));
                },
                onerror: (err: any) => {
                  console.error("Gemini Live error:", err);
                  ws.send(JSON.stringify({ type: "error", text: "Gemini session error occurred." }));
                }
              }
            });
            
            ws.send(JSON.stringify({ type: "status", text: "Connected to Chanakya Voice Service" }));
            startTimestamp = Date.now();
            
            // Start session duration timer
            timer = setTimeout(() => {
              console.log(`Session duration limit (${sessionLimit}s) reached.`);
              ws.send(JSON.stringify({ type: "limit", reason: "session" }));
              cleanup();
            }, sessionLimit * 1000);
            
          } catch (connectErr) {
            console.error("Failed to connect to Gemini Live:", connectErr);
            ws.send(JSON.stringify({
              type: "error",
              text: "Voice is temporarily unavailable. I’ve kept the conversation open in text mode."
            }));
            ws.close();
          }
        }
        
        else if (payload.type === "audio") {
          if (session && payload.audio) {
            // Track input audio seconds to calculate cost
            // Input is 16kHz 16-bit mono PCM, which is 32000 bytes per second.
            const rawLength = (payload.audio.length * 3) / 4;
            const seconds = rawLength / 32000;
            totalInputSeconds += seconds;
            
            session.sendRealtimeInput({
              audio: { data: payload.audio, mimeType: "audio/pcm;rate=16000" }
            });
            
            // Check cost limit
            checkLimits();
          }
        }
        
        else if (payload.type === "end") {
          cleanup();
        }
        
      } catch (err) {
        console.error("WS message error:", err);
      }
    });
    
    function checkLimits() {
      const inputCost = totalInputSeconds * 0.0001; 
      const outputCost = totalOutputSeconds * 0.0003; 
      const totalCost = inputCost + outputCost;
      
      const db = readDB() as any;
      const costLimit = db.voiceSettings?.costLimitDollars || 0.20;
      
      if (totalCost >= costLimit) {
        console.log(`Session cost limit ($${costLimit}) exceeded. Estimated cost: $${totalCost.toFixed(4)}`);
        ws.send(JSON.stringify({ type: "limit", reason: "cost" }));
        cleanup();
      }
    }
    
    function cleanup() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (session) {
        try {
          session.close();
        } catch (e) {}
        session = null;
      }
      try {
        ws.close();
      } catch (e) {}
    }
    
    ws.on("close", () => {
      console.log("Client disconnected from Chanakya Live.");
      cleanup();
    });
  });

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`RevAstra Server is running successfully on http://0.0.0.0:${PORT}`);
  });
}

startServer();
