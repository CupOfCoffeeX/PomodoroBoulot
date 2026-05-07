import {
  isPermissionGranted,
  requestPermission,
  sendNotification as tauriSend,
} from '@tauri-apps/plugin-notification';
import type { TimerMode } from '@/types';

const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

export async function initNotifications(): Promise<void> {
  if (isTauri) {
    const granted = await isPermissionGranted();
    if (!granted) await requestPermission();
  } else if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }
}

export async function sendSessionNotification(title: string, body: string): Promise<void> {
  if (isTauri) {
    const granted = await isPermissionGranted();
    if (granted) tauriSend({ title, body });
  } else if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/tomato.svg' });
  }
}

export interface SessionNotifContent {
  icon: string;
  title: string;
  message: string;
  actionLabel: string;
}

export function getSessionContent(
  completed: TimerMode,
  next: TimerMode,
): SessionNotifContent {
  if (completed === 'work') {
    const isLong = next === 'long_break';
    return {
      icon: '🍅',
      title: 'Session terminée !',
      message: isLong ? 'Grande pause bien méritée.' : "Petite pause, tu l'as mérité.",
      actionLabel: isLong ? 'Grande pause' : 'Pause courte',
    };
  }
  return {
    icon: completed === 'long_break' ? '🌿' : '☕',
    title: completed === 'long_break' ? 'Grande pause terminée !' : 'Pause terminée !',
    message: 'Prêt à reprendre le focus ?',
    actionLabel: 'Démarrer le focus',
  };
}
