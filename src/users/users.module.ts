import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Address } from 'src/address/entities/address.entity'
import { LoggerMiddleware } from 'src/logger/logger.middleware'
import { Permission } from './entities/permission.entity'
import { Role } from './entities/role.entity'
import { User } from './entities/user.entity'
import { RolePermissionsService } from './role-permissions.service'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [TypeOrmModule.forFeature([User, Address, Role, Permission])],
  controllers: [UsersController],
  providers: [UsersService, RolePermissionsService],
  exports: [UsersService, RolePermissionsService],
})
export class UsersModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(LoggerMiddleware)
  //     .forRoutes({ path: 'users', method: RequestMethod.POST }, { path: 'users/:id', method: RequestMethod.GET })
  // }
}
