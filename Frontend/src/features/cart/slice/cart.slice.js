import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        itemCount: 0,
        subtotal: 0,
        currency: "INR",
        isLoading: false,
        error: null,
    },
    reducers: {
        setCart(state, action) {
            state.items = action.payload.items;
            state.itemCount = action.payload.itemCount;
            state.subtotal = action.payload.subtotal;
            state.currency = action.payload.currency;
            state.error = null;
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
        clearCart(state) {
            state.items = [];
            state.itemCount = 0;
            state.subtotal = 0;
            state.currency = "INR";
            state.error = null;
        }
    }
});

export const { setCart, setLoading, setError, clearError, clearCart } = cartSlice.actions;
export default cartSlice.reducer;