import { useState, useMemo, useRef, useCallback } from 'react';
import { PRODUCTS } from '../../../store/data/products';

/**
 * Custom hook to manage product browsing, filtering, and sorting.
 */
export const useBrowseProducts = () => {
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('featured');
  const productsRef = useRef(null);

  const filteredProducts = useMemo(() => {
    return PRODUCTS
      .filter(p => category === 'all' || p.category === category)
      .sort((a, b) => {
        switch (sort) {
          case 'price-asc':  return a.price - b.price;
          case 'price-desc': return b.price - a.price;
          default:           return 0;
        }
      });
  }, [category, sort]);

  const scrollToProducts = useCallback(() => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return {
    category,
    setCategory,
    sort,
    setSort,
    productsRef,
    filteredProducts,
    scrollToProducts,
  };
};
