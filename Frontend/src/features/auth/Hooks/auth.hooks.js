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
    verifyEmailToken,
} from '../services/auth.api';
import { setUser, setLoading, setError } from '../slice/auth.slice';

export const useAuth = () => {
    const dispatch = useDispatch();

    // ── Login ────────────────────────────────────────────────────────────────
    // NOTE: Does NOT dispatch setLoading — Login.jsx manages its own loading state.
    // Dispatching global isLoading causes App.jsx to unmount the whole tree
    // (full-screen spinner), which looks like a page reload to the user.
    const authLogin = async (email, password) => {
        try {
            await login(email, password);
            const userResponse = await getMe();
            dispatch(setUser(userResponse.user));
            return userResponse.user;
        } catch (error) {
            // Only set Redux error for non-navigation errors.
            // 403 "verify" errors are caught & redirected by the component.
            dispatch(setError(error.message));
            throw error;
        }
    };

    // ── Register ─────────────────────────────────────────────────────────────
    // NOTE: Does NOT dispatch setLoading — Register.jsx manages its own loading state.
    const authRegister = async (username, email, password, confirmPassword, contact = '', role = 'BUYER') => {
        try {
            const result = await register(username, email, password, confirmPassword, contact, role);
            return result;
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
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
    // NOTE: does NOT touch Redux loading/error — component manages state locally
    // to prevent re-render loops in the OTP verification flow.
    const authResendOtp = async (email) => {
        try {
            return await resendOtp(email);
        } catch (error) {
            throw error;
        }
    };

    // ── Verify OTP ────────────────────────────────────────────────────────────
    // NOTE: OTP verification does not log the user in — it only marks them verified.
    // Component manages loading/error locally to prevent Redux re-render loops.
    const authVerifyOtp = async (email, otp) => {
        try {
            return await verifyOtp(email, otp);
        } catch (error) {
            throw error;
        }
    };

    // ── Verify Email Token ────────────────────────────────────────────────────
    // NOTE: Does NOT dispatch setLoading — VerifyEmail.jsx shows its own
    // 'verifying-token' state during this call.
    const authVerifyEmailToken = async (token) => {
        try {
            return await verifyEmailToken(token);
        } catch (error) {
            throw error;
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
            // Returns { message } only — not a user object, so don't setUser
            return await resetPassword(email, otp, password, confirmPass);
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
        authVerifyEmailToken,
        authForgetPassword,
        authResetPassword,
        authGetMe,
    };
};
