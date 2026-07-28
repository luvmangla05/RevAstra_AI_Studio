import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { CRMLead, CRMStage, Task, Quotation } from '../../types';
import { 
  Users, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  PlusCircle, 
  FileText, 
  ShieldAlert, 
  MessageSquareCode, 
  Bot, 
  ArrowRight, 
  CheckCircle2, 
  Search,
  Building2,
  Calendar
} from 'lucide-react';

export default function AppDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [leads, setLeads] = useState<CRMLead[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [chanakyaInput, setChanakyaInput] = useState('');

  useEffect(() => {
    // Fetch CRM Leads
    fetch('/api/db/leads')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const mapped = data.map((item: any, idx: number) => ({
            id: item.id || `l_${idx}`,
            name: item.name || 'Prospect',
            phone: item.phone || '+91 98765 43210',
            email: item.email || 'prospect@gmail.com',
            companyName: item.company || 'Direct Buyer',
            city: item.city || 'Noida',
            source: item.source || 'Meta Lead Ads',
            stage: (item.status === 'won' ? 'closed_won' : (item.status === 'qualified' ? 'site_visit_scheduled' : 'new')) as CRMStage,
            value: item.value || 2500000,
            score: item.score || 75,
            notes: 'Requires instant brochure follow-up.',
            createdAt: item.createdAt || new Date().toISOString()
          }));
          setLeads(mapped);
        }
      })
      .catch(e => console.warn("Failed to fetch leads", e));

    // Fetch Tasks
    fetch('/api/crm/tasks')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTasks(data);
      })
      .catch(e => console.warn("Failed to fetch tasks", e));

    // Fetch Quotations
    fetch('/api/crm/quotations')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setQuotations(data);
      })
      .catch(e => console.warn("Failed to fetch quotations", e));
  }, []);

  // Compute metrics
  const totalLeads = leads.length;
  const totalPipelineValue = leads.reduce((sum, l) => sum + (l.value || 0), 0);
  const overdueTasks = tasks.filter(t => t.status === 'pending' || t.status === 'overdue');
  const pendingQuotations = quotations.filter(q => q.status === 'pending_owner_approval' || q.status === 'draft');

  const handleChanakyaSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chanakyaInput.trim()) return;
    navigate('/app/chanakya', { state: { initialPrompt: chanakyaInput } });
  };

  return (
    <AppLayout 
      title={`Welcome back, ${user?.name || 'Partner'}`} 
      subtitle={`Revenue Operations Dashboard for ${user?.businessName || 'Your Business'} (${user?.onboardingData?.city || 'India'})`}
    >
      <div className="space-y-6">
        
        {/* Top Banner: Ask Chanakya AI Bar */}
        <div className="bg-gradient-to-r from-astra-navy via-slate-900 to-indigo-950 rounded-2xl p-6 text-white border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-astra-gold/5 blur-2xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center space-x-2">
                <span className="bg-astra-gold/20 text-astra-gold text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-astra-gold/30">
                  Chanakya Growth Assistant
                </span>
                <span className="text-xs text-slate-400 font-mono">Scope: Sales & Growth Only</span>
              </div>
              <h2 className="text-lg font-bold font-display text-white">How can Chanakya optimize your business today?</h2>
              <p className="text-xs text-slate-300">
                Ask about lead response bottlenecks, WhatsApp objection scripts, or GST quotation structures.
              </p>
            </div>

            <form onSubmit={handleChanakyaSearch} className="w-full md:w-auto flex items-center space-x-2">
              <input
                type="text"
                value={chanakyaInput}
                onChange={(e) => setChanakyaInput(e.target.value)}
                placeholder="e.g. How to convert Meta leads faster?"
                className="bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-astra-gold min-w-[260px]"
              />
              <button
                type="submit"
                className="bg-astra-gold text-astra-navy hover:bg-amber-400 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center whitespace-nowrap"
              >
                <Bot className="w-4 h-4 mr-1.5" />
                Ask AI
              </button>
            </form>
          </div>
        </div>

        {/* Concise Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm hover:shadow transition">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500">Active Leads in CRM</p>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold font-display text-slate-900 mt-2">{totalLeads}</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> Multi-source pipeline
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm hover:shadow transition">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500">Pipeline Value (INR)</p>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold font-display text-slate-900 mt-2">
              ₹{(totalPipelineValue / 100000).toFixed(1)} Lakhs
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Across all pipeline stages</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm hover:shadow transition">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500">Pending / Overdue Tasks</p>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold font-display text-slate-900 mt-2">{overdueTasks.length}</p>
            <p className="text-[11px] text-amber-700 font-medium mt-1 flex items-center">
              <AlertTriangle className="w-3 h-3 mr-1" /> Follow-ups requiring action
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm hover:shadow transition">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500">Quotations Drafted</p>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold font-display text-slate-900 mt-2">{quotations.length}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">GST Compliant Structure</p>
          </div>

        </div>

        {/* 2-Column Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (2 Cols): Daily Priority & Pipeline Summary */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Daily Priority List */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-astra-navy" />
                  <h3 className="text-sm font-bold text-slate-900 font-display">Daily Revenue Priority List</h3>
                </div>
                <Link to="/app/tasks" className="text-xs text-astra-gold hover:underline font-bold flex items-center">
                  View All Tasks <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </div>

              {overdueTasks.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  All follow-up tasks for today are clear! Good job keeping lead response velocity high.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {overdueTasks.slice(0, 4).map((task) => (
                    <div key={task.id} className="flex items-start justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-white transition">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-800">{task.title}</span>
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        {task.leadName && (
                          <p className="text-[11px] text-slate-500">
                            Lead: <strong className="text-slate-700">{task.leadName}</strong> ({task.leadPhone})
                          </p>
                        )}
                      </div>
                      <Link 
                        to="/app/tasks" 
                        className="text-[10px] font-bold text-astra-navy bg-white border border-slate-200 hover:border-astra-gold px-2.5 py-1 rounded shadow-xs"
                      >
                        Action
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pipeline Summary Card */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-astra-navy" />
                  <h3 className="text-sm font-bold text-slate-900 font-display">Sales Pipeline Breakdown</h3>
                </div>
                <Link to="/app/crm" className="text-xs text-astra-navy hover:text-astra-gold font-bold">
                  Open CRM →
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg">
                  <p className="text-[10px] font-bold uppercase text-blue-700 font-mono">New Leads</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {leads.filter(l => l.stage === 'new').length}
                  </p>
                </div>
                <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-lg">
                  <p className="text-[10px] font-bold uppercase text-amber-700 font-mono">Site Visits / Calls</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {leads.filter(l => l.stage === 'site_visit_scheduled' || l.stage === 'site_visit_done').length}
                  </p>
                </div>
                <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-lg">
                  <p className="text-[10px] font-bold uppercase text-purple-700 font-mono">Quotations</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {leads.filter(l => l.stage === 'quotation_sent' || l.stage === 'negotiation').length}
                  </p>
                </div>
                <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-lg">
                  <p className="text-[10px] font-bold uppercase text-emerald-700 font-mono">Closed Won</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {leads.filter(l => l.stage === 'closed_won').length}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (1 Col): Quick Tools & Recent Audits */}
          <div className="space-y-6">
            
            {/* Quick Free Tools Launcher */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Quick Free Tools</h3>
              
              <div className="space-y-2">
                <Link to="/app/crm" className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-astra-gold hover:bg-slate-50 transition group">
                  <div className="flex items-center space-x-2.5">
                    <Users className="w-4 h-4 text-astra-navy" />
                    <span className="text-xs font-semibold text-slate-800">Free Managed CRM</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-astra-gold group-hover:translate-x-0.5 transition" />
                </Link>

                <Link to="/app/lead-auditor" className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-astra-gold hover:bg-slate-50 transition group">
                  <div className="flex items-center space-x-2.5">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-semibold text-slate-800">Lead Leakage Auditor</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-astra-gold group-hover:translate-x-0.5 transition" />
                </Link>

                <Link to="/app/conversation-analyser" className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-astra-gold hover:bg-slate-50 transition group">
                  <div className="flex items-center space-x-2.5">
                    <MessageSquareCode className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-semibold text-slate-800">Conversation Analyser</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-astra-gold group-hover:translate-x-0.5 transition" />
                </Link>

                <Link to="/app/quotation-assistant" className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-astra-gold hover:bg-slate-50 transition group">
                  <div className="flex items-center space-x-2.5">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-semibold text-slate-800">GST Quotation Assistant</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-astra-gold group-hover:translate-x-0.5 transition" />
                </Link>
              </div>
            </div>

            {/* RevAstra Growth Engine Card */}
            <div className="bg-astra-navy text-white rounded-xl p-5 shadow-sm space-y-3">
              <span className="text-[10px] font-mono text-astra-gold uppercase font-bold tracking-widest">Growth Engine</span>
              <h4 className="text-sm font-bold font-display">Need Managed CRM or Video Shoots?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Upgrade from Shunya to Saarthi or Arjuna for managed lead imports, WhatsApp automation rules, and short-form video reels.
              </p>
              <Link to="/app/billing" className="inline-flex items-center text-xs font-bold text-astra-gold hover:underline pt-1">
                Explore RevAstra Plans →
              </Link>
            </div>

          </div>

        </div>

      </div>
    </AppLayout>
  );
}
