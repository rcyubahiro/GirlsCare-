import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  isLoggedIn: boolean;
}

export default function ProtectedRoute({ isLoggedIn, children }: PropsWithChildren<ProtectedRouteProps>) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
