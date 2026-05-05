import { Request, Response } from 'express'
import { UserService } from '../services/user.service'
import { AuthRequest } from '../middleware/auth.middleware'

export class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  async getAllUsers(req: AuthRequest, res: Response) {
    try {
      const users = await this.userService.getAllUsers()
      
      res.json({
        success: true,
        data: users.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          roleId: u.roleId,
          roleName: u.role.name,
          primaryOutletId: u.primaryOutletId,
          primaryOutletName: u.primaryOutlet?.name,
          isActive: u.isActive,
          accessibleOutlets: u.outletAccess.map(ua => ({
            id: ua.outlet.id,
            name: ua.outlet.name,
            code: ua.outlet.code
          })),
          createdAt: u.createdAt
        }))
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  async getUserById(req: AuthRequest, res: Response) {
    try {
      const user = await this.userService.getUserById(req.params.id)
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          roleId: user.roleId,
          roleName: user.role.name,
          primaryOutletId: user.primaryOutletId,
          primaryOutletName: user.primaryOutlet?.name,
          isActive: user.isActive,
          accessibleOutlets: user.outletAccess.map(ua => ({
            id: ua.outlet.id,
            name: ua.outlet.name,
            code: ua.outlet.code
          }))
        }
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  async createUser(req: AuthRequest, res: Response) {
    try {
      const { name, email, password, roleId, primaryOutletId, isActive } = req.body

      if (!name || !email || !password || !roleId) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const user = await this.userService.createUser({
        name,
        email,
        password,
        roleId,
        primaryOutletId,
        isActive
      })

      res.status(201).json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          roleId: user.roleId,
          roleName: user.role.name
        },
        message: 'User created successfully'
      })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async updateUser(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params
      const { name, email, password, roleId, primaryOutletId, isActive } = req.body

      const user = await this.userService.updateUser(id, {
        name,
        email,
        password,
        roleId,
        primaryOutletId,
        isActive
      })

      res.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          roleId: user.roleId,
          roleName: user.role.name
        },
        message: 'User updated successfully'
      })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async deleteUser(req: AuthRequest, res: Response) {
    try {
      await this.userService.deleteUser(req.params.id)

      res.json({
        success: true,
        message: 'User deleted successfully'
      })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
}
