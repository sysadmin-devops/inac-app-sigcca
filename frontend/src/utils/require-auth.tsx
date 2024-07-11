import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './use-auth';
import Loading from '@/components/common/loading';

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
}
