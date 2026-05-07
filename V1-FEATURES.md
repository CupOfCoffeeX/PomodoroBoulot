# PomodoroBoulot — V1 Feature Spec

## 1. Notification System

**Goal:** Notify the user at the end of every timer session (work, short break, long break), both in-app and via native OS/browser notification.

### Desktop (Tauri)
- Use `@tauri-apps/plugin-notification` to send a native macOS notification at session end.
- Notification content:
  - Work session → "Session terminée ! Prends une pause."
  - Short break → "Pause terminée. Au travail !"
  - Long break → "Longue pause terminée. Nouvelle série !"
- Request notification permission on first launch via `isPermissionGranted` / `requestPermission`.

### Web App
- Use the **Browser Notification API** (`Notification.requestPermission`).
- Same content as desktop.
- Request permission on login (not blocking — show a soft prompt in the UI).
- Fallback: in-app toast notification if permission is denied.

### In-App Toast (both platforms)
- Display a styled toast at the bottom of the screen for 4 seconds.
- Shows session type, next action, and a quick-action button ("Démarrer la pause" / "Démarrer le travail").
- Component: `NotificationToast` — reusable between web and desktop.

### Implementation notes
- Notification trigger lives in `useTimerStore` (already handles session transitions).
- Notification service: `apps/desktop/src/lib/notifications.ts` — abstracts Tauri vs Browser Notification API based on `isTauri` flag.

---

## 2. Backend V1 — API Versioning + Self-Registration

**Goal:** Introduce a `/api/v1/` prefix for a clean versioned API without breaking the current routes (used by the desktop app in production).

### Route versioning
- Add a global prefix `/api/v1` to all NestJS controllers via `app.setGlobalPrefix('api/v1')` in `main.ts`.
- The old routes (no prefix) can remain active during the transition period via a compat flag, then be dropped in V2.
- Update `VITE_API_URL` in clients to `https://your-backend.onrender.com/api/v1`.

### Self-Registration
- New endpoint: `POST /api/v1/auth/register` — open, no admin required.
- Rate-limit registration (1 account per IP per hour) to prevent abuse.
- Admin-only account creation (`POST /api/v1/auth/admin/create-user`) remains for creating accounts with forced role.
- `RegisterDto`: `{ username: string, password: string }` — role defaults to `user`.
- Password rules (validated server-side via `class-validator`):
  - Minimum 8 characters
  - At least one number

---

## 3. Account Creation UI (Desktop + Web)

**Goal:** Users can create their own account from the login screen without requiring an admin.

### Login screen changes
- Add a "Créer un compte" toggle/link below the login form.
- Switches the form to register mode: same fields (username, password) + confirm password.
- Client-side validation: passwords match, length ≥ 8 characters.
- On success: auto-login (store token from register response).
- On error: display server message (e.g. "Ce nom d'utilisateur est déjà pris").

### Admin panel (unchanged)
- `CreateUserDialog` remains for admin-created accounts with role selection.
- Admin route stays at `/api/v1/auth/admin/create-user` guarded by `AdminGuard`.

### Shared component
- `AuthForm` component in `apps/desktop/src/components/auth/` handles both login and register modes.
- Replaces the current `LoginScreen` — reused identically in web and desktop.

---

## 4. Web App Landing Page

**Goal:** A public marketing page at the root of the web app (`/`) that presents the product before the user logs in.

### Routes
- `/` — Landing page (public)
- `/app` — The actual Pomodoro app (requires auth, shows `LoginScreen` if not authenticated)

### Landing page sections
1. **Hero** — Product name, tagline, CTA buttons ("Se connecter" / "Créer un compte")
2. **Features** — 3 cards: Timer Pomodoro, Gestion des tâches, Notifications natives
3. **How it works** — 3-step visual: Crée tes tâches → Lance un Pomodoro → Reçois des notifs
4. **Footer** — Links, version, GitHub (if public)

### Tech
- React Router (`react-router-dom`) added to `apps/web`.
- Landing page is a standalone page, no auth required.
- Design: same Shadcn + Tailwind tokens as the app for visual consistency.
- Fully responsive (mobile + desktop).

---

## Delivery Order

| # | Feature | Depends on |
|---|---------|------------|
| 1 | Backend V1 prefix + self-registration | — |
| 2 | Auth UI — self-registration form | 1 |
| 3 | Notification service + toasts | — |
| 4 | Desktop native notifications | 3 |
| 5 | Web browser notifications | 3 |
| 6 | Landing page + React Router | 2 |
