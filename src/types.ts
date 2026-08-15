/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PlanType = 'shunya' | 'saarthi' | 'arjuna' | 'astra' | 'brahmastra';

export interface PlanLimits {
  crmLeadsLimit: number;
  usersLimit: number;
  chanakyaQueriesMonthly: number;
  conversationAnalysisMonthly: number;
  researchedLeadsMonthly: number;
  videosMonthly: number;
  voiceAgents: boolean;
  agenticDashboard: boolean;
  dedicatedMemory: boolean;
  customIntegrations: boolean;
  prioritySupport: boolean;
}

export interface PlanConfig {
  id: PlanType;
  name: string;
  tagline: string;
  positioning: string;
  regularPrice: string;
  foundingPrice: string;
  isMonthly: boolean;
  whoItIsFor: string;
  primaryOutcome: string;
  exactDeliverables: string[];
  usageLimits: string[];
  exclusions: string[];
  implementationResponsibility: string;
  supportLevel: string;
  ctaText: string;
  popular?: boolean;
}

export interface OnboardingData {
  userName: string;
  businessName: string;
  industry: string;
  city: string;
  state: string;
  teamSize: string;
  primaryMarket: string;
  businessStage: string;
  growthPriority: string;
  leadSources: string[];
  crmUsage: string;
  followUpProcess: string;
  preferredLanguage: 'English' | 'Hindi' | 'Hinglish';
  recommendedTool?: string;
  completedAt?: string;
}

export interface UserUsage {
  chanakyaQueriesUsed: number;
  conversationAnalysesUsed: number;
  leadsAdded: number;
  quotationsCreated: number;
  researchedLeadsUsed: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  businessName?: string;
  isVerified: boolean;
  plan: PlanType;
  onboardingCompleted: boolean;
  onboardingData?: OnboardingData;
  usage: UserUsage;
  createdAt: string;
}

export type CRMStage = 
  | 'new'
  | 'contacted'
  | 'site_visit_scheduled'
  | 'site_visit_done'
  | 'quotation_sent'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost';

export interface CRMLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  companyName: string;
  city: string;
  state?: string;
  industry?: string;
  source: string;
  stage: CRMStage;
  value: number; // in INR
  score: number; // 0 - 100
  notes: string;
  assignedTo?: string;
  lastContactedAt?: string;
  nextFollowUpAt?: string;
  createdAt: string;
}


export interface Task {
  id: string;
  title: string;
  leadName?: string;
  leadPhone?: string;
  /** Optional CRM lead relationship (Phase v0.4: FK to leads table) */
  leadId?: string;
  type: 'call' | 'whatsapp' | 'site_visit' | 'quotation' | 'meeting' | 'other';
  dueDate: string; // ISO date string YYYY-MM-DD
  dueTime?: string; // HH:MM — required for accurate overdue calculation
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed' | 'overdue';
  notes?: string;
  createdAt: string;
}

export interface QuotationItem {
  id: string;
  description: string;
  hsnSacCode?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  clientName: string;
  companyName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress?: string;
  clientGstin?: string;
  /** Optional CRM lead relationship (Phase v0.4: FK to leads table) */
  leadId?: string;
  items: QuotationItem[];
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  gstRate: number; // e.g. 18
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  isInterstate: boolean;
  grandTotal: number;
  paymentTerms: string;
  status: 'draft' | 'pending_owner_approval' | 'approved' | 'sent_to_client' | 'accepted' | 'rejected';
  validUntil: string;
  createdAt: string;
}

export interface LeadAuditResult {
  responseTimeScore: number;
  leadLeakRisk: 'High' | 'Moderate' | 'Low';
  estimatedMonthlyLeadLossInr: number;
  channelHealth: { channel: string; score: number; status: string }[];
  keyRecommendations: string[];
}

export interface SalesAuditResult {
  followUpScore: number;
  scriptEffectivenessScore: number;
  closingVelocityDays: number;
  bottlenecks: string[];
  actionItems: string[];
}

export interface ConversationAnalysisResult {
  sentiment: 'Hot Buyer' | 'Warm Prospect' | 'Price Shopping' | 'Cold / Unqualified';
  buyingIntentScore: number; // 0 - 100
  keyObjectionsIdentified: string[];
  missingInformation: string[];
  recommendedWhatsAppReply: string;
  suggestedAction: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  company?: string;
  industry?: string;
  stage: CRMStage;
  status?: string;
  source: string;
  createdAt: string;
  score: number;
  value?: number;
  city?: string;
  notes?: string;
}

