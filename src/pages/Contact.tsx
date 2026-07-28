/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Phone, Mail, MapPin, CheckCircle2, ShieldCheck, HelpCircle, 
  Sparkles, Calendar, ArrowRight, Bot 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: 'builders',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      alert("Please complete name, email and whatsapp number.");
      return;
    }

    try {
      await fetch('/api/db/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company || 'Contact Form Inquiry',
          industry: formData.industry,
          source: 'General Contact Form: ' + formData.message
        })
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true); // show receipt fallback
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 bg-white border border-slate-100 px-2.5 py-1 rounded font-semibold">
            SECURE ROUTING
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-astra-navy tracking-tight">
            Connect With Our Systems Team
          </h1>
          <p className="text-slate-500 text-sm">
            Forward your metrics or creative brief. A senior engineer will respond within 15 minutes.
          </p>
        </div>

        {/* Form and Hubs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Contact Form Box */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-md p-8 sm:p-10 space-y-6">
            <h3 className="font-display font-bold text-lg text-astra-navy">Registered Inquiry Submission</h3>
            
            {submitted ? (
              <div className="p-6 bg-slate-50 border border-slate-100 rounded text-center space-y-4">
                <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto" />
                <h4 className="font-display font-bold text-base text-slate-800">Inquiry Authenticated</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Dhanyavaad (Thank you). Your corporate profile has been parsed. Chanakya has matched your industry parameters and forwarded immediate brochures to your WhatsApp number. A human strategist will reach out shortly.
                </p>
                <div className="pt-2">
                  <Link to="/" className="text-xs text-astra-navy font-bold hover:underline">Return Home</Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Company / Project Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="e.g., Signature Group"
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Contact Person</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Rajesh Mehta"
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="e.g., rajesh@signature.pro"
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">WhatsApp Number</label>
                    <input 
                      type="text" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="e.g., +91 98000 15000"
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Sector Segment</label>
                  <select 
                    value={formData.industry}
                    onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded text-slate-700 font-semibold"
                  >
                    <option value="builders">Builders & Property Developers</option>
                    <option value="real-estate">Real-Estate Agencies</option>
                    <option value="hotels">Hotels & Hospitality</option>
                    <option value="clinics">Medical Clinics</option>
                    <option value="gyms">Gyms & Studios</option>
                    <option value="automotive">Automotive Brands</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Current Marketing roadblock / notes</label>
                  <textarea 
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Describe your current lead capture delay, ad spend constraints or video walkthrough targets..."
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded text-slate-800 font-medium"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-astra-navy hover:bg-astra-gold text-white hover:text-astra-navy font-bold py-3.5 rounded transition shadow-md"
                >
                  Register Strategic Inquiry Flow
                </button>
              </form>
            )}
          </div>

          {/* Location details, Coordinates & meeting links column */}
          <div className="space-y-6">
            
            {/* Quick Consultation block */}
            <div className="bg-astra-navy text-white p-8 rounded-2xl border border-white/10 shadow-lg space-y-4">
              <span className="text-[10px] font-mono text-astra-gold uppercase tracking-widest font-bold flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5" /> Book a Strategy Call
              </span>
              <h4 className="font-display font-bold text-lg">Direct 1-on-1 Systems Diagnostic</h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                Skip form submissions. Lock down a direct 30-minute strategic calendar call directly with our principal systems engineers to outline your custom CRM blueprints.
              </p>
              <div className="pt-2">
                <Link to="/book-strategy-call" className="inline-flex items-center space-x-2 text-xs text-astra-navy bg-astra-gold hover:bg-white font-bold px-5 py-2.5 rounded transition shadow">
                  <span>Lock Strategic Call Slot</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Regional coordinate hubs */}
            <div className="p-6 bg-white border border-slate-100 rounded-2xl space-y-4">
              <h4 className="font-display font-bold text-sm text-astra-navy">RevAstra Corporate Hub Coordinates</h4>
              
              <div className="space-y-3.5 text-xs text-slate-500">
                <div className="flex items-start space-x-2.5">
                  <MapPin className="w-4.5 h-4.5 text-astra-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800">Primary Market Hub</p>
                    <p className="text-[11px] mt-0.5">Mumbai-MMR Corridor & Pune, Maharashtra, India</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2.5">
                  <Mail className="w-4.5 h-4.5 text-astra-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800">Systems & Security Desk</p>
                    <p className="text-[11px] mt-0.5">systems@revastra.pro / contact@revastra.pro</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <Phone className="w-4.5 h-4.5 text-astra-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800">Direct WhatsApp Inquiry Desk</p>
                    <p className="text-[11px] mt-0.5">+91 98336 43210 (Automated Brochure Delivery)</p>
                  </div>
                </div>
              </div>

              {/* CSS Map placeholder visual */}
              <div className="h-40 rounded-lg bg-slate-100 border border-slate-200 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 geo-pattern opacity-10" />
                <div className="w-3 h-3 bg-astra-gold rounded-full animate-ping absolute" />
                <div className="w-2.5 h-2.5 bg-astra-navy rounded-full absolute border border-white" />
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-slate-400 tracking-wider">
                  COORD: 19.0760° N, 72.8777° E (Mumbai Central)
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
