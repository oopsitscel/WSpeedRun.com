import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { GameService } from './game.service';
import { GameController } from './game.controller';
import { AdminGuard } from 'src/guards/admin.guard';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/guards/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    JwtModule,
    PassportModule,
  ],

  controllers: [GameController],
  providers: [
    GameService,
    JwtService,
    AdminGuard,
    JwtStrategy,
  ],
})
export class GameModule {}
