import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get('generate')
  seed() {
    return this.seedService.seed();
  }

  @Get('reset')
  reset() {
    return this.seedService.removeAll();
  }
}
