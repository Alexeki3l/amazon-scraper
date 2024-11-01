import { Column, Entity } from 'typeorm';
import { ProductBase } from './product-base.entity';

@Entity({ name: 'product_shein' })
export class ProductShein extends ProductBase {
  @Column()
  price: string;

  @Column()
  us_price: string;

  @Column()
  us_origin_price: string;

  @Column('text', { array: true })
  imgs: string[];

  @Column()
  discount: string;
}
