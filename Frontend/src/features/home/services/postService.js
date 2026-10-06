import api from "../../auth/services/authService";

/**
 * Create a new post
 */
export async function createPost(formData) {
    const response = await api.post("/api/posts/create", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}

/**
 * Get latest posts for Home page
 */
export async function getLatestPosts() {
    const response = await api.get("/api/posts/latest");

    return response.data;
}

/**
 * Get all posts for Explore page
 */
export async function getAllPosts(
    page = 1,
    limit = 12,
    filters = {}
) {
    const params = new URLSearchParams({
        page,
        limit,
    });

    if (filters.search?.trim()) {
        params.append("search", filters.search.trim());
    }

    if (filters.location?.trim()) {
        params.append("location", filters.location.trim());
    }

    if (filters.status) {
        params.append("status", filters.status);
    }

    const response = await api.get(
        `/api/posts/allPosts?${params.toString()}`
    );

    return response.data;
}

export async function getMyPosts() {
    const response = await api.get("/api/posts/getMyPosts");
    return response.data;
}

export async function getPostById(id) {
    const response = await api.get(`/api/posts/${id}`);
    return response.data;
}
