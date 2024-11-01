import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductAmazonDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  // @MinLength(3)
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  // @MinLength(15)
  price: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  // @MinLength(15)
  img: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  rating: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  url: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  best_selling?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty()
  category: string;
}

export type CreateProductOmitIdDto = Omit<CreateProductAmazonDto, 'id'>;
