import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import buyerApi from '../services/buyer.api';
import { setUser } from '../../../auth/slice/auth.slice';
import { getMe } from '../../../auth/services/auth.api';

export const useBuyerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await buyerApi.getProfile();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (formData) => {
    try {
      await buyerApi.updateProfile(formData);
      await fetchProfile();

      // Sync the global auth user Redux state so the navbar updates immediately
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

  const addAddress = async (addressData) => {
    try {
      await buyerApi.addAddress(addressData);
      await fetchProfile();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateAddress = async (addressId, addressData) => {
    try {
      await buyerApi.updateAddress(addressId, addressData);
      await fetchProfile();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      await buyerApi.deleteAddress(addressId);
      await fetchProfile();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const addPaymentMethod = async (paymentData) => {
    try {
      await buyerApi.addPaymentMethod(paymentData);
      await fetchProfile();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deletePaymentMethod = async (paymentId) => {
    try {
      await buyerApi.deletePaymentMethod(paymentId);
      await fetchProfile();
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
    addAddress,
    updateAddress,
    deleteAddress,
    addPaymentMethod,
    deletePaymentMethod,
    refresh: fetchProfile
  };
};
