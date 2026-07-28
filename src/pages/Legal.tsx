/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, FileText, ChevronRight } from 'lucide-react';

export default function Legal() {
  const [activeTab, setActiveTab] = useState('privacy');

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 bg-white border border-slate-100 p-8 sm:p-10 rounded-2xl shadow-md">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-6 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-astra-gold uppercase tracking-widest font-bold flex items-center">
              <Shield className="w-3.5 h-3.5 mr-1.5" /> Corporate Governance
            </span>
            <h1 className="font-display font-extrabold text-2xl text-astra-navy">Legal Policies & Compliance</h1>
            <p className="text-xs text-slate-400">RevAstra Systems (revastra.pro)</p>
          </div>

          <div className="flex space-x-2">
            {['privacy', 'terms', 'cookie'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded border text-xs font-semibold uppercase font-mono transition ${
                  activeTab === tab 
                    ? 'bg-astra-navy text-white border-astra-navy shadow-sm' 
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {tab === 'privacy' ? 'Privacy' : tab === 'terms' ? 'Terms' : 'Cookies'}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'privacy' && (
          <div className="space-y-4 text-xs text-slate-500 leading-relaxed">
            <h3 className="font-display font-bold text-sm text-astra-navy flex items-center">
              <FileText className="w-4 h-4 mr-1.5 text-astra-gold" /> Privacy Policy (Last Updated: July 2026)
            </h3>
            <p>
              At RevAstra AI, accessible from **revastra.pro**, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by RevAstra and how we use it.
            </p>
            <p className="font-bold text-slate-800">1. Information Collection & Consent</p>
            <p>
              When you submit an enquiry, calculate custom quotes, or consult Chanakya, we collect corporate details including company name, contact person name, active email, and WhatsApp numbers. By ticking our consent checks, you authorize us to process these parameters to configure growth systems.
            </p>
            <p className="font-bold text-slate-800">2. How We Use Your Information</p>
            <p>
              We use the collected information to deliver corporate brochures instantly, confirm strategy call bookings, optimize our Meta/Google campaign audience parameters, and communicate directly regarding setups.
            </p>
            <p className="font-bold text-slate-800">3. Data Security & Storage</p>
            <p>
              All customer profile parameters are held in encrypted client databases on our server-side environments. We never sell, rent, or lease contact sheets to third-party list brokers.
            </p>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-4 text-xs text-slate-500 leading-relaxed">
            <h3 className="font-display font-bold text-sm text-astra-navy flex items-center">
              <FileText className="w-4 h-4 mr-1.5 text-astra-gold" /> Terms of Service (Last Updated: July 2026)
            </h3>
            <p>
              By accessing the website at **revastra.pro** and initializing any of our systems or builder forms, you agree to comply with these terms of service and all applicable local marketing regulations.
            </p>
            <p className="font-bold text-slate-800">1. Modular Billing Guidelines</p>
            <p>
              RevAstra charges creative project setup fees (for photography, videography, or drone shoots) and standard monthly system maintenance fees. Digital advertising expenditures on Meta/Google platforms are paid directly by clients.
            </p>
            <p className="font-bold text-slate-800">2. Disclaimer of Guarantees</p>
            <p>
              While our systems significantly reduce lead-response latencies and leakage risks, individual revenue metrics rely heavily on regional demand, site executive performance, and real estate pricing configurations.
            </p>
          </div>
        )}

        {activeTab === 'cookie' && (
          <div className="space-y-4 text-xs text-slate-500 leading-relaxed">
            <h3 className="font-display font-bold text-sm text-astra-navy flex items-center">
              <FileText className="w-4 h-4 mr-1.5 text-astra-gold" /> Cookie & Tracking Disclosures
            </h3>
            <p>
              We utilize cookies to enhance visitor navigational experiences, remember configured custom quotes calculations, and run analytics.
            </p>
            <p className="font-bold text-slate-800">1. Analytical Cookies</p>
            <p>
              We utilize localized analytics tools and Google Tag Manager to audit campaign CTR metrics and reduce bounce rates.
            </p>
            <p className="font-bold text-slate-800">2. Pixel Integrations</p>
            <p>
              To retarget interested developers or hotel owners, we may integrate standard Meta/Google tracking pixels. You can choose to disable tracking within your mobile web browser preferences.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
