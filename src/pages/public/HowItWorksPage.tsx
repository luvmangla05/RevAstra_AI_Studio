import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Sparkles, ArrowRight, Zap, Target, Users, CheckCircle2 } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Attention & Demand Capture',
      desc: 'On-site commercial video shoots and targeted Meta Ads generate high-intent inquiries from local Indian buyers.'
    },
    {
      num: '02',
      title: 'Instant Ingestion & SLA Response',
      desc: 'Leads from WhatsApp, Meta Ads, and Property Portals flow into RevAstra Free CRM within 2 seconds.'
    },
    {
      num: '03',
      title: 'Automated Qualification & Follow-ups',
      desc: 'Instant WhatsApp brochure delivery, automated site visit booking reminders, and Chanakya AI objection scripts.'
    },
    {
      num: '04',
      title: 'GST Quotation & Revenue Conversion',
      desc: 'Generate professional GST quotations in seconds and track deal closures across your sales team.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        <section className="bg-astra-navy text-white py-16 px-4 sm:px-6 lg:px-8 text-center border-b border-slate-800">
          <div className="max-w-4xl mx-auto space-y-4">
            <span className="bg-astra-gold/20 text-astra-gold border border-astra-gold/30 text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              4-Stage Architecture
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white">
              How RevAstra Growth OS Works
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
              Create attention. Capture demand. Automate conversion.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
          <div className="space-y-6">
            {steps.map((st, idx) => (
              <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-6">
                <span className="text-3xl font-extrabold font-mono text-astra-gold bg-astra-navy px-4 py-2 rounded-xl">
                  {st.num}
                </span>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 font-display">{st.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-6">
            <Link
              to="/register"
              className="inline-flex items-center bg-astra-gold text-astra-navy hover:bg-amber-400 font-bold px-6 py-3 rounded-xl text-xs transition shadow-lg space-x-2"
            >
              <span>Get Started Free with Shunya Plan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
