import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import sellerApi from '../services/seller.api';
import { setUser } from '../../../auth/slice/auth.slice';
import { getMe } from '../../../auth/services/auth.api';

export const useSellerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await sellerApi.getProfile();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async (formData) => {
    try {
      await sellerApi.updateProfile(formData);
      await fetchProfile();

      // Sync the global auth user Redux state so any dashboard headers update immediately
      try {
        const userRes = await getMe();
        if (userRes && userRes.user) {
          dispatch(setUser(userRes.user));
        }
      } catch (authErr) {
        console.error("Failed to sync auth user state after profile update:", authErr);
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    refresh: fetchProfile
  };
};
