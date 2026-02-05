import { IsArray, IsEnum, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { OrderStatusEnum } from '../enums/order-status.enum';
import { CreateOrderItemDto } from './create-order-items.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsInt({ message: 'userId باید یک عدد صحیح باشد' })
  userId: number;

  @IsInt({ message: 'addressId باید یک عدد صحیح باشد' })
  addressId: number;

  @IsString({ message: 'discountCode باید یک رشته باشد' })
  @IsOptional()
  discountCode: string;

  @IsEnum(OrderStatusEnum, { message: 'وضعیت سفارش نامعتبر است' })
  status: OrderStatusEnum;

  @IsInt({ message: 'total_price باید یک عدد صحیح باشد' })
  total_price: number;

  @IsArray({ message: 'orderItems باید یک آرایه باشد' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];
}
