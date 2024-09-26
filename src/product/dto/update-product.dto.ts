import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateProductDto {
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
