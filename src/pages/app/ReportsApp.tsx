import React from 'react';
import AppLayout from '../../components/AppLayout';
import { BarChart3, TrendingUp, Users, Clock, ArrowUpRight, DollarSign, Download } from 'lucide-react';

export default function ReportsApp() {
  return (
    <AppLayout 
      title="Reports & Analytics" 
      subtitle="Analyze pipeline velocity, response speeds, lead source ROI, and conversion metrics."
    >
      <div className="space-y-6">
        
        {/* Top Export Banner */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-display">Revenue Operations Analytics</h3>
            <p className="text-xs text-slate-500 mt-0.5">Real-time performance metrics across marketing channels and sales reps.</p>
          </div>
          <button 
            onClick={() => alert("Downloading PDF Revenue Report...")}
            className="px-3.5 py-2 bg-astra-navy text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5 text-astra-gold" />
            <span>Export Report (PDF)</span>
          </button>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-500 font-semibold">Average Lead Response Speed</p>
            <p className="text-2xl font-bold font-display text-slate-900 mt-2">4.2 Mins</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">↑ 82% faster than Indian industry avg</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-500 font-semibold">Site Visit Conversion Rate</p>
            <p className="text-2xl font-bold font-display text-slate-900 mt-2">24.5%</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">↑ 4.1% increase from last month</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-500 font-semibold">Total Revenue Closed (Quarter)</p>
            <p className="text-2xl font-bold font-display text-slate-900 mt-2">₹1.85 Cr</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">From 14 closed property deals</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-500 font-semibold">Lead Leakage Prevention Score</p>
            <p className="text-2xl font-bold font-display text-slate-900 mt-2">91 / 100</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">High SLA Compliance</p>
          </div>
        </div>

        {/* Channel Breakdown Card */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 font-display">Lead Source Performance & Conversion ROI</h3>
          
          <div className="space-y-3">
            {[
              { source: 'Meta Lead Ads (FB/IG)', total: 42, converted: 12, value: '₹85,000,000', rate: '28.5%' },
              { source: 'WhatsApp Inquiries (Direct)', total: 38, converted: 11, value: '₹62,000,000', rate: '28.9%' },
              { source: 'Property Portals (Housing/99acres)', total: 24, converted: 4, value: '₹25,000,000', rate: '16.6%' },
              { source: 'IndiaMART & Justdial Inquiries', total: 18, converted: 2, value: '₹12,000,000', rate: '11.1%' }
            ].map((ch, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/70 gap-2">
                <div>
                  <p className="text-xs font-bold text-slate-800">{ch.source}</p>
                  <p className="text-[11px] text-slate-500">{ch.total} Total Leads Ingested | {ch.converted} Deals Won</p>
                </div>
                <div className="text-left sm:text-right font-mono text-xs">
                  <p className="font-bold text-slate-900">{ch.value}</p>
                  <p className="text-[10px] text-emerald-600 font-bold">Conversion Rate: {ch.rate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
