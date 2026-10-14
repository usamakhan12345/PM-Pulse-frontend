'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store';
import { fetchCurrentUser } from '@/store/slices/authSlice';

// Sends signed-in visitors straight to their dashboard; everyone else stays on the page.
export default function AuthRedirect() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    let hasToken = false;
    try {
      hasToken = !!localStorage.getItem('token');
    } catch {
      hasToken = false;
    }
    if (!hasToken) return;

    dispatch(fetchCurrentUser()).then((res: any) => {
      if (res.meta.requestStatus === 'fulfilled') {
        router.replace('/dashboard');
      }
    });
  }, [dispatch, router]);

  return null;
}
