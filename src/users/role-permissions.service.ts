import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Permission } from './entities/permission.entity'
import { Role } from './entities/role.entity'
import { UsersService } from './users.service'

@Injectable()
export class RolePermissionsService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly userService: UsersService,
  ) {}

  async getUserPermission(userId: number): Promise<string[]> {
    const user = await this.userService.findUserByPermission(userId)

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

  async addRoleToUser(userId: number, roleId: number) {
    const user = await this.userService.findUserByPermission(userId)

    const role = await this.roleRepository.findOne({ where: { id: roleId } })

    if (!role) throw new NotFoundException('role not found')

    if (!user.roles.find((r) => r.id === role.id)) {
      return await this.userService.addRole(userId, role)
    }

    throw new BadRequestException('selected role already exist')
  }
  async retakeRoleFromUser(userId: number, roleId: number) {
    const user = await this.userService.findUserByPermission(userId)

    const role = await this.roleRepository.findOne({ where: { id: roleId } })

    if (!role) throw new NotFoundException('role not found')

    if (user.roles.find((r) => r.id === role.id)) {
      return await this.userService.removeRole(userId, role.id)
    }

    throw new BadRequestException('selected role already exist')
  }

  async getUserRoles(userId: number) {
    const user = await this.userService.findUserByPermission(userId)

    return user.roles
  }

  async createPermissions(names: string[]) {
    const normalized = [...new Set(names.map((n) => n.trim()))]

    const existing = await this.permissionRepository.find({
      where: { name: In(normalized) },
      select: ['name'],
    })

    const existingSet = new Set(existing.map((e) => e.name))
    const toCreate = normalized.filter((n) => !existingSet.has(n))

    const created = toCreate.length
      ? await this.permissionRepository.save(toCreate.map((name) => this.permissionRepository.create({ name })))
      : []

    return created
  }

  async addPermissionToRole(permissionId: number, roleId: number) {
    const role = await this.roleRepository.findOne({ where: { id: roleId }, relations: ['permissions'] })

    if (!role) throw new NotFoundException('role not found')

    if (role?.permissions.find((p) => p.id === permissionId)) {
      const permission = await this.permissionRepository.findOne({ where: { id: permissionId } })
      !!permission && role.permissions.push(permission)
    } else {
      throw new BadRequestException('this permission is already exist')
    }
    return this.roleRepository.save(role)
  }

  async assignPermissionToUser(userId: number, permissionId: number) {
    const user = await this.userService.findUserByPermission(userId)

    const permission = await this.permissionRepository.findOne({ where: { id: permissionId } })

    if (!permission) throw new NotFoundException('permission not found')

    if (!user.permissions.find((p) => p.id === permissionId)) {
      return await this.userService.addPermission(userId, permission)
    }

    throw new BadRequestException('selected permission already exist')
  }
}
