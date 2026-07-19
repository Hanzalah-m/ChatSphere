import api from "../../APIs";

export const searchUsersApi = async (query) => {
    const trimmedQuery = query?.trim();
    if (!trimmedQuery) return [];

    const response = await api.get("/api/users/search", {
        params: { query: trimmedQuery }
    });

    return response.data?.users || [];
};
