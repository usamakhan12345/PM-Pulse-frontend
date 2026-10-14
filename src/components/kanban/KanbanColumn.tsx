'use client';

import React from 'react';
import { Task, TaskStatus } from '@/types';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask?: (status: TaskStatus) => void;
  colorClass: string;
}

export default function KanbanColumn({
  title,
  status,
  tasks,
  onSelectTask,
  onStatusChange,
  onAddTask,
  colorClass
}: KanbanColumnProps) {
  return (
    <div className="bg-gray-50/80 rounded-2xl border border-gray-200/80 p-4 flex flex-col min-w-[280px] w-80 h-full max-h-[calc(100vh-140px)]">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${colorClass}`} />
          <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">{title}</h3>
          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full font-semibold">
            {tasks.length}
          </span>
        </div>
        {onAddTask && (
          <button
            onClick={() => onAddTask(status)}
            className="p-1 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-200/60 transition-colors"
            title="Add task to column"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {tasks.length === 0 ? (
          <div className="h-32 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400 font-medium">
            No tasks in {title}
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task._id} task={task} onSelect={onSelectTask} onStatusChange={onStatusChange} />
          ))
        )}
      </div>
    </div>
  );
}
