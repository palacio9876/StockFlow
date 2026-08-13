import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorService,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly healthIndicator: HealthIndicatorService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.healthIndicator.check('application').up(),
    ]);
  }
}
