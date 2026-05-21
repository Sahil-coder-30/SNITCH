import React from 'react';
import SellerDashboard from './SellerDashboard';
import ProductCard     from '../../../../components/dashboard/ProductCard';
import Pagination      from '../../../../components/dashboard/Pagination';
import EmptyState      from '../../../../components/dashboard/EmptyState';
import { useSellerProducts } from '../Hooks/useSellerProducts';
import '../style/SellerProducts.scss';

const SellerProducts = () => {
  const { products, loading, viewMode, setViewMode } = useSellerProducts();

  return (
    <SellerDashboard breadcrumb={['Dashboard', 'My Products']}>
      <div className="seller-products">

        <div className="seller-products__topbar">
          <h1 className="seller-products__title">My Products <span className="seller-products__count">({products.length})</span></h1>
          <div className="seller-products__controls">
            <div className="seller-products__search">
              <span className="material-symbols-outlined">search</span>
              <input type="text" placeholder="Search products..." readOnly />
            </div>
            
            <a href="/seller/products/new" className="seller-products__cta">
              <span className="material-symbols-outlined">add</span>
              Create New Product
            </a>
          </div>
        </div>

        {products.length > 0 ? (
          <div className={`${viewMode === 'grid' ? 'seller-products__grid' : 'seller-products__list'}`}>
            {products.map(p => (
              <ProductCard key={p.name} variant={viewMode} {...p} />
            ))}
          </div>
        ) : (
          <EmptyState 
            icon="inventory_2" 
            title="No products yet" 
            action={{ label: 'Add First Product', link: '/seller/products/new' }}
          />
        )}

        {products.length > 0 && <Pagination current={1} total={1} from={0} to={0} count={0} />}
      </div>
    </SellerDashboard>
  );
};


export default SellerProducts;
