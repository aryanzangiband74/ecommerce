import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class AppendPermissionToRoleDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: 'نقش معتبر نیست' })
  @IsNumber()
  roleId: number

  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: 'مجوز معتبر نیست' })
  @IsNumber()
  permissionId: number
}
