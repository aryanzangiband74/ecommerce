import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';
import UserRoleEnum from '../enums/userRoleEnum';
import { Transform } from 'class-transformer';

export class CreateUserDto {
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
  display_name: string;

  @IsString({ message: 'نام باید یک رشته باشد' })
  @IsOptional()
  @MinLength(8, { message: 'رمز عبور باید حداقل 8 کاراکتر باشد' })
  password: string;

  @IsEnum(UserRoleEnum)
  @IsOptional()
  role: UserRoleEnum;
}
