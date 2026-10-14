'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, ChevronLeft, ChevronRight, FolderKanban, ListChecks, Search, UserPlus, Users as UsersIcon } from 'lucide-react';
import { useAppSelector } from '@/store';
import apiClient from '@/api/client';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import Select from '@/components/common/Select';

type Tab = 'projects' | 'users' | 'workspaces';

interface Overview {
  users: number;
  newUsersThisWeek: number;
  workspaces: number;
  projects: number;
  activeProjects: number;
  tasks: number;
  doneTasks: number;
}

interface Pagination {
  page: number;
  totalPages: number;
  total: number;
}

const tabs: { value: Tab; label: string }[] = [
  { value: 'projects', label: 'Projects' },
  { value: 'users', label: 'Users' },
  { value: 'workspaces', label: 'Workspaces' }
];

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '-';

export default function AdminPage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === 'ADMIN';

  const [tab, setTab] = useState<Tab>('projects');
  const [overview, setOverview] = useState<Overview | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [projectStatus, setProjectStatus] = useState('ACTIVE');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Admin | PulsePM';
  }, []);

  // Only the platform administrator may open this page
  useEffect(() => {
    if (user && !isAdmin) router.replace('/dashboard');
  }, [user, isAdmin, router]);

  useEffect(() => {
    if (!isAdmin) return;
    apiClient.get('/admin/overview').then((res) => setOverview(res.data.data)).catch(() => {});
  }, [isAdmin]);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      if (tab === 'projects') {
        const res = await apiClient.get('/admin/projects', { params: { status: projectStatus, search: search || undefined, page } });
        setProjects(res.data.data.projects);
        setPagination(res.data.data.pagination);
      } else if (tab === 'users') {
        const res = await apiClient.get('/admin/users', { params: { search: search || undefined, page } });
        setUsers(res.data.data.users);
        setPagination(res.data.data.pagination);
      } else {
        const res = await apiClient.get('/admin/workspaces');
        setWorkspaces(res.data.data.workspaces);
        setPagination(null);
      }
    } catch (err: any) {
      setError(err.message || 'Could not load this list.');
    } finally {
      setIsLoading(false);
    }
  }, [tab, projectStatus, search, page]);

  // Wait a moment after typing so the list is not reloaded on every key press
  useEffect(() => {
    if (!isAdmin) return;
    const timer = setTimeout(load, search ? 350 : 0);
    return () => clearTimeout(timer);
  }, [isAdmin, load, search]);

  const switchTab = (next: Tab) => {
    setTab(next);
    setPage(1);
    setSearch('');
  };

  if (!isAdmin) return null;

  const stats = [
    { label: 'Users', value: overview?.users, hint: overview ? `${overview.newUsersThisWeek} new this week` : '', icon: UsersIcon, tone: 'bg-blue-50 text-blue-600' },
    { label: 'Workspaces', value: overview?.workspaces, hint: '', icon: Building2, tone: 'bg-purple-50 text-purple-600' },
    { label: 'Active projects', value: overview?.activeProjects, hint: overview ? `${overview.projects} in total` : '', icon: FolderKanban, tone: 'bg-emerald-50 text-emerald-600' },
    { label: 'Tasks', value: overview?.tasks, hint: overview ? `${overview.doneTasks} completed` : '', icon: ListChecks, tone: 'bg-amber-50 text-amber-600' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Platform admin</h1>
        <p className="text-sm text-gray-500 mt-1">Everything happening across all workspaces. Only you can see this page.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, hint, icon: Icon, tone }) => (
          <div key={label} className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1 tabular-nums">{value ?? '-'}</p>
              {hint && <p className="text-[11px] text-gray-400 mt-0.5">{hint}</p>}
            </div>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${tone}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-6 border-b border-gray-200 text-sm font-semibold overflow-x-auto" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.value}
            role="tab"
            aria-selected={tab === t.value}
            onClick={() => switchTab(t.value)}
            className={`pb-3 whitespace-nowrap shrink-0 border-b-2 transition-colors ${
              tab === t.value ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab !== 'workspaces' && (
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={tab === 'projects' ? 'Search projects...' : 'Search by name or email...'}
              aria-label="Search"
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          {tab === 'projects' && (
            <Select
              label="Status"
              value={projectStatus}
              onChange={(v) => {
                setProjectStatus(v);
                setPage(1);
              }}
              align="right"
              className="sm:w-48"
              options={[
                { value: 'ACTIVE', label: 'Active' },
                { value: 'ALL', label: 'All statuses' },
                { value: 'PLANNING', label: 'Planning' },
                { value: 'ON_HOLD', label: 'On Hold' },
                { value: 'COMPLETED', label: 'Completed' },
                { value: 'ARCHIVED', label: 'Archived' }
              ]}
            />
          )}
        </div>
      )}

      {error && <p role="alert" className="text-sm font-medium text-rose-600">{error}</p>}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-sm text-gray-400">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            {tab === 'projects' && (
              projects.length === 0 ? (
                <div className="p-12 text-center text-sm text-gray-400">No projects match.</div>
              ) : (
                <table className="w-full min-w-[820px] text-left text-sm">
                  <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Project</th>
                      <th className="px-5 py-3 font-semibold">Workspace</th>
                      <th className="px-5 py-3 font-semibold">Owner</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                      <th className="px-5 py-3 font-semibold">Progress</th>
                      <th className="px-5 py-3 font-semibold">People</th>
                      <th className="px-5 py-3 font-semibold">Last activity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {projects.map((p) => {
                      const done = p.taskStats.DONE;
                      const percent = p.taskStats.total ? Math.round((done / p.taskStats.total) * 100) : 0;
                      return (
                        <tr key={p._id} className="hover:bg-gray-50/60">
                          <td className="px-5 py-3.5 font-semibold text-gray-900">{p.name}</td>
                          <td className="px-5 py-3.5 text-gray-600">{p.workspace?.name || '-'}</td>
                          <td className="px-5 py-3.5">
                            <p className="text-gray-800">{p.owner?.name || '-'}</p>
                            <p className="text-xs text-gray-400">{p.owner?.email}</p>
                          </td>
                          <td className="px-5 py-3.5">
                            <Badge type="status" value={p.status} />
                          </td>
                          <td className="px-5 py-3.5 min-w-[170px]">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percent}%` }} />
                              </div>
                              <span className="text-xs text-gray-500 tabular-nums">{done}/{p.taskStats.total}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-gray-600 tabular-nums">{p.memberCount}</td>
                          <td className="px-5 py-3.5 text-xs text-gray-500">{formatDate(p.updatedAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )
            )}

            {tab === 'users' && (
              users.length === 0 ? (
                <div className="p-12 text-center text-sm text-gray-400">No users match.</div>
              ) : (
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="px-5 py-3 font-semibold">User</th>
                      <th className="px-5 py-3 font-semibold">Workspaces</th>
                      <th className="px-5 py-3 font-semibold">Projects owned</th>
                      <th className="px-5 py-3 font-semibold">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50/60">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar name={u.name} src={u.avatar} size="md" />
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate">
                                {u.name} {u.role === 'ADMIN' && <Badge type="role" value="ADMIN" className="ml-1" />}
                              </p>
                              <p className="text-xs text-gray-500 truncate">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-gray-600 tabular-nums">{u.workspaceCount}</td>
                        <td className="px-5 py-3.5 text-gray-600 tabular-nums">{u.projectCount}</td>
                        <td className="px-5 py-3.5 text-xs text-gray-500">{formatDate(u.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}

            {tab === 'workspaces' && (
              workspaces.length === 0 ? (
                <div className="p-12 text-center text-sm text-gray-400">No workspaces yet.</div>
              ) : (
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Workspace</th>
                      <th className="px-5 py-3 font-semibold">Owner</th>
                      <th className="px-5 py-3 font-semibold">People</th>
                      <th className="px-5 py-3 font-semibold">Projects</th>
                      <th className="px-5 py-3 font-semibold">Active</th>
                      <th className="px-5 py-3 font-semibold">Tasks</th>
                      <th className="px-5 py-3 font-semibold">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {workspaces.map((w) => (
                      <tr key={w._id} className="hover:bg-gray-50/60">
                        <td className="px-5 py-3.5 font-semibold text-gray-900">{w.name}</td>
                        <td className="px-5 py-3.5">
                          <p className="text-gray-800">{w.owner?.name || '-'}</p>
                          <p className="text-xs text-gray-400">{w.owner?.email}</p>
                        </td>
                        <td className="px-5 py-3.5 text-gray-600 tabular-nums">
                          <span className="inline-flex items-center gap-1"><UserPlus className="w-3.5 h-3.5 text-gray-400" />{w.memberCount}</span>
                        </td>
                        <td className="px-5 py-3.5 text-gray-600 tabular-nums">{w.projectCount}</td>
                        <td className="px-5 py-3.5 text-gray-600 tabular-nums">{w.activeProjectCount}</td>
                        <td className="px-5 py-3.5 text-gray-600 tabular-nums">{w.taskCount}</td>
                        <td className="px-5 py-3.5 text-xs text-gray-500">{formatDate(w.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              aria-label="Previous page"
              className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              aria-label="Next page"
              className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
