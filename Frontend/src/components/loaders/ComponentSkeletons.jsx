import React from 'react';
import { Skeleton } from './Skeleton';

/**
 * Product Card Skeleton
 * Matches the layout of StoreFront ProductCard
 */
export const ProductCardSkeleton = () => (
    <div className="sf-card" style={{ cursor: 'default', pointerEvents: 'none' }}>
        <div className="sf-card__img-wrap" style={{ background: 'transparent' }}>
            <Skeleton height="100%" variant="rect" />
        </div>
        <div className="sf-card__body" style={{ gap: '12px', display: 'flex', flexDirection: 'column' }}>
            <Skeleton width="40%" height="0.8rem" />
            <Skeleton width="90%" height="1.2rem" />
            <Skeleton width="60%" height="0.8rem" />
            <div className="flex gap-2 mt-2">
                <Skeleton width="30%" height="1.2rem" />
                <Skeleton width="20%" height="1rem" />
            </div>
            <div className="flex gap-2 mt-2">
                {[1, 2, 3].map(i => (
                    <Skeleton key={i} width="16px" height="16px" variant="circle" />
                ))}
            </div>
            <Skeleton width="70%" height="0.8rem" className="mt-2" />
        </div>
    </div>
);

/**
 * Stat Card Skeleton
 */
export const StatCardSkeleton = () => (
    <div className="stat-card" style={{ minHeight: '160px' }}>
        <div className="stat-card__header">
            <Skeleton width="48px" height="48px" variant="rounded" />
            <Skeleton width="60px" height="24px" variant="rounded" />
        </div>
        <div className="mt-4">
            <Skeleton width="80%" height="2.5rem" />
            <Skeleton width="50%" height="1rem" className="mt-2" />
        </div>
    </div>
);

/**
 * Quick Category Skeleton
 */
export const CategorySkeleton = () => (
    <div className="sf-quick-cat" style={{ pointerEvents: 'none' }}>
        <div className="sf-quick-cat__img-wrap">
            <Skeleton width="100%" height="100%" variant="circle" />
        </div>
        <Skeleton width="60px" height="0.8rem" className="mx-auto mt-2" />
    </div>
);

/**
 * Hero Banner Skeleton
 */
export const HeroBannerSkeleton = () => (
    <div className="sf-hero" style={{ background: 'rgba(var(--color-rgb-text), 0.03)', height: '500px' }}>
        <div className="sf-hero__content">
            <Skeleton width="150px" height="1rem" accent />
            <Skeleton width="400px" height="4rem" className="mt-6" />
            <Skeleton width="300px" height="1.5rem" className="mt-4" />
            <Skeleton width="160px" height="3rem" variant="rounded" className="mt-8" />
        </div>
    </div>
);

/**
 * Product Page Skeleton
 * Mirrors the exact layout of ProductPage.jsx:
 *   .pd-grid → 3 columns: pd-gallery | pd-info | pd-sidebar
 */
