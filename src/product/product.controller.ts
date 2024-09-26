import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { /*ApiBearerAuth,*/ ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';

// @ApiBearerAuth()
@ApiTags('product')
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    // private readonly userService: UserService,
  ) {}
  @ApiOperation({
    summary: 'Crea un producto',
    description:
      'Esta ruta es totalmente de prueba ya que no esta validado que los datos que se envien pertenezcan a una ruta real de Amazon. Los datos que se envien seran guardados en BD.',
  })
  @Post()
  async create(@Body() dataProductDto: CreateProductDto) {
    /**Este controlador es solo de pruebas */
    return await this.productService.create(dataProductDto);
  }

  @ApiOperation({
    summary: 'Obtener todos los productos.',
    description: 'Retorna todos los productos.',
  })
  @Get()
  async findAll() {
    return await this.productService.findAllProduct();
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
