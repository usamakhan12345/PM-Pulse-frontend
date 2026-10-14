'use client';

import React, { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import { useAppDispatch, useAppSelector } from '@/store';
import { createProject } from '@/store/slices/projectSlice';
import { ProjectStatus } from '@/types';
import apiClient from '@/api/client';

interface ProjectCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectCreateModal({ isOpen, onClose }: ProjectCreateModalProps) {
  const dispatch = useAppDispatch();
  const { currentWorkspace } = useAppSelector((state) => state.workspace);
  const { user } = useAppSelector((state) => state.auth);
  const [people, setPeople] = useState<{ _id: string; name: string; email: string }[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPrivate, setIsPrivate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('ACTIVE');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // People in this workspace who can be put on the new project
  useEffect(() => {
    if (!isOpen || !currentWorkspace) return;
    setSelected(new Set());
    setIsPrivate(false);
    apiClient
      .get(`/workspaces/${currentWorkspace._id}/members`)
      .then((res) => setPeople((res.data.data.members || []).map((m: any) => m.user).filter((u: any) => u._id !== user?._id)))
      .catch(() => setPeople([]));
  }, [isOpen, currentWorkspace, user?._id]);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !currentWorkspace) return;

    setIsSubmitting(true);
    await dispatch(
      createProject({
        name: name.trim(),
        description: description.trim(),
        workspaceId: currentWorkspace._id,
        status,
        startDate: startDate || null,
        dueDate: dueDate || null,
        members: Array.from(selected),
        isPrivate
      })
    );

    setIsSubmitting(false);
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Project Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Mobile App Redesign"
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
            placeholder="High level goals and deliverables for this project..."
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Target Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <fieldset>
          <legend className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Team members</legend>
          {people.length === 0 ? (
            <p className="text-xs text-gray-500">
              You are the only person in this workspace so far. Invite people from the Workspaces page, then add them to the project.
            </p>
          ) : (
            <>
              <p className="text-xs text-gray-500 mb-2">The team is who the project is for. You can add or remove people later.</p>
              <ul className="max-h-40 overflow-y-auto border border-gray-100 rounded-lg divide-y divide-gray-100">
                {people.map((p) => (
                  <li key={p._id}>
                    <label className="flex items-center gap-3 px-3.5 py-2 cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={selected.has(p._id)}
                        onChange={() => toggle(p._id)}
                        className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-sm text-gray-800">{p.name}</span>
                      <span className="text-xs text-gray-400 truncate">{p.email}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </>
          )}
        </fieldset>

        <label className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3.5 py-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          />
          <span>
            <span className="block text-sm font-medium text-gray-800">Private project</span>
            <span className="block text-xs text-gray-500">
              Only the team above can see it. Otherwise everyone in the workspace can.
            </span>
          </span>
        </label>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-lg text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-colors"
          >
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
