/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Video, TrendingUp, Filter, Database, Bot, CheckCircle2, 
  ArrowRight, ShieldCheck, HelpCircle, PhoneCall, Sparkles, Building2, Eye
} from 'lucide-react';

export default function Solutions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('creative-production');

  useEffect(() => {
    const tabParam = searchParams.get('type') || searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const tabs = [
    { id: 'creative-production', label: 'Creative Production', icon: Video },
    { id: 'growth-marketing', label: 'Growth Marketing', icon: TrendingUp },
    { id: 'lead-generation', label: 'Lead Capture', icon: Filter },
    { id: 'crm-pipeline', label: 'CRM & Pipelines', icon: Database },
    { id: 'ai-automation', label: 'AI & Automation', icon: Bot },
  ];

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setSearchParams({ tab: id });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 bg-white border border-slate-100 px-2.5 py-1 rounded font-semibold">
            SYSTEM CAPABILITIES
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-astra-navy tracking-tight">
            Comprehensive Growth Systems.
          </h1>
          <p className="text-slate-500 text-sm">
            We build and connect all five operational layers into a single autonomous business dashboard.
          </p>
        </div>

        {/* Modular Tabs Navigation */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-slate-200 pb-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-semibold border transition ${
                  isSelected 
                    ? 'bg-astra-navy text-white border-astra-navy shadow' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-astra-gold' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Tab Content rendering */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-md p-8 sm:p-10">
          {activeTab === 'creative-production' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="text-[10px] font-mono text-astra-gold uppercase tracking-widest font-bold">Layer 01 / Attention Asset</span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-astra-navy">Cinematic & Conversion-grade Creative Production</h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  We are backed by more than eight years of photography, videography, drone flying, and professional grading. We do not shoot generic clips; we craft high-attention visual hooks that stop users from scrolling and command action.
                </p>
                <div className="space-y-3.5 text-xs text-slate-600">
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-astra-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Cinematic walkthroughs:</strong> High-end property tours, medical facility walkthroughs, and hotel reels.</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-astra-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Professional Drone Shoots:</strong> Beautiful cinematic aerial angles of building layouts and plot developments.</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-astra-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Pre-graded Reels:</strong> High-converting 9:16 mobile formats ready for immediate performance ad placement.</span>
                  </div>
                </div>
                <div className="pt-2">
                  <Link to="/contact" className="text-xs font-bold text-white bg-astra-navy px-5 py-2.5 rounded hover:bg-astra-gold hover:text-astra-navy transition">
                    Schedule Photography Shoot
                  </Link>
                </div>
              </div>
              <div className="aspect-video bg-slate-50 rounded-xl overflow-hidden border border-slate-100 relative">
                <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800" alt="Creative Camera Gear" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-astra-navy/50 to-transparent flex items-end p-6">
                  <p className="text-xs text-white font-semibold">8+ Years Professional Editing & Production Experience</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'growth-marketing' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="text-[10px] font-mono text-astra-gold uppercase tracking-widest font-bold">Layer 02 / Distribution</span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-astra-navy">Highly Targeted Performance Ad Campaigns</h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  We deploy your brand assets onto Meta Ads, Instagram campaigns, and Google Search campaigns with strict localized filters. We optimize strictly for verified buyers—no vanity metrics or fake likes.
                </p>
                <div className="space-y-3.5 text-xs text-slate-600">
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-astra-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Localized Micro-Targeting:</strong> Target high-net-worth neighborhoods and specific buyer postal codes.</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-astra-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Transparent Budget Setup:</strong> All ad accounts are linked directly to your corporate cards. We do not markup spends.</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-astra-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Continuous Funnel Optimisation:</strong> Daily updates to creatives and bidding algorithms to lower cost-per-lead.</span>
                  </div>
                </div>
                <div className="pt-2">
                  <Link to="/growth-system-builder" className="text-xs font-bold text-white bg-astra-navy px-5 py-2.5 rounded hover:bg-astra-gold hover:text-astra-navy transition">
                    Calculate Ideal Campaign Budget
                  </Link>
                </div>
              </div>
              <div className="aspect-video bg-slate-50 rounded-xl overflow-hidden border border-slate-100 relative">
                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" alt="Campaign Growth Analytics" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-astra-navy/50 to-transparent flex items-end p-6">
                  <p className="text-xs text-white font-semibold">Strict ROI-driven Ad Placements</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lead-generation' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="text-[10px] font-mono text-astra-gold uppercase tracking-widest font-bold">Layer 03 / Demand Capture</span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-astra-navy">Headless Landing Pages & High-efficiency Webhooks</h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  We design custom high-converting web forms and landing pages integrated directly with syntax verifications. This eliminates spelling errors, fake numbers, and curiosity clicks before they enter your CRM.
                </p>
                <div className="space-y-3.5 text-xs text-slate-600">
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-astra-gold mt-0.5 flex-shrink-0" />
                    <span><strong>0.2-Second Server Webhooks:</strong> Immediate parsing of submissions to trigger instant follow-ups.</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-astra-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Active Phone Number Validation:</strong> Checks for active whatsapp numbers to avoid administrative wastes.</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-astra-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Mobile-Optimised UI:</strong> 100% fluid layouts load in under 1 second on cellular networks.</span>
                  </div>
                </div>
                <div className="pt-2">
                  <Link to="/packages" className="text-xs font-bold text-white bg-astra-navy px-5 py-2.5 rounded hover:bg-astra-gold hover:text-astra-navy transition">
                    Explore Setup Packages
                  </Link>
                </div>
              </div>
              <div className="aspect-video bg-slate-50 rounded-xl overflow-hidden border border-slate-100 relative">
                <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800" alt="Headless developer" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
          )}

          {activeTab === 'crm-pipeline' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="text-[10px] font-mono text-astra-gold uppercase tracking-widest font-bold">Layer 04 / Sales Organization</span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-astra-navy">Pipeline Setup & Automatic Agent Routing</h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  We organize your sales backend so you never lose a prospect to delayed spreadsheets. Track your exact deals value, automate site-visit task card creation, and distribute hot leads to executives using round-robin rules.
                </p>
                <div className="space-y-3.5 text-xs text-slate-600">
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-astra-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Automated Assignment Rules:</strong> Distribute leads instantly to online agents to lower response times.</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-astra-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Site-visit Kanban Boards:</strong> Complete overview of active site visits, offers, and negotiations.</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-astra-gold mt-0.5 flex-shrink-0" />
                    <span><strong>CRM Migrations:</strong> Complete onboarding of your existing databases into unified setups.</span>
                  </div>
                </div>
                <div className="pt-2">
                  <Link to="/book-strategy-call" className="text-xs font-bold text-white bg-astra-navy px-5 py-2.5 rounded hover:bg-astra-gold hover:text-astra-navy transition">
                    Design My CRM Pipeline Structure
                  </Link>
                </div>
              </div>
              <div className="aspect-video bg-slate-50 rounded-xl overflow-hidden border border-slate-100 relative">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" alt="Kanban Pipeline Board" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
          )}

          {activeTab === 'ai-automation' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="text-[10px] font-mono text-astra-gold uppercase tracking-widest font-bold">Layer 05 / Conversational Conversion</span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-astra-navy">WhatsApp API Integrations & Chanakya AI Representatives</h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Bypass delay completely. When a user submits an enquiry, they instantly receive your brochure on WhatsApp. Our bots qualify their budget, capture appointment dates, and pass clean strategy briefs to your team in real time.
                </p>
                <div className="space-y-3.5 text-xs text-slate-600">
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-astra-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Under 5-Second Response:</strong> Auto-deliver custom PDF brochures or clinic itineraries instantly.</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-astra-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Chanakya AI Consultant:</strong> Multi-lingual intelligent bot integrated with server-side reasoning.</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-astra-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Calendar Integrations:</strong> Instantly check real-time availability and confirm strategy slots.</span>
                  </div>
                </div>
                <div className="pt-2">
                  <Link to="/talk-to-chanakya" className="text-xs font-bold text-white bg-astra-navy px-5 py-2.5 rounded hover:bg-astra-gold hover:text-astra-navy transition inline-flex items-center space-x-1.5">
                    <Bot className="w-4 h-4" />
                    <span>Test Chanakya Advisor Live</span>
                  </Link>
                </div>
              </div>
              <div className="aspect-video bg-slate-50 rounded-xl overflow-hidden border border-slate-100 relative">
                <img src="https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&q=80&w=800" alt="Artificial Intelligence Consultation" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA Block */}
        <div className="bg-astra-navy text-white rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden shadow-lg border border-white/10 space-y-4">
          <div className="absolute inset-0 geo-pattern opacity-10 pointer-events-none" />
          <h3 className="font-display font-bold text-xl sm:text-2xl">Want to Connect All Five Systems?</h3>
          <p className="text-slate-300 text-xs leading-relaxed max-w-xl mx-auto">
            Audit your marketing leakages in 2 minutes using our diagnostic System Builder, or schedule a 1-on-1 strategy call with our principal strategist.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link to="/growth-system-builder" className="text-xs text-astra-navy bg-astra-gold hover:bg-white font-bold px-6 py-3 rounded transition shadow">
              Build My Growth System
            </Link>
            <Link to="/book-strategy-call" className="text-xs text-white bg-white/10 hover:bg-white/20 border border-white/20 font-bold px-6 py-3 rounded transition">
              Book a Strategy Call
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
