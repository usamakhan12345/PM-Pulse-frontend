'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchCurrentUser } from '@/store/slices/authSlice';

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCurrentUser()).then((res: any) => {
      if (res.meta.requestStatus === 'fulfilled') {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    });
  }, [dispatch, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-900 text-white">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-medium text-slate-400">Loading PulsePM Platform...</p>
      </div>
    </div>
  );
}
