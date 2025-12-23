import { AuthRouter } from '@/app/(auth)/auth-router'
import { AuthLayout } from '@/app/(auth)/layout'
import { CompanyRoutes } from '@/app/company/company-routes'
import { CreateCompanyProfile } from '@/app/company/create/page'
import { CompanyDashboardPage } from '@/app/company/dashboard/layout'
import { HubRoutes } from '@/app/hub/hub-routes'
import { JobHubLayout } from '@/app/hub/layout'
import { RootLayout } from '@/app/layout'
import Home from '@/app/page.tsx'
import NotFound from '@/components/not-found'
import { store } from '@/store'
import { userApi } from '@/store/services/user.service'
import {
  createBrowserRouter,
  type LoaderFunctionArgs,
  redirect,
} from 'react-router-dom'

const fetchUserAndRedirect = async (args: LoaderFunctionArgs<unknown>) => {
  const { request } = args
  const url = new URL(request.url)

  const { data, isError } = await store.dispatch(
    userApi.endpoints.getUser.initiate(undefined),
  )

  const isAuthRoute =
    ['/login', '/register', '/forgot-password', '/reset-password'].some(
      (path) => url.pathname.startsWith(path),
    ) || url.pathname === '/'

  if (isError || !data) {
    if (url.pathname.startsWith('/app')) {
      const params = new URLSearchParams()
      params.set('redirectTo', url.pathname + url.search)
      params.set(
        'role',
        url.pathname.includes('employer') ? 'employer' : 'applicant',
      )
      return redirect(`/login?${params.toString()}`)
    }
    return null
  }

  const role = data.role
  const dashboard = role === 'employer' ? '/app/employer' : '/app/jobs'

  if (isAuthRoute) {
    return redirect(dashboard)
  }

  if (url.pathname.startsWith('/app')) {
    if (role === 'applicant' && url.pathname.startsWith('/app/employer')) {
      return redirect('/app/jobs')
    }
    if (role === 'employer') {
      if (url.pathname.startsWith('/app/jobs')) {
        return redirect('/app/employer')
      }
      if (!data.companyId && !url.pathname.startsWith('/app/employer/create')) {
        return redirect('/app/employer/create')
      }
      if (data.companyId && url.pathname.startsWith('/app/employer/create')) {
        return redirect('/app/employer')
      }
    }
  }

  return null
}

export const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    loader: fetchUserAndRedirect,
    children: [
      {
        index: true,
        element: <Home />,
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
