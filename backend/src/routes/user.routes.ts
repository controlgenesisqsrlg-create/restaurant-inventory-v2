import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { authMiddleware, requirePermission } from '../middleware/auth.middleware'

const router = Router()
const userController = new UserController()

// All routes require authentication
router.use(authMiddleware)

router.get('/', requirePermission('users', 'read'), userController.getAllUsers)
router.get('/:id', requirePermission('users', 'read'), userController.getUserById)
router.post('/', requirePermission('users', 'create'), userController.createUser)
router.put('/:id', requirePermission('users', 'update'), userController.updateUser)
router.delete('/:id', requirePermission('users', 'delete'), userController.deleteUser)

// Outlet access management
router.post('/outlet-access', requirePermission('users', 'update'), userController.addOutletAccess)
router.delete('/:userId/outlet-access/:outletId', requirePermission('users', 'update'), userController.removeOutletAccess)

export default router
