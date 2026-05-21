import React from 'react';
import { useNavigate } from 'react-router-dom';
import BuyerDashboard from '../../../buyer/dashboard/components/BuyerDashboard';
import '../../style/PaymentFailedPage.scss';

const PaymentFailedPage = () => {
  const navigate = useNavigate();

  return (
    <BuyerDashboard breadcrumb={['Home', 'Checkout', 'Payment Failed']}>
      <div className="payment-failed">
        <div className="payment-failed__card">
          {/* Error icon */}
          <div className="payment-failed__icon-wrapper">
            <svg className="payment-failed__icon-svg" viewBox="0 0 52 52">
              <circle className="payment-failed__circle" cx="26" cy="26" r="25" fill="none" />
              <line className="payment-failed__cross" x1="16" y1="16" x2="36" y2="36" />
              <line className="payment-failed__cross" x1="36" y1="16" x2="16" y2="36" />
            </svg>
          </div>

          <h1 className="payment-failed__heading">Payment Failed</h1>
          <p className="payment-failed__subtitle">
            We couldn't process your payment. Don't worry — your order is saved.
          </p>

          <div className="payment-failed__reason-pill">
            <span className="material-symbols-outlined">error_outline</span>
            Reason: Transaction declined by your bank
          </div>

          <div className="payment-failed__order-info">
            <div className="payment-failed__info-row">
              <span>Order ID</span>
              <strong>ORD-2024-8899 (Pending)</strong>
            </div>
            <div className="payment-failed__info-row">
              <span>Amount</span>
              <strong>₹4,146</strong>
            </div>
            <div className="payment-failed__info-row">
              <span>Payment Method</span>
              <strong>UPI</strong>
            </div>
          </div>

          <div className="payment-failed__suggestions">
            <h3 className="payment-failed__suggestions-title">What can you do?</h3>
            <ul className="payment-failed__suggestion-list">
              <li><span className="material-symbols-outlined">check_circle</span> Try a different payment method</li>
              <li><span className="material-symbols-outlined">check_circle</span> Ensure sufficient balance in your account</li>
              <li><span className="material-symbols-outlined">check_circle</span> Re-enter UPI ID or try a different UPI app</li>
              <li><span className="material-symbols-outlined">check_circle</span> Try again after a few minutes</li>
            </ul>
          </div>

          <div className="payment-failed__cta-row">
            <button className="payment-failed__btn-primary" onClick={() => navigate('/checkout')}>
              <span className="material-symbols-outlined">refresh</span>
              Retry Payment
            </button>
            <button className="payment-failed__btn-secondary" onClick={() => navigate('/buyer/cart')}>
              <span className="material-symbols-outlined">shopping_cart</span>
              Back to Cart
            </button>
          </div>

          <p className="payment-failed__support-note">
            Still having issues?{' '}
            <button className="payment-failed__support-link">Contact Support</button>
          </p>
        </div>
      </div>
    </BuyerDashboard>
  );
};

export default PaymentFailedPage;
