import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(dataProductDto: CreateProductDto) {
    const newProduct = new Product();
    const product = await this.findOneProductByName(dataProductDto.name);
    if (!product) {
      Object.assign(newProduct, dataProductDto);
      await this.productRepository.save(newProduct);
    } else {
      const updateNow: UpdateProductDto = {
        price: dataProductDto.price,
        img: dataProductDto.img,
        rating: dataProductDto.rating,
      };
      await this.update(product.id, updateNow);
    }
    return newProduct;
  }

  async findAllProduct(): Promise<Product[]> {
    const products = await this.productRepository.find();
    return products;
  }

  async findAllProductBestSelling(): Promise<Product[]> {
    const products = await this.productRepository.find();
    return products;
  }

  async findOneProductById(id: number): Promise<Product> {
    return await this.productRepository.findOne({ where: { id } });
  }

  async findOneProductByName(name: string): Promise<Product> {
    return (await this.productRepository.findOne({ where: { name } })) && null;
  }

  async findAllProductByBestSelling(): Promise<Product[]> {
    return await this.productRepository.findBy({ best_selling: true });
  }

  async deleteProduct(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }

  async update(id: number, updateUserDto: UpdateProductDto): Promise<Product> {
    await this.productRepository.update(id, updateUserDto);
    return await this.productRepository.findOne({ where: { id } }); // Devuelve el usuario actualizado
  }
}
