/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bot, CheckCircle2, ShieldCheck, ArrowLeft, KeyRound, Sparkles, LogIn } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || (mode !== 'forgot' && !password)) {
      alert("Please complete required credentials.");
      return;
    }

    if (mode === 'forgot') {
      setMessage("A password recovery link has been dispatched to " + email);
      return;
    }

    // Capture specific credentials for testing / admin demonstration
    if (email === 'admin@revastra.pro' || email === 'admin@revastra.com') {
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('userEmail', email);
      navigate('/admin-dashboard');
    } else {
      localStorage.setItem('userRole', 'client');
      localStorage.setItem('userEmail', email);
      navigate('/dashboard');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden p-8 sm:p-10 space-y-6 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-astra-gold" />
        
        {/* Back and title */}
        <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
          <Link to="/" className="flex items-center text-slate-400 hover:text-astra-navy transition">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Return
          </Link>
          <span>SECURE DESK</span>
        </div>

        <div className="text-center space-y-2">
          <KeyRound className="w-10 h-10 text-astra-gold bg-astra-navy rounded-full p-2 mx-auto" />
          <h2 className="font-display font-extrabold text-xl text-astra-navy tracking-tight">
            {mode === 'login' ? 'Access Growth Workspace' : mode === 'signup' ? 'Create Secure Account' : 'Recover Password'}
          </h2>
          <p className="text-xs text-slate-400 leading-normal max-w-xs mx-auto">
            {mode === 'login' 
              ? 'Enter credentials. Use admin@revastra.pro for admin access.' 
              : mode === 'signup' 
              ? 'Onboard your project to start asset review.' 
              : 'Password reset guidelines.'
            }
          </p>
        </div>

        {message && (
          <div className="p-3 bg-green-50 border border-green-100 rounded text-[11px] text-green-700 font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Company / Project Name</label>
              <input 
                type="text" 
                required
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g. Signature Residency"
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Corporate Email Address</label>
            <input 
              type="email" 
              required
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="e.g. rajesh@revastra.pro"
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Account Password</label>
              <input 
                type="password" 
                required
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter password..."
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded"
              />
            </div>
          )}

          {mode === 'login' && (
            <div className="text-right">
              <button 
                type="button" 
                onClick={() => setMode('forgot')} 
                className="text-[10px] font-mono text-slate-400 hover:text-astra-gold"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-astra-navy hover:bg-astra-gold text-white hover:text-astra-navy font-bold py-3.5 rounded transition shadow"
          >
            {mode === 'login' ? 'Initialize Workspace' : mode === 'signup' ? 'Create Account' : 'Send Instructions'}
          </button>
        </form>

        {/* Toggles */}
        <div className="text-center text-xs text-slate-400 border-t border-slate-100 pt-4">
          {mode === 'login' ? (
            <p>
              New partner?{' '}
              <button onClick={() => setMode('signup')} className="font-bold text-astra-navy hover:text-astra-gold">
                Register Workspace
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button onClick={() => setMode('login')} className="font-bold text-astra-navy hover:text-astra-gold">
                Log In
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
