import React from 'react';

// Decorative background for the sign-in screens, built from the PulsePM logo mark:
// three rounded bars of different heights, repeated large and faint, over soft blue glows.
// It is drawn with SVG, so it stays sharp at any screen size, and it is hidden from screen readers.
const Mark = ({ id }: { id: string }) => (
  <g>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#3b82f6" />
        <stop offset="1" stopColor="#6366f1" />
      </linearGradient>
    </defs>
    <rect x="26" y="22" width="14" height="56" rx="4" fill={`url(#${id})`} />
    <rect x="43" y="22" width="14" height="38" rx="4" fill={`url(#${id})`} opacity=".85" />
    <rect x="60" y="22" width="14" height="24" rx="4" fill={`url(#${id})`} opacity=".7" />
  </g>
);

export default function AuthBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Soft glows */}
      <div className="absolute -top-40 -left-32 w-[560px] h-[560px] rounded-full bg-brand-500/25 blur-[120px]" />
      <div className="absolute -bottom-48 -right-24 w-[620px] h-[620px] rounded-full bg-indigo-600/25 blur-[130px]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-sky-500/10 blur-[110px]" />

      {/* Large logo marks */}
      <svg
        viewBox="0 0 100 100"
        className="absolute -right-24 -top-16 w-[560px] h-[560px] opacity-[0.16] rotate-6 hidden sm:block"
      >
        <Mark id="lg-a" />
      </svg>
      <svg
        viewBox="0 0 100 100"
        className="absolute -left-28 -bottom-20 w-[520px] h-[520px] opacity-[0.12] -rotate-12"
      >
        <Mark id="lg-b" />
      </svg>
      <svg
        viewBox="0 0 100 100"
        className="absolute left-[14%] top-[10%] w-28 h-28 opacity-[0.10] -rotate-6 hidden md:block"
      >
        <Mark id="lg-c" />
      </svg>
      <svg
        viewBox="0 0 100 100"
        className="absolute right-[12%] bottom-[8%] w-24 h-24 opacity-[0.10] rotate-12 hidden md:block"
      >
        <Mark id="lg-d" />
      </svg>

      {/* Faint grid, fading out toward the edges */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)'
        }}
      />
    </div>
  );
}
