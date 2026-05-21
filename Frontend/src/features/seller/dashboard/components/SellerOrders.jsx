import React from 'react';
import SellerDashboard from './SellerDashboard';
import StatusBadge     from '../../../../components/dashboard/StatusBadge';
import { useSellerOrders } from '../Hooks/useSellerOrders';
import '../style/SellerOrders.scss';

const tabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returns'];

const SellerOrders = () => {
  const {
    orders,
    loading,
    error,
    activeTab,
    setActiveTab,
    drawerOpen,
    selectedOrder,
    timeline,
    openDrawer,
    closeDrawer
  } = useSellerOrders();

  if (error) return <div className="seller-orders__error">Error: {error}</div>;

  return (
    <SellerDashboard breadcrumb={['Dashboard', 'Orders']}>
      <div className="seller-orders">
        <div className="seller-orders__header">
          <h1 className="seller-orders__title">Orders</h1>
        </div>

        {/* Filter tabs */}
        <div className="seller-orders__tabs">
          {tabs.map(t => (
            <button
              key={t}
              className={`seller-orders__tab ${activeTab === t ? 'seller-orders__tab--active' : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="seller-orders__card">
          <div className="seller-orders__table-wrap">
            <table className="seller-orders__table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Buyer</th>
                  <th>Size / Color</th>
                  <th>Qty</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10">
                      <div className="skeleton-pulse" style={{ height: '400px', margin: '1rem' }} />
                    </td>
                  </tr>
                ) : orders.length > 0 ? (
                  orders.map(o => (
                    <tr key={o.id}>
                      <td className="seller-orders__order-id">{o.id}</td>
                      <td>
                        <div className="seller-orders__product-cell">
                          <span className="seller-orders__product-thumb">{o.thumb}</span>
                          <span className="seller-orders__product-name">{o.product}</span>
                        </div>
                      </td>
                      <td>{o.buyer}</td>
                      <td className="seller-orders__size-color">{o.sizeColor}</td>
                      <td>{o.qty}</td>
                      <td className="seller-orders__amount">{o.amount}</td>
                      <td>
                        <span className="seller-orders__payment-tag">{o.payment}</span>
                      </td>
                      <td><StatusBadge status={o.status} /></td>
                      <td className="seller-orders__date">{o.date}</td>
                      <td>
                        <div className="seller-orders__actions">
                          <button className="seller-orders__action-btn" title="View Details" onClick={() => openDrawer(o)}>
                            <span className="material-symbols-outlined">visibility</span>
                          </button>
                          <button className="seller-orders__action-btn" title="Print Label">
                            <span className="material-symbols-outlined">print</span>
                          </button>
                          <button className="seller-orders__action-btn" title="Update Status">
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                      No orders found for this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Detail Drawer */}
      {drawerOpen && selectedOrder && (
        <div className="order-drawer-overlay" onClick={closeDrawer}>
          <aside className="order-drawer" onClick={e => e.stopPropagation()}>
            <div className="order-drawer__header">
              <div>
                <span className="order-drawer__id">{selectedOrder.id}</span>
                <StatusBadge status={selectedOrder.status} />
              </div>
              <button className="order-drawer__close" onClick={closeDrawer}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="order-drawer__body">
              {/* Buyer info */}
              <div className="order-drawer__section">
                <h3 className="order-drawer__section-title">Buyer Info</h3>
                <p className="order-drawer__buyer-name">{selectedOrder.buyer}</p>
                <p className="order-drawer__address">42, Green Park, New Delhi – 110016</p>
                <p className="order-drawer__phone">+91 98765 43210</p>
              </div>

              {/* Product */}
              <div className="order-drawer__section">
                <h3 className="order-drawer__section-title">Product</h3>
                <div className="order-drawer__product-row">
                  <div className="order-drawer__product-thumb">
                    <span className="material-symbols-outlined">checkroom</span>
                  </div>
                  <div className="order-drawer__product-info">
                    <span className="order-drawer__product-name">{selectedOrder.product}</span>
                    <span className="order-drawer__product-meta">{selectedOrder.sizeColor} · Qty: {selectedOrder.qty}</span>
                    <span className="order-drawer__product-price">{selectedOrder.amount}</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="order-drawer__section">
                <h3 className="order-drawer__section-title">Order Timeline</h3>
                <div className="order-drawer__timeline">
                  {timeline.map((step, i) => (
                    <div key={step.label} className={`order-drawer__step ${step.done ? 'order-drawer__step--done' : ''}`}>
                      <div className="order-drawer__step-dot">
                        <span className="material-symbols-outlined">
                          {step.done ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                      </div>
                      {i < timeline.length - 1 && (
                        <div className={`order-drawer__step-line ${step.done ? 'order-drawer__step-line--done' : ''}`} />
                      )}
                      <div className="order-drawer__step-info">
                        <span className="order-drawer__step-label">{step.label}</span>
                        <span className="order-drawer__step-date">{step.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Courier */}
              <div className="order-drawer__section">
                <h3 className="order-drawer__section-title">Courier</h3>
                <div className="order-drawer__courier-row">
                  <div>
                    <span className="order-drawer__courier-name">Delhivery</span>
                    <span className="order-drawer__courier-awb">AWB: 1234567890</span>
                  </div>
                  <button className="order-drawer__copy-btn">
                    <span className="material-symbols-outlined">content_copy</span>
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <div className="order-drawer__footer">
              <button className="order-drawer__update-btn">
                Update Status
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </SellerDashboard>
  );
};

export default SellerOrders;
