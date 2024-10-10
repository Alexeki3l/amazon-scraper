import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScraperController } from './scraper/scraper.controller';
import { ScraperService } from './scraper/scraper.service';
import { Product } from './product/entities/product.entity';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import * as dotenv from 'dotenv';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigDatabase } from './db.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { User } from './user/entities/user.entity';
dotenv.config();

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ProductModule,
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      ...ConfigDatabase(),
      entities: [Product, User], // Agrega aquí todas las entidades que quieras utilizar
      retryAttempts: 100, // numeros de intentos de conectarse a la base de datos
      retryDelay: 3000, //tiempo de retraso de un intento y otro.
      autoLoadEntities: true, // las entidades se cargaran automaticamente
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
