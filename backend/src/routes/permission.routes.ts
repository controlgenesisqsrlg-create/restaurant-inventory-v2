import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware, requirePermission } from '../middleware/auth.middleware'

const router = Router()
const prisma = new PrismaClient()

router.use(authMiddleware)

router.get('/', requirePermission('roles', 'read'), async (req, res) => {
  try {
    const permissions = await prisma.permission.findMany({
      include: {
        module: true
      },
      orderBy: { action: 'asc' }
    })

    res.json({
      success: true,
       permissions
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
