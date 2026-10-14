'use client';

import React, { useState } from 'react';
import { User as UserIcon, Shield, CheckCircle2, Lock } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import apiClient from '@/api/client';
import { fetchCurrentUser } from '@/store/slices/authSlice';

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { currentWorkspace } = useAppSelector((state) => state.workspace);

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [message, setMessage] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.patch('/users/profile', { name, avatar });
      setMessage('Profile updated successfully!');
      dispatch(fetchCurrentUser());
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(err.message || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Account & Security Settings</h2>
        <p className="text-xs text-gray-500 mt-1">Manage profile information and review system permissions</p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-medium">
          {message}
        </div>
      )}

      {/* Profile Form */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-brand-600" /> User Profile Information
        </h3>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar name={name || 'User'} src={avatar} size="lg" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Full Display Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full max-w-md px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Avatar Image URL
            </label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://api.dicebear.com/7.x/avataaars/svg?seed=Demo"
              className="w-full max-w-md px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            Save Profile Changes
          </button>
        </form>
      </div>

      {/* Role Capabilities & RBAC Matrix */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-600" /> Active System Role Permissions
          </h3>
          {user && <Badge type="role" value={user.role} />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2">
            <h4 className="font-bold text-purple-900 text-xs uppercase tracking-wider">ADMIN Role</h4>
            <ul className="text-xs text-purple-800 space-y-1">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Full Workspace Control</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Create & Delete Projects</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> User & Role Management</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
            <h4 className="font-bold text-blue-900 text-xs uppercase tracking-wider">MANAGER Role</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Create Projects & Tasks</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Assign Tasks & Priorities</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Manage Team Members</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">EMPLOYEE Role</h4>
            <ul className="text-xs text-gray-700 space-y-1">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-gray-600" /> View Assigned Work</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-gray-600" /> Update Task Status</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-gray-600" /> Chat & Add Comments</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
