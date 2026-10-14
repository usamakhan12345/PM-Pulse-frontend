'use client';

import React from 'react';
import { Clock, MessageSquare, Paperclip, AlertCircle, ArrowRight } from 'lucide-react';
import { Task, TaskStatus } from '@/types';
import Badge from '../common/Badge';
import Avatar from '../common/Avatar';

interface TaskCardProps {
  task: Task;
  onSelect: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

const statusOptions: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'BLOCKED'];

export default function TaskCard({ task, onSelect, onStatusChange }: TaskCardProps) {
  return (
    <div
      onClick={() => onSelect(task)}
      className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-brand-300"
    >
      {/* Priority & Labels */}
      <div className="flex items-center justify-between mb-2">
        <Badge type="priority" value={task.priority} />
        <div className="flex flex-wrap gap-1">
          {task.labels?.slice(0, 2).map((label, idx) => (
            <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
              #{label}
            </span>
          ))}
        </div>
      </div>

      {/* Task Title */}
      <h4 className="font-semibold text-gray-900 text-sm mb-1.5 group-hover:text-brand-600 transition-colors line-clamp-2">
        {task.title}
      </h4>

      {/* Description Snippet */}
      {task.description && (
        <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{task.description}</p>
      )}

      {/* Quick Move Status Bar */}
      <div
        className="my-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-gray-400 font-medium text-[11px]">Move to:</span>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value as TaskStatus)}
          className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded px-2 py-1 focus:ring-1 focus:ring-brand-500 outline-none cursor-pointer"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Card Footer: Metadata & Assignee */}
      <div className="flex items-center justify-between pt-2 text-xs text-gray-400 border-t border-gray-50">
        <div className="flex items-center gap-3">
          {task.dueDate && (
            <div className="flex items-center gap-1 text-[11px] text-gray-500">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {task.assignedTo ? (
            <Avatar name={task.assignedTo.name} src={task.assignedTo.avatar} size="sm" />
          ) : (
            <span className="text-[10px] text-gray-400 italic">Unassigned</span>
          )}
        </div>
      </div>
    </div>
  );
}
