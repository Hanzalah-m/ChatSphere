import { useAuth } from '../hooks/useAuth';
import { useNavigate,Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  return user ? <Navigate to="/dashboard" replace /> : children;
};


export default PublicRoute;