export interface Assessment {
  id: string;
  contactName: string;
  email: string;
  phone: string;
  companyName: string;
  industry: string;
  marketCountry: string;
  locationsCount: number;
  monthlyEnquiries: string;
  leadSources: string[];
  servicesNeeded: string[];
  biggestProblem: string;
  trackingMethod: string;
  responseSpeed: string;
  followUpConsistency: string;
  desiredOutcomes: string[];
  existingTools: string[];
  teamSize: number;
  urgency: string;
  budgetRange: string;
  createdAt: string;
  scores: {
    creative: number;
    marketing: number;
    leadCapture: number;
    salesProcess: number;
    automation: number;
    leakRisk: number;
    complexity: number;
  };
  maturityLevels?: {
    creativeReadiness: string;
    marketingReadiness: string;
    leadManagementMaturity: string;
    followUpMaturity: string;
    automationReadiness: string;
    reportingMaturity: string;
    operationalComplexity: string;
    urgency: string;
    recommendedPackage: string;
  };
  recommendedPackage: string;
  analysisText?: string;
}

// ---------------------------------------------------------------------------
// Lead Activity Timeline
// ---------------------------------------------------------------------------

/**
 * Activity event types for the lead timeline.
 * Designed for future migration to PostgreSQL activity_events table.
 */
export type ActivityType =
  | 'lead_created'
  | 'note_added'
  | 'stage_changed'
  | 'task_created'
  | 'task_completed'
  | 'quotation_created'
  | 'quotation_sent'
  | 'contact_attempted';

/**
 * A single activity event in a lead's timeline.
 *
 * Future multi-tenancy fields (Phase v0.4 — Supabase + PostgreSQL):
 *   businessId?: string;  — RLS partition key
 *   userId?: string;      — who performed the action
 *   role?: 'owner' | 'admin' | 'member' | 'viewer';
 */
export interface LeadActivity {
  id: string;
  leadId: string;
  type: ActivityType;
  description: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Chanakya Chat
// ---------------------------------------------------------------------------

export interface ChanakyaMessage {
  id: string;
  sender: 'user' | 'chanakya';
  text: string;
  timestamp: string;
  groundingMetadata?: any;
  isRateLimited?: boolean;
  isTextFallback?: boolean;
}

export interface ChanakyaConversation {
  id: string;
  visitorName?: string;
  visitorEmail?: string;
  visitorPhone?: string;
  industry?: string;
  messages: ChanakyaMessage[];
  lastActive: string;
  score?: number;
  isEscalated: boolean;
  notes?: string;
}

export interface Project {
  id: string;
  clientName: string;
  projectName: string;
  industry: string;
  status: 'planning' | 'production' | 'review' | 'launched' | 'active_retainer';
  creativeProgress: number; // 0 - 100
  marketingProgress: number; // 0 - 100
  automationProgress: number; // 0 - 100
  deliverables: {
    name: string;
    type: 'video' | 'photo' | 'landing_page' | 'agent' | 'crm';
    status: 'pending' | 'in_progress' | 'ready_for_review' | 'approved';
    url?: string;
  }[];
  createdAt: string;
}

export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  selectedPackage: string;
  customScope?: string;
  status: 'pending' | 'reviewed' | 'responded';
  createdAt: string;
}

export interface WisdomQuote {
  id: string;
  text: string;
  author: string;
  category: 'Strategy' | 'Growth' | 'Process' | 'Execution' | 'Wisdom';
}

export interface PackageConfig {
  id: string;
  name: string;
  subheadline: string;
  tagline: string;
  features: string[];
  pricingNote: string;
  startingPriceLabel: string;
  isPopular?: boolean;
}

export interface Consultation {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  biggestObstacle: string;
  date: string;
  time: string;
  createdAt: string;
}

export interface Quote {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  needsShoots: boolean;
  shootCount: number;
  needsMarketing: boolean;
  needsWhatsApp: boolean;
  needsChanakya: boolean;
  estimatedMonthly: number;
  estimatedOneTime: number;
  createdAt: string;
}
