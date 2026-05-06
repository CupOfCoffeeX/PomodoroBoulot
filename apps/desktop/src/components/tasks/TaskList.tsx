import { useTaskStore } from '@/store/taskStore';
import { TaskItem } from './TaskItem';
import { AddTaskForm } from './AddTaskForm';

export function TaskList() {
  const { tasks, loading, error } = useTaskStore();
  const activeTasks = tasks.filter((t) => t.status !== 'done');
  const doneTasks = tasks.filter((t) => t.status === 'done');

  return (
    <div className="flex flex-col gap-3 h-full">
      <AddTaskForm />

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {loading && tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Loading…</p>
        ) : activeTasks.length === 0 && doneTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No tasks yet. Add one above.
          </p>
        ) : (
          <>
            {activeTasks.map((task, i) => (
              <TaskItem
                key={task.id}
                task={task}
                isFirst={i === 0}
                isLast={i === activeTasks.length - 1}
              />
            ))}

            {doneTasks.length > 0 && (
              <>
                <p className="text-xs text-muted-foreground pt-3 pb-1 font-medium uppercase tracking-wider">
                  Completed ({doneTasks.length})
                </p>
                {doneTasks.map((task, i) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    isFirst={i === 0}
                    isLast={i === doneTasks.length - 1}
                  />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
