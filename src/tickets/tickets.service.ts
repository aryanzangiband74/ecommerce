import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { createPaginatedResult, getPaginationParams } from 'src/common'
import type { PaginationOptions } from 'src/common'
import { UsersService } from 'src/users/users.service'
import type { Repository } from 'typeorm'
import type { CreateTicketDto } from './dto/create-ticket.dto'
import { Ticket } from './entities/ticket.entity'

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}
  async create(CreateTicketDto: CreateTicketDto, userId: number): Promise<Ticket> {
    const { replyTo, ...formData } = CreateTicketDto
    const user = await this.userService.findOne(+userId)
    const replyTicket = replyTo ? await this.ticketRepository.findOne({ where: { id: replyTo }, relations: ['replyTo'] }) : null
    if (replyTicket?.replyTo) throw new BadRequestException('شما نمیتوانید این تیکت ریپلای کنید')
    const ticket = this.ticketRepository.create({
      user,
      replyTo: replyTicket,
      ...formData,
    })
    return this.ticketRepository.save(ticket)
  }

  private readonly ticketSortFields = ['created_at', 'updated_at', 'title', 'id'] as const

  async findAll(options: PaginationOptions = {}) {
    const params = getPaginationParams(options, [...this.ticketSortFields])
    const [data, total] = await this.ticketRepository
      .createQueryBuilder('tickets')
      .where('tickets.replyToId IS NULL')
      .orderBy(`tickets.${params.sortBy}`, params.sortOrder)
      .skip(params.skip)
      .take(params.take)
      .getManyAndCount()
    return createPaginatedResult(data, total, params)
  }

  async findOne(id: number) {
    const ticket = await this.ticketRepository.findOneOrFail({ where: { id }, relations: ['replies', 'user'] })
    return ticket
  }
}
