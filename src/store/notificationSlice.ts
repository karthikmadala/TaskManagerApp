import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { notificationApi } from '../api/notificationApi';
import { toApiError } from '../api/axios';
import { NotificationItem } from '../types';

interface NotificationState {
  items: NotificationItem[];
  loading: boolean;
  refreshing: boolean;
  page: number;
  hasMore: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  items: [],
  loading: false,
  refreshing: false,
  page: 1,
  hasMore: true,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (
    payload: { page?: number; refresh?: boolean } | undefined,
    { rejectWithValue },
  ) => {
    try {
      const page = payload?.page ?? 1;
      const response = await notificationApi.getNotifications({ page });
      return { ...response, refresh: payload?.refresh ?? false };
    } catch (error) {
      return rejectWithValue(toApiError(error).message);
    }
  },
);

export const markNotificationRead = createAsyncThunk(
  'notifications/markNotificationRead',
  async (id: string, { rejectWithValue }) => {
    try {
      await notificationApi.markAsRead(id);
      return id;
    } catch (error) {
      return rejectWithValue(toApiError(error).message);
    }
  },
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchNotifications.pending, (state, action) => {
        const isRefresh = action.meta.arg?.refresh;
        if (isRefresh) {
          state.refreshing = true;
        } else {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.page = action.payload.currentPage;
        state.hasMore = action.payload.hasMore;
        state.items = action.payload.refresh
          ? action.payload.items
          : action.payload.currentPage === 1
            ? action.payload.items
            : [...state.items, ...action.payload.items];
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.error =
          (action.payload as string) ?? 'Could not fetch notifications.';
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.items = state.items.map(item =>
          item.id === action.payload
            ? { ...item, read_at: item.read_at ?? new Date().toISOString() }
            : item,
        );
      })
      .addCase(markNotificationRead.rejected, (state, action) => {
        state.error =
          (action.payload as string) ?? 'Could not mark notification as read.';
      });
  },
});

export default notificationSlice.reducer;
