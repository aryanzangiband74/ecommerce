import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}
  async create(createAddressDto: CreateAddressDto, userId: number) {
    const user = await this.userRepository.findOneByOrFail({ id: userId });
    const address = this.addressRepository.create({
      ...createAddressDto,
      user
    });
    return this.addressRepository.save(address);
  }

  async findAll(limit: number = 10, page: number = 1) {
    const query = this.addressRepository.createQueryBuilder('addresses').leftJoinAndSelect('addresses.user', 'users');

    query.skip((page - 1) * limit).take(limit);
    return await query.getMany();
  }

  async findOne(id: number) {
    const address = await this.addressRepository.findOne({
      where: { id },
      relations: ['user']
    });
    return address;
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    const address = await this.addressRepository.findOneByOrFail({ id });
    Object.assign(address, updateAddressDto);
    return this.addressRepository.save(address);
  }

  async remove(id: number) {
    const address = await this.addressRepository.findOne({ where: { id } });
    if (!address) {
      throw new BadRequestException('Address not found');
    }
    return this.addressRepository.remove(address);
  }
}
