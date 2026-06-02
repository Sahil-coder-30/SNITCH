import { useDispatch, useSelector } from 'react-redux';
import {
    fetchWishlistAPI,
    addToWishlistAPI,
    removeFromWishlistAPI,
    checkWishlistStatusAPI,
} from '../service/wishlist.api';
import {
    setWishlist,
    addWishlistItem,
    removeWishlistItem,
    setLoading,
    setError,
    clearError,
} from '../slice/wishlist.slice';

export const useWishlist = () => {
    const dispatch = useDispatch();
    const { items, isLoading, error } = useSelector((state) => state.wishlist);

    // ── Fetch all wishlist items ────────────────────────────────────────────
    const authFetchWishlist = async () => {
        try {
            dispatch(clearError());
            dispatch(setLoading(true));
            const data = await fetchWishlistAPI();
            dispatch(setWishlist(data.wishlist));
            return data.wishlist;
        } catch (err) {
            dispatch(setError(err.message));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // ── Add a product+size to wishlist ─────────────────────────────────────
    const authAddToWishlist = async (productId, size) => {
        try {
            dispatch(clearError());
            dispatch(setLoading(true));
            const data = await addToWishlistAPI(productId, size);
            dispatch(addWishlistItem(data.item));
            return data.item;
        } catch (err) {
            dispatch(setError(err.message));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // ── Remove a product+size from wishlist ────────────────────────────────
    const authRemoveFromWishlist = async (productId, size) => {
        try {
            dispatch(clearError());
            dispatch(setLoading(true));
            await removeFromWishlistAPI(productId, size);
            dispatch(removeWishlistItem({ productId, size }));
        } catch (err) {
            dispatch(setError(err.message));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // ── Toggle wishlist (add if not present, remove if present) ────────────
    const toggleWishlist = async (product, size) => {
        const productId = product?._id || product?.id;
        if (!productId) return;

        // Choose the best available size if none provided
        const resolvedSize = size ||
            product?.sizes?.find((s) => s.quantity > 0)?.size ||
            product?.sizes?.[0]?.size ||
            'M';

        const isWishlisted = items.some(
            (i) =>
                (i.product?._id || i.product)?.toString() === productId &&
                i.size === resolvedSize
        );

        if (isWishlisted) {
            await authRemoveFromWishlist(productId, resolvedSize);
        } else {
            await authAddToWishlist(productId, resolvedSize);
        }
    };

    // ── Check if a specific product+size is wishlisted (from local state) ──
    const isInWishlist = (productId, size) => {
        return items.some(
            (i) =>
                (i.product?._id || i.product)?.toString() === productId &&
                (size ? i.size === size : true)
        );
    };

    return {
        items,
        isLoading,
        error,
        authFetchWishlist,
        authAddToWishlist,
        authRemoveFromWishlist,
        toggleWishlist,
        isInWishlist,
    };
};
