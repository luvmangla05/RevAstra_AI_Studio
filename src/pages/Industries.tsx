/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Building2, Home, Hotel, Heart, Dumbbell, Car, CheckCircle2, 
  ArrowRight, ShieldCheck, Cpu, PhoneCall, ChevronRight, Inbox
} from 'lucide-react';
import { INDUSTRIES } from '../data';

export default function Industries() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeIndustryId, setActiveIndustryId] = useState('builders');

  useEffect(() => {
    // Check path or queries
    const indParam = searchParams.get('sector') || searchParams.get('tab');
    if (indParam) {
      setActiveIndustryId(indParam);
    }
  }, [searchParams]);

  const activeIndustry = INDUSTRIES.find(i => i.id === activeIndustryId) || INDUSTRIES[0];

  const getWhatsappFlow = (id: string) => {
    const flows: Record<string, { trigger: string; actions: string[]; escalation: string }> = {
      builders: {
        trigger: 'Buyer submits enquiry on Meta Lead Form or Website.',
        actions: ['Instantly message greeting and PDF floorplan brochure', 'Prompt buyer: "Are you looking for 2 BHK or 3 BHK?"'],
        escalation: 'When buyer picks configuration, forward contact details and selection directly to assigned Sales Rep.'
      },
      'real-estate': {
        trigger: 'Prospect clicks "Schedule View" on listing page.',
        actions: ['Instantly dispatch walkthrough reel video link', 'Offer live calendar slots for on-site visit'],
        escalation: 'Once time-slot selected, trigger calendar notification and invite assigned broker agent.'
      },
      hotels: {
        trigger: 'Guest clicks "Check Room Booking Rates" button.',
        actions: ['Inquire check-in & check-out dates', 'Display available deluxe / premium cottage pricing details'],
        escalation: 'Forward reservation parameters directly to reservation desk to close reservation.'
      },
      clinics: {
        trigger: 'Patient requests specific specialized dental/ortho consultant slots.',
        actions: ['Display doctor profiles & active slot lists', 'Confirm appointment request with patient profile check'],
        escalation: 'Ping receptionist desk and schedule automated WhatsApp and SMS appointment reminders.'
      },
      gyms: {
        trigger: 'Prospect registers for a 3-Day free trial pass.',
        actions: ['Dispatch QR-coded guest pass instantly on WhatsApp', 'Request fitness goals (Weight Loss, Strength, Cardio)'],
        escalation: 'Forward trial goals directly to Gym Manager to lock physical onboarding walk.'
      },
      automotive: {
        trigger: 'Prospect requests test-drive details for custom vehicle configuration.',
        actions: ['Dispatch stunning walkaround media walkthrough', 'Query trade-in valuation interest or credit check options'],
        escalation: 'Forward test-drive slot request and model specs directly to dealership sales consultant.'
      }
    };
    return flows[id] || flows.builders;
  };

  const handleIndustryChange = (id: string) => {
    setActiveIndustryId(id);
    setSearchParams({ sector: id });
  };

  const getIndustryIcon = (id: string) => {
    switch(id) {
      case 'builders': return Building2;
      case 'real-estate': return Home;
      case 'hotels': return Hotel;
      case 'clinics': return Heart;
      case 'gyms': return Dumbbell;
      case 'automotive': return Car;
      default: return Building2;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 bg-white border border-slate-100 px-2.5 py-1 rounded font-semibold">
            SECTOR-SPECIFIC ARCHITECTURE
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-astra-navy tracking-tight">
            Workflows Tailored For Your Industry
          </h1>
          <p className="text-slate-500 text-sm">
            We don't deploy generic marketing. We customize lead rules, messaging, and integrations specifically for your sector.
          </p>
        </div>

        {/* Industry Selection Buttons Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {INDUSTRIES.map((ind) => {
            const Icon = getIndustryIcon(ind.id);
            const isSelected = activeIndustryId === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => handleIndustryChange(ind.id)}
                className={`p-4 border rounded-xl text-center flex flex-col items-center justify-center space-y-2 transition ${
                  isSelected 
                    ? 'bg-astra-navy text-white border-astra-navy shadow-md' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? 'text-astra-gold' : 'text-slate-400'}`} />
                <span className="text-xs font-semibold font-display leading-tight">{ind.name}</span>
              </button>
            );
          })}
        </div>

        {/* Detailed Industry Content Block */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-md p-8 sm:p-10 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left Info Column */}
            <div className="space-y-6">
              <span className="text-[10px] font-mono text-astra-gold uppercase tracking-widest font-bold flex items-center">
                <Cpu className="w-3.5 h-3.5 mr-1.5" /> Core Flow: {activeIndustry.name}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-astra-navy leading-tight">
                Stop Losing Leads in Delayed Handshakes.
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                For {activeIndustry.name}, enquiries expect instant gratification. If you sell luxury villas or book direct boutique rooms, waiting 3 hours to deliver brochures or pricing guidelines means they call a competitor. We deliver values instantly.
              </p>

              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">PRE-CONFIGURED SYSTEM WORKFLOW</h4>
                
                <div className="relative pl-6 border-l-2 border-astra-gold/20 space-y-5">
                  <div className="absolute top-1.5 -left-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-astra-gold flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-astra-gold rounded-full" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">1. Instant Automated Message</h5>
                    <p className="text-[11px] text-slate-400">Trigger: {getWhatsappFlow(activeIndustry.id).trigger}</p>
                  </div>

                  <div className="absolute top-[52px] -left-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-astra-gold flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-astra-gold rounded-full" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">2. Interactive Chat Brochure Delivery</h5>
                    <p className="text-[11px] text-slate-400">Actions: {getWhatsappFlow(activeIndustry.id).actions.join(', ')}</p>
                  </div>

                  <div className="absolute top-[103px] -left-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-astra-gold flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-astra-gold rounded-full" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">3. Human Escalate Trigger</h5>
                    <p className="text-[11px] text-slate-400">Escalate: {getWhatsappFlow(activeIndustry.id).escalation}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link 
                  to={`/growth-system-builder?industry=${activeIndustry.id}`}
                  className="inline-flex items-center space-x-2 text-xs text-white bg-astra-navy hover:bg-astra-gold hover:text-astra-navy font-bold px-5 py-2.5 rounded shadow transition"
                >
                  <span>Build {activeIndustry.name} Flow</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Diagnostic Matrix Column */}
            <div className="space-y-6">
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                <h4 className="font-display font-bold text-sm text-astra-navy">Pre-Configured Database Columns (Firestore Schema)</h4>
                <p className="text-xs text-slate-400">These data points are automatically captured and synchronized in your customer profiles.</p>
                
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-500">
                  <div className="p-2 border border-slate-100 bg-white rounded">Lead Name (Validated)</div>
                  <div className="p-2 border border-slate-100 bg-white rounded">Email Address (Syntax-OK)</div>
                  <div className="p-2 border border-slate-100 bg-white rounded">Active WhatsApp Phone</div>
                  <div className="p-2 border border-slate-100 bg-white rounded">Target Budget Bracket</div>
                  <div className="p-2 border border-slate-100 bg-white rounded">Client Source URL</div>
                  <div className="p-2 border border-slate-100 bg-white rounded">Enquiry Time (UTC)</div>
                </div>
              </div>

              <div className="p-6 bg-astra-navy text-white rounded-xl space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full" />
                <h4 className="font-display font-bold text-sm text-white">Chanakya AI Rules Enforced</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Chanakya is trained to answer complex pricing or location queries specifically using {activeIndustry.name} guardrails. It never makes fake pricing claims, and filters high-net-worth buyers aggressively.
                </p>
                <div className="border-t border-white/10 pt-4">
                  <Link to="/talk-to-chanakya" className="text-xs text-astra-gold font-bold flex items-center hover:underline">
                    Test Chanakya Custom Prompts <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
