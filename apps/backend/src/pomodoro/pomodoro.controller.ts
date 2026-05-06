import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PomodoroService } from './pomodoro.service';
import { StartSessionDto } from './dto/start-session.dto';
import { CompleteSessionDto } from './dto/complete-session.dto';

@Controller('pomodoro')
export class PomodoroController {
  constructor(private readonly pomodoroService: PomodoroService) {}

  @Get('current')
  getCurrent() {
    return this.pomodoroService.getCurrent();
  }

  @Get('sessions')
  findAll() {
    return this.pomodoroService.findAll();
  }

  @Post('start')
  start(@Body() dto: StartSessionDto) {
    return this.pomodoroService.start(dto);
  }

  @Post(':id/pause')
  @HttpCode(HttpStatus.OK)
  pause(@Param('id') id: string) {
    return this.pomodoroService.pause(id);
  }

  @Post(':id/resume')
  @HttpCode(HttpStatus.OK)
  resume(@Param('id') id: string) {
    return this.pomodoroService.resume(id);
  }

  @Post(':id/reset')
  @HttpCode(HttpStatus.OK)
  reset(@Param('id') id: string) {
    return this.pomodoroService.reset(id);
  }

  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  complete(@Param('id') id: string, @Body() dto: CompleteSessionDto) {
    return this.pomodoroService.complete(id, dto);
  }
}
