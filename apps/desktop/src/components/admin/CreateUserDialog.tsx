import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', role: 'user' as 'user' | 'admin' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setError('');
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    try {
      await api.auth.register(form);
      setSuccess(true);
      setForm({ username: '', password: '', role: 'user' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de la création');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title="Créer un compte"
        >
          <UserPlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>Créer un compte</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="cu-username">Nom d'utilisateur</Label>
            <Input
              id="cu-username"
              value={form.username}
              onChange={(e) => update('username', e.target.value)}
              required
              minLength={3}
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cu-password">Mot de passe</Label>
            <Input
              id="cu-password"
              type="password"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              required
              minLength={8}
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cu-role">Rôle</Label>
            <select
              id="cu-role"
              value={form.role}
              onChange={(e) => update('role', e.target.value)}
              disabled={loading}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-emerald-400">Compte créé avec succès !</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Création…' : 'Créer le compte'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
