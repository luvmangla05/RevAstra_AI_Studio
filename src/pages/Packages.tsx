/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, Calculator, ArrowRight, ShieldCheck, HelpCircle, 
  Sparkles, PhoneCall, Bot, DollarSign 
} from 'lucide-react';
import { PUBLIC_PACKAGES } from '../data';

export default function Packages() {
  const [searchParams] = useSearchParams();
  const [selectedPkgId, setSelectedPkgId] = useState('arjuna');
  
  // Custom Quote Calculator state
  const [needsShoots, setNeedsShoots] = useState(true);
  const [shootCount, setShootCount] = useState(2);
  const [needsMarketing, setNeedsMarketing] = useState(true);
  const [needsWhatsApp, setNeedsWhatsApp] = useState(true);
  const [needsChanakya, setNeedsChanakya] = useState(false);

  // Calculated estimates
  const [estimatedMonthly, setEstimatedMonthly] = useState(135000);
  const [estimatedOneTime, setEstimatedOneTime] = useState(45000);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: 'builders'
  });

  useEffect(() => {
    const pkgParam = searchParams.get('pkg');
    if (pkgParam) {
      setSelectedPkgId(pkgParam);
    }
  }, [searchParams]);

  // Recalculate prices whenever inputs change
  useEffect(() => {
    let monthly = 0;
    let onetime = 0;

    if (needsShoots) {
      onetime += shootCount * 25000; // 25k INR per high-end creative shoot
    }
    if (needsMarketing) {
      monthly += 45000; // 45k retainer for Meta/Google ads setup & management
    }
    if (needsWhatsApp) {
      monthly += 15000; // 15k for WhatsApp business API, trigger routing & bot logic
    }
    if (needsChanakya) {
      monthly += 25000; // 25k for Chanakya client advisor instance
      onetime += 15000; // Setup and training embedding corpus
    }

    setEstimatedMonthly(monthly);
    setEstimatedOneTime(onetime);
  }, [needsShoots, shootCount, needsMarketing, needsWhatsApp, needsChanakya]);

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactData.name || !contactData.phone || !contactData.email) {
      alert("Please complete name, email and whatsapp number.");
      return;
    }

    try {
      await fetch('/api/db/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contactData,
          needsShoots,
          shootCount,
          needsMarketing,
          needsWhatsApp,
          needsChanakya,
          estimatedMonthly,
          estimatedOneTime
        })
      });

      // Save as lead too
      await fetch('/api/db/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactData.name,
          email: contactData.email,
          phone: contactData.phone,
          company: contactData.company || 'Quote Request',
          industry: contactData.industry,
          source: 'Interactive Quote Calculator'
        })
      });

      setQuoteSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Failed to record quote. Showing receipt offline.");
      setQuoteSubmitted(true);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 bg-white border border-slate-100 px-2.5 py-1 rounded font-semibold">
            TRANSPARENT VALUE
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-astra-navy tracking-tight">
            Clear Scopes, Modular Packages
          </h1>
          <p className="text-slate-500 text-sm">
            We separate creative project budgets, ad management maintainers, and automation setup scopes.
          </p>
        </div>

        {/* Detailed Package Comparison */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-md p-8 sm:p-10 space-y-8">
          <h3 className="font-display font-extrabold text-lg text-astra-navy flex items-center">
            <Sparkles className="w-5 h-5 text-astra-gold mr-2 animate-pulse" />
            Standard Pre-configured Growth Architectures
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {PUBLIC_PACKAGES.filter(p => p.id !== 'creative').map((pkg) => {
              const isSelected = selectedPkgId === pkg.id;
              return (
                <div 
                  key={pkg.id}
                  onClick={() => setSelectedPkgId(pkg.id)}
                  className={`p-6 rounded-xl border text-left cursor-pointer transition flex flex-col justify-between space-y-6 ${
                    isSelected 
                      ? 'border-astra-gold bg-astra-navy/5 shadow' 
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-display font-bold text-base text-astra-navy">{pkg.name}</h4>
                      {pkg.isPopular && (
                        <span className="bg-astra-gold text-astra-navy text-[8px] uppercase tracking-widest px-2 py-0.2 rounded font-bold">Popular</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono tracking-wider uppercase">{pkg.subheadline}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{pkg.tagline}</p>
                    
                    <ul className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
                      {pkg.features.map((f, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-astra-gold flex-shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-slate-100 pt-4 text-xs">
                    <p className="text-[10px] font-mono text-slate-400">PRICING REFERENCE</p>
                    <p className="font-bold text-slate-800 mt-0.5 italic">{pkg.startingPriceLabel}</p>
                    <p className="text-[10px] text-slate-400">{pkg.pricingNote}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Interactive Estimate Calculator */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-md p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative">
          
          {/* Controls Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-astra-gold uppercase tracking-widest font-bold flex items-center">
                <Calculator className="w-3.5 h-3.5 mr-1.5" /> Live Quote Generator
              </span>
              <h2 className="font-display text-2xl font-extrabold text-astra-navy">Configure Your Custom Growth Engine</h2>
              <p className="text-slate-500 text-sm">
                Toggle features based on your operational team's existing software and targets. See real-time calculated pricing guides.
              </p>
            </div>

            <div className="space-y-5 text-xs text-slate-600">
              
              {/* Shoots toggle */}
              <div className="p-4 border border-slate-100 rounded-lg bg-slate-50 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">1. Creative Video/Photo Shoots</span>
                  <input 
                    type="checkbox" 
                    checked={needsShoots} 
                    onChange={(e) => setNeedsShoots(e.target.checked)} 
                    className="w-4 h-4 accent-astra-gold"
                  />
                </div>
                <p className="text-[11px] text-slate-400">Cinematic site drone shoots, edited walkthrough reels, physician educations.</p>
                {needsShoots && (
                  <div className="flex items-center space-x-3 pt-2">
                    <label className="text-[11px] text-slate-500">Number of Shoots (Quarterly):</label>
                    <input 
                      type="number" 
                      min={1} 
                      max={12} 
                      value={shootCount} 
                      onChange={(e) => setShootCount(parseInt(e.target.value) || 1)} 
                      className="w-16 bg-white border border-slate-200 rounded px-2 py-1 text-center"
                    />
                  </div>
                )}
              </div>

              {/* Marketing toggle */}
              <div className="p-4 border border-slate-100 rounded-lg bg-slate-50 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-800">2. Performance Growth Campaigns</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Meta & Google ads deployment with daily conversion optimizations.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={needsMarketing} 
                  onChange={(e) => setNeedsMarketing(e.target.checked)} 
                  className="w-4 h-4 accent-astra-gold"
                />
              </div>

              {/* WhatsApp toggle */}
              <div className="p-4 border border-slate-100 rounded-lg bg-slate-50 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-800">3. WhatsApp Automated Brochure Delivery</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Instant follow-ups within 5 seconds of lead landing. Active validation rules.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={needsWhatsApp} 
                  onChange={(e) => setNeedsWhatsApp(e.target.checked)} 
                  className="w-4 h-4 accent-astra-gold"
                />
              </div>

              {/* Chanakya toggle */}
              <div className="p-4 border border-slate-100 rounded-lg bg-slate-50 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-800 flex items-center">
                    4. Chanakya AI Agent Instance
                    <span className="ml-1.5 text-[8px] bg-astra-gold text-astra-navy font-bold px-1 rounded uppercase tracking-wider">New</span>
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Multi-lingual intelligent conversational website advisor to filter buyers.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={needsChanakya} 
                  onChange={(e) => setNeedsChanakya(e.target.checked)} 
                  className="w-4 h-4 accent-astra-gold"
                />
              </div>

            </div>
          </div>

          {/* Results & Quote Request Submission Form Column */}
          <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-100 space-y-6">
            <h3 className="font-display font-bold text-sm text-astra-navy uppercase tracking-wider border-b border-slate-200 pb-3">
              Calculated Cost Estimates (INR)
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-slate-100 rounded shadow-xs">
                <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">One-time Setup / Shoots</p>
                <p className="text-xl sm:text-2xl font-extrabold text-astra-navy mt-1">₹{estimatedOneTime.toLocaleString()}</p>
                <p className="text-[9px] text-slate-400 mt-0.5">Inclusive of photo shoots</p>
              </div>
              <div className="p-4 bg-white border border-slate-100 rounded shadow-xs">
                <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Monthly Maintenance</p>
                <p className="text-xl sm:text-2xl font-extrabold text-astra-gold mt-1">₹{estimatedMonthly.toLocaleString()}</p>
                <p className="text-[9px] text-slate-400 mt-0.5">Campaigns + Bot licenses</p>
              </div>
            </div>

            <div className="bg-astra-navy text-white text-[11px] leading-normal p-3.5 rounded border border-white/10">
              *All Digital Advertising spends are billed directly by Facebook or Google to your company card. This is strictly our creative & systems fee.
            </div>

            {quoteSubmitted ? (
              <div className="p-5 bg-white border border-slate-200 rounded text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto" />
                <h4 className="font-display font-bold text-xs text-slate-800">Quote Registration Confirmed!</h4>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  Dhanyavaad (Thank you). Our senior systems architect has logged your dynamic configuration (Estimate: ₹{estimatedMonthly.toLocaleString()}/mo). We will forward a structured PDF invoice on WhatsApp in 15 minutes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuote} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] uppercase font-mono tracking-wider text-slate-400 mb-1">Company Name</label>
                    <input 
                      type="text" 
                      required
                      value={contactData.company} 
                      onChange={(e) => setContactData(prev => ({ ...prev, company: e.target.value }))} 
                      placeholder="e.g. Skyline Residency"
                      className="w-full bg-white border border-slate-200 p-2.5 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-mono tracking-wider text-slate-400 mb-1">Contact Name</label>
                    <input 
                      type="text" 
                      required
                      value={contactData.name} 
                      onChange={(e) => setContactData(prev => ({ ...prev, name: e.target.value }))} 
                      placeholder="e.g. Rajesh Patil"
                      className="w-full bg-white border border-slate-200 p-2.5 rounded text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] uppercase font-mono tracking-wider text-slate-400 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={contactData.email} 
                      onChange={(e) => setContactData(prev => ({ ...prev, email: e.target.value }))} 
                      placeholder="e.g. rajesh@skyline.in"
                      className="w-full bg-white border border-slate-200 p-2.5 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-mono tracking-wider text-slate-400 mb-1">WhatsApp Number</label>
                    <input 
                      type="text" 
                      required
                      value={contactData.phone} 
                      onChange={(e) => setContactData(prev => ({ ...prev, phone: e.target.value }))} 
                      placeholder="e.g. +91 95000 00000"
                      className="w-full bg-white border border-slate-200 p-2.5 rounded text-xs"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-astra-navy hover:bg-astra-gold text-white hover:text-astra-navy font-bold py-3 rounded text-xs transition shadow-md"
                >
                  Submit Configuration to Systems Architects
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
