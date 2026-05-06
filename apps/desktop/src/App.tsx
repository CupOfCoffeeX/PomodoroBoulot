import { useEffect } from 'react';
import { useTimerStore } from '@/store/timerStore';
import { useTaskStore } from '@/store/taskStore';
import { useAuthStore } from '@/store/authStore';
import { MainLayout } from '@/components/layout/MainLayout';
import { CompactLayout } from '@/components/layout/CompactLayout';
import { LoginScreen } from '@/components/auth/LoginScreen';

export default function App() {
  const isCompact = useTimerStore((s) => s.isCompact);
  const user = useAuthStore((s) => s.user);
  const fetchTasks = useTaskStore((s) => s.fetch);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user, fetchTasks]);

  if (!user) return <LoginScreen />;
  return isCompact ? <CompactLayout /> : <MainLayout />;
}
