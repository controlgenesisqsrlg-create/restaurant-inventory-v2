import { Request, Response } from 'express'
import { OutletService } from '../services/outlet.service'
import { AuthRequest } from '../middleware/auth.middleware'

export class OutletController {
  private outletService: OutletService

  constructor() {
    this.outletService = new OutletService()
  }

  async getAllOutlets(req: AuthRequest, res: Response) {
    try {
      const outlets = await this.outletService.getAllOutlets()

      res.json({
        success: true,
         outlets.map(o => ({
          id: o.id,
          name: o.name,
          code: o.code,
          regionId: o.regionId,
          regionName: o.region?.name,
          address: o.address,
          phone: o.phone,
          isActive: o.isActive,
          userCount: o._count.users
        }))
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  async getOutletById(req: AuthRequest, res: Response) {
    try {
      const outlet = await this.outletService.getOutletById(req.params.id)

      if (!outlet) {
        return res.status(404).json({ error: 'Outlet not found' })
      }

      res.json({
        success: true,
         outlet
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  async createOutlet(req: AuthRequest, res: Response) {
    try {
      const { name, code, regionId, address, phone, isActive } = req.body

      if (!name || !code) {
        return res.status(400).json({ error: 'Name and code are required' })
      }

      const outlet = await this.outletService.createOutlet({
        name,
        code,
        regionId,
        address,
        phone,
        isActive
      })

      res.status(201).json({
        success: true,
         outlet,
        message: 'Outlet created successfully'
      })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async updateOutlet(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params
      const { name, code, regionId, address, phone, isActive } = req.body

      const outlet = await this.outletService.updateOutlet(id, {
        name,
        code,
        regionId,
        address,
        phone,
        isActive
      })

      res.json({
        success: true,
         outlet,
        message: 'Outlet updated successfully'
      })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async deleteOutlet(req: AuthRequest, res: Response) {
    try {
      await this.outletService.deleteOutlet(req.params.id)

      res.json({
        success: true,
        message: 'Outlet deleted successfully'
      })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
}
