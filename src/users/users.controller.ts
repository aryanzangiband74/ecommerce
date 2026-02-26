import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { plainToInstance } from 'class-transformer'
import type * as express from 'express'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { Permissions } from './decorators/permissions.decorator'
import { AppendPermissionToRoleDto } from './dto/append-permission-to-role.dto'
import { AssignPermissionToUserDto } from './dto/assign-permission-to-user.dto'
import { AssignRoleToUser } from './dto/assignRoleToUser.dto'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { CreateRoleDto } from './dto/create-role.dto'
import type { CreateUserDto } from './dto/create-user.dto'
import { CreateUserResponseDto } from './dto/create-user-response.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserResponseDto } from './dto/user-response.dto'
import UserRoleEnum from './enums/userRoleEnum'
import { RolePermissionsService } from './role-permissions.service'
import { UsersService } from './users.service'
@ApiBearerAuth()
@ApiTags('Users - user managment')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolePermissionsService: RolePermissionsService,
  ) {}

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
  @ApiQuery({
    name: 'role',
    required: false,
  })
  @Roles(UserRoleEnum.ADMIN)
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
  @Permissions('read.user')
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

  @Get('getUserPermissions/:id')
  @ApiOperation({ summary: 'get permissions by user_id' })
  @ApiResponse({ status: 200, description: 'دسترسی ها با موفقیت دریافت شد' })
  async getUserPermissions(@Res() res: express.Response, @Param('id') id: string) {
    const user = await this.rolePermissionsService.getUserPermission(+id)
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: user,
      message: 'permissions found',
    })
  }

  @Post('create-role')
  @ApiOperation({ summary: 'create new Role' })
  @ApiResponse({ status: 201, description: 'create new role' })
  async createRoles(@Res() res: express.Response, @Body() createRole: CreateRoleDto) {
    const role = await this.rolePermissionsService.createRole(createRole.name)

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: role,
      message: 'role created',
    })
  }

  @Post('assign-role-to-user')
  @ApiOperation({ summary: 'assign Role to user' })
  @ApiResponse({ status: 201, description: 'create new role' })
  async assignRoleToUser(@Res() res: express.Response, @Body() assignRoleToUser: AssignRoleToUser) {
    const role = await this.rolePermissionsService.addRoleToUser(assignRoleToUser.userId, assignRoleToUser.roleId)

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: role,
      message: 'role assigend',
    })
  }
  @Post('retake-role-from-user')
  @ApiOperation({ summary: 'retake Role from user' })
  @ApiResponse({ status: 201, description: 'create new role' })
  async retakeRoleFromUser(@Res() res: express.Response, @Body() assignRoleToUser: AssignRoleToUser) {
    const role = await this.rolePermissionsService.retakeRoleFromUser(assignRoleToUser.userId, assignRoleToUser.roleId)

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: role,
      message: 'role retaked',
    })
  }

  @Get('get-user-roles/:userId')
  @ApiOperation({ summary: 'get user roles' })
  @ApiResponse({ status: 201, description: 'get user roles' })
  async getUserRoles(@Res() res: express.Response, @Param('userId') userId: number) {
    const role = await this.rolePermissionsService.getUserRoles(userId)

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: role,
      message: 'user roles',
    })
  }

  @Post('create-permision')
  @ApiOperation({ summary: 'create new permision' })
  @ApiResponse({ status: 201, description: 'create new permision' })
  async createPermission(@Res() res: express.Response, @Body() createPermission: CreatePermissionDto) {
    const permission = await this.rolePermissionsService.createPermissions(createPermission.name)

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: permission,
      message: 'permission created',
    })
  }

  @Post('append-permission-to-role')
  @ApiOperation({ summary: 'append-permission-to-role' })
  @ApiResponse({ status: 201, description: 'create new role' })
  async appendPermissionToRole(@Res() res: express.Response, @Body() appendPermissionToRoleDto: AppendPermissionToRoleDto) {
    const role = await this.rolePermissionsService.addPermissionToRole(
      appendPermissionToRoleDto.permissionId,
      appendPermissionToRoleDto.roleId,
    )

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: role,
      message: 'role assigend',
    })
  }

  @Post('assign-permission-to-user')
  @ApiOperation({ summary: 'assign-permission-to-user' })
  @ApiResponse({ status: 201, description: 'assign new permission to user' })
  async assignPermissionToUser(@Res() res: express.Response, @Body() assignPermissionToUserDto: AssignPermissionToUserDto) {
    const role = await this.rolePermissionsService.assignPermissionToUser(
      assignPermissionToUserDto.userId,
      assignPermissionToUserDto.permissionId,
    )

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: role,
      message: 'permission assigend',
    })
  }
}
