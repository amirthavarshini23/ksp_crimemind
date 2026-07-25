import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white text-slate-500 select-none font-sans">
        <div className="space-y-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="text-xs uppercase tracking-widest font-semibold text-blue-600">Verifying Credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page, saving the original location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles) {
    const userRole = user.role.replace(" ", "").toLowerCase();
    const hasAccess = allowedRoles.some(role => role.replace(" ", "").toLowerCase() === userRole);
    
    if (!hasAccess) {
      // Redirect to dashboard with a fallback banner
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};
export default ProtectedRoute;
