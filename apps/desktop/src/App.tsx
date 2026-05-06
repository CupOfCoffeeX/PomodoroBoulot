import { useEffect } from 'react';
import { useTimerStore } from '@/store/timerStore';
import { useTaskStore } from '@/store/taskStore';
import { MainLayout } from '@/components/layout/MainLayout';
import { CompactLayout } from '@/components/layout/CompactLayout';

export default function App() {
  const isCompact = useTimerStore((s) => s.isCompact);
  const fetchTasks = useTaskStore((s) => s.fetch);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return isCompact ? <CompactLayout /> : <MainLayout />;
}
