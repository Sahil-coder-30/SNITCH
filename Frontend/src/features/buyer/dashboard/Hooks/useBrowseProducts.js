import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, updateFilters } from '../../../store/slice/product.slice';

/**
 * Custom hook to manage product browsing, filtering, and sorting via Redux/backend.
 */
export const useBrowseProducts = () => {
  const dispatch = useDispatch();
  const { list: products, loading, error, filters } = useSelector(state => state.products);
  const { category, sort, search } = filters;
  const productsRef = useRef(null);

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, category, sort, search]);

  const setCategory = useCallback((catId) => {
    dispatch(updateFilters({ category: catId }));
  }, [dispatch]);

  const setSort = useCallback((sortVal) => {
    dispatch(updateFilters({ sort: sortVal }));
  }, [dispatch]);

  const scrollToProducts = useCallback(() => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return {
    loading,
    error,
    category,
    setCategory,
    sort,
    setSort,
    productsRef,
    filteredProducts: products || [],
    scrollToProducts,
  };
};

