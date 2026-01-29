import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(User)
    private readonly userService: UsersService
  ) {}
  async create(CreateTicketDto: CreateTicketDto): Promise<Ticket> {
    const { userId, replyTo, ...formData } = CreateTicketDto;
    const user = await this.userService.findOne(+userId);
    const replyTicket = replyTo ? await this.ticketRepository.findOneByOrFail({ id: replyTo }) : null;
    const ticket = this.ticketRepository.create({
      user,
      replyTo: replyTicket,
      ...formData
    });
    return this.ticketRepository.save(ticket);
  }
}
