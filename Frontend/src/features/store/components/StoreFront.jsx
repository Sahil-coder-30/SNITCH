import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CATEGORIES, SORT_OPTIONS } from '../data/products';
import { fetchProducts, updateFilters } from '../slice/product.slice';
import BuyerDashboard from '../../buyer/dashboard/components/BuyerDashboard';
import '../style/StoreFront.scss';

import { 
  ProductCardSkeleton, 
  CategorySkeleton, 
  HeroBannerSkeleton, 
  SkeletonGrid 
} from '../../../components/loaders/ComponentSkeletons';

// ── Helpers ───────────────────────────────────────────────────
const formatPrice = (p) => `₹${p?.toLocaleString('en-IN') || '0'}`;
const stars = (r) => {
  const full = Math.floor(r || 0);
  const half = (r || 0) - full >= 0.5;
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
const ProductCard = ({ product, onSelect, loading = false }) => {
  const [imgError, setImgError] = useState(false);

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

// ── Hero Banner Carousel ───────────────────────────────────────
const HeroBanner = ({ onShopNow, loading = false, banners = [] }) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (loading || banners.length <= 1) return;
    const timer = setInterval(() => setActive(a => (a + 1) % banners.length), 4500);
    return () => clearInterval(timer);
  }, [loading, banners.length]);

  if (loading) return <HeroBannerSkeleton />;
  if (banners.length === 0) return null;

  const b = banners[active];

  return (
    <section className="sf-hero" style={{ background: b.gradient }}>
      <div className="sf-hero__overlay" />
      {b.image && <img src={b.image} alt="" className="sf-hero__img" key={b.id} />}
      <div className="sf-hero__content">
        <p className="sf-hero__eyebrow" style={{ color: b.accent }}>SNITCH — New Collection</p>
        <h2 className="sf-hero__title">{b.title}</h2>
        <p className="sf-hero__sub">{b.subtitle}</p>
        <button
          className="sf-hero__cta"
          style={{ borderColor: b.accent, color: b.accent }}
          onClick={onShopNow}
        >
          {b.cta}
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
      <div className="sf-hero__dots">
        {banners.map((_, i) => (
          <button
            key={i}
            className={`sf-hero__dot ${active === i ? 'active' : ''}`}
            style={ active === i ? { background: b.accent } : {} }
            onClick={() => setActive(i)}
            aria-label={`Banner ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

// ── Main StoreFront Page ───────────────────────────────────────
const StoreFront = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { list: products, loading, filters } = useSelector(state => state.products);
  const { category, sort, search } = filters;

  const productsRef = useRef(null);

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, category, sort, search]);

  const handleProductSelect = (product) => {
    navigate(`/product/${product.id}`);
  };

  const handleCategoryChange = (catId) => {
    dispatch(updateFilters({ category: catId }));
    scrollToProducts();
  };

  const handleSortChange = (e) => {
    dispatch(updateFilters({ sort: e.target.value }));
  };

  const scrollToProducts = useCallback(() => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Use the categories from the data/constants file
  const categoriesList = CATEGORIES;

  // Static fallback banners for now (until API is ready)
  const banners = [
    {
      id: 'b1',
      title: 'THE 2026 COLLECTION',
      subtitle: 'Elevated essentials for the modern narrative',
      cta: 'Shop Now',
      gradient: 'linear-gradient(135deg, #080809 0%, #121214 50%, #1C1C1E 100%)',
      accent: '#E2B87F',
      image: null
    }
  ];

  return (
    <BuyerDashboard>
      <div className="sf-container">


      {/* ── Quick Categories ───────────────────────────── */}
      <section className="sf-quick-cats" aria-label="Categories">
        <div className="sf-quick-cats__inner">
          {loading && products.length === 0 ? (
            <SkeletonGrid count={6} columns={6}>
              <CategorySkeleton />
            </SkeletonGrid>
          ) : (
            categoriesList.map(cat => (
              <button 
                key={cat.id} 
                className={`sf-quick-cat ${category === cat.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                <div className="sf-quick-cat__icon-wrap">
                  <span className="material-symbols-outlined">{cat.icon}</span>
                </div>
                <span className="sf-quick-cat__label">{cat.label}</span>
              </button>
            ))
          )}
        </div>
      </section>

      <div className="sf-main">
        {/* ── Hero Banner ───────────────────────────── */}
        <HeroBanner onShopNow={scrollToProducts} loading={loading && products.length === 0} banners={banners} />

        {/* ── Value Props ───────────────────────────── */}
        <section className="sf-value-props" aria-label="Why shop with us">
          {[
            { icon: 'local_shipping', title: 'Free Delivery',    sub: 'On orders above ₹999' },
            { icon: 'cached',         title: 'Easy Returns',     sub: '15-day hassle-free returns' },
            { icon: 'verified',       title: '100% Authentic',   sub: 'All products verified' },
            { icon: 'support_agent',  title: '24/7 Support',     sub: 'Dedicated customer care' },
          ].map(({ icon, title, sub }) => (
            <div key={title} className="sf-vp-item">
              <span className="material-symbols-outlined sf-vp-icon">{icon}</span>
              <div>
                <p className="sf-vp-title">{title}</p>
                <p className="sf-vp-sub">{sub}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ── Product Grid Section ──────────────────── */}
        <section className="sf-products" ref={productsRef}>
          <div className="sf-products__header">
            <h2 className="sf-products__title">
              {category === 'all' ? 'All Products' : categoriesList.find(c => c.id === category)?.label}
              <span className="sf-products__count">({products?.length || 0} items)</span>
            </h2>
            <div className="sf-products__controls">
              <div className="sf-products__sort">
                <span className="material-symbols-outlined">sort</span>
                <select value={sort} onChange={handleSortChange} aria-label="Sort by">
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <SkeletonGrid count={8}>
              <ProductCardSkeleton />
            </SkeletonGrid>
          ) : products && products.length > 0 ? (
            <div className="sf-grid">
              {products.map(p => (
                <ProductCard key={p.id} product={p} onSelect={handleProductSelect} />
              ))}
            </div>
          ) : (
            <div className="sf-empty">
              <span className="material-symbols-outlined">search_off</span>
              <h3>No products found</h3>
              <p>Try adjusting your search or category filters</p>
              <button 
                className="sf-btn-outline" 
                onClick={() => dispatch(updateFilters({ search: '', category: 'all' }))}
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>

        {/* ── Login CTA Banner ──────────────────────── */}
        <section className="sf-login-cta" aria-label="Sign in prompt">
          <div className="sf-login-cta__content">
            <span className="material-symbols-outlined sf-login-cta__icon">storefront</span>
            <div>
              <h2 className="sf-login-cta__title">Get the full SNITCH experience</h2>
              <p className="sf-login-cta__sub">
                Sign in to track orders, save wishlists, earn rewards, and access exclusive member-only prices.
              </p>
            </div>
            <div className="sf-login-cta__btns">
              <Link to="/login" className="sf-login-cta__btn sf-login-cta__btn--primary" id="cta-login-btn">
                Sign In
              </Link>
              <Link to="/register" className="sf-login-cta__btn sf-login-cta__btn--outline" id="cta-register-btn">
                Create Account
              </Link>
            </div>
          </div>
        </section>
      </div>
      </div>
    </BuyerDashboard>
  );
};

export default StoreFront;
