import { apiClient, unwrapApiData } from './axios';
import { NotificationItem } from '../types';

interface NotificationQuery {
  page?: number;
  per_page?: number;
}

export interface NotificationListResponse {
  items: NotificationItem[];
  currentPage: number;
  lastPage: number;
  hasMore: boolean;
}

const normalizeNotifications = (payload: unknown): NotificationListResponse => {
  const data = (payload ?? {}) as Record<string, unknown>;
  const meta = (data.meta ?? {}) as Record<string, unknown>;

  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(data.items)
      ? data.items
      : Array.isArray(data.data)
        ? data.data
        : [];

  const mappedItems = (items as Array<Record<string, unknown>>).map(item => {
    const nested = (item.data ?? {}) as Record<string, unknown>;
    const message = String(item.message ?? nested.message ?? '');
    const type = String(nested.alert_type ?? item.type ?? 'notification');

    return {
      id: String(item.id ?? ''),
      title: String(item.title ?? type.replace(/_/g, ' ')),
      message,
      read_at: (item.read_at as string | null | undefined) ?? null,
      created_at: item.created_at as string | undefined,
    };
  });

  const currentPage = Number(meta.current_page ?? data.current_page ?? 1);
  const lastPage = Number(meta.last_page ?? data.last_page ?? 1);

  return {
    items: mappedItems,
    currentPage: Number.isFinite(currentPage) ? currentPage : 1,
    lastPage: Number.isFinite(lastPage) ? lastPage : 1,
    hasMore: currentPage < lastPage,
  };
};

export const notificationApi = {
  async getNotifications(params?: NotificationQuery): Promise<NotificationListResponse> {
    const response = await apiClient.get('/notifications', { params });
    return normalizeNotifications(unwrapApiData<unknown>(response.data));
  },
  async markAsRead(id: string): Promise<void> {
    await apiClient.patch(`/notifications/${id}/read`);
  },
};
