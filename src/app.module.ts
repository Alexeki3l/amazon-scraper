import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScraperController } from './scraper/scraper.controller';
import { ScraperService } from './scraper/scraper.service';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';

import * as dotenv from 'dotenv';
import { ConfigDatabase } from './config/db.config';
dotenv.config();
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ProductModule,
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      ...ConfigDatabase(),
    }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10h' },
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [ScraperController],
  providers: [ScraperService],
})
export class AppModule {}
