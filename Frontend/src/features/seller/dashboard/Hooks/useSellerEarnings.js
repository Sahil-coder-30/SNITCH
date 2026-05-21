import { useState, useEffect } from 'react';
import sellerApi from '../services/seller.api';

export const useSellerEarnings = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const data = await sellerApi.getEarnings();
      setEarnings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    earnings,
    loading,
    error,
    refresh: fetchEarnings
  };
};
