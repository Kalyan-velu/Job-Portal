import { AllCompanyJobs } from "@/app/company/dashboard/jobs/all/page";
import { CompanyProfilePage } from "@/app/company/dashboard/profile/page";
import { store } from "@/store";
import { companyApi } from "@/store/services/company.service";
import type { IndexRouteObject, RouteObject } from "react-router-dom";

const CompanyRoutes: (IndexRouteObject | RouteObject)[] = [
  {
    index: true,
    element: <>Hello</>,
  },
  {
    path: "jobs",
    children: [
      {
        index: true,
        element: <AllCompanyJobs />,
      },
      {
        path: "posted",
        element: <>Posted Jobs</>,
      },
    ],
  },
  {
    path: "profile",
    loader: async () => {
      try {
        const { data, isError } = await store.dispatch(
          companyApi.endpoints.getMyCompany.initiate(),
        );
        if (data && !isError) {
          return null;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        return null;
      }
    },
    element: <CompanyProfilePage />,
  },
  {
    path: "settings",
    element: <>Company Settings</>,
  },
];

export { CompanyRoutes };