export const ProductPageSkeleton = () => (
    <div className="product-page-wrapper">
        <div className="pd-page-container">

            {/* Breadcrumb */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px', padding: '0 32px' }}>
                <Skeleton width="40px" height="13px" />
                <Skeleton width="8px" height="13px" />
                <Skeleton width="60px" height="13px" />
                <Skeleton width="8px" height="13px" />
                <Skeleton width="140px" height="13px" />
            </div>

            <div className="pd-grid">

                {/* ── Gallery column ── */}
                <aside className="pd-gallery">
                    {/* Thumbnails */}
                    <div className="pd-gallery__thumbnails">
                        {[1, 2, 3, 4].map(i => (
                            <Skeleton
                                key={i}
                                width="64px"
                                height="80px"
                                variant="rounded"
                                style={{ borderRadius: '8px', flexShrink: 0 }}
                            />
                        ))}
                    </div>
                    {/* Main image */}
                    <div className="pd-gallery__main">
                        <Skeleton height="100%" variant="rect" style={{ borderRadius: '16px' }} />
                    </div>
                </aside>

                {/* ── Info column ── */}
                <main className="pd-info">
                    {/* Brand + Category pill */}
                    <div className="pd-info__brand-row">
                        <Skeleton width="70px" height="14px" />
                        <Skeleton width="120px" height="26px" variant="rounded" style={{ borderRadius: '999px' }} />
                    </div>

                    {/* Product name */}
                    <Skeleton width="90%" height="32px" style={{ borderRadius: '6px' }} />
                    <Skeleton width="65%" height="32px" style={{ borderRadius: '6px', marginTop: '-8px' }} />

                    {/* Rating row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <Skeleton width="32px" height="14px" />
                        {[1,2,3,4,5].map(i => <Skeleton key={i} width="16px" height="16px" variant="circle" />)}
                        <Skeleton width="80px" height="13px" />
                    </div>

                    {/* SKU */}
                    <Skeleton width="100px" height="12px" />

                    {/* Price block */}
                    <div className="pd-info__price-block">
                        <div className="pd-info__price-row">
                            <Skeleton width="130px" height="36px" style={{ borderRadius: '4px' }} />
                            <Skeleton width="72px" height="28px" style={{ borderRadius: '4px' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
                            <Skeleton width="40px" height="12px" />
                            <Skeleton width="60px" height="12px" />
                            <Skeleton width="90px" height="12px" />
                        </div>
                        <Skeleton width="160px" height="11px" style={{ marginTop: '4px' }} />
                    </div>

                    {/* Size selector */}
                    <div className="pd-info__option-group">
                        <div className="pd-info__option-header">
                            <Skeleton width="120px" height="14px" />
                            <Skeleton width="80px" height="13px" />
                        </div>
                        <div className="pd-info__sizes">
                            {['S','M','L','XL'].map(i => (
                                <Skeleton key={i} width="52px" height="44px" style={{ borderRadius: '8px' }} />
                            ))}
                        </div>
                    </div>

                    {/* Color selector */}
                    <div className="pd-info__option-group">
                        <Skeleton width="130px" height="14px" />
                        <div className="pd-info__colors">
                            {[1,2,3].map(i => (
                                <Skeleton key={i} width="32px" height="32px" variant="circle" />
                            ))}
                        </div>
                    </div>

                    {/* Quantity + CTA */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Skeleton width="36px" height="36px" variant="circle" />
                            <Skeleton width="28px" height="28px" />
                            <Skeleton width="36px" height="36px" variant="circle" />
                        </div>
                        <Skeleton width="100%" height="52px" style={{ borderRadius: '999px', flex: 1 }} />
                    </div>

                    {/* Wishlist / secondary */}
                    <Skeleton width="140px" height="14px" style={{ margin: '0 auto' }} />
                </main>

                {/* ── Sidebar column ── */}
                <aside className="pd-sidebar">
                    {/* Delivery widget */}
                    <div className="pd-widget">
                        <div className="pd-widget__header">
                            <Skeleton width="20px" height="20px" variant="circle" />
                            <Skeleton width="140px" height="12px" />
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Skeleton height="38px" style={{ flex: 1, borderRadius: '8px' }} />
                            <Skeleton width="64px" height="38px" style={{ borderRadius: '8px' }} />
                        </div>
                        {/* Delivery options */}
                        {[1,2,3].map(i => (
                            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <Skeleton width="20px" height="20px" variant="circle" />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                                    <Skeleton width="70%" height="13px" />
                                    <Skeleton width="55%" height="11px" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Seller widget */}
                    <div className="pd-widget">
                        <div className="pd-widget__header">
                            <Skeleton width="20px" height="20px" variant="circle" />
                            <Skeleton width="140px" height="12px" />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Skeleton width="110px" height="15px" />
                            <Skeleton width="18px" height="18px" variant="circle" />
                        </div>
                        {/* Seller stats */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(var(--color-rgb-text),0.03)', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '4px' }}>
                                <Skeleton width="48px" height="18px" />
                                <Skeleton width="36px" height="10px" />
                            </div>
                            <div style={{ width: '1px', height: '32px', background: 'rgba(var(--color-rgb-text),0.08)' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '4px' }}>
                                <Skeleton width="48px" height="18px" />
                                <Skeleton width="36px" height="10px" />
                            </div>
                        </div>
                        <Skeleton width="110px" height="34px" style={{ borderRadius: '999px' }} />
                    </div>

                    {/* Trust badges */}
                    <div className="pd-widget pd-widget--compact">
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Skeleton width="18px" height="18px" variant="circle" />
                                <Skeleton width="80px" height="12px" />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Skeleton width="18px" height="18px" variant="circle" />
                                <Skeleton width="80px" height="12px" />
                            </div>
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    </div>
);


/**
 * Table Row Skeleton (for dashboard lists)
 */
export const TableRowSkeleton = ({ columns = 5 }) => (
    <div className="flex items-center gap-4 py-4 px-6 border-b border-[rgba(var(--color-rgb-text),0.05)]">
        {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} width={i === 0 ? "40px" : "15%"} height={i === 0 ? "40px" : "1rem"} variant={i === 0 ? "circle" : "rect"} />
        ))}
    </div>
);

/**
 * Grid implementation for multiple skeletons
 */
export const SkeletonGrid = ({ count = 8, children }) => (
    <div className="sf-grid">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i}>{children}</div>
        ))}
    </div>
);

