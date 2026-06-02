import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: {
        items: [],      // array of wishlist documents { _id, user, product, size, ... }
        isLoading: false,
        error: null,
    },
    reducers: {
        setWishlist(state, action) {
            state.items = action.payload;
            state.error = null;
        },
        addWishlistItem(state, action) {
            // Avoid duplicates (by product._id + size)
            const incoming = action.payload;
            const alreadyExists = state.items.some(
                (i) =>
                    (i.product?._id || i.product) === (incoming.product?._id || incoming.product) &&
                    i.size === incoming.size
            );
            if (!alreadyExists) {
                state.items.unshift(incoming);
            }
        },
        removeWishlistItem(state, action) {
            // payload: { productId, size }
            const { productId, size } = action.payload;
            state.items = state.items.filter(
                (i) =>
                    !((i.product?._id || i.product)?.toString() === productId && i.size === size)
            );
        },
        setLoading(state, action) {
            state.isLoading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        clearError(state) {
            state.error = null;
        },
    },
});

export const {
    setWishlist,
    addWishlistItem,
    removeWishlistItem,
    setLoading,
    setError,
    clearError,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
