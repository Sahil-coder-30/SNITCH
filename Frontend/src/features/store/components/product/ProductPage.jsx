import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductById, resetSelectedProduct } from '../../slice/product.slice';
import '../../style/ProductPage.scss';
import BuyerDashboard from '../../../buyer/dashboard/components/BuyerDashboard';
import { ProductPageSkeleton } from '../../../../components/loaders/ComponentSkeletons';

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatPrice = (p) => `₹${p?.toLocaleString('en-IN') || '0'}`;

const StarRating = ({ rating, count, showText = true }) => {
  const full = Math.floor(rating || 0);
  const half = (rating || 0) - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="pd-info__rating-row">
      <span className="pd-info__rating-value">{rating?.toFixed(1) || '0.0'}</span>
      <div className="pd-stars pd-stars--sm">
        {Array.from({ length: full }).map((_, i) => (
          <span key={`f${i}`} className="pd-star pd-star--filled">★</span>
        ))}
        {half && <span className="pd-star pd-star--half">★</span>}
        {Array.from({ length: empty }).map((_, i) => (
          <span key={`e${i}`} className="pd-star">★</span>
        ))}
      </div>
      <span className="pd-info__rating-sep">|</span>
      {showText && count !== undefined && (
        <span className="pd-info__rating-link">({count.toLocaleString()} Reviews)</span>
      )}
    </div>
  );
};

