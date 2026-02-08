import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res } from '@nestjs/common'
import type * as express from 'express'
import type { CreateTicketDto } from './dto/create-ticket.dto'
import type { TicketsService } from './tickets.service'
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  async create(@Res() res: express.Response, @Body() createTicketDto: CreateTicketDto) {
    const createdTicket = await this.ticketsService.create(createTicketDto)

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.CREATED,
      data: createdTicket,
      message: 'user created',
    })
  }

  @Get()
  async findAll(@Res() res: express.Response, @Query('limit') limit?: number, @Query('page') page?: number) {
    const tickets = await this.ticketsService.findAll(limit, page)
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.CREATED,
      data: tickets,
      message: 'user created',
    })
  }

  @Get(':id')
  async findOne(@Res() res: express.Response, @Param('id') id: string) {
    const ticket = await this.ticketsService.findOne(+id)

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.CREATED,
      data: ticket,
      message: 'user created',
    })
  }
}
