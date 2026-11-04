'use client';

import React from 'react';
import { CalendarDays, ChevronDown, Flag } from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '@/types';
import Avatar from '../common/Avatar';
import { BoardColumn, statusTitle } from '@/lib/columns';

interface TaskCardProps {
  task: Task;
  /** The project's columns, for the status list on the card */
  columns: BoardColumn[];
  onSelect: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  /** True while this card is the one being dragged, so it can look lifted out of its place. */
  isDragging?: boolean;
  onDragStart?: (task: Task) => void;
  onDragEnd?: () => void;
}

const priorityStyles: Record<TaskPriority, { label: string; chip: string }> = {
  LOW: { label: 'Low', chip: 'bg-slate-100 text-slate-600' },
  MEDIUM: { label: 'Medium', chip: 'bg-sky-50 text-sky-700' },
  HIGH: { label: 'High', chip: 'bg-orange-50 text-orange-700' },
  URGENT: { label: 'Urgent', chip: 'bg-red-50 text-red-700' }
};

export default function TaskCard({ task, columns, onSelect, onStatusChange, isDragging, onDragStart, onDragEnd }: TaskCardProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task._id); // Firefox needs data set before it starts a drag
    // Update the board a moment later, so the picture the browser drags is the card as it looked at the start
    setTimeout(() => onDragStart?.(task), 0);
  };

  const priority = priorityStyles[task.priority] || priorityStyles.MEDIUM;
  // The project's columns, plus the task's own status if it is somehow not among them
  const statusOptions = columns.some((c) => c.status === task.status)
    ? columns
    : [...columns, { status: task.status, title: statusTitle(columns, task.status), colorClass: 'bg-slate-400', custom: false }];
  const currentStatus = statusOptions.find((s) => s.status === task.status) || statusOptions[0];
  const isOverdue = !!task.dueDate && task.status !== 'DONE' && new Date(task.dueDate) < new Date();
  const extraLabels = (task.labels?.length || 0) - 3;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={() => onDragEnd?.()}
      onClick={() => onSelect(task)}
      className={`bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-brand-300 transition-all cursor-grab active:cursor-grabbing group flex flex-col gap-3 ${
        isDragging ? 'opacity-40 scale-[0.97] border-dashed border-brand-400' : ''
      }`}
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
            className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none ${currentStatus.colorClass}`}
          />
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value as TaskStatus)}
            aria-label="Move task to another column"
            className="appearance-none bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-[11px] font-medium rounded-lg pl-6 pr-6 py-1.5 focus:ring-1 focus:ring-brand-500 outline-none cursor-pointer transition-colors"
          >
            {statusOptions.map((s) => (
              <option key={s.status} value={s.status}>
                {s.title}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
