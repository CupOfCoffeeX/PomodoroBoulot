import { create } from 'zustand';
import { api } from '@/lib/api';
import type { Task, TaskStatus } from '@/types';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;

  fetch: () => Promise<void>;
  create: (title: string, description?: string, estimatedPomodoros?: number) => Promise<Task>;
  update: (id: string, data: Partial<Pick<Task, 'title' | 'description' | 'estimatedPomodoros'>>) => Promise<void>;
  updateStatus: (id: string, status: TaskStatus) => Promise<void>;
  moveUp: (id: string) => Promise<void>;
  moveDown: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const tasks = await api.tasks.list();
      set({ tasks });
    } catch (e) {
      set({ error: (e as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  create: async (title, description, estimatedPomodoros) => {
    const task = await api.tasks.create({ title, description, estimatedPomodoros });
    set((s) => ({ tasks: [...s.tasks, task] }));
    return task;
  },

  update: async (id, data) => {
    const task = await api.tasks.update(id, data);
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? task : t)) }));
  },

  updateStatus: async (id, status) => {
    const task = await api.tasks.updateStatus(id, status);
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? task : t)) }));
  },

  moveUp: async (id) => {
    const { tasks } = get();
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx <= 0) return;
    const newOrder = tasks[idx - 1].order;
    const task = await api.tasks.reorder(id, newOrder);
    const updated = [...tasks];
    updated[idx] = { ...updated[idx], order: task.order };
    updated[idx - 1] = { ...updated[idx - 1], order: tasks[idx].order };
    updated.sort((a, b) => a.order - b.order);
    set({ tasks: updated });
  },

  moveDown: async (id) => {
    const { tasks } = get();
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1 || idx >= tasks.length - 1) return;
    const newOrder = tasks[idx + 1].order;
    const task = await api.tasks.reorder(id, newOrder);
    const updated = [...tasks];
    updated[idx] = { ...updated[idx], order: task.order };
    updated[idx + 1] = { ...updated[idx + 1], order: tasks[idx].order };
    updated.sort((a, b) => a.order - b.order);
    set({ tasks: updated });
  },

  remove: async (id) => {
    await api.tasks.delete(id);
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
  },
}));
