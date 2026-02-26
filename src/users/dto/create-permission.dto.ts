import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { ArrayNotEmpty, ArrayUnique, IsArray, IsString, MinLength } from 'class-validator'

export class CreatePermissionDto {
  @ApiProperty({ example: ['user.read', 'user.create'] })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value])) // supports single string too
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  name: string[]
}
