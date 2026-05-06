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
      await win.setSize(new LogicalSize(420, 96));
      await win.setAlwaysOnTop(true);
      await win.setDecorations(false);
    } catch {
      // Running in browser during dev — ignore
    }
    setCompact(true);
  }

  return (
    <div className="flex h-screen bg-background rounded-lg overflow-hidden">
      {/* Left — Timer panel */}
      <div className="flex flex-col items-center w-[380px] flex-shrink-0 p-8 gap-6">
        {/* Top bar */}
        <div className="flex w-full items-center justify-between">
          <span className="text-sm font-semibold text-foreground/80 tracking-wide">
            PomodoroBoulot
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCompact}
            className="gap-2 text-muted-foreground hover:text-foreground border-border/60 hover:border-border"
          >
            <Minimize2 className="h-3.5 w-3.5" />
            Widget
          </Button>
        </div>

        {/* Timer centered in remaining space */}
        <div className="flex flex-col items-center gap-6 flex-1 justify-center">
          <TimerDisplay />
          <TimerControls />

          {activeTask ? (
            <div className="text-center px-4 max-w-[280px]">
              <p className="text-[11px] text-muted-foreground mb-1 uppercase tracking-wider">
                Current task
              </p>
              <p className="text-sm font-medium truncate">{activeTask.title}</p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">No task selected — pick one →</p>
          )}
        </div>
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
