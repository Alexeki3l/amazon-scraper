import { Entity, Column } from 'typeorm';
import { ProductBase } from './product-base.entity';

@Entity({ name: 'product_amazon' })
export class ProductAmazon extends ProductBase {
  @Column()
  price: string;

  @Column()
  img: string;

  @Column()
  rating: string;

  @Column({ default: false })
  best_selling: boolean;
}
