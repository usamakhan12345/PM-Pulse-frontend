'use client';

import { useCallback, useEffect, useState } from 'react';

// The browser fires "beforeinstallprompt" once, early in the page load. We keep the event here
// so any button can use it later.
interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: InstallPromptEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

let started = false;
export const startPwaListeners = () => {
  if (started || typeof window === 'undefined') return;
  started = true;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event as InstallPromptEvent;
    notify();
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    installed = true;
    notify();
  });
};

const detectStandalone = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true);

const detectIos = () =>
  typeof navigator !== 'undefined' &&
  /iphone|ipad|ipod/i.test(navigator.userAgent) &&
  !(window as any).MSStream;

export function usePwaInstall() {
  const [, force] = useState(0);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    startPwaListeners();
    setIsStandalone(detectStandalone());
    setIsIos(detectIos());
    const listener = () => force((n) => n + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    deferredPrompt = null;
    notify();
    return choice.outcome === 'accepted';
  }, []);

  const alreadyInstalled = installed || isStandalone;
  return {
    // A native install prompt is available (Chrome, Edge, Android, desktop)
    canInstall: !alreadyInstalled && !!deferredPrompt,
    // iPhone and iPad have no prompt; the user adds it from the Share menu
    showIosHelp: !alreadyInstalled && isIos,
    isInstalled: alreadyInstalled,
    install
  };
}
