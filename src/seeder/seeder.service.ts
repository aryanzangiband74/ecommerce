import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Permission } from 'src/users/entities/permission.entity'
import { Role } from 'src/users/entities/role.entity'
import { Repository } from 'typeorm'

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}
  async onApplicationBootstrap() {
    await this.seedPermissionAndRole()
  }

  async seedPermissionAndRole() {
    const permissions = [
      //user permissios
      'user:create',
      'user:read',
      'user:edit',
      'user:delete',
      'user:report',
      //address permissios
      'address:create',
      'address:read',
      'address:edit',
      'address:delete',
    ]
    for (const permissionName of permissions) {
      const permission = await this.permissionRepository.findOne({ where: { name: permissionName } })
      if (!permission) {
        const newPermission = this.permissionRepository.create({
          name: permissionName,
        })
        await this.permissionRepository.save(newPermission)
      }
    }
    const rolesData = ['admin', 'user', 'support', 'manager']
    console.log('run f irst seederd')
  }
}
