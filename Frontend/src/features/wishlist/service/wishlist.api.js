import axios from 'axios';

const api = axios.create({
    baseURL: '/api/wishlist',
    withCredentials: true,
});

// Error interceptor to extract backend error messages
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const backendMsg =
            error?.response?.data?.message ||
            error?.response?.data?.error  ||
            error?.message                ||
            'Something went wrong. Please try again.';
        const enhanced = new Error(backendMsg);
        enhanced.status = error?.response?.status;
        enhanced.data   = error?.response?.data;
        return Promise.reject(enhanced);
    }
);

// ── GET WISHLIST ─────────────────────────────────────────────────────────────
export const fetchWishlistAPI = async () => {
    const response = await api.get('/');
    return response.data;
};

// ── ADD TO WISHLIST ──────────────────────────────────────────────────────────
export const addToWishlistAPI = async (productId, size) => {
    const response = await api.post(`/add/${productId}`, { size });
    return response.data;
};

// ── REMOVE FROM WISHLIST ─────────────────────────────────────────────────────
export const removeFromWishlistAPI = async (productId, size) => {
    const response = await api.post(`/remove/${productId}`, { size });
    return response.data;
};

// ── CHECK IF PRODUCT IS IN WISHLIST ──────────────────────────────────────────
export const checkWishlistStatusAPI = async (productId) => {
    const response = await api.get(`/check/${productId}`);
    return response.data;
};

export default api;
