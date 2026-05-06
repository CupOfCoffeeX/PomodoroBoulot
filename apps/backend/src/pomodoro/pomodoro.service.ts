import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SessionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StartSessionDto } from './dto/start-session.dto';
import { CompleteSessionDto } from './dto/complete-session.dto';

@Injectable()
export class PomodoroService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrent() {
    return this.prisma.pomodoroSession.findFirst({
      where: { completed: false, endTime: null },
      orderBy: { createdAt: 'desc' },
      include: { taskPomodoros: { include: { task: true } } },
    });
  }

  async start(dto: StartSessionDto) {
    const existing = await this.getCurrent();
    if (existing) {
      throw new BadRequestException('A session is already running. Complete or reset it first.');
    }

    const session = await this.prisma.pomodoroSession.create({
      data: { type: dto.type ?? SessionType.work },
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

  async pause(sessionId: string) {
    await this.findSessionOrThrow(sessionId);
    return this.prisma.pomodoroSession.update({
      where: { id: sessionId },
      data: { paused: true },
    });
  }

  async resume(sessionId: string) {
    await this.findSessionOrThrow(sessionId);
    return this.prisma.pomodoroSession.update({
      where: { id: sessionId },
      data: { paused: false },
    });
  }

  async reset(sessionId: string) {
    await this.findSessionOrThrow(sessionId);
    return this.prisma.pomodoroSession.update({
      where: { id: sessionId },
      data: { endTime: new Date(), completed: false },
    });
  }

  async complete(sessionId: string, dto: CompleteSessionDto) {
    const session = await this.findSessionOrThrow(sessionId);

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

  async findAll() {
    return this.prisma.pomodoroSession.findMany({
      orderBy: { createdAt: 'desc' },
      include: { taskPomodoros: { include: { task: { select: { id: true, title: true } } } } },
    });
  }

  private async findSessionOrThrow(sessionId: string) {
    const session = await this.prisma.pomodoroSession.findUnique({ where: { id: sessionId } });
    if (!session) throw new NotFoundException(`Session ${sessionId} not found`);
    return session;
  }
}
