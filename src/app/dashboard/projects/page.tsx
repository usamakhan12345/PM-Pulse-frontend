'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FolderKanban, Plus, Search, Filter, Calendar, Users, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useCanManage } from '@/hooks/useCanManage';
import { fetchProjects } from '@/store/slices/projectSlice';
import Badge from '@/components/common/Badge';
import Select from '@/components/common/Select';
import ProjectCreateModal from '@/components/projects/ProjectCreateModal';
import { ProjectStatus } from '@/types';

export default function ProjectsPage() {
  const dispatch = useAppDispatch();
  const { currentWorkspace } = useAppSelector((state) => state.workspace);
  const { user } = useAppSelector((state) => state.auth);
  const { projects, pagination, isLoading } = useAppSelector((state) => state.project);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (currentWorkspace) {
      dispatch(
        fetchProjects({
          workspaceId: currentWorkspace?._id,
          search,
          status: statusFilter || undefined,
          page
        })
      );
    }
  }, [dispatch, currentWorkspace, search, statusFilter, page]);

  const canCreate = useCanManage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Projects</h2>
          <p className="text-xs text-gray-500 mt-1">Manage and collaborate on workspace projects</p>
        </div>
        {canCreate && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> New Project
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <Filter className="w-4 h-4" /> Status:
          </div>
          <Select
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            align="right"
            className="flex-1 sm:flex-none sm:w-44"
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'ACTIVE', label: 'Active' },
              { value: 'PLANNING', label: 'Planning' },
              { value: 'ON_HOLD', label: 'On Hold' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'ARCHIVED', label: 'Archived' }
            ]}
          />
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-sm text-gray-400">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center text-sm">
          {search || statusFilter ? (
            <p className="text-gray-400">No projects match your search.</p>
          ) : canCreate ? (
            <>
              <p className="font-semibold text-gray-700">No projects yet</p>
              <p className="mt-1 text-gray-400">Create your first project, then invite people to work on it.</p>
            </>
          ) : (
            <>
              <p className="font-semibold text-gray-700">No projects in {currentWorkspace?.name || 'this workspace'} yet</p>
              <p className="mt-1 text-gray-400 max-w-md mx-auto">
                When the workspace owner creates a project it will show up here. Private projects only show to the people added to them.
                If you also have your own workspace, you can switch to it from the menu at the top.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <Link
              key={p._id}
              href={`/dashboard/projects/${p._id}`}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-brand-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center gap-2">
                    <Badge type="status" value={p.status} />
                    {p.isPrivate && (
                      <span title="Private: only the team can see this project" className="text-gray-400">
                        <Lock className="w-3.5 h-3.5" aria-label="Private project" />
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium">
                    {p.dueDate ? `Due ${new Date(p.dueDate).toLocaleDateString()}` : 'No due date'}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-brand-600 transition-colors">
                  {p.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed mb-6">
                  {p.description || 'No description provided.'}
                </p>
              </div>

              {(() => {
                const stats = p.taskStats;
                const total = stats?.total || 0;
                const done = stats?.DONE || 0;
                const percent = total ? Math.round((done / total) * 100) : 0;
                return (
                  <div className="mb-5">
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="rounded-xl bg-amber-50 px-2 py-2 text-center">
                        <p className="text-lg font-bold text-amber-600 leading-none">{stats?.TODO || 0}</p>
                        <p className="text-[10px] font-semibold text-amber-700/70 uppercase tracking-wide mt-1">To Do</p>
                      </div>
                      <div className="rounded-xl bg-brand-50 px-2 py-2 text-center">
                        <p className="text-lg font-bold text-brand-600 leading-none">{stats?.IN_PROGRESS || 0}</p>
                        <p className="text-[10px] font-semibold text-brand-700/70 uppercase tracking-wide mt-1">In Progress</p>
                      </div>
                      <div className="rounded-xl bg-emerald-50 px-2 py-2 text-center">
                        <p className="text-lg font-bold text-emerald-600 leading-none">{done}</p>
                        <p className="text-[10px] font-semibold text-emerald-700/70 uppercase tracking-wide mt-1">Completed</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${percent}%` }} />
                      </div>
                      <span className="text-[11px] font-semibold text-gray-500 tabular-nums">
                        {total ? `${percent}% of ${total} tasks` : 'No tasks yet'}
                      </span>
                    </div>
                  </div>
                );
              })()}

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>{p.members?.length || 0} Team Members</span>
                </div>
                <span className="text-brand-600 font-semibold group-hover:translate-x-1 transition-transform">
                  View Board →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className="text-xs text-gray-500">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
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

      <ProjectCreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
