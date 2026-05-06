import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTimerStore } from '@/store/timerStore';

export function TimerControls() {
  const { isRunning, isPaused, start, pause, resume, reset, skip } = useTimerStore();

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="icon" onClick={reset} title="Reset">
        <RotateCcw className="h-4 w-4" />
      </Button>

      {!isRunning && !isPaused ? (
        <Button size="lg" onClick={start} className="w-32 bg-red-600 hover:bg-red-700 text-white">
          <Play className="h-5 w-5 mr-1" />
          Start
        </Button>
      ) : isRunning ? (
        <Button size="lg" onClick={pause} className="w-32 bg-yellow-600 hover:bg-yellow-700 text-white">
          <Pause className="h-5 w-5 mr-1" />
          Pause
        </Button>
      ) : (
        <Button size="lg" onClick={resume} className="w-32 bg-green-600 hover:bg-green-700 text-white">
          <Play className="h-5 w-5 mr-1" />
          Resume
        </Button>
      )}

      <Button variant="outline" size="icon" onClick={skip} title="Skip to next phase">
        <SkipForward className="h-4 w-4" />
      </Button>
    </div>
  );
}
