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
    },
    setWishlist(state, action) {
      state.wishlist = action.payload;
    },
    setProfile(state, action) {
      state.profile = action.payload;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setOrders, setWishlist, setProfile, setLoading, setError } = buyerSlice.actions;
export default buyerSlice.reducer;