/**
 * Dashboard Product Card Skeleton
 * Matches the layout of dashboard/ProductCard
 */
export const DashboardProductCardSkeleton = () => (
    <div className="product-card product-card--grid" style={{ cursor: 'default', pointerEvents: 'none' }}>
        <div className="product-card__image-wrap" style={{ background: 'transparent' }}>
            <Skeleton height="100%" variant="rect" />
        </div>
        <div className="product-card__body" style={{ gap: '12px', display: 'flex', flexDirection: 'column' }}>
            <Skeleton width="30%" height="0.8rem" />
            <Skeleton width="90%" height="1.2rem" />
            <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                    <Skeleton key={i} width="14px" height="14px" variant="circle" />
                ))}
            </div>
            <div className="flex gap-1">
                {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} width="28px" height="20px" variant="rounded" style={{ borderRadius: '4px' }} />
                ))}
            </div>
            <div className="flex gap-2 items-center">
                <Skeleton width="40%" height="1.2rem" />
                <Skeleton width="25%" height="0.9rem" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton width="45%" height="0.9rem" />
            </div>
            <Skeleton width="100%" height="38px" variant="rounded" style={{ borderRadius: '8px', marginTop: '4px' }} />
        </div>
    </div>
);

/**
 * Wishlist Item Skeleton
 */
export const WishlistItemSkeleton = () => (
    <div className="wishlist__item" style={{ cursor: 'default', pointerEvents: 'none' }}>
        <DashboardProductCardSkeleton />
        <Skeleton width="100%" height="38px" variant="rounded" style={{ borderRadius: '8px', marginTop: '4px' }} />
    </div>
);

/**
 * Order Card Skeleton
 */
export const OrderCardSkeleton = () => (
    <div className="buyer-orders__card" style={{ cursor: 'default', pointerEvents: 'none' }}>
        <div className="buyer-orders__card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="buyer-orders__card-id-row" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Skeleton width="120px" height="1.25rem" />
                <Skeleton width="60px" height="20px" variant="rounded" style={{ borderRadius: '4px' }} />
            </div>
            <Skeleton width="140px" height="1rem" />
        </div>
        
        <div className="buyer-orders__card-body" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Skeleton width="56px" height="70px" variant="rounded" style={{ borderRadius: '8px' }} />
            <div className="buyer-orders__product-info" style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                <Skeleton width="60%" height="1.25rem" />
                <Skeleton width="30%" height="1rem" />
            </div>
        </div>

        <div className="buyer-orders__progress-wrap" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Skeleton height="4px" style={{ flex: 1, borderRadius: '999px' }} />
            <Skeleton width="64px" height="12px" />
        </div>

        <Skeleton width="200px" height="12px" style={{ marginTop: '4px' }} />

        <div className="buyer-orders__card-actions" style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <Skeleton width="110px" height="34px" variant="rounded" style={{ borderRadius: '8px' }} />
            <Skeleton width="90px" height="34px" variant="rounded" style={{ borderRadius: '8px' }} />
            <Skeleton width="90px" height="34px" variant="rounded" style={{ borderRadius: '8px' }} />
        </div>
    </div>
);

