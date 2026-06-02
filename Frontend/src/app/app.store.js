import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/slice/auth.slice';
import productReducer from '../features/store/slice/product.slice';
import buyerReducer from '../features/buyer/dashboard/slice/buyer.slice';
import sellerReducer from '../features/seller/dashboard/slice/seller.slice';
import cartReducer from '../features/cart/slice/cart.slice';
import wishlistReducer from '../features/wishlist/slice/wishlist.slice';

const store = configureStore({
    reducer: {
       auth: authReducer,
       products: productReducer,
       buyerDashboard: buyerReducer,
       sellerDashboard: sellerReducer,
       cart: cartReducer,
       wishlist: wishlistReducer,
    },
})

export default store;