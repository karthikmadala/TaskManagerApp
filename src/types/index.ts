export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  zip?: string | null;
  city?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface DashboardStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completion_rate: number;
  open_tasks: number;
}

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  due_date?: string | null;
  priority?: 'low' | 'medium' | 'high' | string;
  is_completed?: boolean;
  status?: 'pending' | 'in_progress' | 'completed' | string;
  created_at?: string;
  updated_at?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read_at?: string | null;
  created_at?: string;
}
