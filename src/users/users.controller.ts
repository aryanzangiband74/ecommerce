import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { plainToInstance } from 'class-transformer'
import type * as express from 'express'
import type { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import type UserRoleEnum from './enums/userRoleEnum'
import { UsersService } from './users.service'
@ApiBearerAuth()
@ApiTags('Users - user managment')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'create new user' })
  async create(@Res() res: express.Response, @Body() createUserDto: CreateUserDto) {
    const createdUSer = await this.usersService.create(createUserDto)

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.CREATED,
      data: createdUSer,
      message: 'user created',
    })
  }

  @Get()
  async findAll(
    @Res() res: express.Response,
    @Query('role') role?: UserRoleEnum,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    const user = await this.usersService.findAll(role, limit, page)

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: user,
      message: 'user found',
    })
  }

  @Get(':id')
  async findOne(@Res() res: express.Response, @Param('id') id: string) {
    const findedUser = await this.usersService.findOne(+id)
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: findedUser,
      message: 'user found',
    })
  }

  @Patch(':id')
  async update(@Res() res: express.Response, @Param('id') id: string, @Body() body: UpdateUserDto) {
    const formData = plainToInstance(UpdateUserDto, body, {
      excludeExtraneousValues: true,
    })

    await this.usersService.update(+id, formData)

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: null,
      message: 'user updated',
    })
  }

  @Delete(':id')
  async remove(@Res() res: express.Response, @Param('id') id: string) {
    await this.usersService.remove(+id)

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: null,
      message: 'user updated',
    })
  }
}
