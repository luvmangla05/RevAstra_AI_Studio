import { PlanConfig, PlanType, PlanLimits } from '../types';

export const PLANS_CONFIG: Record<PlanType, PlanConfig> = {
  shunya: {
    id: 'shunya',
    name: 'SHUNYA',
    tagline: 'Free AI Growth Foundation',
    positioning: 'Essential tools for Indian business owners to digitize leads and stop revenue leaks.',
    regularPrice: '₹0',
    foundingPrice: '₹0',
    isMonthly: false,
    whoItIsFor: 'Solo founders, micro-businesses, and MSMEs transitioning from paper or Excel tracking.',
    primaryOutcome: 'Structure leads, generate professional GST quotations, and identify lead response bottlenecks.',
    exactDeliverables: [
      'Free Managed CRM (Up to 100 leads)',
      'Lead Leakage Auditor & Scorecard',
      'Sales Process Audit Tool',
      'GST Quotation Assistant with calculations',
      'Limited WhatsApp Conversation Analyzer (5/mo)',
      'Limited Chanakya AI Assistant (20 queries/mo)',
      'Basic Sales Pipeline & Revenue Reports',
      'Single User Access'
    ],
    usageLimits: [
      'Max 100 Leads stored',
      '20 Chanakya AI queries / month',
      '5 Conversation analyses / month',
      '1 User seat'
    ],
    exclusions: [
      'No video content production',
      'No custom integrations or webhooks',
      'No trained business voice agents',
      'No dedicated account management'
    ],
    implementationResponsibility: 'Self-serve with guided onboarding',
    supportLevel: 'Community & Documentation Support',
    ctaText: 'Start Free with Shunya'
  },
  saarthi: {
    id: 'saarthi',
    name: 'SAARTHI',
    tagline: 'Growth Accelerator',
    positioning: 'Automated follow-ups and lead intelligence for growing Indian sales teams.',
    regularPrice: '₹14,999',
    foundingPrice: '₹4,999',
    isMonthly: true,
    whoItIsFor: 'Active MSMEs, real estate agents, traders, and service firms seeking organized sales follow-ups.',
    primaryOutcome: 'Accelerate lead contact speeds, import historic leads, and send pre-built outreach templates.',
    exactDeliverables: [
      'Everything included in Shunya',
      'Assisted CRM Setup & Data Migration Support',
      'Bulk Excel Lead Import & De-duplication',
      'AI Lead Prioritisation & Scoring Engine',
      'Follow-up Reminders & Multi-touch Schedule',
      'Up to 30 Researched Leads Monthly',
      'Exported WhatsApp Chat Intelligence Analysis',
      'Outreach Templates (Email, LinkedIn, Instagram)',
      'Gmail & Bulk Email Workflow Integration',
      'Basic Chat Automation Rules'
    ],
    usageLimits: [
      'Max 1,000 Leads stored',
      '150 Chanakya AI queries / month',
      '30 Researched Leads / month',
      '1 User seat'
    ],
    exclusions: [
      'No video shoots or reel production',
      'No voice agent call automation',
      'No multi-branch role permissions'
    ],
    implementationResponsibility: 'Assisted Setup with 1-on-1 Onboarding Call',
    supportLevel: 'Email & WhatsApp Business Support (48h SLA)',
    ctaText: 'Claim Founding Offer (₹4,999/mo)'
  },
  arjuna: {
    id: 'arjuna',
    name: 'ARJUNA',
    tagline: 'AI Growth & Content System',
    positioning: 'Combined AI revenue tools with monthly short-form video production for social sales.',
    regularPrice: '₹45,000',
    foundingPrice: '₹20,000',
    isMonthly: true,
    popular: true,
    whoItIsFor: 'High-growth builders, luxury clinics, gym chains, B2B manufacturers, and premium service firms.',
    primaryOutcome: 'Establish brand dominance with professional videos and an agentic sales dashboard.',
    exactDeliverables: [
      'Everything included in Saarthi',
      'Higher CRM & Lead Limits (Up to 5,000 leads)',
      'Enhanced Lead Verification & Phone Validation',
      'Dedicated Approved Business Knowledge Memory',
      'Agentic Sales Dashboard with Proactive Suggestions',
      'Automated Task Drafting & Follow-up Scheduling',
      'Connected Tools (Meta Lead Ads, IndiaMART, Justdial)',
      'Up to 10 Short-Form High-Impact Videos Monthly',
      '1 Planned On-Site Video Shoot (2-3 Product/Service Themes)',
      'Up to 2 User Seats',
      'Priority Phone & WhatsApp Support'
    ],
    usageLimits: [
      'Max 5,000 Leads stored',
      '500 Chanakya AI queries / month',
      '10 Short-form Reels / month (1 Shoot)',
      '2 User seats'
    ],
    exclusions: [
      'No custom API backend development',
      'No full enterprise multi-brand hierarchy'
    ],
    implementationResponsibility: 'Done-With-You Implementation & Managed Media Crew',
    supportLevel: 'Priority WhatsApp & Dedicated Campaign Manager (24h SLA)',
    ctaText: 'Upgrade to Arjuna (₹20,000/mo)'
  },
  astra: {
    id: 'astra',
    name: 'ASTRA',
    tagline: 'AI Revenue Operating System',
    positioning: 'Complete AI sales workforce with trained agents, voice workflows, and multi-user management.',
    regularPrice: '₹90,000',
    foundingPrice: '₹40,000',
    isMonthly: true,
    whoItIsFor: 'Established developers, multi-clinic networks, regional auto dealerships, and enterprise sales teams.',
    primaryOutcome: 'Automate initial lead qualification via voice/chat agents and maintain rapid response speeds.',
    exactDeliverables: [
      'Everything included in Arjuna',
      'Trained Custom Business AI Agents (Voice & WhatsApp)',
      'Advanced Predictive Lead Scoring Engine',
      'Conversational Business Knowledge Layer',
      'Approved Workflow Automation & Webhooks',
      'Voice-Agent Workflows (Subject to integration availability)',
      'Rapid Lead Acknowledgement & Automated Qualification',
      'Up to 20 Short-Form Videos Monthly (2 On-Site Shoots)',
      'Sales Dashboard for up to 4 Users (2 Full, 2 View/Comment)',
      'Executive Management Reports & SLA Tracking',
      'Priority Implementation & Dedicated RevOps Lead'
    ],
    usageLimits: [
      'Max 25,000 Leads stored',
      '2,000 Chanakya AI queries / month',
      '20 Short-form Reels / month (2 Shoots)',
      '4 User seats (2 Full Access, 2 Read-Only)'
    ],
    exclusions: [
      'Custom on-premise cloud infrastructure',
      'Source code ownership rights'
    ],
    implementationResponsibility: 'Full Done-For-You Deployment & Staff Training',
    supportLevel: 'Dedicated RevOps Strategist & 12h SLA Support',
    ctaText: 'Get Astra OS (₹40,000/mo)'
  },
  brahmastra: {
    id: 'brahmastra',
    name: 'BRAHMASTRA',
    tagline: 'Enterprise AI Growth Infrastructure',
    positioning: 'Tailored enterprise architecture for multi-brand conglomerates and nationwide operations.',
    regularPrice: 'Custom Quote',
    foundingPrice: 'Custom Quote',
    isMonthly: true,
    whoItIsFor: 'Large enterprise groups, national retail chains, multi-city real estate developers, and franchise networks.',
    primaryOutcome: 'Deploy bespoke AI growth architecture with custom security, SLA, and enterprise governance.',
    exactDeliverables: [
      'Everything included in Astra',
      'Multi-Project, Multi-Team, Multi-Location & Multi-Brand Architecture',
      'Custom Enterprise CRM Schema & Custom Field Mapping',
      'Advanced Lead Routing Rules & Regional Assignment Logic',
      'Custom Business AI Agents Trained on Proprietary Corpus',
      'Bespoke ERP / CRM Integrations (Salesforce, SAP, ZoHo)',
      'Multi-level Approval Workflows & Custom Roles',
      'Audit Logs, Data Governance & Security Controls',
      'Executive BI Dashboards & Custom Analytics',
      'Contractual SLA Guarantees',
      'Dedicated Account Management & On-Site Training Workshops'
    ],
    usageLimits: [
      'Custom Lead Capacity',
      'Custom AI & Media Volume',
      'Custom Seat Allocations'
    ],
    exclusions: [
      'None within agreed enterprise SOW'
    ],
    implementationResponsibility: 'Dedicated Enterprise Delivery Team & Solution Architects',
    supportLevel: 'Dedicated Account Director & 24/7 Emergency SLA Support',
    ctaText: 'Contact Enterprise Sales'
  }
};

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  shunya: {
    crmLeadsLimit: 100,
    usersLimit: 1,
    chanakyaQueriesMonthly: 20,
    conversationAnalysisMonthly: 5,
    researchedLeadsMonthly: 0,
    videosMonthly: 0,
    voiceAgents: false,
    agenticDashboard: false,
    dedicatedMemory: false,
    customIntegrations: false,
    prioritySupport: false
  },
  saarthi: {
    crmLeadsLimit: 1000,
    usersLimit: 1,
    chanakyaQueriesMonthly: 150,
    conversationAnalysisMonthly: 25,
    researchedLeadsMonthly: 30,
    videosMonthly: 0,
    voiceAgents: false,
    agenticDashboard: false,
    dedicatedMemory: false,
    customIntegrations: false,
    prioritySupport: false
  },
  arjuna: {
    crmLeadsLimit: 5000,
    usersLimit: 2,
    chanakyaQueriesMonthly: 500,
    conversationAnalysisMonthly: 100,
    researchedLeadsMonthly: 100,
    videosMonthly: 10,
    voiceAgents: false,
    agenticDashboard: true,
    dedicatedMemory: true,
    customIntegrations: true,
    prioritySupport: true
  },
  astra: {
    crmLeadsLimit: 25000,
    usersLimit: 4,
    chanakyaQueriesMonthly: 2000,
    conversationAnalysisMonthly: 500,
    researchedLeadsMonthly: 300,
    videosMonthly: 20,
    voiceAgents: true,
    agenticDashboard: true,
    dedicatedMemory: true,
    customIntegrations: true,
    prioritySupport: true
  },
  brahmastra: {
    crmLeadsLimit: 999999,
    usersLimit: 50,
    chanakyaQueriesMonthly: 10000,
    conversationAnalysisMonthly: 5000,
    researchedLeadsMonthly: 1000,
    videosMonthly: 50,
    voiceAgents: true,
    agenticDashboard: true,
    dedicatedMemory: true,
    customIntegrations: true,
    prioritySupport: true
  }
};
