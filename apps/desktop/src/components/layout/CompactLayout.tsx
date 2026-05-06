import { Play, Pause, RotateCcw, Maximize2, SkipForward, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTimerStore, TIMER_DURATIONS } from '@/store/timerStore';
import { useTaskStore } from '@/store/taskStore';
import { formatTime } from '@/lib/utils';
import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window';

const MODE_COLOR = {
  work: 'text-red-400',
  short_break: 'text-emerald-400',
  long_break: 'text-emerald-400',
};

const MODE_BG = {
  work: 'bg-red-500',
  short_break: 'bg-emerald-500',
  long_break: 'bg-emerald-500',
};

const MODE_LABEL = {
  work: 'Focus',
  short_break: 'Short break',
  long_break: 'Long break',
};

export function CompactLayout() {
  const { timeLeft, isRunning, isPaused, mode, start, pause, resume, reset, skip, setCompact } =
    useTimerStore();
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
      // browser dev — ignore
    }
    setCompact(false);
  }

  const playAction = !isRunning && !isPaused ? start : isRunning ? pause : resume;

  return (
    /*
     * Outer shell: fills the transparent window and provides padding
     * so the box-shadow on the inner widget isn't clipped by the window edge.
     */
    <div className="h-full w-full p-[5px] bg-transparent flex">
      {/* ── Widget card ───────────────────────────────────────────── */}
      <div
        className={[
          'flex flex-1 overflow-hidden relative select-none',
          // Shape & glass
          'rounded-[20px]',
          'bg-[hsl(224,71%,6%)]/[0.88] backdrop-blur-2xl',
          // Border: top highlight + subtle outer ring
          'border border-white/[0.08]',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_12px_40px_rgba(0,0,0,0.6)]',
        ].join(' ')}
      >
        {/* Progress bar — clipped by rounded corners via overflow-hidden */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/[0.05]">
          <div
            className={`h-full ${MODE_BG[mode]} transition-[width] duration-1000 ease-linear opacity-90`}
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* ── Drag region: grip + timer + separator + task ─────── */}
        <div
          data-tauri-drag-region
          className="flex items-center gap-3 flex-1 min-w-0 pl-3 pr-2 cursor-grab active:cursor-grabbing"
        >
          {/* Grip — visual affordance, non-interactive */}
          <GripVertical className="h-4 w-4 flex-shrink-0 pointer-events-none text-white/20" />

          {/* Timer */}
          <div className="flex flex-col flex-shrink-0 pointer-events-none">
            <span
              className={`text-[26px] font-mono font-bold leading-none tabular-nums tracking-tight ${MODE_COLOR[mode]}`}
            >
              {formatTime(timeLeft)}
            </span>
            <span className="text-[10px] text-white/40 mt-[3px] leading-none font-medium">
              {MODE_LABEL[mode]}
              {isPaused && !isRunning && ' · Paused'}
            </span>
          </div>

          {/* Vertical divider */}
          <div className="w-px h-7 bg-white/10 flex-shrink-0 pointer-events-none" />

          {/* Task name */}
          <p
            className={[
              'text-[11px] leading-tight truncate pointer-events-none',
              activeTask ? 'text-white/60' : 'text-white/25 italic',
            ].join(' ')}
          >
            {activeTask ? activeTask.title : 'No task selected'}
          </p>
        </div>

        {/* ── Controls — NOT in drag region ────────────────────── */}
        <div className="flex items-center gap-0.5 pr-2 flex-shrink-0">
          {/* Reset */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/30 hover:text-white/80 hover:bg-white/5 rounded-xl"
            onClick={reset}
            title="Reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>

          {/* Play / Pause — slightly larger, always prominent */}
          <Button
            variant="ghost"
            size="icon"
            className={[
              'h-9 w-9 rounded-xl transition-colors',
              isRunning
                ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10'
                : isPaused
                  ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10'
                  : 'text-red-400 hover:text-red-300 hover:bg-red-400/10',
            ].join(' ')}
            onClick={playAction}
            title={isRunning ? 'Pause' : isPaused ? 'Resume' : 'Start'}
          >
            {isRunning ? <Pause className="h-[18px] w-[18px]" /> : <Play className="h-[18px] w-[18px]" />}
          </Button>

          {/* Skip */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/30 hover:text-white/80 hover:bg-white/5 rounded-xl"
            onClick={skip}
            title="Skip phase"
          >
            <SkipForward className="h-3.5 w-3.5" />
          </Button>

          {/* Thin divider before expand */}
          <div className="w-px h-5 bg-white/10 mx-1" />

          {/* Expand */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/30 hover:text-white/80 hover:bg-white/5 rounded-xl"
            onClick={handleExpand}
            title="Open full app"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
