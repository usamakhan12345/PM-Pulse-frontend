'use client';

import React, { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { Task, Comment, Attachment, TaskStatus, TaskPriority, User } from '@/types';
import apiClient from '@/api/client';
import { useAppDispatch, useAppSelector } from '@/store';
import { updateTask, deleteTask, fetchTasks } from '@/store/slices/taskSlice';
import { Send, Paperclip, Trash2, Calendar, UserCheck } from 'lucide-react';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskDetailModal({ task, isOpen, onClose }: TaskDetailModalProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [comments, setComments] = useState<Comment[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (task && isOpen) {
      apiClient.get(`/tasks/${task._id}/comments`).then((res) => {
        setComments(res.data.data.comments || []);
      });
      apiClient.get(`/tasks/${task._id}/attachments`).then((res) => {
        setAttachments(res.data.data.attachments || []);
      });
      apiClient.get('/users').then((res) => {
        setUsers(res.data.data.users || []);
      });
    }
  }, [task, isOpen]);

  if (!task) return null;

  const handleStatusChange = (newStatus: TaskStatus) => {
    dispatch(updateTask({ taskId: task._id, updateData: { status: newStatus } }));
  };

  const handlePriorityChange = (newPriority: TaskPriority) => {
    dispatch(updateTask({ taskId: task._id, updateData: { priority: newPriority } }));
  };

  const handleAssigneeChange = (assignedTo: string) => {
    dispatch(updateTask({ taskId: task._id, updateData: { assignedTo: assignedTo || null } }));
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const res = await apiClient.post(`/tasks/${task._id}/comments`, { content: newComment.trim() });
    setComments([...comments, res.data.data.comment]);
    setNewComment('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await apiClient.post(`/tasks/${task._id}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAttachments([res.data.data.attachment, ...attachments]);
    } catch (err) {
      console.error('Upload error', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteTask = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      await dispatch(deleteTask(task._id));
      onClose();
    }
  };

  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task.title} maxWidth="max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Section */}
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</h4>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 leading-relaxed min-h-[80px]">
              {task.description || <span className="text-gray-400 italic">No description provided.</span>}
            </div>
          </div>

          {/* File Attachments */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-gray-500" /> Attachments ({attachments.length})
              </h4>
              <label className="cursor-pointer text-xs font-medium text-brand-600 hover:text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
                {uploading ? 'Uploading...' : '+ Add File'}
                <input type="file" onChange={handleFileUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
            {attachments.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No files attached yet.</p>
            ) : (
              <div className="space-y-2">
                {attachments.map((att) => (
                  <div key={att._id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <Paperclip className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="font-medium text-gray-800 truncate">{att.fileName}</span>
                      <span className="text-[10px] text-gray-400">({Math.round(att.fileSize / 1024)} KB)</span>
                    </div>
                    <a
                      href={`http://localhost:5000${att.fileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-600 hover:underline font-medium text-xs ml-2"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Activity & Comments</h4>

            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 mb-4">
              {comments.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No comments yet.</p>
              ) : (
                comments.map((c) => (
                  <div key={c._id} className="flex gap-3 text-xs">
                    <Avatar name={c.userId?.name || 'User'} src={c.userId?.avatar} size="sm" />
                    <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900">{c.userId?.name}</span>
                        <span className="text-[10px] text-gray-400">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{c.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-medium transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar Sidebar Details */}
        <div className="bg-gray-50/70 rounded-xl p-4 border border-gray-200/80 space-y-4 h-fit">
          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Status</label>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-800 font-medium focus:ring-1 focus:ring-brand-500"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="DONE">Done</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Priority</label>
            <select
              value={task.priority}
              onChange={(e) => handlePriorityChange(e.target.value as TaskPriority)}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-800 font-medium focus:ring-1 focus:ring-brand-500"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Assignee</label>
            <select
              value={task.assignedTo?._id || ''}
              onChange={(e) => handleAssigneeChange(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-800 font-medium focus:ring-1 focus:ring-brand-500"
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Created By</label>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <Avatar name={task.createdBy?.name || 'User'} src={task.createdBy?.avatar} size="sm" />
              <span>{task.createdBy?.name}</span>
            </div>
          </div>

          {canManage && (
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleDeleteTask}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-semibold transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete Task
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
