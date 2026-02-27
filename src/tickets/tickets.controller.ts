import { Body, Controller, Get, HttpStatus, Param, Post, Query } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { ApiResponse } from 'src/common'
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
  async create(@GetUser('userId') userId: number, @Body() createTicketDto: CreateTicketDto) {
    const createdTicket = await this.ticketsService.create(createTicketDto, userId)
    return new ApiResponse(createdTicket, 'Ticket created', HttpStatus.CREATED)
  }

  @Roles(UserRoleEnum.ADMIN)
  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    const result = await this.ticketsService.findAll({ page, limit, sortBy, sortOrder })
    return new ApiResponse(result, 'Tickets fetched', HttpStatus.OK)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const ticket = await this.ticketsService.findOne(+id)
    return new ApiResponse(ticket, 'Ticket found', HttpStatus.OK)
  }
}
