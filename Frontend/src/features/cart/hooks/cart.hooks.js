import { useDispatch } from 'react-redux';
import { fetchCartAPI, addToCartAPI, decrementItemAPI, removeItemAPI } from '../service/cart.api';
import { setCart, setLoading, setError, clearError } from '../slice/cart.slice';

export const useCart = () => {
    const dispatch = useDispatch();

    const authFetchCart = async () => {
        try {
            dispatch(clearError());
            dispatch(setLoading(true));
            const data = await fetchCartAPI();
            dispatch(setCart(data.cart));
            return data.cart;
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const authAddToCart = async (productId, quantity, size) => {
        try {
            dispatch(clearError());
            dispatch(setLoading(true));
            const data = await addToCartAPI(productId, quantity, size);
            dispatch(setCart(data.cart));
            return data.cart;
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const authDecrementItem = async (cartItemId) => {
        try {
            dispatch(clearError());
            dispatch(setLoading(true));
            const data = await decrementItemAPI(cartItemId);
            dispatch(setCart(data.cart));
            return data.cart;
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const authRemoveItem = async (cartItemId) => {
        try {
            dispatch(clearError());
            dispatch(setLoading(true));
            const data = await removeItemAPI(cartItemId);
            dispatch(setCart(data.cart));
            return data.cart;
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        authFetchCart,
        authAddToCart,
        authDecrementItem,
        authRemoveItem,
    };
};
