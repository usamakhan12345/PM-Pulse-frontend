'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Check, Copy, Link2, Mail, RefreshCw, Send, Trash2, X } from 'lucide-react';
import apiClient from '@/api/client';
import Modal from '@/components/common/Modal';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import { Workspace } from '@/types';

interface WorkspaceMembersModalProps {
  workspace: Workspace | null;
  isOpen: boolean;
  onClose: () => void;
  isOwner: boolean;
  currentUserId?: string;
}

interface MemberRow {
  _id: string;
  role: 'OWNER' | 'MEMBER';
  user: { _id: string; name: string; email: string; avatar?: string };
}

interface InvitationRow {
  _id: string;
  email: string;
  createdAt: string;
  expiresAt: string;
}

interface ProjectRow {
  _id: string;
  name: string;
  members: { _id: string }[];
}

export default function WorkspaceMembersModal({ workspace, isOpen, onClose, isOwner, currentUserId }: WorkspaceMembersModalProps) {
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [invitations, setInvitations] = useState<InvitationRow[]>([]);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [link, setLink] = useState('');
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const workspaceId = workspace?._id;
  const creatorId = workspace && typeof workspace.ownerId === 'object' ? workspace.ownerId._id : workspace?.ownerId;

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 5000);
  };

  const load = useCallback(async () => {
    if (!workspaceId) return;
    try {
      const membersRes = await apiClient.get(`/workspaces/${workspaceId}/members`);
      setMembers(membersRes.data.data.members || []);
      if (isOwner) {
        const [invRes, linkRes] = await Promise.all([
          apiClient.get(`/workspaces/${workspaceId}/invitations`),
          apiClient.get(`/workspaces/${workspaceId}/invite-link`)
        ]);
        setInvitations(invRes.data.data.invitations || []);
        setLink(linkRes.data.data.link || '');
        const projRes = await apiClient.get('/projects', { params: { workspaceId, limit: 100 } });
        setProjects(projRes.data.data.projects || []);
      }
    } catch (err: any) {
      showFeedback('error', err.message || 'Could not load the team.');
    }
  }, [workspaceId, isOwner]);

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setCopied(false);
      setConfirmReset(false);
      setFeedback(null);
      load();
    }
  }, [isOpen, load]);

  const sendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !workspaceId) return;
    setIsSending(true);
    try {
      await apiClient.post(`/workspaces/${workspaceId}/invitations`, { email: email.trim() });
      showFeedback('success', `Invitation sent to ${email.trim()}.`);
      setEmail('');
      load();
    } catch (err: any) {
      showFeedback('error', err.message || 'Could not send the invitation.');
    } finally {
      setIsSending(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard can be blocked; select the text so it can be copied by hand
      (document.getElementById('invite-link') as HTMLInputElement | null)?.select();
      showFeedback('error', 'Press Ctrl+C (or long press) to copy the selected link.');
    }
  };

  const resetLink = async () => {
    if (!workspaceId) return;
    try {
      const res = await apiClient.post(`/workspaces/${workspaceId}/invite-link/reset`);
      setLink(res.data.data.link);
      setConfirmReset(false);
      showFeedback('success', 'New link created. The old link no longer works.');
    } catch (err: any) {
      showFeedback('error', err.message || 'Could not reset the link.');
    }
  };

  const cancelInvitation = async (id: string) => {
    try {
      await apiClient.delete(`/workspaces/${workspaceId}/invitations/${id}`);
      setInvitations((prev) => prev.filter((i) => i._id !== id));
    } catch (err: any) {
      showFeedback('error', err.message || 'Could not cancel the invitation.');
    }
  };

  // Quick way to put a person on one of the workspace projects
  const addToProject = async (userId: string, projectId: string, personName: string) => {
    if (!projectId) return;
    try {
      await apiClient.post(`/projects/${projectId}/members`, { userId });
      const project = projects.find((p) => p._id === projectId);
      setProjects((prev) => prev.map((p) => (p._id === projectId ? { ...p, members: [...p.members, { _id: userId }] } : p)));
      showFeedback('success', `${personName} was added to ${project?.name || 'the project'}.`);
    } catch (err: any) {
      showFeedback('error', err.message || 'Could not add them to the project.');
    }
  };

  const removeMember = async (userId: string) => {
    try {
      await apiClient.delete(`/workspaces/${workspaceId}/members/${userId}`);
      setMembers((prev) => prev.filter((m) => m.user._id !== userId));
      setRemovingId(null);
      showFeedback('success', 'Removed from the workspace.');
    } catch (err: any) {
      showFeedback('error', err.message || 'Could not remove this person.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={workspace ? `${workspace.name}: team` : 'Team'}>
      <div className="space-y-6">
        {feedback && (
          <p
            role="status"
            className={`text-sm font-medium rounded-lg px-3.5 py-2.5 border ${
              feedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}
          >
            {feedback.text}
          </p>
        )}

        {isOwner && (
          <>
            {/* Invite by email */}
            <section aria-labelledby="invite-email-heading">
              <h4 id="invite-email-heading" className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-600" /> Invite by email
              </h4>
              <p className="text-xs text-gray-500 mt-0.5 mb-2.5">They get an email with a link to join. It works for 7 days.</p>
              <form onSubmit={sendInvite} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  aria-label="Email address to invite"
                  className="flex-1 min-w-0 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="submit"
                  disabled={isSending}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Send className="w-4 h-4" /> {isSending ? 'Sending...' : 'Invite'}
                </button>
              </form>
            </section>

            {/* Invite link */}
            <section aria-labelledby="invite-link-heading">
              <h4 id="invite-link-heading" className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Link2 className="w-4 h-4 text-brand-600" /> Invite link
              </h4>
              <p className="text-xs text-gray-500 mt-0.5 mb-2.5">Share this link in chat or anywhere. Anyone who opens it can join as a member.</p>
              <div className="flex gap-2">
                <input
                  id="invite-link"
                  readOnly
                  value={link}
                  onFocus={(e) => e.target.select()}
                  aria-label="Invite link"
                  className="flex-1 min-w-0 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="button"
                  onClick={copyLink}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="mt-2">
                {confirmReset ? (
                  <p className="text-xs text-gray-600 flex flex-wrap items-center gap-2">
                    The current link will stop working.
                    <button type="button" onClick={resetLink} className="font-semibold text-rose-600 hover:underline">
                      Yes, create a new link
                    </button>
                    <button type="button" onClick={() => setConfirmReset(false)} className="text-gray-500 hover:underline">
                      Cancel
                    </button>
                  </p>
                ) : (
                  <button type="button" onClick={() => setConfirmReset(true)} className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-800">
                    <RefreshCw className="w-3 h-3" /> Create a new link
                  </button>
                )}
              </div>
            </section>

            {/* Waiting for a reply */}
            {invitations.length > 0 && (
              <section aria-labelledby="pending-heading">
                <h4 id="pending-heading" className="text-sm font-semibold text-gray-900 mb-2">
                  Waiting to join ({invitations.length})
                </h4>
                <ul className="divide-y divide-gray-100 border border-gray-100 rounded-lg">
                  {invitations.map((inv) => (
                    <li key={inv._id} className="flex items-center justify-between gap-3 px-3.5 py-2.5 text-sm">
                      <span className="truncate text-gray-700">{inv.email}</span>
                      <button
                        type="button"
                        onClick={() => cancelInvitation(inv._id)}
                        aria-label={`Cancel invitation for ${inv.email}`}
                        className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-rose-600"
                      >
                        <X className="w-3.5 h-3.5" /> Cancel
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}

        {/* People in the workspace */}
        <section aria-labelledby="members-heading">
          <h4 id="members-heading" className="text-sm font-semibold text-gray-900 mb-2">
            People ({members.length})
          </h4>
          <ul className="divide-y divide-gray-100 border border-gray-100 rounded-lg">
            {members.map((m) => {
              const isSelf = m.user._id === currentUserId;
              const isCreator = m.user._id === creatorId;
              return (
                <li key={m._id} className="flex items-center gap-3 px-3.5 py-2.5">
                  <Avatar name={m.user.name} src={m.user.avatar} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {m.user.name} {isSelf && <span className="text-xs font-normal text-gray-400">(you)</span>}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{m.user.email}</p>
                  </div>
                  <Badge type="role" value={m.role} />
                  {isOwner && m.role === 'MEMBER' && (() => {
                    const available = projects.filter((p) => !p.members.some((pm) => pm._id === m.user._id));
                    if (projects.length === 0) return null;
                    return available.length === 0 ? (
                      <span className="hidden sm:inline text-[11px] text-gray-400">On all projects</span>
                    ) : (
                      <select
                        value=""
                        onChange={(e) => addToProject(m.user._id, e.target.value, m.user.name)}
                        aria-label={`Add ${m.user.name} to a project`}
                        className="max-w-[130px] px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-[11px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="">Add to project...</option>
                        {available.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    );
                  })()}
                  {isOwner && !isSelf && !isCreator && (
                    removingId === m.user._id ? (
                      <span className="flex items-center gap-2 text-xs">
                        <button type="button" onClick={() => removeMember(m.user._id)} className="font-semibold text-rose-600 hover:underline">
                          Remove
                        </button>
                        <button type="button" onClick={() => setRemovingId(null)} className="text-gray-500 hover:underline">
                          Keep
                        </button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setRemovingId(m.user._id)}
                        aria-label={`Remove ${m.user.name}`}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )
                  )}
                </li>
              );
            })}
          </ul>
          {isOwner ? (
            <p className="mt-2 text-xs text-gray-500">
              People who join can see your open projects. Use &ldquo;Add to project&rdquo; to put someone on a project team, and make a project private if only its team should see it.
            </p>
          ) : (
            <p className="mt-2 text-xs text-gray-500">Only the workspace owner can invite or remove people.</p>
          )}
        </section>
      </div>
    </Modal>
  );
}
