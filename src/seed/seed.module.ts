import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  controllers: [SeedController],
  providers: [SeedService, PrismaService],
})
export class SeedModule {}
