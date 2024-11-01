import { Module } from '@nestjs/common';
// import { ProductService } from './product.service';
// import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductAmazon } from './entities/product-amazon.entity';
import { ProductShein } from './entities/product-shein.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductAmazon, ProductShein])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
