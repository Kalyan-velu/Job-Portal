import { authorizeRole } from '@server/middlewares/auth.middleware'
import { applicantionRouter } from '@server/modules/applicants/routes/application.route'
import type { RouteConfig } from '../../common/routes.config'
import generalRouter from './routes/applicant.route'

const Applicant: RouteConfig = {
  prefix: 'applicant',
  routes: [generalRouter],
}

const ApplicantApplication: RouteConfig = {
  prefix: 'application',
  routes: [applicantionRouter],
  middleware: [authorizeRole('applicant')],
}

export { Applicant, ApplicantApplication }
