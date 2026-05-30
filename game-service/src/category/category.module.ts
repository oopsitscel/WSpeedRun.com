import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminGuard } from 'src/guards/admin.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/guards/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    JwtModule,
    PassportModule,
  ],
  
  controllers: [CategoryController],
  providers: [
    CategoryService,
    JwtService,
    AdminGuard,
    JwtStrategy,
  ],
})
export class CategoryModule {}
