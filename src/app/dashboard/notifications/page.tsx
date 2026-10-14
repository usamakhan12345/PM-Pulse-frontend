'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Bell, CheckCheck, Circle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '@/store/slices/notificationSlice';
import Avatar from '@/components/common/Avatar';

export default function NotificationsPage() {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount, isLoading } = useAppSelector((state) => state.notification);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkRead = (id: string) => {
    dispatch(markNotificationRead(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead());
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Notification Center</h2>
          <p className="text-xs text-gray-500 mt-1">Updates on task assignments, comments, and project changes</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 rounded-lg text-xs font-semibold border border-brand-200 transition-colors"
          >
            <CheckCheck className="w-4 h-4" /> Mark All as Read
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm divide-y divide-gray-100">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-gray-400">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">You have no notifications.</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.isRead && handleMarkRead(n._id)}
              className={`p-4 flex items-start gap-4 transition-colors ${
                n.isRead ? 'bg-white' : 'bg-brand-50/30'
              } hover:bg-gray-50 cursor-pointer`}
            >
              <Avatar name={n.senderId?.name || 'System'} src={n.senderId?.avatar} size="md" />

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{n.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400">
                      {new Date(n.createdAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {!n.isRead && <Circle className="w-2 h-2 fill-brand-600 text-brand-600" />}
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed mb-2">{n.message}</p>

                {n.link && (
                  <Link
                    href={n.link}
                    className="text-brand-600 font-semibold text-xs hover:underline inline-block"
                  >
                    View details →
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
