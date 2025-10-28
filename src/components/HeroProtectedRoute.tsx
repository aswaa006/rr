import React from 'react';
import { Navigate } from 'react-router-dom';
import { useHeroAuth } from '@/contexts/HeroAuthContext';
import { Loader2 } from 'lucide-react';

interface HeroProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true for protected routes, false for auth routes
}

const HeroProtectedRoute: React.FC<HeroProtectedRouteProps> = ({ children, requireAuth = true }) => {
  const { hero, isLoading, isAuthenticated } = useHeroAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg text-muted-foreground">Loading authentication...</span>
      </div>
    );
  }

  if (requireAuth) {
    if (!isAuthenticated()) {
      return <Navigate to="/hero-login" replace />;
    }
  } else { // For auth routes like login/signup
    if (isAuthenticated()) {
      return <Navigate to="/driver-dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default HeroProtectedRoute;
