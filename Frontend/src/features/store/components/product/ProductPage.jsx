import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    <div className="pp-rating">
      <div className="pp-stars">
        {Array.from({ length: full }).map((_, i) => <span key={`f${i}`} className="pp-star pp-star--full">★</span>)}
        {half && <span className="pp-star pp-star--half">★</span>}
        {Array.from({ length: empty }).map((_, i) => <span key={`e${i}`} className="pp-star pp-star--empty">★</span>)}
      </div>
      {showText && count !== undefined && <span className="pp-rating-text">({count.toLocaleString()} Reviews)</span>}
    </div>
  );
};

const ProductPage = () => {
  const { id } = useParams();
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
    dispatch(fetchProductById(id));
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

  if (loading) return <ProductPageSkeleton />;

  if (error) {
    return (
      <div className="pp-error-state">
        <span className="material-symbols-outlined">error</span>
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button className="pp-btn-primary" onClick={() => navigate('/')}>Back to Shop</button>
      </div>
    );
  }

  if (!product) return null;

  return (
    <BuyerDashboard>
      <div className="pp-container">
      <main className="pp-content">
        {/* ── Breadcrumbs ──────────────────────────────────────────────────── */}
        <nav className="pp-breadcrumbs">
          <button onClick={() => navigate('/')}>Home</button>
          <span className="pp-bc-sep">/</span>
          <span>{product.category}</span>
          <span className="pp-bc-sep">/</span>
          <span className="pp-bc-current">{product.name}</span>
        </nav>

        <div className="pp-grid">
          {/* ── Left: Image Gallery ────────────────────────────────────────── */}
          <section className="pp-gallery">
            <div className="pp-main-img-wrap">
              <img src={mainImage} alt={product.name} className="pp-main-img" />
              {product.badge && <span className="pp-badge">{product.badge}</span>}
            </div>
            <div className="pp-thumbnails">
              {product.images?.map((img, i) => (
                <button
                  key={i}
                  className={`pp-thumb ${mainImage === img ? 'active' : ''}`}
                  onClick={() => setMainImage(img)}
                >
                  <img src={img} alt={`${product.name} thumb ${i + 1}`} />
                </button>
              ))}
            </div>
          </section>

          {/* ── Right: Product Info ────────────────────────────────────────── */}
          <section className="pp-info">
            <header className="pp-header">
              <p className="pp-brand">{product.brand}</p>
              <h1 className="pp-name">{product.name}</h1>
              <div className="pp-meta">
                <StarRating rating={product.rating} count={product.reviewCount} />
                <span className="pp-sku">SKU: {product.sku}</span>
              </div>
            </header>

            <div className="pp-pricing">
              <span className="pp-price">{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="pp-original">{formatPrice(product.originalPrice)}</span>
                  <span className="pp-discount">({product.discount}% OFF)</span>
                </>
              )}
            </div>
            <p className="pp-tax-hint">Inclusive of all taxes</p>

            <div className="pp-options">
              {/* Size Selection */}
              {product.sizes && (
                <div className="pp-opt-group">
                  <div className="pp-opt-head">
                    <span className="pp-opt-label">Select Size</span>
                    <button className="pp-size-guide">Size Guide</button>
                  </div>
                  <div className="pp-sizes">
                    {product.sizes.map(s => (
                      <button
                        key={s.label}
                        disabled={!s.available}
                        className={`pp-size-btn ${selectedSize === s.label ? 'active' : ''}`}
                        onClick={() => setSelectedSize(s.label)}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && (
                <div className="pp-opt-group">
                  <span className="pp-opt-label">Color: <span className="pp-opt-val">{selectedColor}</span></span>
                  <div className="pp-colors">
                    {product.colors.map(c => (
                      <button
                        key={c.name}
                        disabled={!c.available}
                        className={`pp-color-btn ${selectedColor === c.name ? 'active' : ''}`}
                        style={{ '--color-hex': c.hex }}
                        onClick={() => setSelectedColor(c.name)}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pp-actions">
              <div className="pp-qty">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>
              <button className="pp-btn-cart">
                <span className="material-symbols-outlined">shopping_bag</span>
                Add to Bag
              </button>
              <button className="pp-btn-wishlist">
                <span className="material-symbols-outlined">favorite</span>
              </button>
            </div>

            <div className="pp-delivery">
              <span className="pp-opt-label">Check Delivery</span>
              <div className="pp-pincode">
                <input 
                  type="text" 
                  placeholder="Enter Pincode" 
                  value={pincode} 
                  onChange={e => setPincode(e.target.value)} 
                />
                <button>Check</button>
              </div>
              {product.delivery && (
                <p className="pp-delivery-info">
                  <span className="material-symbols-outlined">local_shipping</span>
                  Estimated delivery by <strong>{product.delivery.estimatedDays}</strong>
                </p>
              )}
            </div>

            {/* Tabs */}
            <div className="pp-tabs">
              <div className="pp-tab-heads">
                {['description', 'highlights', 'reviews'].map(t => (
                  <button
                    key={t}
                    className={`pp-tab-btn ${activeTab === t ? 'active' : ''}`}
                    onClick={() => setActiveTab(t)}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
              <div className="pp-tab-content">
                {activeTab === 'description' && (
                  <div className="pp-desc">{product.description}</div>
                )}
                {activeTab === 'highlights' && (
                  <ul className="pp-highlights">
                    {product.highlights?.map((h, i) => <li key={i}>{h}</li>)}
                  </ul>
                )}
                {activeTab === 'reviews' && (
                  <div className="pp-reviews-summary">
                    <p>Total Reviews: {product.reviewCount}</p>
                    {/* Review list would be mapped here from product.reviews */}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
      </div>
    </BuyerDashboard>
  );
};

export default ProductPage;
