import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export class CreateAddressDto {
  @IsNotEmpty({ message: 'استان نمی تواند خالی باشد' })
  @IsString({ message: 'استان باید یک رشته باشد' })
  privince: string

  @IsNotEmpty({ message: 'شهر نمی تواند خالی باشد' })
  @IsString({ message: 'شهر باید یک رشته باشد' })
  city: string

  @IsString({ message: 'آدرس باید یک رشته باشد' })
  address: string

  @IsNotEmpty({ message: 'کد پستی نمی تواند خالی باشد' })
  @IsString({ message: 'کد پستی باید یک رشته باشد' })
  @Length(10, 10, { message: 'کد پستی باید دقیقا 10 رقم باشد' })
  postal_code: string

  @IsNotEmpty({ message: 'شماره موبایل گیرنده نمی تواند خالی باشد' })
  @IsString({ message: 'شماره موبایل گیرنده باید یک رشته باشد' })
  @Length(11, 11, { message: 'شماره موبایل گیرنده باید دقیقا 11 رقم باشد' })
  reciver_mobile: string

  @IsOptional()
  @IsString({ message: 'توضیحات باید یک رشته باشد' })
  description: string
}
