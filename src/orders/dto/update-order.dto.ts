import { Type } from 'class-transformer'
import { IsArray, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator'
import { CreateOrderItemDto } from './create-order-items.dto'

export class UpdateOrderDto {
  @IsInt({ message: 'addressId باید یک عدد صحیح باشد' })
  @IsOptional()
  addressId?: number

  @IsString({ message: 'discountCode باید یک عدد صحیح باشد' })
  @IsOptional()
  discountCode?: string

  @IsArray({ message: 'orderItems باید یک آرایه باشد' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[]
}
