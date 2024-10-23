import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwtAuthGuard';
import { SearchProductsDto } from './dto/search-product.dto';
import { paginationDefault } from './dto/pagination/pagination.dto';

// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    // private readonly userService: UserService,
  ) {}

  @ApiOperation({
    summary: 'Obtener todos los productos.',
    description: 'Retorna todos los productos.',
  })
  @Get()
  async findAll(
    @Query() searchProducts: SearchProductsDto,
    @Query() pagination: paginationDefault,
  ) {
    return await this.productService.findAllProduct(searchProducts, pagination);
  }

  // @ApiOperation({
  //   summary: 'Obtener todos los productos.',
  //   description:
  //     'Retorna todos los productos que esten relacionados con los usuario que coincida con el id proporcionado.',
  // })
  // @Get('for_user/:id')
  // findAllByUser(@Param('id') id: number) {
  //   return this.productService.findAllByUserId(id);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.productService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return this.productService.update(+id, updateProductDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.productService.remove(+id);
  // }
}
