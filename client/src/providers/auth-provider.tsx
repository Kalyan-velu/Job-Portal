// AuthContext.js
import { AuthContext } from '@/hooks/useSession';
import { useGetUserQuery } from '@/store/services/user.service';
import { useContext, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: user,
    isLoading,
    isSuccess,
    isError,
    originalArgs,
  } = useGetUserQuery(); // Fetch user data
  const navigate = useNavigate(); // Get the navigate function

  const isAuthenticated = isSuccess && !user; // Check if user is logged in

  // Optional: Handle loading and error states
  if (isLoading) return <div>Loading...</div>; // Show loading state

  return (
    <AuthContext.Provider value={{ user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
