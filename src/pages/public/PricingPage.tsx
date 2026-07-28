import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { PLANS_CONFIG } from '../../data/plansData';
import { PlanType } from '../../types';
import { Check, X, Sparkles, ArrowRight, ShieldCheck, PhoneCall } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        
        {/* Hero Header */}
        <section className="bg-astra-navy text-white py-16 px-4 sm:px-6 lg:px-8 text-center border-b border-slate-800">
          <div className="max-w-4xl mx-auto space-y-4">
            <span className="bg-astra-gold/20 text-astra-gold border border-astra-gold/30 text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              Founding Indian Business Offer
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white">
              Transparent AI Growth OS Plans
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Every plan clearly states target audience, outcomes, exact deliverables, usage limits, exclusions, implementation responsibility, and support SLA.
            </p>
          </div>
        </section>

        {/* Pricing Cards Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-stretch">
            {(Object.keys(PLANS_CONFIG) as PlanType[]).map((key) => {
              const plan = PLANS_CONFIG[key];

              return (
                <div 
                  key={key} 
                  className={`bg-white rounded-2xl p-6 border flex flex-col justify-between shadow-sm hover:shadow-md transition ${
                    plan.popular ? 'border-2 border-astra-gold ring-1 ring-astra-gold/20' : 'border-slate-200/80'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        {plan.name}
                      </span>
                      {plan.popular && (
                        <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase">
                          Most Popular
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-display">{plan.tagline}</h3>
                      <div className="mt-2 flex items-baseline">
                        <span className="text-2xl font-extrabold text-slate-900 font-display">{plan.foundingPrice}</span>
                        {plan.isMonthly && <span className="text-xs text-slate-500 ml-1">/mo</span>}
                      </div>
                      {plan.regularPrice !== plan.foundingPrice && (
                        <p className="text-xs text-slate-400 line-through">Reg. {plan.regularPrice}/mo</p>
                      )}
                    </div>

                    {/* Who it is for */}
                    <div className="border-t border-slate-100 pt-3 space-y-1">
                      <p className="text-[10px] font-bold uppercase font-mono text-slate-400">Target Audience:</p>
                      <p className="text-xs text-slate-700 font-medium leading-snug">{plan.whoItIsFor}</p>
                    </div>

                    {/* Primary Outcome */}
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                      <p className="text-[10px] font-bold uppercase font-mono text-astra-navy">Primary Outcome:</p>
                      <p className="text-xs text-slate-800 font-medium leading-snug">{plan.primaryOutcome}</p>
                    </div>

                    {/* Deliverables */}
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[10px] font-bold uppercase font-mono text-slate-400">Exact Deliverables:</p>
                      <ul className="space-y-1 text-xs text-slate-700">
                        {plan.exactDeliverables.map((d, i) => (
                          <li key={i} className="flex items-start">
                            <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 flex-shrink-0 mt-0.5" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Exclusions */}
                    <div className="space-y-1 pt-1 border-t border-slate-100">
                      <p className="text-[10px] font-bold uppercase font-mono text-slate-400">Exclusions:</p>
                      <ul className="space-y-1 text-[11px] text-slate-500">
                        {plan.exclusions.map((e, i) => (
                          <li key={i} className="flex items-start">
                            <X className="w-3 h-3 text-slate-400 mr-1.5 flex-shrink-0 mt-0.5" />
                            <span>{e}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Implementation & Support */}
                    <div className="text-[11px] text-slate-600 space-y-1 pt-1 border-t border-slate-100 font-mono">
                      <p><strong className="text-slate-800">Setup:</strong> {plan.implementationResponsibility}</p>
                      <p><strong className="text-slate-800">SLA:</strong> {plan.supportLevel}</p>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-slate-100 mt-4">
                    <Link
                      to="/register"
                      className="w-full bg-astra-navy hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition block text-center shadow-sm"
                    >
                      {plan.ctaText}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
}
