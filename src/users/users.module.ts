import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Address } from 'src/address/entities/address.entity'
import { LoggerMiddleware } from 'src/logger/logger.middleware'
import { User } from './entities/user.entity'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [TypeOrmModule.forFeature([User, Address])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(LoggerMiddleware)
  //     .forRoutes({ path: 'users', method: RequestMethod.POST }, { path: 'users/:id', method: RequestMethod.GET })
  // }
}
