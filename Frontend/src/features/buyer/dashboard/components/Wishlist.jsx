import React from 'react';
import BuyerDashboard from './BuyerDashboard';
import ProductCard    from '../../../../components/dashboard/ProductCard';
import Pagination     from '../../../../components/dashboard/Pagination';
import EmptyState     from '../../../../components/dashboard/EmptyState';
import { useWishlist } from '../Hooks/useWishlist';
import { WishlistItemSkeleton } from '../../../../components/loaders/ComponentSkeletons';
import Skeleton from '../../../../components/loaders/Skeleton';
import '../style/Wishlist.scss';

const Wishlist = () => {
  const { items, loading, removeItem, moveAllToCart } = useWishlist();

  if (loading) {
    return (
      <BuyerDashboard breadcrumb={['Home', 'Wishlist']}>
        <div className="wishlist">
          <div className="wishlist__header">
            <h1 className="wishlist__title">
              My Wishlist
              <span className="wishlist__count" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '8px' }}>
                <Skeleton width="40px" height="1.2rem" />
              </span>
            </h1>
          </div>
          <div className="wishlist__grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <WishlistItemSkeleton key={i} />
            ))}
          </div>
        </div>
      </BuyerDashboard>
    );
  }

  return (
    <BuyerDashboard breadcrumb={['Home', 'Wishlist']}>
      <div className="wishlist">
        <div className="wishlist__header">
          <h1 className="wishlist__title">
            My Wishlist
            <span className="wishlist__count">{items.length} items</span>
          </h1>
          {items.length > 0 && (
            <button className="wishlist__move-all" onClick={moveAllToCart}>
              <span className="material-symbols-outlined">shopping_cart</span>
              Move All to Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <EmptyState 
            icon="favorite" 
            title="Your wishlist is empty" 
            description="Browse products and add them to your wishlist to see them here."
          />
        ) : (
          <div className="wishlist__grid">
            {items.map(item => (
              <div key={item.name} className="wishlist__item">
                {item.lowStock && (
                  <div className="wishlist__low-stock">
                    <span className="material-symbols-outlined">warning</span>
                    Only {item.stock} left!
                  </div>
                )}
                <ProductCard
                  variant="grid"
                  showBuyerActions
                  isWishlisted
                  badge={item.badge}
                  {...item}
                />
                <button className="wishlist__move-to-cart">
                  <span className="material-symbols-outlined">shopping_cart</span>
                  Move to Cart
                </button>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <Pagination current={1} total={1} from={1} to={items.length} count={items.length} />
        )}
      </div>
    </BuyerDashboard>
  );
};

export default Wishlist;
