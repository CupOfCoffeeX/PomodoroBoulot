import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.task.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { taskPomodoros: true } } },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { taskPomodoros: true },
    });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  async create(dto: CreateTaskDto) {
    const maxOrder = await this.prisma.task.aggregate({ _max: { order: true } });
    const order = (maxOrder._max.order ?? -1) + 1;
    return this.prisma.task.create({ data: { ...dto, order } });
  }

  async update(id: string, dto: UpdateTaskDto) {
    await this.findOne(id);
    return this.prisma.task.update({ where: { id }, data: dto });
  }

  async updateStatus(id: string, status: TaskStatus) {
    await this.findOne(id);
    return this.prisma.task.update({ where: { id }, data: { status } });
  }

  async reorder(id: string, newOrder: number) {
    const task = await this.findOne(id);
    const oldOrder = task.order;

    if (oldOrder === newOrder) return task;

    if (newOrder > oldOrder) {
      await this.prisma.task.updateMany({
        where: { order: { gt: oldOrder, lte: newOrder } },
        data: { order: { decrement: 1 } },
      });
    } else {
      await this.prisma.task.updateMany({
        where: { order: { gte: newOrder, lt: oldOrder } },
        data: { order: { increment: 1 } },
      });
    }

    return this.prisma.task.update({ where: { id }, data: { order: newOrder } });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.task.delete({ where: { id } });
  }
}
