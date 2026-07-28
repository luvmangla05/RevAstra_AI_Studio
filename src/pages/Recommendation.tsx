/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { 
  ShieldAlert, Bot, CheckCircle2, ArrowRight, Download, Sparkles, 
  HelpCircle, Printer, MessageSquare, PhoneCall, Building 
} from 'lucide-react';
import { Assessment } from '../types';

export default function Recommendation() {
  const { id } = useParams<{ id: string }>();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResult() {
      try {
        const response = await fetch(`/api/db/assessments/${id}`);
        if (!response.ok) throw new Error("Recommendation not found");
        const data = await response.json();
        setAssessment(data);
      } catch (err) {
        console.error(err);
        setError("The specified strategic audit could not be loaded. Showing standard baseline guidelines.");
      } finally {
        setLoading(false);
      }
    }
    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 text-center">
        <div className="space-y-4">
          <div className="w-10 h-10 border-4 border-astra-gold border-t-astra-navy rounded-full animate-spin mx-auto" />
          <p className="font-display font-semibold text-slate-500 text-sm">Parsing audit scores...</p>
        </div>
      </div>
    );
  }

  // Fallback diagnostic if fetch fails or is mocked
  const activeAssessment: Assessment = assessment || {
    id: "fallback_rec",
    contactName: "Growth Partner",
    email: "partner@revastra.pro",
    phone: "+91 95000 12000",
    companyName: "Your Business Corporation",
    industry: "builders",
    marketCountry: "India & International",
    locationsCount: 2,
    monthlyEnquiries: "100-500",
    leadSources: ["Meta Ads"],
    servicesNeeded: ["Creative Production", "AI Automation"],
    biggestProblem: "Slow follow-up with manual sheets",
    trackingMethod: "Spreadsheets",
    responseSpeed: "Within 2-4 hours",
    followUpConsistency: "Manual & inconsistent",
    desiredOutcomes: ["Instant auto-response"],
    existingTools: ["Excel"],
    teamSize: 5,
    urgency: "Immediate",
    budgetRange: "₹45,000 - ₹1,20,000",
    createdAt: new Date().toISOString(),
    scores: {
      creative: 45,
      marketing: 55,
      leadCapture: 35,
      salesProcess: 25,
      automation: 15,
      leakRisk: 82,
      complexity: 65
    },
    recommendedPackage: "arjuna",
    analysisText: "Strategic Baseline Analysis: Your operational pipeline indicates highly critical revenue leakage (82%). When enquiries wait 2 hours for brochure delivery, conversion likelihood drops by 80%. We advise implementing the ARJUNA or ASTRA systems to auto-deliver properties details in 5 seconds."
  };

  // Recharts formatted data
  const radarData = [
    { subject: 'Creative Asset Strength', A: activeAssessment.scores.creative, fullMark: 100 },
    { subject: 'Campaign Performance', A: activeAssessment.scores.marketing, fullMark: 100 },
    { subject: 'Lead Capture Verification', A: activeAssessment.scores.leadCapture, fullMark: 100 },
    { subject: 'Sales Routing speed', A: activeAssessment.scores.salesProcess, fullMark: 100 },
    { subject: 'AI Bot Automation', A: activeAssessment.scores.automation, fullMark: 100 },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Main Alert Header Banner */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-md p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-2 bg-astra-gold" />
          
          <div className="space-y-2">
            <span className="text-[9px] font-mono font-bold uppercase bg-red-100 text-red-700 px-2.5 py-1 rounded">
              DIAGNOSTIC COMPLETED: HIGH RISK LEAKS DETECTED
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-astra-navy tracking-tight">
              Strategic Growth Plan for {activeAssessment.companyName}
            </h1>
            <p className="text-xs text-slate-400">
              Registered on {new Date(activeAssessment.createdAt).toLocaleDateString()} for {activeAssessment.contactName}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => window.print()}
              className="p-2 border border-slate-200 text-slate-500 hover:text-astra-navy rounded bg-white hover:bg-slate-50 transition text-xs font-semibold flex items-center space-x-1"
            >
              <Printer className="w-4 h-4" />
              <span>Print Diagnostic</span>
            </button>
            <Link 
              to="/book-strategy-call"
              className="px-4 py-2 bg-astra-navy text-white hover:bg-astra-gold hover:text-astra-navy text-xs font-bold rounded transition flex items-center space-x-1 shadow"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Lock Slot</span>
            </Link>
          </div>
        </div>

        {/* Dynamic score visualization Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Recharts Radar Graph block */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm md:col-span-2 flex flex-col justify-between">
            <div>
              <h3 className="font-display font-bold text-sm text-astra-navy flex items-center">
                <Sparkles className="w-4 h-4 text-astra-gold mr-1.5" />
                Growth Readiness Architecture (Radar Plot)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Calculated readiness indices across 5 operational pillars.</p>
            </div>
            
            <div className="h-64 sm:h-72 w-full mt-4 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="rgba(100, 116, 139, 0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#0F172A', fontSize: 10, fontWeight: 500 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 8 }} />
                  <Radar name="Readiness Index" dataKey="A" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-5 gap-2 border-t border-slate-50 pt-4 text-[10px] text-center text-slate-500 font-mono">
              <div>
                <p className="font-bold text-slate-800">{activeAssessment.scores.creative}%</p>
                <p>Creative</p>
              </div>
              <div>
                <p className="font-bold text-slate-800">{activeAssessment.scores.marketing}%</p>
                <p>Marketing</p>
              </div>
              <div>
                <p className="font-bold text-slate-800">{activeAssessment.scores.leadCapture}%</p>
                <p>Capture</p>
              </div>
              <div>
                <p className="font-bold text-slate-800">{activeAssessment.scores.salesProcess}%</p>
                <p>Routing</p>
              </div>
              <div>
                <p className="font-bold text-slate-800">{activeAssessment.scores.automation}%</p>
                <p>AI Bot</p>
              </div>
            </div>
          </div>

          {/* Revenue Leakage Risk Gauge / Score */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-sm text-astra-navy flex items-center">
                <ShieldAlert className="w-4.5 h-4.5 text-red-500 mr-1.5" />
                Revenue Leakage Risk
              </h3>
              <p className="text-[11px] text-slate-400">Probability of missed follow-ups and lost pipeline values.</p>
            </div>

            <div className="text-center py-4 relative flex flex-col items-center justify-center">
              <span className="font-display text-6xl font-extrabold text-red-600 tracking-tight">
                {activeAssessment.scores.leakRisk}%
              </span>
              <span className="text-[10px] font-mono font-bold uppercase text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full mt-2 inline-block">
                Critical Leak Bracket
              </span>
            </div>

            <div className="space-y-3.5 border-t border-slate-50 pt-4 text-xs">
              <div className="flex justify-between items-center text-slate-500">
                <span>Response Speed Delay:</span>
                <span className="font-semibold text-slate-700">{activeAssessment.responseSpeed}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>Follow-Up Routine:</span>
                <span className="font-semibold text-slate-700">{activeAssessment.followUpConsistency}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>Current Tracking Tool:</span>
                <span className="font-semibold text-slate-700">{activeAssessment.trackingMethod}</span>
              </div>
            </div>

            <div className="bg-red-50 p-3 rounded border border-red-100 text-[11px] text-red-700 leading-normal">
              Based on your response latency ({activeAssessment.responseSpeed}), you are currently losing out on early-mover deals to regional competitors.
            </div>
          </div>

        </div>

        {/* Deterministic Operational Maturity Audit Block */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="font-display font-bold text-sm text-astra-navy flex items-center">
              <Sparkles className="w-4 h-4 text-astra-gold mr-1.5" />
              Deterministic Operational Maturity Audit
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Transparent capability ranking across key structural dimensions.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
              <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400">Creative Readiness</span>
              <p className="font-display font-bold text-slate-800 text-sm mt-1">
                {(activeAssessment.maturityLevels?.creativeReadiness || 
                 ((activeAssessment.servicesNeeded?.includes("Creative Production") || activeAssessment.servicesNeeded?.includes("Cinematic Photos")) ? "Needs Attention" : "Developing"))}
              </p>
            </div>

            <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
              <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400">Marketing Readiness</span>
              <p className="font-display font-bold text-slate-800 text-sm mt-1">
                {(activeAssessment.maturityLevels?.marketingReadiness || 
                 ((activeAssessment.leadSources && activeAssessment.leadSources.length > 0) ? "Developing" : "Needs Attention"))}
              </p>
            </div>

            <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
              <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400">Lead-Management Maturity</span>
              <p className="font-display font-bold text-slate-800 text-sm mt-1">
                {(activeAssessment.maturityLevels?.leadManagementMaturity || 
                 (activeAssessment.trackingMethod === "Spreadsheets" || activeAssessment.trackingMethod === "Google Sheets" || activeAssessment.trackingMethod === "Excel" ? "Developing" : (activeAssessment.trackingMethod === "CRM" ? "High" : "Needs Attention")))}
              </p>
            </div>

            <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
              <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400">Follow-Up Maturity</span>
              <p className="font-display font-bold text-slate-800 text-sm mt-1">
                {(activeAssessment.maturityLevels?.followUpMaturity || 
                 ((activeAssessment.followUpConsistency?.toLowerCase().includes("automated") || activeAssessment.followUpConsistency?.toLowerCase().includes("active")) ? "High" : (activeAssessment.followUpConsistency?.toLowerCase().includes("manual") ? "Developing" : "Needs Attention")))}
              </p>
            </div>

            <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
              <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400">Automation Readiness</span>
              <p className="font-display font-bold text-slate-800 text-sm mt-1">
                {(activeAssessment.maturityLevels?.automationReadiness || 
                 ((activeAssessment.servicesNeeded?.includes("AI website agents") || activeAssessment.servicesNeeded?.includes("WhatsApp bots") || activeAssessment.servicesNeeded?.includes("AI & WhatsApp Automation")) ? "High" : "Developing"))}
              </p>
            </div>

            <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
              <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400">Reporting Maturity</span>
              <p className="font-display font-bold text-slate-800 text-sm mt-1">
                {(activeAssessment.maturityLevels?.reportingMaturity || 
                 (activeAssessment.trackingMethod === "CRM" ? "High" : "Needs Attention"))}
              </p>
            </div>

            <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
              <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400">Operational Complexity</span>
              <p className="font-display font-bold text-slate-800 text-sm mt-1">
                {(activeAssessment.maturityLevels?.operationalComplexity || 
                 ((activeAssessment.locationsCount > 3 || activeAssessment.teamSize > 15) ? "High" : "Medium"))}
              </p>
            </div>

            <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
              <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400">Urgency</span>
              <p className="font-display font-bold text-slate-800 text-sm mt-1">
                {(activeAssessment.maturityLevels?.urgency || 
                 (activeAssessment.urgency?.toLowerCase().includes("immediate") ? "High" : "Medium"))}
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Recommended starting system:</span>
            <span className="font-display font-extrabold text-astra-gold bg-astra-navy px-3.5 py-1.5 rounded uppercase tracking-wider text-[10px]">
              {(activeAssessment.maturityLevels?.recommendedPackage || 
                (activeAssessment.recommendedPackage === "saarthi" ? "Saarthi — Growth Foundation" : (activeAssessment.recommendedPackage === "arjuna" ? "Arjuna — Growth Accelerator" : (activeAssessment.recommendedPackage === "astra" ? "Astra — AI Growth Operating System" : "Brahmastra — Enterprise Custom System"))))}
            </span>
          </div>
        </div>

        {/* Chanakya AI strategic analysis section */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-md p-8 sm:p-10 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full opacity-50 pointer-events-none" />
          
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-5">
            <Bot className="w-10 h-10 text-astra-gold bg-astra-navy rounded-full p-2" />
            <div>
              <h3 className="font-display font-bold text-lg text-astra-navy">Chanakya's Tactical Growth Analysis</h3>
              <p className="text-xs text-slate-400">Server-side secure reasoning powered by Gemini 3.5 Flash</p>
            </div>
          </div>

          <div className="text-slate-700 leading-relaxed text-sm space-y-4 whitespace-pre-line italic">
            {activeAssessment.analysisText}
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs text-slate-600">
            <span>Calculated Recommended System Package:</span>
            <span className="font-display font-extrabold uppercase bg-astra-navy text-astra-gold px-3 py-1 rounded font-mono text-[10px] tracking-widest border border-astra-gold/30">
              {activeAssessment.recommendedPackage} System
            </span>
          </div>
        </div>

        {/* Selected parameters summary card */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
          <h3 className="font-display font-bold text-sm text-astra-navy">Your Checked Parameters Summary</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-500">
            <div>
              <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Primary Industry</p>
              <p className="font-semibold text-slate-700 mt-0.5 capitalize">{activeAssessment.industry}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Market Target</p>
              <p className="font-semibold text-slate-700 mt-0.5">{activeAssessment.marketCountry}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Enquiry Vol.</p>
              <p className="font-semibold text-slate-700 mt-0.5">{activeAssessment.monthlyEnquiries}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Active projects</p>
              <p className="font-semibold text-slate-700 mt-0.5">{activeAssessment.locationsCount} location(s)</p>
            </div>
          </div>
          <div className="pt-2">
            <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">Requested RevAstra Services</p>
            <div className="flex flex-wrap gap-1.5">
              {activeAssessment.servicesNeeded?.map((s, idx) => (
                <span key={idx} className="bg-slate-50 text-slate-600 border border-slate-100 px-2 py-0.5 rounded text-[10px] font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Booking Callout */}
        <div className="bg-astra-navy text-white rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden shadow-xl border border-white/10 space-y-6">
          <div className="absolute inset-0 geo-pattern opacity-10 pointer-events-none" />
          <h3 className="font-display font-bold text-xl sm:text-2xl">Ready to Lock in Your Automated Growth System?</h3>
          <p className="text-slate-300 text-xs leading-relaxed max-w-xl mx-auto">
            Book a 30-minute personal strategy session directly with our systems engineers. We will build out your custom CRM diagrams, agent scripts, and creative brief, free of cost.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link 
              to="/book-strategy-call" 
              className="w-full sm:w-auto text-xs text-astra-navy bg-astra-gold hover:bg-white font-bold px-6 py-3 rounded transition-all shadow"
            >
              Secure Strategy Call Slot
            </Link>
            <Link 
              to="/" 
              className="w-full sm:w-auto text-xs text-white bg-white/10 hover:bg-white/20 border border-white/20 font-bold px-6 py-3 rounded transition-all"
            >
              Return Home
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
