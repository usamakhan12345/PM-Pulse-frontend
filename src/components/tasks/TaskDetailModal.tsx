'use client';

import React, { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Select from '../common/Select';
import { Task, Comment, Attachment, TaskStatus, TaskPriority, User } from '@/types';
import apiClient, { assetUrl } from '@/api/client';
import { loadAssignees } from '@/lib/assignees';
import { useAppDispatch, useAppSelector } from '@/store';
import { useCanManage } from '@/hooks/useCanManage';
import { updateTask, deleteTask } from '@/store/slices/taskSlice';
import {
  CalendarDays,
  CheckCircle2,
  Download,
  File as FileIcon,
  FileImage,
  FileText,
  FolderKanban,
  MessageSquare,
  Paperclip,
  Plus,
  Send,
  Trash2
} from 'lucide-react';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusOptions = [
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'IN_REVIEW', label: 'In Review' },
  { value: 'DONE', label: 'Done' },
  { value: 'BLOCKED', label: 'Blocked' }
];

const priorityOptions = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' }
];

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

const formatSize = (bytes: number) => (bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

const fileIcon = (type?: string) => {
  if (type?.startsWith('image/')) return FileImage;
  if (type?.includes('pdf') || type?.startsWith('text/')) return FileText;
  return FileIcon;
};

const SectionTitle = ({ icon: Icon, children, count }: { icon: React.ElementType; children: React.ReactNode; count?: number }) => (
  <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
    <Icon className="w-4 h-4 text-gray-400" aria-hidden="true" />
    {children}
    {count !== undefined && <span className="text-xs font-medium text-gray-400">{count}</span>}
  </h4>
);

export default function TaskDetailModal({ task, isOpen, onClose }: TaskDetailModalProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const canManage = useCanManage();
  const [comments, setComments] = useState<Comment[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (task && isOpen) {
      setConfirmDelete(false);
      apiClient.get(`/tasks/${task._id}/comments`).then((res) => {
        setComments(res.data.data.comments || []);
      });
      apiClient.get(`/tasks/${task._id}/attachments`).then((res) => {
        setAttachments(res.data.data.attachments || []);
      });
      const projectId = typeof task.projectId === 'string' ? task.projectId : task.projectId._id;
      loadAssignees(projectId).then(setUsers).catch(() => setUsers([]));
    }
  }, [task, isOpen]);

  if (!task) return null;

  const projectName = typeof task.projectId === 'object' ? task.projectId.name : '';
  const isOverdue = !!task.dueDate && task.status !== 'DONE' && new Date(task.dueDate) < new Date();
  const canDelete = canManage || task.createdBy?._id === user?._id;

  const handleStatusChange = (newStatus: string) => {
    dispatch(updateTask({ taskId: task._id, updateData: { status: newStatus as TaskStatus } }));
  };

  const handlePriorityChange = (newPriority: string) => {
    dispatch(updateTask({ taskId: task._id, updateData: { priority: newPriority as TaskPriority } }));
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
    e.target.value = '';
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
    await dispatch(deleteTask(task._id));
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task.title} maxWidth="max-w-4xl">
      <div className="space-y-6">
        {/* At a glance */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Badge type="status" value={task.status} />
          <Badge type="priority" value={task.priority} />
          {projectName && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <FolderKanban className="w-3.5 h-3.5" aria-hidden="true" /> {projectName}
            </span>
          )}
          {task.dueDate && (
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${isOverdue ? 'text-rose-600' : 'text-gray-500'}`}>
              <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
              {isOverdue ? 'Overdue, was due ' : 'Due '}
              {formatDate(task.dueDate)}
            </span>
          )}
          {task.labels?.map((label) => (
            <span key={label} className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
              {label}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_280px] gap-6">
          {/* Main column */}
          <div className="space-y-7 min-w-0 order-2 md:order-1">
            <section aria-labelledby="desc-heading">
              <h4 id="desc-heading" className="text-sm font-semibold text-gray-900 mb-2">
                Description
              </h4>
              <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words min-h-[72px]">
                {task.description || <span className="text-gray-400 italic">No description added.</span>}
              </div>
            </section>

            <section aria-labelledby="files-heading">
              <div className="flex items-center justify-between mb-2.5">
                <div id="files-heading">
                  <SectionTitle icon={Paperclip} count={attachments.length}>
                    Attachments
                  </SectionTitle>
                </div>
                <label
                  className={`inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-brand-600 hover:bg-brand-50 px-2.5 py-1.5 rounded-lg border border-brand-200 transition-colors ${
                    uploading ? 'opacity-60 pointer-events-none' : ''
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  {uploading ? 'Uploading...' : 'Add file'}
                  <input type="file" onChange={handleFileUpload} className="sr-only" disabled={uploading} />
                </label>
              </div>

              {attachments.length === 0 ? (
                <p className="rounded-xl border border-dashed border-gray-200 px-4 py-5 text-center text-xs text-gray-400">
                  No files yet. Add screenshots, documents or anything else the task needs.
                </p>
              ) : (
                <ul className="space-y-2">
                  {attachments.map((att) => {
                    const Icon = fileIcon(att.fileType);
                    return (
                      <li key={att._id} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5">
                        <span className="w-9 h-9 shrink-0 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center">
                          <Icon className="w-4 h-4" aria-hidden="true" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{att.fileName}</p>
                          <p className="text-xs text-gray-400">
                            {formatSize(att.fileSize)}
                            {att.uploadedBy?.name && <> &middot; {att.uploadedBy.name}</>}
                          </p>
                        </div>
                        <a
                          href={assetUrl(att.fileUrl)}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Download ${att.fileName}`}
                          className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-brand-600 px-2.5 py-1.5 rounded-lg hover:bg-gray-50"
                        >
                          <Download className="w-3.5 h-3.5" aria-hidden="true" /> Download
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            <section aria-labelledby="comments-heading">
              <div id="comments-heading" className="mb-3">
                <SectionTitle icon={MessageSquare} count={comments.length}>
                  Comments
                </SectionTitle>
              </div>

              {comments.length > 0 && (
                <ul className="space-y-4 max-h-72 overflow-y-auto pr-1 mb-4">
                  {comments.map((c) => (
                    <li key={c._id} className="flex gap-3">
                      <Avatar name={c.userId?.name || 'User'} src={c.userId?.avatar} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs">
                          <span className="font-semibold text-gray-900">{c.userId?.name}</span>
                          <span className="ml-2 text-gray-400">{formatDateTime(c.createdAt)}</span>
                        </p>
                        <p className="mt-1 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words rounded-xl rounded-tl-sm bg-gray-50 border border-gray-100 px-3.5 py-2.5">
                          {c.content}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <form onSubmit={handleAddComment} className="flex items-center gap-3">
                <Avatar name={user?.name || 'You'} src={user?.avatar} size="sm" />
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  aria-label="Write a comment"
                  className="flex-1 min-w-0 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  aria-label="Post comment"
                  className="p-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </section>
          </div>

          {/* Details column */}
          <aside className="h-fit rounded-2xl border border-gray-200 bg-gray-50/60 p-4 space-y-4 order-1 md:order-2" aria-label="Task details">
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Status</p>
              <Select label="Status" value={task.status} onChange={handleStatusChange} options={statusOptions} align="right" />
            </div>

            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Priority</p>
              <Select label="Priority" value={task.priority} onChange={handlePriorityChange} options={priorityOptions} align="right" />
            </div>

            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Assignee</p>
              <Select
                label="Assignee"
                value={task.assignedTo?._id || ''}
                onChange={handleAssigneeChange}
                align="right"
                options={[{ value: '', label: 'Unassigned' }, ...users.map((u) => ({ value: u._id, label: u.name, hint: u.email }))]}
              />
            </div>

            <dl className="space-y-3 pt-4 border-t border-gray-200 text-xs">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-gray-400">Created by</dt>
                <dd className="flex items-center gap-2 font-medium text-gray-700 min-w-0">
                  <Avatar name={task.createdBy?.name || 'User'} src={task.createdBy?.avatar} size="sm" />
                  <span className="truncate">{task.createdBy?.name}</span>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-gray-400">Created</dt>
                <dd className="font-medium text-gray-700">{formatDate(task.createdAt)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-gray-400">Due</dt>
                <dd className={`font-medium ${isOverdue ? 'text-rose-600' : 'text-gray-700'}`}>{formatDate(task.dueDate)}</dd>
              </div>
              {task.status === 'DONE' && (
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-gray-400">Completed</dt>
                  <dd className="inline-flex items-center gap-1 font-medium text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    {formatDate((task as any).completedAt || task.updatedAt)}
                  </dd>
                </div>
              )}
            </dl>

            {canDelete && (
              <div className="pt-4 border-t border-gray-200">
                {confirmDelete ? (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600">Delete this task and its comments and files?</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleDeleteTask}
                        className="flex-1 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(false)}
                        className="flex-1 px-3 py-2 border border-gray-200 hover:bg-white text-gray-600 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Keep
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" /> Delete task
                  </button>
                )}
              </div>
            )}
          </aside>
        </div>
      </div>
    </Modal>
  );
}
