import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTaskStore } from '@/store/taskStore';

export function AddTaskForm() {
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const create = useTaskStore((s) => s.create);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      await create(trimmed);
      setTitle('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a task…"
        disabled={submitting}
        maxLength={200}
      />
      <Button type="submit" size="icon" disabled={!title.trim() || submitting}>
        <Plus className="h-4 w-4" />
      </Button>
    </form>
  );
}
