'use client';

import React from 'react';
import { CalendarDays, ChevronDown, Flag } from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '@/types';
import Avatar from '../common/Avatar';

interface TaskCardProps {
  task: Task;
  onSelect: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

const statusOptions: { value: TaskStatus; label: string; dot: string }[] = [
  { value: 'TODO', label: 'To Do', dot: 'bg-slate-400' },
  { value: 'IN_PROGRESS', label: 'In Progress', dot: 'bg-brand-500' },
  { value: 'IN_REVIEW', label: 'In Review', dot: 'bg-amber-500' },
  { value: 'DONE', label: 'Done', dot: 'bg-emerald-500' },
  { value: 'BLOCKED', label: 'Blocked', dot: 'bg-rose-500' }
];

const priorityStyles: Record<TaskPriority, { label: string; chip: string }> = {
  LOW: { label: 'Low', chip: 'bg-slate-100 text-slate-600' },
  MEDIUM: { label: 'Medium', chip: 'bg-sky-50 text-sky-700' },
  HIGH: { label: 'High', chip: 'bg-orange-50 text-orange-700' },
  URGENT: { label: 'Urgent', chip: 'bg-red-50 text-red-700' }
};

export default function TaskCard({ task, onSelect, onStatusChange }: TaskCardProps) {
  const priority = priorityStyles[task.priority] || priorityStyles.MEDIUM;
  const currentStatus = statusOptions.find((s) => s.value === task.status) || statusOptions[0];
  const isOverdue = !!task.dueDate && task.status !== 'DONE' && new Date(task.dueDate) < new Date();
  const extraLabels = (task.labels?.length || 0) - 3;

  return (
    <div
      onClick={() => onSelect(task)}
      className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-brand-300 transition-all cursor-pointer group flex flex-col gap-3"
    >
      {/* Priority and due date */}
      <div className="flex items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${priority.chip}`}>
          <Flag className="w-3 h-3" />
          {priority.label}
        </span>
        {task.dueDate && (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-medium ${
              isOverdue ? 'text-rose-600' : 'text-gray-500'
            }`}
            title={isOverdue ? 'Overdue' : 'Due date'}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>

      {/* Title and description */}
      <div>
        <h4 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-brand-600 transition-colors line-clamp-2">
          {task.title}
        </h4>
        {task.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">{task.description}</p>
        )}
      </div>

      {/* Labels */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {task.labels.slice(0, 3).map((label, idx) => (
            <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
              {label}
            </span>
          ))}
          {extraLabels > 0 && <span className="text-[10px] text-gray-400 py-0.5">+{extraLabels}</span>}
        </div>
      )}

      {/* Footer: assignee and quick status change */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2 min-w-0">
          {task.assignedTo ? (
            <>
              <Avatar name={task.assignedTo.name} src={task.assignedTo.avatar} size="sm" />
              <span className="text-xs text-gray-600 font-medium truncate">{task.assignedTo.name}</span>
            </>
          ) : (
            <span className="text-xs text-gray-400 italic">Unassigned</span>
          )}
        </div>

        <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
          <span
            className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none ${currentStatus.dot}`}
          />
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value as TaskStatus)}
            aria-label="Move task to another column"
            className="appearance-none bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-[11px] font-medium rounded-lg pl-6 pr-6 py-1.5 focus:ring-1 focus:ring-brand-500 outline-none cursor-pointer transition-colors"
          >
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
