'use client';

import React, { useEffect, useState } from 'react';
import { Task, TaskStatus } from '@/types';
import { BoardColumn, MAX_CUSTOM_COLUMNS } from '@/lib/columns';
import KanbanColumn from './KanbanColumn';
import AddColumnTile from './AddColumnTile';

interface KanbanBoardProps {
  tasks: Task[];
  /** The project's columns, in board order */
  columns: BoardColumn[];
  onSelectTask: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask?: (status: TaskStatus) => void;
  /** Only passed for the workspace owner. Without it the board has no "Add column" button. */
  onAddColumn?: (label: string) => Promise<string | null>;
  onRemoveColumn?: (key: string) => void;
}

export default function KanbanBoard({
  tasks,
  columns,
  onSelectTask,
  onStatusChange,
  onAddTask,
  onAddColumn,
  onRemoveColumn
}: KanbanBoardProps) {
  // The card being dragged right now, so every column knows whether a drop would move it
  const [draggingTask, setDraggingTask] = useState<Task | null>(null);

  // A drag that ends outside the board (Escape, or dropped on empty space) must not leave the board in drag mode
  useEffect(() => {
    if (!draggingTask) return;
    const clear = () => setDraggingTask(null);
    window.addEventListener('dragend', clear);
    window.addEventListener('drop', clear);
    return () => {
      window.removeEventListener('dragend', clear);
      window.removeEventListener('drop', clear);
    };
  }, [draggingTask]);

  const handleDropTask = (taskId: string, status: TaskStatus) => {
    const task = tasks.find((t) => t._id === taskId);
    setDraggingTask(null);
    if (task && task.status !== status) onStatusChange(taskId, status);
  };

  const addedCount = columns.filter((c) => c.custom).length;

  return (
    <div className="flex gap-6 overflow-x-auto pb-6 pt-2 items-start">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.status);
        return (
          <KanbanColumn
            key={col.status}
            title={col.title}
            status={col.status}
            tasks={colTasks}
            columns={columns}
            onSelectTask={onSelectTask}
            onStatusChange={onStatusChange}
            onAddTask={onAddTask}
            colorClass={col.colorClass}
            onRemoveColumn={col.custom && onRemoveColumn ? () => onRemoveColumn(col.status) : undefined}
            draggingTask={draggingTask}
            onDragStartTask={setDraggingTask}
            onDragEndTask={() => setDraggingTask(null)}
            onDropTask={handleDropTask}
          />
        );
      })}

      {onAddColumn && (
        <AddColumnTile onAdd={onAddColumn} limitReached={addedCount >= MAX_CUSTOM_COLUMNS} limit={MAX_CUSTOM_COLUMNS} />
      )}
    </div>
  );
}
