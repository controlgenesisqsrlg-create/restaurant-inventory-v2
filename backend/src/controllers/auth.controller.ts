import { Request, Response } from 'express'
import { AuthService } from '../services/auth.service'
import { AuthRequest } from '../middleware/auth.middleware'

export class AuthController {
  private authService: AuthService
  
  constructor() {
    this.authService = new AuthService()
  }
  
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' })
      }
      
      const result = await this.authService.login(email, password)
      
      res.json({
        success: true,
        user: result.user,
        token: result.token
      })
    } catch (error: any) {
      res.status(401).json({ error: error.message })
    }
  }
  
  async logout(req: Request, res: Response) {
    res.json({ success: true, message: 'Logged out successfully' })
  }
  
  async getCurrentUser(req: AuthRequest, res: Response) {
    try {
      const user = await this.authService.getUserById(req.user!.id)
      
      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          primaryOutletId: user.primaryOutletId,
          primaryOutletName: user.primaryOutlet?.name,
          roleId: user.roleId,
          permissions: req.user!.permissions
        }
      })
    } catch (error: any) {
      res.status(404).json({ error: error.message })
    }
  }
  
  async refreshToken(req: Request, res: Response) {
    try {
      const { token } = req.body
      
      const result = await this.authService.refreshToken(token)
      
      res
