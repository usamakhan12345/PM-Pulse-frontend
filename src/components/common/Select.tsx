'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  hint?: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label: string; // accessible name, also shown as the small heading in the menu
  placeholder?: string;
  searchable?: boolean; // shows a search box; turned on automatically for long lists
  className?: string;
  align?: 'left' | 'right';
}

// A styled replacement for the browser's <select>, with keyboard support.
export default function Select({
  value,
  onChange,
  options,
  label,
  placeholder,
  searchable,
  className = '',
  align = 'left'
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const showSearch = searchable ?? options.length > 8;
  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return options;
    return options.filter((o) => o.label.toLowerCase().includes(term) || o.hint?.toLowerCase().includes(term));
  }, [options, query]);

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  const openMenu = () => {
    const index = options.findIndex((o) => o.value === value);
    setActiveIndex(index >= 0 ? index : 0);
    setOpen(true);
  };

  const choose = (option: SelectOption) => {
    onChange(option.value);
    close();
  };

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close();
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  useEffect(() => {
    if (open && showSearch) searchRef.current?.focus();
  }, [open, showSearch]);

  // Keep the highlighted row in view while moving with the arrow keys
  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    const el = list?.children[activeIndex] as HTMLElement | undefined;
    if (!list || !el) return;
    const top = el.offsetTop;
    const bottom = top + el.offsetHeight;
    if (top < list.scrollTop) list.scrollTop = top;
    else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
  }, [activeIndex, open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[activeIndex]) choose(filtered[activeIndex]);
    } else if (e.key === 'Tab') {
      close();
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`} onKeyDown={onKeyDown}>
      <button
        type="button"
        onClick={() => (open ? close() : openMenu())}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={label}
        className={`w-full flex items-center justify-between gap-2.5 pl-3.5 pr-3 py-2 bg-white border rounded-xl text-xs font-medium text-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/40 ${
          open ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
      >
        <span className={`truncate ${selected ? '' : 'text-gray-400'}`}>{selected?.label || placeholder || label}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          aria-hidden="true"
          onClick={close}
          className="fixed inset-0 z-40 bg-slate-900/40 sm:hidden"
        />
      )}

      {open && (
        <div
          className={`fixed inset-x-3 bottom-3 z-50 rounded-2xl sm:rounded-xl sm:absolute sm:inset-x-auto sm:bottom-auto sm:mt-2 sm:min-w-full sm:w-64 bg-white border border-gray-100 shadow-2xl sm:shadow-xl overflow-hidden ${
            align === 'right' ? 'sm:right-0' : 'sm:left-0'
          }`}
        >
          <p className="px-3.5 pt-3 pb-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>

          {showSearch && (
            <div className="px-2.5 pb-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  placeholder="Search..."
                  aria-label={`Search ${label}`}
                  className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                />
              </div>
            </div>
          )}

          <ul id={listId} ref={listRef} role="listbox" aria-label={label} className="relative max-h-[50vh] sm:max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3.5 py-3 text-xs text-gray-400">No matches</li>
            ) : (
              filtered.map((option, index) => {
                const isSelected = option.value === value;
                return (
                  <li
                    key={option.value || '__all'}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => choose(option)}
                    className={`flex items-center gap-2.5 px-3.5 py-3 sm:py-2 cursor-pointer text-sm sm:text-xs ${
                      index === activeIndex ? 'bg-gray-50' : ''
                    } ${isSelected ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}
                  >
                    <span className="flex-1 min-w-0">
                      <span className="block truncate">{option.label}</span>
                      {option.hint && <span className="block truncate text-[11px] font-normal text-gray-400">{option.hint}</span>}
                    </span>
                    {isSelected && <Check className="w-4 h-4 shrink-0 text-brand-600" />}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
