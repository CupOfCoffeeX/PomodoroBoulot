import { useTimerStore, TIMER_DURATIONS } from '@/store/timerStore';
import { formatTime } from '@/lib/utils';

const MODE_LABELS = {
  work: 'Focus',
  short_break: 'Short Break',
  long_break: 'Long Break',
};

const CYCLE_DOTS = 4;

export function TimerDisplay() {
  const { timeLeft, mode, cycleCount, isRunning, isPaused } = useTimerStore();

  const total = TIMER_DURATIONS[mode];
  const elapsed = total - timeLeft;
  const progress = total > 0 ? elapsed / total : 0;

  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const isWork = mode === 'work';
  const strokeColor = isWork ? '#ef4444' : '#22c55e';

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex items-center justify-center">
        <svg width="260" height="260" className="-rotate-90" aria-hidden>
          <circle
            cx="130" cy="130" r={radius}
            fill="none"
            stroke="hsl(216 34% 17%)"
            strokeWidth="10"
          />
          <circle
            cx="130" cy="130" r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: isRunning ? 'stroke-dashoffset 1s linear' : 'none' }}
          />
        </svg>

        <div className="absolute flex flex-col items-center">
          <span className="text-6xl font-mono font-bold tracking-tight">
            {formatTime(timeLeft)}
          </span>
          <span className="text-sm text-muted-foreground mt-1 font-medium">
            {MODE_LABELS[mode]}
            {isPaused && !isRunning && ' · Paused'}
          </span>
        </div>
      </div>

      <div className="flex gap-2 items-center">
        {Array.from({ length: CYCLE_DOTS }).map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition-colors ${
              i < cycleCount ? 'bg-red-500' : 'bg-muted'
            }`}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">{cycleCount}/4</span>
      </div>
    </div>
  );
}
