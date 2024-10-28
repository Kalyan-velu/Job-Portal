import { authorizeRole } from '@server/middlewares/auth.middleware'
import { jobRouter } from '@server/modules/job/routes/job.route'
import type { RouteConfig } from '../../common/routes.config'

export const PrivateJobModule: RouteConfig = {
  prefix: 'job/private',
  routes: [jobRouter],
  middleware:[authorizeRole('employer')]
};
export const PublicJobModule: RouteConfig = {
  prefix: 'job/public',
  routes: [],
  isPublic:true
};
