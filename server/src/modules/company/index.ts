import type { RouteConfig } from '@server/common/routes.config';
import companyProfileRouter from '@server/modules/company/routes/profile.route';

const CompanyModule: RouteConfig = {
  prefix: 'company',
  routes: [companyProfileRouter],
};

export default CompanyModule;
