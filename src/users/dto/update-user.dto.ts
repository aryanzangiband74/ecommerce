import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import UserRoleEnum from '../enums/userRoleEnum';
export class UpdateUserDto {
  @IsString({ message: 'نام نمایشی باید یک رشته باشد' })
  @Expose()
  @MinLength(3)
  @IsOptional()
  display_name: string;

  @IsEnum(UserRoleEnum)
  @Expose()
  @IsOptional()
  role: UserRoleEnum;
}
