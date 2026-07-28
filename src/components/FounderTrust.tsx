/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Mail, Phone, ShieldCheck, Award, MessageSquare, ArrowRight, Play } from 'lucide-react';

export default function FounderTrust() {
  return (
    <section className="py-24 bg-slate-50 text-astra-navy border-b border-slate-100" id="founder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Statement & Info (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase bg-white border border-slate-200 px-3 py-1 rounded-full inline-flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
              Verified Strategic Experience
            </span>
            
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-astra-navy leading-tight">
              Backed by Years of Creative Production Mastery.
            </h2>
            
            <p className="text-slate-500 text-base leading-relaxed">
              Before constructing the automated webhook pipes and WhatsApp algorithms, we spent nearly a decade behind the lens. Our creative foundations ensure that your commercial campaigns aren't just technically integrated — they are visually stunning, cinematic, and designed to perform.
            </p>

            {/* Founder details card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
              <div>
                <h3 className="font-display font-extrabold text-lg text-astra-navy">Loukesh Mangla</h3>
                <p className="text-xs text-[#C5A880] font-bold uppercase tracking-wider">Founder, RevAstra AI</p>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed italic">
                “Excellent technology is useless without premium storytelling. We bridge the gap between creative-production mastery and modern marketing automation to build systems that scale.”
              </p>

              {/* Direct verification metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-t border-slate-100 pt-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-slate-50 text-[#C5A880] flex items-center justify-center border border-slate-100">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-mono uppercase">VERIFIED TRACK RECORD</span>
                    <span className="font-bold text-slate-800">8+ Years Creative Mastery</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-slate-50 text-[#C5A880] flex items-center justify-center border border-slate-100">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-mono uppercase">OPERATIONAL FOCUS</span>
                    <span className="font-bold text-slate-800">Verified CRM & Bot Setup</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact channels row */}
            <div className="flex flex-col sm:flex-row gap-4 text-xs">
              <a 
                href="mailto:revastraai@gmail.com"
                className="flex items-center space-x-2 bg-white border border-slate-200 hover:border-slate-300 p-3.5 rounded-xl transition shadow-xs"
              >
                <Mail className="w-4 h-4 text-[#C5A880]" />
                <span className="font-semibold text-slate-600">revastraai@gmail.com</span>
              </a>

              <a 
                href="tel:+918796067710"
                className="flex items-center space-x-2 bg-white border border-slate-200 hover:border-slate-300 p-3.5 rounded-xl transition shadow-xs"
              >
                <Phone className="w-4 h-4 text-[#C5A880]" />
                <span className="font-semibold text-slate-600">+91 87960 67710</span>
              </a>
            </div>
          </div>

          {/* Right Column Video Walkthrough Placeholder (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-2xl flex items-center justify-center group">
              {/* Geometric pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#C5A880]/10 via-transparent to-transparent pointer-events-none" />
              
              <div className="text-center space-y-4 p-6 relative z-10">
                <div className="w-16 h-16 rounded-full bg-[#C5A880] text-black flex items-center justify-center mx-auto shadow-lg hover:scale-105 active:scale-95 cursor-pointer transition">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-extrabold text-sm text-white">Founder System Walkthrough</h4>
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    90s Introduction video coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
