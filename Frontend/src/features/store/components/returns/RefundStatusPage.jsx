import React from 'react';
import { useNavigate } from 'react-router-dom';
import BuyerDashboard from '../../../buyer/dashboard/components/BuyerDashboard';
import '../../style/RefundStatusPage.scss';

const REFUND_TIMELINE = [
  { step: 'Return Requested',    date: 'Apr 14, 2024',  time: '3:45 PM', done: true  },
  { step: 'Return Approved',     date: 'Apr 15, 2024',  time: '10:22 AM', done: true  },
  { step: 'Item Picked Up',      date: 'Apr 16, 2024',  time: '1:40 PM', done: true  },
  { step: 'Refund Initiated',    date: 'Apr 16, 2024',  time: '5:00 PM', done: true  },
  { step: 'Refund Processed',    date: 'Apr 17, 2024',  time: '—',        done: false },
  { step: 'Amount Credited',     date: 'Expected Apr 21', time: '—',      done: false },
];

const RefundStatusPage = () => {
  const navigate = useNavigate();
  const currentStep = REFUND_TIMELINE.filter(s => s.done).length - 1;

  return (
    <BuyerDashboard breadcrumb={['Home', 'My Orders', 'Refund Status']}>
      <div className="refund-page">
        <div className="refund-page__header">
          <h1 className="refund-page__title">Refund Status</h1>
          <p className="refund-page__subtitle">Track the progress of your refund</p>
        </div>

        <div className="refund-page__layout">
          {/* Summary card */}
          <div className="refund-page__summary-card">
            <div className="refund-page__summary-icon">
              <span className="material-symbols-outlined">currency_rupee</span>
            </div>
            <div className="refund-page__summary-info">
              <span className="refund-page__refund-amount">₹1,199</span>
              <span className="refund-page__refund-label">Refund Amount</span>
            </div>
            <div className="refund-page__summary-status">
              <span className="refund-page__status-badge refund-page__status-badge--processing">Processing</span>
            </div>
          </div>

          <div className="refund-page__details-row">
            <div className="refund-page__detail"><span className="refund-page__detail-label">Order ID</span><span className="refund-page__detail-val">ORD-2024-8701</span></div>
            <div className="refund-page__detail"><span className="refund-page__detail-label">Return ID</span><span className="refund-page__detail-val">RET-55123</span></div>
            <div className="refund-page__detail"><span className="refund-page__detail-label">Refund Method</span><span className="refund-page__detail-val">Original Payment · COD → Bank</span></div>
            <div className="refund-page__detail"><span className="refund-page__detail-label">Item</span><span className="refund-page__detail-val">Floral Wrap Dress · Size M</span></div>
          </div>

          {/* Timeline */}
          <div className="refund-page__timeline-card">
            <h2 className="refund-page__timeline-title">Refund Timeline</h2>
            <div className="refund-timeline">
              {REFUND_TIMELINE.map((step, i) => (
                <div key={i} className={`refund-timeline__item ${step.done ? 'refund-timeline__item--done' : ''} ${i === currentStep ? 'refund-timeline__item--current' : ''}`}>
                  <div className="refund-timeline__icon-col">
                    <div className={`refund-timeline__circle ${step.done ? 'refund-timeline__circle--done' : ''} ${i === currentStep && step.done ? 'refund-timeline__circle--current' : ''}`}>
                      {step.done
                        ? <span className="material-symbols-outlined">check</span>
                        : <span className="material-symbols-outlined">radio_button_unchecked</span>
                      }
                    </div>
                    {i < REFUND_TIMELINE.length - 1 && (
                      <div className={`refund-timeline__line ${step.done ? 'refund-timeline__line--done' : ''}`} />
                    )}
                  </div>
                  <div className="refund-timeline__content">
                    <span className={`refund-timeline__step-label ${step.done ? 'refund-timeline__step-label--done' : ''}`}>{step.step}</span>
                    <span className="refund-timeline__step-date">{step.date}{step.time !== '—' ? ` · ${step.time}` : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="refund-page__note">
            <span className="material-symbols-outlined">info</span>
            <p>Refund typically takes 5–7 business days after approval. For any issues, contact support at <strong>support@snitch.in</strong></p>
          </div>

          <div className="refund-page__cta-row">
            <button className="refund-page__btn-primary" onClick={() => navigate('/buyer/orders')}>
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Orders
            </button>
            <button className="refund-page__btn-secondary">
              <span className="material-symbols-outlined">headset_mic</span>
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </BuyerDashboard>
  );
};

export default RefundStatusPage;
