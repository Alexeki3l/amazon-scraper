import { ApiProperty } from '@nestjs/swagger';
import { Max, Min } from 'class-validator';

export class BestSellingDto {
  @Min(5)
  @Max(5)
  @ApiProperty()
  ubication: string;
}
