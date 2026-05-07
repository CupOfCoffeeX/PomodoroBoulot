import { useEffect, useRef, useState } from 'react';
import { Trash2, ChevronUp, ChevronDown, Check, Circle, Loader, Target, ChevronDown as ExpandIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTaskStore } from '@/store/taskStore';
import { useTimerStore } from '@/store/timerStore';
import type { Task } from '@/types';

const STATUS_ICONS = {
  pending: <Circle className="h-4 w-4 text-muted-foreground" />,
  in_progress: <Loader className="h-4 w-4 text-blue-400 animate-spin" />,
  done: <Check className="h-4 w-4 text-green-400" />,
};

const STATUS_VARIANT = {
  pending: 'pending',
  in_progress: 'in_progress',
  done: 'done',
} as const;

const STATUS_NEXT = {
  pending: 'in_progress',
  in_progress: 'done',
  done: 'pending',
} as const;

interface Props {
  task: Task;
  isFirst: boolean;
  isLast: boolean;
}

export function TaskItem({ task, isFirst, isLast }: Props) {
  const { updateStatus, moveUp, moveDown, remove } = useTaskStore();
  const { activeTaskId, setActiveTask } = useTimerStore();
  const [removing, setRemoving] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const titleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (el) setIsTruncated(el.scrollWidth > el.offsetWidth);
  }, [task.title]);

  const isActive = activeTaskId === task.id;

  async function handleRemove() {
    setRemoving(true);
    await remove(task.id).catch(() => setRemoving(false));
  }

  function toggleActive() {
    setActiveTask(isActive ? null : task.id);
  }

  return (
    <div
      className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
        isActive ? 'border-red-500/50 bg-red-950/20' : 'border-border bg-card/50 hover:bg-card'
      } ${removing ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <button
        onClick={() => updateStatus(task.id, STATUS_NEXT[task.status])}
        className="flex-shrink-0"
        title={`Status: ${task.status}`}
      >
        {STATUS_ICONS[task.status]}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-1 min-w-0">
          <span
            ref={titleRef}
            className={`text-sm leading-tight ${
              expanded ? 'whitespace-normal break-words' : 'truncate block'
            } ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}
          >
            {task.title}
          </span>
          {(isTruncated || expanded) && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors mt-0.5"
            >
              <ExpandIcon
                className={`h-3 w-3 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
              />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <Badge variant={STATUS_VARIANT[task.status]} className="text-[10px] py-0">
            {task.status.replace('_', ' ')}
          </Badge>
          {task.pomodoroCount > 0 && (
            <span className="text-[10px] text-muted-foreground">
              🍅 {task.pomodoroCount}
              {task.estimatedPomodoros ? `/${task.estimatedPomodoros}` : ''}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className={`h-7 w-7 ${isActive ? 'text-red-400' : 'text-muted-foreground'}`}
          onClick={toggleActive}
          title={isActive ? 'Deselect task' : 'Select for pomodoro'}
        >
          <Target className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground"
          onClick={() => moveUp(task.id)}
          disabled={isFirst}
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground"
          onClick={() => moveDown(task.id)}
          disabled={isLast}
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive/70 hover:text-destructive"
          onClick={handleRemove}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
