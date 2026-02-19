import { IsInt, IsNotEmpty } from 'class-validator'

export class PaymentOrderDto {
  @IsInt({ message: 'orderId باید یک عدد صحیح باشد' })
  @IsNotEmpty({ message: 'orderId نباید خالی باشد' })
  orderId: number
}
