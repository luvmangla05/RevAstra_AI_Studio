/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Inbox, Zap, Kanban, MessageSquare, Target, Clock, ShieldCheck, 
  Send, UserCheck, CalendarCheck, FileText, Building2, Hotel, Dumbbell, HeartPulse, CheckCircle2
} from 'lucide-react';

export default function ProductModulesDemo() {
  const [activeModule, setActiveModule] = useState<'intelligence' | 'automation' | 'operations'>('intelligence');
  const [selectedLeadId, setSelectedLeadId] = useState('lead-1');
  const [activeIndustry, setActiveIndustry] = useState<'builder' | 'clinic' | 'hotel' | 'gym'>('builder');

  // Simulated Leads for Module 1 (Lead Intelligence)
  const simulatedLeads = [
    {
      id: 'lead-1',
      name: 'Rohan Sharma',
      source: 'Meta Ad Campaign',
      industry: 'Property Buyer',
      intent: 'High Intent - Looking for 3 BHK',
      budget: '₹1.5Cr - ₹2.2Cr',
      timeline: 'Immediate (under 30 days)',
      score: 'A+ Elite Fit',
      scoreColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20',
      reason: 'Requested layout maps, completed 3-question qualification, verified Active WhatsApp number within 12 seconds.',
      action: 'Auto-assign to Luxury Exec + Send Walkthrough Video'
    },
    {
      id: 'lead-2',
      name: 'Dr. Neha Gupta',
      source: 'Google Search Ad',
      industry: 'Clinic Patient',
      intent: 'Qualified Treatment Enquiry',
      budget: 'Premium Ortho treatment',
      timeline: 'Within 2 weeks',
      score: 'A Excellent Fit',
      scoreColor: 'text-sky-400 bg-sky-400/10 border-sky-500/20',
      reason: 'Looking for cosmetic dentistry, clicked directly on dentist availability calendar.',
      action: 'Send Interactive Availability Slots via WhatsApp'
    },
    {
      id: 'lead-3',
      name: 'Grand Solitaire Resorts',
      source: 'Direct Website QR',
      industry: 'Corporate Event',
      intent: 'Bulk Booking Enquiry',
      budget: '₹8L - ₹12L Package',
      timeline: 'Q4 (October launch)',
      score: 'B+ Strong Interest',
      scoreColor: 'text-amber-400 bg-amber-400/10 border-amber-500/20',
      reason: 'Corporate travel coordinator scanned hospitality showcase brochure from regional trade meet.',
      action: 'Trigger Customized PDF Event Packages Catalog'
    },
    {
      id: 'lead-4',
      name: 'Vikram Malhotra',
      source: 'Instagram Stories',
      industry: 'Gym Membership',
      intent: 'Low Intent - Casual Query',
      budget: 'Standard Annual Gym',
      timeline: 'Sometime next month',
      score: 'C Casual Lead',
      scoreColor: 'text-slate-400 bg-slate-400/10 border-slate-500/20',
      reason: 'Submitted Facebook Form with brief single-field contact details, no specific preference selected.',
      action: 'Add to Low-priority 7-day Welcome Drip Sequences'
    },
    {
      id: 'lead-5',
      name: 'Meera Deshmukh',
      source: 'YouTube Pre-Roll ad',
      industry: 'Automotive Test-Drive',
      intent: 'High Intent - E-Tron Interest',
      budget: 'SUV Variant',
      timeline: 'This weekend',
      score: 'A+ Elite Fit',
      scoreColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20',
      reason: 'Requested trade-in valuation check for existing vehicle, provided detailed vehicle state.',
      action: 'Alert Regional Showroom Manager + Set Booking Call'
    }
  ];

  const activeLead = simulatedLeads.find(l => l.id === selectedLeadId) || simulatedLeads[0];

  // Simulated Workflows for Module 2 (Follow-up Automation)
  const workflowTimelines = {
    builder: [
      { step: "Immediate", label: "Instant Acknowledgement", desc: "WhatsApp greeting sent with high-res digital brochure.", type: "system" },
      { step: "5 Minutes", label: "Qualification Bot Chat", desc: "Chanakya Bot asks preferred configuration (2BHK, 3BHK).", type: "bot" },
      { step: "1 Hour", label: "Agent Notification", desc: "CRM registers lead score, assigns executive, schedules site-visit call.", type: "agent" },
      { step: "24 Hours", label: "Value-add Follow-up", desc: "Sends Drone aerial shoot and project launch video to WhatsApp.", type: "system" },
      { step: "Day 3", label: "Site Visit Invitation", desc: "Sends calendar link prompting site visit registration.", type: "bot" }
    ],
    clinic: [
      { step: "Immediate", label: "Instant Patient Welcome", desc: "WhatsApp confirms enquiry, shares practitioner credentials.", type: "system" },
      { step: "3 Minutes", label: "Treatment Selection", desc: "Bot guides patient to select desired service and specialist.", type: "bot" },
      { step: "30 Minutes", label: "Appointment Suggestion", desc: "Provides top 3 open consultation slots for patient choice.", type: "bot" },
      { step: "24 Hours", label: "Consultation Reminder", desc: "Sends location map, directions, and prep checklist for visit.", type: "system" },
      { step: "Day 2", label: "Feedback Loop", desc: "Follows up after consultation with prescription download link.", type: "system" }
    ],
    hotel: [
      { step: "Immediate", label: "Hospitality Greeting", desc: "Confirms dates of interest, shares direct-rate booking catalog.", type: "system" },
      { step: "5 Minutes", label: "Date & Guest Qualifier", desc: "Bot asks for room preference and party size via quick-reply buttons.", type: "bot" },
      { step: "10 Minutes", label: "Direct Handoff", desc: "Notifies reservations desk with guest specifications to lock details.", type: "agent" },
      { step: "24 Hours", label: "Direct Incentive", desc: "Shares direct-booking exclusive benefits (e.g. breakfast, early check-in).", type: "system" },
      { step: "Day 3", label: "Reactivation", desc: "Sends soft prompt for unconfirmed cart sessions to avoid OTA commission.", type: "bot" }
    ],
    gym: [
      { step: "Immediate", label: "Trial Pass Delivery", desc: "Issues digital 3-day guest trial pass QR directly on WhatsApp.", type: "system" },
      { step: "5 Minutes", label: "Goal Assessment", desc: "Bot triggers interactive poll (Weight loss, strength, endurance).", type: "bot" },
      { step: "1 Hour", label: "Trainer Sync", desc: "Routes member preference sheet to dedicated personal training lead.", type: "agent" },
      { step: "Day 1", label: "Class Booking Prompt", desc: "Suggests group classes matching goals, offers instant reservation.", type: "bot" },
      { step: "Day 3", label: "Membership Conversion", desc: "Automates discounted custom member package rates if trial converts.", type: "system" }
    ]
  };

  const activeTimeline = workflowTimelines[activeIndustry];

  // Simulated Pipeline Stages for Module 3 (Sales Operations)
  const pipelineStages = [
    { title: "New Enquiries", count: 12, bg: "bg-slate-800/40 border-slate-700/50", icon: Inbox, color: "text-slate-400" },
    { title: "Qualified / Scored", count: 8, bg: "bg-blue-950/20 border-blue-500/20", icon: ShieldCheck, color: "text-blue-400" },
    { title: "Agent Assigned", count: 6, bg: "bg-amber-950/20 border-amber-500/20", icon: UserCheck, color: "text-amber-400" },
    { title: "Visit Scheduled", count: 4, bg: "bg-emerald-950/20 border-emerald-500/20", icon: CalendarCheck, color: "text-emerald-400" },
    { title: "Won Opportunities", count: 3, bg: "bg-indigo-950/20 border-indigo-500/20", icon: CheckCircle2, color: "text-indigo-400" }
  ];

  const pipelineCards = [
    { name: "Suresh Patel", score: "A+ Elite", value: "3 BHK Premium", owner: "Amit Kumar", lastActive: "12m ago", risk: "Low Risk", riskColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", stage: 3 },
    { name: "Kunal Sen", score: "A Strong", value: "2 BHK Mid", owner: "Priya Das", lastActive: "1h ago", risk: "No Activity", riskColor: "bg-amber-500/10 text-amber-400 border-amber-500/20", stage: 2 },
    { name: "Ananya Roy", score: "A+ Elite", value: "Suite Booking", owner: "Vikram Shah", lastActive: "4m ago", risk: "Low Risk", riskColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", stage: 4 },
    { name: "Rajesh Hedge", score: "B Normal", value: "Dental Implants", owner: "Dr. Neha", lastActive: "3h ago", risk: "Action Needed", riskColor: "bg-rose-500/10 text-rose-400 border-rose-500/20", stage: 1 }
  ];

  return (
    <section className="py-24 bg-white text-astra-navy" id="product-modules">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
            Living Product Modules
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-astra-navy leading-tight">
            Replace Static Features With Living Systems.
          </h2>
          <p className="text-slate-500 text-lg">
            Experience real-time interactive product simulations of lead intelligence, automated scheduling, and CRM operational control.
          </p>
        </div>

        {/* Tab Selection Row */}
        <div className="flex justify-center mb-12">
          <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-100 flex space-x-1">
            {[
              { id: 'intelligence', label: 'Lead Intelligence', icon: Target },
              { id: 'automation', label: 'Follow-up Automation', icon: Zap },
              { id: 'operations', label: 'Sales Operations', icon: Kanban }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveModule(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    activeModule === tab.id
                      ? 'bg-astra-navy text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Interactive Workspace */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl shadow-xl overflow-hidden min-h-[460px] flex flex-col justify-between">
          
          <AnimatePresence mode="wait">
            {/* MODULE 1: LEAD INTELLIGENCE */}
            {activeModule === 'intelligence' && (
              <motion.div 
                key="intelligence"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                {/* Simulated Inbox List (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                      <Inbox className="w-4 h-4 mr-1.5 text-slate-400" />
                      Lead Scoring Inbox (Demo)
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                      5 Total
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-[350px] overflow-y-auto">
                    {simulatedLeads.map((lead) => (
                      <button
                        key={lead.id}
                        onClick={() => setSelectedLeadId(lead.id)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                          selectedLeadId === lead.id
                            ? 'bg-white border-astra-navy shadow-sm'
                            : 'bg-white/60 border-slate-100 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-display font-bold text-xs text-astra-navy">{lead.name}</h4>
                            <p className="text-[10px] text-slate-400">{lead.source}</p>
                          </div>
                          <span className={`text-[9px] font-mono font-extrabold px-2 py-0.5 rounded border ${lead.scoreColor}`}>
                            {lead.score}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lead Profiler Details Panel (7 cols) */}
                <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/60 p-6 flex flex-col justify-between space-y-6 shadow-xs">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="font-display font-extrabold text-base text-astra-navy">
                          {activeLead.name}
                        </h3>
                        <p className="text-xs text-slate-400">Industry Sector Profile: {activeLead.industry}</p>
                      </div>
                      <span className="text-[10px] font-mono bg-slate-50 border border-slate-100 px-2 py-1 rounded">
                        ID: {activeLead.id.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <span className="text-[10px] text-slate-400 block font-mono uppercase">Timeline Gaps</span>
                        <span className="font-bold text-slate-800">{activeLead.timeline}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <span className="text-[10px] text-slate-400 block font-mono uppercase">Inquiry Value Bracket</span>
                        <span className="font-bold text-slate-800">{activeLead.budget}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                        AI Intent Scoring Reason:
                      </h5>
                      <p className="text-xs text-slate-600 leading-relaxed bg-amber-50/40 border border-amber-200/30 p-3 rounded-lg">
                        {activeLead.reason}
                      </p>
                    </div>
                  </div>

                  {/* Actions / Handoff */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Recommended Trigger</span>
                      <p className="text-xs font-bold text-astra-navy">{activeLead.action}</p>
                    </div>
                    <span className="text-[9px] font-mono uppercase bg-astra-navy text-white px-2 py-1 rounded font-bold">
                      QUALIFIED
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* MODULE 2: FOLLOW-UP AUTOMATION */}
            {activeModule === 'automation' && (
              <motion.div 
                key="automation"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="p-6 sm:p-8 space-y-6"
              >
                {/* Industry Selector Sub-Row */}
                <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
                  {[
                    { id: 'builder', label: 'Builders & Real Estate', icon: Building2 },
                    { id: 'clinic', label: 'Medical Clinics', icon: HeartPulse },
                    { id: 'hotel', label: 'Hotel & Hospitality', icon: Hotel },
                    { id: 'gym', label: 'Fitness & Gyms', icon: Dumbbell }
                  ].map((ind) => {
                    const Icon = ind.icon;
                    return (
                      <button
                        key={ind.id}
                        onClick={() => setActiveIndustry(ind.id as any)}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                          activeIndustry === ind.id
                            ? 'bg-white border-astra-navy text-astra-navy shadow-xs'
                            : 'bg-transparent border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{ind.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Workflow Horizontal Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                  {activeTimeline.map((step, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-slate-200/60 p-4 space-y-3 shadow-xs relative flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-mono font-bold bg-astra-navy text-astra-gold px-2 py-0.5 rounded">
                            {step.step}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                            Step 0{idx + 1}
                          </span>
                        </div>
                        <h4 className="font-display font-bold text-xs text-astra-navy pt-1">
                          {step.label}
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>

                      <div className="border-t border-slate-50 pt-2 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-semibold uppercase tracking-wider text-[8px] font-mono">
                          Trigger Mode
                        </span>
                        <span className="text-slate-600 font-bold capitalize">
                          {step.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* MODULE 3: SALES OPERATIONS */}
            {activeModule === 'operations' && (
              <motion.div 
                key="operations"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="p-6 sm:p-8 space-y-6"
              >
                {/* Simulated Pipeline Stages (Columns) */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {pipelineStages.map((stage, idx) => {
                    const StageIcon = stage.icon;
                    return (
                      <div key={idx} className="space-y-3">
                        {/* Pipeline Column Header */}
                        <div className={`p-3 rounded-xl border flex items-center justify-between ${stage.bg}`}>
                          <div className="flex items-center space-x-2">
                            <StageIcon className={`w-4 h-4 ${stage.color}`} />
                            <span className="text-xs font-bold text-slate-800">{stage.title}</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-500 bg-white border px-1.5 py-0.5 rounded">
                            {stage.count}
                          </span>
                        </div>

                        {/* Opportunity cards matching current stage */}
                        <div className="space-y-2">
                          {pipelineCards.filter(card => card.stage === idx || (idx === 0 && card.stage === 0)).map((card, cidx) => (
                            <div key={cidx} className="bg-white border border-slate-100 rounded-xl p-3 space-y-2.5 shadow-xs">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-display font-bold text-xs text-astra-navy">{card.name}</h5>
                                  <span className="text-[9px] text-slate-400 font-mono">Owner: {card.owner}</span>
                                </div>
                                <span className={`text-[8px] font-mono font-semibold px-1.5 py-0.5 rounded border ${card.riskColor}`}>
                                  {card.risk}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-50 pt-2">
                                <span>{card.value}</span>
                                <span className="font-mono">{card.lastActive}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer informational row */}
          <div className="bg-slate-100/60 border-t border-slate-200/60 px-6 py-4 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-1.5" />
              Demo Interface: Click through tabs and items to preview active pipeline automation.
            </span>
            <span className="text-[9px] font-mono bg-white border border-slate-200 px-2 py-0.5 rounded uppercase font-bold tracking-wider text-slate-500">
              No fake metrics inside
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
