import type { Task, PomodoroSession, Stats, Dashboard, TaskStatus, SessionType } from '@/types';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// Tasks
export const api = {
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
