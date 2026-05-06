import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { PomodoroModule } from './pomodoro/pomodoro.module';
import { TrackingModule } from './tracking/tracking.module';

@Module({
  imports: [PrismaModule, AuthModule, TasksModule, PomodoroModule, TrackingModule],
})
export class AppModule {}
