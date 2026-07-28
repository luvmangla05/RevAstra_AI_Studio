/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, Play, RefreshCw, Zap, MessageSquare, User, Calendar, ShieldCheck, Mail, ArrowRight } from 'lucide-react';

export default function BrokenProcessDemo() {
  const [isActive, setIsActive] = useState(false);
  const [step, setStep] = useState(0);

  // Auto progression for animation steps
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step < 5) {
      interval = setTimeout(() => {
        setStep((prev) => prev + 1);
      }, isActive ? 1800 : 2200);
    } else {
      interval = setTimeout(() => {
        setStep(0);
      }, 5000);
    }
    return () => clearTimeout(interval);
  }, [step, isActive]);

  const handleToggle = () => {
    setIsActive(!isActive);
    setStep(0);
  };

  const brokenFlow = [
    { label: "Meta Ad Click", desc: "Prospect clicks 'Inquire Now'", status: "active" },
    { label: "WhatsApp Enquiry", desc: "System routes lead to central inbox", status: "unattended" },
    { label: "No Response", desc: "Lead sits unacknowledged for 18 hours", status: "delay" },
    { label: "Salesperson Forgets", desc: "Manual spreadsheet update missed", status: "failed" },
    { label: "Lead Disappears", desc: "Frustrated buyer books with competitor", status: "lost" }
  ];

  const activeFlow = [
    { label: "Meta Ad Captured", desc: "Webhook triggers in < 50ms", status: "success", icon: Zap },
    { label: "Intent Scored", desc: "Verified phone/budget matches profile", status: "success", icon: ShieldCheck },
    { label: "Salesperson Assigned", desc: "Round-robin matches team criteria", status: "success", icon: User },
    { label: "WhatsApp Response", desc: "PDF brochure & greeting sent", status: "success", icon: MessageSquare },
    { label: "Site Visit Scheduled", desc: "Confirmed on calendar", status: "complete", icon: Calendar }
  ];

  const currentFlow = isActive ? activeFlow : brokenFlow;

  return (
    <section className="py-24 bg-dark-ink text-white relative overflow-hidden" id="break-the-leak">
      {/* Background system grids */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-dark-ink to-dark-ink pointer-events-none" />
      <div className="absolute -left-10 top-1/4 w-72 h-72 bg-astra-navy/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-10 bottom-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Editorial Title */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <span className="text-[11px] font-mono tracking-widest text-astra-gold uppercase bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            Interactive Demonstration
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            See Where Business Opportunities Disappear.
          </h2>
          <p className="text-slate-400 text-lg">
            Compare the friction of manual lead tracking with a synchronized RevAstra RevOps engine.
          </p>
        </div>

        {/* Demo Dashboard Frame */}
        <div className="bg-slate-900/75 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-w-5xl mx-auto">
          
          {/* Header Control Panel */}
          <div className="bg-black/40 border-b border-white/5 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <span className="flex space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-mono text-slate-500">SYSTEM STATE DIAGNOSTIC PANEL</span>
            </div>

            {/* Toggle Mechanism */}
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-semibold ${!isActive ? 'text-rose-400' : 'text-slate-500'}`}>
                Broken Process
              </span>
              <button
                onClick={handleToggle}
                className={`relative w-14 h-8 rounded-full p-1 transition-colors duration-300 ${
                  isActive ? 'bg-astra-gold' : 'bg-rose-950/80 border border-rose-500/30'
                }`}
                aria-label="Toggle system mode"
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                    isActive ? 'translate-x-6' : 'translate-x-0'
                  }`}
                >
                  {isActive ? (
                    <Zap className="w-3.5 h-3.5 text-astra-navy" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  )}
                </div>
              </button>
              <span className={`text-xs font-semibold ${isActive ? 'text-astra-gold' : 'text-slate-500'}`}>
                RevAstra Active
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8">
            
            {/* Left Diagram Column (7 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-white">
                  {isActive ? "Connected Revenue Path" : "Siloed Gaps & Leakages"}
                </h3>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center">
                  <RefreshCw className="w-3 h-3 mr-1.5 animate-spin" />
                  Live Flow Simulation
                </span>
              </div>

              {/* Connected Process Nodes */}
              <div className="relative space-y-8 pl-4">
                {/* Connecting Line */}
                <div className="absolute left-9 top-4 bottom-4 w-0.5 bg-white/5" />
                
                {/* Animated progress indicator line */}
                <div 
                  className={`absolute left-9 top-4 w-0.5 transition-all duration-1000 origin-top ${
                    isActive ? 'bg-astra-gold shadow-[0_0_8px_rgba(197,168,128,0.5)]' : 'bg-rose-500/60'
                  }`}
                  style={{ height: `${(step / 4) * 85}%` }}
                />

                {currentFlow.map((node, idx) => {
                  const isCurrent = idx === step;
                  const isPassed = idx < step;
                  
                  return (
                    <div 
                      key={idx} 
                      className={`relative flex items-start space-x-6 transition-all duration-300 ${
                        isCurrent ? 'opacity-100 translate-x-1' : isPassed ? 'opacity-70' : 'opacity-30'
                      }`}
                    >
                      {/* Node circle */}
                      <div className="relative z-10 flex-shrink-0">
                        <div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                            isActive 
                              ? isCurrent 
                                ? 'bg-astra-gold text-astra-navy border-white shadow-[0_0_12px_rgba(197,168,128,0.5)]'
                                : isPassed 
                                  ? 'bg-astra-navy text-white border-astra-gold/50'
                                  : 'bg-slate-800 text-slate-500 border-slate-700'
                              : isCurrent 
                                ? 'bg-rose-600 text-white border-white animate-pulse'
                                : isPassed 
                                  ? 'bg-slate-800 text-rose-500/70 border-rose-950'
                                  : 'bg-slate-800 text-slate-500 border-slate-700'
                          }`}
                        >
                          {isActive ? (
                            (node as any).icon ? React.createElement((node as any).icon, { className: "w-5 h-5" }) : <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <AlertCircle className="w-5 h-5" />
                          )}
                        </div>
                      </div>

                      {/* Node details */}
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className={`text-sm font-semibold transition-colors duration-300 ${
                            isCurrent 
                              ? isActive ? 'text-astra-gold' : 'text-rose-400' 
                              : 'text-white'
                          }`}>
                            {node.label}
                          </h4>
                          {isCurrent && (
                            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                              isActive ? 'bg-astra-gold/10 text-astra-gold' : 'bg-rose-500/10 text-rose-400'
                            }`}>
                              {isActive ? "ACTIVE PROCESSING" : "LEAK DETECTED"}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">{node.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Metric/Handoff Details Column (5 cols) */}
            <div className="lg:col-span-4 bg-black/30 border border-white/5 rounded-xl p-5 flex flex-col justify-between space-y-6">
              
              {/* Dynamic Notification State Box */}
              <div className="space-y-4">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 block uppercase">
                  Current Stage Insight
                </span>
                
                <AnimatePresence mode="wait">
                  {!isActive ? (
                    <motion.div 
                      key="broken-metrics"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-4 space-y-3">
                        <div className="flex items-center space-x-2 text-rose-400">
                          <AlertCircle className="w-5 h-5 flex-shrink-0" />
                          <span className="text-xs font-bold font-mono tracking-wider uppercase">PIPELINE AT RISK</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          In standard manual structures, <strong>67%</strong> of enquiries receive a response after 4+ hours. Lead urgency plummets by <strong>391%</strong> if response exceeds 15 minutes.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>Team Pipeline Tracking</span>
                          <span className="text-rose-400 font-mono font-bold">Wasted Effort</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-rose-500 h-full w-[25%]" />
                        </div>
                        <span className="text-[10px] text-slate-500 block text-right font-mono">25% System Efficiency</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="active-metrics"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4 space-y-3">
                        <div className="flex items-center space-x-2 text-emerald-400">
                          <Zap className="w-5 h-5 flex-shrink-0" />
                          <span className="text-xs font-bold font-mono tracking-wider uppercase">SYSTEM SYNCHRONIZED</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          By automating instant webhooks and official WhatsApp delivery, qualified leads are scheduled for site tours or direct calls within <strong>3 minutes</strong>.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>Verified Process Quality</span>
                          <span className="text-emerald-400 font-mono font-bold">Optimal Speed</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full w-[95%]" />
                        </div>
                        <span className="text-[10px] text-slate-500 block text-right font-mono">95% System Efficiency</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Interaction prompt CTA */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <p className="text-[10px] font-mono text-slate-500 text-center uppercase tracking-wider">
                  Test the System Live
                </p>
                <button
                  onClick={handleToggle}
                  className="w-full text-center py-2.5 rounded-lg text-xs font-bold bg-white text-dark-ink hover:bg-slate-100 active:scale-[0.98] transition flex items-center justify-center space-x-1.5"
                >
                  <span>{isActive ? "See Broken Workflow Gaps" : "Activate RevAstra System"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
