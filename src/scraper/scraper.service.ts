import { Injectable, Logger } from '@nestjs/common';
import {
  changeUbication,
  searchProductsByName,
  searchProductsByBestSelling,
  searchProductsAmazonByUrl,
} from './scraper';
import { ProductService } from 'src/product/product.service';
import { CreateProductAmazonDto } from 'src/product/dto/amazon/create-amazon-product.dto';
import { ProductAmazon } from 'src/product/entities/product-amazon.entity';
import { Cron } from '@nestjs/schedule';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class ScraperService {
  constructor(private readonly productService: ProductService) {}

  async searchProductsByName(name: string) {
    const products: CreateProductAmazonDto[] = await searchProductsByName(name);
    if (!(products instanceof Array)) return { products };
    products.forEach(async (product) => {
      await this.productService.createProductAmazon(product);
    });
    return products;
  }

  async searchProductsAmazonByUrl(url: string) {
    const res: any = await searchProductsAmazonByUrl(url);
    if (res === null) return { error: 'Ocurrio un error' };

    const product = new ProductAmazon();
    Object.assign(product, res);

    await this.productService.createProductAmazon(product);
    return product;
  }

  @Cron(`${process.env.CRON_JOBS_BEST_SELLING}`)
  async searchProductsByBestSelling() {
    const logger = new Logger('ScraperService');
    logger.log('Scraping Started');
    const res: CreateProductAmazonDto[] = await searchProductsByBestSelling();
    if (!(res instanceof Array)) return res;
    res.forEach(async (product) => {
      await this.productService.createProductAmazon(product);
    });
    logger.log('Scraping Successfully');
    return res;
  }

  async changeUbication(ubication: string) {
    console.log(`SERVICE: ${ubication}`);

    const response = await changeUbication(ubication);
    if (response instanceof Object) return response;
    return { message: 'Successfully' };
  }
}
