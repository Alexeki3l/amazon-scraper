import { ApiProperty } from '@nestjs/swagger';

// export class PaginationDto {
//   @ApiProperty()
//   page: number;

//   @ApiProperty()
//   limit: number;

//   @ApiProperty()
//   itemCount: number;
// }

export class paginationDefault {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}
