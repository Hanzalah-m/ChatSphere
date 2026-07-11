import { memo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate,Navigate } from 'react-router-dom';
const Protected = ({children}) => {
    const navigate = useNavigate();
    const { loading, user } = useAuth();
    if (loading) {
        return <div className="flex h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#408A71]"></div>
        </div>;
    }

    if(!user){
        return <Navigate to={'/'} />
    }
 
  return (
    children
  );
};

export default memo(Protected);