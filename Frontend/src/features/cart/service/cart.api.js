import axios from 'axios';

const api = axios.create({
    baseURL: '/api/cart',
    withCredentials: true,
});

// Error interceptor to extract error messages from the backend
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

// ── GET CART ────────────────────────────────────────────────────────────────
export const fetchCartAPI = async () => {
    const response = await api.get('/get');
    return response.data;
};

// ── ADD TO CART ──────────────────────────────────────────────────────────────
export const addToCartAPI = async (productId, quantity, size) => {
    const response = await api.post(`/add/${productId}`, { quantity, size });
    return response.data;
};

// ── DECREMENT / REMOVE ITEM ──────────────────────────────────────────────────
export const decrementItemAPI = async (cartItemId) => {
    const response = await api.post(`/decrement/${cartItemId}`);
    return response.data;
};

export const removeItemAPI = async (cartItemId) => {
    const response = await api.delete(`/remove/${cartItemId}`);
    return response.data;
};

export default api;
