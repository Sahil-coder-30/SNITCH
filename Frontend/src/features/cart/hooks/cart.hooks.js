import { useDispatch } from 'react-redux';
import { fetchCartAPI, addToCartAPI, decrementItemAPI, removeItemAPI } from '../service/cart.api';
import { setCart, setLoading, setError, clearError } from '../slice/cart.slice';

export const useCart = () => {
    const dispatch = useDispatch();

    /**
     * Internal: fetch cart from server and push to Redux.
     * getCart returns { message, userCart: [] } — userCart is an aggregate array.
     * If the cart is empty there are no documents, so userCart is [].
     */
    const _fetchAndSync = async () => {
        const data = await fetchCartAPI();           // { message, userCart: [] }
        const cart = data.userCart?.[0] ?? null;    // first (and only) aggregate result
        dispatch(setCart(cart));
        return cart;
    };

    // ── Fetch cart ───────────────────────────────────────────────────────────
    const authFetchCart = async () => {
        try {
            dispatch(clearError());
            dispatch(setLoading(true));
            return await _fetchAndSync();
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // ── Add to cart — mutate then re-fetch ───────────────────────────────────
    const authAddToCart = async (productId, quantity, size) => {
        try {
            dispatch(clearError());
            dispatch(setLoading(true));
            await addToCartAPI(productId, quantity, size); // response only has message
            return await _fetchAndSync();                  // pull fresh aggregate data
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // ── Decrement item — mutate then re-fetch ────────────────────────────────
    const authDecrementItem = async (cartItemId) => {
        try {
            dispatch(clearError());
            dispatch(setLoading(true));
            await decrementItemAPI(cartItemId);
            return await _fetchAndSync();
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // ── Remove item — mutate then re-fetch ───────────────────────────────────
    const authRemoveItem = async (cartItemId) => {
        try {
            dispatch(clearError());
            dispatch(setLoading(true));
            await removeItemAPI(cartItemId);
            return await _fetchAndSync();
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
