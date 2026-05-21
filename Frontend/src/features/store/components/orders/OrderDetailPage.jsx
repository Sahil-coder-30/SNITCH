import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BuyerDashboard from '../../../buyer/dashboard/components/BuyerDashboard';
import { DUMMY_ORDERS } from '../../data/dummyData';
import '../../style/OrderDetailPage.scss';

const TRACKING_STEPS = [
  { key: 'placed',       label: 'Order Placed',       icon: 'inventory_2' },
  { key: 'confirmed',    label: 'Confirmed',           icon: 'task_alt' },
  { key: 'packed',       label: 'Packed',              icon: 'deployed_code' },
  { key: 'shipped',      label: 'Shipped',             icon: 'local_shipping' },
  { key: 'out',          label: 'Out for Delivery',    icon: 'delivery_dining' },
  { key: 'delivered',    label: 'Delivered',           icon: 'check_circle' },
];

const STATUS_PROGRESS = {
  processing: 1, shipped: 3, delivered: 5, cancelled: -1,
};

const OrderDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const order = DUMMY_ORDERS.find(o => o.id === id) || DUMMY_ORDERS[0];
  const progress = STATUS_PROGRESS[order.status] ?? 0;

  return (
    <BuyerDashboard breadcrumb={['Home', 'My Orders', order.id]}>
      <div className="order-detail">
        {/* Top bar */}
        <div className="order-detail__topbar">
          <button className="order-detail__back-btn" onClick={() => navigate('/buyer/orders')}>
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Orders
          </button>
          <div className="order-detail__id-block">
            <h1 className="order-detail__order-id">{order.id}</h1>
            <span className="order-detail__date">Ordered on {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          {order.status !== 'cancelled' && (
            <button className="order-detail__track-btn" onClick={() => navigate(`/buyer/track/${order.id}`)}>
              <span className="material-symbols-outlined">location_on</span>
              Live Tracking
            </button>
          )}
        </div>

        <div className="order-detail__layout">
          <div className="order-detail__main">
            {/* Tracking mini-stepper */}
            {order.status !== 'cancelled' && (
              <div className="order-detail__card">
                <h2 className="order-detail__card-title">Order Status</h2>
                <div className="mini-stepper">
                  {TRACKING_STEPS.map((s, i) => (
                    <div key={s.key} className="mini-stepper__item">
                      <div className={`mini-stepper__circle ${i <= progress ? 'mini-stepper__circle--done' : ''}`}>
                        <span className="material-symbols-outlined">{s.icon}</span>
                      </div>
                      <span className={`mini-stepper__label ${i <= progress ? 'mini-stepper__label--done' : ''}`}>{s.label}</span>
                      {i < TRACKING_STEPS.length - 1 && (
                        <div className={`mini-stepper__line ${i < progress ? 'mini-stepper__line--done' : ''}`} />
                      )}
                    </div>
                  ))}
                </div>
                {order.estimatedDelivery && (
                  <p className="order-detail__eta">
                    <span className="material-symbols-outlined">schedule</span>
                    {order.status === 'delivered'
                      ? `Delivered on ${new Date(order.actualDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}`
                      : `Estimated delivery by ${new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}`
                    }
                  </p>
                )}
                {order.awb && (
                  <p className="order-detail__awb">
                    <span className="material-symbols-outlined">barcode_reader</span>
                    AWB: {order.awb} · {order.courier}
                  </p>
                )}
              </div>
            )}

            {/* Items */}
            <div className="order-detail__card">
              <h2 className="order-detail__card-title">Ordered Items</h2>
              {order.items.map((item, idx) => (
                <div key={idx} className="order-detail__item">
                  <div className="order-detail__item-image"><span className="material-symbols-outlined">checkroom</span></div>
                  <div className="order-detail__item-info">
                    <span className="order-detail__item-name">{item.name}</span>
                    <span className="order-detail__item-meta">Size {item.size} · {item.color}</span>
                    <span className="order-detail__item-qty">Qty: {item.qty}</span>
                  </div>
                  <div className="order-detail__item-right">
                    <span className="order-detail__item-price">₹{(item.price * item.qty).toLocaleString()}</span>
                    {order.status === 'delivered' && (
                      <div className="order-detail__item-actions">
                        <button className="order-detail__action-link" onClick={() => navigate('/buyer/return')}>Return</button>
                        <button className="order-detail__action-link" onClick={() => navigate('/buyer/review')}>Write Review</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Address */}
            <div className="order-detail__card">
              <h2 className="order-detail__card-title">Delivery Address</h2>
              <div className="order-detail__address">
                <span className="order-detail__addr-tag">{order.address.type}</span>
                <p className="order-detail__addr-name">{order.address.name}</p>
                <p className="order-detail__addr-line">{order.address.flat}, {order.address.street}</p>
                <p className="order-detail__addr-line">{order.address.city}, {order.address.state} – {order.address.pincode}</p>
                <p className="order-detail__addr-phone">{order.address.phone}</p>
              </div>
            </div>
          </div>

          {/* Price breakdown sidebar */}
          <div className="order-detail__sidebar">
            <div className="order-detail__card">
              <h2 className="order-detail__card-title">Price Breakdown</h2>
              <div className="order-detail__price-rows">
                <div className="order-detail__price-row"><span>Subtotal</span><span>₹{order.total.toLocaleString()}</span></div>
                {order.discount > 0 && (
                  <div className="order-detail__price-row order-detail__price-row--discount"><span>Discount</span><span>−₹{order.discount}</span></div>
                )}
                <div className="order-detail__price-row"><span>Delivery</span><span className={order.deliveryFee === 0 ? 'order-detail__free' : ''}>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span></div>
                <div className="order-detail__price-divider" />
                <div className="order-detail__price-total"><span>Total</span><span>₹{order.total.toLocaleString()}</span></div>
              </div>
              <div className="order-detail__payment-chip">
                <span className="material-symbols-outlined">credit_card</span>
                {order.paymentMethod}
              </div>
              <button className="order-detail__invoice-btn">
                <span className="material-symbols-outlined">download</span>
                Download Invoice
              </button>
            </div>

            {/* Cancel order */}
            {['processing', 'confirmed'].includes(order.status) && (
              <button className="order-detail__cancel-btn">
                <span className="material-symbols-outlined">cancel</span>
                Cancel Order
              </button>
            )}
            {order.status === 'cancelled' && (
              <div className="order-detail__cancelled-note">
                <span className="material-symbols-outlined">cancel</span>
                This order was cancelled. Refund will be credited within 5-7 business days.
              </div>
            )}
          </div>
        </div>
      </div>
    </BuyerDashboard>
  );
};

export default OrderDetailPage;
