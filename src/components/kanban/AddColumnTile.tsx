'use client';

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface AddColumnTileProps {
  /** Saves the column. Resolves to an error message, or null when it worked. */
  onAdd: (label: string) => Promise<string | null>;
  /** True once the project has as many added columns as it is allowed */
  limitReached: boolean;
  limit: number;
}

// The "Add column" button at the end of the board, for the workspace owner. It opens a small form in place.
export default function AddColumnTile({ onAdd, limitReached, limit }: AddColumnTileProps) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const close = () => {
    setOpen(false);
    setLabel('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = label.trim();
    if (name.length < 2) {
      setError('Use at least 2 characters.');
      return;
    }
    setSaving(true);
    setError('');
    const problem = await onAdd(name);
    setSaving(false);
    if (problem) {
      setError(problem);
      return;
    }
    close();
  };

  if (limitReached) {
    return (
      <div className="min-w-[220px] w-56 shrink-0 rounded-2xl border border-dashed border-gray-200 p-4 text-center text-xs text-gray-400">
        A project can have up to {limit} extra columns.
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="min-w-[220px] w-56 shrink-0 flex items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-gray-200 py-5 text-sm font-semibold text-gray-500 hover:text-brand-600 hover:border-brand-400 hover:bg-brand-50/40 transition-colors"
      >
        <Plus className="w-4 h-4" /> Add column
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="min-w-[260px] w-64 shrink-0 rounded-2xl border border-brand-300 bg-white p-4 shadow-sm space-y-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">New column</h3>
        <button type="button" onClick={close} className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100" aria-label="Cancel">
          <X className="w-4 h-4" />
        </button>
      </div>
      <input
        autoFocus
        value={label}
        onChange={(e) => {
          setLabel(e.target.value);
          if (error) setError('');
        }}
        maxLength={30}
        placeholder="e.g. UAT Ready"
        aria-label="Column name"
        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
      {error && (
        <p role="alert" className="text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          {saving ? 'Adding...' : 'Add column'}
        </button>
        <button type="button" onClick={close} className="px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg">
          Cancel
        </button>
      </div>
      <p className="text-[11px] text-gray-400 leading-snug">It appears for everyone on this project and in each task&apos;s status list.</p>
    </form>
  );
}
