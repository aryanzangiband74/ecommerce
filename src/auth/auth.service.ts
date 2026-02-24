import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import UserRoleEnum from 'src/users/enums/userRoleEnum'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
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

    const payload = { mobile: user.mobile, sub: user.id, display_name: user.display_name, role: user.role }

    const token = this.jwtService.sign(payload)

    return {
      access_token: token,
    }
  }
}
