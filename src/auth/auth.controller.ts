import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as express from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Res() res: express.Response, @Body() registerDto: RegisterDto) {
    const register = await this.authService.register(registerDto.name, registerDto.mobile, registerDto.password, registerDto.display_name);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: register,
      message: 'ثبت نام با موفقیت انجام شد'
    });
  }

  @Post('login')
  async login(@Res() res: express.Response, @Body() body: LoginDto) {
    const login = await this.authService.login(body.mobile, body.password);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: login,
      message: 'ورود با موفقیت انجام شد'
    });
  }
}
