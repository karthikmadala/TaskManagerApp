import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  authApi,
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
} from '../api/authApi';
import { toApiError } from '../api/axios';
import { User } from '../types';
import { storage } from '../utils/storage';

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  isChecking: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  isChecking: true,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (payload: LoginInput, { rejectWithValue }) => {
    try {
      const data = await authApi.login(payload);
      await storage.setToken(data.token);
      return data;
    } catch (error) {
      return rejectWithValue(toApiError(error).message);
    }
  },
);

export const register = createAsyncThunk(
  'auth/register',
  async (payload: RegisterInput, { rejectWithValue }) => {
    try {
      const data = await authApi.register(payload);
      await storage.setToken(data.token);
      return data;
    } catch (error) {
      return rejectWithValue(toApiError(error).message);
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await authApi.logout();
  } finally {
    await storage.clearToken();
  }
});

export const bootstrapAuth = createAsyncThunk(
  'auth/bootstrapAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = await storage.getToken();
      if (!token) {
        return { token: null, user: null };
      }
      const user = await authApi.profile();
      return { token, user };
    } catch (error) {
      await storage.clearToken();
      return rejectWithValue(toApiError(error).message);
    }
  },
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.profile();
    } catch (error) {
      return rejectWithValue(toApiError(error).message);
    }
  },
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (payload: UpdateProfileInput, { rejectWithValue }) => {
    try {
      return await authApi.updateProfile(payload);
    } catch (error) {
      return rejectWithValue(toApiError(error).message);
    }
  },
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (payload: ChangePasswordInput, { rejectWithValue }) => {
    try {
      await authApi.changePassword(payload);
    } catch (error) {
      return rejectWithValue(toApiError(error).message);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    forceLogout: state => {
      state.token = null;
      state.user = null;
      state.error = null;
      state.loading = false;
      state.isChecking = false;
    },
    clearAuthError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Login failed.';
      })
      .addCase(register.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Registration failed.';
      })
      .addCase(logout.fulfilled, state => {
        state.token = null;
        state.user = null;
        state.error = null;
      })
      .addCase(bootstrapAuth.pending, state => {
        state.isChecking = true;
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isChecking = false;
      })
      .addCase(bootstrapAuth.rejected, state => {
        state.token = null;
        state.user = null;
        state.isChecking = false;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Profile update failed.';
      })
      .addCase(changePassword.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, state => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Password change failed.';
      });
  },
});

export const { forceLogout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;

