import { create } from 'zustand';
import { api } from '@/lib/api';
import type { TimerMode } from '@/types';

const DURATIONS: Record<TimerMode, number> = {
  work: 25 * 60,
  short_break: 5 * 60,
  long_break: 30 * 60,
};

interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  mode: TimerMode;
  cycleCount: number;
  activeTaskId: string | null;
  currentSessionId: string | null;
  isCompact: boolean;
  _intervalId: ReturnType<typeof setInterval> | null;

  start: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  reset: () => Promise<void>;
  skip: () => Promise<void>;
  setActiveTask: (taskId: string | null) => void;
  setCompact: (compact: boolean) => void;
  _tick: () => void;
  _onComplete: () => Promise<void>;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  timeLeft: DURATIONS.work,
  isRunning: false,
  isPaused: false,
  mode: 'work',
  cycleCount: 0,
  activeTaskId: null,
  currentSessionId: null,
  isCompact: false,
  _intervalId: null,

  start: async () => {
    const { mode, activeTaskId, _tick } = get();
    try {
      let session;
      try {
        session = await api.pomodoro.start({ type: mode, taskId: activeTaskId ?? undefined });
      } catch {
        // Backend may have a dangling session from a previous skip/crash — auto-recover
        const current = await api.pomodoro.current().catch(() => null);
        if (current) await api.pomodoro.reset(current.id).catch(() => {});
        session = await api.pomodoro.start({ type: mode, taskId: activeTaskId ?? undefined });
      }
      const id = setInterval(_tick, 1000);
      set({ isRunning: true, isPaused: false, currentSessionId: session.id, _intervalId: id });
    } catch (e) {
      console.error('Failed to start session', e);
    }
  },

  pause: async () => {
    const { _intervalId, currentSessionId } = get();
    if (_intervalId) clearInterval(_intervalId);
    if (currentSessionId) {
      await api.pomodoro.pause(currentSessionId).catch(console.error);
    }
    set({ isRunning: false, isPaused: true, _intervalId: null });
  },

  resume: async () => {
    const { currentSessionId, _tick } = get();
    if (currentSessionId) {
      await api.pomodoro.resume(currentSessionId).catch(console.error);
    }
    const id = setInterval(_tick, 1000);
    set({ isRunning: true, isPaused: false, _intervalId: id });
  },

  reset: async () => {
    const { _intervalId, currentSessionId, mode } = get();
    if (_intervalId) clearInterval(_intervalId);
    if (currentSessionId) {
      await api.pomodoro.reset(currentSessionId).catch(console.error);
    } else {
      // No local session id — still clean up any dangling backend session
      const current = await api.pomodoro.current().catch(() => null);
      if (current) await api.pomodoro.reset(current.id).catch(console.error);
    }
    set({
      isRunning: false,
      isPaused: false,
      timeLeft: DURATIONS[mode],
      currentSessionId: null,
      _intervalId: null,
    });
  },

  skip: async () => {
    const { _intervalId, currentSessionId, mode, cycleCount } = get();
    if (_intervalId) clearInterval(_intervalId);
    // Always tell the backend to abandon the current session before switching phase
    if (currentSessionId) {
      await api.pomodoro.reset(currentSessionId).catch(console.error);
    }
    const nextMode = getNextMode(mode, cycleCount);
    const nextCycle = mode === 'work' ? (cycleCount + 1) % 4 : cycleCount;
    set({
      isRunning: false,
      isPaused: false,
      mode: nextMode,
      cycleCount: nextCycle,
      timeLeft: DURATIONS[nextMode],
      currentSessionId: null,
      _intervalId: null,
    });
  },

  setActiveTask: (taskId) => set({ activeTaskId: taskId }),

  setCompact: (compact) => set({ isCompact: compact }),

  _tick: () => {
    const { timeLeft, _onComplete } = get();
    if (timeLeft <= 1) {
      _onComplete();
    } else {
      set((s) => ({ timeLeft: s.timeLeft - 1 }));
    }
  },

  _onComplete: async () => {
    const { _intervalId, currentSessionId, activeTaskId, mode, cycleCount, _tick: _unused } = get();
    void _unused;
    if (_intervalId) clearInterval(_intervalId);

    if (currentSessionId) {
      await api.pomodoro
        .complete(currentSessionId, {
          taskId: activeTaskId ?? undefined,
          duration: DURATIONS[mode],
        })
        .catch(console.error);
    }

    const nextMode = getNextMode(mode, cycleCount);
    const nextCycle = mode === 'work' ? (cycleCount + 1) % 4 : cycleCount;

    set({
      isRunning: false,
      isPaused: false,
      mode: nextMode,
      cycleCount: nextCycle,
      timeLeft: DURATIONS[nextMode],
      currentSessionId: null,
      _intervalId: null,
    });
  },
}));

function getNextMode(current: TimerMode, cycleCount: number): TimerMode {
  if (current !== 'work') return 'work';
  return (cycleCount + 1) % 4 === 0 ? 'long_break' : 'short_break';
}

export const TIMER_DURATIONS = DURATIONS;
