import { useDispatch } from 'react-redux';
import {
    login,
    register,
    logout,
    setPassword,
    resendOtp,
    verifyOtp,
    forgetPassword,
    resetPassword,
    getMe,
} from '../services/auth.api';
import { setUser, setLoading, setError } from '../slice/auth.slice';

export const useAuth = () => {
    const dispatch = useDispatch();

    // ── Login ────────────────────────────────────────────────────────────────
    const authLogin = async (email, password) => {
        try {
            dispatch(setLoading(true));
            await login(email, password);
            const userResponse = await getMe();
            dispatch(setUser(userResponse.user));
            return userResponse.user;
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // ── Register ─────────────────────────────────────────────────────────────
    const authRegister = async (username, email, password, confirmPassword, contact = '', role = 'BUYER') => {
        try {
            dispatch(setLoading(true));
            const result = await register(username, email, password, confirmPassword, contact, role);
            dispatch(setUser(result));
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // ── Logout ───────────────────────────────────────────────────────────────
    const authLogout = async () => {
        try {
            dispatch(setLoading(true));
            await logout();
            dispatch(setUser(null));
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // ── Set/Create Password (post-Google OAuth) ───────────────────────────────
    const authSetPassword = async (email, password, confirmPass) => {
        try {
            dispatch(setLoading(true));
            const result = await setPassword(email, password, confirmPass);
            dispatch(setUser(result));
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // ── Resend OTP ────────────────────────────────────────────────────────────
    const authResendOtp = async (email) => {
        try {
            dispatch(setLoading(true));
            return await resendOtp(email);
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // ── Verify OTP ────────────────────────────────────────────────────────────
    const authVerifyOtp = async (email, otp) => {
        try {
            dispatch(setLoading(true));
            const result = await verifyOtp(email, otp);
            dispatch(setUser(result));
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // ── Forgot Password ───────────────────────────────────────────────────────
    const authForgetPassword = async (email) => {
        try {
            dispatch(setLoading(true));
            return await forgetPassword(email);
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // ── Reset Password ────────────────────────────────────────────────────────
    const authResetPassword = async (email, otp, password, confirmPass) => {
        try {
            dispatch(setLoading(true));
            const result = await resetPassword(email, otp, password, confirmPass);
            dispatch(setUser(result));
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // ── Get Current User ──────────────────────────────────────────────────────
    const authGetMe = async () => {
        try {
            dispatch(setLoading(true));
            const result = await getMe();
            dispatch(setUser(result));
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        authLogin,
        authRegister,
        authLogout,
        authSetPassword,
        authResendOtp,
        authVerifyOtp,
        authForgetPassword,
        authResetPassword,
        authGetMe,
    };
};
