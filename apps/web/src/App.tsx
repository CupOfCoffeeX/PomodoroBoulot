import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useTaskStore } from '@/store/taskStore';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { ToastContainer } from '@/components/ui/toast';
import { initNotifications } from '@/lib/notifications';

export default function App() {
  const user = useAuthStore((s) => s.user);
  const fetchTasks = useTaskStore((s) => s.fetch);

  useEffect(() => {
    initNotifications().catch(() => {});
  }, []);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user, fetchTasks]);

  return (
    <>
      {!user ? <LoginScreen /> : <MainLayout />}
      <ToastContainer />
    </>
  );
}
