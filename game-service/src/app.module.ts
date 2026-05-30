import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { GameModule } from './game/game.module';
import { CategoryModule } from './category/category.module';
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

    GameModule, 
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
