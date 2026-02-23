import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { plainToInstance } from 'class-transformer'
import type * as express from 'express'
import type { CreateUserDto } from './dto/create-user.dto'
import { CreateUserResponseDto } from './dto/create-user-response.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import type UserRoleEnum from './enums/userRoleEnum'
import { UsersService } from './users.service'
import { UserResponseDto } from './dto/user-response.dto'
@ApiBearerAuth()
@ApiTags('Users - user managment')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'create new user' })
  @ApiResponse({ status: 201, description: 'کاربر با موفقیت ایجاد شد', type: CreateUserResponseDto })
  async create(@Res() res: express.Response, @Body() createUserDto: CreateUserDto) {
    const createdUSer = await this.usersService.create(createUserDto)

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: createdUSer,
      message: 'user created',
    })
  }

  @Get()
  @ApiOperation({ summary: 'get all users' })
  @ApiResponse({ status: 200, description: 'کاربران با موفقیت دریافت شدند', type: [UserResponseDto] })
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
  @ApiOperation({ summary: 'get user by id' })
  @ApiResponse({ status: 200, description: 'کاربر با موفقیت دریافت شد', type: UserResponseDto })
  async findOne(@Res() res: express.Response, @Param('id') id: string) {
    const findedUser = await this.usersService.findOne(+id)
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: findedUser,
      message: 'user found',
    })
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update user by id' })
  @ApiResponse({ status: 200, description: 'کاربر با موفقیت به روز شد' })
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
  @ApiOperation({ summary: 'delete user by id' })
  @ApiResponse({ status: 200, description: 'کاربر با موفقیت حذف شد' })
  async remove(@Res() res: express.Response, @Param('id') id: string) {
    await this.usersService.remove(+id)

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: null,
      message: 'user updated',
    })
  }
}
