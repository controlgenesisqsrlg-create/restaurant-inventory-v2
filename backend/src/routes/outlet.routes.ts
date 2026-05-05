import { Router } from 'express'
import { OutletController } from '../controllers/outlet.controller'
import { authMiddleware, requirePermission } from '../middleware/auth.middleware'

const router = Router()
const outletController = new OutletController()

router.use(authMiddleware)

router.get('/', requirePermission('outlets', 'read'), outletController.getAllOutlets)
router.get('/:id', requirePermission('outlets', 'read'), outletController.getOutletById)
router.post('/', requirePermission('outlets', 'create'), outletController.createOutlet)
router.put('/:id', requirePermission('outlets', 'update'), outletController.updateOutlet)
router.delete('/:id', requirePermission('outlets', 'delete'), outletController.deleteOutlet)

export default router
