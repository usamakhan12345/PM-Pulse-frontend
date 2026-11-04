'use client';

import React, { useRef } from 'react';

type SpotlightCardProps = {
  children: React.ReactNode;
  className?: string;
};

// A card with a soft light that follows the mouse across it.
export default function SpotlightCard({ children, className = '' }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <div ref={ref} onMouseMove={onMove} className={`group relative overflow-hidden ${className}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: 'radial-gradient(340px circle at var(--mx, 50%) var(--my, 50%), rgba(59,130,246,0.20), transparent 65%)'
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
