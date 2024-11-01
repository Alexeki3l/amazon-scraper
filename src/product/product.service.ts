import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductAmazon } from './entities/product-amazon.entity';
import { Repository } from 'typeorm';
import { UpdateProductAmazonDto } from './dto/amazon/update-amazon-product.dto';
import { CreateProductAmazonDto } from './dto/amazon/create-amazon-product.dto';
import { SearchProductsDto } from './dto/amazon/search-amazon-product.dto';
import { paginationDefault } from './dto/pagination/pagination.dto';
import { PageMetaDto } from './dto/pagination/page-meta.dto';
import { ProductShein } from './entities/product-shein.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductAmazon)
    private productAmazonRepository: Repository<ProductAmazon>,
    @InjectRepository(ProductShein)
    private productSheinRepository: Repository<ProductShein>,
  ) {}

  /** -------- Amazon Product Options Begin Here -------------- */
  async createProductAmazon(dataProductDto: CreateProductAmazonDto) {
    const newProduct = new ProductAmazon();
    const product = await this.findOneProductAmazonByName(dataProductDto.name);
    if (!product) {
      Object.assign(newProduct, dataProductDto);
      await this.productAmazonRepository.save(newProduct);
    } else {
      const updateNow: UpdateProductAmazonDto = {
        price: dataProductDto.price,
        img: dataProductDto.img,
        rating: dataProductDto.rating,
      };
      await this.updateProductAmazon(product.id, updateNow);
    }
    return newProduct;
  }

  async findAllProductAmazon(
    searchProducts: SearchProductsDto,
    pagination: paginationDefault,
  ): Promise<{ data: ProductAmazon[]; pagination: PageMetaDto }> {
    const data = await this.productAmazonRepository.find({
      where: { best_selling: searchProducts.best_selling },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
      order: { updated_at: pagination.orderBy },
    });

    const newPagination = new PageMetaDto({
      page: pagination.page,
      limit: pagination.limit,
      itemCount: data.length,
    });

    return { data: data, pagination: newPagination };
  }

  // async findAllProductBestSelling(): Promise<ProductAmazon[]> {
  //   const products = await this.productAmazonRepository.find();
  //   return products;
  // }

  async findOneProductAmazonById(id: string): Promise<ProductAmazon> {
    return await this.productAmazonRepository.findOne({ where: { id } });
  }

  async findOneProductAmazonByName(name: string): Promise<ProductAmazon> {
    return (
      (await this.productAmazonRepository.findOne({ where: { name } })) && null
    );
  }

  async findAllProductAmazonByBestSelling(
    best_selling: boolean,
  ): Promise<ProductAmazon[]> {
    return await this.productAmazonRepository.findBy({ best_selling });
  }

  async deleteProductAmazon(id: number): Promise<void> {
    await this.productAmazonRepository.delete(id);
  }

  async updateProductAmazon(
    id: string,
    updateUserDto: UpdateProductAmazonDto,
  ): Promise<ProductAmazon> {
    await this.productAmazonRepository.update(id, updateUserDto);
    return await this.productAmazonRepository.findOne({ where: { id } }); // Devuelve el usuario actualizado
  }

  /** -------- Amazon Product Options End Here -------------- */

  /** -------- Shein Product Options Begin Here -------------- */
  /** -------- Shein Product Options End Here -------------- */
}
