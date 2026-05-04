import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware, requirePermission } from '../middleware/auth.middleware'

const router = Router()
const prisma = new PrismaClient()

router.use(authMiddleware)

router.get('/', requirePermission('regions', 'read'), async (req, res) => {
  try {
    const regions = await prisma.region.findMany({
      include: {
        _count: {
          select: { outlets: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    res.json({
      success: true,
       regions
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/', requirePermission('regions', 'create'), async (req, res) => {
  try {
    const { name, code } = req.body

    if (!name || !code) {
      return res.status(400).json({ error: 'Name and code are required' })
    }

    const existing = await prisma.region.findUnique({
      where: { code }
    })

    if (existing) {
      return res.status(400).json({ error: 'Region code already exists' })
    }

    const region = await prisma.region.create({
       { name, code }
    })

    res.status(201).json({
      success: true,
       region,
      message: 'Region created successfully'
    })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

router.put('/:id', requirePermission('regions', 'update'), async (req, res) => {
  try {
    const { id } = req.params
    const { name, code } = req.body

    if (!name || !code) {
      return res.status(400).json({ error: 'Name and code are required' })
    }

    const existing = await prisma.region.findFirst({
      where: { code, NOT: { id } }
    })

    if (existing) {
      return res.status(400).json({ error: 'Region code already exists' })
    }

    const region = await prisma.region.update({
      where: { id },
       { name, code }
    })

    res.json({
      success: true,
       region,
      message: 'Region updated successfully'
    })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

router.delete('/:id', requirePermission('regions', 'delete'), async (req, res) => {
  try {
    const { id } = req.params

    const outlets = await prisma.outlet.findMany({
      where: { regionId: id }
    })

    if (outlets.length > 0) {
      return res.status(400).json({ error: 'Cannot delete region with assigned outlets' })
    }

    await prisma.region.delete({
      where: { id }
    })

    res.json({
      success: true,
      message: 'Region deleted successfully'
    })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

export default router
