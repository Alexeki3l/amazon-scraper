import { Injectable } from '@nestjs/common';
import {
  changeUbication,
  searchProductsByName,
  searchProductsByUrl,
  searchProductsByBestSelling,
} from './scraper';
import { ProductService } from 'src/product/product.service';
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class ScraperService {
  constructor(private readonly productService: ProductService) {}

  async searchProductsByName(name: string) {
    const products: CreateProductDto[] = await searchProductsByName(name);
    if (!(products instanceof Array)) return { products };
    products.forEach(async (product) => {
      await this.productService.create(product);
    });
    return products;
  }

  async searchProductsByUrl(url: string) {
    const res: any = await searchProductsByUrl(url);
    if (res === null) return { error: 'Ocurrio un error' };

    const product = new Product();
    Object.assign(product, res);

    await this.productService.create(product);
    console.log(product);
    return product;
  }

  async searchProductsByBestSelling() {
    const res: CreateProductDto[] = await searchProductsByBestSelling();
    if (!(res instanceof Array)) return res;
    res.forEach(async (product) => {
      await this.productService.create(product);
    });
    return res;
  }

  async changeUbication(ubication: string) {
    console.log(`SERVICE: ${ubication}`);

    const response = await changeUbication(ubication);
    if (response instanceof Object) return response;
    return { message: 'Successfully' };
  }
}
