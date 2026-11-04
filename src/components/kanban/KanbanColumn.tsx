'use client';

import React, { useState } from 'react';
import { Task, TaskStatus } from '@/types';
import TaskCard from './TaskCard';
import { Plus, Trash2 } from 'lucide-react';
import { BoardColumn } from '@/lib/columns';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  columns: BoardColumn[];
  onSelectTask: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask?: (status: TaskStatus) => void;
  colorClass: string;
  /** Set for a column the owner added: shows a remove button while the column is empty */
  onRemoveColumn?: () => void;
  draggingTask: Task | null;
  onDragStartTask: (task: Task) => void;
  onDragEndTask: () => void;
  onDropTask: (taskId: string, status: TaskStatus) => void;
}

export default function KanbanColumn({
  title,
  status,
  tasks,
  columns,
  onSelectTask,
  onStatusChange,
  onAddTask,
  colorClass,
  onRemoveColumn,
  draggingTask,
  onDragStartTask,
  onDragEndTask,
  onDropTask
}: KanbanColumnProps) {
  const [isOver, setIsOver] = useState(false);

  // A card can be dropped here only if it comes from a different column
  const canDrop = !!draggingTask && draggingTask.status !== status;
  const highlight = canDrop && isOver;

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if (!canDrop) return;
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!canDrop) return;
    e.preventDefault(); // tells the browser this column accepts the card
    e.dataTransfer.dropEffect = 'move';
    if (!isOver) setIsOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Moving over a card inside the column also fires dragleave; only react when the pointer really leaves.
    // relatedTarget is empty in some browsers, so the pointer position decides as well.
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const inside = e.clientX > rect.left && e.clientX < rect.right && e.clientY > rect.top && e.clientY < rect.bottom;
    if (inside) return;
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    const taskId = e.dataTransfer.getData('text/plain') || draggingTask?._id;
    if (taskId) onDropTask(taskId, status);
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-2xl border p-4 flex flex-col min-w-[280px] w-80 h-full max-h-[calc(100vh-140px)] transition-all duration-200 ${
        highlight
          ? 'bg-brand-50 border-brand-500 ring-2 ring-brand-500/30 scale-[1.01]'
          : canDrop
          ? 'bg-gray-50/80 border-dashed border-brand-300'
          : 'bg-gray-50/80 border-gray-200/80'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${colorClass}`} />
          <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">{title}</h3>
          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full font-semibold">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          {onRemoveColumn && tasks.length === 0 && (
            <button
              onClick={onRemoveColumn}
              className="p-1 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Remove this empty column"
              aria-label={`Remove the ${title} column`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
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
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {tasks.length === 0 && !highlight ? (
          <div className="h-32 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400 font-medium">
            {canDrop ? `Drop here to move to ${title}` : `No tasks in ${title}`}
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              columns={columns}
              onSelect={onSelectTask}
              onStatusChange={onStatusChange}
              isDragging={draggingTask?._id === task._id}
              onDragStart={onDragStartTask}
              onDragEnd={onDragEndTask}
            />
          ))
        )}

        {/* Where the card will land */}
        {highlight && (
          <div className="h-20 border-2 border-dashed border-brand-500/60 bg-brand-500/5 rounded-xl flex items-center justify-center text-xs font-semibold text-brand-600">
            Drop to move to {title}
          </div>
        )}
      </div>

      {/* Add a task at the bottom of the column, so it is within reach after a long list */}
      {onAddTask && (
        <button
          type="button"
          onClick={() => onAddTask(status)}
          className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-gray-300 text-xs font-semibold text-gray-500 hover:text-brand-600 hover:border-brand-400 hover:bg-white transition-colors"
        >
          <Plus className="w-4 h-4" /> Add task
        </button>
      )}
    </div>
  );
}
