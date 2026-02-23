import { ApiProperty } from '@nestjs/swagger'
import UserRoleEnum from '../enums/userRoleEnum'

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number

  @ApiProperty({ example: 'علی محمدی' })
  name: string

  @ApiProperty({ example: '09123456789' })
  mobile: string

  @ApiProperty({ example: 'علی' })
  display_name: string

  @ApiProperty({ enum: UserRoleEnum, example: UserRoleEnum.NORMAL_USER })
  role: UserRoleEnum


}
