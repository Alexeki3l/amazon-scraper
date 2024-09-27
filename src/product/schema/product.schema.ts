import { EntitySchema } from 'typeorm';
import { Product } from '../entities/product.entity';

export const ProductSchema = new EntitySchema<Product>({
  name: 'Product',
  target: Product,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
    },
    price: {
      type: String,
    },
    img: {
      type: String,
    },
    rating: {
      type: String,
    },
    url: {
      type: String,
    },
    best_selling: {
      type: Boolean,
    },
    category: {
      type: String,
    },
  },
});
