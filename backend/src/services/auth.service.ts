import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export class AuthService {
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true }
            },
            modules: true
          }
        },
        primaryOutlet: true,
        outletAccess: {
          include: { outlet: true }
        }
      }
    })

    if (!user || !user.isActive) {
      throw new Error('Invalid credentials or user inactive')
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      throw new Error('Invalid credentials')
    }

    const permissions = user.role.permissions.map(rp => ({
      module: rp.permission.module.name,
      action: rp.permission.action
    }))

    const accessibleOutlets = user.outletAccess.map(ua => ({
      id: ua.outlet.id,
      name: ua.outlet.name,
      code: ua.outlet.code
    }))

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        roleId: user.roleId,
        outletId: user.primaryOutletId,
        permissions
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    )

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        primaryOutletId: user.primaryOutletId,
        primaryOutletName: user.primaryOutlet?.name,
        accessibleOutlets,
        roleId: user.roleId,
        roleName: user.role.name,
        permissions
      },
      token
    }
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        primaryOutlet: true,
        outletAccess: {
          include: { outlet: true }
        }
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    return user
  }

  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
      
      const newToken = jwt.sign(
        {
          id: decoded.id,
          email: decoded.email,
          roleId: decoded.roleId,
          outletId: decoded.outletId,
          permissions: decoded.permissions
        },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      )

      return { token: newToken }
    } catch (error) {
      throw new Error('Invalid token')
    }
  }
}
