import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { PomodoroService } from './pomodoro.service';
import { StartSessionDto } from './dto/start-session.dto';
import { CompleteSessionDto } from './dto/complete-session.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/types';

@UseGuards(JwtAuthGuard)
@Controller('pomodoro')
export class PomodoroController {
  constructor(private readonly pomodoroService: PomodoroService) {}

  @Get('current')
  getCurrent(@CurrentUser() user: JwtPayload) {
    return this.pomodoroService.getCurrent(user.sub);
  }

  @Get('sessions')
  findAll(@CurrentUser() user: JwtPayload) {
    return this.pomodoroService.findAll(user.sub);
  }

  @Post('start')
  start(@Body() dto: StartSessionDto, @CurrentUser() user: JwtPayload) {
    return this.pomodoroService.start(dto, user.sub);
  }

  @Post(':id/pause')
  @HttpCode(HttpStatus.OK)
  pause(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.pomodoroService.pause(id, user.sub);
  }

  @Post(':id/resume')
  @HttpCode(HttpStatus.OK)
  resume(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.pomodoroService.resume(id, user.sub);
  }

  @Post(':id/reset')
  @HttpCode(HttpStatus.OK)
  reset(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.pomodoroService.reset(id, user.sub);
  }

  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  complete(@Param('id') id: string, @Body() dto: CompleteSessionDto, @CurrentUser() user: JwtPayload) {
    return this.pomodoroService.complete(id, dto, user.sub);
  }
}
