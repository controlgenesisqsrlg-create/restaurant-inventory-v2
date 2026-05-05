import { Router } from 'express'
import { RoleController } from '../controllers/role.controller'
import { authMiddleware, requirePermission } from '../middleware/auth.middleware'

const router = Router()
const roleController = new RoleController()

router.use(authMiddleware)

router.get('/', requirePermission('roles', 'read'), roleController.getAllRoles)
router.get('/:id', requirePermission('roles', 'read'), roleController.getRoleById)
router.post('/', requirePermission('roles', 'create'), roleController.createRole)
router.put('/:id', requirePermission('roles', 'update'), roleController.updateRole)
router.delete('/:id', requirePermission('roles', 'delete'), roleController.deleteRole)

export default router
