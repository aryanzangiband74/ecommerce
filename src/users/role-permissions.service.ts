import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Role } from './entities/role.entity'
import { UsersService } from './users.service'

@Injectable()
export class RolePermissionsService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly userUserService: UsersService,
  ) {}

  async getUserPermission(userId: number): Promise<string[]> {
    const user = await this.userUserService.findUserByPermission(userId)

    const permissions = new Set<string>()
    user.roles?.forEach((role) => {
      role?.permissions.forEach((p) => {
        permissions.add(p.name)
      })
    })
    user.permissions.forEach((p) => {
      permissions.add(p.name)
    })
    return Array.from(permissions)
  }

  async createRole(name: string) {
    const role = this.roleRepository.create({ name })
    return await this.roleRepository.save(role)
  }
}
