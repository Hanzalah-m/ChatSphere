import axios from "axios";

const api = axios.create ({
    baseURL: "http://localhost:300",
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
    }catch(err){
        throw error.response ? error.response.data : new Error("Network Error");
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

export{registerUser,loginUser,logoutUser,getProfile}