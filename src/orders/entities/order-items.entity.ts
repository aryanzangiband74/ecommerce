import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity('order-items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @Column()
  quantity: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product)
  product: Product;
}
