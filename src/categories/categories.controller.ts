import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Res } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
// import { UpdateCategoryDto } from './dto/update-category.dto';
import type * as express from 'express'
import { CategoriesService } from './categories.service'
import type { CreateCategoryDto } from './dto/create-category.dto'
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Res() res: express.Response, @Body() createUserDto: CreateCategoryDto) {
    const createdUSer = await this.categoriesService.create(createUserDto)

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.CREATED,
      data: createdUSer,
      message: 'user created',
    })
  }

  @Get()
  async findAll(@Res() res: express.Response) {
    const categories = await this.categoriesService.findAll()

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: categories,
      message: 'addresses found',
    })
  }

  @Get(':id')
  async findOne(@Res() res: express.Response, @Param('id') id: string) {
    const category = await this.categoriesService.findOne(+id)
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: category,
      message: 'Category found',
    })
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
  //   return this.categoriesService.update(+id, updateCategoryDto);
  // }

  @Delete(':id')
  async remove(@Res() res: express.Response, @Param('id') id: string) {
    await this.categoriesService.remove(+id)
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Category removed successfully',
    })
  }

  @Delete('safeRemove/:id')
  async safeRemove(@Res() res: express.Response, @Param('id') id: string) {
    await this.categoriesService.safeRemove(+id)
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Category removed successfully',
    })
  }

  @Delete('hardRemove/:id')
  async hardRemove(@Res() res: express.Response, @Param('id') id: string) {
    await this.categoriesService.hardRemove(+id)
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Category removed successfully',
    })
  }
}
