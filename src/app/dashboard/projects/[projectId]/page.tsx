'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Kanban as KanbanIcon,
  ListFilter,
  MessageSquare,
  Activity as ActivityIcon,
  Plus,
  Users,
  Calendar,
  UserPlus,
  FileDown,
  Globe,
  Lock
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useCanManage } from '@/hooks/useCanManage';
import ProjectStatusMenu from '@/components/projects/ProjectStatusMenu';
import { fetchProjectById } from '@/store/slices/projectSlice';
import { fetchTasks, updateTaskStatus } from '@/store/slices/taskSlice';
import { fetchWorkspaceById, fetchWorkspaces } from '@/store/slices/workspaceSlice';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import ProjectChat from '@/components/chat/ProjectChat';
import TaskDetailModal from '@/components/tasks/TaskDetailModal';
import TaskCreateModal from '@/components/tasks/TaskCreateModal';
import Badge from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';
import Modal from '@/components/common/Modal';
import { Task, TaskStatus, User } from '@/types';
import apiClient from '@/api/client';

export default function SingleProjectPage() {
  const canManage = useCanManage();
  const params = useParams();
  const projectId = params.projectId as string;
  const dispatch = useAppDispatch();

  const { currentProject } = useAppSelector((state) => state.project);
  const { tasks } = useAppSelector((state) => state.task);
  const { currentWorkspace } = useAppSelector((state) => state.workspace);
  const { user } = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState<'board' | 'list' | 'chat' | 'activity'>('board');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState<TaskStatus>('TODO');
  const [activities, setActivities] = useState<any[]>([]);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportError, setReportError] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(projectId));
      dispatch(fetchTasks({ projectId }));
      apiClient.get(`/activities?projectId=${projectId}&limit=20`).then((res) => {
        setActivities(res.data.data.activities || []);
      });
    }
  }, [dispatch, projectId]);

  // Sync workspace state when navigating directly to a project
  useEffect(() => {
    if (currentProject?.workspaceId) {
      const projWsId =
        typeof currentProject.workspaceId === 'object'
          ? (currentProject.workspaceId as any)._id
          : currentProject.workspaceId;

      if (projWsId && (!currentWorkspace || currentWorkspace._id !== projWsId)) {
        dispatch(fetchWorkspaceById(projWsId));
        dispatch(fetchWorkspaces());
      }
    }
  }, [currentProject, currentWorkspace, dispatch, user]);

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    await dispatch(updateTaskStatus({ taskId, status: newStatus }));
  };

  const handleVisibilityChange = async () => {
    await apiClient.patch(`/projects/${projectId}`, { isPrivate: !currentProject?.isPrivate });
    dispatch(fetchProjectById(projectId));
  };

  const handleProjectStatusChange = async (status: string) => {
    await apiClient.patch(`/projects/${projectId}`, { status });
    dispatch(fetchProjectById(projectId));
  };

  // Downloads the project's PDF report (workspace owners only; the server enforces it too)
  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    setReportError('');
    try {
      const res = await apiClient.get(`/projects/${projectId}/report`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const slug = (currentProject?.name || 'project').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
      const link = document.createElement('a');
      link.href = url;
      link.download = `${slug || 'project'}-report-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch {
      setReportError('Could not generate the report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleOpenAddTask = (status: TaskStatus = 'TODO') => {
    setDefaultTaskStatus(status);
    setIsCreateTaskOpen(true);
  };

  const handleAddMember = async () => {
    if (!selectedMemberId) return;
    await apiClient.post(`/projects/${projectId}/members`, { userId: selectedMemberId });
    dispatch(fetchProjectById(projectId));
    dispatch(fetchWorkspaces());
    setIsAddMemberOpen(false);
  };

  // Workspace of the project itself, so chat and invitations use the right workspace
  const projectWorkspaceId: string = currentProject?.workspaceId
    ? typeof currentProject.workspaceId === 'object'
      ? (currentProject.workspaceId as any)._id
      : currentProject.workspaceId
    : currentWorkspace?._id || '';

  const memberIds = new Set<string>(
    (currentProject?.members || []).map((m: any) => (typeof m === 'string' ? m : m._id))
  );

  const openAddMemberModal = () => {
    // Only people who belong to this workspace can be added to the project
    apiClient.get(`/workspaces/${projectWorkspaceId}/members`).then((res) => {
      setAllUsers((res.data.data.members || []).map((m: any) => m.user));
      setIsAddMemberOpen(true);
    });
  };

  if (!currentProject) {
    return <div className="text-center py-20 text-gray-400">Loading project data...</div>;
  }


  return (
    <div className="space-y-6">
      {/* Project Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{currentProject.name}</h1>
              {canManage ? (
                <ProjectStatusMenu value={currentProject.status} onChange={handleProjectStatusChange} />
              ) : (
                <Badge type="status" value={currentProject.status} />
              )}
              {canManage ? (
                <button
                  type="button"
                  onClick={handleVisibilityChange}
                  title={currentProject.isPrivate ? 'Only the team can see this project. Click to open it to the workspace.' : 'Everyone in the workspace can see this project. Click to make it private.'}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-600 transition-colors"
                >
                  {currentProject.isPrivate ? <Lock className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                  {currentProject.isPrivate ? 'Private' : 'Whole workspace'}
                </button>
              ) : (
                currentProject.isPrivate && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-200 text-xs font-semibold text-gray-500">
                    <Lock className="w-3.5 h-3.5" /> Private
                  </span>
                )
              )}
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-3xl">
              {currentProject.description || 'No project description provided.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {canManage && (
              <>
                <button
                  type="button"
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport}
                  className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed text-gray-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  <FileDown className="w-4 h-4 text-gray-500" />
                  {isGeneratingReport ? 'Generating...' : 'Generate Report'}
                </button>
                <button
                  onClick={openAddMemberModal}
                  className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  <UserPlus className="w-4 h-4 text-gray-500" /> Add Member
                </button>
              </>
            )}
            <button
              onClick={() => handleOpenAddTask('TODO')}
              className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> New Task
            </button>
          </div>
        </div>

        {reportError && (
          <p role="alert" className="text-xs font-medium text-rose-600">
            {reportError}
          </p>
        )}

        {/* Project Team Members */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-3 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Team:</span>
            <div className="flex -space-x-2">
              {currentProject.members?.map((m: any) => (
                <Avatar key={m._id || m} name={m.name || 'Member'} src={m.avatar} size="sm" />
              ))}
            </div>
          </div>
          {currentProject.dueDate && (
            <div className="flex items-center gap-1 text-gray-400">
              <Calendar className="w-3.5 h-3.5" /> Due {new Date(currentProject.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 gap-6 sm:gap-8 text-sm font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('board')}
          className={`pb-3 flex items-center gap-2 whitespace-nowrap shrink-0 border-b-2 transition-colors ${
            activeTab === 'board'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <KanbanIcon className="w-4 h-4" /> Kanban Board
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`pb-3 flex items-center gap-2 whitespace-nowrap shrink-0 border-b-2 transition-colors ${
            activeTab === 'list'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <ListFilter className="w-4 h-4" /> Task List ({tasks.length})
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`pb-3 flex items-center gap-2 whitespace-nowrap shrink-0 border-b-2 transition-colors ${
            activeTab === 'chat'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Project Chat
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`pb-3 flex items-center gap-2 whitespace-nowrap shrink-0 border-b-2 transition-colors ${
            activeTab === 'activity'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <ActivityIcon className="w-4 h-4" /> Activity Feed
        </button>
      </div>

      {/* Tab Content Views */}
      {activeTab === 'board' && (
        <KanbanBoard
          tasks={tasks}
          onSelectTask={(task) => setSelectedTask(task)}
          onStatusChange={handleStatusChange}
          onAddTask={handleOpenAddTask}
        />
      )}

      {activeTab === 'list' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto shadow-sm">
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Status</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Assignee</th>
                <th className="p-4">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    No tasks in this project.
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
      )}

      {activeTab === 'chat' && (
        <ProjectChat projectId={projectId} workspaceId={projectWorkspaceId} />
      )}

      {activeTab === 'activity' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 max-w-3xl">
          <h3 className="font-bold text-gray-900 text-base">Project Activity Log</h3>
          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No activity logged for this project.</p>
            ) : (
              activities.map((act) => (
                <div key={act._id} className="flex gap-3 text-xs border-b border-gray-100 pb-3">
                  <Avatar name={act.userId?.name || 'User'} src={act.userId?.avatar} size="sm" />
                  <div>
                    <p className="text-gray-800">
                      <span className="font-bold text-gray-900">{act.userId?.name}</span>{' '}
                      {act.action.toLowerCase().replace(/_/g, ' ')}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{new Date(act.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
      />

      {/* Task Create Modal */}
      <TaskCreateModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        projectId={projectId}
        workspaceId={currentWorkspace?._id || ''}
        defaultStatus={defaultTaskStatus}
      />

      {/* Add Member Modal */}
      <Modal isOpen={isAddMemberOpen} onClose={() => setIsAddMemberOpen(false)} title="Add Team Member to Project">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Workspace member
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900"
            >
              <option value="">Select a person...</option>
              {allUsers
                .filter((u) => !memberIds.has(u._id))
                .map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
            {allUsers.filter((u) => !memberIds.has(u._id)).length === 0 && (
              <p className="mt-2 text-xs text-gray-500">Everyone in this workspace is already on the project.</p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Need someone new? Invite them to the workspace by email or link first.{' '}
              <a href="/dashboard/workspaces" className="font-semibold text-brand-600 hover:underline">
                Invite people
              </a>
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => setIsAddMemberOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleAddMember}
              className="px-5 py-2 rounded-lg text-sm font-medium bg-brand-600 text-white hover:bg-brand-700"
            >
              Add to Project
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
