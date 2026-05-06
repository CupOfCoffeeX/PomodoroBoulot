import { Controller, Get } from '@nestjs/common';
import { TrackingService } from './tracking.service';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get('stats')
  getStats() {
    return this.trackingService.getStats();
  }

  @Get('dashboard')
  getDashboard() {
    return this.trackingService.getDashboard();
  }
}
