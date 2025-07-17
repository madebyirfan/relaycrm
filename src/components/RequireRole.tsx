// src/components/RequireRole.tsx
import { Navigate } from 'react-router-dom';
import useAppSelector from '../hooks/useAppSelector';
import { Spin } from 'antd';

interface RequireRoleProps {
  children: React.ReactNode;
  role: 'admin' | 'user';
}

const RequireRole = ({ children, role }: RequireRoleProps) => {
  const { user, loading, role: userRole } = useAppSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  if (userRole !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default RequireRole;
