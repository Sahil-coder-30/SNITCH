import React, { useState } from 'react';
import { ProductCardSkeleton } from '../../../../components/loaders/ComponentSkeletons';
import { useWishlist } from '../../../wishlist/hooks/wishlist.hooks';

// ── Helpers ───────────────────────────────────────────────────
const formatPrice = (p) => `₹${p?.toLocaleString('en-IN') || '0'}`;
const stars = (r) => {
  const full = Math.floor(r || 0);
  const half = (r || 0) - full >= 0.5;
  return { full, half, empty: 5 - full - (half ? 1 : 0) };
};

// ── Star Rating ───────────────────────────────────────────────
export const StarRating = ({ rating, count, small }) => {
  const { full, half, empty } = stars(rating);
  return (
    <div className={`sf-stars ${small ? 'sf-stars--sm' : ''}`}>
      {Array.from({ length: full  }).map((_, i) => <span key={`f${i}`} className="sf-star sf-star--full">★</span>)}
      {half &&                                      <span className="sf-star sf-star--half">★</span>}
      {Array.from({ length: empty }).map((_, i) => <span key={`e${i}`} className="sf-star sf-star--empty">★</span>)}
      {count !== undefined && <span className="sf-star-count">{count.toLocaleString()}</span>}
    </div>
  );
};

// ── Badge ─────────────────────────────────────────────────────
export const Badge = ({ label, type }) => {
  if (!label) return null;
  return <span className={`sf-badge sf-badge--${type}`}>{label}</span>;
};

// ── Product Card ──────────────────────────────────────────────
const ProductCard = ({ product, onSelect, loading = false }) => {
  const [imgError, setImgError] = useState(false);
  const { toggleWishlist, isInWishlist, isLoading: wishlistLoading } = useWishlist();

  if (loading) return <ProductCardSkeleton />;
  if (!product) return null;

  return (
    <article
      className={`sf-card ${!product.inStock ? 'sf-card--oos' : ''}`}
      onClick={() => onSelect(product)}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect(product)}
      aria-label={`View ${product.name}`}
    >
      <div className="sf-card__img-wrap">
        {imgError || !product.image ? (
          <div className="sf-card__img-fallback">
            <span className="material-symbols-outlined">checkroom</span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className="sf-card__img"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
        <Badge label={product.badge} type={product.badgeType} />
        {!product.inStock && <div className="sf-card__oos-overlay">Out of Stock</div>}
        <button
          className={`sf-card__wishlist ${isInWishlist(product._id || product.id) ? 'sf-card__wishlist--active' : ''}`}
          onClick={e => {
            e.stopPropagation();
            if (!wishlistLoading) toggleWishlist(product);
          }}
          aria-label={isInWishlist(product._id || product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
          title={isInWishlist(product._id || product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontVariationSettings: isInWishlist(product._id || product.id)
                ? "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24"
                : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
              color: isInWishlist(product._id || product.id) ? '#ef4444' : 'inherit',
            }}
          >
            favorite
          </span>
        </button>
      </div>

      <div className="sf-card__body">
        <p className="sf-card__brand">{product.brand}</p>
        <h3 className="sf-card__name">{product.name}</h3>
        <StarRating rating={product.rating} count={product.reviewCount} small />

        <div className="sf-card__price-row">
          <span className="sf-card__price">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <>
              <span className="sf-card__original">{formatPrice(product.originalPrice)}</span>
              <span className="sf-card__discount">{product.discount}% off</span>
            </>
          )}
        </div>

        {product.colors?.length > 0 && (
          <div className="sf-card__colors">
            {product.colors.slice(0, 4).map((c, i) => (
              <span key={i} className="sf-card__color-dot" style={{ background: c }} title={product.colorNames?.[i] || ''} />
            ))}
            {product.colors.length > 4 && <span className="sf-card__color-more">+{product.colors.length - 4}</span>}
          </div>
        )}

        <p className="sf-card__delivery">
          <span className="material-symbols-outlined">local_shipping</span>
          Free delivery in {product.deliveryDays || 3} days
        </p>
      </div>
    </article>
  );
};

export default ProductCard;
