import { Controller, Get, UseGuards } from '@nestjs/common';
import { TrackingService } from '../../tracking/tracking.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtPayload } from '../../auth/types';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/tracking')
export class TrackingV1Controller {
  constructor(private readonly trackingService: TrackingService) {}

  @Get('stats')
  getStats(@CurrentUser() user: JwtPayload) {
    return this.trackingService.getStats(user.sub);
  }

  @Get('dashboard')
  getDashboard(@CurrentUser() user: JwtPayload) {
    return this.trackingService.getDashboard(user.sub);
  }
}
