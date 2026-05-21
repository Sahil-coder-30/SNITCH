import axios from 'axios';

const api = axios.create({
    baseURL: '/api/auth',
    withCredentials: true,
});

// ── Error interceptor: extract backend message ───────────────────────────────
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

// ── REGISTER ────────────────────────────────────────────────────────────────
// Schema: { username, email, password, confirmPassword, contact?, role }
export const register = async (username, email, password, confirmPassword, contact = '', role = 'BUYER') => {
    const result = await api.post('/register', {
        username,
        email,
        password,
        confirmPassword,
        contact,
        role,
    });
    return result.data;
};

// ── LOGIN ────────────────────────────────────────────────────────────────────
export const login = async (email, password) => {
    const result = await api.post('/login', { email, password });
    return result.data;
};

// ── LOGOUT ───────────────────────────────────────────────────────────────────
export const logout = async () => {
    const result = await api.post('/logout');
    return result.data;
};

// ── SET / CREATE PASSWORD ────────────────────────────────────────────────────
// Called after Google OAuth to set the first password
export const setPassword = async (email, password, confirmPass) => {
    const result = await api.post('/setPassword', { email, password, confirmPass });
    return result.data;
};

// ── OTP ──────────────────────────────────────────────────────────────────────
export const resendOtp = async (email) => {
    const result = await api.post('/resend-otp', { email });
    return result.data;
};

export const verifyOtp = async (email, otp) => {
    const result = await api.post('/verify-otp', { email, otp });
    return result.data;
};

// ── FORGOT / RESET PASSWORD ───────────────────────────────────────────────────
export const forgetPassword = async (email) => {
    const result = await api.post('/Forget-password', { email });
    return result.data;
};

export const resetPassword = async (email, otp, password, confirmPass) => {
    const result = await api.post('/reset-password', { email, otp, password, confirmPass });
    return result.data;
};

// ── GET ME ───────────────────────────────────────────────────────────────────
export const getMe = async () => {
    const result = await api.get('/Get-Me');
    return result.data;
};

// ── GOOGLE OAUTH (redirect-based) ─────────────────────────────────────────────
export const GOOGLE_AUTH_URL = '/api/auth/google';

export default api;
