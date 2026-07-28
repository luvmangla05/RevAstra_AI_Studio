/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, UserCheck, Hotel, HeartPulse, Dumbbell, Car, 
  AlertCircle, ArrowRight, CheckCircle2, MessageSquare, Calendar
} from 'lucide-react';

export default function IndustrySelector() {
  const [activeTab, setActiveTab] = useState('builders');

  const industries = [
    {
      id: 'builders',
      name: "Builders & Developers",
      icon: Building2,
      pain: "High-intent leads are lost in spreadsheet consoles. High-value property campaigns run without instant follow-ups, causing buyer interest to cool off.",
      loop: [
        "Cinematic walk-through production edited specifically for Meta performance ads.",
        "Meta Lead form captures routing instantly via webhook triggers.",
        "Chanakya Bot instantly delivers digital property brochures and prompts site visit bookings."
      ],
      whatsappDemo: {
        text: "Namaste! I have received your enquiry regarding RevAstra Premium Heights. Here is the layout brochure PDF.",
        button: "Schedule Site Visit Tour",
        meta: "Delivered • 2s ago"
      },
      cta: "Schedule Builders Strategy Call"
    },
    {
      id: 'real-estate',
      name: "Real Estate Brokers",
      icon: UserCheck,
      pain: "Brokerages struggle with fast follow-ups on multiple luxury listings. High agency commissions are paid for unverified lead details.",
      loop: [
        "Listing vertical Reels showcasing lifestyle details of premium localities.",
        "Instant WhatsApp qualification asks for specific location and size preferences.",
        "Automated CRM round-robin routes pre-vetted buyer profiles directly to listing agents."
      ],
      whatsappDemo: {
        text: "Hi! Thanks for checking our Bandra West luxury duplex. Our lead agent Amit is ready to showcase it. Pick a slot:",
        button: "Choose Tour Date & Time",
        meta: "Delivered • 5s ago"
      },
      cta: "Architect Brokerage Funnel"
    },
    {
      id: 'hotels',
      name: "Hotels & Hospitality",
      icon: Hotel,
      pain: "Heavy dependence on OTA channels (Booking.com, Expedia) costs up to 20% in commissions. Guest inquiries go unanswered during off-peak hours.",
      loop: [
        "Immersive room and amenity commercial video assets.",
        "Direct-booking campaigns targeting travelers in active planning phases.",
        "WhatsApp booking assistant confirms availability and locks bookings directly, bypass OTAs."
      ],
      whatsappDemo: {
        text: "Greetings! Direct bookings include complimentary early check-in and breakfast. Tap below to confirm your stay dates:",
        button: "Confirm Booking Direct",
        meta: "Delivered • 10s ago"
      },
      cta: "Deploy Hospitality Bypass System"
    },
    {
      id: 'clinics',
      name: "Clinics & Doctors",
      icon: HeartPulse,
      pain: "No-show rates on appointment slots are high. Front-desk coordinators waste hours calling leads to verify times and treatments.",
      loop: [
        "Physician educational short clips establishing authority and answering patient queries.",
        "Meta geo-targeted lead forms prioritizing neighborhood demographics.",
        "WhatsApp scheduler logs verified clinic slots and automates 24-hour reminder loops."
      ],
      whatsappDemo: {
        text: "Hi! Your dental consultation with Dr. Gupta is logged for Tomorrow at 4:30 PM. Please confirm your attendance below:",
        button: "Confirm Appointment",
        meta: "Delivered • 1m ago"
      },
      cta: "Build Patient Funnel"
    },
    {
      id: 'gyms',
      name: "Gyms & Fitness",
      icon: Dumbbell,
      pain: "Paid gym trial campaigns generate high enquiry volumes, but actual trial attendance is extremely low because of manual follow-up friction.",
      loop: [
        "High-energy training vertical shorts capturing atmosphere and trainer coaching.",
        "Instant delivery of 3-day digital guest passes on WhatsApp upon form completion.",
        "Automated workout reminders and trainer-match follow-ups to prompt first attendance."
      ],
      whatsappDemo: {
        text: "Welcome! Here is your 3-Day Guest Pass QR Code. Let's schedule your first strength workout session with Coach Kabir:",
        button: "Register Workout Slot",
        meta: "Delivered • 12s ago"
      },
      cta: "Launch Gym Trial Booster"
    },
    {
      id: 'automotive',
      name: "Automotive Brands",
      icon: Car,
      pain: "Dealership test-drive requests are delayed. Regional sales managers have no visibility on whether leads are actually called.",
      loop: [
        "Cinematic vehicle walk-through films detailing specs and performance.",
        "High-intent test-drive reservation funnel paired with regional CRM routing.",
        "WhatsApp booking loops confirm available dealership dates and sync executive calendars."
      ],
      whatsappDemo: {
        text: "Hi! Your test-drive slot for the luxury SUV has been registered. Please select your nearest showroom locator:",
        button: "Showroom Locations",
        meta: "Delivered • 15s ago"
      },
      cta: "Configure Dealership Routing"
    }
  ];

  const currentInd = industries.find(ind => ind.id === activeTab) || industries[0];

  return (
    <section className="py-24 bg-slate-50 text-astra-navy border-b border-slate-100" id="industries">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase bg-white border border-slate-200 px-3 py-1 rounded-full">
            Sector Focus Architectures
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-astra-navy leading-tight">
            Industry Solutions. Tailored Operational Paths.
          </h2>
          <p className="text-slate-500 text-lg">
            Compare pain points, system loops, and exact WhatsApp deliverables for your specific industry sector.
          </p>
        </div>

        {/* Industry Switcher Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-12">
          {industries.map((ind) => {
            const Icon = ind.icon;
            const isSelected = activeTab === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => setActiveTab(ind.id)}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center space-y-2 transition-all ${
                  isSelected 
                    ? 'bg-astra-navy text-white border-astra-navy shadow-md' 
                    : 'bg-white border-slate-100 hover:border-slate-300 text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-6 h-6 ${isSelected ? 'text-astra-gold' : 'text-slate-400'}`} />
                <span className="text-xs font-bold font-display leading-tight">{ind.name}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Industry Details Grid */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              
              {/* Left text column (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 block">
                    Core Industry Gaps
                  </span>
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start space-x-3 text-rose-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
                    <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                      {currentInd.pain}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 block">
                    The RevAstra Connected Loop
                  </span>
                  <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
                    {currentInd.loop.map((bullet, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-astra-gold flex-shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <button className="text-xs text-white bg-astra-navy hover:bg-astra-gold hover:text-astra-navy font-bold px-5 py-3 rounded-lg flex items-center space-x-2 shadow-md transition duration-300">
                    <span>{currentInd.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Output Demonstration (5 cols) */}
              <div className="lg:col-span-5 bg-slate-50 border border-slate-200/60 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                    System Deliverable Preview
                  </span>
                  <span className="text-[9px] font-mono bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded font-bold uppercase">
                    WhatsApp Chatbot Output
                  </span>
                </div>

                {/* Simulated Smartphone Chat Bubble */}
                <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3.5 shadow-sm max-w-[90%] mx-auto relative">
                  <div className="flex items-center space-x-2 border-b border-slate-50 pb-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                      CP
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Connected System</h5>
                      <span className="text-[8px] text-slate-400">Official Business Account</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-600 leading-relaxed bg-[#E8F5E9]/50 p-3 rounded-xl border border-[#C8E6C9]/20">
                      {currentInd.whatsappDemo.text}
                    </p>
                    <button className="w-full text-center py-2 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[10px] font-extrabold text-slate-700 shadow-xs flex items-center justify-center space-x-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                      <span>{currentInd.whatsappDemo.button}</span>
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-[8px] font-mono text-slate-400">{currentInd.whatsappDemo.meta}</span>
                  </div>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
