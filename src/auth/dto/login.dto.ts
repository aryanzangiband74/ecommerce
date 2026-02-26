import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsString, Length, Matches, MaxLength } from 'class-validator'

export class LoginDto {
  @ApiProperty({ example: '09304263290' })
  @IsString()
  @Length(11, 11, { message: 'شماره موبایل باید 11 رقم باشد' })
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @Matches(/^.{11}$/, { message: 'شماره موبایل باید 11 رقم باشد' })
  mobile: string

  @IsString({ message: 'نام باید یک رشته باشد' })
  @ApiProperty({ example: '12345678' })
  @IsNotEmpty({ message: 'رمز عبور نباید خالی باشد' })
  // @MinLength(8, { message: 'رمز عبور باید حداقل 8 کاراکتر باشد' })
  @MaxLength(16)
  password: string
}
export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzE0MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  access_token: string
}
