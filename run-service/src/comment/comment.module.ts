import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from 'src/guards/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    JwtModule,
    PassportModule,
  ],

  controllers: [CommentController],
  providers: [
    CommentService,
    JwtStrategy,
  ],
})
export class CommentModule {}
