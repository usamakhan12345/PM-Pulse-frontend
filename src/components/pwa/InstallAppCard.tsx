'use client';

import React, { useState } from 'react';
import { CheckCircle2, Download, Share, SquarePlus, Smartphone } from 'lucide-react';
import { usePwaInstall } from '@/lib/pwa';

// Settings card that lets people install PulsePM on their phone or computer.
export default function InstallAppCard() {
  const { canInstall, showIosHelp, isInstalled, install } = usePwaInstall();
  const [message, setMessage] = useState('');

  const handleInstall = async () => {
    const accepted = await install();
    setMessage(accepted ? 'PulsePM was added to your device.' : '');
  };

  return (
    <section aria-labelledby="install-heading" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <h2 id="install-heading" className="font-bold text-gray-900 text-base flex items-center gap-2 mb-1">
        <Smartphone className="w-5 h-5 text-brand-600" /> Install the app
      </h2>

      {isInstalled ? (
        <p className="flex items-center gap-2 text-sm text-emerald-700">
          <CheckCircle2 className="w-4 h-4" /> PulsePM is installed on this device.
        </p>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            Add PulsePM to your home screen or desktop. It opens in its own window, like a regular app.
          </p>

          {canInstall && (
            <button
              type="button"
              onClick={handleInstall}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" /> Install PulsePM
            </button>
          )}

          {showIosHelp && (
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <Share className="w-4 h-4 text-brand-600 shrink-0" />
                Tap the Share button in Safari.
              </li>
              <li className="flex items-center gap-2">
                <SquarePlus className="w-4 h-4 text-brand-600 shrink-0" />
                Choose &ldquo;Add to Home Screen&rdquo;, then tap Add.
              </li>
            </ol>
          )}

          {!canInstall && !showIosHelp && (
            <p className="text-sm text-gray-500">
              Your browser has not offered an install option yet. In Chrome or Edge, look for the install icon in the
              address bar, or open the browser menu and choose &ldquo;Install PulsePM&rdquo;. It needs a secure (HTTPS)
              address.
            </p>
          )}

          {message && <p className="mt-3 text-sm font-medium text-emerald-700">{message}</p>}
        </>
      )}
    </section>
  );
}
