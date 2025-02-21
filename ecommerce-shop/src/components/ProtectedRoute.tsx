
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../redux/store';


interface ProtectedRouteProps {
  children: ReactNode; 
  roles: string[];    
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { isAuthenticated, userRoles } = useSelector((state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
    userRoles: state.auth.roles,
  }));

  if (!isAuthenticated) {
    return <Navigate to="/dang-nhap" />;
  }
  const hasPermission = roles.some((role) => userRoles.includes(role));

  if (!hasPermission) {
    return <Navigate to="/unauthorized" />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
