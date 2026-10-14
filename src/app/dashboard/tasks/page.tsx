'use client';

import React, { useEffect, useState } from 'react';
import { CheckSquare, Search, Filter, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchTasks, updateTaskStatus } from '@/store/slices/taskSlice';
import TaskDetailModal from '@/components/tasks/TaskDetailModal';
import TaskCreateModal from '@/components/tasks/TaskCreateModal';
import Badge from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';
import { Task, TaskStatus, TaskPriority, User } from '@/types';
import apiClient from '@/api/client';

export default function GlobalTasksPage() {
  const dispatch = useAppDispatch();
  const { currentWorkspace } = useAppSelector((state) => state.workspace);
  const { projects } = useAppSelector((state) => state.project);
  const { user } = useAppSelector((state) => state.auth);
  const { tasks, pagination, isLoading } = useAppSelector((state) => state.task);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [assignedToFilter, setAssignedToFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (currentWorkspace) {
      dispatch(
        fetchTasks({
          workspaceId: currentWorkspace._id,
          search,
          status: statusFilter || undefined,
          priority: priorityFilter || undefined,
          assignedTo: assignedToFilter || undefined,
          page
        })
      );

      apiClient.get('/users').then((res) => {
        setUsers(res.data.data.users || []);
      });
    }
  }, [dispatch, currentWorkspace, search, statusFilter, priorityFilter, assignedToFilter, page]);

  const canCreate = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Task Directory</h2>
          <p className="text-xs text-gray-500 mt-1">
            Search, filter, and update tasks across all workspace projects
          </p>
        </div>
        {canCreate && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Create Task
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or description..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="DONE">Done</option>
            <option value="BLOCKED">Blocked</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>

          <select
            value={assignedToFilter}
            onChange={(e) => setAssignedToFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Assignees</option>
            {user && <option value={user._id}>Assigned to Me</option>}
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-400 font-semibold uppercase tracking-wider">
            <tr>
              <th className="p-4">Task Title</th>
              <th className="p-4">Project</th>
              <th className="p-4">Status</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Assignee</th>
              <th className="p-4">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">
                  Loading tasks...
                </td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">
                  No tasks match your filters.
                </td>
              </tr>
            ) : (
              tasks.map((t) => (
                <tr
                  key={t._id}
                  onClick={() => setSelectedTask(t)}
                  className="hover:bg-gray-50/80 cursor-pointer transition-colors"
                >
                  <td className="p-4 font-semibold text-gray-900">{t.title}</td>
                  <td className="p-4 font-medium text-brand-600">
                    {typeof t.projectId === 'object' ? t.projectId.name : 'Project'}
                  </td>
                  <td className="p-4">
                    <Badge type="status" value={t.status} />
                  </td>
                  <td className="p-4">
                    <Badge type="priority" value={t.priority} />
                  </td>
                  <td className="p-4">
                    {t.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <Avatar name={t.assignedTo.name} src={t.assignedTo.avatar} size="sm" />
                        <span>{t.assignedTo.name}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="p-4 text-gray-500">
                    {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className="text-xs text-gray-500">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total tasks)
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <TaskDetailModal
        task={selectedTask}
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
      />

      {projects.length > 0 && (
        <TaskCreateModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          projectId={projects[0]._id}
          workspaceId={currentWorkspace?._id || ''}
        />
      )}
    </div>
  );
}
