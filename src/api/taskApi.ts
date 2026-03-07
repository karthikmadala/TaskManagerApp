import { Task } from '../types';
import { apiClient, unwrapApiData } from './axios';

export interface TaskInput {
  title: string;
  description?: string;
  due_date?: string | null;
  status?: 'pending' | 'in_progress' | 'completed';
  priority?: string;
}

export interface TaskQuery {
  page?: number;
  status?: 'pending' | 'in_progress' | 'completed';
}

export const taskApi = {
  async getTasks(params?: TaskQuery): Promise<unknown> {
    const response = await apiClient.get('/tasks', { params });
    return unwrapApiData<unknown>(response.data);
  },
  async createTask(payload: TaskInput): Promise<Task> {
    const response = await apiClient.post('/tasks', payload);
    return unwrapApiData<Task>(response.data);
  },
  async getTask(taskId: number): Promise<Task> {
    const response = await apiClient.get(`/tasks/${taskId}`);
    return unwrapApiData<Task>(response.data);
  },
  async updateTask(taskId: number, payload: TaskInput): Promise<Task> {
    const response = await apiClient.put(`/tasks/${taskId}`, payload);
    return unwrapApiData<Task>(response.data);
  },
  async deleteTask(taskId: number): Promise<void> {
    await apiClient.delete(`/tasks/${taskId}`);
  },
  async completeTask(taskId: number): Promise<Task> {
    const response = await apiClient.patch(`/tasks/${taskId}/complete`);
    return unwrapApiData<Task>(response.data);
  },
};
