import { memo,createContext, useState, useEffect } from 'react';
import { getProfile } from '../api/authApi';

export const AuthContext = createContext();

const authProvider = ({childen}) => {

    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try{
                const profile = await getProfile();
                setUser(profile);
            }catch(err){
                setUser(null);
            }
            setLoading(false);
        }
        fetchProfile();
    },[])

  return (
    <AuthContext.Provider value={{user,loading,setUser,setLoading}}>
        {childen}
    </AuthContext.Provider>
  )
};

export default memo(authContext);