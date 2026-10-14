'use client';

import React from 'react';
import { Task, TaskStatus } from '@/types';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask?: (status: TaskStatus) => void;
}

const columnsConfig: { title: string; status: TaskStatus; colorClass: string }[] = [
  { title: 'To Do', status: 'TODO', colorClass: 'bg-slate-400' },
  { title: 'In Progress', status: 'IN_PROGRESS', colorClass: 'bg-brand-500' },
  { title: 'In Review', status: 'IN_REVIEW', colorClass: 'bg-amber-500' },
  { title: 'Done', status: 'DONE', colorClass: 'bg-emerald-500' },
  { title: 'Blocked', status: 'BLOCKED', colorClass: 'bg-rose-500' }
];

export default function KanbanBoard({ tasks, onSelectTask, onStatusChange, onAddTask }: KanbanBoardProps) {
  return (
    <div className="flex gap-6 overflow-x-auto pb-6 pt-2 items-start">
      {columnsConfig.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.status);
        return (
          <KanbanColumn
            key={col.status}
            title={col.title}
            status={col.status}
            tasks={colTasks}
            onSelectTask={onSelectTask}
            onStatusChange={onStatusChange}
            onAddTask={onAddTask}
            colorClass={col.colorClass}
          />
        );
      })}
    </div>
  );
}
