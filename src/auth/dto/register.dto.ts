import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'نام کاربر معتبر نیست' })
  @IsString({ message: 'نام کاربر معتبر نیست' })
  @MinLength(3, { message: 'نام کاربر حداقل 3 کارکتر باشد' })
  name: string;

  @IsString()
  @Length(11, 11, { message: 'شماره موبایل باید 11 رقم باشد' })
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @Matches(/^.{11}$/, { message: 'شماره موبایل باید 11 رقم باشد' })
  mobile: string;

  @IsString({ message: 'نام باید یک رشته باشد' })
  @IsNotEmpty({ message: 'رمز عبور نباید خالی باشد' })
  @MinLength(8, { message: 'رمز عبور باید حداقل 8 کاراکتر باشد' })
  @MaxLength(16)
  password: string;

  @IsString({ message: 'نام نمایشی باید یک رشته باشد' })
  @IsNotEmpty({ message: 'نام نمایشی نباید خالی باشد' })
  display_name: string;
}
