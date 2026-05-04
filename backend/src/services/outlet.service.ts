import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class OutletService {
  async getAllOutlets() {
    return await prisma.outlet.findMany({
      include: {
        region: true,
        _count: {
          select: { users: true }
        }
      },
      orderBy: { name: 'asc' }
    })
  }

  async getOutletById(outletId: string) {
    return await prisma.outlet.findUnique({
      where: { id: outletId },
      include: {
        region: true,
        users: true,
        userAccess: {
          include: { user: true }
        }
      }
    })
  }

  async createOutlet(data: {
    name: string
    code: string
    regionId?: string
    address?: string
    phone?: string
    isActive?: boolean
  }) {
    return await prisma.outlet.create({
      data,
      include: {
        region: true
      }
    })
  }

  async updateOutlet(outletId: string,  {
    name?: string
    code?: string
    regionId?: string
    address?: string
    phone?: string
    isActive?: boolean
  }) {
    return await prisma.outlet.update({
      where: { id: outletId },
      data,
      include: {
        region: true
      }
    })
  }

  async deleteOutlet(outletId: string) {
    return await prisma.outlet.delete({
      where: { id: outletId }
    })
  }
}
