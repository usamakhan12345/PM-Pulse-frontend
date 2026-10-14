'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import apiClient from '@/api/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/auth/forgot-password', { email });
      setSubmitted(true);
      if (res.data.data?.resetToken) {
        setResetToken(res.data.data.resetToken);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-2xl font-bold text-white">Reset Password</h2>
        <p className="mt-1 text-xs text-slate-400">Enter your email to receive password reset instructions</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 border border-slate-800 py-8 px-8 shadow-2xl rounded-2xl space-y-4">
          {submitted ? (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl">
                Reset instructions processed. Check your inbox!
              </div>
              {resetToken && (
                <div className="p-3 bg-slate-800 text-slate-300 text-xs rounded-lg font-mono break-all text-left">
                  <p className="text-[10px] text-brand-400 uppercase font-bold mb-1">Dev Test Reset Token:</p>
                  {resetToken}
                </div>
              )}
              <Link
                href={`/reset-password?token=${resetToken}`}
                className="block py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-xl"
              >
                Proceed to Reset Password Page
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Registered Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Reset Link
              </button>
            </form>
          )}

          <div className="pt-2 text-center">
            <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
