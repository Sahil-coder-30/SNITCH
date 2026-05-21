import React from 'react';
import BuyerDashboard from './BuyerDashboard';
import StatusBadge    from '../../../../components/dashboard/StatusBadge';
import { useBuyerOrders } from '../Hooks/useBuyerOrders';
import '../style/BuyerOrders.scss';

const tabs = ['All Orders', 'Active', 'Delivered', 'Cancelled', 'Returns & Refunds'];

const BuyerOrders = () => {
  const {
    orders,
    loading,
    error,
    activeTab,
    setActiveTab,
    trackingOpen,
    trackingSteps,
    selectedOrder,
    handleTrackOrder,
    closeTracking
  } = useBuyerOrders();

  if (error) return <div className="buyer-orders__error">Error: {error}</div>;

  return (
    <BuyerDashboard breadcrumb={['Home', 'My Orders']}>
      <div className="buyer-orders">
        <h1 className="buyer-orders__title">My Orders</h1>

        {/* Tabs */}
        <div className="buyer-orders__tabs">
          {tabs.map(t => (
            <button
              key={t}
              className={`buyer-orders__tab ${activeTab === t ? 'buyer-orders__tab--active' : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Order Cards */}
        <div className="buyer-orders__list">
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="skeleton-pulse" style={{ height: '220px', borderRadius: '12px', marginBottom: '1.5rem' }} />)
          ) : orders.length > 0 ? (
            orders.map(order => (
              <div key={order.id} className="buyer-orders__card">
                <div className="buyer-orders__card-header">
                  <div className="buyer-orders__card-id-row">
                    <span className="buyer-orders__order-id">Order #{order.id}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <span className="buyer-orders__placed-date">Placed: {order.date}</span>
                </div>

                <div className="buyer-orders__card-body">
                  <div className="buyer-orders__product-thumb">
                    <span className="material-symbols-outlined">checkroom</span>
                  </div>
                  <div className="buyer-orders__product-info">
                    <span className="buyer-orders__product-name">{order.product}, {order.size}</span>
                    <span className="buyer-orders__product-meta">{order.price} · Qty: {order.qty}</span>
                  </div>
                </div>

                {/* Progress bar (visual only) */}
                <div className="buyer-orders__progress-wrap">
                  <div className="buyer-orders__progress-track">
                    <div
                      className="buyer-orders__progress-fill"
                      style={{
                        width: order.status === 'delivered' ? '100%' :
                               order.status === 'shipped'    ? '70%'  :
                               order.status === 'processing' ? '35%'  :
                               order.status === 'cancelled'  ? '10%'  : '50%'
                      }}
                    />
                  </div>
                  <span className="buyer-orders__progress-label">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                </div>

                {order.expected !== '—' && (
                  <p className="buyer-orders__expected">
                    Expected delivery: <strong>{order.expected}</strong>
                  </p>
                )}

                <div className="buyer-orders__card-actions">
                  <button className="buyer-orders__action-btn buyer-orders__action-btn--primary" onClick={() => handleTrackOrder(order)}>
                    <span className="material-symbols-outlined">location_on</span>
                    Track Order
                  </button>
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <button className="buyer-orders__action-btn">
                      <span className="material-symbols-outlined">cancel</span>
                      Cancel
                    </button>
                  )}
                  <button className="buyer-orders__action-btn">
                    <span className="material-symbols-outlined">download</span>
                    Invoice
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="buyer-orders__empty">No orders found.</div>
          )}
        </div>

        {/* Tracking Modal */}
        {trackingOpen && (
          <div className="tracking-overlay" onClick={closeTracking}>
            <div className="tracking-modal" onClick={e => e.stopPropagation()}>
              <div className="tracking-modal__header">
                <h2 className="tracking-modal__title">Track Order</h2>
                <button className="tracking-modal__close" onClick={closeTracking}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="tracking-modal__order-info">
                <span className="tracking-modal__order-id">{selectedOrder?.id}</span>
                <span className="tracking-modal__product">{selectedOrder?.product}, {selectedOrder?.size}</span>
              </div>

              {/* Horizontal stepper */}
              <div className="tracking-modal__stepper">
                {trackingSteps.map((step, i) => (
                  <div key={step.label} className={`tracking-modal__step ${step.done ? 'tracking-modal__step--done' : ''}`}>
                    <div className="tracking-modal__step-dot">
                      <span className="material-symbols-outlined">{step.icon}</span>
                    </div>
                    {i < trackingSteps.length - 1 && (
                      <div className={`tracking-modal__step-line ${step.done ? 'tracking-modal__step-line--done' : ''}`} />
                    )}
                    <span className="tracking-modal__step-label">{step.label}</span>
                    <span className="tracking-modal__step-date">{step.date}</span>
                  </div>
                ))}
              </div>

              <div className="tracking-modal__courier">
                <div>
                  <span className="tracking-modal__courier-name">Delhivery</span>
                  <span className="tracking-modal__courier-awb">AWB: 1234567890</span>
                </div>
                <button className="tracking-modal__copy-btn">
                  <span className="material-symbols-outlined">content_copy</span>
                  Copy AWB
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </BuyerDashboard>
  );
};

export default BuyerOrders;
