import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BuyerDashboard from '../../../buyer/dashboard/components/BuyerDashboard';
import '../../style/OrderSuccessPage.scss';

const CONFETTI_COLORS = ['#D4AF7A', '#4ade80', '#60a5fa', '#f472b6', '#facc15', '#a78bfa'];

const Confetto = ({ style }) => <div className="confetto" style={style} />;

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const [confetti, setConfetti] = useState([]);
  const orderId = 'ORD-2024-8899';

  useEffect(() => {
    const pieces = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`,
      animationDuration: `${2 + Math.random() * 3}s`,
      background: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      width: `${6 + Math.random() * 8}px`,
      height: `${6 + Math.random() * 8}px`,
      borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      transform: `rotate(${Math.random() * 360}deg)`,
    }));
    setConfetti(pieces);
  }, []);

  return (
    <BuyerDashboard breadcrumb={['Home', 'Order Placed']}>
      <div className="order-success">
        {/* Confetti */}
        <div className="order-success__confetti" aria-hidden="true">
          {confetti.map(c => (
            <Confetto key={c.id} style={{
              left: c.left,
              animationDelay: c.animationDelay,
              animationDuration: c.animationDuration,
              background: c.background,
              width: c.width,
              height: c.height,
              borderRadius: c.borderRadius,
              transform: c.transform,
            }} />
          ))}
        </div>

        <div className="order-success__card">
          {/* Tick animation */}
          <div className="order-success__tick-wrapper">
            <svg className="order-success__tick-svg" viewBox="0 0 52 52">
              <circle className="order-success__tick-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="order-success__tick-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>

          <h1 className="order-success__heading">Order Placed Successfully!</h1>
          <p className="order-success__subtitle">🎉 Wooh! Your order is confirmed and being processed.</p>

          <div className="order-success__order-id">
            <span className="order-success__order-id-label">Order ID</span>
            <span className="order-success__order-id-val">{orderId}</span>
          </div>

          <div className="order-success__info-grid">
            <div className="order-success__info-block">
              <span className="material-symbols-outlined">calendar_today</span>
              <div>
                <span className="order-success__info-label">Estimated Delivery</span>
                <span className="order-success__info-val">Thu, Apr 22 – Fri, Apr 24</span>
              </div>
            </div>
            <div className="order-success__info-block">
              <span className="material-symbols-outlined">location_on</span>
              <div>
                <span className="order-success__info-label">Delivering To</span>
                <span className="order-success__info-val">Flat 4B, MG Road, Bengaluru</span>
              </div>
            </div>
            <div className="order-success__info-block">
              <span className="material-symbols-outlined">credit_card</span>
              <div>
                <span className="order-success__info-label">Payment Method</span>
                <span className="order-success__info-val">UPI</span>
              </div>
            </div>
            <div className="order-success__info-block">
              <span className="material-symbols-outlined">payments</span>
              <div>
                <span className="order-success__info-label">Amount Paid</span>
                <span className="order-success__info-val">₹4,146</span>
              </div>
            </div>
          </div>

          <div className="order-success__cta-row">
            <button className="order-success__btn-primary" onClick={() => navigate('/buyer/orders')}>
              <span className="material-symbols-outlined">inventory_2</span>
              Track Your Order
            </button>
            <button className="order-success__btn-secondary" onClick={() => navigate('/buyer')}>
              Continue Shopping
            </button>
          </div>

          <p className="order-success__email-note">
            <span className="material-symbols-outlined">mail</span>
            A confirmation has been sent to priya.sharma@example.com
          </p>
        </div>
      </div>
    </BuyerDashboard>
  );
};

export default OrderSuccessPage;
