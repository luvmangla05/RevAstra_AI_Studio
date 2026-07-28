import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export default function VerifyEmailPage() {
  const [code, setCode] = useState('');
  const [verified, setVerified] = useState(false);
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    await verifyEmail(code);
    setVerified(true);
    setTimeout(() => {
      navigate('/app/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-astra-navy flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-block">
          <span className="font-display text-3xl font-bold tracking-tight text-white">
            Rev<span className="text-astra-gold">Astra</span>
          </span>
        </Link>
        <h2 className="text-xl font-bold text-white font-display">Verify Email Address</h2>
        <p className="text-xs text-slate-400">
          Enter the 6-digit verification code sent to your email.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl py-8 px-6 sm:px-10 shadow-2xl space-y-6">
          {verified ? (
            <div className="text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <p className="text-xs text-slate-200 font-bold">Email verified! Redirecting to App Dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Verification Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. 849201"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white text-center font-mono tracking-widest text-base focus:outline-none focus:border-astra-gold"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-astra-gold text-astra-navy hover:bg-amber-400 font-bold py-3 rounded-xl text-xs transition flex items-center justify-center space-x-1"
              >
                <span>Verify Email</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
