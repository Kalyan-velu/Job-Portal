import { Router } from 'express';
import { validateRequestBody } from '../../../common/request';
import { baseUserSchema, loginSchema } from '../../../zod/user.schema';
import { Login, Register } from '../controllers/auth.controller';

const userAuthRouter = Router();

userAuthRouter.post('/login', validateRequestBody(loginSchema), Login);
userAuthRouter.post('/register', validateRequestBody(baseUserSchema), Register);
export default userAuthRouter;
