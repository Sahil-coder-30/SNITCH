import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BuyerDashboard from '../../../buyer/dashboard/components/BuyerDashboard';
import { DUMMY_ORDERS } from '../../data/dummyData';
import '../../style/MyOrdersPage.scss';

const STATUS_CONFIG = {
  delivered:  { label: 'Delivered',  color: '#4ade80', icon: 'check_circle' },
  shipped:    { label: 'Shipped',    color: '#60a5fa', icon: 'local_shipping' },
  processing: { label: 'Processing', color: '#facc15', icon: 'autorenew' },
  cancelled:  { label: 'Cancelled',  color: '#f87171', icon: 'cancel' },
};

const TABS = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = DUMMY_ORDERS.filter(o => {
    const matchTab = activeTab === 'All' || o.status === activeTab.toLowerCase();
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some(i => i.name.toLowerCase().includes(search.toLowerCase()));
    return matchTab && matchSearch;
  });

  return (
    <BuyerDashboard breadcrumb={['Home', 'My Orders']}>
      <div className="my-orders">
        <div className="my-orders__header">
          <h1 className="my-orders__title">My Orders</h1>
          <div className="my-orders__search">
            <span className="material-symbols-outlined">search</span>
            <input type="text" placeholder="Search by order ID or product..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Tabs */}
        <div className="my-orders__tabs">
          {TABS.map(tab => (
            <button key={tab} className={`my-orders__tab ${activeTab === tab ? 'my-orders__tab--active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab}
              <span className="my-orders__tab-count">
                {tab === 'All' ? DUMMY_ORDERS.length : DUMMY_ORDERS.filter(o => o.status === tab.toLowerCase()).length}
              </span>
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="my-orders__list">
          {filtered.length === 0 ? (
            <div className="my-orders__empty">
              <span className="material-symbols-outlined">inventory_2</span>
              <h3>No orders found</h3>
              <p>Try changing the filter or search term.</p>
            </div>
          ) : (
            filtered.map(order => {
              const cfg = STATUS_CONFIG[order.status];
              return (
                <div key={order.id} className="order-card" onClick={() => navigate(`/buyer/orders/${order.id}`)}>
                  <div className="order-card__header">
                    <div className="order-card__id-block">
                      <span className="order-card__id">{order.id}</span>
                      <span className="order-card__date">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="order-card__status" style={{ color: cfg.color, background: `${cfg.color}15`, borderColor: `${cfg.color}30` }}>
                      <span className="material-symbols-outlined">{cfg.icon}</span>
                      {cfg.label}
                    </div>
                  </div>

                  <div className="order-card__items">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-card__item">
                        <div className="order-card__item-image"><span className="material-symbols-outlined">checkroom</span></div>
                        <div className="order-card__item-info">
                          <span className="order-card__item-name">{item.name}</span>
                          <span className="order-card__item-meta">Size {item.size} · {item.color} · Qty {item.qty}</span>
                        </div>
                        <span className="order-card__item-price">₹{(item.price * item.qty).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-card__footer">
                    <div className="order-card__footer-info">
                      <span className="order-card__total">Total: ₹{order.total.toLocaleString()}</span>
                      <span className="order-card__payment">{order.paymentMethod}</span>
                    </div>
                    <div className="order-card__actions">
                      {order.status === 'delivered' && (
                        <>
                          <button className="order-card__btn order-card__btn--ghost" onClick={e => { e.stopPropagation(); navigate('/buyer/return'); }}>
                            Return
                          </button>
                          <button className="order-card__btn order-card__btn--ghost" onClick={e => { e.stopPropagation(); navigate('/buyer/review'); }}>
                            Review
                          </button>
                        </>
                      )}
                      {['processing', 'shipped'].includes(order.status) && (
                        <button className="order-card__btn order-card__btn--primary" onClick={e => { e.stopPropagation(); navigate(`/buyer/track/${order.id}`); }}>
                          <span className="material-symbols-outlined">location_on</span>
                          Track Order
                        </button>
                      )}
                      {order.status === 'cancelled' && (
                        <button className="order-card__btn order-card__btn--ghost" onClick={e => { e.stopPropagation(); navigate('/buyer'); }}>
                          Reorder
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </BuyerDashboard>
  );
};

export default MyOrdersPage;
