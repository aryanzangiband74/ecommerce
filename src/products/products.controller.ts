import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Res } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
// import { UpdateProductDto } from './dto/update-product.dto';
import type * as express from 'express'
import type { CreateBookmarkProductDto } from './dto/create-bookmark-product.dto'
import type { CreateProductDto } from './dto/create-product.dto'
import type { UpdateProductDto } from './dto/update-product.dto'
import { ProductsService } from './products.service'

@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Res() res: express.Response, @Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto)
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: product,
      message: 'product created',
    })
  }

  @Get()
  async findAll(@Res() res: express.Response) {
    const products = await this.productsService.findAll()
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: products,
      message: 'products found',
    })
  }

  @Get(':id')
  async findOne(@Res() res: express.Response, @Param('id') id: string) {
    const product = await this.productsService.findOne(+id)
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: product,
      message: 'product found',
    })
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Res() res: express.Response) {
    const product = await this.productsService.update(+id, updateProductDto)
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: product,
      message: 'product updated',
    })
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.productsService.remove(+id);
  // }

  @Post('bookmark-product')
  async toggleBookmark(@Res() res: express.Response, @Body() body: CreateBookmarkProductDto) {
    const { userId, productId } = body
    const bookmark = await this.productsService.toggleBookmark(userId, productId)
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: bookmark,
      message: 'Bookmark toggled',
    })
  }

  @Post('add-basket-item')
  async addBasketItem(@Res() res: express.Response, @Body() body: { userId: number; productId: number }) {
    const { userId, productId } = body
    const bookmark = await this.productsService.addItemToBasket(userId, productId)
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: bookmark,
      message: 'Item added to basket',
    })
  }

  @Post('remove-basket-item')
  async removeBasketItem(@Res() res: express.Response, @Body() body: { userId: number; productId: number }) {
    const { userId, productId } = body
    const bookmark = await this.productsService.removeItemFromBasket(userId, productId)
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: bookmark,
      message: 'Item removed from basket',
    })
  }
}
