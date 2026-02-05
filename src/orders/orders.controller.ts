import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import * as express from 'express';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Res() res: express.Response, @Body() createOrderDto: CreateOrderDto) {
    const order = await this.ordersService.create(createOrderDto);
    return res.status(201).json({
      statusCode: 201,
      data: order,
      message: 'order created'
    });
  }

  @Get()
  async findAll(@Res() res: express.Response) {
    const orders = await this.ordersService.findAll();

    return res.status(200).json({
      statusCode: 200,
      data: orders,
      message: 'orders found'
    });
  }

  @Get(':id')
  async findOne(@Res() res: express.Response, @Param('id') id: string) {
    const order = await this.ordersService.findOne(+id);
    return res.status(200).json({
      statusCode: 200,
      data: order,
      message: 'order found'
    });
  }

  @Patch(':id')
  async update(@Res() res: express.Response, @Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    const updatedOrder = await this.ordersService.update(+id, updateOrderDto);
    return res.status(200).json({
      statusCode: 200,
      data: updatedOrder,
      message: 'order updated'
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
