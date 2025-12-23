import { AuthRouter } from '@/app/(auth)/auth-router'
import { AuthLayout } from '@/app/(auth)/layout'
import { CompanyRoutes } from '@/app/company/company-routes'
import { CreateCompanyProfile } from '@/app/company/create/page'
import { CompanyDashboardPage } from '@/app/company/dashboard/layout'
import { HubRoutes } from '@/app/hub/hub-routes'
import { JobHubLayout } from '@/app/hub/layout'
import { RootLayout } from '@/app/layout'
import NotFound from '@/components/not-found'
import { store } from '@/store'
import { userApi } from '@/store/services/user.service'
import type { Role } from '@/types'
import { createBrowserRouter, type LoaderFunctionArgs, redirect, } from 'react-router-dom'
import Home from '@/app/page.tsx'

const getTokenAndRole = () => ({
  token: localStorage.getItem('token'),
  role: localStorage.getItem('role') as Role | null,
})

const handleRedirect = async ({
  token
}: {
  token: string | null
  role?: Role | null
}) => {
  if (token) {
    const { data, isError } = await store.dispatch(
      userApi.endpoints.getUser.initiate(undefined),
    )

    if (isError) {
      return redirect('/') // Handle error: redirect to login or error page
    }

    return data?.role === 'applicant'
      ? redirect('/app/jobs')
      : redirect('/app/employer')
  }
  return null
}

const fetchUserAndRedirect = async (args: LoaderFunctionArgs<unknown>) => {
  const { token, role } = getTokenAndRole()
  const url = args.request.url

  if (!token) {
    if(url.endsWith('/app/employer')){
      return redirect('/login?redirectTo=/app/employer&role=employer')
    }
    if(url.endsWith('/app/jobs')){
      return redirect('/login?redirectTo=/app/jobs&role=applicant')
    }
    return redirect('/')
  }

  const { data } = await store.dispatch(
    userApi.endpoints.getUser.initiate(undefined),
  )

  const redirectTo = (() => {
    if(role==='applicant' && url.includes('/app/employer')){
      return '/app/employer'
    }
    if(role==='employer' && url.includes('/app/jobs')){
      return '/app/employer'
    }
    if (
      role === 'employer' &&
      data?.companyId &&
      url.endsWith('/app/employer/create')
    ) {
      return '/app/employer'
    }
    if (
      role === 'applicant' &&
      data?.applicantId &&
      url.includes('/app/employer')
    ) {
      return '/app/jobs'
    }
    if (
      role === 'employer' &&
      !data?.companyId &&
      url.endsWith('/app/employer')
    ) {
      return '/app/employer/create'
    }

    return null
  })()

  if (redirectTo) {
    return redirect(redirectTo)
  }

  // If no redirect logic applies, return null to proceed as usual
  return null
}

export const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element:<Home/>,
        loader: async () => {
          const { token, role } = getTokenAndRole()
          return await handleRedirect({ token, role })
        },
      },
      {
        element: <AuthLayout />,
        children: AuthRouter,
      },
      {
        path: 'app',
        loader: fetchUserAndRedirect,
        children: [
          {
            path: 'employer',
            element: <CompanyDashboardPage />,
            children: CompanyRoutes,
          },
          {
            path: 'employer/create',
            element: <CreateCompanyProfile />,
          },
          {
            path: 'jobs',
            element: <JobHubLayout />,
            children: HubRoutes,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
