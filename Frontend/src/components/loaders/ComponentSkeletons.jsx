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
 */
export const ProductPageSkeleton = () => (
    <div className="product-page-wrapper">
        <div className="pd-page-container">
            <div className="pd-grid">
                <aside className="pd-gallery">
                    <div className="pd-gallery__thumbnails">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Skeleton key={i} width="60px" height="60px" variant="rounded" />
                        ))}
                    </div>
                    <div className="pd-gallery__main">
                        <Skeleton height="100%" variant="rect" />
                    </div>
                </aside>
                <main className="pd-info">
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4 items-center">
                            <Skeleton width="100px" height="1rem" />
                            <Skeleton width="150px" height="1.5rem" variant="rounded" />
                        </div>
                        <Skeleton width="80%" height="3rem" />
                        <Skeleton width="60%" height="1.5rem" />
                        <div className="py-6 border-y border-[rgba(var(--color-rgb-text),0.05)]">
                            <Skeleton width="200px" height="2.5rem" />
                            <Skeleton width="150px" height="1rem" className="mt-2" />
                        </div>
                        <div className="flex flex-col gap-6 mt-4">
                            <div className="flex flex-col gap-2">
                                <Skeleton width="120px" height="1rem" />
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} width="40px" height="40px" variant="circle" />)}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Skeleton width="120px" height="1rem" />
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} width="60px" height="40px" variant="rounded" />)}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-8">
                            <Skeleton width="240px" height="3.5rem" variant="rounded" />
                            <Skeleton width="200px" height="3.5rem" variant="rounded" />
                        </div>
                    </div>
                </main>
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
