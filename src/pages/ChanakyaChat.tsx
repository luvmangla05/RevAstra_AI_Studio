/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bot, HelpCircle, Shield, MessageSquare, ArrowRight, Heart } from 'lucide-react';
import ChanakyaWidget from '../components/ChanakyaWidget';

export default function ChanakyaChat() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* Left Column: Chanakya Character Background, Context & Disclosures */}
        <div className="lg:col-span-1 space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 bg-white border border-slate-100 px-2.5 py-1 rounded font-semibold inline-flex items-center">
              <Bot className="w-3.5 h-3.5 mr-1.5 text-astra-gold" />
              Strategic Companion
            </span>
            <h1 className="font-display text-3xl font-extrabold text-astra-navy tracking-tight">
              Chanakya Live Consultation
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Dhanyavaad (Thank you) for initiating a live strategy session. Chanakya is trained to assist in resolving business operations bottleneck, pipeline leakages, and creative photography brief structures.
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-100 rounded-xl space-y-3 text-xs text-slate-500">
            <h4 className="font-bold text-astra-navy flex items-center">
              <Shield className="w-4 h-4 mr-1.5 text-astra-gold" />
              Security & Transparency Guardrails
            </h4>
            <p>
              1. **Disclosed AI Agent**: Chanakya is a generative AI model powered by server-side Gemini 3.5 Flash logic. He is not a human employee.
            </p>
            <p>
              2. **Fluent Multilingualism**: Understands and writes in English, Hindi, and colloquial Hinglish.
            </p>
            <p>
              3. **Secure Registration**: Shared phone numbers or email addresses are stored in encrypted client pipelines and never forwarded to external databases.
            </p>
          </div>

          {/* Quick instructions or suggestion prompts */}
          <div className="p-5 bg-slate-100 rounded-xl space-y-3.5 text-xs text-slate-600">
            <h4 className="font-bold text-slate-800">Suggested Inquiries to Ask:</h4>
            <ul className="space-y-2 list-disc list-inside text-[11px] leading-relaxed">
              <li>"I sell plots in Delhi. What Meta campaign budget should I start with?"</li>
              <li>"My sales agents call prospects after 4 hours. How do we automate this?"</li>
              <li>"What is included in the Arjuna Campaign OS package?"</li>
              <li>"Do you provide cinematic drone photography for hotels?"</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Embedded Chanakya Chat panel */}
        <div className="lg:col-span-2">
          <ChanakyaWidget inline={true} />
        </div>

      </div>
    </div>
  );
}
