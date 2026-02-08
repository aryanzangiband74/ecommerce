import { Transform } from 'class-transformer'
import { IsNotEmpty, IsString, Length, Matches, MaxLength } from 'class-validator'

export class LoginDto {
  @IsString()
  @Length(11, 11, { message: 'شماره موبایل باید 11 رقم باشد' })
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @Matches(/^.{11}$/, { message: 'شماره موبایل باید 11 رقم باشد' })
  mobile: string

  @IsString({ message: 'نام باید یک رشته باشد' })
  @IsNotEmpty({ message: 'رمز عبور نباید خالی باشد' })
  // @MinLength(8, { message: 'رمز عبور باید حداقل 8 کاراکتر باشد' })
  @MaxLength(16)
  password: string
}
