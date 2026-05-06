import { Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TimerDisplay } from '@/components/timer/TimerDisplay';
import { TimerControls } from '@/components/timer/TimerControls';
import { TaskList } from '@/components/tasks/TaskList';
import { useTimerStore } from '@/store/timerStore';
import { useTaskStore } from '@/store/taskStore';
import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window';

export function MainLayout() {
  const setCompact = useTimerStore((s) => s.setCompact);
  const activeTaskId = useTimerStore((s) => s.activeTaskId);
  const tasks = useTaskStore((s) => s.tasks);
  const activeTask = tasks.find((t) => t.id === activeTaskId);

  async function handleCompact() {
    try {
      const win = getCurrentWindow();
      await win.setSize(new LogicalSize(320, 130));
      await win.setAlwaysOnTop(true);
      await win.setDecorations(false);
    } catch {
      // Running in browser during dev — ignore
    }
    setCompact(true);
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Left — Timer panel */}
      <div className="flex flex-col items-center justify-center w-[380px] flex-shrink-0 p-8 gap-6">
        <div className="flex w-full justify-end">
          <Button variant="ghost" size="icon" onClick={handleCompact} title="Compact mode">
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>

        <TimerDisplay />
        <TimerControls />

        {activeTask ? (
          <div className="text-center px-4">
            <p className="text-xs text-muted-foreground mb-1">Current task</p>
            <p className="text-sm font-medium truncate max-w-[280px]">{activeTask.title}</p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No task selected</p>
        )}
      </div>

      <Separator orientation="vertical" />

      {/* Right — Task panel */}
      <div className="flex-1 flex flex-col p-6 min-w-0">
        <h2 className="text-base font-semibold mb-4">Tasks</h2>
        <div className="flex-1 min-h-0">
          <TaskList />
        </div>
      </div>
    </div>
  );
}
