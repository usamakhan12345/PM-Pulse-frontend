import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '@/api/client';
import { Task, TaskStatus, PaginationMeta } from '@/types';

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  pagination: null,
  isLoading: false,
  error: null
};

export const fetchTasks = createAsyncThunk(
  'task/fetchTasks',
  async (params: { workspaceId?: string; projectId?: string; status?: string; priority?: string; search?: string; assignedTo?: string; page?: number }, { rejectWithValue }) => {
    try {
      const res = await apiClient.get('/tasks', { params });
      return {
        tasks: res.data.data.tasks,
        pagination: res.data.pagination
      };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch tasks');
    }
  }
);

export const fetchTaskById = createAsyncThunk('task/fetchById', async (id: string, { rejectWithValue }) => {
  try {
    const res = await apiClient.get(`/tasks/${id}`);
    return res.data.data.task;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to fetch task');
  }
});

export const createTask = createAsyncThunk('task/create', async (data: any, { rejectWithValue }) => {
  try {
    const res = await apiClient.post('/tasks', data);
    return res.data.data.task;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to create task');
  }
});

export const updateTaskStatus = createAsyncThunk(
  'task/updateStatus',
  async ({ taskId, status }: { taskId: string; status: TaskStatus }, { rejectWithValue }) => {
    try {
      const res = await apiClient.patch(`/tasks/${taskId}`, { status });
      return res.data.data.task;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update task status');
    }
  }
);

export const updateTask = createAsyncThunk(
  'task/update',
  async ({ taskId, updateData }: { taskId: string; updateData: any }, { rejectWithValue }) => {
    try {
      const res = await apiClient.patch(`/tasks/${taskId}`, updateData);
      return res.data.data.task;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk('task/delete', async (taskId: string, { rejectWithValue }) => {
  try {
    await apiClient.delete(`/tasks/${taskId}`);
    return taskId;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to delete task');
  }
});

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setCurrentTask: (state, action: PayloadAction<Task | null>) => {
      state.currentTask = action.payload;
    },
    // Realtime Socket Reducers
    socketTaskCreated: (state, action: PayloadAction<Task>) => {
      const exists = state.tasks.some((t) => t._id === action.payload._id);
      if (!exists) {
        state.tasks.unshift(action.payload);
      }
    },
    socketTaskUpdated: (state, action: PayloadAction<Task>) => {
      const idx = state.tasks.findIndex((t) => t._id === action.payload._id);
      if (idx !== -1) {
        state.tasks[idx] = action.payload;
      }
      if (state.currentTask?._id === action.payload._id) {
        state.currentTask = { ...state.currentTask, ...action.payload };
      }
    },
    socketTaskDeleted: (state, action: PayloadAction<{ taskId: string }>) => {
      state.tasks = state.tasks.filter((t) => t._id !== action.payload.taskId);
      if (state.currentTask?._id === action.payload.taskId) {
        state.currentTask = null;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload.tasks;
        state.pagination = action.payload.pagination;
        state.isLoading = false;
      })
      .addCase(fetchTasks.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchTaskById.fulfilled, (state, action: PayloadAction<Task>) => {
        state.currentTask = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.unshift(action.payload);
      })
      .addCase(updateTaskStatus.fulfilled, (state, action: PayloadAction<Task>) => {
        const idx = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) {
          state.tasks[idx] = action.payload;
        }
        if (state.currentTask?._id === action.payload._id) {
          state.currentTask.status = action.payload.status;
        }
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const idx = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) {
          state.tasks[idx] = action.payload;
        }
        if (state.currentTask?._id === action.payload._id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
        if (state.currentTask?._id === action.payload) {
          state.currentTask = null;
        }
      });
  }
});

export const { setCurrentTask, socketTaskCreated, socketTaskUpdated, socketTaskDeleted } = taskSlice.actions;
export default taskSlice.reducer;
