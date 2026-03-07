import { apiClient, unwrapApiData } from './axios';
import { User } from '../types';

export interface AuthPayload {
  token: string;
  user: User;
  token_expires_at?: string | null;
}

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  zip: string;
  password: string;
  password_confirmation: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UpdateProfileInput {
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  zip?: string | null;
}

export interface ChangePasswordInput {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export const authApi = {
  async register(payload: RegisterInput): Promise<AuthPayload> {
    const response = await apiClient.post('/auth/register', payload);
    return unwrapApiData<AuthPayload>(response.data);
  },
  async login(payload: LoginInput): Promise<AuthPayload> {
    const response = await apiClient.post('/auth/login', payload);
    return unwrapApiData<AuthPayload>(response.data);
  },
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },
  async profile(): Promise<User> {
    const response = await apiClient.get('/auth/profile');
    return unwrapApiData<User>(response.data);
  },
  async updateProfile(payload: UpdateProfileInput): Promise<User> {
    const response = await apiClient.put('/auth/profile', payload);
    return unwrapApiData<User>(response.data);
  },
  async changePassword(payload: ChangePasswordInput): Promise<void> {
    await apiClient.patch('/auth/change-password', payload);
  },
};
