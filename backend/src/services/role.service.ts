import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class RoleService {
  async getAllRoles() {
    return await prisma.role.findMany({
      include: {
        modules: {
          include: { module: true }
        },
        permissions: {
          include: { permission: true }
        },
        _count: {
          select: { users: true }
        }
      },
      orderBy: { name: 'asc' }
    })
  }

  async getRoleById(roleId: string) {
    return await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        modules: {
          include: { module: true }
        },
        permissions: {
          include: { permission: true }
        },
        users: true
      }
    })
  }

  async createRole(data: {
    name: string
    description?: string
    isSystem?: boolean
  }) {
    return await prisma.role.create({
      data,
      include: {
        modules: true,
        permissions: true
      }
    })
  }

  async updateRole(roleId: string, data: {
    name?: string
    description?: string
  }) {
    return await prisma.role.update({
      where: { id: roleId },
      data,
      include: {
        modules: true,
        permissions: true
      }
    })
  }

  async deleteRole(roleId: string) {
    const role = await prisma.role.findUnique({
      where: { id: roleId }
    })

    if (role?.isSystem) {
      throw new Error('Cannot delete system role')
    }

    return await prisma.role.delete({
      where: { id: roleId }
    })
  }

  async assignModuleToRole(roleId: string, moduleId: string) {
    return await prisma.roleModule.create({
      data: {
        roleId,
        moduleId
      }
    })
  }

  async removeModuleFromRole(roleId: string, moduleId: string) {
    return await prisma.roleModule.delete({
      where: {
        roleId_moduleId: {
          roleId,
          moduleId
        }
      }
    })
  }

  async assignPermissionToRole(roleId: string, permissionId: string) {
    return await prisma.rolePermission.create({
      data: {
        roleId,
        permissionId
      }
    })
  }

  async removePermissionFromRole(roleId: string, permissionId: string) {
    return await prisma.rolePermission.delete({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId
        }
      }
    })
  }
}
