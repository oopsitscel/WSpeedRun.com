import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
@Module({
  imports: [
    PrismaModule,

    JwtModule.registerAsync({
      inject: [ConfigService],

      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    
  ],

  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}