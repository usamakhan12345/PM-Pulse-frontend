'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Send, Users, Circle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchProjectMessages, sendChatMessage, addMessage, setOnlineUsers, setUserTyping } from '@/store/slices/chatSlice';
import { getSocket } from '@/sockets/socketClient';
import Avatar from '../common/Avatar';

interface ProjectChatProps {
  projectId: string;
  workspaceId: string;
}

export default function ProjectChat({ projectId, workspaceId }: ProjectChatProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { messages, onlineUsers, typingUsers, isLoading } = useAppSelector((state) => state.chat);
  const [content, setContent] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    dispatch(fetchProjectMessages(projectId));

    const socket = getSocket();
    if (socket && user) {
      socket.emit('project:join', { projectId, userName: user.name });

      socket.on('chat:message', (message: any) => {
        dispatch(addMessage(message));
      });

      socket.on('presence:online', (users: any) => {
        dispatch(setOnlineUsers(users));
      });

      socket.on('chat:typing', (data: any) => {
        dispatch(setUserTyping(data));
      });
    }

    return () => {
      if (socket) {
        socket.emit('project:leave', { projectId });
        socket.off('chat:message');
        socket.off('presence:online');
        socket.off('chat:typing');
      }
    };
  }, [dispatch, projectId, user]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
    const socket = getSocket();
    if (socket && user) {
      socket.emit('chat:typing:start', { projectId, userName: user.name });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('chat:typing:stop', { projectId, userName: user.name });
      }, 2000);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const socket = getSocket();
    if (socket && user) {
      socket.emit('chat:typing:stop', { projectId, userName: user.name });
    }

    await dispatch(sendChatMessage({ projectId, workspaceId, content: content.trim() }));
    setContent('');
  };

  const typingNames = Object.values(typingUsers);

  return (
    <div className="flex h-[calc(100vh-220px)] min-h-[420px] bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Main Chat Thread */}
      <div className="flex-1 flex flex-col h-full bg-slate-50/50">
        {/* Messages Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-gray-900 text-base"># project-chat</h3>
            <p className="text-xs text-gray-500">Real-time team discussion room</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <Circle className="w-2.5 h-2.5 fill-emerald-500" />
            {onlineUsers.length} Online
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {isLoading ? (
            <div className="text-center text-gray-400 py-10">Loading message thread...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-400 py-12 text-sm">
              No messages yet in this project. Be the first to start the conversation!
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId?._id === user?._id;
              return (
                <div
                  key={msg._id}
                  className={`flex gap-3 max-w-[80%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <Avatar name={msg.senderId?.name || 'User'} src={msg.senderId?.avatar} size="sm" />
                  <div>
                    <div className={`flex items-center gap-2 mb-1 ${isMe ? 'justify-end' : ''}`}>
                      <span className="text-xs font-semibold text-gray-700">{msg.senderId?.name}</span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div
                      className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        isMe
                          ? 'bg-brand-600 text-white rounded-tr-none'
                          : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Typing Indicator */}
        {typingNames.length > 0 && (
          <div className="px-6 py-1 text-xs text-gray-500 italic bg-gray-50 border-t border-gray-100">
            {typingNames.join(', ')} {typingNames.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-200 flex items-center gap-3">
          <input
            type="text"
            value={content}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            disabled={!content.trim()}
            className="p-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Online Members Sidebar */}
      <div className="w-64 border-l border-gray-200 bg-white p-4 hidden md:flex flex-col">
        <h4 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-brand-600" /> Active Members ({onlineUsers.length})
        </h4>
        <div className="space-y-3 overflow-y-auto flex-1">
          {onlineUsers.map((u, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
              <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" />
              <span>{u.userName}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
