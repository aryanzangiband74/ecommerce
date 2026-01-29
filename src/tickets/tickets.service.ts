import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private readonly userService: UsersService
  ) {}
  async create(CreateTicketDto: CreateTicketDto): Promise<Ticket> {
    const { userId, replyTo, ...formData } = CreateTicketDto;
    const user = await this.userService.findOne(+userId);
    const replyTicket = replyTo ? await this.ticketRepository.findOne({ where: { id: replyTo }, relations: ['replyTo'] }) : null;
    if (replyTicket?.replyTo) throw new BadRequestException('شما نمیتوانید این تیکت ریپلای کنید');
    const ticket = this.ticketRepository.create({
      user,
      replyTo: replyTicket,
      ...formData
    });
    return this.ticketRepository.save(ticket);
  }

  async findAll(limit: number = 10, page: number = 1) {
    const query = this.ticketRepository.createQueryBuilder('tickets');
    query.where('tickets.replyToId IS NULL');

    query.skip((page - 1) * limit).take(limit);
    return await query.getMany();
  }

  async findOne(id: number) {
    const ticket = await this.ticketRepository.findOneOrFail({ where: { id }, relations: ['replies', 'user'] });
    return ticket;
  }
}
