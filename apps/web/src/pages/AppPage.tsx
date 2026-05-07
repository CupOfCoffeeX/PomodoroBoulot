import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useTaskStore } from '@/store/taskStore';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoginScreen } from '@/components/auth/LoginScreen';

export function AppPage() {
  const user = useAuthStore((s) => s.user);
  const fetchTasks = useTaskStore((s) => s.fetch);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user, fetchTasks]);

  return user ? <MainLayout /> : <LoginScreen />;
}