/**
 * Profile Skeleton
 */
export const ProfileSkeleton = () => (
    <div className="buyer-profile" style={{ cursor: 'default', pointerEvents: 'none' }}>
        <div className="buyer-profile__top">
            <div className="buyer-profile__left-col">
                <div className="buyer-profile__avatar-card">
                    <Skeleton width="96px" height="96px" variant="circle" />
                    <Skeleton width="140px" height="1.25rem" />
                    <Skeleton width="100px" height="0.85rem" />
                    <div className="buyer-profile__divider" />
                    <div className="buyer-profile__quick-stats" style={{ width: '100%' }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="buyer-profile__quick-stat" style={{ flex: 1 }}>
                                <Skeleton width="24px" height="1.25rem" />
                                <Skeleton width="40px" height="0.75rem" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="buyer-profile__right-col">
                <div className="buyer-profile__card">
                    <Skeleton width="180px" height="1.5rem" style={{ marginBottom: '8px' }} />
                    <div className="buyer-profile__form-grid">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="buyer-profile__field">
                                <Skeleton width="80px" height="0.8rem" />
                                <Skeleton width="100%" height="40px" variant="rounded" style={{ borderRadius: '8px' }} />
                            </div>
                        ))}
                    </div>
                    <Skeleton width="140px" height="40px" variant="rounded" style={{ borderRadius: '8px', marginTop: '12px' }} />
                </div>
            </div>
        </div>

        <div className="buyer-profile__card">
            <div className="buyer-profile__card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton width="150px" height="1.5rem" />
                <Skeleton width="140px" height="34px" variant="rounded" style={{ borderRadius: '8px' }} />
            </div>
            <div className="buyer-profile__addresses">
                {[1, 2, 3].map(i => (
                    <div key={i} className="buyer-profile__address-card">
                        <div className="buyer-profile__address-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <Skeleton width="60px" height="20px" variant="rounded" style={{ borderRadius: '999px' }} />
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <Skeleton width="24px" height="24px" variant="rounded" style={{ borderRadius: '4px' }} />
                                <Skeleton width="24px" height="24px" variant="rounded" style={{ borderRadius: '4px' }} />
                            </div>
                        </div>
                        <Skeleton width="90%" height="0.85rem" />
                        <Skeleton width="70%" height="0.85rem" />
                        <Skeleton width="50%" height="0.8rem" style={{ marginTop: '4px' }} />
                    </div>
                ))}
            </div>
        </div>

        <div className="buyer-profile__card">
            <div className="buyer-profile__card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton width="160px" height="1.5rem" />
                <Skeleton width="160px" height="34px" variant="rounded" style={{ borderRadius: '8px' }} />
            </div>
            <div className="buyer-profile__payments">
                {[1, 2].map(i => (
                    <div key={i} className="buyer-profile__payment-chip" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Skeleton width="44px" height="44px" variant="rounded" style={{ borderRadius: '8px' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                            <Skeleton width="140px" height="1.1rem" />
                            <Skeleton width="80px" height="0.85rem" />
                        </div>
                        <Skeleton width="24px" height="24px" variant="rounded" style={{ borderRadius: '4px' }} />
                    </div>
                ))}
            </div>
        </div>
    </div>
);
