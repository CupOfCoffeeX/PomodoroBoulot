import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useTaskStore } from '@/store/taskStore';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoginScreen } from '@/components/auth/LoginScreen';

export default function App() {
  const user = useAuthStore((s) => s.user);
  const fetchTasks = useTaskStore((s) => s.fetch);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user, fetchTasks]);

  if (!user) return <LoginScreen />;
  return <MainLayout />;
}
