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

// Module assignment
router.post('/modules', requirePermission('roles', 'update'), roleController.assignModule)
router.delete('/:roleId/modules/:moduleId', requirePermission('roles', 'update'), roleController.removeModule)

// Permission assignment
router.post('/permissions', requirePermission('roles', 'update'), roleController.assignPermission)
router.delete('/:roleId/permissions/:permissionId', requirePermission('roles', 'update'), roleController.removePermission)

export default router
