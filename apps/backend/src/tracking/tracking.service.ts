import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrackingService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(userId: string) {
    const [totalSessions, completedSessions, totalTasks, completedTasks] = await Promise.all([
      this.prisma.pomodoroSession.count({ where: { userId, type: 'work' } }),
      this.prisma.pomodoroSession.count({ where: { userId, type: 'work', completed: true } }),
      this.prisma.task.count({ where: { userId } }),
      this.prisma.task.count({ where: { userId, status: 'done' } }),
    ]);

    const sessions = await this.prisma.pomodoroSession.findMany({
      where: { userId, type: 'work', completed: true },
      select: { startTime: true, endTime: true },
    });

    const totalWorkSeconds = sessions.reduce((acc, s) => {
      if (!s.endTime) return acc;
      return acc + Math.floor((s.endTime.getTime() - s.startTime.getTime()) / 1000);
    }, 0);

    return {
      totalPomodoros: totalSessions,
      completedPomodoros: completedSessions,
      totalTasks,
      completedTasks,
      totalWorkSeconds,
      totalWorkMinutes: Math.floor(totalWorkSeconds / 60),
    };
  }

  async getDashboard(userId: string) {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());

    const [today, thisWeek, byTask] = await Promise.all([
      this.prisma.pomodoroSession.count({
        where: { userId, type: 'work', completed: true, startTime: { gte: startOfDay } },
      }),
      this.prisma.pomodoroSession.count({
        where: { userId, type: 'work', completed: true, startTime: { gte: startOfWeek } },
      }),
      this.prisma.task.findMany({
        where: { userId, pomodoroCount: { gt: 0 } },
        select: { id: true, title: true, pomodoroCount: true, estimatedPomodoros: true, status: true },
        orderBy: { pomodoroCount: 'desc' },
        take: 10,
      }),
    ]);

    return { today, thisWeek, byTask };
  }
}
