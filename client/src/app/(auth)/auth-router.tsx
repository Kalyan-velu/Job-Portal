import LoginPage from '@/app/(auth)/login/page';
import { Signup } from '@/app/(auth)/signup/page';
import type { IndexRouteObject, NonIndexRouteObject } from 'react-router-dom';
const AuthRouter: (IndexRouteObject | NonIndexRouteObject)[] = [
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: 'register',
    element: <Signup />,
  },
];

export { AuthRouter };
