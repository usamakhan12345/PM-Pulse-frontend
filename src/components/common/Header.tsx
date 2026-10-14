'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, LogOut, ChevronDown, Plus, Layers, User as UserIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { fetchWorkspaces, setCurrentWorkspace } from '@/store/slices/workspaceSlice';
import { fetchNotifications } from '@/store/slices/notificationSlice';
import Avatar from './Avatar';
import Badge from './Badge';

export default function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { workspaces, currentWorkspace } = useAppSelector((state) => state.workspace);
  const { unreadCount } = useAppSelector((state) => state.notification);
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchWorkspaces());
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30 flex items-center justify-between px-6 shadow-sm">
      {/* Left: Workspace Selector */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="w-6 h-6 rounded bg-brand-500 text-white flex items-center justify-center font-bold text-xs">
              {currentWorkspace ? currentWorkspace.name[0].toUpperCase() : 'W'}
            </div>
            <span className="font-semibold text-gray-800 text-sm max-w-[180px] truncate">
              {currentWorkspace ? currentWorkspace.name : 'Select Workspace'}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {isWorkspaceDropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Workspaces
              </div>
              {workspaces.map((ws) => (
                <button
                  key={ws._id}
                  onClick={() => {
                    dispatch(setCurrentWorkspace(ws));
                    setIsWorkspaceDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-gray-50 ${
                    currentWorkspace?._id === ws._id ? 'bg-brand-50/50 text-brand-600 font-semibold' : 'text-gray-700'
                  }`}
                >
                  <span className="truncate">{ws.name}</span>
                  {ws.memberRole && <Badge type="role" value={ws.memberRole} />}
                </button>
              ))}
              <div className="border-t border-gray-100 mt-1 pt-1 px-2">
                <Link
                  href="/dashboard/workspaces"
                  onClick={() => setIsWorkspaceDropdownOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-brand-600 hover:bg-brand-50 rounded-lg"
                >
                  <Plus className="w-4 h-4" /> Manage Workspaces
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Notifications, User Profile & Role */}
      <div className="flex items-center gap-4">
        {/* User Role Badge */}
        {user && <Badge type="role" value={user.role} />}

        {/* Notifications Icon */}
        <Link
          href="/dashboard/notifications"
          className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        {/* User Avatar & Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-brand-500/20 transition-all"
          >
            <Avatar name={user?.name || 'User'} src={user?.avatar} size="md" />
          </button>

          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <Link
                href="/dashboard/settings"
                onClick={() => setIsUserDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <UserIcon className="w-4 h-4 text-gray-500" /> Account Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
              >
                <LogOut className="w-4 h-4 text-red-500" /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
