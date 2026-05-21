import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/slice/auth.slice';
import productReducer from '../features/store/slice/product.slice';
import buyerReducer from '../features/buyer/dashboard/slice/buyer.slice';
import sellerReducer from '../features/seller/dashboard/slice/seller.slice';

const store = configureStore({
    reducer: {
       auth: authReducer,
       products: productReducer,
       buyerDashboard: buyerReducer,
       sellerDashboard: sellerReducer,
    },
})

export default store;