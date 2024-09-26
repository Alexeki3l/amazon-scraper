import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScraperController } from './scraper/scraper.controller';
import { ScraperService } from './scraper/scraper.service';
import { Product } from './product/entities/product.entity';
import { ConfigModule } from '@nestjs/config';
// import { ProductController } from './product/product.controller';
// import { ProductService } from './product/product.service';
import { ProductModule } from './product/product.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    ProductModule,
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE.length ? 'postgres' : 'mysql',
      host: `${process.env.DATABASE_HOST}`,
      port: 5432,
      username: `${process.env.DATABASE_USERNAME}`,
      password: `${process.env.DATABASE_PASSWORD}`,
      database: `${process.env.DATABASE_NAME}`,
      entities: [Product], // Agrega aquí todas las entidades que quieras utilizar
      synchronize: process.env.SYNCHRONIZE === 'true' ? true : false, // Esto creará las tablas automáticamente (solo para desarrollo)
      retryAttempts: 100, // numeros de intentos de conectarse a la base de datos
      retryDelay: 3000, //tiempo de retraso de un intento y otro.
      autoLoadEntities: true, // las entidades se cargaran automaticamente
    }),
  ],
  controllers: [ScraperController],
  providers: [ScraperService],
})
export class AppModule {}
