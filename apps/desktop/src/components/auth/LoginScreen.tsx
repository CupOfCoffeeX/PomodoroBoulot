import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Mode = 'login' | 'register';

export function LoginScreen() {
  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);

  function switchMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    setError('');
    setPassword('');
    setConfirm('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (mode === 'register' && password !== confirm) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(username, password);
      } else {
        await register(username, password);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : mode === 'login'
            ? 'Connexion échouée'
            : 'Inscription échouée',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm px-6">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="text-5xl select-none">🍅</div>
          <h1 className="text-2xl font-bold tracking-tight">PomodoroBoulot</h1>
          <p
            className="text-sm text-muted-foreground transition-opacity duration-200"
            key={mode}
          >
            {mode === 'login'
              ? 'Connecte-toi pour accéder à ton espace'
              : 'Crée ton compte gratuitement'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          {/* Mode toggle — sliding pill */}
          <div className="relative grid grid-cols-2 bg-muted rounded-lg p-1 mb-6 select-none">
            <div
              className="absolute inset-y-1 bg-background rounded-md shadow-sm transition-all duration-300 ease-in-out pointer-events-none"
              style={{
                left: mode === 'login' ? '4px' : 'calc(50% + 3px)',
                width: 'calc(50% - 7px)',
              }}
            />
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`relative z-10 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                mode === 'login' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`relative z-10 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                mode === 'register' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Créer un compte
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="votre_pseudo"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">
                Mot de passe
                {mode === 'register' && (
                  <span className="text-muted-foreground font-normal ml-1 text-xs">
                    (8 caractères min.)
                  </span>
                )}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
                disabled={loading}
                minLength={mode === 'register' ? 8 : undefined}
              />
            </div>

            {/* Confirm password — slides in for register */}
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{
                maxHeight: mode === 'register' ? '90px' : '0px',
                opacity: mode === 'register' ? 1 : 0,
              }}
            >
              <div className="space-y-1.5 pt-0.5">
                <Label htmlFor="confirm">Confirmer le mot de passe</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  required={mode === 'register'}
                  disabled={loading || mode === 'login'}
                  tabIndex={mode === 'register' ? 0 : -1}
                />
              </div>
            </div>

            {/* Error message */}
            <div
              className="overflow-hidden transition-all duration-200 ease-in-out"
              style={{
                maxHeight: error ? '60px' : '0px',
                opacity: error ? 1 : 0,
              }}
            >
              <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                {error}
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? mode === 'login'
                  ? 'Connexion…'
                  : 'Création…'
                : mode === 'login'
                  ? 'Se connecter'
                  : 'Créer mon compte'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
