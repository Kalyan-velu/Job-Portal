import EmployerApplications from '@/app/company/dashboard/applications/all/page'
import { AllActiveCompanyJobs } from '@/app/company/dashboard/jobs/active/page'
import { AllCompanyJobs } from '@/app/company/dashboard/jobs/all/page'
import { ArchivedCompanyJobs } from '@/app/company/dashboard/jobs/archived/page'
import { CompanyProfilePage } from '@/app/company/dashboard/profile/page'
import { store } from '@/store'
import { companyApi } from '@/store/services/company.service'
import type { IndexRouteObject, RouteObject } from 'react-router-dom'

const CompanyRoutes: (IndexRouteObject | RouteObject)[] = [
  {
    index: true,
    element: <>Hello</>,
  },
  {
    path: 'jobs',
    children: [
      {
        index: true,
        element: <AllCompanyJobs />,
      },
      {
        path: 'active',
        element: <AllActiveCompanyJobs />,
      },
      {
        path: 'archived',
        element: <ArchivedCompanyJobs />,
      },
    ],
  },
  {
    path: 'applications',
    children: [
      {
        index: true,
        element: <EmployerApplications />,
      },
      {
        path: 'active',
        element: <AllActiveCompanyJobs />,
      },
      {
        path: 'archived',
        element: <ArchivedCompanyJobs />,
      },
    ],
  },
  {
    path: 'profile',
    loader: async () => {
      try {
        const { data, isError } = await store.dispatch(
          companyApi.endpoints.getMyCompany.initiate(),
        )
        if (data && !isError) {
          return null
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        return null
      }
    },
    element: <CompanyProfilePage />,
  },
  {
    path: 'settings',
    element: <>Company Settings</>,
  },
]

export { CompanyRoutes }
