import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { PLANS_CONFIG, PLAN_LIMITS } from '../../data/plansData';
import { PlanType } from '../../types';
import { CreditCard, Sparkles, Check, ArrowRight, ShieldCheck, Star } from 'lucide-react';

export default function BillingApp() {
  const { user, upgradePlan } = useAuth();
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);

  const currentPlan = user?.plan || 'shunya';
  const currentLimits = PLAN_LIMITS[currentPlan];

  const handleSelectPlan = async (planKey: PlanType) => {
    if (planKey === currentPlan) return;
    setUpgradingPlan(planKey);
    await upgradePlan(planKey);
    setUpgradingPlan(null);
  };

  return (
    <AppLayout 
      title="Subscription Plans & Usage Meter" 
      subtitle="Manage RevAstra Growth Operating System tiers, entitlements, and limits."
    >
      <div className="space-y-8">
        
        {/* Current Plan Overview Card */}
        <div className="bg-gradient-to-r from-astra-navy to-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono text-astra-gold uppercase font-bold tracking-widest">Active Plan Tier</span>
              <h2 className="text-xl font-bold font-display text-white mt-0.5">
                {PLANS_CONFIG[currentPlan].name} — {PLANS_CONFIG[currentPlan].tagline}
              </h2>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold px-3 py-1 rounded-full">
              Status: Active Subscription
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1 font-mono text-xs">
            <div>
              <p className="text-slate-400">Leads Capacity:</p>
              <p className="text-base font-bold text-white mt-0.5">{user?.usage?.leadsAdded || 5} / {currentLimits.crmLeadsLimit}</p>
            </div>
            <div>
              <p className="text-slate-400">Chanakya AI Queries:</p>
              <p className="text-base font-bold text-white mt-0.5">{user?.usage?.chanakyaQueriesUsed || 2} / {currentLimits.chanakyaQueriesMonthly}</p>
            </div>
            <div>
              <p className="text-slate-400">Chat Analyses:</p>
              <p className="text-base font-bold text-white mt-0.5">{user?.usage?.conversationAnalysesUsed || 1} / {currentLimits.conversationAnalysisMonthly}</p>
            </div>
            <div>
              <p className="text-slate-400">User Seats:</p>
              <p className="text-base font-bold text-white mt-0.5">1 / {currentLimits.usersLimit}</p>
            </div>
          </div>
        </div>

        {/* 5 Plans Comparison Grid */}
        <div className="space-y-4">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h3 className="text-lg font-bold text-slate-900 font-display">Upgrade Your AI Growth Operating System</h3>
            <p className="text-xs text-slate-500">
              Founding Indian business pricing. All plans backed by RevAstra setup support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-stretch">
            {(Object.keys(PLANS_CONFIG) as PlanType[]).map((key) => {
              const plan = PLANS_CONFIG[key];
              const isCurrent = key === currentPlan;

              return (
                <div 
                  key={key} 
                  className={`bg-white rounded-xl p-5 border flex flex-col justify-between transition-all ${
                    isCurrent 
                      ? 'border-2 border-astra-gold shadow-md ring-1 ring-astra-gold/20' 
                      : 'border-slate-200/80 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        {plan.name}
                      </span>
                      {plan.popular && (
                        <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono">
                          Popular
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900 font-display">{plan.tagline}</p>
                      <div className="mt-2 flex items-baseline">
                        <span className="text-xl font-extrabold text-slate-900 font-display">{plan.foundingPrice}</span>
                        {plan.isMonthly && <span className="text-[10px] text-slate-500 ml-1">/mo</span>}
                      </div>
                      {plan.regularPrice !== plan.foundingPrice && (
                        <p className="text-[10px] text-slate-400 line-through">Reg. {plan.regularPrice}/mo</p>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs text-slate-600">
                      <p className="text-[10px] font-bold text-slate-400 uppercase font-mono">Deliverables:</p>
                      {plan.exactDeliverables.slice(0, 4).map((d, i) => (
                        <div key={i} className="flex items-start space-x-1.5 text-[11px] leading-tight">
                          <Check className="w-3 h-3 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4">
                    {isCurrent ? (
                      <button 
                        disabled 
                        className="w-full bg-slate-100 text-slate-500 font-bold py-2 rounded-lg text-xs cursor-default"
                      >
                        Current Active Plan
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSelectPlan(key)}
                        disabled={upgradingPlan === key}
                        className="w-full bg-astra-navy hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-xs transition shadow-xs"
                      >
                        {upgradingPlan === key ? 'Upgrading...' : plan.ctaText}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
