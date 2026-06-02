import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CATEGORIES, SORT_OPTIONS, BANNERS } from '../data/products';
import { DoublyCircularLinkedList } from '../../../utils/circularLinkedList';
import { fetchProducts, updateFilters } from '../slice/product.slice';
import BuyerDashboard from '../../buyer/dashboard/components/BuyerDashboard';
import ProductCard from './shared/ProductCard';
import '../style/StoreFront.scss';

import { 
  ProductCardSkeleton, 
  HeroBannerSkeleton, 
  SkeletonGrid 
} from '../../../components/loaders/ComponentSkeletons';

import { getActiveBanners } from '../../seller/dashboard/services/banner.api.js';

// ── Helpers ───────────────────────────────────────────────────
const CATEGORY_ICONS = {
  all: 'grid_view',
  tshirts: 'checkroom',
  shirts: 'dry_cleaning',
  jeans: 'layers',
  trousers: 'straighten',
  jackets: 'ac_unit',
  coats: 'legend_toggle',
  dresses: 'woman',
  skirts: 'palette',
  shoes: 'steps',
  accessories: 'watch'
};


// ── Hero Banner Carousel ───────────────────────────────────────
const HeroBanner = ({ onShopNow, loading = false, banners = [] }) => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, clientWidth } = containerRef.current;
    if (clientWidth > 0) {
      const index = Math.round(scrollLeft / clientWidth);
      setActiveIndex(index);
    }
  };

  const handleDotClick = (index) => {
    if (!containerRef.current) return;
    const { clientWidth } = containerRef.current;
    containerRef.current.scrollTo({
      left: index * clientWidth,
      behavior: 'smooth'
    });
    setActiveIndex(index);
  };

  // Auto-scroll logic matching premium scroll-snap carousel
  useEffect(() => {
    if (loading || banners.length <= 1) return;
    const timer = setInterval(() => {
      if (!containerRef.current) return;
      const { clientWidth } = containerRef.current;
      const nextIndex = (activeIndex + 1) % banners.length;
      containerRef.current.scrollTo({
        left: nextIndex * clientWidth,
        behavior: 'smooth'
      });
      setActiveIndex(nextIndex);
    }, 5000);
    return () => clearInterval(timer);
  }, [loading, activeIndex, banners.length]);

  if (loading) return <HeroBannerSkeleton />;
  if (banners.length === 0) return null;

  return (
    <div 
      className="sf-hero-scroll-container"
      style={{
        position: 'relative',
        width: '100%'
      }}
    >
      {/* Scrollable track with native momentum scrolling and snap points */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          height: '440px',
          width: '100%',
        }}
        className="sf-hero-track"
      >
        {/* Style block to hide scrollbar on Webkit browsers */}
        <style dangerouslySetInnerHTML={{__html: `
          .sf-hero-track::-webkit-scrollbar {
            display: none !important;
          }
        `}} />

        {banners.map((b, i) => {
          const imgUrl = b.imageUrl || b.image;
          return (
            <div
              key={b._id || b.id || i}
              style={{
                flex: '0 0 100%',
                width: '100%',
                scrollSnapAlign: 'start',
                position: 'relative',
                height: '440px',
                background: b.gradient,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div className="sf-hero__overlay" />
              {imgUrl && (
                <img 
                  src={imgUrl} 
                  alt="" 
                  className="sf-hero__img" 
                />
              )}
              
              <div className="sf-hero__content">
                <p className="sf-hero__eyebrow" style={{ color: b.accent }}>SNITCH — New Collection</p>
                <h2 className="sf-hero__title">{b.title}</h2>
                <p className="sf-hero__sub">{b.subtitle}</p>
                <button
                  className="sf-hero__cta"
                  style={{ borderColor: b.accent, color: b.accent }}
                  onClick={onShopNow}
                >
                  {b.cta || 'Explore Collection'}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="sf-hero__dots">
          {banners.map((_, i) => (
            <button
              key={i}
              className={`sf-hero__dot ${activeIndex === i ? 'active' : ''}`}
              style={activeIndex === i ? { background: banners[i].accent } : {}}
              onClick={() => handleDotClick(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ── Main StoreFront Page ───────────────────────────────────────
const StoreFront = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { list: products, loading, filters } = useSelector(state => state.products);
  const { category, sort, search } = filters;

  const productsRef = useRef(null);

  const [banners, setBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, category, sort, search]);

  useEffect(() => {
    let isMounted = true;
    const fetchActiveBanners = async () => {
      try {
        const activeBanners = await getActiveBanners();
        if (isMounted) {
          if (activeBanners && activeBanners.length > 0) {
            setBanners(activeBanners);
          } else {
            setBanners(BANNERS);
          }
        }
      } catch (error) {
        console.error('Error fetching active banners:', error);
        if (isMounted) {
          setBanners(BANNERS);
        }
      } finally {
        if (isMounted) {
          setBannersLoading(false);
        }
      }
    };

    fetchActiveBanners();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleProductSelect = (product) => {
    navigate(`/product?id=${product.id}`);
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

  return (
    <BuyerDashboard>
      <div className="sf-container">

        <div className="sf-main">
        {/* ── Hero Banner ───────────────────────────── */}
        <HeroBanner onShopNow={scrollToProducts} loading={bannersLoading} banners={banners} />

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
