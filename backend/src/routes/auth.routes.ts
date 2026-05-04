import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()
const authController = new AuthController()

router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.get('/me', authMiddleware, authController.getCurrentUser)
router.post('/refresh', authController.refreshToken)

export default router
