import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductSheinDto {
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
  us_price: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  // @MinLength(15)
  us_origin_price: string;

  @IsString({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  @ApiProperty()
  imgs: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  url: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  category: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  discount: string;
}

export type CreateProductOmitIdDto = Omit<CreateProductSheinDto, 'id'>;
