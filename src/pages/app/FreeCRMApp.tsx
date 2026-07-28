import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { CRMLead, CRMStage } from '../../types';
import { PLAN_LIMITS } from '../../data/plansData';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  Tag, 
  Building2, 
  Calendar, 
  Edit3, 
  CheckCircle, 
  Sparkles, 
  Download, 
  Upload,
  AlertCircle
} from 'lucide-react';

export default function FreeCRMApp() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<CRMLead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // New Lead Form State
  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    email: '',
    companyName: '',
    city: user?.onboardingData?.city || 'Noida',
    source: 'Meta Lead Ads',
    value: 1500000,
    notes: ''
  });

  const crmLimit = user?.plan ? PLAN_LIMITS[user.plan].crmLeadsLimit : 100;

  useEffect(() => {
    fetch('/api/db/leads')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const mapped: CRMLead[] = data.map((item: any, idx: number) => ({
            id: item.id || `l_${idx}`,
            name: item.name || 'Prospect',
            phone: item.phone || '+91 98765 43210',
            email: item.email || 'lead@example.com',
            companyName: item.company || 'Direct Buyer',
            city: item.city || 'Delhi NCR',
            source: item.source || 'Meta Lead Ads',
            stage: item.stage || (item.status === 'won' ? 'closed_won' : (item.status === 'qualified' ? 'site_visit_scheduled' : 'new')),
            value: item.value || 2000000,
            score: item.score || 70,
            notes: item.notes || 'Interested in 3 BHK brochure.',
            createdAt: item.createdAt || new Date().toISOString()
          }));
          setLeads(mapped);
        }
      });
  }, []);

  const handleAddLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name || !newLead.phone) return;

    const leadToAdd: CRMLead = {
      id: 'l_' + Math.random().toString(36).substring(2, 9),
      name: newLead.name,
      phone: newLead.phone,
      email: newLead.email,
      companyName: newLead.companyName,
      city: newLead.city,
      source: newLead.source,
      stage: 'new',
      value: Number(newLead.value),
      score: 80,
      notes: newLead.notes,
      createdAt: new Date().toISOString()
    };

    try {
      await fetch('/api/db/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadToAdd)
      });
    } catch (err) {
      console.warn("Failed to persist lead on backend", err);
    }

    setLeads([leadToAdd, ...leads]);
    setIsAddModalOpen(false);
    setNewLead({
      name: '',
      phone: '',
      email: '',
      companyName: '',
      city: user?.onboardingData?.city || 'Noida',
      source: 'Meta Lead Ads',
      value: 1500000,
      notes: ''
    });
  };

  const handleStageChange = (leadId: string, newStage: CRMStage) => {
    setLeads(leads.map(l => l.id === leadId ? { ...l, stage: newStage } : l));
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.phone.includes(searchQuery) || 
                          l.companyName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = selectedStage === 'all' || l.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  const getStageBadgeClass = (stage: CRMStage) => {
    switch (stage) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contacted': return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'site_visit_scheduled': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'site_visit_done': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'quotation_sent': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'negotiation': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'closed_won': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'closed_lost': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <AppLayout 
      title="Free Managed CRM" 
      subtitle="Organize Indian business leads, manage pipelines, and schedule site visit follow-ups."
    >
      <div className="space-y-6">
        
        {/* Usage Bar & Actions */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="p-2.5 bg-astra-navy text-astra-gold rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-900">Stored Leads Limit:</span>
                <span className="text-xs font-mono font-bold text-astra-navy bg-slate-100 px-2 py-0.5 rounded">
                  {leads.length} / {crmLimit} Leads
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Included in your <span className="font-bold uppercase">{user?.plan || 'Shunya'}</span> plan.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex-1 sm:flex-initial px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1"
            >
              <Upload className="w-3.5 h-3.5 mr-1" />
              <span>Import Excel</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex-1 sm:flex-initial px-4 py-2 bg-astra-navy hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 mr-1 text-astra-gold" />
              <span>+ Add Lead</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by lead name, phone, company..."
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-astra-gold shadow-xs"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Stage Filter Buttons */}
          <div className="flex items-center space-x-1 overflow-x-auto w-full md:w-auto pb-1">
            {[
              { id: 'all', label: 'All Stages' },
              { id: 'new', label: 'New' },
              { id: 'contacted', label: 'Contacted' },
              { id: 'site_visit_scheduled', label: 'Site Visit' },
              { id: 'quotation_sent', label: 'Quotation' },
              { id: 'closed_won', label: 'Won' }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStage(st.id)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                  selectedStage === st.id
                    ? 'bg-astra-navy text-white font-bold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Leads Data Table */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-mono text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Lead Name & Phone</th>
                  <th className="px-4 py-3">Company & City</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Value (INR)</th>
                  <th className="px-4 py-3">Pipeline Stage</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-xs">
                      No leads match your filter query. Add your first lead or import from Excel.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/80 transition">
                      
                      {/* Name & Contact */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900 text-xs">{lead.name}</div>
                        <div className="text-[11px] text-slate-500 flex items-center mt-0.5 space-x-2">
                          <span className="flex items-center"><Phone className="w-3 h-3 mr-1 text-slate-400" />{lead.phone}</span>
                        </div>
                      </td>

                      {/* Company & City */}
                      <td className="px-4 py-3.5">
                        <div className="text-slate-800 font-medium">{lead.companyName || 'Direct Prospect'}</div>
                        <div className="text-[11px] text-slate-500 flex items-center mt-0.5">
                          <MapPin className="w-3 h-3 mr-1 text-slate-400" />{lead.city || 'India'}
                        </div>
                      </td>

                      {/* Source */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          <Tag className="w-2.5 h-2.5 mr-1 text-slate-400" />
                          {lead.source}
                        </span>
                      </td>

                      {/* Value */}
                      <td className="px-4 py-3.5 font-bold font-mono text-slate-900">
                        ₹{(lead.value || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Pipeline Stage Select */}
                      <td className="px-4 py-3.5">
                        <select
                          value={lead.stage}
                          onChange={(e) => handleStageChange(lead.id, e.target.value as CRMStage)}
                          className={`text-[10px] font-bold px-2 py-1 rounded border focus:outline-none ${getStageBadgeClass(lead.stage)}`}
                        >
                          <option value="new">New Lead</option>
                          <option value="contacted">Contacted</option>
                          <option value="site_visit_scheduled">Site Visit Scheduled</option>
                          <option value="site_visit_done">Site Visit Done</option>
                          <option value="quotation_sent">Quotation Sent</option>
                          <option value="negotiation">In Negotiation</option>
                          <option value="closed_won">Closed Won</option>
                          <option value="closed_lost">Closed Lost</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right space-x-2">
                        <a
                          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded transition"
                        >
                          WhatsApp
                        </a>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-fade-in">
            <h3 className="text-base font-bold text-slate-900 font-display">Add New Lead to CRM</h3>
            
            <form onSubmit={handleAddLeadSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lead / Buyer Full Name *</label>
                <input
                  type="text"
                  required
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  placeholder="e.g. Vikramaditya Gupta"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-astra-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-astra-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={newLead.city}
                    onChange={(e) => setNewLead({ ...newLead, city: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-astra-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Source</label>
                <select
                  value={newLead.source}
                  onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-astra-gold"
                >
                  <option value="Meta Lead Ads">Meta Lead Ads (FB/IG)</option>
                  <option value="WhatsApp Inquiries">WhatsApp Inquiries</option>
                  <option value="IndiaMART / Justdial">IndiaMART / Justdial</option>
                  <option value="Property Portals">Property Portals (Housing/99acres)</option>
                  <option value="Walk-in / Referral">Walk-in / Referral</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Deal Value (INR)</label>
                <input
                  type="number"
                  value={newLead.value}
                  onChange={(e) => setNewLead({ ...newLead, value: Number(e.target.value) })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-astra-gold font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-astra-navy text-white hover:bg-slate-800 rounded-lg"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Excel Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 font-display">Bulk Import Excel / CSV Leads</h3>
            <p className="text-xs text-slate-600">
              Upload your existing leads file from Excel or Google Sheets. The system will map headers automatically.
            </p>

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">Click to upload .xlsx or .csv file</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Supports up to {crmLimit} rows</p>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert("Sample demo leads imported successfully!");
                  setIsImportModalOpen(false);
                }}
                className="px-4 py-2 text-xs font-bold bg-astra-gold text-astra-navy hover:bg-amber-400 rounded-lg"
              >
                Process File
              </button>
            </div>
          </div>
        </div>
      )}

    </AppLayout>
  );
}
