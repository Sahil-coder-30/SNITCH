import { createSlice } from "@reduxjs/toolkit";

const sellerSlice = createSlice({
  name: "seller",
  initialState: {
    products: [],
    orders: [],
    earnings: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setProducts(state, action) {
      state.products = action.payload;
      state.error = null;
    },
    setOrders(state, action) {
      state.orders = action.payload;
      state.error = null;
    },
    setEarnings(state, action) {
      state.earnings = action.payload;
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

export const { setProducts, setOrders, setEarnings, setLoading, setError, clearError } = sellerSlice.actions;
export default sellerSlice.reducer;
