// src/features/auth/hooks/useAuth.js
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser, setLoading } from '../../store/userSlice';
import { loginUser, registerUser, logoutUser, getProfile } from '../services/auth.api';

const useAuth = () => {
    const dispatch = useDispatch();

    // Replaces: const { user, setUser, loading, setLoading } = useContext(AuthContext)
    const user = useSelector((state) => state.user.user);
    const loading = useSelector((state) => state.user.loading);

    const handleLogin = async (identifier, password) => {
        dispatch(setLoading(true))                    // was: setLoading(true)
        try {
            const userData = await loginUser(identifier, password)
            dispatch(setUser(userData?.user ?? userData))  // was: setUser(...)
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
            dispatch(setLoading(false))               // was: setLoading(false)
        }
    }

    const handleRegister = async (username, email, password, profilePicture, name) => {
        dispatch(setLoading(true))                    // was: setLoading(true)
        try {
            const userData = await registerUser(username, email, password, profilePicture, name)
            dispatch(setUser(userData?.user ?? userData))  // was: setUser(...)
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
            dispatch(setLoading(false))               // was: setLoading(false)
        }
    }

    const handleLogout = async () => {
        dispatch(setLoading(true))                    // was: setLoading(true)
        try {
            await logoutUser()
            dispatch(clearUser())                     // was: setUser(null)
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
            dispatch(setLoading(false))               // was: setLoading(false)
        }
    }

    const fetchCurrentUser = async () => {
        dispatch(setLoading(true));                   // was: setLoading(true)
        try {
            const userData = await getProfile();
            dispatch(setUser(userData?.user ?? userData));  // was: setUser(...)
        }
        catch (error) {
            console.error("Fetching current user failed:", error);
        }
        finally {
            dispatch(setLoading(false));              // was: setLoading(false)
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