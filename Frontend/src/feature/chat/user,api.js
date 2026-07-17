import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
});

export const searchUsersApi = async (query) => {
    const trimmedQuery = query?.trim();
    if (!trimmedQuery) return [];

    const response = await api.get("/api/users/search", {
        params: { query: trimmedQuery }
    });

    return response.data?.users || [];
};
