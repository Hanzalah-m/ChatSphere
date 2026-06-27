import { useContext } from "react";
import { AuthContext } from "../state/authContext";
import { loginUser, registerUser, logoutUser, getProfile } from "../services/auth.api";

const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async (identifier, password) => {
        setLoading(true)
        try {
            const userData = await loginUser(identifier, password)
            setUser(userData?.user ?? userData)
            return {
                success: true,
                user: userData?.user ?? userData
            }
        } catch (err) {
            console.log("Login failed", err)
            return {
                success: false,
                message: err?.response?.data?.message || "Invalid username or password"
            }

        }
        finally {
            setLoading(false)
        }
    }

    const handleRegister = async (username, email, password, profilePicture, name) => {
        setLoading(true)
        try {
            const userData = await registerUser(username, email, password, profilePicture, name)
            setUser(userData?.user ?? userData)
            return {
                success: true,
                user: userData?.user ?? userData
            }

        } catch (error) {
            console.log("Registration failed", error)
            return {
                success: false,
                message: error?.response?.data?.message || (typeof error === "string" ? error : "Registration failed. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {

        setLoading(true)
        try {
            await logoutUser()
            setUser(null)
            return {
                success: true,
            }
        } catch (err) {
            console.log("Network Error....", err)
            return {
                success: false,
                message: err?.response?.data?.message || "LogOut Failed try again"
            }
        }
        finally {
            setLoading(false)
        }

    }

    const fetchCurrentUser = async () => {
        setLoading(true);
        try {
            const userData = await getProfile();
            setUser(userData?.user ?? userData);
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

export { useAuth };