import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AddressModule } from 'src/address/address.module'
import { ProductsModule } from 'src/products/products.module'
import { UsersModule } from 'src/users/users.module'
import { Order } from './entities/order.entity'
import { OrderItem } from './entities/order-items.entity'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), UsersModule, AddressModule, ProductsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
