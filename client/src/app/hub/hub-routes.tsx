import ApplicantApplications from '@/app/hub/my-applications/page'
import { JobPortal } from '@/app/hub/page'
import type { IndexRouteObject, RouteObject } from 'react-router-dom'

const HubRoutes: (IndexRouteObject | RouteObject)[] = [
  {
    path: '',
    children: [
      {
        index: true,
        element: <JobPortal />,
      },
      {
        path: 'my-applications',
        element: <ApplicantApplications />,
      },
      // {
      //   path: 'active',
      //   element: <AllActiveCompanyJobs />,
      // },
      // {
      //   path: 'archived',
      //   element: <ArchivedCompanyJobs />,
      // },
    ],
  },
]

export { HubRoutes }
