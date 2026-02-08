import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Category } from 'src/categories/entities/category.entity'
import { UsersModule } from 'src/users/users.module'
import { Product } from './entities/product.entity'
import { BookmarkProduct } from './entities/product-bookmark.entity'
import { ProductsController } from './products.controller'
import { ProductsService } from './products.service'

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, BookmarkProduct]), UsersModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
