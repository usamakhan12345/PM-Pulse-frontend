'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, CheckCircle2, Mail, Shield, Trash2, User as UserIcon, AlertCircle, CalendarDays } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import apiClient from '@/api/client';
import { fetchCurrentUser } from '@/store/slices/authSlice';
import InstallAppCard from '@/components/pwa/InstallAppCard';

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  useEffect(() => {
    document.title = 'Account settings | PulsePM';
  }, []);

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      await apiClient.patch('/users/profile', { name: name.trim() });
      await dispatch(fetchCurrentUser());
      showFeedback('success', 'Your profile has been updated.');
    } catch (err: any) {
      showFeedback('error', err.message || 'Could not update your profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      showFeedback('error', 'Please choose a JPG, PNG, WebP or GIF image.');
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      showFeedback('error', 'The image is larger than 2 MB. Please choose a smaller one.');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);
    setIsUploading(true);
    try {
      await apiClient.post('/users/profile/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      await dispatch(fetchCurrentUser());
      showFeedback('success', 'Your profile photo has been updated.');
    } catch (err: any) {
      showFeedback('error', err.message || 'Could not upload the photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setIsUploading(true);
    try {
      await apiClient.delete('/users/profile/avatar');
      await dispatch(fetchCurrentUser());
      showFeedback('success', 'Your profile photo has been removed.');
    } catch (err: any) {
      showFeedback('error', err.message || 'Could not remove the photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : null;
  const { workspaces } = useAppSelector((state) => state.workspace);
  const isDirty = name.trim() !== (user?.name || '');

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Account settings</h1>
        <p className="text-sm text-gray-500 mt-1">Update your photo and personal details.</p>
      </div>

      {feedback && (
        <div
          role="status"
          className={`flex items-center gap-2 p-4 text-sm rounded-xl font-medium border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          {feedback.text}
        </div>
      )}

      {/* Profile card */}
      <section aria-labelledby="profile-heading" className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 id="profile-heading" className="font-bold text-gray-900 text-base flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-brand-600" /> Profile
          </h2>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
          {/* Photo */}
          <div className="flex flex-col items-center text-center gap-4">
            <div className="relative">
              <Avatar name={user?.name || 'User'} src={user?.avatar} size="lg" className="!w-28 !h-28 !text-3xl" />
              {isUploading && (
                <div className="absolute inset-0 rounded-full bg-white/70 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 w-full">
              <input
                ref={fileInputRef}
                id="avatar-upload"
                type="file"
                accept={ACCEPTED_TYPES.join(',')}
                onChange={handleAvatarSelected}
                className="sr-only"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                <Camera className="w-4 h-4" /> {user?.avatar ? 'Change photo' : 'Upload photo'}
              </button>
              {user?.avatar && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={isUploading}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 disabled:opacity-60 text-gray-600 rounded-xl text-xs font-semibold transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Remove photo
                </button>
              )}
              <p className="text-[11px] text-gray-400 leading-relaxed">JPG, PNG, WebP or GIF. Up to 2 MB.</p>
            </div>
          </div>

          {/* Details */}
          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div>
              <label htmlFor="display-name" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Full name
              </label>
              <input
                id="display-name"
                type="text"
                required
                minLength={2}
                maxLength={50}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label htmlFor="email-address" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  id="email-address"
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Your email is used to sign in and cannot be changed here.</p>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                <dt className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Account</dt>
                <dd className="mt-1">
                  {user?.role === 'ADMIN' ? <Badge type="role" value="ADMIN" /> : <span className="text-sm font-medium text-gray-800">Standard account</span>}
                </dd>
              </div>
              <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                <dt className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Member since</dt>
                <dd className="mt-1 text-sm text-gray-800 font-medium flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-gray-400" />
                  {memberSince || '—'}
                </dd>
              </div>
            </dl>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSaving || !isDirty}
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold shadow-sm transition-colors"
              >
                {isSaving ? 'Saving...' : 'Save changes'}
              </button>
              {isDirty && (
                <button
                  type="button"
                  onClick={() => setName(user?.name || '')}
                  className="px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-800"
                >
                  Discard
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      <InstallAppCard />

      {/* Workspaces and the role in each */}
      <section aria-labelledby="access-heading" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 id="access-heading" className="font-bold text-gray-900 text-base flex items-center gap-2 mb-1">
          <Shield className="w-5 h-5 text-brand-600" /> Your workspaces
        </h2>
        <p className="text-sm text-gray-500 mb-4">Owners manage the team, projects and tasks. Members work on the projects they are added to.</p>
        {workspaces.length === 0 ? (
          <p className="text-sm text-gray-500">You are not in a workspace yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100 border border-gray-100 rounded-xl">
            {workspaces.map((ws) => (
              <li key={ws._id} className="flex items-center justify-between gap-3 px-4 py-3">
                <span className="text-sm font-medium text-gray-800 truncate">{ws.name}</span>
                {ws.memberRole && <Badge type="role" value={ws.memberRole} />}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
