import React, { useState, useEffect, useMemo } from 'react';
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
  const bannerList = useMemo(() => new DoublyCircularLinkedList(banners), [banners]);
  const [activeNode, setActiveNode] = useState(null);

  useEffect(() => {
    setActiveNode(bannerList.head);
  }, [bannerList]);

  useEffect(() => {
    if (loading || !activeNode || banners.length <= 1) return;
    const timer = setInterval(() => {
      setActiveNode(node => node.next);
    }, 4500);
    return () => clearInterval(timer);
  }, [loading, activeNode, banners.length]);

  if (loading) return <HeroBannerSkeleton />;
  if (banners.length === 0 || !activeNode) return null;

  const b = activeNode.value;
  const imgUrl = b.imageUrl || b.image;
  const bannerId = b._id || b.id;

  return (
    <section className="sf-hero" style={{ background: b.gradient, margin: '0 -1.5rem 2rem', height: '380px' }}>
      <div className="sf-hero__overlay" />
      {imgUrl && <img src={imgUrl} alt="" className="sf-hero__img" key={bannerId} />}
      
      {/* Navigation Arrows */}
      <button 
        className="sf-hero__nav-btn sf-hero__nav-btn--prev" 
        onClick={() => setActiveNode(activeNode.prev)}
        aria-label="Previous banner"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>
      
      <button 
        className="sf-hero__nav-btn sf-hero__nav-btn--next" 
        onClick={() => setActiveNode(activeNode.next)}
        aria-label="Next banner"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>

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

      {/* Dots Indicator */}
      <div className="sf-hero__dots">
        {bannerList.toNodeArray().map((node, i) => (
          <button
            key={i}
            className={`sf-hero__dot ${activeNode === node ? 'active' : ''}`}
            style={activeNode === node ? { background: b.accent } : {}}
            onClick={() => setActiveNode(node)}
            aria-label={`Banner ${i + 1}`}
          />
        ))}
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
        <HeroBanner onShopNow={scrollToProducts} loading={bannersLoading} banners={banners} />

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
