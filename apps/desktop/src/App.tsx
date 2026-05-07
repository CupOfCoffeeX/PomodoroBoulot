import { useEffect } from 'react';
import { useTimerStore } from '@/store/timerStore';
import { useTaskStore } from '@/store/taskStore';
import { useAuthStore } from '@/store/authStore';
import { MainLayout } from '@/components/layout/MainLayout';
import { CompactLayout } from '@/components/layout/CompactLayout';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { ToastContainer } from '@/components/ui/toast';
import { initNotifications } from '@/lib/notifications';

export default function App() {
  const isCompact = useTimerStore((s) => s.isCompact);
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
      {!user ? <LoginScreen /> : isCompact ? <CompactLayout /> : <MainLayout />}
      <ToastContainer />
    </>
  );
}
