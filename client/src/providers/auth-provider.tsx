// AuthContext.js
import { AuthContext } from '@/hooks/useSession'
import { useGetUserQuery } from '@/store/services/user.service'
import { useContext, useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: user, isLoading, isError,originalArgs } = useGetUserQuery(); // Fetch user data
  const navigate = useNavigate(); // Get the navigate function

  const isAuthenticated = !!user; // Check if user is logged in

  // Optional: Handle loading and error states
  if (isLoading) return <div>Loading...</div>; // Show loading state

  // Redirect unauthenticated users to the login page
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); // Redirect to login page
    }else if(isError){
      toast.error("Couldn\'t fetch user data.")
    }
  }, [isAuthenticated,isError, navigate]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
