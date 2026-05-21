import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BuyerDashboard from '../../../buyer/dashboard/components/BuyerDashboard';
import { DUMMY_ORDERS } from '../../data/dummyData';
import '../../style/WriteReviewPage.scss';

const StarRating = ({ value, onChange }) => (
  <div className="star-rating">
    {[1, 2, 3, 4, 5].map(n => (
      <button key={n} type="button" className={`star-rating__star ${n <= value ? 'star-rating__star--filled' : ''}`} onClick={() => onChange(n)}>
        <span className="material-symbols-outlined">{n <= value ? 'star' : 'star'}</span>
      </button>
    ))}
    <span className="star-rating__label">{['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][value]}</span>
  </div>
);

const WriteReviewPage = () => {
  const navigate = useNavigate();
  const deliveredOrders = DUMMY_ORDERS.filter(o => o.status === 'delivered');
  const [selectedOrderId, setSelectedOrderId] = useState(deliveredOrders[0]?.id || '');
  const [selectedItemIdx, setSelectedItemIdx] = useState(null);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const order = deliveredOrders.find(o => o.id === selectedOrderId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || selectedItemIdx === null) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <BuyerDashboard breadcrumb={['Home', 'My Orders', 'Write Review']}>
        <div className="review-page">
          <div className="review-page__success">
            <div className="review-page__success-icon">⭐</div>
            <h2>Review Submitted!</h2>
            <p>Thank you for your feedback! Your review helps other shoppers make better decisions.</p>
            <div className="review-page__success-btns">
              <button className="review-page__btn-primary" onClick={() => navigate('/buyer')}>Continue Shopping</button>
              <button className="review-page__btn-secondary" onClick={() => navigate('/buyer/orders')}>My Orders</button>
            </div>
          </div>
        </div>
      </BuyerDashboard>
    );
  }

  return (
    <BuyerDashboard breadcrumb={['Home', 'My Orders', 'Write Review']}>
      <div className="review-page">
        <div className="review-page__header">
          <h1 className="review-page__title">Write a Review</h1>
          <p className="review-page__subtitle">Share your experience with this product</p>
        </div>

        <form className="review-page__form" onSubmit={handleSubmit}>
          {/* Select Order */}
          <div className="review-page__section">
            <h2 className="review-page__section-title">
              <span className="review-page__step-badge">1</span>
              Select Order
            </h2>
            <div className="review-page__order-tabs">
              {deliveredOrders.map(o => (
                <button key={o.id} type="button"
                  className={`review-page__order-tab ${selectedOrderId === o.id ? 'review-page__order-tab--active' : ''}`}
                  onClick={() => { setSelectedOrderId(o.id); setSelectedItemIdx(null); setRating(0); }}
                >
                  {o.id}
                  <span className="review-page__order-tab-date">{new Date(o.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Select Item */}
          {order && (
            <div className="review-page__section">
              <h2 className="review-page__section-title">
                <span className="review-page__step-badge">2</span>
                Select Item
              </h2>
              <div className="review-page__item-list">
                {order.items.map((item, i) => (
                  <label key={i} className={`review-page__item-card ${selectedItemIdx === i ? 'review-page__item-card--selected' : ''}`}>
                    <input type="radio" name="item" checked={selectedItemIdx === i} onChange={() => setSelectedItemIdx(i)} />
                    <div className="review-page__item-img"><span className="material-symbols-outlined">checkroom</span></div>
                    <div className="review-page__item-info">
                      <span className="review-page__item-name">{item.name}</span>
                      <span className="review-page__item-meta">Size {item.size} · {item.color}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Rating & Review */}
          {selectedItemIdx !== null && (
            <>
              <div className="review-page__section">
                <h2 className="review-page__section-title">
                  <span className="review-page__step-badge">3</span>
                  Rate This Product
                </h2>
                <StarRating value={rating} onChange={setRating} />
              </div>

              <div className="review-page__section">
                <h2 className="review-page__section-title">
                  <span className="review-page__step-badge">4</span>
                  Write Your Review
                </h2>
                <input
                  type="text"
                  className="review-page__title-input"
                  placeholder="Give your review a title..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
                <textarea
                  className="review-page__textarea"
                  placeholder="Share your experience — fit, quality, comfort, style..."
                  rows={6}
                  value={review}
                  onChange={e => setReview(e.target.value)}
                />

                {/* Photo Upload */}
                <div className="review-page__photo-row">
                  <p className="review-page__photo-label">Add Photos (optional)</p>
                  <div className="review-page__photo-slots">
                    {[0,1,2,3,4].map(n => (
                      <label key={n} className="review-page__photo-slot" htmlFor={`photo-${n}`}>
                        <span className="material-symbols-outlined">add_photo_alternate</span>
                        <input type="file" id={`photo-${n}`} accept="image/*" className="review-page__photo-input" />
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <button type="submit" className="review-page__submit-btn" disabled={rating === 0}>
                <span className="material-symbols-outlined">star</span>
                Submit Review
              </button>
            </>
          )}
        </form>
      </div>
    </BuyerDashboard>
  );
};

export default WriteReviewPage;
