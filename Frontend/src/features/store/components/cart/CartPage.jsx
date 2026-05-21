import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BuyerDashboard from '../../../buyer/dashboard/components/BuyerDashboard';
import { DUMMY_CART_ITEMS } from '../../data/dummyData';
import '../../style/CartPage.scss';

const CartPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState(DUMMY_CART_ITEMS);
  const [coupon, setCoupon] = useState('');
  const [couponState, setCouponState] = useState(null); // null | 'valid' | 'invalid'
  const [discountAmt, setDiscountAmt] = useState(0);

  const updateQty = (id, delta) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };
  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = subtotal >= 999 ? 0 : 49;
  const total = subtotal - discountAmt + deliveryFee;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'SNITCH10') {
      const disc = Math.round(subtotal * 0.10);
      setDiscountAmt(disc);
      setCouponState('valid');
    } else {
      setDiscountAmt(0);
      setCouponState('invalid');
    }
  };

  return (
    <BuyerDashboard breadcrumb={['Home', 'My Cart']}>
      <div className="cart-page">
        <div className="cart-page__header">
          <h1 className="cart-page__title">My Cart</h1>
          <span className="cart-page__count">{items.length} items</span>
        </div>

        {items.length === 0 ? (
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
              {items.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item__image">
                    <span className="material-symbols-outlined">checkroom</span>
                  </div>
                  <div className="cart-item__details">
                    <h3 className="cart-item__name">{item.name}</h3>
                    <div className="cart-item__meta">
                      <span className="cart-item__tag">{item.color}</span>
                      <span className="cart-item__tag">Size: {item.size}</span>
                    </div>
                    <div className="cart-item__price-row">
                      <span className="cart-item__price">₹{item.price.toLocaleString()}</span>
                      {item.originalPrice && (
                        <span className="cart-item__original">₹{item.originalPrice.toLocaleString()}</span>
                      )}
                      {item.originalPrice && (
                        <span className="cart-item__discount">
                          {Math.round((1 - item.price / item.originalPrice) * 100)}% off
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="cart-item__actions">
                    <div className="cart-item__qty-stepper">
                      <button onClick={() => updateQty(item.id, -1)} className="cart-item__qty-btn">
                        <span className="material-symbols-outlined">remove</span>
                      </button>
                      <span className="cart-item__qty">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="cart-item__qty-btn">
                        <span className="material-symbols-outlined">add</span>
                      </button>
                    </div>
                    <button className="cart-item__remove" onClick={() => removeItem(item.id)}>
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                  <div className="cart-item__line-total">
                    ₹{(item.price * item.qty).toLocaleString()}
                  </div>
                </div>
              ))}

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
                  <span>Subtotal ({items.reduce((s,i) => s+i.qty, 0)} items)</span>
                  <span>₹{subtotal.toLocaleString()}</span>
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
                {deliveryFee === 0 && subtotal < 999 && (
                  <div className="order-summary__row">
                    <span>Taxes (18% GST)</span>
                    <span>₹{Math.round(total * 0.18).toLocaleString()}</span>
                  </div>
                )}
              </div>
              <div className="order-summary__divider" />
              <div className="order-summary__total">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              {subtotal >= 999 && (
                <p className="order-summary__free-delivery-note">
                  <span className="material-symbols-outlined">local_shipping</span>
                  You've unlocked free delivery!
                </p>
              )}
              <button className="order-summary__checkout-btn" onClick={() => navigate('/checkout')}>
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
    </BuyerDashboard>
  );
};

export default CartPage;
