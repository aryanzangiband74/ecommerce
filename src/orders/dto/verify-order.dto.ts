import { IsInt, IsNotEmpty } from 'class-validator'

export class VerifyOrderDto {
  @IsInt({ message: 'trackId باید یک عدد صحیح باشد' })
  @IsNotEmpty({ message: 'trackId نباید خالی باشد' })
  trackId: number

  @IsInt({ message: 'trackId باید یک عدد صحیح باشد' })
  @IsNotEmpty({ message: 'trackId نباید خالی باشد' })
  orderId: number
}
