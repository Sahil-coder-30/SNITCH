import { createSlice } from "@reduxjs/toolkit";

const buyerSlice = createSlice({
  name: "buyer",
  initialState: {
    orders: [],
    wishlist: [],
    profile: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setOrders(state, action) {
      state.orders = action.payload;
      state.error = null;
    },
    setWishlist(state, action) {
      state.wishlist = action.payload;
      state.error = null;
    },
    setProfile(state, action) {
      state.profile = action.payload;
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
  },
});

export const { setOrders, setWishlist, setProfile, setLoading, setError, clearError } = buyerSlice.actions;
export default buyerSlice.reducer;
