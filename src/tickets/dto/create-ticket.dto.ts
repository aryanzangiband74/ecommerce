import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'

export class CreateTicketDto {
  @IsNotEmpty({ message: 'کاربر نمی تواند خالی باشد' })
  userId: string

  @IsNotEmpty({ message: 'عنوان تیکت نمی تواند خالی باشد' })
  @IsString({ message: 'عنوان تیکت باید یک رشته باشد' })
  @MinLength(3, { message: 'عنوان تیکت باید حداقل 3 کاراکتر باشد' })
  title: string

  @IsNotEmpty({ message: 'موضوع تیکت نمی تواند خالی باشد' })
  @IsString({ message: 'موضوع تیکت باید یک رشته باشد' })
  subject: string

  @IsNotEmpty({ message: 'توضیحات تیکت نمی تواند خالی باشد' })
  @IsString({ message: 'توضیحات تیکت باید یک رشته باشد' })
  description: string

  @IsOptional()
  replyTo: number
}
