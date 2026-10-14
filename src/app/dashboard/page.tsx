'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  ListTodo,
  AlertCircle,
  Users,
  Activity as ActivityIcon,
  ArrowUpRight,
  TrendingUp,
  Plus
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useCanManage } from '@/hooks/useCanManage';
import { fetchProjects } from '@/store/slices/projectSlice';
import { fetchTasks } from '@/store/slices/taskSlice';
import apiClient from '@/api/client';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import ProjectCreateModal from '@/components/projects/ProjectCreateModal';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { currentWorkspace } = useAppSelector((state) => state.workspace);
  const { projects } = useAppSelector((state) => state.project);
  const { tasks } = useAppSelector((state) => state.task);

  const [activities, setActivities] = useState<any[]>([]);
  const [membersCount, setMembersCount] = useState<number>(0);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  useEffect(() => {
    if (currentWorkspace) {
      dispatch(fetchProjects({ workspaceId: currentWorkspace._id }));
      dispatch(fetchTasks({ workspaceId: currentWorkspace._id }));

      apiClient.get(`/activities?workspaceId=${currentWorkspace._id}&limit=10`).then((res) => {
        setActivities(res.data.data.activities || []);
      });

      apiClient.get(`/workspaces/${currentWorkspace._id}`).then((res) => {
        setMembersCount(res.data.data.workspace.members?.length || 0);
      });
    }
  }, [dispatch, currentWorkspace]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
  const todoTasks = tasks.filter((t) => t.status === 'TODO').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const pendingTasks = tasks.filter((t) => t.status === 'TODO' || t.status === 'IN_REVIEW').length;
  const blockedTasks = tasks.filter((t) => t.status === 'BLOCKED').length;

  const overdueTasks = tasks.filter((t) => {
    if (!t.dueDate || t.status === 'DONE') return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  const canCreate = useCanManage();

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-lg">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            {currentWorkspace ? currentWorkspace.name : 'Your workspace'}
            {user?.role === 'ADMIN' && <span className="font-semibold text-brand-400"> • Administrator</span>}
          </p>
        </div>
        {canCreate && (
          <button
            onClick={() => setIsProjectModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Create Project
          </button>
        )}
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Projects</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{projects.length}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FolderKanban className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Completed Tasks</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{completedTasks}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">To Do Tasks</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{todoTasks}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ListTodo className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">In Progress</p>
            <p className="text-2xl font-bold text-brand-600 mt-1">{inProgressTasks}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Overdue Tasks</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">{overdueTasks}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Projects Overview & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Projects */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-lg">Active Projects</h3>
            <Link
              href="/dashboard/projects"
              className="text-xs text-brand-600 font-semibold hover:underline flex items-center gap-1"
            >
              View All Projects <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.length === 0 ? (
              <div className="col-span-2 bg-white p-8 rounded-2xl border border-dashed border-gray-300 text-center text-gray-400 text-sm">
                {canCreate
                  ? 'No projects yet. Create your first one to get started.'
                  : 'No projects here yet. When the owner creates one, it will show up here.'}
              </div>
            ) : (
              projects.slice(0, 4).map((p) => (
                <Link
                  key={p._id}
                  href={`/dashboard/projects/${p._id}`}
                  className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-brand-300 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-900 text-base group-hover:text-brand-600 transition-colors truncate">
                      {p.name}
                    </h4>
                    <Badge type="status" value={p.status} />
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                    {p.description || 'No description available'}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                    <span>{p.members?.length || 0} Members</span>
                    <span className="text-brand-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                      Open Board →
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Activity Feed */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
            <ActivityIcon className="w-5 h-5 text-brand-600" /> Recent Activity Log
          </h3>

          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
            {activities.length === 0 ? (
              <p className="text-xs text-gray-400 italic text-center py-6">No recent activity recorded.</p>
            ) : (
              activities.map((act) => (
                <div key={act._id} className="flex gap-3 text-xs border-b border-gray-100 pb-3 last:border-none">
                  <Avatar name={act.userId?.name || 'User'} src={act.userId?.avatar} size="sm" />
                  <div>
                    <p className="text-gray-800 font-medium">
                      <span className="font-bold text-gray-900">{act.userId?.name}</span>{' '}
                      {act.action.toLowerCase().replace(/_/g, ' ')}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(act.createdAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <ProjectCreateModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} />
    </div>
  );
}
