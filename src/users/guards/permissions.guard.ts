import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { InjectRepository } from '@nestjs/typeorm'
import { Address } from 'src/address/entities/address.entity'
import { Repository } from 'typeorm'
import { PERMISSION_KEY } from '../decorators/permissions.decorator'
import { Permission } from '../entities/permission.entity'
import { RolePermissionsService } from '../role-permissions.service'

@Injectable()
export class PermmisionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rolePermissionService: RolePermissionsService,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}
  async canActivate(context: ExecutionContext) {
    //get roles metadata
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSION_KEY, [context.getClass(), context.getHandler()])
    if (!requiredPermissions || requiredPermissions.length < 1) return true

    // get user from jwt token

    const request = context.switchToHttp().getRequest()

    const userId = request.user.userId
    //get user data
    const userPermissions = await this.rolePermissionService.getUserPermission(userId)

    const hasPermission = requiredPermissions.every((p) => userPermissions.includes(this.cleanOwn(p)))

    if (!hasPermission) throw new ForbiddenException('you are not allowed to do this operation')

    //check own resourcese

    requiredPermissions.forEach(async (permission) => {
      if (permission.endsWith(':own')) {
        const [resource, action] = permission.split(':')
        const paramId = request.params['id']
        const isOwner = await this.checkOwnerShip(resource, userId, +paramId)
        if (isOwner) return true
        throw new ForbiddenException('you are allowed to do this operation on this resource')
      }
    })
    return true
  }
  private cleanOwn(str: string) {
    if (str.endsWith(':own')) {
      return str.slice(0, -4)
    }
    return str
  }

  private async checkOwnerShip(resource: string, userId: number, resourceId: number) {
    if (resource === 'address') {
      const address = await this.addressRepository.findOne({ where: { id: resourceId }, relations: ['user'] })

      return address && address?.user.id === userId
    }
    return true
  }
}
