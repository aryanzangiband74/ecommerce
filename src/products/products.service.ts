import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { In, Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { BookmarkProduct } from './entities/product-bookmark.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(BookmarkProduct)
    private readonly bookmarkRepository: Repository<BookmarkProduct>,
    private readonly userService: UsersService
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
  async toggleBookmark(userId: number, productId: number): Promise<BookmarkProduct | void> {
    const user = await this.userService.findOne(userId);
    const product = await this.productRepository.findOne({ where: { id: productId } });

    if (!user || !product) {
      throw new BadRequestException('User or product not found');
    }

    const existingBookmark = await this.bookmarkRepository.findOne({
      where: { user_id: user.id, product_id: product.id }
    });
    console.log('🚀 ~ ProductsService ~ toggleBookmark ~ existingBookmark:', existingBookmark);
    if (existingBookmark) {
      await this.bookmarkRepository.remove(existingBookmark);
    } else {
      const newBookmark = this.bookmarkRepository.create({
        user: user,
        product: product
      });
      return await this.bookmarkRepository.save(newBookmark);
    }
  }
}
