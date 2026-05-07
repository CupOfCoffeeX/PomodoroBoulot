import { Controller, Get, Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { PomodoroModule } from './pomodoro/pomodoro.module';
import { TrackingModule } from './tracking/tracking.module';

@Controller('status')
class StatusController {
  @Get()
  status() {
    return { status: 'ok', port: process.env.PORT ?? 3000 };
  }
}

@Module({
  imports: [PrismaModule, AuthModule, TasksModule, PomodoroModule, TrackingModule],
  controllers: [StatusController],
})
export class AppModule {}
