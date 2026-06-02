import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BuyerDashboard from '../../buyer/dashboard/components/BuyerDashboard';
import { useWishlist } from '../hooks/wishlist.hooks';
import { useCart } from '../../cart/hooks/cart.hooks';
import '../style/WishlistPage.scss';

// ── Wishlist Item Skeleton ─────────────────────────────────────
const WishlistCardSkeleton = () => (
  <div className="wl-skeleton">
    <div className="wl-skeleton__img" />
    <div className="wl-skeleton__body">
      <div className="wl-skeleton__line wl-skeleton__line--short" />
      <div className="wl-skeleton__line wl-skeleton__line--wide" />
      <div className="wl-skeleton__line wl-skeleton__line--price" />
    </div>
  </div>
);

// ── Individual Wishlist Card ────────────────────────────────────
const WishlistCard = ({ item, onMoveToCart, onRemove, isMutating }) => {
  const navigate = useNavigate();
  const product = item.product || {};

  const price        = product.price?.amount        ?? 0;
  const originalPrice = product.originalPrice?.amount ?? 0;
  const showOriginal  = originalPrice > price;
  const discount      = showOriginal
    ? Math.round(100 - (price / originalPrice) * 100)
    : 0;

  // Determine stock for this specific size
  const sizeEntry  = product.sizes?.find((s) => s.size === item.size);
  const sizeStock  = sizeEntry?.quantity ?? 0;
  const isLowStock = sizeStock > 0 && sizeStock <= 3;
  const isOos      = sizeStock === 0;

  const handleProductClick = () => navigate(`/product/${product._id}`);

  return (
    <div className="wl-card">
      {/* ── Image ── */}
      <div className="wl-card__img-wrap" onClick={handleProductClick}>
        {product.coverImage ? (
          <img src={product.coverImage} alt={product.title} loading="lazy" />
        ) : (
          <div className="wl-card__img-fallback">
            <span className="material-symbols-outlined">checkroom</span>
          </div>
        )}

        {/* Badge */}
        {product.badge && (
          <span className={`wl-card__badge wl-card__badge--${product.badge}`}>
            {product.badge.replace(/-/g, ' ')}
          </span>
        )}

        {/* Remove X button */}
        <button
          className="wl-card__remove-btn"
          onClick={(e) => { e.stopPropagation(); onRemove(product._id, item.size); }}
          disabled={isMutating}
          title="Remove from wishlist"
          aria-label="Remove from wishlist"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Low stock ribbon */}
        {isLowStock && (
          <div className="wl-card__low-stock">
            <span className="material-symbols-outlined">warning</span>
            Only {sizeStock} left!
          </div>
        )}
        {isOos && (
          <div className="wl-card__low-stock" style={{ background: 'rgba(239,68,68,0.9)' }}>
            <span className="material-symbols-outlined">block</span>
            Out of stock
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="wl-card__body">
        <p className="wl-card__brand">{product.brand}</p>
        <h3 className="wl-card__name" onClick={handleProductClick}>
          {product.title}
        </h3>

        <div className="wl-card__meta-row">
          <span className="wl-card__size-tag">Size: {item.size}</span>
          {product.color?.hex && (
            <span
              className="wl-card__color-dot"
              style={{ background: product.color.hex }}
              title={product.color.name}
            />
          )}
        </div>

        <div className="wl-card__price-row">
          <span className="wl-card__price">
            ₹{price.toLocaleString('en-IN')}
          </span>
          {showOriginal && (
            <span className="wl-card__original-price">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
          )}
          {discount > 0 && (
            <span className="wl-card__discount">{discount}% off</span>
          )}
        </div>

        {product.rating > 0 && (
          <div className="wl-card__rating-row">
            <span className="star">★</span>
            <span>{product.rating?.toFixed(1)}</span>
            <span>({product.reviewCount || 0})</span>
          </div>
        )}
      </div>

      {/* ── Footer CTAs ── */}
      <div className="wl-card__footer">
        <button
          className="wl-card__cart-btn"
          onClick={() => onMoveToCart(item)}
          disabled={isMutating || isOos}
          title={isOos ? 'Out of stock' : 'Move to Cart'}
        >
          <span className="material-symbols-outlined">shopping_cart</span>
          {isOos ? 'Out of Stock' : 'Move to Cart'}
        </button>
        <button
          className="wl-card__remove-link"
          onClick={() => onRemove(product._id, item.size)}
          disabled={isMutating}
        >
          <span className="material-symbols-outlined">favorite_border</span>
          Remove
        </button>
      </div>
    </div>
  );
};

// ── Main WishlistPage ──────────────────────────────────────────
const WishlistPage = () => {
  const navigate = useNavigate();

  const {
    items,
    isLoading,
    error,
    authFetchWishlist,
    authRemoveFromWishlist,
  } = useWishlist();

  const { authAddToCart } = useCart();

  // Fetch wishlist on mount
  useEffect(() => {
    authFetchWishlist();
  }, []);

  const handleRemove = async (productId, size) => {
    try {
      await authRemoveFromWishlist(productId, size);
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
  };

  const handleMoveToCart = async (item) => {
    const productId = item.product?._id;
    const size      = item.size;
    try {
      await authAddToCart(productId, 1, size);
      await authRemoveFromWishlist(productId, size);
    } catch (err) {
      alert(err.message || 'Failed to move item to cart.');
    }
  };

  const handleMoveAll = async () => {
    for (const item of items) {
      try {
        await handleMoveToCart(item);
      } catch (err) {
        // continue moving remaining items even if one fails
      }
    }
  };

  // ── Loading State ──
  if (isLoading && items.length === 0) {
    return (
      <BuyerDashboard breadcrumb={['Home', 'My Wishlist']}>
        <div className="wishlist-page">
          <div className="wishlist-page__header">
            <div className="wishlist-page__title-group">
              <h1 className="wishlist-page__title">My Wishlist</h1>
            </div>
          </div>
          <div className="wishlist-page__grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <WishlistCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </BuyerDashboard>
    );
  }

  // ── Error State ──
  if (error && items.length === 0) {
    return (
      <BuyerDashboard breadcrumb={['Home', 'My Wishlist']}>
        <div className="wishlist-page">
          <div className="wishlist-page__error">
            <span className="material-symbols-outlined">error</span>
            <h2>Failed to load wishlist</h2>
            <p>{error}</p>
            <button onClick={authFetchWishlist}>Retry</button>
          </div>
        </div>
      </BuyerDashboard>
    );
  }

  return (
    <BuyerDashboard breadcrumb={['Home', 'My Wishlist']}>
      <div className="wishlist-page">

        {/* ── Header ── */}
        <div className="wishlist-page__header">
          <div className="wishlist-page__title-group">
            <h1 className="wishlist-page__title">My Wishlist</h1>
            <span className="wishlist-page__count-badge">{items.length}</span>
          </div>

          {items.length > 0 && (
            <div className="wishlist-page__actions-row">
              <button
                className="wishlist-page__move-all-btn"
                onClick={handleMoveAll}
                disabled={isLoading}
              >
                <span className="material-symbols-outlined">shopping_cart</span>
                Move All to Cart
              </button>
            </div>
          )}
        </div>

        {/* ── Content ── */}
        {items.length === 0 ? (
          <div className="wishlist-page__empty">
            <span className="material-symbols-outlined wishlist-page__empty-icon">
              favorite
            </span>
            <h2 className="wishlist-page__empty-title">Your wishlist is empty</h2>
            <p className="wishlist-page__empty-desc">
              Save products you love. Browse the catalog and tap the heart icon to add items here.
            </p>
            <button
              className="wishlist-page__empty-btn"
              onClick={() => navigate('/buyer')}
            >
              <span className="material-symbols-outlined">storefront</span>
              Explore Store
            </button>
          </div>
        ) : (
          <div className="wishlist-page__grid">
            {items.map((item) => (
              <WishlistCard
                key={`${item._id}`}
                item={item}
                onMoveToCart={handleMoveToCart}
                onRemove={handleRemove}
                isMutating={isLoading}
              />
            ))}
          </div>
        )}

      </div>
    </BuyerDashboard>
  );
};

export default WishlistPage;
