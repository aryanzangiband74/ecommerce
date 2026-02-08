import { User } from 'src/users/entities/user.entity'
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  subject: string

  @Column()
  description: string

  @ManyToOne(
    () => User,
    (user) => user.tickets,
  )
  user: User

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @ManyToOne(
    () => Ticket,
    (ticket) => ticket.replies,
    { nullable: true },
  )
  replyTo: Ticket | null

  @OneToMany(
    () => Ticket,
    (ticket) => ticket.replyTo,
  )
  replies: Ticket[]
}
