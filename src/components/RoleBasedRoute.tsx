import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import type { UserSession } from '../types';

interface RoleBasedRouteProps {
  session: UserSession | null;
  requiredRole?: 'admin' | 'user';
}

export default function RoleBasedRoute({
  session,
  requiredRole = 'user',
  children,
}: PropsWithChildren<RoleBasedRouteProps>) {
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'admin' && !session.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
