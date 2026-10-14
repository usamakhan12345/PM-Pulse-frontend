'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Bell,
  Settings,
  Building2,
  Kanban
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Workspaces', href: '/dashboard/workspaces', icon: Building2 },
    { label: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
    { label: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
    { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-40 border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800 bg-slate-950">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
          <Kanban className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-white text-base leading-tight tracking-tight">PulsePM</h1>
          <span className="text-[10px] text-brand-400 font-mono tracking-wider uppercase">Jira + Slack SaaS</span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
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
        <p className="text-xs font-medium text-slate-300">PulsePM Platform</p>
        <p className="text-[11px] text-slate-400 mt-0.5">Enterprise RBAC & Realtime Chat</p>
      </div>
    </aside>
  );
}
