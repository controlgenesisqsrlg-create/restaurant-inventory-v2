import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware, requirePermission } from '../middleware/auth.middleware'

const router = Router()
const prisma = new PrismaClient()

router.use(authMiddleware)

router.get('/', requirePermission('inventory', 'read'), async (req, res) => {
  try {
    const { outletId, category, search, lowStock } = req.query

    const where: any = {}

    if (outletId) {
      where.outletId = outletId as string
    } else if (req.user?.outletId) {
      where.outletId = req.user.outletId
    }

    if (category) {
      where.category = category as string
    }

    if (search) {
      where.name = { contains: search as string, mode: 'insensitive' }
    }

    if (lowStock === 'true') {
      where.quantityOnHand = { lte: prisma.inventoryItem.fields.reOrderLevel }
    }

    const items = await prisma.inventoryItem.findMany({
      where,
      include: {
        outlet: true,
        adjustments: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { name: 'asc' }
    })

    res.json({
      success: true,
       items
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
