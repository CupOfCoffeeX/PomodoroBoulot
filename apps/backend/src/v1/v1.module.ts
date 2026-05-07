import { Controller, Get, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TasksModule } from '../tasks/tasks.module';
import { PomodoroModule } from '../pomodoro/pomodoro.module';
import { TrackingModule } from '../tracking/tracking.module';
import { AuthV1Controller } from './auth/auth-v1.controller';
import { TasksV1Controller } from './tasks/tasks-v1.controller';
import { PomodoroV1Controller } from './pomodoro/pomodoro-v1.controller';
import { TrackingV1Controller } from './tracking/tracking-v1.controller';

@Controller('api/v1/version')
class VersionController {
  @Get()
  version() {
    return { version: process.env.APP_VERSION ?? 'unknown' };
  }
}

@Module({
  imports: [AuthModule, TasksModule, PomodoroModule, TrackingModule],
  controllers: [
    VersionController,
    AuthV1Controller,
    TasksV1Controller,
    PomodoroV1Controller,
    TrackingV1Controller,
  ],
})
export class V1Module {}
