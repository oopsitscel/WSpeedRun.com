import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { RunService } from './run.service';
import { RunController } from './run.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminGuard } from 'src/guards/admin.guard';
import { JwtStrategy } from 'src/guards/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    JwtModule,
    PassportModule,
  ],
  
  controllers: [RunController],
  providers: [
    RunService,
    JwtStrategy,
    AdminGuard,
  ],
})
export class RunModule {}
