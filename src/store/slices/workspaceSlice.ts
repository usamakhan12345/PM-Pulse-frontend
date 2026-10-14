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
    const workspace = res.data.data.workspace;
    return { ...workspace, memberRole: workspace.currentUserRole };
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to fetch workspace');
  }
});

export const createWorkspace = createAsyncThunk('workspace/create', async (data: { name: string; description?: string }, { rejectWithValue }) => {
  try {
    const res = await apiClient.post('/workspaces', data);
    // The person who creates a workspace owns it
    return { ...res.data.data.workspace, memberRole: 'OWNER' };
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
        // Keep the active workspace (refreshed), or fall back to the first one
        const stillThere = state.currentWorkspace
          ? action.payload.find((w) => w._id === state.currentWorkspace?._id)
          : undefined;
        if (stillThere) {
          state.currentWorkspace = stillThere;
        } else if (action.payload.length > 0) {
          state.currentWorkspace = action.payload[0];
        } else {
          state.currentWorkspace = null;
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
