import React from 'react'
import './style/app.scss'
import { Routes, Route, useLocation } from 'react-router-dom'

// ── Public Storefront ──────────────────────────────────────────
import StoreFront        from '../features/store/components/StoreFront'
import SearchResultsPage from '../features/store/components/search/SearchResultsPage'

// ── Auth ───────────────────────────────────────────────────────
import Login          from '../features/auth/components/Login'
import Register       from '../features/auth/components/Register'
import VerifyEmail    from '../features/auth/components/VerifyEmail'
import ForgotPassword from '../features/auth/components/ForgotPassword'
import ResetPassword  from '../features/auth/components/ResetPassword'
import VerifyOtp      from '../features/auth/components/VerifyOtp'
import SetPassword    from '../features/auth/components/SetPassword'

// ── Seller Dashboard ───────────────────────────────────────────
import SellerOverview  from '../features/seller/dashboard/components/SellerOverview'
import SellerProducts  from '../features/seller/dashboard/components/SellerProducts'
import CreateProduct   from '../features/seller/dashboard/components/CreateProduct'
import SellerOrders    from '../features/seller/dashboard/components/SellerOrders'
import SellerEarnings  from '../features/seller/dashboard/components/SellerEarnings'
import SellerProfile   from '../features/seller/dashboard/components/SellerProfile'
import AdminBanners   from '../features/seller/dashboard/components/AdminBanners'
import StylePassbook   from '../features/seller/dashboard/components/StylePassbook'

// ── Buyer Dashboard ────────────────────────────────────────────
import BrowseProducts  from '../features/buyer/dashboard/components/BrowseProducts'
import BuyerOrders     from '../features/buyer/dashboard/components/BuyerOrders'
import WishlistPage    from '../features/wishlist/components/WishlistPage'
import BuyerProfile    from '../features/buyer/dashboard/components/BuyerProfile'

// ── Buyer Order Flow ───────────────────────────────────────────
import CartPage           from '../features/cart/components/CartPage'
import CheckoutPage       from '../features/store/components/checkout/CheckoutPage'
import OrderSuccessPage   from '../features/store/components/orders/OrderSuccessPage'
import MyOrdersPage       from '../features/store/components/orders/MyOrdersPage'
import OrderDetailPage    from '../features/store/components/orders/OrderDetailPage'
import OrderTrackingPage  from '../features/store/components/orders/OrderTrackingPage'
import ReturnRequestPage  from '../features/store/components/returns/ReturnRequestPage'
import WriteReviewPage    from '../features/store/components/returns/WriteReviewPage'
import RefundStatusPage   from '../features/store/components/returns/RefundStatusPage'
import PaymentFailedPage  from '../features/store/components/errors/PaymentFailedPage'
import OrderCancelledPage from '../features/store/components/errors/OrderCancelledPage'
import ProductPage        from '../features/store/components/product/ProductPage'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMe } from '../features/auth/services/auth.api'
import { setUser, setLoading, clearError as clearAuthError } from '../features/auth/slice/auth.slice'
import { clearError as clearProductError } from '../features/store/slice/product.slice'
import { clearError as clearCartError } from '../features/cart/slice/cart.slice'
import { clearError as clearBuyerError } from '../features/buyer/dashboard/slice/buyer.slice'
import { clearError as clearSellerError } from '../features/seller/dashboard/slice/seller.slice'
import { clearError as clearWishlistError } from '../features/wishlist/slice/wishlist.slice'
import ProtectedRoute from '../features/auth/components/ProtectedRoute'
import GuestRoute     from '../features/auth/components/GuestRoute'

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Clear all error states when switching routes/components
    dispatch(clearProductError());
    dispatch(clearCartError());
    dispatch(clearAuthError());
    dispatch(clearBuyerError());
    dispatch(clearSellerError());
    dispatch(clearWishlistError());
  }, [location.pathname, dispatch]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await getMe();
        dispatch(setUser(response.user));
      } catch (error) {
        console.error("Auth initialization failed:", error);
        dispatch(setUser(null));
      } finally {
        dispatch(setLoading(false));
      }
    };

    initAuth();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0b]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF7A]"></div>
      </div>
    );
  }

  return (
    <div>
      <Routes>
        {/* ── Public Storefront (redirect logged-in users to dashboard) ── */}
        <Route element={<GuestRoute />}>
          <Route path="/" element={<StoreFront />} />
        </Route>

        {/* ── Public Product Details (accessible to anyone) ── */}
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/search" element={<SearchResultsPage />} />

        {/* ── Auth (Unauthenticated only) ─────────────── */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/api/auth/verify-email" element={<VerifyEmail />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/set-password" element={<SetPassword />} />

        {/* ── Seller Dashboard (Protected) ──────────── */}
        <Route element={<ProtectedRoute allowedRoles={['SELLER']} />}>
          <Route path="/seller" element={<SellerOverview />} />
          <Route path="/seller/products" element={<SellerProducts />} />
          <Route path="/seller/products/new" element={<CreateProduct />} />
          <Route path="/seller/style-passbook" element={<StylePassbook />} />
          <Route path="/seller/orders" element={<SellerOrders />} />
          <Route path="/seller/earnings" element={<SellerEarnings />} />
          <Route path="/seller/profile" element={<SellerProfile />} />
        </Route>

        {/* ── Buyer Dashboard & Flow (Protected) ───────── */}
        <Route element={<ProtectedRoute allowedRoles={['BUYER']} />}>
          <Route path="/buyer" element={<BrowseProducts />} />
          <Route path="/buyer/orders" element={<BuyerOrders />} />
          <Route path="/buyer/wishlist" element={<WishlistPage />} />
          <Route path="/buyer/profile" element={<BuyerProfile />} />
          <Route path="/buyer/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/buyer/all-orders" element={<MyOrdersPage />} />
          <Route path="/buyer/orders/:id" element={<OrderDetailPage />} />
          <Route path="/buyer/track/:id" element={<OrderTrackingPage />} />
          <Route path="/buyer/return" element={<ReturnRequestPage />} />
          <Route path="/buyer/review" element={<WriteReviewPage />} />
          <Route path="/buyer/refund-status" element={<RefundStatusPage />} />
        </Route>

        {/* ── Admin Banners (Public for now, auth added later) ── */}
        <Route path="/admin/banners" element={<AdminBanners />} />

        {/* ── Errors/Status (Public or Auth depending on context) ── */}
        <Route path="/payment-failed" element={<PaymentFailedPage />} />
        <Route path="/order-cancelled" element={<OrderCancelledPage />} />
      </Routes>
    </div>
  )
}

export default App
