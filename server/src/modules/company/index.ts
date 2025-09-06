import type { RouteConfig } from '../../common/routes.config'
import employerApplication from './routes/application.route'
import companyProfileRouter from './routes/profile.route'

const CompanyModule: RouteConfig = {
  prefix: 'company',
  routes: [companyProfileRouter, employerApplication],
}

export default CompanyModule
