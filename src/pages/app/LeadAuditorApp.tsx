import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import { 
  ShieldAlert, 
  AlertTriangle, 
  TrendingDown, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  MessageSquare
} from 'lucide-react';

export default function LeadAuditorApp() {
  const [monthlyLeads, setMonthlyLeads] = useState<number>(100);
  const [avgLeadValue, setAvgLeadValue] = useState<number>(25000);
  const [responseTime, setResponseTime] = useState<string>('2_4_hours');
  const [followUpAttempts, setFollowUpAttempts] = useState<number>(1);
  const [channels, setChannels] = useState<string[]>(['Meta Ads', 'WhatsApp Inquiries']);

  // Computed leakage metrics
  const calculateAudit = () => {
    let leakageMultiplier = 0.25; // Base 25% leak

    if (responseTime === 'instantly_5min') leakageMultiplier -= 0.15;
    else if (responseTime === '1_2_hours') leakageMultiplier += 0.10;
    else if (responseTime === '2_4_hours') leakageMultiplier += 0.20;
    else if (responseTime === 'next_day') leakageMultiplier += 0.35;

    if (followUpAttempts <= 1) leakageMultiplier += 0.20;
    else if (followUpAttempts >= 4) leakageMultiplier -= 0.10;

    const leakedPercentage = Math.min(0.75, Math.max(0.08, leakageMultiplier));
    const leakedLeads = Math.round(monthlyLeads * leakedPercentage);
    const lostRevenue = leakedLeads * avgLeadValue;

    let riskLevel = 'Moderate Risk';
    if (leakedPercentage >= 0.45) riskLevel = 'CRITICAL LEAKAGE';
    else if (leakedPercentage >= 0.28) riskLevel = 'HIGH LEAKAGE';
    else if (leakedPercentage <= 0.15) riskLevel = 'LOW LEAKAGE';

    return { leakedLeads, lostRevenue, leakedPercentage, riskLevel };
  };

  const auditResult = calculateAudit();

  return (
    <AppLayout 
      title="Lead Leakage Auditor" 
      subtitle="Identify slow response times, missed follow-ups, and calculate lost revenue in ₹ INR."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Input Form (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <h2 className="text-base font-bold text-slate-900 font-display">Configure Audit Diagnostic Variables</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Average Monthly Inquiries / Leads
              </label>
              <input
                type="number"
                value={monthlyLeads}
                onChange={(e) => setMonthlyLeads(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-astra-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Average Deal / Order Value (₹ INR)
              </label>
              <input
                type="number"
                value={avgLeadValue}
                onChange={(e) => setAvgLeadValue(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-astra-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Average First Contact Speed (Lead Response Time)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'instantly_5min', label: '< 5 Minutes' },
                { id: '1_2_hours', label: '1 - 2 Hours' },
                { id: '2_4_hours', label: '2 - 4 Hours' },
                { id: 'next_day', label: 'Next Day (24h+)' }
              ].map(opt => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setResponseTime(opt.id)}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold border transition text-center ${
                    responseTime === opt.id 
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
              Average Follow-up Attempts Per Lead Before Dropping
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 5].map(num => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setFollowUpAttempts(num)}
                  className={`py-2 text-xs font-bold rounded-lg border transition ${
                    followUpAttempts === num 
                      ? 'bg-astra-navy text-white border-astra-navy' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {num} {num === 1 ? 'Attempt' : 'Attempts'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-900 space-y-1">
            <p className="font-bold flex items-center">
              <Clock className="w-4 h-4 mr-1.5 text-amber-700" />
              Indian Business Market Insight:
            </p>
            <p className="text-amber-800 leading-relaxed">
              78% of Indian buyers purchase from the vendor that responds first on WhatsApp or phone. If your response time exceeds 15 minutes, lead conversion rates drop by up to 400%.
            </p>
          </div>
        </div>

        {/* Right Computed Scorecard (1 col) */}
        <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-[10px] font-mono font-bold uppercase text-astra-gold tracking-widest">
                Diagnostic Scorecard
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase ${
                auditResult.riskLevel.includes('CRITICAL') ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {auditResult.riskLevel}
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-slate-400">Estimated Monthly Lost Revenue:</p>
              <p className="text-3xl font-extrabold font-display text-red-400">
                ₹{auditResult.lostRevenue.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                (~{auditResult.leakedLeads} leads lost out of {monthlyLeads} inquiries)
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Revenue Leakage Rate</span>
                  <span className="font-bold text-red-400">{(auditResult.leakedPercentage * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-red-500 h-full transition-all duration-500" 
                    style={{ width: `${auditResult.leakedPercentage * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 space-y-2 text-xs text-slate-300">
              <p className="font-bold text-white">Actionable Corrective Steps:</p>
              <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                <li>Set up WhatsApp Business instant brochure trigger for Meta Ads.</li>
                <li>Implement 3-touch follow-up schedule within 48 hours.</li>
                <li>Migrate leads from manual Excel to RevAstra Free CRM.</li>
              </ul>
            </div>
          </div>

          <a 
            href="/app/crm"
            className="w-full bg-astra-gold text-astra-navy hover:bg-amber-400 font-bold py-2.5 rounded-lg text-center text-xs transition block shadow-sm"
          >
            Fix Leaks with Free CRM →
          </a>
        </div>

      </div>
    </AppLayout>
  );
}
