import { Request, Response } from 'express'
import { RoleService } from '../services/role.service'
import { AuthRequest } from '../middleware/auth.middleware'

export class RoleController {
  private roleService: RoleService

  constructor() {
    this.roleService = new RoleService()
  }

  async getAllRoles(req: AuthRequest, res: Response) {
    try {
      const roles = await this.roleService.getAllRoles()

      res.json({
        success: true,
        data: roles.map(r => ({
          id: r.id,
          name: r.name,
          description: r.description,
          isSystem: r.isSystem,
          userCount: r._count.users,
          modules: r.modules.map(rm => ({
            id: rm.module.id,
            name: rm.module.name,
            displayName: rm.module.displayName,
            icon: rm.module.icon
          })),
          permissions: r.permissions.map(rp => ({
            id: rp.permission.id,
            moduleId: rp.permission.moduleId,
            action: rp.permission.action,
            description: rp.permission.description
          }))
        }))
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  async getRoleById(req: AuthRequest, res: Response) {
    try {
      const role = await this.roleService.getRoleById(req.params.id)

      if (!role) {
        return res.status(404).json({ error: 'Role not found' })
      }

      res.json({
        success: true,
        data: {
          id: role.id,
          name: role.name,
          description: role.description,
          isSystem: role.isSystem,
          modules: role.modules.map(rm => ({
            id: rm.module.id,
            name: rm.module.name,
            displayName: rm.module.displayName,
            icon: rm.module.icon
          })),
          permissions: role.permissions.map(rp => ({
            id: rp.permission.id,
            moduleId: rp.permission.moduleId,
            action: rp.permission.action,
            description: rp.permission.description
          })),
          users: role.users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email
          }))
        }
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  async createRole(req: AuthRequest, res: Response) {
    try {
      const { name, description, isSystem } = req.body

      if (!name) {
        return res.status(400).json({ error: 'Role name is required' })
      }

      const role = await this.roleService.createRole({
        name,
        description,
        isSystem: isSystem ?? false
      })

      res.status(201).json({
        success: true,
        data: {
          id: role.id,
          name: role.name,
          description: role.description
        },
        message: 'Role created successfully'
      })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async updateRole(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params
      const { name, description } = req.body

      const role = await this.roleService.updateRole(id, {
        name,
        description
      })

      res.json({
        success: true,
        data: {
          id: role.id,
          name: role.name,
          description: role.description
        },
        message: 'Role updated successfully'
      })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async deleteRole(req: AuthRequest, res: Response) {
    try {
      await this.roleService.deleteRole(req.params.id)

      res.json({
        success: true,
        message: 'Role deleted successfully'
      })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async assignModule(req: AuthRequest, res: Response) {
    try {
      const { roleId, moduleId } = req.body

      await this.roleService.assignModuleToRole(roleId, moduleId)

      res.json({
        success: true,
        message: 'Module assigned to role'
      })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async removeModule(req: AuthRequest, res: Response) {
    try {
      const { roleId, moduleId } = req.params

      await this.roleService.removeModuleFromRole(roleId, moduleId)

      res.json({
        success: true,
        message: 'Module removed from role'
      })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async assignPermission(req: AuthRequest, res: Response) {
    try {
      const { roleId, permissionId } = req.body

      await this.roleService.assignPermissionToRole(roleId, permissionId)

      res.json({
        success: true,
        message: 'Permission assigned to role'
      })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async removePermission(req: AuthRequest, res: Response) {
    try {
      const { roleId, permissionId } = req.params

      await this.roleService.removePermissionFromRole(roleId, permissionId)

      res.json({
        success: true,
        message: 'Permission removed from role'
      })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
}
