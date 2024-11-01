import { CreateProductSheinDto } from 'src/product/dto/shein/create-shein-product.dto';

export class CategoryDataDto {
  name: string;
  subCategories: SubCategoryDataDto[];
}

export class SubCategoryDataDto {
  name: string;
  products: CreateProductSheinDto[];
}

export class ResultsDto {
  categories: CategoryDataDto[];
}
