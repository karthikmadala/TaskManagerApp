import { apiClient, unwrapApiData } from './axios';
import { DashboardStats } from '../types';

const toNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeDashboardStats = (payload: unknown): DashboardStats => {
  const data = (payload ?? {}) as Record<string, unknown>;
  const taskCounts = (data.task_counts ?? {}) as Record<string, unknown>;
  const userStats = (data.user_statistics ?? {}) as Record<string, unknown>;

  return {
    total: toNumber(
      data.total_tasks ?? data.total ?? data.tasks_total ?? taskCounts.total,
    ),
    completed: toNumber(
      data.completed_tasks ??
        data.completed ??
        data.tasks_completed ??
        taskCounts.completed,
    ),
    pending: toNumber(
      data.pending_tasks ?? data.pending ?? data.tasks_pending ?? taskCounts.pending,
    ),
    overdue: toNumber(
      data.overdue_tasks ?? data.overdue ?? data.tasks_overdue ?? taskCounts.overdue,
    ),
    completion_rate: toNumber(
      data.completion_rate ??
        data.completion_rate_percent ??
        userStats.completion_rate,
    ),
    open_tasks: toNumber(data.open_tasks ?? userStats.open_tasks),
  };
};

export const dashboardApi = {
  async getDashboard(): Promise<DashboardStats> {
    const response = await apiClient.get('/dashboard');
    return normalizeDashboardStats(unwrapApiData<unknown>(response.data));
  },
};
