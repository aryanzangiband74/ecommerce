import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { AddressService } from 'src/address/address.service';
import { OrderStatusEnum } from './enums/order-status.enum';
import { OrderItem } from './entities/order-items.entity';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly userService: UsersService,
    private readonly addressService: AddressService,
    private readonly productService: ProductsService,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const user = await this.userService.findOne(createOrderDto.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const address = await this.addressService.findOne(createOrderDto.addressId);
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    const order = this.ordersRepository.create({
      user,
      address,
      total_price: createOrderDto.total_price,
      discount_code: createOrderDto.discountCode,
      status: createOrderDto.status || OrderStatusEnum.PENDING
    });

    const savedOrder = await this.ordersRepository.save(order);

    if (createOrderDto.orderItems && createOrderDto.orderItems.length > 0) {
      const orderItems = createOrderDto.orderItems.map(async (item) => {
        const product = await this.productService.findOne(item.productId);
        if (!product) {
          throw new NotFoundException(`Product with id ${item.productId} not found`);
        }
        const orderItem = this.orderItemsRepository.create({
          product,
          quantity: item.quantity,
          order: savedOrder
        });
        return this.orderItemsRepository.save(orderItem);
      });
      await Promise.all(orderItems);
    }
    return savedOrder;
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
