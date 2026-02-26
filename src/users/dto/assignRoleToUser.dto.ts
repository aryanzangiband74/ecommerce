import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class AssignRoleToUser {
  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: 'نقش معتبر نیست' })
  @IsNumber()
  roleId: number

  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: 'کاربر معتبر نیست' })
  @IsNumber()
  userId: number
}
