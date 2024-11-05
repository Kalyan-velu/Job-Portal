import type { RouteConfig } from '@server/common/routes.config'
import employerApplication from '@server/modules/company/routes/application.route'
import companyProfileRouter from '@server/modules/company/routes/profile.route'

const CompanyModule: RouteConfig = {
  prefix: 'company',
  routes: [companyProfileRouter, employerApplication],
}

export default CompanyModule
