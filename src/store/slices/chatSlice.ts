import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '@/api/client';
import { Message } from '@/types';

interface ChatState {
  messages: Message[];
  onlineUsers: { userId: string; userName: string }[];
  typingUsers: { [userId: string]: string };
  isLoading: boolean;
}

const initialState: ChatState = {
  messages: [],
  onlineUsers: [],
  typingUsers: {},
  isLoading: false
};

export const fetchProjectMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(`/messages/project/${projectId}`);
      return res.data.data.messages;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch messages');
    }
  }
);

export const sendChatMessage = createAsyncThunk(
  'chat/sendMessage',
  async (data: { projectId: string; workspaceId: string; content: string }, { rejectWithValue }) => {
    try {
      const res = await apiClient.post('/messages', data);
      return res.data.data.message;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to send message');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setOnlineUsers: (state, action: PayloadAction<{ userId: string; userName: string }[]>) => {
      state.onlineUsers = action.payload;
    },
    setUserTyping: (state, action: PayloadAction<{ userId: string; userName: string; isTyping: boolean }>) => {
      if (action.payload.isTyping) {
        state.typingUsers[action.payload.userId] = action.payload.userName;
      } else {
        delete state.typingUsers[action.payload.userId];
      }
    },
    clearChat: (state) => {
      state.messages = [];
      state.onlineUsers = [];
      state.typingUsers = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProjectMessages.fulfilled, (state, action: PayloadAction<Message[]>) => {
        state.messages = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchProjectMessages.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(sendChatMessage.fulfilled, (state, action: PayloadAction<Message>) => {
        const exists = state.messages.some((m) => m._id === action.payload._id);
        if (!exists) {
          state.messages.push(action.payload);
        }
      });
  }
});

export const { addMessage, setOnlineUsers, setUserTyping, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
