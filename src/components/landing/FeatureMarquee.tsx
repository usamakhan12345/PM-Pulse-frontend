import React from 'react';

// A slow, endless strip of what the product does. Purely decorative: the same points appear as real text below.
const items = [
  'Kanban boards',
  'Team chat',
  'Workspaces',
  'Invite by email or link',
  'Task comments',
  'File attachments',
  'PDF project reports',
  'Real-time alerts',
  'Progress tracking',
  'Installable app'
];

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden ? 'true' : undefined} className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((item) => (
        <li key={item} className="flex shrink-0 items-center gap-10 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
          {item}
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
        </li>
      ))}
    </ul>
  );
}

export default function FeatureMarquee() {
  return (
    <div
      aria-hidden="true"
      className="group relative overflow-hidden border-y border-slate-800/80 bg-slate-950/60 py-5"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)'
      }}
    >
      <div className="flex w-max animate-marquee motion-reduce:animate-none group-hover:[animation-play-state:paused]">
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}
