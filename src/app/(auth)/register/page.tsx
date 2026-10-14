'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Kanban, ArrowRight, ArrowLeft, Lock, Mail, MailCheck, User as UserIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { registerUser, verifySignupOtp, clearAuthError } from '@/store/slices/authSlice';
import apiClient from '@/api/client';
import OtpInput from '@/components/auth/OtpInput';
import { getNextPath, withNext } from '@/lib/nav';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { error, isLoading } = useAppSelector((state) => state.auth);

  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [notice, setNotice] = useState('');
  const [next, setNext] = useState('');

  useEffect(() => {
    setNext(getNextPath());
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearAuthError());
    setNotice('');
    const res = await dispatch(registerUser({ name: name.trim(), email: email.trim(), password }));
    if (res.meta.requestStatus === 'fulfilled') {
      setOtp('');
      setCooldown((res.payload as any).resendAfterSeconds || 60);
      setStep('otp');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    dispatch(clearAuthError());
    const res = await dispatch(verifySignupOtp({ email: email.trim(), otp }));
    if (res.meta.requestStatus === 'fulfilled') {
      router.push(next || '/dashboard');
    } else {
      setOtp('');
    }
  };

  const handleResend = async () => {
    dispatch(clearAuthError());
    setNotice('');
    try {
      const res = await apiClient.post('/auth/resend-otp', { email: email.trim() });
      setCooldown(res.data.data.resendAfterSeconds || 60);
      setOtp('');
      setNotice('A new code is on its way.');
    } catch (err: any) {
      setNotice(err.message || 'Could not send a new code. Please try again.');
    }
  };

  const inputClass =
    'w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-500 to-indigo-600 text-white shadow-xl mb-4">
          {step === 'otp' ? <MailCheck className="w-8 h-8" /> : <Kanban className="w-8 h-8" />}
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          {step === 'otp' ? 'Check your email' : 'Create your PulsePM account'}
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          {step === 'otp' ? (
            <>
              We sent a 6-digit code to <span className="text-slate-200 font-medium">{email}</span>
            </>
          ) : (
            'Join your team and start collaborating'
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 border border-slate-800 py-8 px-5 sm:px-8 shadow-2xl rounded-2xl space-y-6">
          {error && (
            <div role="alert" className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}
          {notice && !error && (
            <div role="status" className="p-3 bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs rounded-xl font-medium">
              {notice}
            </div>
          )}

          {step === 'details' ? (
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    id="name"
                    type="text"
                    required
                    minLength={2}
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className={inputClass}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 disabled:opacity-60 text-white font-semibold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? 'Sending code...' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              <OtpInput value={otp} onChange={setOtp} disabled={isLoading} autoFocus />

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? 'Verifying...' : 'Verify and create account'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    dispatch(clearAuthError());
                    setNotice('');
                    setStep('details');
                  }}
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Change email
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={cooldown > 0}
                  className="text-brand-400 hover:text-brand-300 font-medium disabled:text-slate-500 disabled:cursor-not-allowed"
                >
                  {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                The code expires in 10 minutes. Your account is created once it is verified.
              </p>
            </form>
          )}

          <p className="text-center text-xs text-slate-400 pt-2">
            Already have an account?{' '}
            <Link href={withNext('/login', next)} className="text-brand-400 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
