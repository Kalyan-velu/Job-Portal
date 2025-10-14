import type { RouteConfig } from '../../common/routes.config';
import userAuthRouter from './routes/auth.route';
import user from './routes/user.route';

const Auth: RouteConfig = {
  prefix: 'auth',
  routes: [userAuthRouter],
  isPublic: true,
};

const User: RouteConfig = {
  prefix: 'user',
  routes: [user],
};

const modules = { Auth, User };
export default modules;
