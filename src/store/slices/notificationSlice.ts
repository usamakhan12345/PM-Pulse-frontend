import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '@/api/client';
import { Notification } from '@/types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false
};

export const fetchNotifications = createAsyncThunk('notification/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await apiClient.get('/notifications');
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to fetch notifications');
  }
});

export const markNotificationRead = createAsyncThunk('notification/markRead', async (id: string, { rejectWithValue }) => {
  try {
    const res = await apiClient.patch(`/notifications/${id}/read`);
    return res.data.data.notification;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to mark notification read');
  }
});

export const markAllNotificationsRead = createAsyncThunk('notification/markAllRead', async (_, { rejectWithValue }) => {
  try {
    await apiClient.patch('/notifications/read-all');
    return true;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to mark all read');
  }
});

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
        state.isLoading = false;
      })
      .addCase(markNotificationRead.fulfilled, (state, action: PayloadAction<Notification>) => {
        const idx = state.notifications.findIndex((n) => n._id === action.payload._id);
        if (idx !== -1) {
          state.notifications[idx].isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => (n.isRead = true));
        state.unreadCount = 0;
      });
  }
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
