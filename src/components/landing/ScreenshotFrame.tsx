import React from 'react';
import Image from 'next/image';
import { findScreenshot } from '@/lib/screenshots';

interface ScreenshotFrameProps {
  name: string; // file name in public/screenshots, without extension
  alt: string;
  priority?: boolean;
  sizes?: string;
  fallback?: React.ReactNode; // shown until the screenshot file exists
}

// A real screenshot inside a simple browser window. Falls back to an illustration if the file is missing.
export default function ScreenshotFrame({ name, alt, priority, sizes = '(min-width: 1024px) 560px, 100vw', fallback = null }: ScreenshotFrameProps) {
  const src = findScreenshot(name);
  if (!src) return <>{fallback}</>;

  return (
    <figure className="rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/40 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800 bg-slate-900" aria-hidden="true">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
      </div>
      <Image src={src} alt={alt} width={1440} height={900} sizes={sizes} priority={priority} className="w-full h-auto block" />
    </figure>
  );
}
