import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import Loading from '../../../shared/Loading';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Loading
        message="Preparing your chat experience"
        subtext="Hang tight — your dashboard is loading."
      />
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
