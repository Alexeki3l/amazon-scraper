import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('scraper')
@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @ApiOperation({
    summary: 'Busca producto en amazon basado en un nombre',
    description:
      'Busca productos en Amazon basado en un nombre y lo guarda en base de datos.',
  })
  @Get('by_name')
  async searchProductsByName(@Query('nameProduct') nameProduct: string) {
    if (!nameProduct)
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'missing name product.',
      };
    const response =
      await this.scraperService.searchProductsByName(nameProduct);
    if (response instanceof Array) {
      return { status: HttpStatus.OK, message: 'operation successfully' };
    } else {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'error',
      };
    }
  }

  @ApiOperation({
    summary: 'Busca producto en amazon basado en su URL',
    description:
      'Busca un producto en Amazon basado en su URL y lo guarda/actualiza en base de datos.',
  })
  @Get('by_url')
  async searchProductsByUrl(@Query('url') url: string) {
    if (!url)
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'missing url of product.',
      };
    const response = await this.scraperService.searchProductsByUrl(url);
    if (response instanceof Array) {
      return { status: HttpStatus.OK, message: 'operation successfully' };
    } else {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'error',
      };
    }
  }

  // @Get('best_selling')
  // async searchProductsByBestSelling() {
  //   const res = await this.scraperService.searchProductsByBestSelling();
  //   if (res) return { status: HttpStatus.OK };
  //   return { status: HttpStatus.BAD_REQUEST };
  // }
}
