import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '@/api/client';
import { Workspace } from '@/types';

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WorkspaceState = {
  workspaces: [],
  currentWorkspace: null,
  isLoading: false,
  error: null
};

export const fetchWorkspaces = createAsyncThunk('workspace/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await apiClient.get('/workspaces');
    return res.data.data.workspaces;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to fetch workspaces');
  }
});

export const fetchWorkspaceById = createAsyncThunk('workspace/fetchById', async (id: string, { rejectWithValue }) => {
  try {
    const res = await apiClient.get(`/workspaces/${id}`);
    return res.data.data.workspace;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to fetch workspace');
  }
});

export const createWorkspace = createAsyncThunk('workspace/create', async (data: { name: string; description?: string }, { rejectWithValue }) => {
  try {
    const res = await apiClient.post('/workspaces', data);
    return res.data.data.workspace;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to create workspace');
  }
});

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setCurrentWorkspace: (state, action: PayloadAction<Workspace>) => {
      state.currentWorkspace = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaces.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action: PayloadAction<Workspace[]>) => {
        state.workspaces = action.payload;
        state.isLoading = false;
        if (action.payload.length > 0 && !state.currentWorkspace) {
          state.currentWorkspace = action.payload[0];
        }
      })
      .addCase(fetchWorkspaces.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchWorkspaceById.fulfilled, (state, action: PayloadAction<Workspace>) => {
        state.currentWorkspace = action.payload;
      })
      .addCase(createWorkspace.fulfilled, (state, action: PayloadAction<Workspace>) => {
        state.workspaces.unshift(action.payload);
        state.currentWorkspace = action.payload;
      });
  }
});

export const { setCurrentWorkspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;
