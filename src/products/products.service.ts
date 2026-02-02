import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { In, Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { categoryIds, ...formData } = createProductDto;
    const product = this.productRepository.create({ ...formData });

    if (!!categoryIds && categoryIds?.length > 0) {
      const categories = await this.categoryRepository.findBy({ id: In(categoryIds) });
      product.categories = categories;
    }
    return await this.productRepository.save(product);
  }

  async findAll() {
    return await this.productRepository.find({ relations: ['categories'] });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({ where: { id }, relations: ['categories'] });
    if (!product) throw new BadRequestException('Product not found');

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { categoryIds, title, price, description, stock } = updateProductDto;

    // ----- common way -----
    // const product = await this.productRepository.findOneOrFail({ where: { id }, relations: ['categories'] });
    // this.productRepository.merge(product, { ...formData });

    // if (!!categoryIds && categoryIds?.length > 0) {
    //   const categories = await this.categoryRepository.findBy({ id: In(categoryIds) });
    //   product.categories = categories;
    // }
    // ----- common way -----

    const product = await this.findOne(id);

    if (!!categoryIds && categoryIds?.length > 0) {
      const categories = await this.categoryRepository.findBy({ id: In(categoryIds) });
      product.categories = categories;
    }
    product.title = title;
    product.price = price;
    product.description = description;
    product.stock = stock;

    return await this.productRepository.save(product);
  }

  // remove(id: number) {
  //   return `This action removes a #${id} product`;
  // }
}
