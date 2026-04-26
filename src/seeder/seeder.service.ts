import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Permission } from 'src/users/entities/permission.entity'
import { Role } from 'src/users/entities/role.entity'
import { In, Repository } from 'typeorm'

@Injectable()
// implements OnApplicationBootstrap => running at first
export class SeederService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  // async onApplicationBootstrap() {
  //   await this.seedPermissionAndRole()
  // }

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
    //'admin', 'user', 'support', 'manager'
    const rolesData: { name: string; permissions: string[] }[] = [
      {
        name: 'admin',
        permissions: permissions,
      },
      {
        name: 'user',
        permissions: ['address:create', 'user:read'],
      },
      {
        name: 'support',
        permissions: ['user:read', 'address:read', 'user:edit', 'user:delete', 'user:report', 'address:read'],
      },
      {
        name: 'manager',
        permissions: ['user:read'],
      },
    ]

    for (const roleObj of rolesData) {
      const role = await this.roleRepository.findOne({ where: { name: roleObj.name }, relations: ['permissions'] })
      const permissionsData = await this.permissionRepository.findBy({
        name: In(roleObj.permissions),
      })
      if (!role) {
        const newRole = this.roleRepository.create({
          name: roleObj.name,
          permissions: permissionsData,
        })
        await this.roleRepository.save(newRole)
      } else {
        role.permissions = permissionsData
        await this.roleRepository.save(role)
      }
    }
    console.log('run f irst seederd cc')
  }
}
