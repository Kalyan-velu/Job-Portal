import type { User } from '@/types';
import { createContext, useContext } from 'react';

export const AuthContext = createContext<
  { isAuthenticated: boolean; user: User | null | undefined } | undefined
>(undefined);

export const useSession = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw Error('AuthContext should be used with in AuthContextProvider');
  }
  return context;
};