const ProductPage = () => {
  const { id: pathId } = useParams();
  const [searchParams] = useSearchParams();
  const id = pathId || searchParams.get('id');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedProduct: product, detailLoading: loading, error } = useSelector(state => state.products);

  const [activeTab, setActiveTab] = useState('description');
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
    return () => {
      dispatch(resetSelectedProduct());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      setMainImage(product.image || product.images?.[0]);
      setSelectedColor(product.colors?.[0]?.name || null);
      // Auto-select first available size
      const firstAvail = product.sizes?.find(s => s.available);
      if (firstAvail) setSelectedSize(firstAvail.label);
    }
  }, [product]);

  if (loading) return (
    <BuyerDashboard>
      <ProductPageSkeleton />
    </BuyerDashboard>
  );


  if (error) {
    return (
      <BuyerDashboard>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '20px', color: 'var(--color-text)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '64px', color: 'var(--color-accent)' }}>error</span>
          <h2 style={{ fontFamily: 'var(--font-headline)', fontWeight: 900 }}>Oops! Something went wrong</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>{error}</p>
          <button className="pd-btn pd-btn--buy" style={{ maxWidth: '200px' }} onClick={() => navigate('/')}>Back to Shop</button>
        </div>
      </BuyerDashboard>
    );
  }

  if (!product) return null;

  return (
    <BuyerDashboard>
      <div className="product-page-wrapper">
        <div className="pd-page-container">
          {/* ── Breadcrumbs ──────────────────────────────────────────────────── */}
          <nav className="pd-breadcrumbs">
            <button onClick={() => navigate('/')}>Home</button>
            <span className="pd-bc-sep">/</span>
            <span>{product.category}</span>
            <span className="pd-bc-sep">/</span>
            <span className="pd-bc-current">{product.name}</span>
          </nav>

          <div className="pd-grid">
            {/* ── Left Column: Image Gallery ────────────────────────────────────────── */}
            <section className="pd-gallery">
              <div className="pd-gallery__thumbnails">
                {product.images?.map((img, i) => (
                  <button
                    key={i}
                    className={`pd-gallery__thumb ${mainImage === img ? 'pd-gallery__thumb--active' : ''}`}
                    onClick={() => setMainImage(img)}
                  >
                    <img src={img} alt={`${product.name} thumb ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>

              <div className="pd-gallery__main">
                {mainImage ? (
                  <img src={mainImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div className="pd-image-placeholder">
                    <span className="material-symbols-outlined pd-image-placeholder__icon">image</span>
                    <span className="pd-image-placeholder__label">NO IMAGE</span>
                  </div>
                )}
                {product.badge && (
                  <span className={`pd-gallery__badge pd-gallery__badge--${product.badge === 'new-arrival' ? 'new' : 'sale'}`}>
                    {product.badge === 'new-arrival' ? 'NEW' : product.badge.toUpperCase()}
                  </span>
                )}
                <button className="pd-gallery__wishlist">
                  <span className="material-symbols-outlined">favorite</span>
                </button>
                <button
                  className="pd-gallery__share"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Product link copied to clipboard!");
                  }}
                  title="Share product link"
                >
                  <span className="material-symbols-outlined">share</span>
                </button>
                <div className="pd-gallery__zoom-hint">
                  <span className="material-symbols-outlined">zoom_in</span>
                  Hover to zoom
                </div>
              </div>
            </section>

            {/* ── Middle Column: Product Info ────────────────────────────────────────── */}
            <section className="pd-info">
              <header className="pd-info__header">
                <div className="pd-info__brand-row">
                  <span className="pd-info__brand">{product.brand}</span>
                  <span className="pd-info__category-pill">{product.category}</span>
                </div>
                <h1 className="pd-info__name">{product.name}</h1>
                <StarRating rating={product.rating} count={product.reviewCount} />
                <div style={{ fontSize: '12px', color: 'var(--color-text-dimmed)', marginTop: '-8px' }}>
                  SKU: <span style={{ color: 'var(--color-text-muted)' }}>{product.sku}</span>
                </div>
              </header>

              <div className="pd-info__price-block">
                <div className="pd-info__price-row">
                  <span className="pd-info__price">{formatPrice(product.price)}</span>
                  {product.originalPrice > product.price && (
                    <span className="pd-info__discount-badge">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>
                {product.originalPrice > product.price && (
                  <div className="pd-info__mrp-row">
                    <span className="pd-info__mrp-label">MRP:</span>
                    <span className="pd-info__mrp">{formatPrice(product.originalPrice)}</span>
                    <span className="pd-info__saving">Save {formatPrice(product.originalPrice - product.price)}</span>
                  </div>
                )}
                <p className="pd-info__tax-note">Inclusive of all taxes</p>
              </div>

              {/* Sizes Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="pd-info__option-group">
                  <div className="pd-info__option-header">
                    <span className="pd-info__option-label">
                      Select Size: <strong>{selectedSize || 'None'}</strong>
                    </span>
                    <button className="pd-info__size-guide">
                      <span className="material-symbols-outlined">straighten</span>
                      Size Guide
                    </button>
                  </div>
                  <div className="pd-info__sizes">
                    {product.sizes.map(s => (
                      <button
                        key={s.label}
                        disabled={!s.available}
                        className={`pd-size-chip ${selectedSize === s.label ? 'pd-size-chip--selected' : ''} ${!s.available ? 'pd-size-chip--unavailable' : ''}`}
                        onClick={() => setSelectedSize(s.label)}
                      >
                        {s.label}
                        {!s.available && <div className="pd-size-chip__oos-line" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="pd-info__option-group">
                  <div className="pd-info__option-header">
                    <span className="pd-info__option-label">
                      Color: <strong>{selectedColor || 'None'}</strong>
                    </span>
                  </div>
                  <div className="pd-info__colors">
                    {product.colors.map(c => (
                      <button
                        key={c.name}
                        disabled={!c.available}
                        className={`pd-color-swatch ${selectedColor === c.name ? 'pd-color-swatch--selected' : ''} ${!c.available ? 'pd-color-swatch--unavailable' : ''}`}
                        style={{ '--swatch-color': c.hex }}
                        onClick={() => setSelectedColor(c.name)}
                        title={c.name}
                      >
                        {!c.available && <span className="pd-color-swatch__cross">×</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Actions */}
              <div className="pd-info__cta">
                <div className="pd-qty">
                  <button className="pd-qty__btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <span className="pd-qty__value">{quantity}</span>
                  <button className="pd-qty__btn" onClick={() => setQuantity(q => q + 1)}>
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
                <button className="pd-btn pd-btn--cart">
                  <span className="material-symbols-outlined">shopping_bag</span>
                  Add to Bag
                </button>
              </div>

              <div className="pd-info__secondary-actions">
                <button className="pd-secondary-btn">
                  <span className="material-symbols-outlined">favorite</span>
                  Add to Wishlist
                </button>
              </div>
            </section>

            {/* ── Right Column: Sidebar Widgets ────────────────────────────────────────── */}
            <aside className="pd-sidebar">
              {/* Delivery Checker Widget */}
              <div className="pd-widget">
                <div className="pd-widget__header">
                  <span className="material-symbols-outlined">local_shipping</span>
                  Delivery & Services
                </div>
                <div className="pd-delivery-checker">
                  <input
                    type="text"
                    className="pd-delivery-checker__input"
                    placeholder="Enter Pincode"
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                  />
                  <button className="pd-delivery-checker__btn">Check</button>
                </div>
                <div className="pd-delivery-options">
                  <div className="pd-delivery-option">
                    <span className="material-symbols-outlined pd-delivery-option__icon pd-delivery-option__icon--free">
                      verified
                    </span>
                    <div className="pd-delivery-option__content">
                      <div className="pd-delivery-option__title">Free Delivery</div>
                      <div className="pd-delivery-option__subtitle">On orders above ₹999</div>
                    </div>
                  </div>
                  <div className="pd-delivery-option">
                    <span className="material-symbols-outlined pd-delivery-option__icon pd-delivery-option__icon--express">
                      bolt
                    </span>
                    <div className="pd-delivery-option__content">
                      <div className="pd-delivery-option__title">
                        Express Shipping <span className="pd-delivery-option__price">₹49</span>
                      </div>
                      <div className="pd-delivery-option__subtitle">Estimated delivery in 2-3 days</div>
                    </div>
                  </div>
                  <div className="pd-delivery-option">
                    <span className="material-symbols-outlined pd-delivery-option__icon pd-delivery-option__icon--return">
                      autorenew
                    </span>
                    <div className="pd-delivery-option__content">
                      <div className="pd-delivery-option__title">Easy 7-Day Returns</div>
                      <div className="pd-delivery-option__subtitle">Hassle-free size exchange & returns</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seller Information Widget */}
              <div className="pd-widget">
                <div className="pd-widget__header">
                  <span className="material-symbols-outlined">storefront</span>
                  Seller Information
                </div>
                <div className="pd-seller">
                  <div className="pd-seller__name-row">
                    <span className="pd-seller__name">
                      {product.seller?.username || "SNITCH Official"}
                    </span>
                    {product.seller?.verified && (
                      <span className="pd-seller__verified" title="Verified Seller">
                        <span className="material-symbols-outlined">verified</span>
                      </span>
                    )}
                  </div>
                  <div className="pd-seller__stats">
                    <div className="pd-seller__stat">
                      <span className="pd-seller__stat-value">4.6 ★</span>
                      <span className="pd-seller__stat-label">Rating</span>
                    </div>
                    <div className="pd-seller__divider" />
                    <div className="pd-seller__stat">
                      <span className="pd-seller__stat-value">12K+</span>
                      <span className="pd-seller__stat-label">Sales</span>
                    </div>
                  </div>
                  <button className="pd-seller__visit-btn">
                    <span className="material-symbols-outlined">store</span>
                    Visit Store
                  </button>
                </div>
              </div>

              {/* Trust Badge Card */}
              <div className="pd-trust">
                <div className="pd-trust__item">
                  <span className="material-symbols-outlined">gpp_good</span>
                  Secure Payments
                </div>
                <div className="pd-trust__item">
                  <span className="material-symbols-outlined">workspace_premium</span>
                  100% Genuine
                </div>
              </div>
            </aside>
          </div>

          {/* ── Tabs Section ────────────────────────────────────────────────────── */}
          <section className="pd-tabs-section">
            <div className="pd-tabs">
              {['description', 'highlights', 'reviews'].map(t => (
                <button
                  key={t}
                  className={`pd-tab ${activeTab === t ? 'pd-tab--active' : ''}`}
                  onClick={() => setActiveTab(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <div className="pd-tab-content">
              {activeTab === 'description' && (
                <div className="pd-description">
                  <div className="pd-description__text">
                    <p>{product.description}</p>
                  </div>
                </div>
              )}

              {activeTab === 'highlights' && (
                <div className="pd-highlights">
                  <h3 className="pd-highlights__title">Product Highlights</h3>
                  <ul className="pd-highlights__list">
                    {product.highlights?.map((h, i) => (
                      <li key={i} className="pd-highlights__item">
                        <span className="material-symbols-outlined">check_circle</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="pd-reviews-layout">
                  {/* Left Column: Summary */}
                  <div className="pd-rating-summary">
                    <div className="pd-rating-summary__big">
                      <span className="pd-rating-summary__value">{product.rating?.toFixed(1) || '0.0'}</span>
                      <div className="pd-stars pd-stars--md">
                        {Array.from({ length: Math.floor(product.rating || 0) }).map((_, i) => (
                          <span key={`fs${i}`} className="pd-star pd-star--filled">★</span>
                        ))}
                        {product.rating % 1 >= 0.5 && <span className="pd-star pd-star--half">★</span>}
                        {Array.from({ length: 5 - Math.ceil(product.rating || 0) }).map((_, i) => (
                          <span key={`es${i}`} className="pd-star">★</span>
                        ))}
                      </div>
                      <span className="pd-rating-summary__count">Based on {product.reviewCount || 0} reviews</span>
                    </div>

                    <div className="pd-rating-summary__bars">
                      {[5, 4, 3, 2, 1].map(stars => {
                        const pct = stars === 5 ? 78 : stars === 4 ? 14 : stars === 3 ? 5 : stars === 2 ? 2 : 1;
                        return (
                          <div key={stars} className="pd-rating-bar">
                            <span className="pd-rating-bar__label">{stars} Star</span>
                            <div className="pd-rating-bar__track">
                              <div className="pd-rating-bar__fill" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="pd-rating-bar__pct">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Review List */}
                  <div className="pd-reviews">
                    <div className="pd-review">
                      <div className="pd-review__author-row">
                        <div className="pd-review__avatar">JD</div>
                        <div className="pd-review__author-info">
                          <span className="pd-review__author">John Doe</span>
                          <div className="pd-review__verified">
                            <span className="material-symbols-outlined">verified</span>
                            Verified Purchase
                          </div>
                        </div>
                        <span className="pd-review__date">2 days ago</span>
                      </div>
                      <div className="pd-review__rating-row">
                        <div className="pd-stars pd-stars--sm">
                          <span className="pd-star pd-star--filled">★</span>
                          <span className="pd-star pd-star--filled">★</span>
                          <span className="pd-star pd-star--filled">★</span>
                          <span className="pd-star pd-star--filled">★</span>
                          <span className="pd-star pd-star--filled">★</span>
                        </div>
                        <span className="pd-review__title">Absolutely brilliant purchase!</span>
                      </div>
                      <p className="pd-review__body">
                        The fit is absolutely spot on and the material quality is premium. Definitely going to buy more colors. Highly recommend!
                      </p>
                      <div className="pd-review__footer">
                        <span className="pd-review__helpful-label">Was this helpful?</span>
                        <button className="pd-review__helpful-btn">
                          <span className="material-symbols-outlined">thumb_up</span>
                          12
                        </button>
                        <button className="pd-review__report">Report</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </BuyerDashboard>
  );
};

export default ProductPage;
