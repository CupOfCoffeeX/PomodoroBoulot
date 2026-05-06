import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SessionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StartSessionDto } from './dto/start-session.dto';
import { CompleteSessionDto } from './dto/complete-session.dto';

@Injectable()
export class PomodoroService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrent(userId: string) {
    return this.prisma.pomodoroSession.findFirst({
      where: { userId, completed: false, endTime: null },
      orderBy: { createdAt: 'desc' },
      include: { taskPomodoros: { include: { task: true } } },
    });
  }

  async start(dto: StartSessionDto, userId: string) {
    const existing = await this.getCurrent(userId);
    if (existing) {
      throw new BadRequestException('A session is already running. Complete or reset it first.');
    }

    const session = await this.prisma.pomodoroSession.create({
      data: { type: dto.type ?? SessionType.work, userId },
    });

    if (dto.taskId) {
      await this.prisma.taskPomodoro.create({
        data: { taskId: dto.taskId, sessionId: session.id },
      });
      await this.prisma.task.update({
        where: { id: dto.taskId },
        data: { status: 'in_progress' },
      });
    }

    return session;
  }

  async pause(sessionId: string, userId: string) {
    await this.findSessionOrThrow(sessionId, userId);
    return this.prisma.pomodoroSession.update({
      where: { id: sessionId },
      data: { paused: true },
    });
  }

  async resume(sessionId: string, userId: string) {
    await this.findSessionOrThrow(sessionId, userId);
    return this.prisma.pomodoroSession.update({
      where: { id: sessionId },
      data: { paused: false },
    });
  }

  async reset(sessionId: string, userId: string) {
    await this.findSessionOrThrow(sessionId, userId);
    return this.prisma.pomodoroSession.update({
      where: { id: sessionId },
      data: { endTime: new Date(), completed: false },
    });
  }

  async complete(sessionId: string, dto: CompleteSessionDto, userId: string) {
    const session = await this.findSessionOrThrow(sessionId, userId);

    const completed = await this.prisma.pomodoroSession.update({
      where: { id: sessionId },
      data: { endTime: new Date(), completed: true, paused: false },
      include: { taskPomodoros: true },
    });

    if (session.type === SessionType.work) {
      const taskIds = completed.taskPomodoros.map((tp) => tp.taskId);
      if (dto.taskId && !taskIds.includes(dto.taskId)) {
        taskIds.push(dto.taskId);
        await this.prisma.taskPomodoro.upsert({
          where: { taskId_sessionId: { taskId: dto.taskId, sessionId } },
          create: { taskId: dto.taskId, sessionId, duration: dto.duration },
          update: { duration: dto.duration },
        });
      }
      if (taskIds.length > 0) {
        await this.prisma.task.updateMany({
          where: { id: { in: taskIds } },
          data: { pomodoroCount: { increment: 1 } },
        });
      }
    }

    return completed;
  }

  async findAll(userId: string) {
    return this.prisma.pomodoroSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { taskPomodoros: { include: { task: { select: { id: true, title: true } } } } },
    });
  }

  private async findSessionOrThrow(sessionId: string, userId: string) {
    const session = await this.prisma.pomodoroSession.findFirst({
      where: { id: sessionId, userId },
    });
    if (!session) throw new NotFoundException(`Session ${sessionId} not found`);
    return session;
  }
}
