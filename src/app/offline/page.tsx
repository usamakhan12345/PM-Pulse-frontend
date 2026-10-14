import type { Metadata } from 'next';
import { WifiOff } from 'lucide-react';
import RetryButton from '@/components/pwa/RetryButton';

export const metadata: Metadata = {
  title: 'You are offline',
  robots: { index: false, follow: false }
};

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-brand-400">
          <WifiOff className="w-8 h-8" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-white">You are offline</h1>
        <p className="mt-2 text-slate-400 leading-relaxed">
          PulsePM needs an internet connection to show your projects and tasks. Check your connection and try again.
        </p>
        <RetryButton />
      </div>
    </main>
  );
}
