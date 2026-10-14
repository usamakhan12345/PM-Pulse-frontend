'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Check, Download, MoreVertical, Share, SquarePlus, X } from 'lucide-react';
import { usePwaInstall } from '@/lib/pwa';

interface InstallAppButtonProps {
  label?: string;
  variant?: 'primary' | 'outline' | 'ghost';
  className?: string;
}

const variants = {
  primary: 'bg-brand-600 hover:bg-brand-500 text-white',
  outline: 'border border-slate-700 hover:bg-slate-900 text-slate-200',
  ghost: 'text-slate-300 hover:text-white'
};

type Platform = 'ios' | 'android' | 'desktop';

// "Install the app" button for the landing page.
// Where the browser supports it, one click shows the browser's install prompt and adds PulsePM to the device.
// Elsewhere (iPhone, Firefox, Safari on Mac) it opens short instructions instead.
export default function InstallAppButton({ label = 'Install the app', variant = 'outline', className = '' }: InstallAppButtonProps) {
  const { canInstall, isInstalled, install } = usePwaInstall();
  const [helpOpen, setHelpOpen] = useState(false);
  const [platform, setPlatform] = useState<Platform>('desktop');
  const [justInstalled, setJustInstalled] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ua = navigator.userAgent;
    if (/iphone|ipad|ipod/i.test(ua) || (ua.includes('Mac') && navigator.maxTouchPoints > 1)) setPlatform('ios');
    else if (/android/i.test(ua)) setPlatform('android');
    else setPlatform('desktop');
  }, []);

  useEffect(() => {
    if (!helpOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setHelpOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [helpOpen]);

  // Already installed on this device (or running as the installed app): nothing to offer
  if (isInstalled && !justInstalled) return null;

  const handleClick = async () => {
    if (canInstall) {
      const accepted = await install();
      if (accepted) setJustInstalled(true);
      return;
    }
    setHelpOpen(true);
  };

  if (justInstalled) {
    return (
      <span className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-emerald-400 ${className}`}>
        <Check className="w-4 h-4" aria-hidden="true" /> Installed
      </span>
    );
  }

  const steps =
    platform === 'ios'
      ? [
          { icon: Share, text: 'Tap the Share button at the bottom of Safari.' },
          { icon: SquarePlus, text: 'Scroll down and choose "Add to Home Screen".' },
          { icon: Check, text: 'Tap Add. PulsePM appears on your home screen.' }
        ]
      : platform === 'android'
        ? [
            { icon: MoreVertical, text: 'Open the browser menu (the three dots) in Chrome.' },
            { icon: Download, text: 'Choose "Install app" or "Add to Home screen".' },
            { icon: Check, text: 'Confirm. PulsePM appears with your other apps.' }
          ]
        : [
            { icon: Download, text: 'In Chrome or Edge, click the install icon at the right end of the address bar.' },
            { icon: MoreVertical, text: 'Or open the browser menu and choose "Install PulsePM".' },
            { icon: Check, text: 'Safari and Firefox on desktop cannot install web apps. Use Chrome or Edge.' }
          ];

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-colors ${variants[variant]} ${className}`}
      >
        <Download className="w-4 h-4" aria-hidden="true" /> {label}
      </button>

      {helpOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
          onClick={() => setHelpOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-dialog-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="install-dialog-title" className="text-lg font-bold text-white">
                  Install PulsePM
                </h2>
                <p className="mt-1 text-sm text-slate-400">Add it to your device in three steps. It opens like a regular app.</p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setHelpOpen(false)}
                aria-label="Close"
                className="p-1.5 -mr-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ol className="mt-5 space-y-3">
              {steps.map(({ icon: Icon, text }, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl bg-slate-950/60 border border-slate-800 px-4 py-3">
                  <span className="w-7 h-7 shrink-0 rounded-full bg-brand-600/20 text-brand-400 flex items-center justify-center">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm text-slate-200 leading-relaxed">{text}</span>
                </li>
              ))}
            </ol>

            <p className="mt-4 text-xs text-slate-500">
              Installing needs a secure (HTTPS) address. If the option does not appear, make sure you are on the live site.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
