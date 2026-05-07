import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Param, Patch, Post, Put, UseGuards,
} from '@nestjs/common';
import { TasksService } from '../../tasks/tasks.service';
import { CreateTaskDto } from '../../tasks/dto/create-task.dto';
import { UpdateTaskDto } from '../../tasks/dto/update-task.dto';
import { UpdateTaskStatusDto } from '../../tasks/dto/update-task-status.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtPayload } from '../../auth/types';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/tasks')
export class TasksV1Controller {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.tasksService.findAll(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.tasksService.findOne(id, user.sub);
  }

  @Post()
  create(@Body() dto: CreateTaskDto, @CurrentUser() user: JwtPayload) {
    return this.tasksService.create(dto, user.sub);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @CurrentUser() user: JwtPayload) {
    return this.tasksService.update(id, dto, user.sub);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateTaskStatusDto, @CurrentUser() user: JwtPayload) {
    return this.tasksService.updateStatus(id, dto.status, user.sub);
  }

  @Patch(':id/order')
  reorder(@Param('id') id: string, @Body('order') order: number, @CurrentUser() user: JwtPayload) {
    return this.tasksService.reorder(id, order, user.sub);
  }

  @Post(':id/add-pomodoro')
  @HttpCode(HttpStatus.OK)
  addPomodoro(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.tasksService.addPomodoro(id, user.sub);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.tasksService.remove(id, user.sub);
  }
}
