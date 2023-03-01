import { Router } from 'express'
import { signUp, signIn, newToken } from '../controllers/auth.controller'
import { auth } from '../middleware/auth.middleware'

const router = Router()

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/new_token', auth, newToken)

export { router as authRoutes }
