import type { RouteConfig } from '@/common/routes.config';
import companyProfileRouter from '@/modules/company/routes/profile.route';

const CompanyModule: RouteConfig = {
  prefix: 'company',
  routes: [companyProfileRouter],
};

export default CompanyModule;
