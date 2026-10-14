'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, Plus, Trash2, UserPlus, Users } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { createWorkspace, fetchWorkspaces, setCurrentWorkspace } from '@/store/slices/workspaceSlice';
import apiClient from '@/api/client';
import Modal from '@/components/common/Modal';
import Badge from '@/components/common/Badge';
import WorkspaceMembersModal from '@/components/workspaces/WorkspaceMembersModal';
import { Workspace } from '@/types';

export default function WorkspacesPage() {
  const dispatch = useAppDispatch();
  const { workspaces, currentWorkspace } = useAppSelector((state) => state.workspace);
  const { user } = useAppSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [membersFor, setMembersFor] = useState<Workspace | null>(null);
  const [deleting, setDeleting] = useState<Workspace | null>(null);
  const [confirmName, setConfirmName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Workspaces | PulsePM';
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await dispatch(createWorkspace({ name: name.trim(), description: description.trim() }));
    setName('');
    setDescription('');
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!deleting || confirmName !== deleting.name) return;
    setError('');
    try {
      await apiClient.delete(`/workspaces/${deleting._id}`);
      setDeleting(null);
      setConfirmName('');
      dispatch(fetchWorkspaces());
    } catch (err: any) {
      setError(err.message || 'Could not delete the workspace.');
    }
  };

  const isOwnerOf = (ws: Workspace) => user?.role === 'ADMIN' || ws.memberRole === 'OWNER';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Workspaces</h1>
          <p className="text-xs text-gray-500 mt-1">Each workspace is a team. Invite people by email or link to work with you.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Create Workspace
        </button>
      </div>

      {error && <p role="alert" className="text-sm font-medium text-rose-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.map((ws) => {
          const isSelected = currentWorkspace?._id === ws._id;
          const owner = isOwnerOf(ws);
          return (
            <div
              key={ws._id}
              className={`bg-white rounded-2xl border p-6 shadow-sm flex flex-col justify-between transition-all ${
                isSelected ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-base">
                    {ws.name[0].toUpperCase()}
                  </div>
                  {isSelected ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <CheckCircle className="w-3.5 h-3.5" /> Active
                    </span>
                  ) : (
                    <button
                      onClick={() => dispatch(setCurrentWorkspace(ws))}
                      className="text-xs text-brand-600 hover:underline font-semibold"
                    >
                      Switch to
                    </button>
                  )}
                </div>

                <h3 className="font-bold text-gray-900 text-lg mb-1">{ws.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                  {ws.description || 'No description yet.'}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setMembersFor(ws)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  {owner ? <UserPlus className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                  {owner ? 'Invite & manage team' : 'View team'}
                </button>
                <div className="flex items-center gap-2">
                  {ws.memberRole && <Badge type="role" value={ws.memberRole} />}
                  {owner && (
                    <button
                      onClick={() => {
                        setDeleting(ws);
                        setConfirmName('');
                      }}
                      aria-label={`Delete ${ws.name}`}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <WorkspaceMembersModal
        workspace={membersFor}
        isOpen={!!membersFor}
        onClose={() => setMembersFor(null)}
        isOwner={!!membersFor && isOwnerOf(membersFor)}
        currentUserId={user?._id}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Workspace">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label htmlFor="ws-name" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Workspace name *
            </label>
            <input
              id="ws-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Design Team"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label htmlFor="ws-desc" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              id="ws-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this team work on?"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-colors"
            >
              Create Workspace
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleting} onClose={() => setDeleting(null)} title="Delete workspace" maxWidth="max-w-md">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            This permanently deletes <strong className="text-gray-900">{deleting?.name}</strong> with all its projects, tasks, files and
            chat. It cannot be undone.
          </p>
          <div>
            <label htmlFor="confirm-name" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Type the workspace name to confirm
            </label>
            <input
              id="confirm-name"
              type="text"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={() => setDeleting(null)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={confirmName !== deleting?.name}
              className="px-5 py-2 rounded-lg text-sm font-medium bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-white"
            >
              Delete workspace
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
