'use client';

import { useEffect } from 'react';
import { startPwaListeners } from '@/lib/pwa';

// Registers the service worker in production and starts listening for the install prompt.
// In development the worker is removed instead, because cached files get in the way of hot reload.
export default function PwaRegister() {
  useEffect(() => {
    startPwaListeners();
    if (!('serviceWorker' in navigator)) return;

    if (process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
        // Not fatal: the site works the same without it
      });
    } else {
      navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()));
    }
  }, []);

  return null;
}
