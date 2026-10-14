'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

interface ProjectStatusMenuProps {
  value: string;
  onChange: (status: string) => void;
}

const options = [
  { value: 'PLANNING', label: 'Planning', dot: 'bg-sky-500', pill: 'bg-sky-50 text-sky-700 border-sky-200' },
  { value: 'ACTIVE', label: 'Active', dot: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'ON_HOLD', label: 'On Hold', dot: 'bg-amber-500', pill: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'COMPLETED', label: 'Completed', dot: 'bg-indigo-500', pill: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { value: 'ARCHIVED', label: 'Archived', dot: 'bg-slate-400', pill: 'bg-slate-100 text-slate-600 border-slate-200' }
];

export default function ProjectStatusMenu({ value, onChange }: ProjectStatusMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value) || options[1];

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change project status"
        className={`inline-flex items-center gap-2 pl-3 pr-2.5 py-1 rounded-full border text-xs font-semibold transition-shadow hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 ${current.pill}`}
      >
        <span className={`w-2 h-2 rounded-full ${current.dot}`} />
        {current.label}
        <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full mt-2 w-44 bg-white rounded-xl border border-gray-100 shadow-xl py-1.5 z-30"
        >
          <li className="px-3 pt-1 pb-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Project status
          </li>
          {options.map((o) => {
            const selected = o.value === value;
            return (
              <li key={o.value} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    if (!selected) onChange(o.value);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors hover:bg-gray-50 ${
                    selected ? 'font-semibold text-gray-900' : 'text-gray-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${o.dot}`} />
                  <span className="flex-1">{o.label}</span>
                  {selected && <Check className="w-4 h-4 text-brand-600" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
