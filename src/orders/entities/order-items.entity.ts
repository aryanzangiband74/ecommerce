import { Product } from 'src/products/entities/product.entity'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Order } from './order.entity'

@Entity('order-items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  quantity: number

  @ManyToOne(
    () => Order,
    (order) => order.orderItems,
  )
  @JoinColumn({ name: 'order_id' })
  order: Order

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product
}
