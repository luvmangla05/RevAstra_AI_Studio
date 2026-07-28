import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { OnboardingData } from '../../types';
import { Sparkles, Building2, MapPin, Users, Target, ArrowRight, CheckCircle2, ShieldCheck, PhoneCall, Bot } from 'lucide-react';

export default function OnboardingPage() {
  const { user, updateOnboarding } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    userName: user?.name || '',
    businessName: user?.businessName || '',
    industry: 'Builders & Real Estate',
    city: 'Noida',
    state: 'Uttar Pradesh',
    teamSize: '1-5 employees',
    primaryMarket: 'NCR / Regional City',
    businessStage: 'Growth Stage',
    growthPriority: 'Stop Lead Leaks & Fast Follow-up',
    leadSources: ['Meta Ads (FB/IG)', 'WhatsApp Inquiries', 'Property Portals'],
    crmUsage: 'Excel / Google Sheets',
    followUpProcess: 'Manual sales calls',
    preferredLanguage: 'English'
  });

  const [recommendedTool, setRecommendedTool] = useState<{ name: string; route: string; desc: string } | null>(null);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleLeadSource = (src: string) => {
    if (formData.leadSources.includes(src)) {
      setFormData({ ...formData, leadSources: formData.leadSources.filter(s => s !== src) });
    } else {
      setFormData({ ...formData, leadSources: [...formData.leadSources, src] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateOnboarding(formData);
    if (res.success) {
      let tool = {
        name: 'Free Managed CRM',
        route: '/app/crm',
        desc: 'Organize leads, set stage pipelines, and automate follow-up reminders.'
      };

      if (formData.growthPriority.toLowerCase().includes('leak') || formData.growthPriority.toLowerCase().includes('response')) {
        tool = {
          name: 'Lead Leakage Auditor',
          route: '/app/lead-auditor',
          desc: 'Audit response times, calculate revenue leakage, and optimize lead channels.'
        };
      } else if (formData.leadSources.includes('WhatsApp Inquiries') || formData.crmUsage.includes('WhatsApp')) {
        tool = {
          name: 'WhatsApp Conversation Analyser',
          route: '/app/conversation-analyser',
          desc: 'Analyse WhatsApp chat transcripts to identify objections and buyer intent.'
        };
      } else if (formData.growthPriority.toLowerCase().includes('quote')) {
        tool = {
          name: 'GST Quotation Assistant',
          route: '/app/quotation-assistant',
          desc: 'Create professional GST-compliant quotations with automated totals.'
        };
      }

      setRecommendedTool(tool);
    }
  };

  if (recommendedTool) {
    return (
      <div className="min-h-screen bg-astra-navy text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-2xl animate-fade-in">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-display text-white">Onboarding Complete!</h2>
            <p className="text-xs text-slate-300 mt-1">
              Your profile for <span className="text-astra-gold font-semibold">{formData.businessName}</span> is configured.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 text-left space-y-2">
            <p className="text-[10px] font-mono text-astra-gold font-bold uppercase tracking-wider">Recommended First Free Tool</p>
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              {recommendedTool.name}
              <Sparkles className="w-4 h-4 text-astra-gold" />
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">{recommendedTool.desc}</p>
          </div>

          <button
            onClick={() => navigate(recommendedTool.route)}
            className="w-full bg-astra-gold text-astra-navy hover:bg-amber-400 font-bold py-3 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg"
          >
            <span>Open {recommendedTool.name}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <span className="font-display text-2xl font-bold tracking-tight text-white">
            Rev<span className="text-astra-gold">Astra</span>
          </span>
          <h1 className="text-2xl font-bold text-white mt-2 font-display">Configure Your Indian Business Profile</h1>
          <p className="text-xs text-slate-400 mt-1">
            Personalize your AI Growth Operating System & free business tools.
          </p>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-2 mt-6">
            {[1, 2, 3, 4].map(s => (
              <div 
                key={s} 
                className={`h-1.5 rounded-full transition-all duration-300 ${s <= step ? 'w-12 bg-astra-gold' : 'w-6 bg-slate-800'}`}
              />
            ))}
          </div>
        </div>

        {/* Card Form */}
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* STEP 1: Basic Business Profile */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-base font-bold text-white flex items-center">
                <Building2 className="w-4 h-4 mr-2 text-astra-gold" />
                Step 1: Business Identity & Location
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-astra-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Company / Business Name</label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="e.g. Supreme Builders & Infra"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-astra-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Industry Vertical</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-astra-gold"
                  >
                    <option value="Builders & Real Estate">Builders & Real Estate</option>
                    <option value="Real Estate Brokerage">Real Estate Brokerage</option>
                    <option value="Clinics & Healthcare">Clinics & Healthcare</option>
                    <option value="Manufacturing & MSME">Manufacturing & MSME</option>
                    <option value="Hospitality & Hotels">Hospitality & Hotels</option>
                    <option value="Auto Dealership">Auto Dealership</option>
                    <option value="Gyms & Fitness">Gyms & Fitness</option>
                    <option value="Retail & E-commerce">Retail & E-commerce</option>
                    <option value="Professional Services">Professional Services</option>
                    <option value="Other Business">Other Business</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Team Size</label>
                  <select
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-astra-gold"
                  >
                    <option value="Solo Owner (1)">Solo Owner (1)</option>
                    <option value="1-5 employees">1-5 employees</option>
                    <option value="6-20 employees">6-20 employees</option>
                    <option value="21-50 employees">21-50 employees</option>
                    <option value="50+ employees">50+ employees</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Noida / Delhi / Mumbai"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-astra-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="e.g. Uttar Pradesh / Maharashtra"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-astra-gold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Market & Priorities */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-base font-bold text-white flex items-center">
                <Target className="w-4 h-4 mr-2 text-astra-gold" />
                Step 2: Market Stage & Primary Growth Focus
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Primary Target Market</label>
                  <select
                    value={formData.primaryMarket}
                    onChange={(e) => setFormData({ ...formData, primaryMarket: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-astra-gold"
                  >
                    <option value="Local City / Metro">Local City / Metro</option>
                    <option value="NCR / Regional City">NCR / Regional State</option>
                    <option value="PAN India">PAN India</option>
                    <option value="International Export">International Export</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Current Business Stage</label>
                  <select
                    value={formData.businessStage}
                    onChange={(e) => setFormData({ ...formData, businessStage: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-astra-gold"
                  >
                    <option value="Early Stage (< 1 yr)">Early Stage (&lt; 1 yr)</option>
                    <option value="Growth Stage (1-3 yrs)">Growth Stage (1-3 yrs)</option>
                    <option value="Scaling (3-5 yrs)">Scaling (3-5 yrs)</option>
                    <option value="Established (5+ yrs)">Established (5+ yrs)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Biggest Revenue Priority Right Now</label>
                <select
                  value={formData.growthPriority}
                  onChange={(e) => setFormData({ ...formData, growthPriority: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-astra-gold"
                >
                  <option value="Stop Lead Leaks & Fast Follow-up">Stop Lead Leaks & Instant Response Speeds</option>
                  <option value="Organize Leads from Excel into a CRM">Organize Leads from Excel into a Free CRM</option>
                  <option value="Automate WhatsApp Inquiries & Brochures">Automate WhatsApp Inquiries & Brochures</option>
                  <option value="Speed up Quotations & Closing Rates">Speed up Quotations & Closing Rates</option>
                  <option value="High Quality Short-Form Video Marketing">High Quality Short-Form Video Marketing</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 3: Lead Sources & Existing Process */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-base font-bold text-white flex items-center">
                <PhoneCall className="w-4 h-4 mr-2 text-astra-gold" />
                Step 3: Current Lead Sources & Tools
              </h2>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Select Your Active Lead Sources</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Meta Ads (FB/IG)',
                    'WhatsApp Inquiries',
                    'IndiaMART / Justdial',
                    'Property Portals (Housing, 99acres)',
                    'Google Search Ads',
                    'Channel Partners & References',
                    'Website Forms',
                    'Walk-ins / Showroom'
                  ].map((src) => {
                    const isSelected = formData.leadSources.includes(src);
                    return (
                      <button
                        type="button"
                        key={src}
                        onClick={() => toggleLeadSource(src)}
                        className={`text-xs p-2.5 rounded-lg text-left border transition flex items-center justify-between ${
                          isSelected 
                            ? 'bg-astra-gold/15 border-astra-gold text-astra-gold font-bold' 
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <span>{src}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Current CRM / Tracking Method</label>
                  <select
                    value={formData.crmUsage}
                    onChange={(e) => setFormData({ ...formData, crmUsage: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-astra-gold"
                  >
                    <option value="Excel / Google Sheets">Excel / Google Sheets</option>
                    <option value="WhatsApp Web Only">WhatsApp Web Only</option>
                    <option value="Manual Notebook">Manual Notebook</option>
                    <option value="Traditional CRM (Zoho, Salesforce)">Traditional CRM (Zoho, Salesforce)</option>
                    <option value="No tracking system">No tracking system</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Current Follow-up Method</label>
                  <select
                    value={formData.followUpProcess}
                    onChange={(e) => setFormData({ ...formData, followUpProcess: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-astra-gold"
                  >
                    <option value="Manual sales calls">Manual sales calls</option>
                    <option value="Manual WhatsApp text">Manual WhatsApp text</option>
                    <option value="No regular follow-up">No regular follow-up</option>
                    <option value="Automated multi-step workflow">Automated multi-step workflow</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Preferences & Confirmation */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-base font-bold text-white flex items-center">
                <Bot className="w-4 h-4 mr-2 text-astra-gold" />
                Step 4: Chanakya Communication Preference
              </h2>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Preferred Language for Chanakya AI</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['English', 'Hindi', 'Hinglish'] as const).map(lang => (
                    <button
                      type="button"
                      key={lang}
                      onClick={() => setFormData({ ...formData, preferredLanguage: lang })}
                      className={`py-3 px-4 rounded-xl text-xs font-bold text-center border transition ${
                        formData.preferredLanguage === lang
                          ? 'bg-astra-gold text-astra-navy border-astra-gold'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-xs text-slate-300 space-y-2">
                <div className="flex items-center text-astra-gold font-bold">
                  <ShieldCheck className="w-4 h-4 mr-1.5" />
                  Your Profile Summary
                </div>
                <p><strong className="text-white">Company:</strong> {formData.businessName} ({formData.industry})</p>
                <p><strong className="text-white">Location:</strong> {formData.city}, {formData.state}</p>
                <p><strong className="text-white">Priority:</strong> {formData.growthPriority}</p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-lg transition"
              >
                Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-astra-gold text-astra-navy hover:bg-amber-400 font-bold text-xs rounded-lg transition flex items-center space-x-1"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition flex items-center space-x-1 shadow-lg"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Save Profile & Launch Tools</span>
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
