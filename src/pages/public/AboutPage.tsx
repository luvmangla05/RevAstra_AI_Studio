import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Building2, ShieldCheck, ArrowRight, Award, Compass } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        <section className="bg-astra-navy text-white py-16 px-4 sm:px-6 lg:px-8 text-center border-b border-slate-800">
          <div className="max-w-4xl mx-auto space-y-4">
            <span className="bg-astra-gold/20 text-astra-gold border border-astra-gold/30 text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              Our Vision & Mission
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white">
              Empowering Indian Businesses with AI Infrastructure
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              RevAstra was created to bridge the technology gap for Indian MSMEs, real estate developers, clinics, and service businesses.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h2 className="text-xl font-bold text-slate-900 font-display">The RevAstra Story</h2>
            <p>
              In the fast-paced Indian sales environment (Delhi NCR, Mumbai, Bengaluru, Tier-2 hubs), customer expectations are instantaneous. Buyers inquiring on Meta Ads or WhatsApp expect a brochure and site visit details within minutes.
            </p>
            <p>
              Traditional Western CRMs are often overly complex, expensive, and ill-suited for WhatsApp-centric, owner-led Indian businesses. RevAstra provides an end-to-end Growth Operating System built specifically for Indian ground realities—combining free CRM tools with managed video production, trained AI voice agents, and Chanakya AI strategic advisory.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-2">
              <Compass className="w-6 h-6 text-astra-navy" />
              <h3 className="text-base font-bold text-slate-900 font-display">Our Core Philosophy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero fluff. No fake automation promises. Real AI interpretation paired with deterministic business rules and GST accuracy.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-2">
              <Award className="w-6 h-6 text-astra-navy" />
              <h3 className="text-base font-bold text-slate-900 font-display">Dedicated Support SLA</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every paid tier includes dedicated RevAstra setup specialists who configure your WhatsApp APIs, Meta lead forms, and staff training.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
