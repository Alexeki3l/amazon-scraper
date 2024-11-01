import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateProductAmazonDto {
  @IsString()
  @ApiProperty()
  // @MinLength(15)
  price: string;

  @IsString()
  @ApiProperty()
  // @MinLength(15)
  img: string;

  @IsString()
  @ApiProperty()
  rating: string;
}
