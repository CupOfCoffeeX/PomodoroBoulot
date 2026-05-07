import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
      include: { _count: { select: { taskPomodoros: true } } },
    });
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
      include: { taskPomodoros: true },
    });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  async create(dto: CreateTaskDto, userId: string) {
    const maxOrder = await this.prisma.task.aggregate({
      _max: { order: true },
      where: { userId },
    });
    const order = (maxOrder._max.order ?? -1) + 1;
    return this.prisma.task.create({ data: { ...dto, order, userId } });
  }

  async update(id: string, dto: UpdateTaskDto, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.task.update({ where: { id }, data: dto });
  }

  async updateStatus(id: string, status: TaskStatus, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.task.update({ where: { id }, data: { status } });
  }

  async reorder(id: string, newOrder: number, userId: string) {
    const task = await this.findOne(id, userId);
    const oldOrder = task.order;
    if (oldOrder === newOrder) return task;

    if (newOrder > oldOrder) {
      await this.prisma.task.updateMany({
        where: { userId, order: { gt: oldOrder, lte: newOrder } },
        data: { order: { decrement: 1 } },
      });
    } else {
      await this.prisma.task.updateMany({
        where: { userId, order: { gte: newOrder, lt: oldOrder } },
        data: { order: { increment: 1 } },
      });
    }

    return this.prisma.task.update({ where: { id }, data: { order: newOrder } });
  }

  async addPomodoro(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.task.update({
      where: { id },
      data: { pomodoroCount: { increment: 1 } },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.task.delete({ where: { id } });
  }
}
