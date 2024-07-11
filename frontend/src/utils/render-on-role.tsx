import { useContext } from 'react';
import { AuthContext } from '@/context/auth-context';

interface RenderOnRoleProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const RenderOnRole = ({ allowedRoles, children }: RenderOnRoleProps) => {
  const { userData } = useContext(AuthContext);

  if (!userData || !allowedRoles.includes(userData.role)) {
    return null;
  }

  return <>{children}</>;
};

export default RenderOnRole;
