import { Play, Pause, RotateCcw, Maximize2, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTimerStore, TIMER_DURATIONS } from '@/store/timerStore';
import { useTaskStore } from '@/store/taskStore';
import { formatTime } from '@/lib/utils';
import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window';

const MODE_COLOR = {
  work: 'text-red-400',
  short_break: 'text-green-400',
  long_break: 'text-green-400',
};

const MODE_BG = {
  work: 'bg-red-500',
  short_break: 'bg-green-500',
  long_break: 'bg-green-500',
};

export function CompactLayout() {
  const { timeLeft, isRunning, isPaused, mode, start, pause, resume, reset, skip, setCompact } = useTimerStore();
  const activeTaskId = useTimerStore((s) => s.activeTaskId);
  const tasks = useTaskStore((s) => s.tasks);
  const activeTask = tasks.find((t) => t.id === activeTaskId);

  const total = TIMER_DURATIONS[mode];
  const progress = total > 0 ? (total - timeLeft) / total : 0;

  async function handleExpand() {
    try {
      const win = getCurrentWindow();
      await win.setAlwaysOnTop(false);
      await win.setDecorations(true);
      await win.setSize(new LogicalSize(900, 700));
    } catch {
      // Running in browser — ignore
    }
    setCompact(false);
  }

  return (
    <div
      data-tauri-drag-region
      className="flex items-center gap-3 w-full h-full px-4 bg-background border border-border rounded-xl select-none overflow-hidden"
    >
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-border">
        <div
          className={`h-full ${MODE_BG[mode]} transition-all duration-1000 ease-linear`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Timer */}
      <div className="flex flex-col min-w-[72px]">
        <span className={`text-2xl font-mono font-bold leading-none ${MODE_COLOR[mode]}`}>
          {formatTime(timeLeft)}
        </span>
        <span className="text-[10px] text-muted-foreground mt-0.5">
          {mode === 'work' ? 'Focus' : mode === 'short_break' ? 'Short break' : 'Long break'}
        </span>
      </div>

      {/* Task name */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground truncate">
          {activeTask ? activeTask.title : 'No task selected'}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={reset}>
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>

        {!isRunning && !isPaused ? (
          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400" onClick={start}>
            <Play className="h-3.5 w-3.5" />
          </Button>
        ) : isRunning ? (
          <Button variant="ghost" size="icon" className="h-7 w-7 text-yellow-400" onClick={pause}>
            <Pause className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="h-7 w-7 text-green-400" onClick={resume}>
            <Play className="h-3.5 w-3.5" />
          </Button>
        )}

        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={skip}>
          <SkipForward className="h-3.5 w-3.5" />
        </Button>

        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleExpand}>
          <Maximize2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
