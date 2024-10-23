import { CreateCompanyProfile } from '@/app/company/create/page';
import CompanyDashboardPage from '@/app/company/dashboard/page';
import type { IndexRouteObject, RouteObject } from 'react-router-dom';

const CompanyRoutes: (IndexRouteObject | RouteObject)[] = [
  {
    path: 'create',
    element: <CreateCompanyProfile />,
  },
  {
    index: true,
    element: <CompanyDashboardPage />,
  },
];

export { CompanyRoutes };
