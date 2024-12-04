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
import { jwtAuth } from '@server/middlewares/auth.middleware'

const userAuthRouter = Router()

userAuthRouter.post('/login', validateRequestBody(loginSchema), Login)
userAuthRouter.post('/register', validateRequestBody(baseUserSchema), Register)
userAuthRouter.get('/verify-email', verifyEmail)
userAuthRouter.post('/forgot-password', forgotPassword)
userAuthRouter.post('/reset-password', resetPassword)
userAuthRouter.post(
  '/resent-verification-email',
  jwtAuth,
  resendVerificationEmail,
)
export default userAuthRouter
