import { ApiProperty } from '@nestjs/swagger'
import { UserResponseDto } from './user-response.dto'

export class CreateUserResponseDto {
  @ApiProperty({ example: 201, description: 'کد وضعیت HTTP' })
  statusCode: number

  @ApiProperty({ type: UserResponseDto, description: 'اطلاعات کاربر ایجاد شده' })
  data: UserResponseDto

  @ApiProperty({ example: 'user created', description: 'پیام پاسخ' })
  message: string
}
