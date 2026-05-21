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
    },
    setOrders(state, action) {
      state.orders = action.payload;
    },
    setEarnings(state, action) {
      state.earnings = action.payload;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setProducts, setOrders, setEarnings, setLoading, setError } = sellerSlice.actions;
export default sellerSlice.reducer;
