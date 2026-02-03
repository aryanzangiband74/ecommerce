import { User } from 'src/users/entities/user.entity';
import { Product } from './product.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';

@Entity('products_bookmarks')
@Unique(['user_id', 'product_id'])
export class BookmarkProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: false })
  user_id: number;

  @Column({ name: 'product_id', nullable: false })
  product_id: number;

  @ManyToOne(() => User, (user) => user.bookmarks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
