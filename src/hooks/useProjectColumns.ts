import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '@/store';
import apiClient from '@/api/client';
import { BoardColumn, CustomColumn, getProjectColumns } from '@/lib/columns';

// The Kanban columns of one project. They come from the project already open in the store when it is the
// right one; otherwise (for example a task opened from the all-tasks page) the project is fetched once.
export function useProjectColumns(projectId?: string): BoardColumn[] {
  const currentProject = useAppSelector((state) => state.project.currentProject);
  const [fetched, setFetched] = useState<{ id: string; columns: CustomColumn[] } | null>(null);

  const inStore = !!projectId && currentProject?._id === projectId;

  useEffect(() => {
    if (!projectId || inStore) return;
    let cancelled = false;
    apiClient
      .get(`/projects/${projectId}`)
      .then((res) => {
        if (!cancelled) setFetched({ id: projectId, columns: res.data.data.project.customColumns || [] });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [projectId, inStore]);

  const custom = inStore ? currentProject?.customColumns : fetched?.id === projectId ? fetched?.columns : undefined;
  return useMemo(() => getProjectColumns(custom), [custom]);
}
