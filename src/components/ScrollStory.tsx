/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, AlertTriangle, Cpu, MessageSquare, Calendar, Eye, 
  ArrowRight, ShieldCheck, Instagram, Facebook, Chrome, Smartphone
} from 'lucide-react';

export default function ScrollStory() {
  const [activeFrame, setActiveFrame] = useState(0);

  const frames = [
    {
      id: 0,
      title: "1. The Creation of Demand",
      tagline: "CHAOS & SIGNAL EXPLOSION",
      desc: "Attention is generated. Brand walkthroughs and digital placements trigger actions across multiple platforms simultaneously. Leads flow from Instagram reels, Facebook inquiry forms, and Google Search results.",
      cta: "See what happens to these leads next",
      bgClass: "from-slate-900 via-[#1E1B18] to-slate-950",
      visual: (
        <div className="relative w-full h-64 bg-black/40 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#C5A880]/10 via-transparent to-transparent" />
          
          {/* Chaotic flying signals */}
          <motion.div 
            animate={{ 
              x: [-15, 15, -15], 
              y: [-10, 10, -10],
              rotate: [0, 10, 0]
            }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute top-10 left-12 p-3 bg-white/5 border border-white/10 rounded-xl flex items-center space-x-2 text-rose-400"
          >
            <Instagram className="w-4 h-4" />
            <span className="text-[10px] font-mono">Enquiry</span>
          </motion.div>

          <motion.div 
            animate={{ 
              x: [10, -10, 10], 
              y: [15, -15, 15],
              rotate: [0, -8, 0]
            }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute bottom-12 right-16 p-3 bg-white/5 border border-white/10 rounded-xl flex items-center space-x-2 text-[#C5A880]"
          >
            <Facebook className="w-4 h-4" />
            <span className="text-[10px] font-mono">Form Submitted</span>
          </motion.div>

          <motion.div 
            animate={{ 
              x: [-5, 5, -5], 
              y: [-15, 15, -15]
            }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
            className="absolute top-24 right-10 p-3 bg-white/5 border border-white/10 rounded-xl flex items-center space-x-2 text-sky-400"
          >
            <Chrome className="w-4 h-4" />
            <span className="text-[10px] font-mono">Search Click</span>
          </motion.div>

          <div className="text-center space-y-2 relative z-10">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
              <Smartphone className="w-8 h-8 text-white/80" />
            </div>
            <p className="text-xs font-mono text-slate-400">UNSYNCHRONIZED CAMPAIGN LEADS</p>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: "2. The Fracture",
      tagline: "DIAGNOSIS & OPPORTUNITY DROP-OFF",
      desc: "But without direct integration, the pipeline is severed. Leads wait in spreadsheet queues or are emailed manually to sales coordinators hours later. For every minute an inquiry cools, the booking probability drops.",
      cta: "Activate the RevAstra Core connection",
      bgClass: "from-slate-950 via-[#2A1515] to-[#140808]",
      visual: (
        <div className="relative w-full h-64 bg-black/40 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-500/5 via-transparent to-transparent" />
          
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-8 relative">
              {/* Conveyor belt */}
              <div className="w-20 h-10 rounded border border-white/10 flex items-center justify-center bg-white/5 text-xs text-slate-400">
                Ad Click
              </div>
              <div className="text-rose-500">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <AlertTriangle className="w-6 h-6" />
                </motion.div>
              </div>
              <div className="w-20 h-10 rounded border border-dashed border-rose-500/20 flex items-center justify-center bg-rose-950/10 text-xs text-rose-400/60">
                CRM Drop-off
              </div>
            </div>
            <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest bg-rose-950/20 px-2 py-1 rounded border border-rose-500/20">
              LEAD RESPONSE LATENCY EXCEEDS 4 HOURS
            </span>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "3. The Alignment",
      tagline: "SYSTEM CORE INITIALIZED",
      desc: "RevAstra activates. All disjointed marketing sources are connected via direct API webhooks in less than 50 milliseconds. The CRM instantly parses parameters, identifies the campaign of origin, and prepares the response.",
      cta: "Verify automated qualification rules",
      bgClass: "from-[#08121E] via-[#0A192F] to-[#040C1A]",
      visual: (
        <div className="relative w-full h-64 bg-black/40 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
          
          <div className="space-y-6 text-center">
            {/* Core engine animation */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              className="w-16 h-16 rounded-full border border-blue-500/40 flex items-center justify-center mx-auto"
            >
              <Cpu className="w-8 h-8 text-blue-400" />
            </motion.div>
            
            <div className="flex justify-center space-x-2 text-[10px] font-mono">
              <span className="bg-blue-950/40 border border-blue-500/20 text-blue-400 px-2.5 py-1 rounded">
                WEBHOOK: 200 OK
              </span>
              <span className="bg-blue-950/40 border border-blue-500/20 text-blue-400 px-2.5 py-1 rounded">
                LATENCY: 42ms
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "4. Conversational Qualification",
      tagline: "AUTOMATION ENGINE TRIGGERED",
      desc: "Our conversational assistant, Chanakya, triggers instantly on WhatsApp. Instead of standard text blocks, Chanakya verifies the customer's budget, checks requirements, and answers queries using localized tone characteristics.",
      cta: "Map qualified lead assignment",
      bgClass: "from-slate-950 via-[#161B22] to-slate-950",
      visual: (
        <div className="relative w-full h-64 bg-black/40 rounded-xl border border-white/5 overflow-hidden p-6 flex flex-col justify-between">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 max-w-[80%]">
            <p className="text-[10px] font-mono text-[#C5A880] uppercase tracking-wider mb-1">Chanakya Assistant</p>
            <p className="text-xs text-slate-300">Namaste! I see you inquired about our Sovereign Crest 3BHK launch. Do you prefer luxury high-floor units or private deck layouts?</p>
          </div>

          <div className="flex justify-end">
            <div className="bg-[#C5A880]/10 border border-[#C5A880]/30 rounded-xl p-3 max-w-[70%]">
              <p className="text-xs text-[#C5A880] font-semibold">High floor luxury unit, please.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "5. Operational Hand-off",
      tagline: "VISIBILITY & SCHEDULING SYNC",
      desc: "No lead is left to chance. Once qualified, the system coordinates scheduling directly onto active calendars, alerts assigned site executives with a briefing summary, and locks the opportunity in the customer pipeline.",
      cta: "Inspect final visibility indicators",
      bgClass: "from-[#081F1A] via-[#051411] to-slate-950",
      visual: (
        <div className="relative w-full h-64 bg-black/40 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent" />
          
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-mono font-bold text-emerald-400">APPOINTMENT SCHEDULED</h4>
              <p className="text-[11px] text-slate-400">Site-Visit: Sat, 11:30 AM (Executive: Rajat Sharma)</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "6. Total Operating Visibility",
      tagline: "GROWTH CONTROL CENTER",
      desc: "Absolute alignment achieved. Business owners monitor campaign efficiency, lead progression, and executive response times on a clean visual interface. Zero waste, full strategic control.",
      cta: "Explore customizable system packages",
      bgClass: "from-slate-950 via-slate-900 to-slate-950",
      visual: (
        <div className="relative w-full h-64 bg-black/40 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#C5A880]/5 via-transparent to-transparent" />
          
          <div className="grid grid-cols-3 gap-4 w-full max-w-[85%]">
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-center">
              <span className="text-[10px] text-slate-400 block font-mono">AD COST</span>
              <span className="text-sm font-bold text-white">Full Match</span>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-center">
              <span className="text-[10px] text-slate-400 block font-mono">CONVERSION</span>
              <span className="text-sm font-bold text-emerald-400">Optimized</span>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-center">
              <span className="text-[10px] text-slate-400 block font-mono">LEAKAGE</span>
              <span className="text-sm font-bold text-rose-400">0%</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentFrame = frames[activeFrame];

  const handleNext = () => {
    setActiveFrame((prev) => (prev + 1) % frames.length);
  };

  return (
    <section className="py-24 bg-black text-white relative overflow-hidden" id="revops-story">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-900 via-black to-black opacity-40 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            Pipeline Architecture Journey
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            The Alignment Framework.
          </h2>
          <p className="text-slate-400 text-lg">
            Track how uncoordinated digital signals are aligned into verified revenue opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          
          {/* Left Column Description (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-mono font-bold tracking-widest text-[#C5A880] uppercase">
              {currentFrame.tagline}
            </span>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFrame}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                  {currentFrame.title}
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {currentFrame.desc}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button
                onClick={handleNext}
                className="w-full sm:w-auto text-center py-3 px-6 rounded-xl text-xs font-bold bg-[#C5A880] text-black hover:bg-white active:scale-[0.98] transition flex items-center justify-center space-x-1.5"
              >
                <span>{currentFrame.cta}</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>

              {/* Indicator dots */}
              <div className="flex space-x-1.5 py-2">
                {frames.map((frame) => (
                  <button
                    key={frame.id}
                    onClick={() => setActiveFrame(frame.id)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      activeFrame === frame.id ? 'bg-[#C5A880]' : 'bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Go to frame ${frame.id + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column Dynamic Visual Sandbox (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-stone-900 to-black p-1.5 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFrame}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {currentFrame.visual}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
