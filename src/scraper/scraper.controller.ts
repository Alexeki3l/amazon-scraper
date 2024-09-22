import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Get()
  async searchProducts(@Query('nameProduct') nameProduct: string) {
    if (!nameProduct)
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'El nombre del producto esta vacio',
      };
    const response =
      await this.scraperService.searchProductsByName(nameProduct);
    if (response instanceof Array) {
      return { response };
    } else {
      return {
        status: HttpStatus.BAD_REQUEST,
        response,
      };
    }
  }
}
