import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { RunModule } from './run/run.module';
import { CommentModule } from './comment/comment.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule, 

    JwtModule.registerAsync({
      inject: [ConfigService],

      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),

    RunModule,
    CommentModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
