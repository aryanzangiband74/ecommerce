import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  privince: string;

  @Column({ nullable: false })
  city: string;

  @Column()
  address: string;

  @Column({ unique: true, length: 10 })
  postal_code: string;

  @Column({ length: 11 })
  reciver_mobile: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
