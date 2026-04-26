import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import type * as express from 'express'
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor'
import { Permissions } from 'src/users/decorators/permissions.decorator'
import { AddressService } from './address.service'
import type { CreateAddressDto } from './dto/create-address.dto'
import type { UpdateAddressDto } from './dto/update-address.dto'

@ApiBearerAuth()
@UseInterceptors(LoggingInterceptor)
@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async create(@Res() res: express.Response, @Body() createAddressDto: CreateAddressDto, @Body('userId') userId: number) {
    const createdAddress = await this.addressService.create(createAddressDto, userId)

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.CREATED,
      data: createdAddress,
      message: 'address created',
    })
  }

  @Get()
  async findAll(@Res() res: express.Response, @Query('limit') limit?: number, @Query('page') page?: number) {
    const addresses = await this.addressService.findAll(limit, page)

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: addresses,
      message: 'addresses found',
    })
  }

  @Get(':id')
  async findOne(@Res() res: express.Response, @Param('id') id: string) {
    const address = await this.addressService.findOne(+id)
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: address,
      message: 'address found',
    })
  }

  @Patch(':id')
  async update(@Res() res: express.Response, @Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    await this.addressService.update(+id, updateAddressDto)
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: null,
      message: 'address updated',
    })
  }

  @Permissions('address:delete:own')
  @Delete(':id')
  async remove(@Res() res: express.Response, @Param('id') id: string) {
    await this.addressService.remove(+id)
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: null,
      message: 'address removed',
    })
  }
}
