import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Product } from 'src/products/entities/product.entity';
import type { Repository } from 'typeorm';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import type UserRoleEnum from './enums/userRoleEnum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const alreadyUser = await this.findOneByMobile(createUserDto.mobile, true);
      if (alreadyUser) throw new BadRequestException('کاربری با این شماره موبایل قبلا ثبت نام کرده است');
      const newUser = this.userRepository.create(createUserDto);
      return await this.userRepository.save(newUser);
    } catch (err: any) {
      throw new BadRequestException('Error in creating user' + err);
    }
  }

  async findAll(role?: UserRoleEnum, limit: number = 10, page: number = 1) {
    const query = this.userRepository.createQueryBuilder('users').leftJoinAndSelect('users.addresses', 'addresses');

    if (role) {
      query.where('role = :role', { role });
    }
    query.skip((page - 1) * limit).take(limit);
    return await query.getMany();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException('user not found');
    return user;
  }

  async findOneByMobile(mobile: string, checkExistence = false) {
    const user = await this.userRepository.findOne({ where: { mobile } });
    if (!checkExistence && !user) throw new BadRequestException('user not found');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException('user not found');

    try {
      const updatedUser = await this.userRepository.update(id, updateUserDto);

      return updatedUser;
    } catch (error) {
      throw new BadRequestException('update failed' + error);
    }
  }

  async remove(id: number) {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new BadRequestException('operation failed and user' + id + 'not found');
    }
  }

  async addProductToBasket(userId: number, product: Product) {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['basketItems'] });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    user.basketItems.push(product);

    return this.userRepository.save(user);
  }
  async removeProductFromBasket(userId: number, productId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['basketItems'] });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    user.basketItems = user.basketItems.filter((item) => item.id !== productId);
    await this.userRepository.save(user);
  }
}
