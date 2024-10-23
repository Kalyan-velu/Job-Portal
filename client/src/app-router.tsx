import { AuthRouter } from '@/app/(auth)/auth-router';
import { AuthLayout } from '@/app/(auth)/layout';
import { CompanyRoutes } from '@/app/company/company-routes';
import { RootLayout } from '@/app/layout';
import { store } from '@/store';
import { userApi } from '@/store/services/user.service';
import type { Role } from '@/types';
import {
  createBrowserRouter,
  redirect,
  type LoaderFunctionArgs,
} from 'react-router-dom';

const getTokenAndRole = () => ({
  token: localStorage.getItem('token'),
  role: localStorage.getItem('role') as Role | null,
});

const handleRedirect = async ({
  token,
  role,
}: {
  token: string | null;
  role: Role | null;
}) => {
  if (token) {
    const { data, isError } = await store.dispatch(
      userApi.endpoints.getUser.initiate(undefined)
    );
    console.debug('ℹ️ ~ file: app-router.tsx:26 ~ data:', data);

    if (isError) {
      console.error('Failed to fetch user data');
      return redirect('/login'); // Handle error: redirect to login or error page
    }

    return data?.role === 'applicant'
      ? redirect('/app/jobs')
      : redirect('/app/company');
  }
  return redirect('/login');
};

const fetchUserAndRedirect = async (args: LoaderFunctionArgs<any>) => {
  const url = args.request.url;
  console.log(url);
  const { token, role } = getTokenAndRole();
  if (!token) {
    return redirect('/');
  }
  if (url.includes('/app/jobs') && role === 'employer') {
    return redirect('/app/company');
  } else if (url.includes('/app/company') && role === 'applicant') {
    return redirect('/app/jobs');
  }
  return null;
};

export const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        loader: async () => {
          const { token, role } = getTokenAndRole();
          return await handleRedirect({ token, role });
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
            children: CompanyRoutes,
          },
          {
            path: 'jobs',
            element: <>Jobs</>,
          },
        ],
      },
    ],
  },
]);
