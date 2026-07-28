import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { 
  Users, 
  ShieldAlert, 
  BarChart3, 
  MessageSquareCode, 
  FileCheck2, 
  Sparkles, 
  ArrowRight, 
  Bot, 
  Video, 
  Zap, 
  PhoneCall, 
  Building2 
} from 'lucide-react';

export default function ProductsPage() {
  const freeTools = [
    {
      title: 'Free Managed CRM',
      desc: 'Organize Indian business leads into structured pipelines. Filter by city, lead source, and site visit stage.',
      icon: Users,
      route: '/app/crm'
    },
    {
      title: 'Lead Leakage Auditor',
      desc: 'Diagnostic tool that quantifies slow contact speeds, missed follow-ups, and calculates lost revenue in ₹ INR.',
      icon: ShieldAlert,
      route: '/app/lead-auditor'
    },
    {
      title: 'Sales Process Auditor',
      desc: 'Audit quote turnaround speeds, telecaller scripts, and eliminate business owner signature bottlenecks.',
      icon: BarChart3,
      route: '/app/sales-auditor'
    },
    {
      title: 'WhatsApp Conversation Analyser',
      desc: 'Paste chat transcripts to identify buyer price sensitivity, objections, and receive AI-generated response scripts.',
      icon: MessageSquareCode,
      route: '/app/conversation-analyser'
    },
    {
      title: 'GST Quotation Assistant',
      desc: 'Generate professional, GST-compliant quotations with automated CGST/SGST/IGST tax breakdowns.',
      icon: FileCheck2,
      route: '/app/quotation-assistant'
    }
  ];

  const managedModules = [
    {
      title: 'Trained Custom AI Business Agents',
      desc: 'Voice and WhatsApp agents trained specifically on your product catalog, pricing matrices, and RERA terms for instant lead qualification.',
      icon: Bot
    },
    {
      title: 'Managed Commercial Video Production',
      desc: 'On-site video production crews capturing high-converting short-form reels for Meta and Instagram ads.',
      icon: Video
    },
    {
      title: 'Automated WhatsApp Workflow Engine',
      desc: 'Instant 5-second brochure delivery, automated site visit confirmations, and multi-touch follow-up sequences.',
      icon: Zap
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        
        {/* Header Hero */}
        <section className="bg-astra-navy text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 text-center">
          <div className="max-w-4xl mx-auto space-y-4">
            <span className="bg-astra-gold/20 text-astra-gold border border-astra-gold/30 text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              Full System Architecture
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white">
              The AI Growth Operating System Suite
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Beginning with free business tools and expanding into managed CRM, lead intelligence, sales automation, video content, and trained agents.
            </p>
          </div>
        </section>

        {/* Free Business Tools Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-astra-navy uppercase tracking-wider">Foundation Layer</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
              Free Growth Tools for Every Indian Business Owner
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              No credit card required. Start digitizing your sales pipeline in under 2 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freeTools.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-astra-navy text-astra-gold flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 font-display">{tool.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{tool.desc}</p>
                  </div>

                  <Link 
                    to={tool.route}
                    className="inline-flex items-center text-xs font-bold text-astra-navy hover:text-astra-gold pt-2 group"
                  >
                    <span>Launch Tool Free</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* Managed AI Growth Modules */}
        <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-mono font-bold text-astra-gold uppercase tracking-wider">Advanced Layer</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                Managed AI Infrastructure & Content Production
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Turnkey revenue operations managed by RevAstra's strategist and production teams.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {managedModules.map((m, idx) => {
                const Icon = m.icon;
                return (
                  <div key={idx} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-lg space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-astra-gold/20 text-astra-gold border border-astra-gold/30 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white font-display">{m.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{m.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="text-center pt-4">
              <Link
                to="/pricing"
                className="inline-flex items-center bg-astra-gold text-astra-navy hover:bg-amber-400 font-bold px-6 py-3 rounded-xl text-xs transition shadow-lg space-x-2"
              >
                <span>Compare Plan Entitlements & Pricing</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
