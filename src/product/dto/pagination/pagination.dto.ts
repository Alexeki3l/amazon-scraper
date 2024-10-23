import { ApiProperty } from '@nestjs/swagger';

export enum EnumOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class paginationDefault {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty({ enum: EnumOrder })
  orderBy: EnumOrder;
}
