import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { PLAN_LIMITS } from '../../data/plansData';
import { UserPlus, Shield, User, Mail, Plus, Info } from 'lucide-react';

export default function TeamApp() {
  const { user } = useAuth();
  const seatsLimit = user?.plan ? PLAN_LIMITS[user.plan].usersLimit : 1;

  const [teamMembers, setTeamMembers] = useState([
    { id: '1', name: user?.name || 'Owner Name', email: user?.email || 'owner@business.com', role: 'Business Owner', status: 'Active' }
  ]);

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamMembers.length >= seatsLimit) {
      alert(`Your current plan (${user?.plan}) allows max ${seatsLimit} user seat. Please upgrade your plan to add more team members.`);
      return;
    }
    setTeamMembers([...teamMembers, { id: Date.now().toString(), name: inviteName, email: inviteEmail, role: 'Sales Representative', status: 'Invited' }]);
    setIsInviteOpen(false);
    setInviteName('');
    setInviteEmail('');
  };

  return (
    <AppLayout 
      title="Team Seats & Role Management" 
      subtitle="Manage team members, sales rep assignments, and role-based permissions."
    >
      <div className="space-y-6">
        
        {/* Demo Notice Banner */}
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span><strong>UI Prototype / Preview:</strong> Team seats & RBAC management are operating in preview mode. Multi-user authentication is coming soon.</span>
          </div>
          <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded text-[10px] font-bold font-mono">Demo Mode</span>
        </div>

        
        {/* Seats Usage Bar */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                User Seats Allocation: <span className="font-mono text-astra-navy">{teamMembers.length} / {seatsLimit} Seats Used</span>
              </p>
              <p className="text-[11px] text-slate-500">Plan: <strong className="uppercase">{user?.plan || 'Shunya'}</strong></p>
            </div>
          </div>

          <button
            onClick={() => setIsInviteOpen(true)}
            className="px-4 py-2 bg-astra-navy text-white hover:bg-slate-800 text-xs font-bold rounded-lg transition flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5 mr-1 text-astra-gold" />
            <span>Invite Team Member</span>
          </button>
        </div>

        {/* Team List Table */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-mono text-[10px] uppercase">
              <tr>
                <th className="px-4 py-3">Member Name & Email</th>
                <th className="px-4 py-3">Access Role</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teamMembers.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3.5">
                    <p className="font-bold text-slate-900">{m.name}</p>
                    <p className="text-[11px] text-slate-500">{m.email}</p>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-700">{m.role}</td>
                  <td className="px-4 py-3.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded font-mono bg-emerald-100 text-emerald-800">
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 font-display">Invite New Team Member</h3>
            <form onSubmit={handleInvite} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsInviteOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 text-xs font-bold bg-astra-navy text-white rounded-lg">Send Invitation</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AppLayout>
  );
}
