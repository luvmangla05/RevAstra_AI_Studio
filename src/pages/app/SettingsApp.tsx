import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { Settings, Save, CheckCircle2, Shield, Building2, Key } from 'lucide-react';

export default function SettingsApp() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const [businessName, setBusinessName] = useState(user?.businessName || 'Supreme Builders & Infra');
  const [city, setCity] = useState(user?.onboardingData?.city || 'Noida');
  const [state, setState] = useState(user?.onboardingData?.state || 'Uttar Pradesh');
  const [industry, setIndustry] = useState(user?.onboardingData?.industry || 'Builders & Real Estate');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AppLayout 
      title="Business & System Settings" 
      subtitle="Configure company details, GSTIN profiles, and webhook endpoints."
    >
      <div className="max-w-2xl bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Building2 className="w-5 h-5 text-astra-navy" />
          <h2 className="text-base font-bold text-slate-900 font-display">Company Profile & Location</h2>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-astra-gold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-astra-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-astra-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Industry Vertical</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-astra-gold"
            />
          </div>

          {saved && (
            <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-lg font-semibold flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
              Settings updated successfully!
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-astra-navy hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition flex items-center space-x-1"
            >
              <Save className="w-3.5 h-3.5 mr-1 text-astra-gold" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
