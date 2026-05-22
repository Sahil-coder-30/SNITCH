import React from "react";
import StatusBadge from "./StatusBadge";
import "./ProductCard.scss";
import { DashboardProductCardSkeleton } from "../loaders/ComponentSkeletons";

// variant: 'grid' | 'list'
const ProductCard = ({
  variant = "grid",
  name = "Oversized Black Hoodie",
  category = "Men's",
  subCategory = "Hoodie",
  price = 899,
  originalPrice = null,
  stock = 24,
  rating = 4.3,
  reviewCount = 18,
  status = "active", // 'active' | 'draft' | 'out-of-stock'
  isWishlisted = false,
  showBuyerActions = false,
  badge = null, // 'NEW' | 'SALE'
  onClick = null,
  loading = false,
  image = null,
}) => {
  if (loading) return <DashboardProductCardSkeleton />;
  const discountPct = originalPrice
    ? Math.round(100 - (price / originalPrice) * 100)
    : null;

  const ClothingImage = () => {
    if (image) {
      return (
        <img 
          src={image} 
          alt={name} 
          className="product-card__image" 
          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
        />
      );
    }
    return (
      <div className="product-card__image-placeholder">
        <span className="material-symbols-outlined product-card__image-icon">
          checkroom
        </span>
      </div>
    );
  };

  if (variant === "list") {
    return (
      <div className="product-card product-card--list">
        <ClothingImage />
        <div className="product-card__list-body">
          <div className="product-card__list-info">
            <span className="product-card__name">{name}</span>
            <span className="product-card__category">
              {category} · {subCategory}
            </span>
          </div>
          <div className="product-card__list-meta">
            <span className="product-card__price">
              ₹{price.toLocaleString("en-IN")}
            </span>
            <span className="product-card__stock">{stock} units</span>
            <div className="product-card__rating">
              <span className="material-symbols-outlined product-card__rating-star">
                star
              </span>
              {rating} ({reviewCount})
            </div>
          </div>
          <StatusBadge status={status} />
          <div className="product-card__actions">
            <button className="product-card__action-btn" title="Edit">
              <span className="material-symbols-outlined">edit</span>
            </button>
            <button className="product-card__action-btn" title="View">
              <span className="material-symbols-outlined">visibility</span>
            </button>
            <button
              className="product-card__action-btn product-card__action-btn--danger"
              title="Delete"
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid variant
  return (
    <div
      className="product-card product-card--grid"
      onClick={onClick}
      style={onClick ? { cursor: "pointer" } : {}}
    >
      <div className="product-card__image-wrap">
        <ClothingImage />

        {/* Top-left badge */}
        {(badge || status === "out-of-stock") && (
          <span
            className={`product-card__badge product-card__badge--${badge?.toLowerCase() || "oos"}`}
          >
            {badge || "OOS"}
          </span>
        )}

        {/* Wishlist (buyer only) */}
        {showBuyerActions && (
          <button className="product-card__wishlist" aria-label="Wishlist">
            <span
              className={`material-symbols-outlined ${isWishlisted ? "product-card__wishlist--filled" : ""}`}
            >
              favorite
            </span>
          </button>
        )}

        {/* Seller status badge */}
        {!showBuyerActions && (
          <span className="product-card__status-overlay">
            <StatusBadge status={status} />
          </span>
        )}
      </div>

      <div className="product-card__body">
        {showBuyerActions && (
          <span className="product-card__brand">SNITCH</span>
        )}
        <h3 className="product-card__name">{name}</h3>

        {!showBuyerActions && (
          <span className="product-card__category">
            {category} · {subCategory}
          </span>
        )}

        {showBuyerActions && (
          <div className="product-card__colors">
            <span
              className="product-card__color-dot"
              style={{ background: "#1a1a1a" }}
            />
            <span
              className="product-card__color-dot"
              style={{ background: "#6b4f3c" }}
            />
            <span
              className="product-card__color-dot"
              style={{ background: "#d4af7a" }}
            />
          </div>
        )}

        {showBuyerActions && (
          <div className="product-card__sizes">
            {["S", "M", "L", "XL"].map((s) => (
              <span
                key={s}
                className={`product-card__size-chip ${s === "S" ? "product-card__size-chip--unavailable" : ""}`}
              >
                {s}
              </span>
            ))}
          </div>
        )}

        <div className="product-card__price-row">
          <span className="product-card__price">
            ₹{price.toLocaleString("en-IN")}
          </span>
          {originalPrice && (
            <span className="product-card__original-price">
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          )}
          {discountPct && (
            <span className="product-card__discount">{discountPct}% OFF</span>
          )}
        </div>

        <div className="product-card__meta">
          <div className="product-card__rating">
            <span className="material-symbols-outlined product-card__rating-star">
              star
            </span>
            <span>{rating}</span>
            <span className="product-card__review-count">({reviewCount})</span>
          </div>
          {!showBuyerActions && (
            <span className="product-card__stock">
              {stock === 0 ? "Out of stock" : `${stock} left`}
            </span>
          )}
        </div>

        {showBuyerActions ? (
          <button className="product-card__add-to-cart">
            <span className="material-symbols-outlined">shopping_cart</span>
            Add to Cart
          </button>
        ) : (
          <div className="product-card__seller-actions">
            <button className="product-card__action-btn" title="Edit">
              <span className="material-symbols-outlined">edit</span>
            </button>
            <button className="product-card__action-btn" title="View">
              <span className="material-symbols-outlined">visibility</span>
            </button>
            <button className="product-card__action-btn" title="Analytics">
              <span className="material-symbols-outlined">bar_chart</span>
            </button>
            <button
              className="product-card__action-btn product-card__action-btn--danger"
              title="Delete"
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
