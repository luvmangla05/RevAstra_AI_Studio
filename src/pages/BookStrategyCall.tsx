/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, Clock, CheckCircle2, PhoneCall, Sparkles, 
  ArrowRight, ArrowLeft, ShieldCheck 
} from 'lucide-react';

export default function BookStrategyCall() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('2026-07-20');
  const [selectedTime, setSelectedTime] = useState('11:30 AM');
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    biggestObstacle: 'Delayed lead follow-ups'
  });

  const availableDates = [
    { value: '2026-07-20', label: 'Mon, Jul 20', slots: 3 },
    { value: '2026-07-21', label: 'Tue, Jul 21', slots: 5 },
    { value: '2026-07-22', label: 'Wed, Jul 22', slots: 2 },
    { value: '2026-07-23', label: 'Thu, Jul 23', slots: 4 }
  ];

  const availableTimes = [
    '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'
  ];

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      alert("Please complete name, email and whatsapp phone.");
      return;
    }

    try {
      await fetch('/api/db/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: selectedDate,
          time: selectedTime
        })
      });

      // Save as lead too
      await fetch('/api/db/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.companyName || 'Consultation Booking',
          industry: 'builders',
          source: `Strategy Call booked: ${selectedDate} at ${selectedTime}`
        })
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-5 relative">
        
        {/* Left Column Accent Copy */}
        <div className="bg-astra-navy text-white p-8 md:col-span-2 space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 geo-pattern opacity-10" />
          <span className="text-[9px] font-mono text-astra-gold uppercase tracking-widest font-bold flex items-center">
            <Sparkles className="w-3.5 h-3.5 mr-1" /> Principal Strategy
          </span>
          <h3 className="font-display font-extrabold text-xl leading-tight">30-Minute Growth Diagnostics Session</h3>
          <p className="text-slate-300 text-xs leading-relaxed">
            A focused systems mapping meeting. We will review your current creative walkthrough quality, calculate follow-up delays, and outline a complete CRM automatic routing layout, free of cost.
          </p>
          
          <div className="space-y-4 pt-4 border-t border-white/10 text-[11px] text-slate-300">
            <p className="flex items-start">
              <CheckCircle2 className="w-4 h-4 text-astra-gold mr-2 flex-shrink-0" />
              <span>Diagnostic CRM layout plan mapped live.</span>
            </p>
            <p className="flex items-start">
              <CheckCircle2 className="w-4 h-4 text-astra-gold mr-2 flex-shrink-0" />
              <span>Creative walkthrough shoot brief configured.</span>
            </p>
            <p className="flex items-start">
              <CheckCircle2 className="w-4 h-4 text-astra-gold mr-2 flex-shrink-0" />
              <span>Chanakya rules aligned with sales targets.</span>
            </p>
          </div>
        </div>

        {/* Right Column Interactive Booking Grid */}
        <div className="p-8 sm:p-10 md:col-span-3 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Calendar Planner</span>
            <Link to="/" className="text-[11px] font-semibold text-slate-400 hover:text-astra-navy flex items-center">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Return
            </Link>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
              <h4 className="font-display font-bold text-lg text-slate-800">Reservation Confirmed!</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Dhanyavaad (Thank you), {formData.name}. We have reserved your Strategy Session on **{selectedDate} at {selectedTime}**. 
                An automated diary invite with Google Meet coordinates and WhatsApp details has been sent.
              </p>
              <div className="pt-4">
                <Link to="/" className="text-xs font-bold text-white bg-astra-navy px-5 py-2.5 rounded hover:bg-astra-gold hover:text-astra-navy transition">
                  Return to Homepage
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBook} className="space-y-4 text-xs">
              
              {/* Date Selectors */}
              <div className="space-y-2">
                <label className="block text-[10px] font-mono uppercase text-slate-400 tracking-wider">Select Available Day</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {availableDates.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setSelectedDate(d.value)}
                      className={`p-2.5 border rounded text-center transition ${
                        selectedDate === d.value 
                          ? 'border-astra-gold bg-astra-navy text-white font-bold' 
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <p className="text-[10px] font-semibold">{d.label}</p>
                      <p className="text-[8px] text-slate-400 mt-0.5">{d.slots} slots</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selectors */}
              <div className="space-y-2">
                <label className="block text-[10px] font-mono uppercase text-slate-400 tracking-wider">Select Available Time (IST)</label>
                <div className="flex flex-wrap gap-1.5">
                  {availableTimes.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTime(t)}
                      className={`px-3 py-1.5 border rounded-full text-[10px] font-medium transition ${
                        selectedTime === t 
                          ? 'border-astra-gold bg-astra-gold text-astra-navy font-bold shadow-xs' 
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inputs */}
              <div className="space-y-3.5 border-t border-slate-100 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Company Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                      placeholder="e.g. Marvel developers"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Sunil Patil"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="e.g. sunil@marvel.pro"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">WhatsApp Number</label>
                    <input 
                      type="text" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="e.g. +91 91000 00000"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded text-xs"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-astra-navy hover:bg-astra-gold text-white hover:text-astra-navy font-bold py-3 rounded text-xs transition shadow-md mt-2 flex items-center justify-center space-x-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Confirm Strategy Reservation Slot</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
