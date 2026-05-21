import { useState, useEffect } from 'react';
import sellerApi from '../services/seller.api';

/**
 * Custom hook to manage seller products logic.
 */
export const useSellerProducts = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await sellerApi.getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return {
    products,
    loading,
    viewMode,
    setViewMode
  };
};
