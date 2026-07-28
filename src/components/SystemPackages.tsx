/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ArrowRight, Sparkles, HelpCircle, ShieldCheck } from 'lucide-react';

export default function SystemPackages() {
  const [activeTab, setActiveTab] = useState<'creative' | 'marketing' | 'all'>('all');

  const packages = [
    {
      id: 'saarthi',
      name: "Saarthi (Creative Foundation)",
      stage: "1. Standardizing Output",
      subheadline: "Cinematic Media Production",
      tagline: "Establishes a premium, high-impact aesthetic identity before launching promotional campaigns.",
      features: [
        "One full-day cinematic property or brand shoot",
        "5 edited high-retention vertical Reels/Shorts",
        "1 comprehensive horizontal walkthrough video",
        "Color graded cinematic presets for consistency",
        "Professional audio scoring and overlay templates",
        "High-definition digital media delivery library"
      ],
      price: "₹75,000 / month",
      note: "Suited for builders launching a project layout or clinics starting digital outreach",
      category: "creative"
    },
    {
      id: 'arjuna',
      name: "Arjuna (Targeted Acquisition)",
      stage: "2. Deploying Acquisition",
      subheadline: "Direct Lead Acquisition",
      tagline: "Links cinematic creative production directly with high-intent digital advertising funnels.",
      features: [
        "Everything in Saarthi (Ongoing shoots)",
        "Strategic ad management (Meta/Google)",
        "Landing page or instant Lead Form setups",
        "Verified lead verification rule configurations",
        "A/B creative testing & budget optimizations",
        "Weekly performance reports & attribution logs"
      ],
      price: "₹1,50,000 / month",
      note: "Ad spend billed directly; zero agency markup on media budgets",
      isPopular: true,
      category: "marketing"
    },
    {
      id: 'astra',
      name: "Astra (Unified Conversation)",
      stage: "3. Synthesizing Dialog",
      subheadline: "Conversational Automation",
      tagline: "Integrates official WhatsApp API chatbot structures to respond, qualify and route leads instantly.",
      features: [
        "Everything in Arjuna (Media + Ads)",
        "Official WhatsApp API green tick setup",
        "Chanakya Bot custom script integration",
        "Automatic PDF brochure triggers (<12s)",
        "Direct Site Visit calendar booking loops",
        "Instant round-robin salesperson assignment"
      ],
      price: "₹2,50,000 / month",
      note: "Covers standard API usage limits; custom webhook routing included",
      category: "marketing"
    },
    {
      id: 'brahmastra',
      name: "Brahmastra (Autonomous)",
      stage: "4. Autonomous Execution",
      subheadline: "Fully Managed RevOps Operating System",
      tagline: "Our complete, bespoke growth engine. Custom-engineered pipelines from creative to won site-visits.",
      features: [
        "Everything in Astra (Fully managed)",
        "Omni-channel custom pipeline engineering",
        "Bespoke Chanakya voice audio integration",
        "Advanced predictive intent scoring logs",
        "Interactive analytics dashboards for owners",
        "Dedicated account strategist & SLA-backed support"
      ],
      price: "Bespoke / Custom Scope",
      note: "Limited to 3 high-growth developers per quarter",
      category: "all"
    }
  ];

  const filteredPkgs = activeTab === 'all'
    ? packages
    : packages.filter(pkg => pkg.category === activeTab || pkg.id === 'brahmastra');

  return (
    <section className="py-24 bg-white text-astra-navy border-b border-slate-100" id="packages">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
            Modular Growth Scopes
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-astra-navy leading-tight">
            System Packages. Scaling Journeys.
          </h2>
          <p className="text-slate-500 text-lg">
            Track our packages from creative asset generation to complete autonomous pipeline execution.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-100 flex space-x-1">
            {[
              { id: 'all', label: 'View All Journeys' },
              { id: 'creative', label: 'Creative Only' },
              { id: 'marketing', label: 'Marketing & Automation' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                  activeTab === tab.id
                    ? 'bg-astra-navy text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filteredPkgs.map((pkg) => (
            <div 
              key={pkg.id} 
              className={`bg-white rounded-2xl border p-6 flex flex-col justify-between relative shadow-sm hover:shadow-md transition duration-300 ${
                pkg.isPopular ? 'border-astra-gold ring-2 ring-astra-gold/5' : 'border-slate-100'
              }`}
            >
              {pkg.isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-astra-gold text-astra-navy text-[9px] uppercase tracking-widest px-3 py-1 rounded-full font-bold">
                  Most Popular
                </span>
              )}

              <div className="space-y-5">
                <div>
                  <span className="text-[9px] font-mono text-[#C5A880] uppercase tracking-widest font-bold">
                    {pkg.stage}
                  </span>
                  <h4 className="font-display font-extrabold text-base text-astra-navy leading-tight mt-1">{pkg.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{pkg.subheadline}</p>
                </div>
                
                <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                  {pkg.tagline}
                </p>
                
                <ul className="space-y-2.5 text-xs text-slate-600">
                  {pkg.features.map((f, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-astra-gold flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6 space-y-4">
                <div>
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">PRICING STRUCTURE</span>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{pkg.price}</p>
                  <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">{pkg.note}</p>
                </div>
                
                <Link 
                  to="/growth-system-builder" 
                  className={`block text-center py-2.5 rounded-xl text-xs font-bold transition ${
                    pkg.isPopular 
                      ? 'bg-astra-navy hover:bg-astra-navy/95 text-white shadow-md' 
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-100'
                  }`}
                >
                  Select this System
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing guidelines summary */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-slate-500">
          <div>
            <h5 className="font-bold text-astra-navy uppercase text-[10px] tracking-wider mb-1">Creative Assets</h5>
            <p className="leading-relaxed">All media production covers cinematic horizontal edits and color-grading templates.</p>
          </div>
          <div>
            <h5 className="font-bold text-astra-navy uppercase text-[10px] tracking-wider mb-1">Performance Budgets</h5>
            <p className="leading-relaxed">Paid advertising accounts are billed directly. Zero agency markups or hidden fees.</p>
          </div>
          <div>
            <h5 className="font-bold text-astra-navy uppercase text-[10px] tracking-wider mb-1">Automation Limits</h5>
            <p className="leading-relaxed">Astra and Brahmastra include standard WhatsApp API conversation credits.</p>
          </div>
          <div>
            <h5 className="font-bold text-astra-navy uppercase text-[10px] tracking-wider mb-1">Custom Dashboards</h5>
            <p className="leading-relaxed">Track cost per lead, executive response speeds, and campaign attributes live.</p>
          </div>
        </div>

      </div>
    </section>
  );
}
