import { ApiProperty } from '@nestjs/swagger';

export class SearchProductsDto {
  @ApiProperty()
  best_selling: boolean;
}
