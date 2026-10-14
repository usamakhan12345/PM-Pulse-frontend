import { useAppSelector } from '@/store';

// True when the person may manage the active workspace: its owner, or the platform admin.
// Members can work on tasks in their projects but cannot create projects or manage people.
export function useCanManage(): boolean {
  const user = useAppSelector((state) => state.auth.user);
  const currentWorkspace = useAppSelector((state) => state.workspace.currentWorkspace);

  if (user?.role === 'ADMIN') return true;
  return currentWorkspace?.memberRole === 'OWNER';
}
