export type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'BLOCKED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  createdAt?: string;
}

export interface Workspace {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  ownerId: string | User;
  memberRole?: Role;
  createdAt?: string;
}

export interface WorkspaceMember {
  _id: string;
  user: User;
  workspace: string;
  role: Role;
  status: 'ACTIVE' | 'INVITED' | 'INACTIVE';
  joinedAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  workspaceId: string;
  ownerId: User | string;
  members: User[];
  status: ProjectStatus;
  startDate?: string;
  dueDate?: string;
  taskStats?: {
    TODO: number;
    IN_PROGRESS: number;
    IN_REVIEW: number;
    DONE: number;
    BLOCKED: number;
    total: number;
  };
  createdAt?: string;
}

export interface Attachment {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: User;
  taskId: string;
  createdAt: string;
}

export interface Comment {
  _id: string;
  taskId: string;
  projectId: string;
  userId: User;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  projectId: Project | { _id: string; name: string };
  workspaceId: string;
  assignedTo?: User | null;
  createdBy: User;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  labels: string[];
  comments?: Comment[];
  attachments?: Attachment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  _id: string;
  projectId: string;
  workspaceId: string;
  senderId: User;
  content: string;
  createdAt: string;
}

export interface Activity {
  _id: string;
  workspaceId: string;
  projectId?: Project;
  taskId?: Task;
  userId: User;
  action: string;
  metadata?: any;
  createdAt: string;
}

export interface Notification {
  _id: string;
  recipientId: string;
  senderId?: User;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
