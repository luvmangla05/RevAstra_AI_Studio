import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowUnonboarded?: boolean;
}

export default function ProtectedRoute({ children, allowUnonboarded = false }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-astra-navy flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-astra-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-300 font-mono font-medium">Securing session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to Onboarding if user registered but hasn't completed onboarding profile
  if (!user.onboardingCompleted && !allowUnonboarded && location.pathname !== '/app/onboarding') {
    return <Navigate to="/app/onboarding" replace />;
  }

  return <>{children}</>;
}
