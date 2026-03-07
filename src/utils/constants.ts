import { Platform } from 'react-native';

export const API_BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8000/api/v1'
    : 'http://127.0.0.1:8000/api/v1';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'task_manager_auth_token',
} as const;

export const DEFAULT_PAGE_SIZE = 15;
