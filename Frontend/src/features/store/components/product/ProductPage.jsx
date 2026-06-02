import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductById, resetSelectedProduct } from '../../slice/product.slice';
import { useCart } from '../../../cart/hooks/cart.hooks';
import { useWishlist } from '../../../wishlist/hooks/wishlist.hooks';
import '../../style/ProductPage.scss';
import BuyerDashboard from '../../../buyer/dashboard/components/BuyerDashboard';
import { ProductPageSkeleton } from '../../../../components/loaders/ComponentSkeletons';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Helper to format currency
const formatPrice = (p) => `₹${p?.toLocaleString('en-IN') || '0'}`;

// Redesigned premium star rating component
const StarRating = ({ rating, count, showText = true, size = 'sm', onClick }) => {
  const full = Math.floor(rating || 0);
  const half = (rating || 0) - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className={`pd-rating-row pd-rating-row--${size}`}>
      <div className="pd-stars">
        {Array.from({ length: full }).map((_, i) => (
          <span 
            key={`f${i}`} 
            className="pd-star pd-star--filled"
            onClick={() => onClick && onClick(i + 1)}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
          >
            ★
          </span>
        ))}
        {half && (
          <span 
            className="pd-star pd-star--half"
            onClick={() => onClick && onClick(full + 1)}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
          >
            ★
          </span>
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <span 
            key={`e${i}`} 
            className="pd-star"
            onClick={() => onClick && onClick(full + (half ? 1 : 0) + i + 1)}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
          >
            ★
          </span>
        ))}
      </div>
      {showText && (
        <span className="pd-rating-text">
          <strong className="pd-rating-val">{rating?.toFixed(1) || '0.0'}</strong>
          {count !== undefined && (
            <span className="pd-rating-count">({count} Verified Reviews)</span>
          )}
        </span>
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
  const { authAddToCart } = useCart();
  const { toggleWishlist, isInWishlist, authFetchWishlist } = useWishlist();

  const { selectedProduct: product, detailLoading: loading, error } = useSelector(state => state.products);
  const { user } = useSelector(state => state.auth);

  // Core UI States
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null); // 'valid' | 'invalid' | null
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Cart Add Modal
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(4);
  const [popupKey, setPopupKey] = useState(0);

  // New Modals & Dynamic Reviews States
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [reviewsList, setReviewsList] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  
  // New Review Form State
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Hover Zoom States
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      if (user && user.role === 'BUYER') {
        authFetchWishlist().catch(err => console.error("Failed to fetch wishlist:", err));
      }
      
      // Fetch suggested products
      axios.get(`${API_BASE_URL}/products/${id}/suggested`)
        .then(res => {
          setSuggestedProducts(res.data || []);
        })
        .catch(err => {
          console.error("Failed to fetch suggested products:", err);
        });
    }
    return () => {
      dispatch(resetSelectedProduct());
    };
  }, [dispatch, id, user]);

  useEffect(() => {
    if (product) {
      setMainImage(product.image || product.images?.[0]);
      const currentSw = product.colors?.find(c => c.id === product.id);
      setSelectedColor(currentSw ? currentSw.name : (product.colors?.[0]?.name || null));
      // Auto-select first available size
      const firstAvail = product.sizes?.find(s => s.available);
      if (firstAvail) setSelectedSize(firstAvail.label);
      
      // Initialize dynamic reviews list
      if (product.reviews) {
        setReviewsList(product.reviews);
      }
    }
  }, [product]);

  // Auto-dismiss cart popup count-down
  useEffect(() => {
    if (showCartPopup && !isClosing) {
      setTimeLeft(4);
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsClosing(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showCartPopup, popupKey, isClosing]);

  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        setShowCartPopup(false);
        setIsClosing(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isClosing]);

  const handleAddToBag = async () => {
    if (!selectedSize) {
      alert("Please select a size first!");
      return;
    }
    try {
      await authAddToCart(product._id || product.id, quantity, selectedSize);
      setIsClosing(false);
      setPopupKey(prev => prev + 1);
      setShowCartPopup(true);
    } catch (err) {
      alert(err.message || "Failed to add to bag");
    }
  };

  const handleBuyNow = async () => {
    if (!selectedSize) {
      alert("Please select a size first!");
      return;
    }
    try {
      await authAddToCart(product._id || product.id, quantity, selectedSize);
      navigate('/buyer/cart');
    } catch (err) {
      alert(err.message || "Failed to process direct checkout");
    }
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const checkDelivery = () => {
    if (!pincode || pincode.trim().length !== 6 || isNaN(pincode)) {
      setPincodeStatus('invalid');
      return;
    }
    setPincodeStatus('valid');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewRating === 0) {
      alert("Please select a rating.");
      return;
    }
    if (!reviewComment.trim()) {
      alert("Please write your review comment.");
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/products/${product.id || product._id}/reviews`,
        {
          rating: reviewRating,
          comment: reviewComment,
          title: reviewTitle
        },
        { withCredentials: true }
      );

      if (response.data?.review) {
        // Add new review at top of list
        setReviewsList(prev => [response.data.review, ...prev]);
        setShowWriteReview(false);
        setReviewRating(0);
        setReviewTitle('');
        setReviewComment('');
        alert("Your review has been successfully posted!");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message || "Failed to submit review. Make sure you are logged in.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) return (
    <BuyerDashboard>
      <ProductPageSkeleton />
    </BuyerDashboard>
  );

  if (error) {
    return (
      <BuyerDashboard>
        <div className="pd-error-state">
          <span className="material-symbols-outlined pd-error-icon">error</span>
          <h2>Oops! Product loading failed</h2>
          <p>{error}</p>
          <button className="pd-btn pd-btn--buy" style={{ maxWidth: '200px' }} onClick={() => navigate('/')}>Back to Shop</button>
        </div>
      </BuyerDashboard>
    );
  }

  if (!product) return null;

  return (
    <BuyerDashboard>
      <div className="pd-redesign-wrapper">
        <div className="pd-page-container">
          
          {/* Breadcrumbs Navigation */}
          <nav className="pd-breadcrumbs">
            <button onClick={() => navigate('/')}>Home</button>
            <span className="pd-bc-sep">/</span>
            <span>{product.category?.split(' / ')?.[0] || 'Catalog'}</span>
            <span className="pd-bc-sep">/</span>
            <span className="pd-bc-current">{product.name}</span>
          </nav>

          {/* Redesigned 2-Column Split Layout */}
          <div className="pd-split-grid">
            
            {/* Left Media Column */}
            <section className="pd-media-column">
              <div className="pd-gallery-layout">
                {/* Thumbnails list */}
                <div className="pd-gallery-thumbs">
                  {product.images?.map((img, i) => (
                    <button
                      key={i}
                      className={`pd-gallery-thumb-btn ${mainImage === img ? 'pd-gallery-thumb-btn--active' : ''}`}
                      onClick={() => setMainImage(img)}
                    >
                      <img src={img} alt={`${product.name} thumb ${i + 1}`} />
                    </button>
                  ))}
                </div>

                {/* Main Image with Lens Zoom on Hover */}
                <div 
                  className="pd-gallery-main-view"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                >
                  {mainImage ? (
                    <img 
                      src={mainImage} 
                      alt={product.name} 
                      className="pd-gallery-main-image"
                      style={{
                        transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                        transition: isZoomed ? 'transform 0.05s ease-out' : 'transform 0.30s ease'
                      }}
                    />
                  ) : (
                    <div className="pd-image-placeholder">
                      <span className="material-symbols-outlined">image</span>
                      <span>NO IMAGE AVAILABLE</span>
                    </div>
                  )}

                  {product.badge && (
                    <span className={`pd-gallery-badge-pill pd-gallery-badge-pill--${product.badge}`}>
                      {product.badge.replace('-', ' ').toUpperCase()}
                    </span>
                  )}

                  <button 
                    className={`pd-action-icon-btn pd-action-icon-btn--wishlist ${
                      isInWishlist(product.id || product._id, selectedSize) ? 'pd-action-icon-btn--wishlist-active' : ''
                    }`}
                    title={isInWishlist(product.id || product._id, selectedSize) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    disabled={wishlistLoading}
                    onClick={async () => {
                      if (!selectedSize) {
                        alert('Please select a size first!');
                        return;
                      }
                      setWishlistLoading(true);
                      try {
                        await toggleWishlist(product, selectedSize);
                      } catch (err) {
                        console.error('Wishlist toggle failed:', err);
                      } finally {
                        setWishlistLoading(false);
                      }
                    }}
                  >
                    <span className="material-symbols-outlined">
                      favorite
                    </span>
                  </button>
                  
                  <button 
                    className="pd-action-icon-btn pd-action-icon-btn--share"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Product link copied to clipboard!");
                    }}
                    title="Copy Link"
                  >
                    <span className="material-symbols-outlined">share</span>
                  </button>

                  <div className={`pd-zoom-overlay-hint ${isZoomed ? 'pd-zoom-overlay-hint--hidden' : ''}`}>
                    <span className="material-symbols-outlined">zoom_in</span>
                    <span>Hover image to zoom</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Right Details Panel (Sticky) */}
            <section className="pd-details-column">
              <div className="pd-details-sticky">
                
                {/* Header Information */}
                <header className="pd-product-header">
                  <div className="pd-brand-meta">
                    <span className="pd-brand-name">{product.brand}</span>
                    <span className="pd-sku-label">SKU: {product.sku}</span>
                  </div>
                  <h1 className="pd-product-title">{product.name}</h1>
                  
                  <div className="pd-ratings-summary-row" onClick={() => scrollToSection('pd-reviews-section')}>
                    <StarRating rating={product.rating} count={reviewsList.length} size="md" />
                  </div>
                </header>

                {/* Price Container */}
                <div className="pd-price-card">
                  <div className="pd-price-values">
                    <span className="pd-current-price">{formatPrice(product.price)}</span>
                    {product.originalPrice > product.price && (
                      <>
                        <span className="pd-original-price">{formatPrice(product.originalPrice)}</span>
                        <span className="pd-discount-badge">{product.discount}% OFF</span>
                      </>
                    )}
                  </div>
                  {product.originalPrice > product.price && (
                    <div className="pd-savings-banner">
                      <span className="material-symbols-outlined">savings</span>
                      <span>You save {formatPrice(product.originalPrice - product.price)} on this order!</span>
                    </div>
                  )}
                  <p className="pd-tax-disclaimer">Inclusive of all local and federal taxes.</p>
                </div>

                {/* Sizing Section */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="pd-option-block">
                    <div className="pd-option-header">
                      <label className="pd-option-label">
                        Select Size: <strong className="pd-selected-value-highlight">{selectedSize || 'None'}</strong>
                      </label>
                      <button className="pd-size-guide-trigger" onClick={() => setShowSizeGuide(true)}>
                        <span className="material-symbols-outlined">straighten</span>
                        Size Chart
                      </button>
                    </div>
                    <div className="pd-size-chips-grid">
                      {product.sizes.map(s => (
                        <button
                          key={s.label}
                          disabled={!s.available}
                          className={`pd-size-chip-btn ${selectedSize === s.label ? 'pd-size-chip-btn--selected' : ''} ${!s.available ? 'pd-size-chip-btn--disabled' : ''}`}
                          onClick={() => setSelectedSize(s.label)}
                        >
                          {s.label}
                          {!s.available && <span className="pd-size-chip-btn__slash" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Variations Section */}
                {product.colors && product.colors.length > 0 && (
                  <div className="pd-option-block">
                    <div className="pd-option-header">
                      <label className="pd-option-label">
                        Color Option: <strong className="pd-selected-value-highlight">{selectedColor || 'None'}</strong>
                      </label>
                    </div>
                    <div className="pd-color-swatches-row">
                      {product.colors.map(c => (
                        <button
                          key={c.name}
                          disabled={!c.available}
                          className={`pd-swatch-circle-btn ${product.id === c.id ? 'pd-swatch-circle-btn--active' : ''} ${!c.available ? 'pd-swatch-circle-btn--disabled' : ''}`}
                          style={{ '--swatch-color': c.hex }}
                          onClick={() => {
                            if (product.id !== c.id) {
                              navigate(`/product/${c.id}`);
                            }
                          }}
                          title={c.name}
                        >
                          {!c.available && <span className="pd-swatch-disabled-cross">×</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity & Actions Layout */}
                <div className="pd-purchase-controls-row">
                  <div className="pd-qty-stepper">
                    <button 
                      className="pd-qty-stepper-btn" 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                    >
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                    <span className="pd-qty-display-value">{quantity}</span>
                    <button 
                      className="pd-qty-stepper-btn" 
                      onClick={() => setQuantity(q => q + 1)}
                    >
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>

                  <div className="pd-actions-btn-group">
                    <button className="pd-cta-btn pd-cta-btn--cart" onClick={handleAddToBag}>
                      <span className="material-symbols-outlined">shopping_bag</span>
                      Add to Bag
                    </button>
                    <button className="pd-cta-btn pd-cta-btn--buy" onClick={handleBuyNow}>
                      <span className="material-symbols-outlined">flash_on</span>
                      Buy Now
                    </button>
                  </div>
                </div>

                {/* Delivery Checker Widget */}
                <div className="pd-widget-card pd-widget-card--delivery">
                  <div className="pd-widget-card-title">
                    <span className="material-symbols-outlined">local_shipping</span>
                    Delivery availability checker
                  </div>
                  <div className="pd-delivery-input-group">
                    <input
                      type="text"
                      maxLength={6}
                      className={`pd-delivery-text-input ${pincodeStatus === 'invalid' ? 'pd-delivery-text-input--error' : ''}`}
                      placeholder="Enter 6-digit Pincode"
                      value={pincode}
                      onChange={e => {
                        setPincode(e.target.value);
                        setPincodeStatus(null);
                      }}
                    />
                    <button className="pd-delivery-check-btn" onClick={checkDelivery}>Check</button>
                  </div>
                  {pincodeStatus === 'valid' && (
                    <p className="pd-delivery-status-msg pd-delivery-status-msg--success">
                      <span className="material-symbols-outlined">check_circle</span>
                      Estimated delivery in 2-3 business days. COD available.
                    </p>
                  )}
                  {pincodeStatus === 'invalid' && (
                    <p className="pd-delivery-status-msg pd-delivery-status-msg--error">
                      <span className="material-symbols-outlined">cancel</span>
                      Please enter a valid 6-digit numeric pincode.
                    </p>
                  )}

                  <div className="pd-delivery-checklist">
                    <div className="pd-delivery-checklist-item">
                      <span className="material-symbols-outlined text-green">verified</span>
                      <span>Free Express Delivery for orders above ₹999</span>
                    </div>
                    <div className="pd-delivery-checklist-item">
                      <span className="material-symbols-outlined text-blue">history</span>
                      <span>Easy 7-day exchange and return policy</span>
                    </div>
                  </div>
                </div>

                {/* Seller Stats Card */}
                <div className="pd-widget-card pd-widget-card--seller">
                  <div className="pd-widget-card-title">
                    <span className="material-symbols-outlined">storefront</span>
                    Merchant Partner Info
                  </div>
                  <div className="pd-seller-details-row">
                    <div className="pd-seller-name-block">
                      <span className="pd-seller-title-name">{product.seller?.username || 'SNITCH Official'}</span>
                      {product.seller?.verified && (
                        <span className="pd-seller-verified-tag" title="Verified SNITCH Vendor">
                          <span className="material-symbols-outlined">verified</span>
                        </span>
                      )}
                    </div>
                    <div className="pd-seller-stats-grid">
                      <div className="pd-seller-stat-box">
                        <span className="pd-seller-stat-val">4.7 ★</span>
                        <span className="pd-seller-stat-lbl">Rating</span>
                      </div>
                      <div className="pd-seller-stat-separator" />
                      <div className="pd-seller-stat-box">
                        <span className="pd-seller-stat-val">99%</span>
                        <span className="pd-seller-stat-lbl">Positive</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="pd-trust-row">
                  <div className="pd-trust-badge-cell">
                    <span className="material-symbols-outlined">gpp_good</span>
                    <span>Safe SSL Checkout</span>
                  </div>
                  <div className="pd-trust-badge-cell">
                    <span className="material-symbols-outlined">workspace_premium</span>
                    <span>100% Authentic Quality</span>
                  </div>
                </div>

              </div>
            </section>
          </div>

          {/* Sticky Sub-navigation Bar for Smooth-Scrolling */}
          <div className="pd-sub-navigation-bar">
            <button onClick={() => scrollToSection('pd-description-section')} className="pd-sub-nav-btn">
              Description
            </button>
            <button onClick={() => scrollToSection('pd-highlights-section')} className="pd-sub-nav-btn">
              Highlights
            </button>
            <button onClick={() => scrollToSection('pd-reviews-section')} className="pd-sub-nav-btn">
              Reviews ({reviewsList.length})
            </button>
            <button onClick={() => scrollToSection('pd-suggestions-section')} className="pd-sub-nav-btn">
              Suggested Products
            </button>
          </div>

          {/* Sequential Scrolling Sections (Amazon-style Layout) */}
          <div className="pd-scrolling-sections-container">
            
            {/* 1. Description Section */}
            <section id="pd-description-section" className="pd-scrolling-section">
              <div className="pd-editorial-description">
                <h3>DESIGNER'S NOTE</h3>
                <p>{product.description}</p>
              </div>
              <div className="pd-product-specs-table-wrapper">
                <h3>PRODUCT SPECIFICATIONS</h3>
                <table className="pd-product-specs-table">
                  <tbody>
                    <tr>
                      <td className="pd-spec-key">Fit Profile</td>
                      <td className="pd-spec-value">Regular Fit / Comfort Casual</td>
                    </tr>
                    <tr>
                      <td className="pd-spec-key">Fabric Blend</td>
                      <td className="pd-spec-value">100% Premium Cotton Knit</td>
                    </tr>
                    <tr>
                      <td className="pd-spec-key">Style Category</td>
                      <td className="pd-spec-value">{product.category || 'Apparel'}</td>
                    </tr>
                    <tr>
                      <td className="pd-spec-key">Care Instruction</td>
                      <td className="pd-spec-value">Cold machine wash, tumble dry low heat</td>
                    </tr>
                    <tr>
                      <td className="pd-spec-key">Style Code</td>
                      <td className="pd-spec-value">{product.styleCode || 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 2. Highlights Section */}
            <section id="pd-highlights-section" className="pd-scrolling-section">
              <h3 className="pd-highlights-heading">Product Highlights & Key Features</h3>
              <div className="pd-highlights-checklist">
                {product.highlights?.map((h, i) => (
                  <div key={i} className="pd-highlight-card">
                    <span className="material-symbols-outlined pd-highlight-card-icon">check_circle</span>
                    <div className="pd-highlight-card-text">{h}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Reviews Section */}
            <section id="pd-reviews-section" className="pd-scrolling-section">
              <h3 className="pd-reviews-list-title">Customer Feedback ({reviewsList.length})</h3>
              
              {/* Reviews Dashboard */}
              <div className="pd-reviews-dashboard-grid">
                {/* Big Score Summary */}
                <div className="pd-reviews-score-card">
                  <span className="pd-big-score">{product.rating?.toFixed(1) || '0.0'}</span>
                  <StarRating rating={product.rating} count={reviewsList.length} showText={false} size="lg" />
                  <span className="pd-score-subtitle">Average Rating Score</span>
                  
                  <button className="pd-write-review-trigger-btn" onClick={() => setShowWriteReview(true)}>
                    <span className="material-symbols-outlined">rate_review</span>
                    Write a Review
                  </button>
                </div>

                {/* Breakdown bars */}
                <div className="pd-reviews-bars-card">
                  {[5, 4, 3, 2, 1].map(stars => {
                    const countOfStars = reviewsList.filter(r => Math.round(r.rating) === stars).length;
                    const pct = reviewsList.length > 0 ? Math.round((countOfStars / reviewsList.length) * 100) : 0;
                    
                    return (
                      <div key={stars} className="pd-star-bar-row">
                        <span className="pd-bar-label">{stars} Star</span>
                        <div className="pd-bar-track">
                          <div className="pd-bar-fill" style={{ width: `${pct || (stars === 5 ? 75 : stars === 4 ? 20 : 5)}%` }} />
                        </div>
                        <span className="pd-bar-percent">{pct || (stars === 5 ? 75 : stars === 4 ? 20 : 5)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reviews list */}
              <div className="pd-reviews-list-container">
                {reviewsList.length > 0 ? (
                  <div className="pd-reviews-scroller">
                    {reviewsList.map((rev) => (
                      <div key={rev.id || rev._id} className="pd-customer-review-card">
                        <div className="pd-review-card-header">
                          <div className="pd-review-author-avatar">
                            {rev.user?.username?.substring(0, 2).toUpperCase() || 'AN'}
                          </div>
                          <div className="pd-review-author-meta">
                            <span className="pd-review-author-name">{rev.user?.username || 'Anonymous'}</span>
                            <div className="pd-review-verified-badge">
                              <span className="material-symbols-outlined">verified</span>
                              <span>Verified Purchase</span>
                            </div>
                          </div>
                          <span className="pd-review-date-timestamp">
                            {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>

                        <div className="pd-review-card-stars-row">
                          <StarRating rating={rev.rating} showText={false} />
                        </div>

                        <p className="pd-review-comment-body">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="pd-empty-reviews-state">
                    <span className="material-symbols-outlined">chat_bubble_outline</span>
                    <h4>No Reviews Yet</h4>
                    <p>Be the first one to share your feedback about this product!</p>
                    <button className="pd-write-review-trigger-btn pd-write-review-trigger-btn--sm" onClick={() => setShowWriteReview(true)}>
                      Write the first Review
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* 4. Suggested Products Section */}
            <section id="pd-suggestions-section" className="pd-scrolling-section">
              <h3 className="pd-suggestions-heading">You May Also Like</h3>
              {suggestedProducts.length > 0 ? (
                <div className="pd-suggestions-horizontal-scroll">
                  {suggestedProducts.map(p => (
                    <div 
                      key={p.id || p._id} 
                      className="pd-suggested-card"
                      onClick={() => {
                        navigate(`/product/${p.id || p._id}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <div className="pd-suggested-card__img-wrap">
                        <img src={p.image} alt={p.name} />
                        {p.discount > 0 && (
                          <span className="pd-suggested-card__badge">
                            {p.discount}% OFF
                          </span>
                        )}
                      </div>
                      <div className="pd-suggested-card__info">
                        <span className="pd-suggested-card__brand">{p.brand}</span>
                        <h4 className="pd-suggested-card__title">{p.name}</h4>
                        <div className="pd-suggested-card__price-row">
                          <span className="pd-suggested-card__price">₹{p.price?.toLocaleString('en-IN')}</span>
                          {p.originalPrice > p.price && (
                            <span className="pd-suggested-card__orig-price">₹{p.originalPrice?.toLocaleString('en-IN')}</span>
                          )}
                        </div>
                        <div className="pd-suggested-card__rating">
                          <span className="star">★</span>
                          <span>{p.rating?.toFixed(1) || '0.0'}</span>
                          <span className="count">({p.reviewCount || 0})</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="pd-suggestions-loading-row">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="pd-suggested-card-skeleton" />
                  ))}
                </div>
              )}
            </section>

          </div>

        </div>
      </div>

      {/* ── Size Guide Modal ── */}
      {showSizeGuide && (
        <div className="pd-modal-overlay" onClick={() => setShowSizeGuide(false)}>
          <div className="pd-modal-content pd-modal-content--size" onClick={e => e.stopPropagation()}>
            <header className="pd-modal-header">
              <h3>SNITCH Size Specifications Guide</h3>
              <button className="pd-modal-close-btn" onClick={() => setShowSizeGuide(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>
            <div className="pd-modal-body">
              <p>Find the best fit size measurements for this product in inches. All measurements represent chest and body outlines.</p>
              <div className="pd-size-guide-table-wrap">
                <table className="pd-size-guide-table">
                  <thead>
                    <tr>
                      <th>Size</th>
                      <th>Chest (in)</th>
                      <th>Front Length (in)</th>
                      <th>Shoulder (in)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>XS</strong></td>
                      <td>36"</td>
                      <td>26.5"</td>
                      <td>16.5"</td>
                    </tr>
                    <tr>
                      <td><strong>S</strong></td>
                      <td>38"</td>
                      <td>27.5"</td>
                      <td>17.5"</td>
                    </tr>
                    <tr>
                      <td><strong>M</strong></td>
                      <td>40"</td>
                      <td>28"</td>
                      <td>18"</td>
                    </tr>
                    <tr>
                      <td><strong>L</strong></td>
                      <td>42"</td>
                      <td>28.5"</td>
                      <td>18.5"</td>
                    </tr>
                    <tr>
                      <td><strong>XL</strong></td>
                      <td>44"</td>
                      <td>29"</td>
                      <td>19"</td>
                    </tr>
                    <tr>
                      <td><strong>XXL</strong></td>
                      <td>46"</td>
                      <td>30"</td>
                      <td>20"</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="pd-size-guide-tips">
                <h5>Measurement Guide Tips:</h5>
                <ul>
                  <li><strong>Chest:</strong> Wrap tape measurement around the fullest part of your chest.</li>
                  <li><strong>Length:</strong> Measure from the highest point of your shoulder down.</li>
                  <li>If you are in-between sizes, we recommend ordering one size larger for a comfortable relaxed fit.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Write Review Modal ── */}
      {showWriteReview && (
        <div className="pd-modal-overlay" onClick={() => setShowWriteReview(false)}>
          <div className="pd-modal-content pd-modal-content--review" onClick={e => e.stopPropagation()}>
            <header className="pd-modal-header">
              <h3>Submit Customer Review</h3>
              <button className="pd-modal-close-btn" onClick={() => setShowWriteReview(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>
            <form onSubmit={handleReviewSubmit}>
              <div className="pd-modal-body">
                <div className="pd-modal-form-group">
                  <label className="pd-modal-form-label">Overall Rating: *</label>
                  <StarRating 
                    rating={reviewRating} 
                    showText={true} 
                    count={undefined} 
                    size="lg" 
                    onClick={(r) => setReviewRating(r)} 
                  />
                </div>

                <div className="pd-modal-form-group">
                  <label className="pd-modal-form-label" htmlFor="review-title">Review Title (optional):</label>
                  <input
                    type="text"
                    id="review-title"
                    className="pd-modal-text-input"
                    placeholder="E.g., Great quality fabric! / Perfect Fit"
                    value={reviewTitle}
                    onChange={e => setReviewTitle(e.target.value)}
                  />
                </div>

                <div className="pd-modal-form-group">
                  <label className="pd-modal-form-label" htmlFor="review-comment">Review Content: *</label>
                  <textarea
                    id="review-comment"
                    rows={5}
                    required
                    className="pd-modal-textarea-input"
                    placeholder="Share your detailed feedback on comfort, styling, material quality, and fit profile..."
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                  />
                </div>
              </div>
              <footer className="pd-modal-footer">
                <button 
                  type="button" 
                  className="pd-modal-cancel-btn" 
                  onClick={() => setShowWriteReview(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="pd-modal-submit-btn"
                  disabled={submittingReview}
                >
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* ── Cart Pop-up Modal ── */}
      {showCartPopup && (
        <div className={`pd-cart-modal ${isClosing ? 'pd-cart-modal--closing' : ''}`} key={popupKey}>
          <div className="pd-cart-modal__content">
            <div className="pd-cart-modal__close-wrapper">
              <svg className="pd-cart-modal__timer-svg" width="28" height="28" viewBox="0 0 28 28">
                <circle className="pd-cart-modal__timer-bg" cx="14" cy="14" r="12" />
                <circle className="pd-cart-modal__timer-progress" cx="14" cy="14" r="12" />
              </svg>
              <button className="pd-cart-modal__close" onClick={() => setIsClosing(true)} aria-label="Close notification">
                <span className="pd-cart-modal__countdown-num">{timeLeft}</span>
                <span className="material-symbols-outlined pd-cart-modal__close-icon">close</span>
              </button>
            </div>
            <div className="pd-cart-modal__header">
              <span className="material-symbols-outlined">check_circle</span>
              <h3>Added to Bag</h3>
            </div>
            <div className="pd-cart-modal__body">
              <div className="pd-cart-modal__image-wrap">
                <img src={mainImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="pd-cart-modal__info">
                <span className="pd-cart-modal__brand">{product.brand}</span>
                <h4 className="pd-cart-modal__title">{product.name}</h4>
                <div className="pd-cart-modal__meta">
                  <span>Size: <strong>{selectedSize}</strong></span>
                  <span>Qty: <strong>{quantity}</strong></span>
                </div>
                <div className="pd-cart-modal__price-row">
                  <span className="pd-cart-modal__price">{formatPrice(product.price)}</span>
                </div>
              </div>
            </div>
            <div className="pd-cart-modal__footer">
              <button className="pd-cart-modal__btn-cart" onClick={() => navigate('/buyer/cart')}>
                Go to Cart
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button className="pd-cart-modal__btn-continue" onClick={() => setIsClosing(true)}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </BuyerDashboard>
  );
};

export default ProductPage;
