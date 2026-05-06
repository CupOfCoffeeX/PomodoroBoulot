export type TaskStatus = 'pending' | 'in_progress' | 'done';
export type SessionType = 'work' | 'short_break' | 'long_break';
export type TimerMode = 'work' | 'short_break' | 'long_break';
export type UserRole = 'user' | 'admin';

export interface AuthUser {
  id: string;
  username: string;
  role: UserRole;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  estimatedPomodoros?: number | null;
  pomodoroCount: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface PomodoroSession {
  id: string;
  startTime: string;
  endTime?: string | null;
  type: SessionType;
  completed: boolean;
  paused: boolean;
}

export interface Stats {
  totalPomodoros: number;
  completedPomodoros: number;
  totalTasks: number;
  completedTasks: number;
  totalWorkSeconds: number;
  totalWorkMinutes: number;
}

export interface Dashboard {
  today: number;
  thisWeek: number;
  byTask: Array<{
    id: string;
    title: string;
    pomodoroCount: number;
    estimatedPomodoros?: number | null;
    status: TaskStatus;
  }>;
}
