// Legacy hook - replaced by AuthContext
// This is kept for backward compatibility with existing components
import { useAuth as useAuthContext } from "@/contexts/AuthContext";

export function useAuth() {
  const authContext = useAuthContext();
  
  return {
    user: authContext.user,
    isLoading: authContext.isLoading,
    isAuthenticated: authContext.isAuthenticated,
  };
}
