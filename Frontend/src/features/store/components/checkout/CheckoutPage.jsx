import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BuyerDashboard from '../../../buyer/dashboard/components/BuyerDashboard';
import { DUMMY_ADDRESSES, DUMMY_CART_ITEMS, DELIVERY_OPTIONS, PAYMENT_METHODS } from '../../data/dummyData';
import '../../style/CheckoutPage.scss';

const STEPS = [
  { id: 1, label: 'Address', icon: 'location_on' },
  { id: 2, label: 'Delivery', icon: 'local_shipping' },
  { id: 3, label: 'Payment', icon: 'credit_card' },
  { id: 4, label: 'Review', icon: 'fact_check' },
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(DUMMY_ADDRESSES[0].id);
  const [selectedDelivery, setSelectedDelivery] = useState('standard');
  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);

  const subtotal = DUMMY_CART_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryDetails = DELIVERY_OPTIONS.find(d => d.id === selectedDelivery);
  const deliveryFee = deliveryDetails?.fee || 0;
  const discount = 200;
  const total = subtotal - discount + deliveryFee;
  const address = DUMMY_ADDRESSES.find(a => a.id === selectedAddress);

  const next = () => step < 4 ? setStep(s => s + 1) : navigate('/order-success');
  const prev = () => step > 1 && setStep(s => s - 1);

  return (
    <BuyerDashboard breadcrumb={['Home', 'Cart', 'Checkout']}>
      <div className="checkout-page">
        {/* Step Progress */}
        <div className="checkout-page__steps">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={`checkout-step ${step >= s.id ? 'checkout-step--active' : ''} ${step > s.id ? 'checkout-step--done' : ''}`}>
                <div className="checkout-step__circle">
                  {step > s.id
                    ? <span className="material-symbols-outlined">check</span>
                    : <span className="material-symbols-outlined">{s.icon}</span>
                  }
                </div>
                <span className="checkout-step__label">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`checkout-step__connector ${step > s.id ? 'checkout-step__connector--done' : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="checkout-page__layout">
          <div className="checkout-page__main">
            {/* Step 1: Address */}
            {step === 1 && (
              <div className="checkout-section">
                <h2 className="checkout-section__title">Select Delivery Address</h2>
                {DUMMY_ADDRESSES.map(addr => (
                  <label key={addr.id} className={`address-card ${selectedAddress === addr.id ? 'address-card--selected' : ''}`}>
                    <input type="radio" name="address" value={addr.id} checked={selectedAddress === addr.id} onChange={() => setSelectedAddress(addr.id)} />
                    <div className="address-card__body">
                      <div className="address-card__header">
                        <span className="address-card__type">{addr.type}</span>
                        {addr.isDefault && <span className="address-card__default">Default</span>}
                      </div>
                      <p className="address-card__name">{addr.name}</p>
                      <p className="address-card__line">{addr.flat}, {addr.street}</p>
                      <p className="address-card__line">{addr.city}, {addr.state} – {addr.pincode}</p>
                      <p className="address-card__phone">{addr.phone}</p>
                    </div>
                  </label>
                ))}
                <button className="checkout-page__add-address-btn" onClick={() => setShowAddAddress(!showAddAddress)}>
                  <span className="material-symbols-outlined">add</span>
                  Add New Address
                </button>
                {showAddAddress && (
                  <div className="add-address-form">
                    <h3 className="add-address-form__title">New Address</h3>
                    <div className="add-address-form__grid">
                      {[
                        { label: 'Full Name', placeholder: 'Enter full name' },
                        { label: 'Phone', placeholder: '+91 XXXXX XXXXX' },
                        { label: 'Flat / House No.', placeholder: 'Flat, House no., Building' },
                        { label: 'Street / Area', placeholder: 'Street, Area, Landmark' },
                        { label: 'City', placeholder: 'City' },
                        { label: 'State', placeholder: 'State' },
                        { label: 'Pincode', placeholder: '6-digit pincode' },
                      ].map(f => (
                        <div key={f.label} className="add-address-form__field">
                          <label className="add-address-form__label">{f.label}</label>
                          <input type="text" className="add-address-form__input" placeholder={f.placeholder} />
                        </div>
                      ))}
                      <div className="add-address-form__field add-address-form__field--full">
                        <label className="add-address-form__label">Address Type</label>
                        <div className="add-address-form__type-row">
                          {['Home', 'Work', 'Other'].map(t => (
                            <label key={t} className="add-address-form__type-chip">
                              <input type="radio" name="addrType" value={t} defaultChecked={t === 'Home'} />
                              {t}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button className="checkout-page__btn-primary">Save Address</button>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Delivery */}
            {step === 2 && (
              <div className="checkout-section">
                <h2 className="checkout-section__title">Choose Delivery Option</h2>
                {DELIVERY_OPTIONS.map(opt => (
                  <label key={opt.id} className={`delivery-option ${selectedDelivery === opt.id ? 'delivery-option--selected' : ''}`}>
                    <input type="radio" name="delivery" value={opt.id} checked={selectedDelivery === opt.id} onChange={() => setSelectedDelivery(opt.id)} />
                    <div className="delivery-option__body">
                      <div className="delivery-option__header">
                        <span className="delivery-option__label">{opt.label}</span>
                        {opt.badge && <span className="delivery-option__badge">{opt.badge}</span>}
                      </div>
                      <span className="delivery-option__desc">{opt.desc}</span>
                      <span className="delivery-option__eta">
                        <span className="material-symbols-outlined">calendar_today</span>
                        {opt.eta}
                      </span>
                    </div>
                    <span className={`delivery-option__fee ${opt.fee === 0 ? 'delivery-option__fee--free' : ''}`}>
                      {opt.fee === 0 ? 'FREE' : `₹${opt.fee}`}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="checkout-section">
                <h2 className="checkout-section__title">Select Payment Method</h2>
                {PAYMENT_METHODS.map(pm => (
                  <div key={pm.id} className={`payment-option ${selectedPayment === pm.id ? 'payment-option--selected' : ''}`}>
                    <label className="payment-option__label-row">
                      <input type="radio" name="payment" value={pm.id} checked={selectedPayment === pm.id} onChange={() => setSelectedPayment(pm.id)} />
                      <span className="material-symbols-outlined payment-option__icon">{pm.icon}</span>
                      <span className="payment-option__name">{pm.label}</span>
                    </label>
                    {selectedPayment === 'upi' && pm.id === 'upi' && (
                      <div className="payment-option__fields">
                        <input type="text" className="payment-option__input" placeholder="Enter UPI ID (e.g. priya@upi)" value={upiId} onChange={e => setUpiId(e.target.value)} />
                        <button className="payment-option__verify-btn">Verify</button>
                      </div>
                    )}
                    {selectedPayment === 'card' && pm.id === 'card' && (
                      <div className="payment-option__fields payment-option__fields--grid">
                        <input type="text" className="payment-option__input payment-option__input--full" placeholder="Card Number" maxLength={19} />
                        <input type="text" className="payment-option__input" placeholder="Name on Card" />
                        <input type="text" className="payment-option__input" placeholder="MM / YY" maxLength={5} />
                        <input type="text" className="payment-option__input" placeholder="CVV" maxLength={3} />
                      </div>
                    )}
                    {selectedPayment === 'netbanking' && pm.id === 'netbanking' && (
                      <div className="payment-option__fields">
                        <select className="payment-option__input">
                          {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra'].map(b => (
                            <option key={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {selectedPayment === 'cod' && pm.id === 'cod' && (
                      <div className="payment-option__cod-note">
                        <span className="material-symbols-outlined">info</span>
                        ₹40 extra COD charges apply. Pay in cash at the time of delivery.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="checkout-section">
                <h2 className="checkout-section__title">Review Your Order</h2>

                <div className="review-section">
                  <div className="review-section__block">
                    <h3 className="review-section__block-title">
                      <span className="material-symbols-outlined">location_on</span>
                      Delivery Address
                    </h3>
                    <p className="review-section__text">{address?.name} · {address?.phone}</p>
                    <p className="review-section__text">{address?.flat}, {address?.street}</p>
                    <p className="review-section__text">{address?.city}, {address?.state} – {address?.pincode}</p>
                  </div>
                  <div className="review-section__block">
                    <h3 className="review-section__block-title">
                      <span className="material-symbols-outlined">local_shipping</span>
                      Delivery Option
                    </h3>
                    <p className="review-section__text">{deliveryDetails?.label} · {deliveryDetails?.eta}</p>
                  </div>
                  <div className="review-section__block">
                    <h3 className="review-section__block-title">
                      <span className="material-symbols-outlined">credit_card</span>
                      Payment
                    </h3>
                    <p className="review-section__text">{PAYMENT_METHODS.find(p => p.id === selectedPayment)?.label}</p>
                  </div>
                  <div className="review-section__block">
                    <h3 className="review-section__block-title">
                      <span className="material-symbols-outlined">shopping_bag</span>
                      Items ({DUMMY_CART_ITEMS.length})
                    </h3>
                    {DUMMY_CART_ITEMS.map(item => (
                      <div key={item.id} className="review-item">
                        <div className="review-item__image"><span className="material-symbols-outlined">checkroom</span></div>
                        <div className="review-item__info">
                          <span className="review-item__name">{item.name}</span>
                          <span className="review-item__meta">{item.color} · Size {item.size} · Qty {item.qty}</span>
                        </div>
                        <span className="review-item__price">₹{(item.price * item.qty).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="checkout-page__sidebar">
            <div className="checkout-summary">
              <h3 className="checkout-summary__title">Price Details</h3>
              <div className="checkout-summary__row"><span>MRP Total</span><span>₹{subtotal.toLocaleString()}</span></div>
              <div className="checkout-summary__row checkout-summary__row--discount"><span>Discount</span><span>−₹{discount}</span></div>
              <div className="checkout-summary__row"><span>Delivery</span><span className={deliveryFee === 0 ? 'checkout-summary__free' : ''}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
              <div className="checkout-summary__divider" />
              <div className="checkout-summary__total"><span>Total Amount</span><span>₹{total.toLocaleString()}</span></div>
              <p className="checkout-summary__savings">You save ₹{discount + (subtotal - subtotal + 0)} on this order 🎉</p>
            </div>
            <div className="checkout-page__nav-btns">
              {step > 1 && (
                <button className="checkout-page__btn-secondary" onClick={prev}>
                  <span className="material-symbols-outlined">arrow_back</span>
                  Back
                </button>
              )}
              <button className="checkout-page__btn-primary" onClick={next}>
                {step === 4 ? 'Place Order' : 'Continue'}
                <span className="material-symbols-outlined">{step === 4 ? 'check_circle' : 'arrow_forward'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </BuyerDashboard>
  );
};

export default CheckoutPage;
