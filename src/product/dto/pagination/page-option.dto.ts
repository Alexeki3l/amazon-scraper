import { ApiProperty } from '@nestjs/swagger';

export class PageOptionDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}
