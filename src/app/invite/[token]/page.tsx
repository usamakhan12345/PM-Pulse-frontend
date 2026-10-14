'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AlertCircle, ArrowRight, Kanban, Users } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchCurrentUser } from '@/store/slices/authSlice';
import { fetchWorkspaces, setCurrentWorkspace } from '@/store/slices/workspaceSlice';
import apiClient from '@/api/client';
import { withNext } from '@/lib/nav';

interface InviteInfo {
  workspaceName: string;
  type: 'email' | 'link';
  invitedBy?: string | null;
  email?: string;
}

export default function InvitePage() {
  const params = useParams();
  const token = params.token as string;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [info, setInfo] = useState<InviteInfo | null>(null);
  const [loadError, setLoadError] = useState('');
  const [isChecking, setIsChecking] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState('');

  const here = `/invite/${token}`;

  useEffect(() => {
    apiClient
      .get(`/invitations/${token}`)
      .then((res) => setInfo(res.data.data.invitation))
      .catch((err: any) => setLoadError(err.message || 'This invitation link is invalid or has expired.'));
  }, [token]);

  // Find out whether this visitor is already signed in
  useEffect(() => {
    let hasToken = false;
    try {
      hasToken = !!localStorage.getItem('token');
    } catch {
      hasToken = false;
    }
    if (!hasToken) {
      setIsChecking(false);
      return;
    }
    dispatch(fetchCurrentUser()).finally(() => setIsChecking(false));
  }, [dispatch]);

  const handleJoin = async () => {
    setIsJoining(true);
    setJoinError('');
    try {
      const res = await apiClient.post(`/invitations/${token}/accept`);
      const joinedId = res.data.data.workspace._id;
      const result: any = await dispatch(fetchWorkspaces());
      const joined = (result.payload || []).find((w: any) => w._id === joinedId);
      if (joined) dispatch(setCurrentWorkspace(joined));
      router.push('/dashboard');
    } catch (err: any) {
      setJoinError(err.message || 'Could not join the workspace. Please try again.');
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-500 to-indigo-600 text-white shadow-xl mb-4">
          <Kanban className="w-8 h-8" />
        </div>
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 border border-slate-800 py-8 px-5 sm:px-8 shadow-2xl rounded-2xl text-center space-y-5">
          {loadError ? (
            <>
              <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
              <h1 className="text-xl font-bold text-white">This link does not work</h1>
              <p className="text-sm text-slate-400">{loadError} Ask the person who invited you to send a new one.</p>
              <Link href="/" className="inline-block text-sm text-brand-400 hover:underline font-medium">
                Go to PulsePM
              </Link>
            </>
          ) : !info || isChecking ? (
            <p className="text-sm text-slate-400 py-6">Checking your invitation...</p>
          ) : (
            <>
              <div className="mx-auto w-12 h-12 rounded-xl bg-brand-500/15 text-brand-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-400">
                  {info.invitedBy ? `${info.invitedBy} invited you to join` : 'You are invited to join'}
                </p>
                <h1 className="mt-1 text-2xl font-extrabold text-white tracking-tight">{info.workspaceName}</h1>
                {info.type === 'email' && info.email && (
                  <p className="mt-2 text-xs text-slate-500">
                    This invitation is for <span className="text-slate-300">{info.email}</span>
                  </p>
                )}
              </div>

              {joinError && (
                <p role="alert" className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl font-medium text-left">
                  {joinError}
                </p>
              )}

              {user ? (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleJoin}
                    disabled={isJoining}
                    className="w-full py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 disabled:opacity-60 text-white font-semibold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {isJoining ? 'Joining...' : `Join as ${user.name}`} <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-slate-500">
                    Not you?{' '}
                    <Link href={withNext('/login', here)} className="text-brand-400 hover:underline">
                      Sign in with another account
                    </Link>
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href={withNext('/register', here)}
                    className="w-full py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    Create an account to join <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href={withNext('/login', here)}
                    className="w-full py-3 border border-slate-700 hover:bg-slate-800 text-slate-200 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center"
                  >
                    I already have an account
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
