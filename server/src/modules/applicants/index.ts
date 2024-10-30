import type { RouteConfig } from '../../common/routes.config'
import generalRouter from './routes/applicant.route'

const Applicant: RouteConfig = {
  prefix: 'applicant',
  routes: [generalRouter],
}

export default Applicant
