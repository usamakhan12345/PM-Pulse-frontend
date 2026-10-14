import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '@/api/client';
import { Project, PaginationMeta } from '@/types';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  pagination: null,
  isLoading: false,
  error: null
};

export const fetchProjects = createAsyncThunk(
  'project/fetchProjects',
  async (params: { workspaceId: string; search?: string; status?: string; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const res = await apiClient.get('/projects', { params });
      return {
        projects: res.data.data.projects,
        pagination: res.data.pagination
      };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch projects');
    }
  }
);

export const fetchProjectById = createAsyncThunk('project/fetchById', async (id: string, { rejectWithValue }) => {
  try {
    const res = await apiClient.get(`/projects/${id}`);
    return res.data.data.project;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to fetch project');
  }
});

export const createProject = createAsyncThunk('project/create', async (data: any, { rejectWithValue }) => {
  try {
    const res = await apiClient.post('/projects', data);
    return res.data.data.project;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to create project');
  }
});

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
      state.currentProject = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projects = action.payload.projects;
        state.pagination = action.payload.pagination;
        state.isLoading = false;
      })
      .addCase(fetchProjects.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchProjectById.fulfilled, (state, action: PayloadAction<Project>) => {
        state.currentProject = action.payload;
      })
      .addCase(createProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.projects.unshift(action.payload);
      });
  }
});

export const { setCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
