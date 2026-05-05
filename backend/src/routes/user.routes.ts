import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { authMiddleware, requirePermission } from '../middleware/auth.middleware'

const router = Router()
const userController = new UserController()

router.use(authMiddleware)

router.get('/', requirePermission('users', 'read'), userController.getAllUsers)
router.get('/:id', requirePermission('users', 'read'), userController.getUserById)
router.post('/', requirePermission('users', 'create'), userController.createUser)
router.put('/:id', requirePermission('users', 'update'), userController.updateUser)
router.delete('/:id', requirePermission('users', 'delete'), userController.deleteUser)

export default router
