import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { taskApi, TaskInput } from '../api/taskApi';
import { toApiError } from '../api/axios';
import { DEFAULT_PAGE_SIZE } from '../utils/constants';
import { Task } from '../types';

interface TaskState {
  items: Task[];
  selectedTask: Task | null;
  loading: boolean;
  submitting: boolean;
  refreshing: boolean;
  page: number;
  hasMore: boolean;
  error: string | null;
}

const initialState: TaskState = {
  items: [],
  selectedTask: null,
  loading: false,
  submitting: false,
  refreshing: false,
  page: 1,
  hasMore: true,
  error: null,
};

const parseTaskList = (
  payload: unknown,
  page: number,
): { items: Task[]; page: number; hasMore: boolean } => {
  const response = payload as {
    items?: Task[];
    data?: Task[];
    meta?: { current_page?: number; last_page?: number };
  };

  const items = Array.isArray(payload)
    ? (payload as Task[])
    : Array.isArray(response.items)
      ? response.items
    : Array.isArray(response.data)
      ? response.data
      : [];

  const currentPage = response.meta?.current_page ?? page;
  const lastPage = response.meta?.last_page ?? currentPage;
  const hasMore =
    response.meta != null
      ? currentPage < lastPage
      : items.length >= DEFAULT_PAGE_SIZE;

  return { items, page: currentPage, hasMore };
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (
    payload:
      | {
          page?: number;
          refresh?: boolean;
          status?: 'pending' | 'in_progress' | 'completed';
        }
      | undefined,
    { rejectWithValue },
  ) => {
    const page = payload?.page ?? 1;
    try {
      const data = await taskApi.getTasks({ page, status: payload?.status });
      return { ...parseTaskList(data, page), refresh: payload?.refresh ?? false };
    } catch (error) {
      return rejectWithValue(toApiError(error).message);
    }
  },
);

export const fetchTaskById = createAsyncThunk(
  'tasks/fetchTaskById',
  async (taskId: number, { rejectWithValue }) => {
    try {
      return await taskApi.getTask(taskId);
    } catch (error) {
      return rejectWithValue(toApiError(error).message);
    }
  },
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (payload: TaskInput, { rejectWithValue }) => {
    try {
      return await taskApi.createTask(payload);
    } catch (error) {
      return rejectWithValue(toApiError(error).message);
    }
  },
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (
    payload: { taskId: number; data: TaskInput },
    { rejectWithValue },
  ) => {
    try {
      return await taskApi.updateTask(payload.taskId, payload.data);
    } catch (error) {
      return rejectWithValue(toApiError(error).message);
    }
  },
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: number, { rejectWithValue }) => {
    try {
      await taskApi.deleteTask(taskId);
      return taskId;
    } catch (error) {
      return rejectWithValue(toApiError(error).message);
    }
  },
);

export const completeTask = createAsyncThunk(
  'tasks/completeTask',
  async (taskId: number, { rejectWithValue }) => {
    try {
      return await taskApi.completeTask(taskId);
    } catch (error) {
      return rejectWithValue(toApiError(error).message);
    }
  },
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTaskError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.pending, (state, action) => {
        const isRefresh = action.meta.arg?.refresh;
        state.error = null;
        if (isRefresh) {
          state.refreshing = true;
        } else {
          state.loading = true;
        }
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore;
        state.items = action.payload.refresh
          ? action.payload.items
          : action.payload.page === 1
            ? action.payload.items
            : [...state.items, ...action.payload.items];
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.error = (action.payload as string) ?? 'Could not fetch tasks.';
      })
      .addCase(fetchTaskById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Could not fetch task.';
      })
      .addCase(createTask.pending, state => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.submitting = false;
        state.items = [action.payload, ...state.items];
      })
      .addCase(createTask.rejected, (state, action) => {
        state.submitting = false;
        state.error = (action.payload as string) ?? 'Could not create task.';
      })
      .addCase(updateTask.pending, state => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.submitting = false;
        state.selectedTask = action.payload;
        state.items = state.items.map(item =>
          item.id === action.payload.id ? action.payload : item,
        );
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.submitting = false;
        state.error = (action.payload as string) ?? 'Could not update task.';
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        if (state.selectedTask?.id === action.payload) {
          state.selectedTask = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = (action.payload as string) ?? 'Could not delete task.';
      })
      .addCase(completeTask.fulfilled, (state, action) => {
        state.items = state.items.map(item =>
          item.id === action.payload.id ? action.payload : item,
        );
        if (state.selectedTask?.id === action.payload.id) {
          state.selectedTask = action.payload;
        }
      })
      .addCase(completeTask.rejected, (state, action) => {
        state.error = (action.payload as string) ?? 'Could not complete task.';
      });
  },
});

export const { clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
