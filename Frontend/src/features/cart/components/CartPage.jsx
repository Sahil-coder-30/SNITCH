import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useCart } from '../hooks/cart.hooks';
import '../style/CartPage.scss';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { authFetchCart, authAddToCart, authDecrementItem, authRemoveItem } = useCart();

  const { items, total, currency, isLoading, error } = useSelector((state) => state.cart);

  const [coupon, setCoupon] = useState('');
  const [couponState, setCouponState] = useState(null); // null | 'valid' | 'invalid'
  const [discountAmt, setDiscountAmt] = useState(0);

  useEffect(() => {
    authFetchCart();
  }, []);

  const handleUpdateQty = (item, delta) => {
    if (delta === 1) {
      authAddToCart(item.product._id, 1, item.size);
    } else if (delta === -1) {
      authDecrementItem(item._id);
    }
  };

  const handleRemoveItem = (cartItemId) => {
    authRemoveItem(cartItemId);
  };

  const deliveryFee = total >= 999 ? 0 : 49;
  const grandTotal = total - discountAmt + deliveryFee;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'SNITCH10') {
      const disc = Math.round(total * 0.10);
      setDiscountAmt(disc);
      setCouponState('valid');
    } else {
      setDiscountAmt(0);
      setCouponState('invalid');
    }
  };

  // Recalculate coupon discount when total changes
  useEffect(() => {
    if (couponState === 'valid') {
      const disc = Math.round(total * 0.10);
      setDiscountAmt(disc);
    } else {
      setDiscountAmt(0);
    }
  }, [total, couponState]);

  return (
    <>
      <div className="cart-page">
        <div className="cart-page__header">
          <h1 className="cart-page__title">My Cart</h1>
          <span className="cart-page__count">{items.length} items</span>
        </div>

        {isLoading && items.length === 0 ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF7A]"></div>
          </div>
        ) : error ? (
          <div className="cart-page__empty">
            <span className="material-symbols-outlined cart-page__empty-icon" style={{ color: '#ef4444' }}>error</span>
            <h2>Failed to load cart</h2>
            <p>{error}</p>
            <button className="cart-page__btn-primary" onClick={() => authFetchCart()}>
              Retry
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="cart-page__empty">
            <span className="material-symbols-outlined cart-page__empty-icon">shopping_cart</span>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <button className="cart-page__btn-primary" onClick={() => navigate('/buyer')}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="cart-page__layout">
            {/* Items */}
            <div className="cart-page__items">
              {items.map(item => {
                const product = item.product || {};
                // item.price.amount is the unit price stored when added to cart
                const itemPrice = item.price?.amount ?? product.price?.amount ?? 0;
                const originalPrice = product.originalPrice?.amount ?? itemPrice;
                const showOriginal = originalPrice > itemPrice;

                return (
                  <div key={item._id} className="cart-item">
                    <div className="cart-item__image" onClick={() => navigate(`/product/${product._id}`)} style={{ cursor: 'pointer' }}>
                      {product.coverImage ? (
                        <img 
                          src={product.coverImage} 
                          alt={product.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      ) : (
                        <span className="material-symbols-outlined">checkroom</span>
                      )}
                    </div>
                    <div className="cart-item__details">
                      <h3 
                        className="cart-item__name" 
                        onClick={() => navigate(`/product/${product._id}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        {product.title || 'Product'}
                      </h3>
                      <div className="cart-item__meta">
                        {product.color?.name && (
                          <span className="cart-item__tag">{product.color.name}</span>
                        )}
                        <span className="cart-item__tag">Size: {item.size}</span>
                      </div>
                      <div className="cart-item__price-row">
                        <span className="cart-item__price">₹{itemPrice.toLocaleString()}</span>
                        {showOriginal && (
                          <span className="cart-item__original">₹{originalPrice.toLocaleString()}</span>
                        )}
                        {showOriginal && product.discountPercent && (
                          <span className="cart-item__discount">
                            {product.discountPercent}% off
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="cart-item__actions">
                      <div className="cart-item__qty-stepper">
                        <button 
                          onClick={() => handleUpdateQty(item, -1)} 
                          className="cart-item__qty-btn"
                          disabled={isLoading}
                        >
                          <span className="material-symbols-outlined">remove</span>
                        </button>
                        <span className="cart-item__qty">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQty(item, 1)} 
                          className="cart-item__qty-btn"
                          disabled={isLoading}
                        >
                          <span className="material-symbols-outlined">add</span>
                        </button>
                      </div>
                      <button 
                        className="cart-item__remove" 
                        onClick={() => handleRemoveItem(item._id)}
                        disabled={isLoading}
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                    <div className="cart-item__line-total">
                      ₹{(itemPrice * item.quantity).toLocaleString()}
                    </div>
                  </div>
                );
              })}

              {/* Coupon */}
              <div className="coupon-section">
                <h3 className="coupon-section__title">
                  <span className="material-symbols-outlined">local_offer</span>
                  Apply Coupon
                </h3>
                <div className="coupon-section__row">
                  <input
                    type="text"
                    className={`coupon-section__input ${couponState === 'invalid' ? 'coupon-section__input--error' : couponState === 'valid' ? 'coupon-section__input--success' : ''}`}
                    placeholder="Enter coupon code"
                    value={coupon}
                    onChange={e => { setCoupon(e.target.value); setCouponState(null); }}
                  />
                  <button className="coupon-section__apply-btn" onClick={applyCoupon}>Apply</button>
                </div>
                {couponState === 'valid' && (
                  <p className="coupon-section__msg coupon-section__msg--success">
                    <span className="material-symbols-outlined">check_circle</span>
                    SNITCH10 applied! You save ₹{discountAmt}
                  </p>
                )}
                {couponState === 'invalid' && (
                  <p className="coupon-section__msg coupon-section__msg--error">
                    <span className="material-symbols-outlined">error</span>
                    Invalid coupon code. Try SNITCH10
                  </p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <h2 className="order-summary__title">Order Summary</h2>
              <div className="order-summary__rows">
                <div className="order-summary__row">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                {discountAmt > 0 && (
                  <div className="order-summary__row order-summary__row--discount">
                    <span>Coupon Discount</span>
                    <span>−₹{discountAmt.toLocaleString()}</span>
                  </div>
                )}
                <div className="order-summary__row">
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'order-summary__free' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                {deliveryFee === 0 && total < 999 && (
                  <div className="order-summary__row">
                    <span>Taxes (18% GST)</span>
                    <span>₹{Math.round(grandTotal * 0.18).toLocaleString()}</span>
                  </div>
                )}
              </div>
              <div className="order-summary__divider" />
              <div className="order-summary__total">
                <span>Total</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
              {total >= 999 && (
                <p className="order-summary__free-delivery-note">
                  <span className="material-symbols-outlined">local_shipping</span>
                  You've unlocked free delivery!
                </p>
              )}
              <button 
                className="order-summary__checkout-btn" 
                onClick={() => navigate('/checkout')}
                disabled={isLoading}
              >
                Proceed to Checkout
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button className="order-summary__continue-btn" onClick={() => navigate('/buyer')}>
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
