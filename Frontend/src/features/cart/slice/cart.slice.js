import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartId: null,
        items: [],
        itemCount: 0,
        total: 0,       // computed server-side via aggregate: sum of (qty * price)
        currency: "INR",
        isLoading: false,
        error: null,
    },
    reducers: {
        // Accepts the first element of the aggregate array returned by getCart
        setCart(state, action) {
            const cart = action.payload; // { _id, total, currency, items[] }
            if (!cart) {
                // empty cart (no document yet)
                state.cartId   = null;
                state.items    = [];
                state.itemCount = 0;
                state.total    = 0;
                state.currency = "INR";
            } else {
                state.cartId   = cart._id;
                state.items    = cart.items ?? [];
                state.itemCount = (cart.items ?? []).reduce((s, i) => s + i.quantity, 0);
                state.total    = cart.total ?? 0;
                state.currency = cart.currency ?? "INR";
            }
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
            state.cartId   = null;
            state.items    = [];
            state.itemCount = 0;
            state.total    = 0;
            state.currency = "INR";
            state.error    = null;
        }
    }
});

export const { setCart, setLoading, setError, clearError, clearCart } = cartSlice.actions;
export default cartSlice.reducer;