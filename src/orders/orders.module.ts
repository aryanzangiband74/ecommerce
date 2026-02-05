import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-items.entity';
import { UsersModule } from 'src/users/users.module';
import { AddressModule } from 'src/address/address.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), UsersModule, AddressModule, ProductsModule],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
