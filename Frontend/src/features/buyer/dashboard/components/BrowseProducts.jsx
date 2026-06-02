import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BuyerDashboard from './BuyerDashboard';
import { CATEGORIES, SORT_OPTIONS, BANNERS } from '../../../store/data/products';
import { useBrowseProducts } from '../Hooks/useBrowseProducts';
import { DoublyCircularLinkedList } from '../../../../utils/circularLinkedList';
import { getActiveBanners } from '../../../seller/dashboard/services/banner.api.js';
import { HeroBannerSkeleton, ProductCardSkeleton } from '../../../../components/loaders/ComponentSkeletons';
import '../style/BrowseProducts.scss';

import ProductCard from '../../../store/components/shared/ProductCard';

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
        marginBottom: '2rem',
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
          borderRadius: '16px',
          height: '380px',
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
                height: '380px',
                background: b.gradient,
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div className="sf-hero__overlay" style={{ borderRadius: '16px' }} />
              {imgUrl && (
                <img 
                  src={imgUrl} 
                  alt="" 
                  className="sf-hero__img" 
                  style={{ borderRadius: '16px' }} 
                />
              )}
              
              <div className="sf-hero__content">
                <p className="sf-hero__eyebrow" style={{ color: b.accent }}>Member Exclusive</p>
                <h1 className="sf-hero__title" style={{ fontSize: '2.5rem' }}>{b.title}</h1>
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

const BrowseProducts = () => {
  const navigate = useNavigate();
  const {
    loading,
    error,
    category,
    sort,
    setSort,
    productsRef,
    filteredProducts,
    scrollToProducts
  } = useBrowseProducts();

  const [banners, setBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);

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
      } catch (err) {
        console.error('Error fetching active banners:', err);
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

  if (error) return <div className="sf-error">Error: {error}</div>;

  const handleProductSelect = (product) => {
    navigate(`/product?id=${product.id}`);
  };

  return (
    <BuyerDashboard>
      <div className="browse-products-new">
        <section className="sf-products-section" ref={productsRef}>
          <HeroBanner onShopNow={scrollToProducts} loading={bannersLoading} banners={banners} />
          
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
              Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
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
