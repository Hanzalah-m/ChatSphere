import { useContext } from "react";
import { AuthContext } from "../state/authContext";
import { loginUser,registerUser,logoutUser,getProfile } from "../services/auth.api";

const useAuth = () => {
    const context = useContext(AuthContext)
    const {user,setUser,loading,setLoading} = context;

    const handleLogin = async (identifier,password) => {
        setLoading(true)
        try{
            const userData = loginUser(identifier,password)
            setUser=(userData.user)
            return {
                success: true
            }
        }catch(err){
            console.log("Login failed")
            return {
                success : false,
                message : err.response?.data?.message || "Invalid username or password"
            }

        }
        finally{
            setLoading(false)
        }
    }

    const handleRegister = async (username,email,password,profilePicture,name) => {
        setLoading(true)
        try{
            const userData = registerUser(username,email,password,profilePicture)
                setUser(userData.user)
                return {
                    success : true
                }
            
        }catch(error){
            console.log("Login failed")
            return{
                success : false,
                message : error.response?.data?.message  || (typeof error === "string" ? error : "Registration failed. Please try again.")
            }
        }finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {

        setLoading(true)
        try{
            const userData = logoutUser()
            setUser("")
            return{
                success:true,
            }
        }catch(err){
            console.log("Network Error....")
            return {
                success:false,
                message : response.err?.data?.message || "LogOut Failed try again"
            }
        }
        finally{
            setLoading(false)
        }
        
    }

    const fetchCurrentUser = async () => {
        setLoading(true);
        try {
            const userData = await getProfile();
            setUser(userData.user);
        }
        catch (error) {
            console.error("Fetching current user failed:", error);
        }
        finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        handleLogin,
        handleRegister,
        handleLogout,
        fetchCurrentUser
    }



}

export default {useAuth};