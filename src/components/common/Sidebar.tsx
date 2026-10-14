'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/store';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Bell,
  Settings,
  Building2,
  ShieldCheck,
  Kanban,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Workspaces', href: '/dashboard/workspaces', icon: Building2 },
    { label: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
    { label: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
    { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
    { label: 'Admin', href: '/dashboard/admin', icon: ShieldCheck, adminOnly: true },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings }
  ];

  return (
    <aside
      id="sidebar"
      aria-label="Main navigation"
      className={`w-64 bg-slate-900 text-slate-300 flex flex-col fixed inset-y-0 left-0 z-50 border-r border-slate-800 transform transition-transform duration-200 ease-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800 bg-slate-950 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
          <Kanban className="w-5 h-5" />
        </div>
        <div>
          <p className="font-bold text-white text-base leading-tight tracking-tight">PulsePM</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="ml-auto p-2 -mr-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Main Menu
        </div>
        {navItems
          .filter((item) => !item.adminOnly || user?.role === 'ADMIN')
          .map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 m-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
        <p className="text-xs font-medium text-slate-300">PulsePM</p>
        <p className="text-[11px] text-slate-400 mt-0.5">Projects, tasks and team chat</p>
      </div>
    </aside>
  );
}
