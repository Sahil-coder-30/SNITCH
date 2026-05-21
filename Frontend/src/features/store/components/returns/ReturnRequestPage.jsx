import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BuyerDashboard from '../../../buyer/dashboard/components/BuyerDashboard';
import { DUMMY_ORDERS, RETURN_REASONS } from '../../data/dummyData';
import '../../style/ReturnRequestPage.scss';

const ReturnRequestPage = () => {
  const navigate = useNavigate();
  const [selectedOrderId, setSelectedOrderId] = useState(DUMMY_ORDERS[0].id);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const deliveredOrders = DUMMY_ORDERS.filter(o => o.status === 'delivered');
  const order = deliveredOrders.find(o => o.id === selectedOrderId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedItem || !reason) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <BuyerDashboard breadcrumb={['Home', 'My Orders', 'Return Request']}>
        <div className="return-page">
          <div className="return-page__success">
            <div className="return-page__success-icon">
              <span className="material-symbols-outlined">task_alt</span>
            </div>
            <h2>Return Request Submitted!</h2>
            <p>Your return request has been submitted successfully. Our team will review it within 24–48 hours.</p>
            <div className="return-page__success-info">
              <span className="material-symbols-outlined">confirmation_number</span>
              Return ID: <strong>RET-{Math.floor(Math.random() * 90000 + 10000)}</strong>
            </div>
            <div className="return-page__success-btns">
              <button className="return-page__btn-primary" onClick={() => navigate('/buyer/refund-status')}>View Refund Status</button>
              <button className="return-page__btn-secondary" onClick={() => navigate('/buyer/orders')}>My Orders</button>
            </div>
          </div>
        </div>
      </BuyerDashboard>
    );
  }

  return (
    <BuyerDashboard breadcrumb={['Home', 'My Orders', 'Return Request']}>
      <div className="return-page">
        <div className="return-page__header">
          <h1 className="return-page__title">Request a Return</h1>
          <p className="return-page__subtitle">Select the order and item you want to return</p>
        </div>

        <form className="return-page__form" onSubmit={handleSubmit}>
          {/* Step 1: Select Order */}
          <div className="return-page__section">
            <h2 className="return-page__section-title">
              <span className="return-page__step-badge">1</span>
              Select Order
            </h2>
            <div className="return-page__order-list">
              {deliveredOrders.map(o => (
                <label key={o.id} className={`return-page__order-card ${selectedOrderId === o.id ? 'return-page__order-card--selected' : ''}`}>
                  <input type="radio" name="order" value={o.id} checked={selectedOrderId === o.id} onChange={() => { setSelectedOrderId(o.id); setSelectedItem(null); }} />
                  <div className="return-page__order-info">
                    <span className="return-page__order-id">{o.id}</span>
                    <span className="return-page__order-date">{new Date(o.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Step 2: Select Item */}
          {order && (
            <div className="return-page__section">
              <h2 className="return-page__section-title">
                <span className="return-page__step-badge">2</span>
                Select Item to Return
              </h2>
              <div className="return-page__item-list">
                {order.items.map((item, i) => (
                  <label key={i} className={`return-page__item-card ${selectedItem === i ? 'return-page__item-card--selected' : ''}`}>
                    <input type="radio" name="item" value={i} checked={selectedItem === i} onChange={() => setSelectedItem(i)} />
                    <div className="return-page__item-image"><span className="material-symbols-outlined">checkroom</span></div>
                    <div className="return-page__item-info">
                      <span className="return-page__item-name">{item.name}</span>
                      <span className="return-page__item-meta">Size {item.size} · {item.color} · Qty {item.qty}</span>
                      <span className="return-page__item-price">₹{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Reason */}
          {selectedItem !== null && (
            <div className="return-page__section">
              <h2 className="return-page__section-title">
                <span className="return-page__step-badge">3</span>
                Reason for Return
              </h2>
              <div className="return-page__reasons">
                {RETURN_REASONS.map(r => (
                  <label key={r} className={`return-page__reason-chip ${reason === r ? 'return-page__reason-chip--selected' : ''}`}>
                    <input type="radio" name="reason" value={r} checked={reason === r} onChange={() => setReason(r)} />
                    {r}
                  </label>
                ))}
              </div>
              <textarea
                className="return-page__details"
                placeholder="Add more details (optional)..."
                rows={4}
                value={details}
                onChange={e => setDetails(e.target.value)}
              />

              {/* Photo Upload */}
              <div className="return-page__photo-upload">
                <span className="material-symbols-outlined return-page__upload-icon">add_photo_alternate</span>
                <p className="return-page__upload-label">Upload photos of the item</p>
                <p className="return-page__upload-hint">Attach up to 5 photos (optional, helps speed up your return)</p>
                <input type="file" accept="image/*" multiple className="return-page__upload-input" id="return-photos" />
                <label htmlFor="return-photos" className="return-page__upload-btn">Choose Photos</label>
              </div>
            </div>
          )}

          {selectedItem !== null && reason && (
            <button type="submit" className="return-page__submit-btn">
              <span className="material-symbols-outlined">send</span>
              Submit Return Request
            </button>
          )}
        </form>
      </div>
    </BuyerDashboard>
  );
};

export default ReturnRequestPage;
