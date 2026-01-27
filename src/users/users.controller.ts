import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as express from 'express';
import UserRoleEnum from './enums/userRoleEnum';
import { plainToInstance } from 'class-transformer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Res() res: express.Response, @Body() createUserDto: CreateUserDto) {
    const createdUSer = await this.usersService.create(createUserDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.CREATED,
      data: createdUSer,
      message: 'user created'
    });
  }

  @Get()
  async findAll(
    @Res() res: express.Response,
    @Query('role') role?: UserRoleEnum,
    @Query('limit') limit?: number,
    @Query('page') page?: number
  ) {
    const user = await this.usersService.findAll(role, limit, page);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: user,
      message: 'user found'
    });
  }

  @Get(':id')
  async findOne(@Res() res: express.Response, @Param('id') id: string) {
    const findedUser = await this.usersService.findOne(+id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: findedUser,
      message: 'user found'
    });
  }

  @Patch(':id')
  async update(@Res() res: express.Response, @Param('id') id: string, @Body() body: UpdateUserDto) {
    const formData = plainToInstance(UpdateUserDto, body, {
      excludeExtraneousValues: true
    });

    await this.usersService.update(+id, formData);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: null,
      message: 'user updated'
    });
    return;
  }

  @Delete(':id')
  async remove(@Res() res: express.Response, @Param('id') id: string) {
    await this.usersService.remove(+id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: null,
      message: 'user updated'
    });
  }
}
