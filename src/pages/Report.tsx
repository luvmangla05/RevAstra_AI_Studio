/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Bot, CheckCircle2, ArrowRight, Download, Sparkles, Printer, 
  PhoneCall, Building, ShieldAlert, Layers, ExternalLink, Calendar,
  MessageSquare, ChevronRight, BarChart, FileText, RefreshCw
} from 'lucide-react';

interface ReportData {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  industry: string;
  businessType: string;
  leadSources: string;
  enquiryVolume: string;
  responseSpeed: string;
  crm: string;
  followUpProcess: string;
  teamSize: number;
  desiredOutcome: string;
  scores: {
    leadCapture: number;
    responseDelayRisk: number;
    crmHygiene: number;
    followUpMaturity: number;
    automationReadiness: number;
  };
  recommendedPackage: string;
  createdAt: string;
  aiExplanations: {
    businessSummary: string;
    primaryBottleneck: string;
    supportingGaps: string;
    systemMaturity: string;
    recommendedWorkflow: string;
    recommendedServices: string[];
    implementationPriorities: string[];
    nextStep: string;
  };
}

export default function Report() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        const response = await fetch(`/api/db/reports/${id}`);
        if (!response.ok) throw new Error("Consultation Report not found");
        const data = await response.json();
        setReport(data);
      } catch (err) {
        console.error(err);
        setError("Your specific consultation report could not be retrieved from this session node. Showing compiled diagnostic baseline guidelines.");
      } finally {
        setLoading(false);
      }
    }
    if (id && id !== 'rep_fallback') {
      fetchReport();
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center py-20 text-center font-sans">
        <div className="space-y-4">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono text-xs text-slate-400 tracking-wider">RETRIEVING CHANAKYA DIAGNOSTIC MATRIX...</p>
        </div>
      </div>
    );
  }

  // Pure deterministic fallback matching exactly the standard schema if no API or id is found
  const activeReport: ReportData = report || {
    id: id || "rep_fallback",
    companyName: "Your Enterprise Company",
    contactName: "Growth Partner",
    email: "growth@yourcompany.com",
    phone: "+91 99999 88888",
    industry: "Builders & Developers",
    businessType: "Property Developer",
    leadSources: "Meta Ads & Website Enquiries",
    enquiryVolume: "150 leads/month",
    responseSpeed: "Delayed (2-3 hours)",
    crm: "Spreadsheets (Google Sheets)",
    followUpProcess: "Manual callback, no auto-reminders",
    teamSize: 8,
    desiredOutcome: "Automate brochure delivery and capture leads instantly on WhatsApp",
    scores: {
      leadCapture: 35,
      responseDelayRisk: 85,
      crmHygiene: 45,
      followUpMaturity: 40,
      automationReadiness: 75
    },
    recommendedPackage: "Astra",
    createdAt: new Date().toISOString(),
    aiExplanations: {
      businessSummary: "Business Summary: Operating as a property developer handling approximately 150 leads/month generated through Meta campaign ads. Currently, your pipeline experiences severe friction due to delayed response times and a reliance on manual sheet exports.",
      primaryBottleneck: "Primary Bottleneck: Leads are left hanging for hours because reps must manually format brochures and send them via WhatsApp Web. This manual lag means most of your marketing budget is leaking before leads are even qualified.",
      supportingGaps: "Supporting Gaps: There is no systematic CRM configuration. Follow-ups are handled manually when reps have time, leading to inconsistent buyer experiences and lost site visits.",
      systemMaturity: "System Maturity: Computed scores reveal high response delay risk (85%) and low lead capture verification (35%). The current system is highly vulnerable to attrition.",
      recommendedWorkflow: "Recommended Workflow: We recommend deploying the RevAstra connected pipeline where Meta leads automatically trigger an instant WhatsApp message (delivering brochures in 5 seconds) and get routed immediately to the right sales reps.",
      recommendedServices: [
        "Astra AI Conversational Agent",
        "Official WhatsApp Business API integration",
        "Automated PDF Brochure Webhooks",
        "Unified Multi-channel CRM Pipeline Setup"
      ],
      implementationPriorities: [
        "Deploy the 5-second brochure delivery webhook to avoid lead rot",
        "Set up instant lead routing to trigger WhatsApp notifications to reps",
        "Integrate automated CRM reminders for non-responsive leads"
      ],
      nextStep: "Arrange a systems blueprint meeting with Loukesh to design the precise automation integrations."
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#030712] min-h-screen text-white font-sans selection:bg-amber-400 selection:text-slate-950 pb-20 print:bg-white print:text-black">
      
      {/* Background decoration (hidden in print) */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none print:hidden" />
      <div className="absolute top-[30%] right-0 w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none print:hidden" />

      {/* Main Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Navigation Breadcrumb & Actions */}
        <div className="flex justify-between items-center border-b border-white/5 pb-4 print:hidden">
          <Link to="/" className="text-xs font-mono font-bold text-slate-400 hover:text-amber-400 transition flex items-center space-x-1">
            <span>← Return to Chanakya</span>
          </Link>

          <div className="flex items-center space-x-3">
            <button 
              onClick={handlePrint}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono font-bold flex items-center space-x-2 transition text-slate-300 hover:text-white"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print Report / PDF</span>
            </button>
          </div>
        </div>

        {/* ERROR / STALE BANNER */}
        {error && (
          <div className="p-4 bg-amber-400/10 border border-amber-400/20 text-amber-400 rounded-xl text-xs flex items-start space-x-2.5 print:hidden">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <div>
              <span className="font-bold">System Notification:</span> {error}
            </div>
          </div>
        )}

        {/* HEADER BRANDING CARD */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6 print:bg-transparent print:border-black/15 print:p-0">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] font-mono font-bold tracking-[0.2em] px-3 py-1 rounded-full uppercase print:border-black/20 print:text-black">
              <Bot className="w-3.5 h-3.5" />
              <span>Chanakya RevOps System Diagnosis</span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-white print:text-black">
              Bespoke Growth System Report
            </h1>
            <p className="text-xs text-slate-400 font-mono print:text-slate-600">
              REPORT REF ID: <span className="text-amber-400 font-bold print:text-black">{activeReport.id}</span> • COMPILED ON {new Date(activeReport.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 text-right font-mono min-w-[200px] print:border-black/20 print:bg-transparent">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Recommended System</span>
            <span className="text-lg font-black text-amber-400 uppercase tracking-widest block mt-1 print:text-black">
              {activeReport.recommendedPackage}
            </span>
            <span className="text-[9px] text-slate-400 block mt-0.5">RevAstra Core Platform</span>
          </div>
        </div>

        {/* REPORT CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT CONTAINER - CORE DATA & SCORES (Lg: 8 cols) */}
          <div className="lg:col-span-8 space-y-8">

            {/* SECTION 1: BUSINESS SUMMARY */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-white/5 space-y-4 print:border-black/15 print:bg-transparent print:p-0">
              <h3 className="font-display font-bold text-lg text-amber-400 flex items-center space-x-2 border-b border-white/5 pb-2 print:text-black print:border-black/10">
                <Building className="w-5 h-5 text-amber-400 print:text-black" />
                <span>1. Business Summary</span>
              </h3>
              <p className="text-sm leading-relaxed text-slate-300 print:text-black">
                {activeReport.aiExplanations.businessSummary}
              </p>

              {/* Dynamic Table parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 text-xs font-mono">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 print:border-black/15 print:bg-transparent">
                  <span className="text-slate-500 uppercase block font-bold text-[9px]">Company</span>
                  <span className="text-slate-200 block mt-1 font-bold print:text-black truncate">{activeReport.companyName}</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 print:border-black/15 print:bg-transparent">
                  <span className="text-slate-500 uppercase block font-bold text-[9px]">Representative</span>
                  <span className="text-slate-200 block mt-1 font-bold print:text-black truncate">{activeReport.contactName}</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 print:border-black/15 print:bg-transparent">
                  <span className="text-slate-500 uppercase block font-bold text-[9px]">Industry</span>
                  <span className="text-slate-200 block mt-1 font-bold print:text-black truncate">{activeReport.industry}</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 print:border-black/15 print:bg-transparent">
                  <span className="text-slate-500 uppercase block font-bold text-[9px]">Volume Scale</span>
                  <span className="text-slate-200 block mt-1 font-bold print:text-black truncate">{activeReport.enquiryVolume}</span>
                </div>
              </div>
            </div>

            {/* SECTION 2: PRIMARY BOTTLENECK */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-white/5 space-y-4 print:border-black/15 print:bg-transparent print:p-0">
              <h3 className="font-display font-bold text-lg text-red-400 flex items-center space-x-2 border-b border-white/5 pb-2 print:text-black print:border-black/10">
                <ShieldAlert className="w-5 h-5 text-red-400 print:text-black" />
                <span>2. Primary Bottleneck</span>
              </h3>
              <p className="text-sm leading-relaxed text-slate-300 print:text-black">
                {activeReport.aiExplanations.primaryBottleneck}
              </p>
            </div>

            {/* SECTION 3: SUPPORTING GAPS */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-white/5 space-y-4 print:border-black/15 print:bg-transparent print:p-0">
              <h3 className="font-display font-bold text-lg text-amber-500 flex items-center space-x-2 border-b border-white/5 pb-2 print:text-black print:border-black/10">
                <Layers className="w-5 h-5 text-amber-500 print:text-black" />
                <span>3. Supporting Gaps</span>
              </h3>
              <p className="text-sm leading-relaxed text-slate-300 print:text-black">
                {activeReport.aiExplanations.supportingGaps}
              </p>
            </div>

            {/* SECTION 4: SYSTEM MATURITY AUDIT SCORES */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-white/5 space-y-6 print:border-black/15 print:bg-transparent print:p-0">
              <h3 className="font-display font-bold text-lg text-amber-400 flex items-center space-x-2 border-b border-white/5 pb-2 print:text-black print:border-black/10">
                <BarChart className="w-5 h-5 text-amber-400 print:text-black" />
                <span>4. System Maturity & Verification Scores</span>
              </h3>
              <p className="text-sm text-slate-300 print:text-black">
                {activeReport.aiExplanations.systemMaturity}
              </p>

              {/* Dynamic Score Bars */}
              <div className="space-y-4">
                {[
                  { name: "Lead Capture Verification", score: activeReport.scores.leadCapture, desc: "Ability to instantly receive and log enquiries." },
                  { name: "Response Delay Risk (Lower is better)", score: activeReport.scores.responseDelayRisk, desc: "Risk of pipeline leak due to manual callback lag.", color: "bg-red-500" },
                  { name: "CRM Database Hygiene", score: activeReport.scores.crmHygiene, desc: "Integrity and organization of stored leads.", color: "bg-blue-500" },
                  { name: "Follow-up Consistency Maturity", score: activeReport.scores.followUpMaturity, desc: "Frequency and automation of client touchpoints." },
                  { name: "Automation Readiness Scale", score: activeReport.scores.automationReadiness, desc: "Readiness to absorb direct workflow automation." }
                ].map((s, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-200 print:text-black">{s.name}</span>
                      <span className="font-mono font-bold text-amber-400 print:text-black">{s.score}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden print:border print:border-black">
                      <div 
                        className={`h-full ${s.color || 'bg-amber-400'} rounded-full`} 
                        style={{ width: `${s.score}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono print:text-slate-600">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 5: RECOMMENDED AUTOMATED WORKFLOW */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-white/5 space-y-4 print:border-black/15 print:bg-transparent print:p-0">
              <h3 className="font-display font-bold text-lg text-amber-400 flex items-center space-x-2 border-b border-white/5 pb-2 print:text-black print:border-black/10">
                <RefreshCw className="w-5 h-5 text-amber-400 animate-spin print:text-black" style={{ animationDuration: '8s' }} />
                <span>5. Recommended Connected Workflow</span>
              </h3>
              <p className="text-sm leading-relaxed text-slate-300 print:text-black">
                {activeReport.aiExplanations.recommendedWorkflow}
              </p>
            </div>

          </div>

          {/* RIGHT SIDEBAR - SERVICES, PRIORITIES & NEXT STEPS (Lg: 4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* RECOMMENDED SERVICES CARD */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 space-y-4 print:border-black/15 print:bg-transparent">
              <h4 className="font-display font-black text-xs text-amber-400 tracking-wider uppercase">
                Recommended Services
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                {activeReport.aiExplanations.recommendedServices.map((srv, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="print:text-black">{srv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* IMPLEMENTATION PRIORITIES CARD */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 space-y-4 print:border-black/15 print:bg-transparent">
              <h4 className="font-display font-black text-xs text-amber-400 tracking-wider uppercase">
                Priorities Grid
              </h4>
              <ul className="space-y-3 text-xs text-slate-300">
                {activeReport.aiExplanations.implementationPriorities.map((pri, index) => (
                  <li key={index} className="space-y-1">
                    <span className="font-mono text-[10px] font-bold text-slate-500 uppercase block">PRIORITY 0{index + 1}</span>
                    <p className="print:text-black leading-relaxed font-medium">{pri}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* IMPLEMENTATION ACTION CARD / NEXT STEP */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 space-y-4 shadow-xl print:bg-transparent print:border print:border-black print:text-black">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-900/60">
                  Next Execution Step
                </span>
                <h4 className="font-display font-black text-sm uppercase tracking-wide">
                  Systems Mapping Session
                </h4>
              </div>
              <p className="text-xs leading-relaxed font-medium">
                {activeReport.aiExplanations.nextStep}
              </p>

              <div className="space-y-2.5 pt-2">
                <Link
                  to="/book-strategy-call"
                  className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition shadow-lg print:border print:border-black print:text-black print:bg-white"
                >
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Book Strategy Call</span>
                </Link>

                <Link
                  to="/contact"
                  className="w-full py-2.5 bg-white/20 hover:bg-white/35 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition border border-slate-950/20 print:border print:border-black"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Talk with Loukesh</span>
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
