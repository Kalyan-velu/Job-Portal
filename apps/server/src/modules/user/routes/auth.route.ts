import { Router } from 'express'
import { validateRequestBody } from '../../../common/request'
import { baseUserSchema, loginSchema } from '../../../zod/user.schema'
import {
  forgotPassword,
  Login,
  Register,
  resendVerificationEmail,
  resetPassword,
  verifyEmail,
} from '../controllers/auth.controller'
import { jwtAuth } from '../../../middlewares/auth.middleware'
import { limiter } from '../../../lib/rate-limiter.conf'

const userAuthRouter = Router()

userAuthRouter.post('/login', limiter, validateRequestBody(loginSchema), Login)
userAuthRouter.post('/register', validateRequestBody(baseUserSchema), Register)
userAuthRouter.get('/verify-email', limiter, verifyEmail)
userAuthRouter.post('/forgot-password', limiter, forgotPassword)
userAuthRouter.post('/reset-password', limiter, resetPassword)
userAuthRouter.post(
  '/resent-verification-email',
  limiter,
  jwtAuth,
  resendVerificationEmail,
)
export default userAuthRouter
