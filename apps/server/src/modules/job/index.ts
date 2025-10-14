import { jobRouter } from './routes/job.route'
import { publicJobRouter } from './routes/public.route'
import type { RouteConfig } from '../../common/routes.config'
import { authorizeRole } from '../../middlewares/auth.middleware'

export const PrivateJobModule: RouteConfig = {
  prefix: 'job/private',
  routes: [jobRouter],
  middleware: [authorizeRole('employer')],
}
export const PublicJobModule: RouteConfig = {
  prefix: 'jobs',
  routes: [publicJobRouter],
  isPublic: true,
}
