import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateBookmarkProductDto {
  @IsNotEmpty({ message: 'user_id الزامی است' })
  @IsInt({ message: 'user_id باید یک عدد صحیح باشد' })
  @IsPositive({ message: 'user_id باید یک عدد مثبت باشد' })
  userId: number;

  @IsNotEmpty({ message: 'product_id الزامی است' })
  @IsInt({ message: 'product_id باید یک عدد صحیح باشد' })
  @IsPositive({ message: 'product_id باید یک عدد مثبت باشد' })
  productId: number;
}
