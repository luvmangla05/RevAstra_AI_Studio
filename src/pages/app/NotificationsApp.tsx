import React from 'react';
import AppLayout from '../../components/AppLayout';
import { Bell, Sparkles, AlertCircle, CheckCircle2, MessageSquare, ShieldAlert } from 'lucide-react';

export default function NotificationsApp() {
  const notifications = [
    {
      id: 'n1',
      title: 'New Meta Lead Ingested',
      desc: 'Rajesh Singhania requested 3 BHK pricing brochure on WhatsApp.',
      time: '10 mins ago',
      type: 'lead',
      unread: true
    },
    {
      id: 'n2',
      title: 'Lead Leakage Alert',
      desc: 'Average response time on Meta Ads reached 18 minutes. Recommended SLA is < 5 mins.',
      time: '1 hour ago',
      type: 'alert',
      unread: true
    },
    {
      id: 'n3',
      title: 'GST Quotation Created',
      desc: 'Quotation REV-2026-0042 (₹41,300) saved for Supreme Builders.',
      time: '3 hours ago',
      type: 'quote',
      unread: false
    }
  ];

  return (
    <AppLayout 
      title="Notifications & Activity Log" 
      subtitle="Real-time alerts on new leads, response SLAs, and system updates."
    >
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm divide-y divide-slate-100">
        {notifications.map((n) => (
          <div key={n.id} className={`p-4 flex items-start space-x-3 hover:bg-slate-50 transition ${n.unread ? 'bg-amber-50/20' : ''}`}>
            <div className={`p-2 rounded-lg ${
              n.type === 'lead' ? 'bg-blue-50 text-blue-600' : (n.type === 'alert' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600')
            }`}>
              {n.type === 'alert' ? <ShieldAlert className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-900">{n.title}</p>
                <span className="text-[10px] font-mono text-slate-400">{n.time}</span>
              </div>
              <p className="text-xs text-slate-600">{n.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
