import { ForgotPassword } from '@/app/(auth)/forgot-password/page'
import LoginPage from '@/app/(auth)/login/page'
import ResetPassword from '@/app/(auth)/reset-password/page'
import { Signup } from '@/app/(auth)/signup/page'
import { VerifyEmailCard } from '@/app/(auth)/verify-email/page'
import { store } from '@/store'
import { userApi } from '@/store/services/user.service'
import {
  redirect,
  type IndexRouteObject,
  type NonIndexRouteObject,
} from 'react-router-dom'
const AuthRouter: (IndexRouteObject | NonIndexRouteObject)[] = [
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: 'register',
    element: <Signup />,
  },
  {
    path: 'forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: 'reset-password',
    loader: async () => {
      return redirect('/login')
    },
  },
  {
    path: 'reset-password/:token',
    element: <ResetPassword />,
    loader: async ({ params }) => {
      if (!params.token) {
        return redirect('/login')
      }
      return null
    },
  },
  {
    path: 'verify-email',
    element: <VerifyEmailCard />,
  },
  {
    path: 'email-verification/:token',
    loader: async ({ params }) => {
      if (!params.token) {
        return redirect('/')
      }
      const { data } = await store.dispatch(
        userApi.endpoints.verifyEmail.initiate(params.token),
      )
      if (data?.verified) {
        return redirect('/login?email-verifed=true')
      }
      return null
    },
  },
]

export { AuthRouter }
