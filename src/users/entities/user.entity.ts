import { Address } from 'src/address/entities/address.entity'
import { Order } from 'src/orders/entities/order.entity'
import { Product } from 'src/products/entities/product.entity'
import { BookmarkProduct } from 'src/products/entities/product-bookmark.entity'
import { Ticket } from 'src/tickets/entities/ticket.entity'
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import UserRoleEnum from '../enums/userRoleEnum'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ unique: true })
  mobile: string

  @Column({ nullable: false })
  display_name: string

  @Column({ nullable: true })
  password: string

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.NORMAL_USER,
  })
  role: UserRoleEnum

  @OneToMany(
    () => Address,
    (address) => address.user,
  )
  addresses: Address[]

  @OneToMany(
    () => BookmarkProduct,
    (bookmark) => bookmark.user,
  )
  bookmarks: BookmarkProduct[]

  @OneToMany(
    () => Ticket,
    (ticket) => ticket.user,
  )
  tickets: Ticket[]

  @OneToMany(
    () => Order,
    (order) => order.user,
  )
  orders: Order[]

  @ManyToMany(
    () => Product,
    (product) => product.basket,
  )
  @JoinTable({
    name: 'basket_items',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
  })
  basketItems: Product[]

  @CreateDateColumn()
  created_at: Date
  @UpdateDateColumn()
  updated_at: Date
}
