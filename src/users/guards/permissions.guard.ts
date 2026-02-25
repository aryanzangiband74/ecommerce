import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PERMISSION_KEY } from '../decorators/permissions.decorator'
import { Permission } from '../entities/permission.entity'
import { RolePermissionsService } from '../role-permissions.service'

@Injectable()
export class PermmisionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rolePermissionService: RolePermissionsService,
  ) {}
  async canActivate(context: ExecutionContext) {
    //get roles metadata
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSION_KEY, [context.getClass(), context.getHandler()])
    if (!requiredPermissions || requiredPermissions.length < 1) return true

    // get user from jwt token

    const { user } = context.switchToHttp().getRequest()

    //get user data
    const userPermissions = await this.rolePermissionService.getUserPermission(user.id)

    const hasPermission = requiredPermissions.every((p) => userPermissions.includes(p))

    if (!hasPermission) throw new ForbiddenException('you are not allowed to do this operation')

    return true
  }
}
