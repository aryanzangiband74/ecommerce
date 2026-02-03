import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
// import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const newCategory = this.categoryRepository.create(createCategoryDto);
      return await this.categoryRepository.save(newCategory);
    } catch (err: any) {
      throw new BadRequestException('Error in creating Category' + err);
    }
  }

  async findAll() {
    const query = this.categoryRepository.createQueryBuilder('categories');
    return await query.getMany();
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id }, relations: ['products'] });

    if (!category) {
      throw new BadRequestException('Category not found');
    }
    return category;
  }

  // update(id: number, updateCategoryDto: UpdateCategoryDto) {
  //   return `This action updates a #${id} category`;
  // }

  // ---- cinario 1 : remove all relations with product and remove only category ----
  async remove(id: number) {
    const category = await this.findOne(id);

    category.products = [];
    await this.categoryRepository.save(category);
    return await this.categoryRepository.remove(category);
  }
  // ---- cinario 1 : remove all relations with product ----

  // ---- cinario 2 : safe remove category ----
  async safeRemove(id: number) {
    const category = await this.findOne(id);
    if (category.products.length > 0) {
      throw new BadRequestException('Cannot remove category with associated products');
    }
    return await this.categoryRepository.remove(category);
  }
  // ---- cinario 2 : safe remove category ----

  // ---- cinario 3 : hard remove category ----
  async hardRemove(id: number) {
    const category = await this.findOne(id);
    await this.productRepository.remove(category.products);
    return await this.categoryRepository.remove(category);
  }
  // ---- cinario 3 : hard remove category ----
}
