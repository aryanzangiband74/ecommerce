import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import type * as express from 'express'
import { AuthService } from './auth.service'
import { Public } from './decorators/public.decorator'
import { LoginDto, LoginResponseDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@ApiTags('Auth - user authentication')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'register a new user' })
  @ApiResponse({ status: 200, description: 'user registered successfully' })
  @Post('register')
  async register(@Res() res: express.Response, @Body() registerDto: RegisterDto) {
    const register = await this.authService.register(registerDto.name, registerDto.mobile, registerDto.password, registerDto.display_name)
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: register,
      message: 'ثبت نام با موفقیت انجام شد',
    })
  }

  @ApiOperation({ summary: 'login a users' })
  @ApiResponse({ status: 200, description: 'user logged in successfully', type: LoginResponseDto })
  @Post('login')
  async login(@Res() res: express.Response, @Body() body: LoginDto) {
    const login = await this.authService.login(body.mobile, body.password)
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: login,
      message: 'ورود با موفقیت انجام شد',
    })
  }
}
