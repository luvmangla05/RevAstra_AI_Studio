/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users, Bot, ShieldCheck, Database, Calendar, TrendingUp, CheckCircle2,
  Trash2, ShieldAlert, Cpu, RefreshCw, LogOut, PhoneCall
} from 'lucide-react';
import { Lead, CRMStage, Assessment, Consultation, Quote } from '../types';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  const [voiceSettings, setVoiceSettings] = useState({
    voiceName: 'Zephyr',
    sessionLimitSeconds: 180,
    costLimitDollars: 0.20,
    systemInstruction: ''
  });
  const [savingVoice, setSavingVoice] = useState(false);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [leadsRes, assRes, consRes, quotesRes, voiceRes] = await Promise.all([
        fetch('/api/db/leads'),
        fetch('/api/db/assessments'),
        fetch('/api/db/consultations'),
        fetch('/api/db/quotes'),
        fetch('/api/db/voice-settings')
      ]);

      const [leadsData, assData, consData, quotesData, voiceData] = await Promise.all([
        leadsRes.json(),
        assRes.json(),
        consRes.json(),
        quotesRes.json(),
        voiceRes.ok ? voiceRes.json() : Promise.resolve(null)
      ]);

      setLeads(leadsData || []);
      setAssessments(assData || []);
      setConsultations(consData || []);
      setQuotes(quotesData || []);

      if (voiceData) {
        setVoiceSettings(voiceData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if authenticated
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') {
      // Allow preview regardless, but flag role
    }
    fetchAllData();
  }, []);

  const handleUpdateLeadStage = async (id: string, newStage: CRMStage) => {
    try {
      await fetch(`/api/db/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage })
      });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await fetch(`/api/db/leads/${id}`, {
        method: 'DELETE'
      });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveVoiceSettings = async () => {
    setSavingVoice(true);
    try {
      const res = await fetch('/api/db/voice-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(voiceSettings)
      });
      if (res.ok) {
        alert("Chanakya voice settings updated successfully.");
      } else {
        alert("Failed to save voice settings.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving voice settings.");
    } finally {
      setSavingVoice(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('revastra_user_session');
    localStorage.removeItem('revastra_user_token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* Top Admin Navigation Header */}
      <div className="bg-astra-navy text-white p-4 sticky top-0 z-30 shadow-md border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs">
          <div className="flex items-center space-x-3">
            <Cpu className="w-6 h-6 text-astra-gold animate-spin-slow" />
            <span className="font-display font-extrabold text-sm tracking-wider uppercase">RevAstra Corporate Systems HQ</span>
            <span className="bg-astra-gold text-astra-navy text-[8px] font-mono px-2 py-0.2 rounded font-bold uppercase">Super Admin</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchAllData}
              className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white transition flex items-center space-x-1"
              title="Refresh Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleLogout}
              className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded transition font-semibold flex items-center space-x-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Navigation Sidebar */}
        <div className="space-y-2 lg:col-span-1">
          {[
            { id: 'leads', label: 'Lead Operations Board', count: leads.length },
            { id: 'assessments', label: 'Business Audits Captured', count: assessments.length },
            { id: 'consultations', label: 'Strategy Bookings', count: consultations.length },
            { id: 'quotes', label: 'Custom Quotes Generated', count: quotes.length },
            { id: 'voice', label: 'Chanakya Voice Controls', count: null }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left p-3.5 rounded-xl text-xs font-semibold border transition flex justify-between items-center ${activeTab === tab.id
                  ? 'bg-astra-navy text-white border-astra-navy shadow-md'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`px-2 py-0.2 text-[9px] rounded-full font-mono font-bold ${activeTab === tab.id ? 'bg-astra-gold text-astra-navy' : 'bg-slate-100 text-slate-500'
                  }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Dynamic Admin Panels */}
        <div className="lg:col-span-3 space-y-6">

          {loading ? (
            <div className="text-center py-20 bg-white border border-slate-100 rounded-xl">
              <div className="w-8 h-8 border-4 border-astra-gold border-t-astra-navy rounded-full animate-spin mx-auto" />
              <p className="text-slate-400 text-xs mt-3">Refreshing central system registry...</p>
            </div>
          ) : (
            <>
              {activeTab === 'leads' && (
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-base text-astra-navy flex items-center">
                      <Users className="w-5 h-5 text-astra-gold mr-2" />
                      Active Lead Board (CRUD Operations)
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Change status directly, or remove invalid/test listings.</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-mono text-[10px] uppercase">
                          <th className="py-3">Contact</th>
                          <th className="py-3">Company / Project</th>
                          <th className="py-3">Source Channel</th>
                          <th className="py-3">Pipeline Status</th>
                          <th className="py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-slate-700">
                        {leads.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-slate-400 italic">No operational leads logged yet.</td>
                          </tr>
                        ) : (
                          leads.map((l) => (
                            <tr key={l.id} className="hover:bg-slate-50/50">
                              <td className="py-3.5">
                                <p className="font-bold text-slate-800">{l.name}</p>
                                <p className="text-[10px] text-slate-400">{l.phone} | {l.email}</p>
                              </td>
                              <td className="py-3.5">
                                <p className="font-medium">{l.companyName || l.company || 'N/A'}</p>
                                <p className="text-[10px] font-mono uppercase text-slate-400">{l.industry || 'General'}</p>
                              </td>
                              <td className="py-3.5">
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-[9px] font-medium font-mono">
                                  {l.source}
                                </span>
                              </td>
                              <td className="py-3.5">
                                <select
                                  value={l.stage || l.status || 'new'}
                                  onChange={(e) => handleUpdateLeadStage(l.id, e.target.value as CRMStage)}
                                  className="bg-slate-50 border border-slate-200 rounded p-1 text-[11px] font-semibold text-slate-700 cursor-pointer"
                                >
                                  <option value="new">New Lead</option>
                                  <option value="contacted">Contacted</option>
                                  <option value="site_visit_scheduled">Site Visit Scheduled</option>
                                  <option value="site_visit_done">Site Visit Done</option>
                                  <option value="quotation_sent">Quotation Sent</option>
                                  <option value="negotiation">Negotiation</option>
                                  <option value="closed_won">Closed Won</option>
                                  <option value="closed_lost">Closed Lost</option>
                                </select>
                              </td>
                              <td className="py-3.5 text-right">
                                <button
                                  onClick={() => handleDeleteLead(l.id)}
                                  className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                                  title="Remove Lead"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'assessments' && (
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-base text-astra-navy flex items-center">
                      <ShieldAlert className="w-5 h-5 text-red-500 mr-2" />
                      Client Business Audits Captured
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Submitted parameters with calculated leakage risk, ideal packages, and client budgets.</p>
                  </div>

                  <div className="space-y-4">
                    {assessments.length === 0 ? (
                      <p className="text-center py-8 text-slate-400 italic text-xs">No audits recorded yet.</p>
                    ) : (
                      assessments.map((ass) => (
                        <div key={ass.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50 space-y-4">
                          <div className="flex justify-between items-start border-b border-slate-200 pb-2.5">
                            <div>
                              <p className="font-bold text-slate-800 text-sm">{ass.companyName} ({ass.contactName})</p>
                              <p className="text-[10px] text-slate-400 font-mono">INDUSTRY: {ass.industry} | BUDGET: {ass.budgetRange}</p>
                            </div>
                            <span className="bg-red-100 text-red-700 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded">
                              LEAKAGE: {ass.scores.leakRisk}%
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px] text-slate-500">
                            <div>
                              <p className="font-mono text-[9px] uppercase tracking-wider text-slate-400">Roadblock</p>
                              <p className="font-semibold text-slate-700 mt-0.5">{ass.biggestProblem}</p>
                            </div>
                            <div>
                              <p className="font-mono text-[9px] uppercase tracking-wider text-slate-400">Delay Speed</p>
                              <p className="font-semibold text-slate-700 mt-0.5">{ass.responseSpeed}</p>
                            </div>
                            <div>
                              <p className="font-mono text-[9px] uppercase tracking-wider text-slate-400">Monthly Volume</p>
                              <p className="font-semibold text-slate-700 mt-0.5">{ass.monthlyEnquiries} leads</p>
                            </div>
                            <div>
                              <p className="font-mono text-[9px] uppercase tracking-wider text-slate-400">Decision Outcome</p>
                              <p className="font-semibold text-slate-700 mt-0.5">Package: {ass.recommendedPackage}</p>
                            </div>
                          </div>

                          <div className="text-[11px] text-slate-600 bg-white border border-slate-100 rounded p-3 italic">
                            Chanakya's Analysis: "{ass.analysisText.slice(0, 180)}..."
                          </div>

                          <div className="flex justify-end pt-1">
                            <Link
                              to={`/recommendation/${ass.id}`}
                              target="_blank"
                              className="text-[11px] font-bold text-astra-gold hover:underline flex items-center"
                            >
                              Open Diagnostic Recommendation Profile <CheckCircle2 className="w-3.5 h-3.5 ml-1" />
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'consultations' && (
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-base text-astra-navy flex items-center">
                      <Calendar className="w-5 h-5 text-astra-gold mr-2" />
                      Strategic Consultation Call Bookings
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Calendar holds requested by developers and brokers.</p>
                  </div>

                  <div className="space-y-4">
                    {consultations.length === 0 ? (
                      <p className="text-center py-8 text-slate-400 italic text-xs">No bookings recorded yet.</p>
                    ) : (
                      consultations.map((c) => (
                        <div key={c.id} className="p-4 border border-slate-100 bg-slate-50 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs">
                          <div>
                            <p className="font-bold text-slate-800">{c.companyName} ({c.name})</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{c.phone} | {c.email}</p>
                            <p className="text-[10px] text-slate-500 italic mt-1"> Roadblock: {c.biggestObstacle}</p>
                          </div>

                          <div className="bg-white border border-slate-100 px-4 py-2 rounded text-center sm:text-right flex-shrink-0">
                            <p className="font-mono text-[9px] uppercase tracking-wider text-slate-400">SCHEDULED TIME</p>
                            <p className="font-bold text-astra-navy mt-0.5">{c.date}</p>
                            <p className="text-[11px] text-astra-gold font-bold">{c.time} IST</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'quotes' && (
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-base text-astra-navy flex items-center">
                      <TrendingUp className="w-5 h-5 text-astra-gold mr-2" />
                      Custom Quotes Generated (Live Calculator)
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Bespoke pricing configurations submitted by prospects.</p>
                  </div>

                  <div className="space-y-4">
                    {quotes.length === 0 ? (
                      <p className="text-center py-8 text-slate-400 italic text-xs">No calculator quotes logged yet.</p>
                    ) : (
                      quotes.map((q) => (
                        <div key={q.id} className="p-4 border border-slate-100 bg-slate-50 rounded-xl space-y-3.5 text-xs">
                          <div className="flex justify-between items-start border-b border-slate-200 pb-2.5">
                            <div>
                              <p className="font-bold text-slate-800">{q.company} ({q.name})</p>
                              <p className="text-[10px] text-slate-400">{q.phone} | {q.email}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-astra-navy">Setup: ₹{q.estimatedOneTime.toLocaleString()}</p>
                              <p className="font-bold text-astra-gold">Monthly: ₹{q.estimatedMonthly.toLocaleString()}/mo</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {q.needsShoots && (
                              <span className="bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded text-[10px] font-medium font-mono">
                                Photo Shoots ({q.shootCount})
                              </span>
                            )}
                            {q.needsMarketing && (
                              <span className="bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded text-[10px] font-medium font-mono">
                                Campaign Manager
                              </span>
                            )}
                            {q.needsWhatsApp && (
                              <span className="bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded text-[10px] font-medium font-mono">
                                WhatsApp API
                              </span>
                            )}
                            {q.needsChanakya && (
                              <span className="bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded text-[10px] font-medium font-mono">
                                Chanakya Advisor
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'voice' && (
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-base text-astra-navy flex items-center">
                      <Bot className="w-5 h-5 text-astra-gold mr-2" />
                      Chanakya Voice & Strategic Controls
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Configure real-time voice attributes, safety budget locks, session timers and core consulting instructions.</p>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-mono text-[10px] uppercase font-bold text-slate-500">Selected Gemini Voice</label>
                        <select
                          value={voiceSettings.voiceName}
                          onChange={(e) => setVoiceSettings(prev => ({ ...prev, voiceName: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-700 focus:outline-none focus:border-astra-gold"
                        >
                          <option value="Zephyr">Zephyr (Warm, Mature Male Indian English Accent)</option>
                          <option value="Puck">Puck (Energetic Male)</option>
                          <option value="Charon">Charon (Calm, Consultative Male)</option>
                          <option value="Kore">Kore (Balanced Female)</option>
                          <option value="Fenrir">Fenrir (Deep Voice Male)</option>
                          <option value="Aoede">Aoede (Clear Female)</option>
                        </select>
                        <p className="text-[10px] text-slate-400 font-mono">Zephyr is the default warm Indian English consulting voice.</p>
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[10px] uppercase font-bold text-slate-500">Session Limit (Seconds)</label>
                        <input
                          type="number"
                          value={voiceSettings.sessionLimitSeconds}
                          onChange={(e) => setVoiceSettings(prev => ({ ...prev, sessionLimitSeconds: parseInt(e.target.value) || 180 }))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-700 focus:outline-none focus:border-astra-gold"
                        />
                        <p className="text-[10px] text-slate-400 font-mono">Automatically close the call after this duration to prevent idle billing.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-mono text-[10px] uppercase font-bold text-slate-500">Session Cost Cap (USD)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={voiceSettings.costLimitDollars}
                          onChange={(e) => setVoiceSettings(prev => ({ ...prev, costLimitDollars: parseFloat(e.target.value) || 0.20 }))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-700 focus:outline-none focus:border-astra-gold"
                        />
                        <p className="text-[10px] text-slate-400 font-mono">Estimated cost budget based on streamed input/output audio frames.</p>
                      </div>

                      <div className="space-y-1 flex items-end">
                        <button
                          onClick={handleSaveVoiceSettings}
                          disabled={savingVoice}
                          className="w-full bg-astra-navy hover:bg-opacity-90 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center space-x-2"
                        >
                          {savingVoice ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <ShieldCheck className="w-4 h-4 text-astra-gold" />
                          )}
                          <span>SAVE VOICE SETTINGS</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-slate-500">Core Consulting Instructions (System Instruction)</label>
                      <textarea
                        rows={6}
                        value={voiceSettings.systemInstruction}
                        onChange={(e) => setVoiceSettings(prev => ({ ...prev, systemInstruction: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-700 focus:outline-none focus:border-astra-gold font-mono text-[11px]"
                        placeholder="Chanakya system prompt instructions..."
                      />
                      <p className="text-[10px] text-slate-400 font-mono">Tweaks Chanakya's response personality, language detection parameters, and conversational strategies.</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
}
