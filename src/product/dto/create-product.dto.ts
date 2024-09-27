import { ParseBoolPipe } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateProductDto {
  @PrimaryGeneratedColumn()
  id: number;

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
