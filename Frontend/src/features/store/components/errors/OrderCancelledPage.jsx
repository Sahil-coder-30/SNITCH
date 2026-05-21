import React from "react";
import { useNavigate } from "react-router-dom";
import BuyerDashboard from "../../../buyer/dashboard/components/BuyerDashboard";
import "../../style/OrderCancelledPage.scss";

const REFUND_STEPS = [
  {
    label: "Cancellation Confirmed",
    desc: "Your order has been cancelled.",
    done: true,
  },
  {
    label: "Refund Initiated",
    desc: "Amount sent to payment gateway.",
    done: true,
  },
  {
    label: "Refund Processing",
    desc: "Bank is processing the refund.",
    done: false,
  },
  { label: "Amount Credited", desc: "Expected by Apr 21, 2024.", done: false },
];

const OrderCancelledPage = () => {
  const navigate = useNavigate();

  return (
    <BuyerDashboard breadcrumb={["Home", "My Orders", "Order Cancelled"]}>
      <div className="order-cancelled">
        <div className="order-cancelled__card">
          {/* Icon */}
          <div className="order-cancelled__icon-wrapper">
            <span className="material-symbols-outlined order-cancelled__icon">
              cancel
            </span>
          </div>

          <h1 className="order-cancelled__heading">Order Cancelled</h1>
          <p className="order-cancelled__subtitle">
            Your order <strong>ORD-2024-8701</strong> has been successfully
            cancelled.
          </p>

          <div className="order-cancelled__item-preview">
            <div className="order-cancelled__item-img">
              <span className="material-symbols-outlined">checkroom</span>
            </div>
            <div className="order-cancelled__item-info">
              <span className="order-cancelled__item-name">
                Floral Wrap Dress
              </span>
              <span className="order-cancelled__item-meta">
                Size M · Dusty Rose · Qty 1
              </span>
              <span className="order-cancelled__item-price">₹1,199</span>
            </div>
          </div>

          {/* Refund timeline */}
          <div className="order-cancelled__refund-section">
            <h2 className="order-cancelled__refund-title">
              <span className="material-symbols-outlined">currency_rupee</span>
              Refund Status · ₹1,199
            </h2>
            <div className="order-cancelled__refund-timeline">
              {REFUND_STEPS.map((s, i) => (
                <div
                  key={i}
                  className={`cancelled-timeline__item ${s.done ? "cancelled-timeline__item--done" : ""}`}
                >
                  <div className="cancelled-timeline__icon-col">
                    <div
                      className={`cancelled-timeline__circle ${s.done ? "cancelled-timeline__circle--done" : ""}`}
                    >
                      {s.done ? (
                        <span className="material-symbols-outlined">check</span>
                      ) : (
                        <span className="material-symbols-outlined">
                          radio_button_unchecked
                        </span>
                      )}
                    </div>
                    {i < REFUND_STEPS.length - 1 && (
                      <div
                        className={`cancelled-timeline__line ${s.done ? "cancelled-timeline__line--done" : ""}`}
                      />
                    )}
                  </div>
                  <div className="cancelled-timeline__content">
                    <span
                      className={`cancelled-timeline__label ${s.done ? "cancelled-timeline__label--done" : ""}`}
                    >
                      {s.label}
                    </span>
                    <span className="cancelled-timeline__desc">{s.desc}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-cancelled__refund-note">
              <span className="material-symbols-outlined">info</span>
              Refund will be credited to your original payment method within 5–7
              business days.
            </div>
          </div>

          <div className="order-cancelled__cta-row">
            <button
              className="order-cancelled__btn-primary"
              onClick={() => navigate("/buyer")}
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              Continue Shopping
            </button>
            <button
              className="order-cancelled__btn-secondary"
              onClick={() => navigate("/buyer/orders")}
            >
              View All Orders
            </button>
            <button
              className="order-cancelled__btn-ghost"
              onClick={() => navigate("/buyer/refund-status")}
            >
              Track Refund
            </button>
          </div>
        </div>
      </div>
    </BuyerDashboard>
  );
};

export default OrderCancelledPage;
