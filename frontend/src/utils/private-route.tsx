import { AuthContext } from '@/context/auth-context';
import { useContext, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  children: ReactNode;
  allowedRoles: string[]; // Mudança para aceitar um array de roles
}

const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const { userData } = useContext(AuthContext);
  const location = useLocation();

  if (!userData || !allowedRoles.includes(userData.role)) { // Verifica se a role está no array
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
