import { Router } from 'express'
import { logout, userInfo } from '../controllers/user.controller'
import { auth } from '../middleware/auth.middleware'

const router = Router()

router.get('/info', auth, userInfo)
router.get('/logout', auth, logout)

export { router as userRoutes }
