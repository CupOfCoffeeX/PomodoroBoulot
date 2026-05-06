# API.md — PomodoroBoulot REST API

Base URL: `http://localhost:3000`

---

## Tasks

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `GET` | `/tasks` | — | List all tasks, ordered by `order` asc |
| `POST` | `/tasks` | `{ title, description?, estimatedPomodoros? }` | Create a task |
| `PUT` | `/tasks/:id` | `{ title?, description?, estimatedPomodoros? }` | Update task fields |
| `PATCH` | `/tasks/:id/status` | `{ status: "pending" \| "in_progress" \| "done" }` | Update task status |
| `PATCH` | `/tasks/:id/order` | `{ order: number }` | Reorder task |
| `DELETE` | `/tasks/:id` | — | Delete task (204) |

### Task object

```json
{
  "id": "cuid",
  "title": "string",
  "description": "string | null",
  "status": "pending | in_progress | done",
  "estimatedPomodoros": "number | null",
  "pomodoroCount": 0,
  "order": 0,
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

---

## Pomodoro

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `GET` | `/pomodoro/current` | — | Get current active session (or `null`) |
| `GET` | `/pomodoro/sessions` | — | List all sessions |
| `POST` | `/pomodoro/start` | `{ type?: "work"\|"short_break"\|"long_break", taskId?: string }` | Start a new session |
| `POST` | `/pomodoro/:id/pause` | — | Pause session |
| `POST` | `/pomodoro/:id/resume` | — | Resume session |
| `POST` | `/pomodoro/:id/reset` | — | Abandon session (marks endTime, not completed) |
| `POST` | `/pomodoro/:id/complete` | `{ taskId?: string, duration?: number }` | Complete session, auto-increments `pomodoroCount` on linked tasks |

### PomodoroSession object

```json
{
  "id": "cuid",
  "startTime": "ISO8601",
  "endTime": "ISO8601 | null",
  "type": "work | short_break | long_break",
  "completed": false,
  "paused": false
}
```

---

## Tracking

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tracking/stats` | Overall stats (total pomodoros, work time, tasks) |
| `GET` | `/tracking/dashboard` | Today + this week pomodoros, per-task breakdown |

### Stats response

```json
{
  "totalPomodoros": 42,
  "completedPomodoros": 38,
  "totalTasks": 15,
  "completedTasks": 10,
  "totalWorkSeconds": 57000,
  "totalWorkMinutes": 950
}
```

### Dashboard response

```json
{
  "today": 4,
  "thisWeek": 18,
  "byTask": [
    {
      "id": "cuid",
      "title": "string",
      "pomodoroCount": 5,
      "estimatedPomodoros": 8,
      "status": "in_progress"
    }
  ]
}
```

---

## Error format

```json
{
  "statusCode": 400,
  "message": "string or string[]",
  "error": "Bad Request"
}
```
