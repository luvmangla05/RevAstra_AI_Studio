import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import { Layers, CheckCircle2, AlertCircle, Link2, ExternalLink, Settings, Info } from 'lucide-react';

export default function IntegrationsApp() {
  const [integrations, setIntegrations] = useState([
    { id: 'wa', name: 'WhatsApp Business API', desc: 'Automate brochure delivery and instant lead replies.', connected: false, category: 'Messaging' },
    { id: 'meta', name: 'Meta Lead Ads (FB & Instagram)', desc: 'Instant 2-second lead ingestion into Free CRM.', connected: false, category: 'Lead Source' },
    { id: 'indiamart', name: 'IndiaMART Lead Sync', desc: 'Auto-ingest B2B buyers and trade inquiries.', connected: false, category: 'Marketplace' },
    { id: 'justdial', name: 'Justdial Inquiries', desc: 'Sync local search calls and leads automatically.', connected: false, category: 'Marketplace' },
    { id: 'portals', name: 'Property Portals (Housing/99acres)', desc: 'Automate property inquiry routing to sales reps.', connected: false, category: 'Real Estate' },
    { id: 'gmail', name: 'Gmail / Google Workspace', desc: 'Send GST quotations and email follow-ups.', connected: false, category: 'Email' }
  ]);

  const toggleConnection = (id: string) => {
    setIntegrations(integrations.map(i => i.id === id ? { ...i, connected: !i.connected } : i));
  };

  return (
    <AppLayout 
      title="Integrations & Connectors" 
      subtitle="Connect RevAstra OS with WhatsApp, Meta Ads, IndiaMART, Justdial, and Property Portals."
    >
      <div className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span><strong>UI Prototype / Preview:</strong> Live integration webhooks are simulated in this prototype mode. Real API connectors are coming soon.</span>
          </div>
          <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded text-[10px] font-bold font-mono">Simulated</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    {item.category}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono ${
                    item.connected ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.connected ? 'Simulated Active' : 'Not Connected'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 font-display flex items-center justify-between">
                  <span>{item.name}</span>
                  <span className="text-[9px] bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded font-mono">UI Prototype</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => toggleConnection(item.id)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                    item.connected 
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' 
                      : 'bg-astra-navy hover:bg-slate-800 text-white'
                  }`}
                >
                  {item.connected ? 'Disconnect (Demo)' : 'Connect (Demo)'}
                </button>

                <span className="text-[10px] text-slate-400 font-mono">Coming Soon</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

