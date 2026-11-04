import React from 'react';
import { TaskPriority, TaskStatus, Role, WorkspaceRole } from '@/types';

interface BadgeProps {
  type: 'status' | 'priority' | 'role';
  value: TaskStatus | TaskPriority | Role | WorkspaceRole | string;
  /** Text to show instead of the value, for example the name of a column the owner added */
  label?: string;
  className?: string;
}

export default function Badge({ type, value, label, className = '' }: BadgeProps) {
  let bg = 'bg-gray-100 text-gray-800';

  if (type === 'status') {
    switch (value) {
      case 'TODO':
        bg = 'bg-gray-200 text-gray-700';
        break;
      case 'IN_PROGRESS':
        bg = 'bg-blue-100 text-blue-800 border border-blue-200';
        break;
      case 'IN_REVIEW':
        bg = 'bg-amber-100 text-amber-800 border border-amber-200';
        break;
      case 'DONE':
        bg = 'bg-emerald-100 text-emerald-800 border border-emerald-200';
        break;
      case 'BLOCKED':
        bg = 'bg-rose-100 text-rose-800 border border-rose-200';
        break;
      default:
        // A column the workspace owner added
        if (value.startsWith('CUSTOM_')) bg = 'bg-violet-100 text-violet-800 border border-violet-200';
    }
  } else if (type === 'priority') {
    switch (value) {
      case 'LOW':
        bg = 'bg-slate-100 text-slate-700';
        break;
      case 'MEDIUM':
        bg = 'bg-sky-100 text-sky-800';
        break;
      case 'HIGH':
        bg = 'bg-orange-100 text-orange-800';
        break;
      case 'URGENT':
        bg = 'bg-red-100 text-red-800 font-semibold';
        break;
    }
  } else if (type === 'role') {
    switch (value) {
      case 'ADMIN':
        bg = 'bg-purple-100 text-purple-800 font-bold';
        break;
      case 'OWNER':
        bg = 'bg-blue-100 text-blue-800 font-semibold';
        break;
      case 'MEMBER':
        bg = 'bg-gray-100 text-gray-700';
        break;
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${className}`}>
      {label ?? (type === 'role' ? value.charAt(0) + value.slice(1).toLowerCase() : value.replace(/^CUSTOM_/, '').replace(/_/g, ' '))}
    </span>
  );
}
