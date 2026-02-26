import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class AssignPermissionToUserDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: 'نقش معتبر نیست' })
  @IsNumber()
  permissionId: number

  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: 'کاربر معتبر نیست' })
  @IsNumber()
  userId: number
}
