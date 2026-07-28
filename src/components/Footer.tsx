/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Sparkles, Shield, Compass, BookOpen } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-astra-navy text-white pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-display text-2xl font-bold tracking-tight text-white">
                Rev<span className="text-astra-gold">Astra</span>
                <span className="ml-1 text-[9px] uppercase tracking-widest bg-white/10 text-white px-1.5 py-0.5 rounded font-mono">
                  AI
                </span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              We connect creative production, performance marketing, instant lead capture, pipelines and AI automation into one unified growth system.
            </p>
            <div className="bg-white/5 border border-white/10 p-3.5 rounded text-xs text-slate-300 max-w-sm space-y-1">
              <p className="text-astra-gold font-medium flex items-center">
                <Shield className="w-3.5 h-3.5 mr-1 text-astra-gold" />
                Verified Experience
              </p>
              <p className="text-slate-400">
                Backed by more than eight years of professional experience in photography, videography and professional editing.
              </p>
            </div>
          </div>

          {/* Core Services Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-4 flex items-center">
              <Compass className="w-3 h-3 mr-1.5 text-astra-gold" />
              Solutions
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/solutions/creative-production" className="hover:text-white transition">Creative Production</Link></li>
              <li><Link to="/solutions/growth-marketing" className="hover:text-white transition">Growth Marketing</Link></li>
              <li><Link to="/solutions/lead-generation" className="hover:text-white transition">Lead Generation</Link></li>
              <li><Link to="/solutions/ai-automation" className="hover:text-white transition">AI & WhatsApp bots</Link></li>
              <li><Link to="/solutions/crm-pipeline" className="hover:text-white transition">CRM & Sales Pipelines</Link></li>
            </ul>
          </div>

          {/* Industry Solutions Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-4 flex items-center">
              <Sparkles className="w-3 h-3 mr-1.5 text-astra-gold" />
              Target Industries
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/industries/builders" className="hover:text-white font-medium transition text-astra-gold">Builders & Developers</Link></li>
              <li><Link to="/industries/real-estate" className="hover:text-white transition">Real Estate Agencies</Link></li>
              <li><Link to="/industries/hotels" className="hover:text-white transition">Hotels & Hospitality</Link></li>
              <li><Link to="/industries/clinics" className="hover:text-white transition">Clinics & Medical</Link></li>
              <li><Link to="/industries/gyms" className="hover:text-white transition">Gyms & Fitness</Link></li>
              <li><Link to="/industries/automotive" className="hover:text-white transition">Automotive Brands</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-4 flex items-center">
              <BookOpen className="w-3 h-3 mr-1.5 text-astra-gold" />
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/work" className="hover:text-white transition">Case Studies & Work</Link></li>
              <li><Link to="/packages" className="hover:text-white transition">System Packages</Link></li>
              <li><Link to="/growth-system-builder" className="hover:text-white transition">Growth Auditor</Link></li>
              <li><Link to="/talk-to-chanakya" className="hover:text-white transition">Talk to Chanakya</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Support Desk</Link></li>
            </ul>
          </div>

        </div>

        {/* Mid-Row Contacts */}
        <div className="py-6 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-astra-gold" />
            <span>revastraai@gmail.com</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-astra-gold" />
            <span>+91 87960 67710</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-astra-gold" />
            <span>Noida, NCR / Mumbai / Global Service</span>
          </div>
        </div>

        {/* Bottom Col (Legal + Rights) */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 space-y-4 md:space-y-0">
          <div>
            <p>&copy; {currentYear} RevAstra AI (revastra.pro). All rights reserved.</p>
            <p className="mt-1 text-slate-500 font-mono text-[10px]">Strategic Indian intelligence presented through modern global product design.</p>
          </div>
          
          <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
            <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition">Terms & Conditions</Link>
            <Link to="/cookies" className="hover:text-white transition">Cookie Settings</Link>
            <Link to="/disclaimer" className="hover:text-white transition">Disclaimer</Link>
            <Link to="/data-processing" className="hover:text-white transition">GDPR / Data Processing</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
