import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import type * as express from 'express'
import { GetUser } from 'src/auth/decorators/get-user.decorator'
import { Roles } from 'src/auth/decorators/roles.decorator'
import UserRoleEnum from 'src/users/enums/userRoleEnum'
import type { CreateTicketDto } from './dto/create-ticket.dto'
import { TicketsService } from './tickets.service'
@ApiBearerAuth()
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  async create(@Res() res: express.Response, @GetUser('userId') userId: number, @Body() createTicketDto: CreateTicketDto) {
    const createdTicket = await this.ticketsService.create(createTicketDto, userId)

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.CREATED,
      data: createdTicket,
      message: 'user created',
    })
  }

  @Roles(UserRoleEnum.ADMIN)
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
