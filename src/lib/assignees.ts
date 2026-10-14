import apiClient from '@/api/client';
import { User } from '@/types';

// People a task in this project can be assigned to: the whole workspace for an open project,
// only the project team for a private one.
export async function loadAssignees(projectId: string): Promise<User[]> {
  const res = await apiClient.get(`/projects/${projectId}`);
  const project = res.data.data.project;
  if (project.isPrivate) return project.members || [];

  const workspaceId = typeof project.workspaceId === 'object' ? project.workspaceId._id : project.workspaceId;
  const members = await apiClient.get(`/workspaces/${workspaceId}/members`);
  return (members.data.data.members || []).map((m: any) => m.user);
}
