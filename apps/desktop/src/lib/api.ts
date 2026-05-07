import type { AuthUser, Dashboard, PomodoroSession, SessionType, Stats, Task, TaskStatus } from '@/types';

const BASE = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3000'}/api/v1`;

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('pb_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  auth: {
    login: (username: string, password: string) =>
      request<{ token: string; user: AuthUser }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),
    register: (data: { username: string; password: string; role?: 'user' | 'admin' }) =>
      request<AuthUser>('/auth/admin/create-user', { method: 'POST', body: JSON.stringify(data) }),
    me: () => request<AuthUser>('/auth/me'),
  },

  tasks: {
    list: () => request<Task[]>('/tasks'),
    create: (data: { title: string; description?: string; estimatedPomodoros?: number }) =>
      request<Task>('/tasks', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Task>) =>
      request<Task>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: TaskStatus) =>
      request<Task>(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    reorder: (id: string, order: number) =>
      request<Task>(`/tasks/${id}/order`, { method: 'PATCH', body: JSON.stringify({ order }) }),
    delete: (id: string) => request<void>(`/tasks/${id}`, { method: 'DELETE' }),
  },

  pomodoro: {
    current: () => request<PomodoroSession | null>('/pomodoro/current'),
    start: (data: { type?: SessionType; taskId?: string }) =>
      request<PomodoroSession>('/pomodoro/start', { method: 'POST', body: JSON.stringify(data) }),
    pause: (id: string) => request<PomodoroSession>(`/pomodoro/${id}/pause`, { method: 'POST' }),
    resume: (id: string) => request<PomodoroSession>(`/pomodoro/${id}/resume`, { method: 'POST' }),
    reset: (id: string) => request<PomodoroSession>(`/pomodoro/${id}/reset`, { method: 'POST' }),
    complete: (id: string, data: { taskId?: string; duration?: number }) =>
      request<PomodoroSession>(`/pomodoro/${id}/complete`, { method: 'POST', body: JSON.stringify(data) }),
  },

  tracking: {
    stats: () => request<Stats>('/tracking/stats'),
    dashboard: () => request<Dashboard>('/tracking/dashboard'),
  },
};
