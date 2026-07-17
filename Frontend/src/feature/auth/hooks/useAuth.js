// src/features/auth/hooks/useAuth.js
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser, setLoading } from '../../../store/userSlice';
import { loginUser, registerUser, logoutUser, getProfile, updateProfile, updateProfilePicture, deleteProfilePicture } from '../auth.api';

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

    const handleUpdateProfilePicture = async (imageFile) => {
        dispatch(setLoading(true));
        try {
            const userData = await updateProfilePicture(imageFile);
            dispatch(setUser(userData?.user ?? userData));
            return {
                success: true,
                user: userData?.user ?? userData
            }
        } catch (error) {
            console.error("Updating profile picture failed:", error);
            return {
                success: false,
                message: error?.message || "Failed to update profile picture. Please try again."
            }
        }
        finally {
            dispatch(setLoading(false));
        }
    }

    const handleUpdateProfile = async ({ name, email, username }) => {
        dispatch(setLoading(true));
        try {
            const userData = await updateProfile({ name, email, username });
            dispatch(setUser(userData?.user ?? userData));
            return {
                success: true,
                user: userData?.user ?? userData
            }
        } catch (error) {
            console.error("Updating profile failed:", error);
            return {
                success: false,
                message: error?.message || "Failed to update profile picture. Please try again."
            }
        }
        finally {
            dispatch(setLoading(false));
        }
    }

    const handleDeleteProfilePicture = async () => {
        dispatch(setLoading(true));
        try {
            const userData = await deleteProfilePicture();
            dispatch(setUser(userData?.user ?? userData));
            return {
                success: true,
                user: userData?.user ?? userData
            }
        }
        catch (error) {
            console.error("Deleting profile picture failed:", error);
            return {
                success: false,
                message: error?.message || "Failed to delete profile picture. Please try again."
            }
        }
        finally {
            dispatch(setLoading(false));
        }   
    }

    return {
        user,
        loading,
        handleLogin,
        handleRegister,
        handleLogout,
        fetchCurrentUser,
        handleUpdateProfilePicture,
        handleUpdateProfile,
        handleDeleteProfilePicture
    }
}

export { useAuth };