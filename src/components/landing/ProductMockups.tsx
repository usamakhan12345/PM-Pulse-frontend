import React from 'react';
import { CalendarDays, Flag, Send } from 'lucide-react';

// Illustrations of the real screens, built with markup so they stay sharp and need no image files.
// The names and tasks are sample content, not customer data.

const columns = [
  {
    title: 'To Do',
    dot: 'bg-slate-400',
    cards: [
      { title: 'Design onboarding screens', priority: 'High', tone: 'bg-orange-500/15 text-orange-300', who: 'AK', due: 'Nov 4' },
      { title: 'Write API documentation', priority: 'Low', tone: 'bg-slate-500/20 text-slate-300', who: 'SR', due: 'Nov 9' }
    ]
  },
  {
    title: 'In Progress',
    dot: 'bg-brand-500',
    cards: [
      { title: 'Build billing page', priority: 'Urgent', tone: 'bg-red-500/15 text-red-300', who: 'MJ', due: 'Nov 2' },
      { title: 'Set up email alerts', priority: 'Medium', tone: 'bg-sky-500/15 text-sky-300', who: 'AK', due: 'Nov 6' }
    ]
  },
  {
    title: 'Done',
    dot: 'bg-emerald-500',
    cards: [{ title: 'Launch landing page', priority: 'Medium', tone: 'bg-sky-500/15 text-sky-300', who: 'SR', due: 'Oct 28' }]
  }
];

export function BoardMock() {
  return (
    <div
      role="img"
      aria-label="Example Kanban board with To Do, In Progress and Done columns holding sample tasks"
      className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-black/40 overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
        <span className="ml-3 text-xs font-medium text-slate-400">Website redesign / Kanban board</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 sm:p-4">
        {columns.map((col, i) => (
          <div key={col.title} className={`${i === 2 ? 'hidden sm:block' : ''} rounded-xl bg-slate-950/70 border border-slate-800 p-2.5 space-y-2.5 min-w-0`}>
            <div className="flex items-center gap-2 px-1">
              <span className={`w-2 h-2 rounded-full ${col.dot}`} />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 truncate">{col.title}</span>
              <span className="ml-auto text-[10px] font-semibold text-slate-500">{col.cards.length}</span>
            </div>
            {col.cards.map((card) => (
              <div key={card.title} className="rounded-lg bg-slate-900 border border-slate-800 p-2.5 space-y-2">
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${card.tone}`}>
                  <Flag className="w-2.5 h-2.5" aria-hidden="true" /> {card.priority}
                </span>
                <p className="text-xs font-semibold text-slate-100 leading-snug">{card.title}</p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                    <CalendarDays className="w-3 h-3" aria-hidden="true" /> {card.due}
                  </span>
                  <span className="w-5 h-5 rounded-full bg-brand-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {card.who}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProgressMock() {
  const projects = [
    { name: 'Website redesign', todo: 6, doing: 4, done: 14, percent: 58 },
    { name: 'Mobile app launch', todo: 9, doing: 3, done: 5, percent: 29 }
  ];
  return (
    <div
      role="img"
      aria-label="Example project cards showing to do, in progress and completed task counts with a progress bar"
      className="space-y-4"
    >
      {projects.map((p) => (
        <div key={p.name} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[11px] font-semibold">Active</span>
            <span className="text-[11px] text-slate-500">Due Dec 12</span>
          </div>
          <p className="font-bold text-white mb-4">{p.name}</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'To Do', value: p.todo, tone: 'bg-amber-500/10 text-amber-300' },
              { label: 'In Progress', value: p.doing, tone: 'bg-brand-500/15 text-sky-300' },
              { label: 'Completed', value: p.done, tone: 'bg-emerald-500/10 text-emerald-300' }
            ].map((s) => (
              <div key={s.label} className={`rounded-xl px-2 py-2 text-center ${s.tone}`}>
                <p className="text-lg font-bold leading-none">{s.value}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wide mt-1 opacity-80">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${p.percent}%` }} />
            </div>
            <span className="text-[11px] font-semibold text-slate-400 tabular-nums">{p.percent}% done</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChatMock() {
  const messages = [
    { who: 'MJ', name: 'Maya', text: 'Billing page is ready for review.', mine: false },
    { who: 'AK', name: 'Alex', text: 'Looks good. Moving it to In Review now.', mine: true },
    { who: 'MJ', name: 'Maya', text: 'Thanks. I will pick up the email alerts next.', mine: false }
  ];
  return (
    <div
      role="img"
      aria-label="Example project chat conversation between two team members"
      className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden"
    >
      <div className="px-5 py-3 border-b border-slate-800 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <span className="text-sm font-semibold text-white">Website redesign chat</span>
        <span className="ml-auto text-[11px] text-slate-500">3 online</span>
      </div>
      <div className="p-5 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex items-end gap-2 ${m.mine ? 'flex-row-reverse' : ''}`}>
            <span className="w-7 h-7 shrink-0 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center">
              {m.who}
            </span>
            <div
              className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                m.mine ? 'bg-brand-600 text-white rounded-br-sm' : 'bg-slate-800 text-slate-200 rounded-bl-sm'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <p className="text-[11px] text-slate-500 pl-9">Maya is typing...</p>
      </div>
      <div className="px-4 py-3 border-t border-slate-800 flex items-center gap-2">
        <div className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-slate-500">
          Write a message
        </div>
        <span className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center">
          <Send className="w-4 h-4" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}
