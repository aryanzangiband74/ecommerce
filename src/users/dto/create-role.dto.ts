import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class CreateRoleDto {
  @ApiProperty({ example: 'admin' })
  @IsNotEmpty({ message: 'نام نقش معتبر نیست' })
  @IsString({ message: 'نام نقش معتبر نیست' })
  @MinLength(3, { message: 'نام نقش حداقل 3 کارکتر باشد' })
  name: string
}
