import axios from "axios";

const api = axios.create ({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

async function registerUser(username,email,password,profilePicture,name) {
    try {
        const response = await api.post("/api/auth/register",{username,email,password,profilePicture,name});
        return response.data;
    } catch(error){
        throw error.response?error.response.data: new Error("Network Error");
    }
}

async function loginUser(identifier, password) {

    try{
        const response = await api.post("/api/auth/login",{identifier, password})
        return response.data;
    }catch(err){
        throw err?.response ? err.response.data : new Error("Network Error");
    }
    
}

async function logoutUser() {
    try{
        const response = await api.post("/api/auth/logout",{})
        return response.data
    }catch(error){
        throw error.response ? error.response.data : new Error("Network Error");
    }
    
}

async function getProfile() {
    try{
        const response = await api.get('/api/auth/profile',{});
        return response.data;
    }catch(error){
        throw error.response ? error.response.data : new Error("Network Error")
    }
    
}

async function updateProfilePicture(imageFile) {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await api.put('/api/auth/profile/picture', formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }

}

async function updateProfile({name,email,username}) {
    try{
        const response = await api.put('/api/auth/profile',{name,email,username});
        return response.data;
    }catch(error){
        throw error.response ? error.response.data : new Error("Network Error");
    }
}

async function deleteProfilePicture() {
    try {
        const response = await api.delete('/api/auth/profile/picture');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }

}

export {registerUser,loginUser,logoutUser,getProfile,updateProfilePicture,updateProfile,deleteProfilePicture}