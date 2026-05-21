import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BuyerDashboard from './BuyerDashboard';
import { CATEGORIES, SORT_OPTIONS, BANNERS } from '../../../store/data/products';
import { useBrowseProducts } from '../Hooks/useBrowseProducts';
import '../style/BrowseProducts.scss';

// ── Helpers ───────────────────────────────────────────────────
const formatPrice = (p) => `₹${p.toLocaleString('en-IN')}`;
const stars = (r) => {
  const full = Math.floor(r);
  const half = r - full >= 0.5;
  return { full, half, empty: 5 - full - (half ? 1 : 0) };
};

// ── Star Rating ───────────────────────────────────────────────
const StarRating = ({ rating, count, small }) => {
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
const Badge = ({ label, type }) => {
  if (!label) return null;
  return <span className={`sf-badge sf-badge--${type}`}>{label}</span>;
};

// ── Product Card ──────────────────────────────────────────────
const ProductCard = ({ product, onSelect }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <article
      className={`sf-card ${!product.inStock ? 'sf-card--oos' : ''}`}
      onClick={() => onSelect(product)}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect(product)}
      aria-label={`View ${product.name}`}
    >
      <div className="sf-card__img-wrap">
        {imgError ? (
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
          className="sf-card__wishlist"
          onClick={e => { e.stopPropagation(); }}
          aria-label="Add to wishlist"
        >
          <span className="material-symbols-outlined">favorite</span>
        </button>
      </div>

      <div className="sf-card__body">
        <p className="sf-card__brand">{product.brand}</p>
        <h3 className="sf-card__name">{product.name}</h3>
        <StarRating rating={product.rating} count={product.reviewCount} small />

        <div className="sf-card__price-row">
          <span className="sf-card__price">{formatPrice(product.price)}</span>
          <span className="sf-card__original">{formatPrice(product.originalPrice)}</span>
          <span className="sf-card__discount">{product.discount}% off</span>
        </div>

        {product.colors.length > 0 && (
          <div className="sf-card__colors">
            {product.colors.slice(0, 4).map((c, i) => (
              <span key={i} className="sf-card__color-dot" style={{ background: c }} title={product.colorNames[i]} />
            ))}
            {product.colors.length > 4 && <span className="sf-card__color-more">+{product.colors.length - 4}</span>}
          </div>
        )}

        <p className="sf-card__delivery">
          <span className="material-symbols-outlined">local_shipping</span>
          Free delivery in {product.deliveryDays} days
        </p>
      </div>
    </article>
  );
};

// ── Hero Banner Carousel ───────────────────────────────────────
const HeroBanner = ({ onShopNow }) => {
  const [active, setActive] = useState(0);
  const b = BANNERS[active];

  return (
    <section className="sf-hero" style={{ background: b.gradient, margin: '0 -1.5rem 2rem', height: '380px' }}>
      <div className="sf-hero__overlay" />
      <img src={b.image} alt="" className="sf-hero__img" key={b.id} />
      <div className="sf-hero__content">
        <p className="sf-hero__eyebrow" style={{ color: b.accent }}>Member Exclusive</p>
        <h1 className="sf-hero__title" style={{ fontSize: '2.5rem' }}>{b.title}</h1>
        <p className="sf-hero__sub">{b.subtitle}</p>
        <button
          className="sf-hero__cta"
          style={{ borderColor: b.accent, color: b.accent }}
          onClick={onShopNow}
        >
          Explore Collection
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </section>
  );
};

const BrowseProducts = () => {
  const navigate = useNavigate();
  const {
    loading,
    error,
    category,
    setCategory,
    sort,
    setSort,
    productsRef,
    filteredProducts,
    scrollToProducts
  } = useBrowseProducts();

  if (error) return <div className="sf-error">Error: {error}</div>;

  const handleProductSelect = (product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <BuyerDashboard>
      <div className="browse-products-new">
        <HeroBanner onShopNow={scrollToProducts} />

        <section className="sf-products-section" ref={productsRef}>
          <div className="sf-toolbar">
            <div className="sf-toolbar__left">
              <h2 className="sf-toolbar__heading">
                {CATEGORIES.find(c => c.id === category)?.label || 'Store Catalog'}
              </h2>
              <span className="sf-toolbar__count">{filteredProducts.length} items found</span>
            </div>
            <div className="sf-toolbar__right">
              <select className="sf-toolbar__sort" value={sort} onChange={e => setSort(e.target.value)}>
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="sf-grid">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="skeleton-pulse" style={{ height: '400px', borderRadius: '12px' }} />
              ))
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} onSelect={handleProductSelect} />
              ))
            ) : (
              <div className="sf-empty-grid">No products match your criteria.</div>
            )}
          </div>
        </section>
      </div>
    </BuyerDashboard>
  );
};

export default BrowseProducts;
