import { authorizeRole } from '@server/middlewares/auth.middleware'
import { jobRouter } from '@server/modules/job/routes/job.route'
import type { RouteConfig } from '../../common/routes.config'
import { publicJobRouter } from '@server/modules/job/routes/public.route'

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
