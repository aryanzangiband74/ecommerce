import { Injectable, UnauthorizedException } from '@nestjs/common'
import type { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import UserRoleEnum from 'src/users/enums/userRoleEnum'
import type { UsersService } from 'src/users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(name: string, mobile: string, password: string, display_name: string) {
    const hashedPass: string = await bcrypt.hash(password, 10)
    return this.userService.create({
      mobile,
      password: hashedPass,
      name,
      display_name,
      role: UserRoleEnum.NORMAL_USER,
    })
  }

  async login(mobile: string, password: string) {
    const user = await this.userService.findOneByMobile(mobile)
    if (!user) throw new UnauthorizedException('کاربری با این شماره موبایل یافت نشد')
    if (!(await bcrypt.compare(password, user.password))) throw new UnauthorizedException('رمز عبور اشتباه است')

    const payload = { mobile: user.mobile, sub: user.id, display_name: user.display_name }

    const token = this.jwtService.sign(payload)

    return {
      access_token: token,
    }
  }
}
