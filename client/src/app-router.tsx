import { AuthRouter } from '@/app/(auth)/auth-router'
import { AuthLayout } from '@/app/(auth)/layout'
import { CompanyRoutes } from '@/app/company/company-routes'
import { CreateCompanyProfile } from '@/app/company/create/page'
import { CompanyDashboardPage } from '@/app/company/dashboard/layout'
import { RootLayout } from '@/app/layout'
import { store } from '@/store'
import { userApi } from '@/store/services/user.service'
import type { Role } from '@/types'
import {
  createBrowserRouter,
  redirect,
  type LoaderFunctionArgs,
} from 'react-router-dom'

const getTokenAndRole = () => ({
  token: localStorage.getItem('token'),
  role: localStorage.getItem('role') as Role | null,
})

const handleRedirect = async ({
  token,
  role,
}: {
  token: string | null
  role: Role | null
}) => {
  if (token) {
    const { data, isError } = await store.dispatch(
      userApi.endpoints.getUser.initiate(undefined),
    )
    console.debug('ℹ️ ~ file: app-router.tsx:26 ~ data:', data)

    if (isError) {
      console.error('Failed to fetch user data')
      return redirect('/login') // Handle error: redirect to login or error page
    }

    return data?.role === 'applicant'
      ? redirect('/app/jobs')
      : redirect('/app/company')
  }
  return redirect('/login')
}

const fetchUserAndRedirect = async (args: LoaderFunctionArgs<any>) => {
  const { token, role } = getTokenAndRole()
  const url = args.request.url

  if (!token) {
    return redirect('/')
  }

  const { data } = await store.dispatch(
    userApi.endpoints.getUser.initiate(undefined),
  )

  const redirectTo = (() => {
    if (
      role === 'employer' &&
      data?.companyId &&
      url.endsWith('/app/company/create')
    ) {
      return '/app/company'
    }
    // if (
    //   role === 'applicant' &&
    //   data?.applicantId &&
    //   url.endsWith('/app/applicant/create-profile')
    // ) {
    //   return '/app/jobs';
    // }
    //   if (role === 'employer' && data?.companyId && url.endsWith('/app/jobs')) {
    //     return '/app/company';
    //   }
    if (
      role === 'applicant' &&
      data?.applicantId &&
      url.includes('/app/company')
    ) {
      return '/app/jobs'
    }
    if (
      role === 'employer' &&
      !data?.companyId &&
      url.endsWith('/app/company')
    ) {
      return '/app/company/create'
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
            path: 'company',
            element: <CompanyDashboardPage />,
            children: CompanyRoutes,
          },
          {
            path: 'company/create',
            element: <CreateCompanyProfile />,
          },
          {
            path: 'jobs',
            element: <>Jobs</>,
          },
        ],
      },
    ],
  },
])
