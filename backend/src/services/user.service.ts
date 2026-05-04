import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export class UserService {
  async getAllUsers() {
    return await prisma.user.findMany({
      include: {
        role: true,
        primaryOutlet: true,
        outletAccess: {
          include: { outlet: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  async getUserById(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        primaryOutlet: true,
        outletAccess: {
          include: { outlet: true }
        }
      }
    })
  }

  async createUser(data: {
    name: string
    email: string
    password: string
    roleId: string
    primaryOutletId?: string
    isActive?: boolean
  }) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existing) {
      throw new Error('Email already exists')
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        roleId: data.roleId,
        primaryOutletId: data.primaryOutletId,
        isActive: data.isActive ?? true
      },
      include: {
        role: true,
        primaryOutlet: true
      }
    })
  }

  async updateUser(userId: string, data: {
    name?: string
    email?: string
    password?: string
    roleId?: string
    primaryOutletId?: string
    isActive?: boolean
  }) {
    const updateData: any = { ...data }

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10)
    }

    return await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        role: true,
        primaryOutlet: true
      }
    })
  }

  async deleteUser(userId: string) {
    return await prisma.user.delete({
      where: { id: userId }
    })
  }

  async addUserOutletAccess(userId: string, outletId: string) {
    return await prisma.userOutletAccess.create({
      data: {
        userId,
        outletId
      },
      include: { outlet: true }
    })
  }

  async removeUserOutletAccess(userId: string, outletId: string) {
    return await prisma.userOutletAccess.delete({
      where: {
        userId_outletId: {
          userId,
          outletId
        }
      }
    })
  }
}
