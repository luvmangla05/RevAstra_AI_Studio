import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import { BarChart3, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function SalesAuditorApp() {
  const [salesRepsCount, setSalesRepsCount] = useState(3);
  const [hasSop, setHasSop] = useState('partial');
  const [quotationTime, setQuotationTime] = useState('24_48h');
  const [ownerApproval, setOwnerApproval] = useState('always_required');

  // Diagnostic calculations
  const calculateScore = () => {
    let score = 70;
    if (hasSop === 'none') score -= 20;
    if (hasSop === 'documented') score += 15;

    if (quotationTime === 'instant_1h') score += 15;
    else if (quotationTime === 'same_day') score += 5;
    else if (quotationTime === '48h_plus') score -= 20;

    if (ownerApproval === 'always_required') score -= 15;
    else if (ownerApproval === 'delegated_threshold') score += 10;

    return Math.max(20, Math.min(95, score));
  };

  const score = calculateScore();

  return (
    <AppLayout 
      title="Sales Process Auditor" 
      subtitle="Audit sales team workflows, quote turnaround times, and owner-approval bottlenecks."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form Inputs (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <BarChart3 className="w-5 h-5 text-astra-navy" />
            <h2 className="text-base font-bold text-slate-900 font-display">Sales Workflow Diagnostics</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Number of Active Sales Reps / Telecallers
              </label>
              <input
                type="number"
                value={salesRepsCount}
                onChange={(e) => setSalesRepsCount(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-astra-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Standard Operating Procedure (SOP) & Scripting
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'none', label: 'No Scripts / Ad-hoc' },
                  { id: 'partial', label: 'Basic WhatsApp Scripts' },
                  { id: 'documented', label: 'Full Documented SOP' }
                ].map(opt => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setHasSop(opt.id)}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold border transition text-center ${
                      hasSop === opt.id 
                        ? 'bg-astra-navy text-white border-astra-navy' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Average Quotation / Proposal Turnaround Speed
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'instant_1h', label: '< 1 Hour (Instant)' },
                  { id: '24_48h', label: '24 - 48 Hours' },
                  { id: '48h_plus', label: '3+ Days (Delayed)' }
                ].map(opt => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setQuotationTime(opt.id)}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold border transition text-center ${
                      quotationTime === opt.id 
                        ? 'bg-astra-navy text-white border-astra-navy' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Business Owner Discount & Pricing Approval Policy
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'always_required', label: 'Owner must approve every discount/quote' },
                  { id: 'delegated_threshold', label: 'Reps have pre-approved discount bands' }
                ].map(opt => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setOwnerApproval(opt.id)}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold border transition text-center ${
                      ownerApproval === opt.id 
                        ? 'bg-astra-navy text-white border-astra-navy' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Audit Output Scorecard */}
        <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-[10px] font-mono font-bold uppercase text-astra-gold tracking-widest">
                Process Health Index
              </span>
              <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                Score: {score} / 100
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-slate-400">Workflow Efficiency Assessment:</p>
              <p className="text-2xl font-bold font-display text-white">
                {score >= 75 ? 'Optimal Revenue Engine' : score >= 50 ? 'Moderate Process Friction' : 'Severe Owner Bottleneck'}
              </p>
            </div>

            <div className="space-y-2 border-t border-slate-800 pt-3 text-xs text-slate-300">
              <p className="font-bold text-white flex items-center">
                <Zap className="w-3.5 h-3.5 mr-1 text-astra-gold" /> Key Process Findings:
              </p>
              <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                {ownerApproval === 'always_required' && (
                  <li><strong>Owner Bottleneck:</strong> Requiring owner signature on every quote slows deal velocity by 48h.</li>
                )}
                {quotationTime !== 'instant_1h' && (
                  <li><strong>Quote Delay:</strong> Quotes sent after 24h lose warmth to local competitors.</li>
                )}
                <li><strong>Fix:</strong> Use RevAstra GST Quotation Assistant with pre-approved price matrices.</li>
              </ul>
            </div>
          </div>

          <a 
            href="/app/quotation-assistant"
            className="w-full bg-astra-gold text-astra-navy hover:bg-amber-400 font-bold py-2.5 rounded-lg text-center text-xs transition block shadow-sm"
          >
            Launch GST Quotation Assistant →
          </a>
        </div>

      </div>
    </AppLayout>
  );
}
