import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Building2, Home, Activity, Hotel, Car, Dumbbell, Factory, ArrowRight } from 'lucide-react';

export default function IndustriesPage() {
  const industries = [
    {
      title: 'Builders & Real Estate Developers',
      desc: 'Automate WhatsApp brochure delivery on Meta Ads, schedule property site visits, and route buyers to channel partners.',
      icon: Building2
    },
    {
      title: 'Real Estate Brokers & Agencies',
      desc: 'Capture viewing leads, send property video walkthroughs instantly, and manage multi-agent leads.',
      icon: Home
    },
    {
      title: 'Clinics & Specialized Healthcare',
      desc: 'Educate patients with treatment reels, automate consultation appointments, and send WhatsApp reminder alerts.',
      icon: Activity
    },
    {
      title: 'Hotels, Resorts & Hospitality',
      desc: 'Direct booking funnels that bypass high OTA commissions with date qualification and room walkthrough reels.',
      icon: Hotel
    },
    {
      title: 'Automotive Dealerships',
      desc: 'Vehicle specification walkthroughs, test drive scheduling, and automated lead assignment.',
      icon: Car
    },
    {
      title: 'Gyms & Fitness Networks',
      desc: 'Transformation videos, trial pass bookings, and membership renewal automation.',
      icon: Dumbbell
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        <section className="bg-astra-navy text-white py-16 px-4 sm:px-6 lg:px-8 text-center border-b border-slate-800">
          <div className="max-w-4xl mx-auto space-y-4">
            <span className="bg-astra-gold/20 text-astra-gold border border-astra-gold/30 text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              Industry Tailored OS
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white">
              Built for High-Growth Indian Sectors
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
              Customized lead qualification workflows, brochure triggers, and quotation templates.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((ind, idx) => {
            const Icon = ind.icon;
            return (
              <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-astra-navy text-astra-gold flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 font-display">{ind.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{ind.desc}</p>
              </div>
            );
          })}
        </section>
      </main>

      <Footer />
    </div>
  );
}
