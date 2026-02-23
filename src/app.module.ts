import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AddressModule } from './address/address.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CategoriesModule } from './categories/categories.module'
import { IpTrackerMiddleware } from './ipTracker/ip-tracker.middleware'
import { IpTrackerModule } from './ipTracker/ipTracker.module'
import { BodyLoggerMiddleware } from './middlewares/body-logger/body-logger.middleware'
import { OrdersModule } from './orders/orders.module'
import { ProductsModule } from './products/products.module'
import { TicketsModule } from './tickets/tickets.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT! || 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [`${__dirname}/**/entities/*.entity{.ts,.js}`],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    AddressModule,
    TicketsModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    IpTrackerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IpTrackerMiddleware).forRoutes('*')
  }
}
