import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PomodoroService } from './pomodoro.service';
import { PomodoroController } from './pomodoro.controller';

@Module({
  imports: [AuthModule],
  controllers: [PomodoroController],
  providers: [PomodoroService],
  exports: [PomodoroService],
})
export class PomodoroModule {}
