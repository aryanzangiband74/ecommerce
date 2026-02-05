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
      total_amount: createOrderDto.total_amount,
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

  async findAll() {
    return await this.ordersRepository.find({ relations: ['user', 'address', 'orderItems', 'orderItems.product'] });
  }

  async findOne(id: number) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user', 'address', 'orderItems', 'orderItems.product']
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user', 'address', 'orderItems', 'orderItems.product']
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (updateOrderDto.addressId !== undefined) {
      const address = await this.addressService.findOne(updateOrderDto.addressId);
      if (!address) throw new NotFoundException('Address not found');
      order.address = address;
    }

    if (updateOrderDto.discountCode !== undefined) {
      order.discount_code = updateOrderDto.discountCode;
    }

    // Handle orderItems replacement if provided
    if (updateOrderDto.orderItems !== undefined) {
      // delete existing items for this order
      await this.orderItemsRepository.createQueryBuilder().delete().from('order-items').where('order_id = :id', { id: order.id }).execute();

      if (updateOrderDto.orderItems && updateOrderDto.orderItems.length > 0) {
        const createdItems = updateOrderDto.orderItems.map(async (item) => {
          const product = await this.productService.findOne(item.productId);
          if (!product) {
            throw new NotFoundException(`Product with id ${item.productId} not found`);
          }
          const orderItem = this.orderItemsRepository.create({
            product,
            quantity: item.quantity,
            order
          });
          return this.orderItemsRepository.save(orderItem);
        });
        await Promise.all(createdItems);
      }
    }

    await this.ordersRepository.save(order);

    // return fresh entity with relations
    return this.findOne(id);
  }

  async remove(id: number) {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return this.ordersRepository.remove(order);
  }
}
