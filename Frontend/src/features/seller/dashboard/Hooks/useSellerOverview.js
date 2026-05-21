import { useState, useEffect } from 'react';
import sellerApi from '../services/seller.api';

/**
 * Custom hook to manage seller overview logic.
 */
export const useSellerOverview = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    recentOrders: [],
    topProducts: [],
    stats: { revenue: 0, orders: 0, activeListings: 0, rating: 0 },
    lowStock: []
  });

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const result = await sellerApi.getOverview();
        // Simulate loading delay like in the original component
        setTimeout(() => {
          setData(result);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch overview:', error);
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  return {
    loading,
    data
  };
};
