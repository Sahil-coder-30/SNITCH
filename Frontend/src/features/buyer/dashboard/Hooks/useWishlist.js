import { useState, useEffect } from 'react';
import buyerApi from '../services/buyer.api';

export const useWishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await buyerApi.getWishlist();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      await buyerApi.removeFromWishlist(productId);
      setItems(prev => prev.filter(item => item.id !== productId));
    } catch (err) {
      setError(err.message);
    }
  };

  const moveAllToCart = async () => {
    // Logic for moving all items to cart
    console.log('Moving all items to cart');
  };

  return {
    items,
    loading,
    error,
    removeItem,
    moveAllToCart,
    refresh: fetchWishlist
  };
};
