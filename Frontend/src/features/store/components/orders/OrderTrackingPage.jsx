import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BuyerDashboard from '../../../buyer/dashboard/components/BuyerDashboard';
import { DUMMY_ORDERS } from '../../data/dummyData';
import '../../style/OrderTrackingPage.scss';

const STEPS = [
  { key: 'placed',    label: 'Order Placed',     icon: 'inventory_2',      desc: 'Your order has been received.' },
  { key: 'confirmed', label: 'Confirmed',         icon: 'task_alt',         desc: 'Seller has confirmed your order.' },
  { key: 'packed',    label: 'Packed',            icon: 'deployed_code',    desc: 'Your items have been packed.' },
  { key: 'shipped',   label: 'Shipped',           icon: 'local_shipping',   desc: 'On its way to the nearest hub.' },
  { key: 'out',       label: 'Out for Delivery',  icon: 'delivery_dining',  desc: 'Delivery agent is near you.' },
  { key: 'delivered', label: 'Delivered',         icon: 'check_circle',     desc: 'Package delivered successfully.' },
];

const STATUS_STEP = { processing: 1, shipped: 3, delivered: 5, cancelled: -1 };

const OrderTrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = DUMMY_ORDERS.find(o => o.id === id) || DUMMY_ORDERS[1];
  const currentStep = STATUS_STEP[order.status] ?? 0;
  const [animStep, setAnimStep] = useState(-1);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= currentStep) { setAnimStep(i); i++; }
      else clearInterval(interval);
    }, 350);
    return () => clearInterval(interval);
  }, [currentStep]);

  return (
    <BuyerDashboard breadcrumb={['Home', 'My Orders', order.id, 'Track']}>
      <div className="order-tracking">
        <div className="order-tracking__header">
          <button className="order-tracking__back" onClick={() => navigate(`/buyer/orders/${order.id}`)}>
            <span className="material-symbols-outlined">arrow_back</span>
            {order.id}
          </button>
          <div className="order-tracking__awb">
            {order.awb && (
              <>
                <span className="material-symbols-outlined">barcode_reader</span>
                <span>{order.courier} · {order.awb}</span>
              </>
            )}
          </div>
        </div>

        <div className="order-tracking__layout">
          {/* Main stepper */}
          <div className="order-tracking__stepper-card">
            <h2 className="order-tracking__title">Live Tracking</h2>
            {order.estimatedDelivery && (
              <p className="order-tracking__eta">
                <span className="material-symbols-outlined">schedule</span>
                {order.status === 'delivered'
                  ? `Delivered on ${new Date(order.actualDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
                  : `Expected by ${new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
                }
              </p>
            )}

            <div className="tracking-stepper">
              {STEPS.map((step, i) => {
                const isDone = i <= animStep;
                const isCurrent = i === animStep;
                return (
                  <div key={step.key} className={`tracking-step ${isDone ? 'tracking-step--done' : ''} ${isCurrent ? 'tracking-step--current' : ''}`}>
                    <div className="tracking-step__left">
                      <div className={`tracking-step__circle ${isDone ? 'tracking-step__circle--done' : ''} ${isCurrent ? 'tracking-step__circle--current' : ''}`}>
                        <span className="material-symbols-outlined">{step.icon}</span>
                        {isCurrent && <div className="tracking-step__pulse" />}
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`tracking-step__line ${i < animStep ? 'tracking-step__line--done' : ''}`} />
                      )}
                    </div>
                    <div className="tracking-step__content">
                      <span className={`tracking-step__label ${isDone ? 'tracking-step__label--active' : ''}`}>{step.label}</span>
                      <span className="tracking-step__desc">{step.desc}</span>
                      {isDone && (
                        <span className="tracking-step__time">
                          {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} ·{' '}
                          {['9:12 AM', '10:45 AM', '2:30 PM', '6:00 PM', '8:14 AM', '1:20 PM'][i]}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar: order summary */}
          <div className="order-tracking__sidebar">
            <div className="order-tracking__info-card">
              <h3 className="order-tracking__info-title">Delivery To</h3>
              <p className="order-tracking__info-text">{order.address.name}</p>
              <p className="order-tracking__info-text">{order.address.flat}, {order.address.street}</p>
              <p className="order-tracking__info-text">{order.address.city} – {order.address.pincode}</p>
            </div>
            <div className="order-tracking__info-card">
              <h3 className="order-tracking__info-title">Items</h3>
              {order.items.map((item, i) => (
                <div key={i} className="order-tracking__item">
                  <div className="order-tracking__item-img"><span className="material-symbols-outlined">checkroom</span></div>
                  <div>
                    <p className="order-tracking__item-name">{item.name}</p>
                    <p className="order-tracking__item-meta">Qty {item.qty} · Size {item.size}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-tracking__info-card">
              <h3 className="order-tracking__info-title">Courier Details</h3>
              {order.courier ? (
                <>
                  <div className="order-tracking__courier">
                    <span className="material-symbols-outlined">local_post_office</span>
                    <div>
                      <p className="order-tracking__info-text">{order.courier}</p>
                      <p className="order-tracking__awb-val">{order.awb}</p>
                    </div>
                  </div>
                  <button className="order-tracking__external-btn">
                    <span className="material-symbols-outlined">open_in_new</span>
                    Track on courier site
                  </button>
                </>
              ) : (
                <p className="order-tracking__info-text order-tracking__info-text--muted">Not available yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </BuyerDashboard>
  );
};

export default OrderTrackingPage;
