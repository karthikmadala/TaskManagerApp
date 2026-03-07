import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { storage } from '../utils/storage';
import { ApiError } from '../types';

let unauthorizedHandler: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: () => void): void => {
  unauthorizedHandler = handler;
};

export const toApiError = (error: unknown): ApiError => {
  const axiosError = error as AxiosError<{
    message?: string;
    errors?: Record<string, string[]>;
  }>;

  return {
    message:
      axiosError.response?.data?.message ??
      axiosError.message ??
      'Something went wrong.',
    status: axiosError.response?.status,
    errors: axiosError.response?.data?.errors,
  };
};

export const unwrapApiData = <T>(payload: unknown): T => {
  if (
    payload != null &&
    typeof payload === 'object' &&
    'data' in (payload as Record<string, unknown>)
  ) {
    return (payload as { data: T }).data;
  }

  return payload as T;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async config => {
  const token = await storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error?.response?.status === 401) {
      await storage.clearToken();
      unauthorizedHandler?.();
    }
    return Promise.reject(toApiError(error));
  },
);
