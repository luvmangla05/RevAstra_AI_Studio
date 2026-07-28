/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, ArrowRight, ArrowLeft, CheckCircle2, ChevronRight, 
  Sparkles, HelpCircle, ShieldAlert, Cpu, Heart, AlertCircle 
} from 'lucide-react';

interface QuestionStep {
  id: number;
  title: string;
  subtitle: string;
  field: string;
  type: 'select' | 'multi-select' | 'input' | 'number';
  options?: { value: string; label: string; icon?: string }[];
  placeholder?: string;
}

export default function GrowthSystemBuilder() {
  const navigate = useNavigate();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    industry: 'builders',
    businessType: 'Developer',
    marketCountry: 'India',
    locationsCount: 1,
    monthlyEnquiries: '50-100',
    leadSources: [] as string[],
    servicesNeeded: [] as string[],
    biggestProblem: 'Manual follow up is too slow',
    trackingMethod: 'Spreadsheets',
    responseSpeed: 'Within 2-4 hours',
    followUpConsistency: 'Manual & inconsistent',
    desiredOutcomes: [] as string[],
    existingTools: [] as string[],
    teamSize: 5,
    urgency: 'Immediate (Next 14 days)',
    budgetRange: '₹50,000 - ₹1,20,000',
    contactName: '',
    email: '',
    phone: '',
    companyName: '',
    consent: false
  });

  const steps: QuestionStep[] = [
    {
      id: 1,
      title: "Select your primary target industry",
      subtitle: "This loads specific workflow rules, brochure deliveries and automations for your sector.",
      field: "industry",
      type: "select",
      options: [
        { value: "builders", label: "Builders & Property Developers", icon: "Building2" },
        { value: "real-estate", label: "Real-Estate Agencies & Brokers", icon: "Home" },
        { value: "hotels", label: "Hotels & Hospitality Group", icon: "Hotel" },
        { value: "clinics", label: "Medical Clinics & Doctors", icon: "HeartPulse" },
        { value: "gyms", label: "Gyms & Fitness Studios", icon: "Dumbbell" },
        { value: "automotive", label: "Automotive Dealerships & Brands", icon: "Car" }
      ]
    },
    {
      id: 2,
      title: "Specify your business type or model",
      subtitle: "For instance, independent brokerage, luxury builder, specialty clinic, premium gym.",
      field: "businessType",
      type: "input",
      placeholder: "e.g., Luxury Residential Builder, Multi-specialty Dental Clinic..."
    },
    {
      id: 3,
      title: "Where is your primary target market located?",
      subtitle: "Specify countries, states, or major metropolitan cities you operate in.",
      field: "marketCountry",
      type: "input",
      placeholder: "e.g., India (Delhi-NCR, Mumbai), International (Dubai, London)..."
    },
    {
      id: 4,
      title: "How many properties, locations, branches or active projects do you have?",
      subtitle: "Used to determine operational scaling complexity.",
      field: "locationsCount",
      type: "number",
      placeholder: "e.g., 3 projects, 5 locations"
    },
    {
      id: 5,
      title: "What is your average monthly incoming enquiry volume?",
      subtitle: "How many prospective digital leads, calls, or walkthrough requests do you log monthly?",
      field: "monthlyEnquiries",
      type: "select",
      options: [
        { value: "less-than-50", label: "Fewer than 50 leads / month" },
        { value: "50-100", label: "50 to 100 leads / month" },
        { value: "100-500", label: "100 to 500 leads / month" },
        { value: "500-2000", label: "500 to 2,000 leads / month" },
        { value: "2000-plus", label: "More than 2,000 leads / month" }
      ]
    },
    {
      id: 6,
      title: "What are your primary current lead generation channels?",
      subtitle: "Select all that apply.",
      field: "leadSources",
      type: "multi-select",
      options: [
        { value: "Meta Ads", label: "Meta (Instagram/Facebook) Paid Campaigns" },
        { value: "Google Search", label: "Google Search Ads & SEO" },
        { value: "Portals", label: "Property or Third-party listing Portals" },
        { value: "Referrals", label: "Word-of-mouth & Organic Walk-ins" },
        { value: "SMS", label: "Traditional SMS / Cold calling lists" }
      ]
    },
    {
      id: 7,
      title: "Which RevAstra services does your business require?",
      subtitle: "We will integrate these into your tactical proposal. Select all.",
      field: "servicesNeeded",
      type: "multi-select",
      options: [
        { value: "Creative Production", label: "Photography & Videography Reels" },
        { value: "Campaign Management", label: "Paid Performance Ad Campaigns" },
        { value: "AI website agents", label: "Chanakya Web Conversational Agent" },
        { value: "WhatsApp bots", label: "WhatsApp Automated Enquiry Responses" },
        { value: "CRM Setup", label: "Pipeline & Agent Routing Setup" },
        { value: "Reporting Dashboards", label: "Live Funnel ROI Tracking Panels" }
      ]
    },
    {
      id: 8,
      title: "What is your single biggest current business roadblock?",
      subtitle: "Where is growth being restricted or stalled?",
      field: "biggestProblem",
      type: "input",
      placeholder: "e.g., Lead quality is very bad, or sales team takes 3 hours to reply..."
    },
    {
      id: 9,
      title: "How do you track and organize your incoming leads today?",
      subtitle: "Be administrative and honest.",
      field: "trackingMethod",
      type: "select",
      options: [
        { value: "Spreadsheets", label: "Excel sheets or Google Sheets manually updated" },
        { value: "Traditional CRM", label: "Modern CRM (HubSpot, Salesforce, Zoho)" },
        { value: "WhatsApp Web", label: "Mainly inside WhatsApp chat chats & groups" },
        { value: "Memory", label: "No system - we check individual phone call logs" }
      ]
    },
    {
      id: 10,
      title: "What is your average response speed to a digital inquiry?",
      subtitle: "How long from submission to personal agent contact?",
      field: "responseSpeed",
      type: "select",
      options: [
        { value: "instantly", label: "Instantly (Under 5 minutes via automation)" },
        { value: "Within 30 mins", label: "Within 10 to 30 minutes manually" },
        { value: "Within 2-4 hours", label: "Within 2 to 4 hours" },
        { value: "Same day", label: "Later the same day or next morning" },
        { value: "delayed", label: "Often takes 24 hours or longer" }
      ]
    },
    {
      id: 11,
      title: "Describe your follow-up routine for undecided leads",
      subtitle: "How consistent are secondary calls and updates?",
      field: "followUpConsistency",
      type: "select",
      options: [
        { value: "automated", label: "Automated sequences (WhatsApp/Email triggers)" },
        { value: "manual-consistent", label: "Sales team calls consistently for 2 weeks" },
        { value: "manual-inconsistent", label: "Inconsistent manual calling" },
        { value: "none", label: "We rarely do any follow-up if they don't buy immediately" }
      ]
    },
    {
      id: 12,
      title: "Select your desired operational outcomes",
      subtitle: "Select all target milestones.",
      field: "desiredOutcomes",
      type: "multi-select",
      options: [
        { value: "Automate Brochure WhatsApp", label: "Instant brochure sharing on WhatsApp" },
        { value: "Increase booking rate", label: "Automate scheduling of site-visits & tours" },
        { value: "Clean CRM visibility", label: "Clean pipelines indicating exact deal values" },
        { value: "High attention reels", label: "Premium monthly photoshoot & reels assets" },
        { value: "Lower CPA", label: "Reduce digital cost-per-acquisition metrics" }
      ]
    },
    {
      id: 13,
      title: "What business software do you use currently?",
      subtitle: "Select existing integrations.",
      field: "existingTools",
      type: "multi-select",
      options: [
        { value: "WhatsApp Business App", label: "WhatsApp Business Mobile App" },
        { value: "Excel Sheets", label: "Microsoft Excel / Google Drive" },
        { value: "Zoho CRM", label: "Zoho CRM / Freshworks / HubSpot" },
        { value: "Meta Ad Manager", label: "Meta Business Suite / Ads Manager" }
      ]
    },
    {
      id: 14,
      title: "What is your sales and administrative team size?",
      subtitle: "Number of active agents handling leads.",
      field: "teamSize",
      type: "number",
      placeholder: "e.g., 5 agents"
    },
    {
      id: 15,
      title: "What is your level of urgency to launch?",
      subtitle: "Helps prioritize engineering resources.",
      field: "urgency",
      type: "select",
      options: [
        { value: "Immediate (Next 14 days)", label: "High urgency (Launch within next 14 days)" },
        { value: "Within 30 days", label: "Launch within next 30 days" },
        { value: "Within 2-3 months", label: "Planning for next 2 to 3 months" },
        { value: "Just auditing", label: "Just gathering pricing details for now" }
      ]
    },
    {
      id: 16,
      title: "What is your estimated monthly growth budget?",
      subtitle: "Used to customize your systems package (Creative vs Campaigns vs AI).",
      field: "budgetRange",
      type: "select",
      options: [
        { value: "Under ₹40,000", label: "Under ₹40,000 / $500 USD per month" },
        { value: "₹45,000 - ₹1,20,000", label: "₹45,000 to ₹1,20,000 / month (Saarthi/Creative Setup)" },
        { value: "₹1,20,000 - ₹2,50,000", label: "₹1,20,000 to ₹2,50,000 / month (Arjuna Campaign OS)" },
        { value: "₹2,50,000 - plus", label: "More than ₹2,50,000 / month (Astra AI Enterprise OS)" }
      ]
    },
    {
      id: 17,
      title: "Enter your contact and corporate credentials",
      subtitle: "Your strategic diagnostic report will be registered securely.",
      field: "credentials",
      type: "input", // Specialized rendering
    }
  ];

  const handleSelectOption = (field: string, val: string) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleMultiSelectOption = (field: string, val: string) => {
    const currentList = (formData as any)[field] as string[];
    const newList = currentList.includes(val) 
      ? currentList.filter(item => item !== val)
      : [...currentList, val];
    setFormData(prev => ({ ...prev, [field]: newList }));
  };

  const handleInputChange = (field: string, val: string) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleNextStep = () => {
    const currentStep = steps[currentStepIdx];
    
    // Simple validation before going forward
    if (currentStep.field === 'credentials') {
      if (!formData.contactName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.companyName.trim()) {
        setErrors("Please complete all contact credentials to continue.");
        return;
      }
      if (!formData.consent) {
        setErrors("You must consent to data processing to generate your Growth Plan.");
        return;
      }
    }

    setErrors(null);
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    } else {
      handleSubmitBuilder();
    }
  };

  const handlePrevStep = () => {
    setErrors(null);
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  const handleSubmitBuilder = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/db/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setIsSubmitting(false);
      
      if (data && data.id) {
        navigate(`/recommendation/${data.id}`);
      } else {
        setErrors("An error occurred during submission. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setErrors("Failed to process your growth diagnostic. Please check connection.");
    }
  };

  const activeStep = steps[currentStepIdx];
  const progressPercent = Math.round(((currentStepIdx + 1) / steps.length) * 100);

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden p-8 sm:p-10 relative">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100">
          <div className="h-full bg-astra-gold transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>

        {/* Progress tracker header */}
        <div className="flex justify-between items-center text-xs text-slate-400 font-mono mb-8">
          <span className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
            RevOps Growth Auditor
          </span>
          <span>Step {currentStepIdx + 1} of {steps.length} ({progressPercent}%)</span>
        </div>

        {errors && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded text-xs text-red-600 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errors}</span>
          </div>
        )}

        {isSubmitting ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-12 h-12 border-4 border-astra-gold border-t-astra-navy rounded-full animate-spin mx-auto" />
            <p className="font-display font-bold text-astra-navy text-lg">Chanakya is Analyzing your Business Model...</p>
            <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
              Evaluating marketing leakages, calculating pipeline risks, and using Gemini API server-side to generate your custom action proposal.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Step Copy */}
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-extrabold text-astra-navy tracking-tight">
                {activeStep.title}
              </h2>
              <p className="text-slate-400 text-xs">
                {activeStep.subtitle}
              </p>
            </div>

            {/* Step Fields Rendering */}
            <div className="space-y-3">
              {activeStep.type === 'select' && activeStep.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeStep.options.map((opt) => {
                    const isSelected = (formData as any)[activeStep.field] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleSelectOption(activeStep.field, opt.value)}
                        className={`p-4 border text-left text-xs font-semibold rounded-lg transition-all flex items-center space-x-3 ${
                          isSelected 
                            ? 'bg-astra-navy text-white border-astra-navy shadow' 
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-astra-gold bg-astra-gold text-astra-navy' : 'border-slate-300 bg-white'}`}>
                          {isSelected && <CheckCircle2 className="w-3 h-3 text-white fill-white" />}
                        </span>
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {activeStep.type === 'multi-select' && activeStep.options && (
                <div className="grid grid-cols-1 gap-2.5">
                  {activeStep.options.map((opt) => {
                    const isSelected = ((formData as any)[activeStep.field] as string[]).includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleMultiSelectOption(activeStep.field, opt.value)}
                        className={`p-3.5 border text-left text-xs font-medium rounded-lg transition-all flex items-center space-x-3 ${
                          isSelected 
                            ? 'bg-astra-navy/5 text-astra-navy border-astra-navy' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span className={`w-4 h-4 border rounded flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-astra-gold border-astra-gold text-white' : 'border-slate-300'}`}>
                          {isSelected && <CheckCircle2 className="w-3 h-3 text-white fill-white" />}
                        </span>
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {activeStep.type === 'input' && activeStep.field !== 'credentials' && (
                <input
                  type="text"
                  value={(formData as any)[activeStep.field]}
                  onChange={(e) => handleInputChange(activeStep.field, e.target.value)}
                  placeholder={activeStep.placeholder}
                  className="w-full text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:border-astra-gold focus:bg-white p-4 rounded-lg text-slate-800 font-medium"
                />
              )}

              {activeStep.type === 'number' && (
                <input
                  type="number"
                  value={(formData as any)[activeStep.field]}
                  onChange={(e) => handleInputChange(activeStep.field, e.target.value)}
                  placeholder={activeStep.placeholder}
                  className="w-full text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:border-astra-gold focus:bg-white p-4 rounded-lg text-slate-800 font-medium"
                />
              )}

              {/* Specialized rendering for credentials step (Step 17) */}
              {activeStep.field === 'credentials' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Corporate Name</label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                        placeholder="e.g., Supreme Builders Group"
                        className="w-full text-xs bg-slate-50 border border-slate-200 p-3 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Contact Name</label>
                      <input
                        type="text"
                        value={formData.contactName}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                        placeholder="e.g., Rajesh Sharma"
                        className="w-full text-xs bg-slate-50 border border-slate-200 p-3 rounded"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="e.g., rajesh@supreme.in"
                        className="w-full text-xs bg-slate-50 border border-slate-200 p-3 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">WhatsApp Number</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="e.g., +91 98765 43210"
                        className="w-full text-xs bg-slate-50 border border-slate-200 p-3 rounded"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, consent: !prev.consent }))}
                      className="flex items-start space-x-2 text-left"
                    >
                      <span className={`w-4 h-4 border rounded mt-0.5 flex-shrink-0 flex items-center justify-center ${formData.consent ? 'bg-astra-gold border-astra-gold text-white' : 'border-slate-300'}`}>
                        {formData.consent && <CheckCircle2 className="w-3 h-3 text-white fill-white" />}
                      </span>
                      <span className="text-[11px] text-slate-400 leading-normal">
                        I authorize RevAstra to process my responses and generate a business diagnostic model. I consent to receive automated proposal and brochure delivery on WhatsApp.
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step Action Buttons */}
            <div className="flex justify-between items-center pt-8 border-t border-slate-100">
              <button
                onClick={handlePrevStep}
                disabled={currentStepIdx === 0}
                className="flex items-center text-xs font-semibold text-slate-400 hover:text-slate-600 disabled:opacity-30"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </button>

              <button
                onClick={handleNextStep}
                className="bg-astra-navy hover:bg-astra-gold text-white hover:text-astra-navy font-semibold text-xs px-5 py-2.5 rounded flex items-center transition"
              >
                {currentStepIdx === steps.length - 1 ? 'Generate Growth Plan' : 'Continue'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
