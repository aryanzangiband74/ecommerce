import { IsInt } from 'class-validator';

export class CreateOrderItemDto {
  @IsInt({ message: 'productId باید یک عدد صحیح باشد' })
  productId: number;

  @IsInt({ message: 'quantity باید یک عدد صحیح باشد' })
  quantity: number;
}
