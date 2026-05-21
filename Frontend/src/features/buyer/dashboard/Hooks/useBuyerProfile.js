import { useState, useEffect } from 'react';
import buyerApi from '../services/buyer.api';

export const useBuyerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      // Refresh profile or update local state
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
    refresh: fetchProfile
  };
};
