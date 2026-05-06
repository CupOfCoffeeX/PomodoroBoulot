# BUILD.md — How to run PomodoroBoulot

---

## Prerequisites

Install these once if not already present:

```bash
# Node.js 20+ (via nvm or https://nodejs.org)
node --version   # must be >= 20

# Rust toolchain (required for Tauri)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
rustup target add aarch64-apple-darwin  # Apple Silicon
# or: rustup target add x86_64-apple-darwin  # Intel

# Tauri system deps (macOS — already included in Xcode CLT)
xcode-select --install 2>/dev/null || true

# Docker Desktop (for PostgreSQL)
# https://www.docker.com/products/docker-desktop/
```

---

## 1. Start the database

```bash
# From project root
docker-compose up -d
```

Verify it's running:
```bash
docker ps | grep pomodoroboulot-db
```

---

## 2. Set up and start the backend

```bash
cd apps/backend

# Install dependencies
npm install

# Copy env (edit DATABASE_URL if needed)
cp .env.example .env

# Run Prisma migration (creates tables)
npx prisma migrate dev --name init

# Start in dev mode (watch)
npm run start:dev
```

Backend available at: `http://localhost:3000`

---

## 3. Start the desktop app

### Dev mode (hot reload, no .app bundle)

```bash
cd apps/desktop

# Install dependencies
npm install

# Start Tauri dev (compiles Rust + starts Vite)
npm run tauri:dev
```

First run compiles Rust — takes 2–5 minutes. Subsequent runs are fast.

### Build a distributable .app / .dmg

```bash
cd apps/desktop
npm run tauri:build
```

Output: `apps/desktop/src-tauri/target/release/bundle/macos/PomodoroBoulot.app`

---

## Quick start (all at once)

```bash
# Terminal 1 — DB
docker-compose up -d

# Terminal 2 — Backend
cd apps/backend && npm install && npx prisma migrate dev --name init && npm run start:dev

# Terminal 3 — Desktop
cd apps/desktop && npm install && npm run tauri:dev
```

---

## Other useful commands

```bash
# Backend
cd apps/backend
npx prisma studio          # Visual DB browser at http://localhost:5555
npx prisma migrate reset   # Wipe DB and re-run all migrations
npm run lint               # ESLint
npm run test               # Jest unit tests

# Desktop
cd apps/desktop
npm run dev                # Vite only (browser, no Tauri — timer/window APIs won't work)
npm run typecheck          # TypeScript check
npm run lint               # ESLint

# Stop DB
docker-compose down
docker-compose down -v     # Also wipe DB data
```
