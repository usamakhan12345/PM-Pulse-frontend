'use client';

import React, { useState } from 'react';
import { Building2, Plus, Users, Shield, CheckCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { createWorkspace, setCurrentWorkspace } from '@/store/slices/workspaceSlice';
import Modal from '@/components/common/Modal';
import Badge from '@/components/common/Badge';

export default function WorkspacesPage() {
  const dispatch = useAppDispatch();
  const { workspaces, currentWorkspace } = useAppSelector((state) => state.workspace);
  const { user } = useAppSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await dispatch(createWorkspace({ name: name.trim(), description: description.trim() }));
    setName('');
    setDescription('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Workspaces</h2>
          <p className="text-xs text-gray-500 mt-1">Manage your team organization workspaces and membership roles</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Create Workspace
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.map((ws) => {
          const isSelected = currentWorkspace?._id === ws._id;
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
                  {ws.description || 'No description available for this workspace.'}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span className="font-mono text-[11px] text-gray-400">slug: {ws.slug}</span>
                {ws.memberRole && <Badge type="role" value={ws.memberRole} />}
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Workspace">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Workspace Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Innovation Lab"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the workspace team..."
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
    </div>
  );
}
