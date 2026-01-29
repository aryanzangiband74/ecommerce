import { Controller, Get, Post, Body, Param, HttpStatus, Res, Query } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import * as express from 'express';
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  async create(@Res() res: express.Response, @Body() createTicketDto: CreateTicketDto) {
    const createdTicket = await this.ticketsService.create(createTicketDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.CREATED,
      data: createdTicket,
      message: 'user created'
    });
  }

  @Get()
  async findAll(@Res() res: express.Response, @Query('limit') limit?: number, @Query('page') page?: number) {
    const tickets = await this.ticketsService.findAll(limit, page);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.CREATED,
      data: tickets,
      message: 'user created'
    });
  }

  @Get(':id')
  async findOne(@Res() res: express.Response, @Param('id') id: string) {
    const ticket = await this.ticketsService.findOne(+id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.CREATED,
      data: ticket,
      message: 'user created'
    });
  }
}
