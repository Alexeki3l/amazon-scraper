import { Injectable } from '@nestjs/common';
import { scrapeProducts, searchProductsByName } from './scraper';

@Injectable()
export class ScraperService {
  async scrapeProducts(url: string) {
    return await scrapeProducts(url);
  }

  async searchProductsByName(name: string) {
    return await searchProductsByName(name);
  }
}
