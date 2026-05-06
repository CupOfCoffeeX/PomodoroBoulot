-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('pending', 'in_progress', 'done');

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('work', 'short_break', 'long_break');

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'pending',
    "estimatedPomodoros" INTEGER,
    "pomodoroCount" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PomodoroSession" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "type" "SessionType" NOT NULL DEFAULT 'work',
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "paused" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PomodoroSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskPomodoro" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskPomodoro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaskPomodoro_taskId_sessionId_key" ON "TaskPomodoro"("taskId", "sessionId");

-- AddForeignKey
ALTER TABLE "TaskPomodoro" ADD CONSTRAINT "TaskPomodoro_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskPomodoro" ADD CONSTRAINT "TaskPomodoro_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PomodoroSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
