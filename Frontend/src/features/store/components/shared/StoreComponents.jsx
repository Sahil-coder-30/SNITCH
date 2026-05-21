import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, Button } from '../../../../components/common/UI';
import { ProductCardSkeleton } from '../../../../components/common/Feedback';
import './style/store-shared.scss';

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) return null;

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <Card 
      hoverable 
      className="sn-product-card" 
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="sn-product-card__image-wrap">
        <img src={product.image} alt={product.name} className="sn-product-card__image" loading="lazy" />
        
        {discount > 0 && <Badge variant="error" className="sn-product-card__discount">-{discount}%</Badge>}
        
        <button 
          className={`sn-product-card__wishlist ${isWishlisted ? 'is-active' : ''}`}
          onClick={(e) => { e.stopPropagation(); setIsWishlisted(!isWishlisted); }}
        >
          <span className="material-symbols-outlined">{isWishlisted ? 'favorite' : 'favorite'}</span>
        </button>

        <div className="sn-product-card__quick-add">
          <Button variant="primary" size="sm" icon="add_shopping_cart">Quick Add</Button>
        </div>
      </div>

      <div className="sn-product-card__info">
        <p className="sn-product-card__brand">{product.brand}</p>
        <h3 className="sn-product-card__name">{product.name}</h3>
        
        <div className="sn-product-card__price-row">
          <span className="sn-product-card__price">₹{product.price?.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span className="sn-product-card__original">₹{product.originalPrice?.toLocaleString()}</span>
          )}
        </div>

        <div className="sn-product-card__footer">
          <div className="sn-product-card__rating">
            <span className="material-symbols-outlined">star</span>
            <span>{product.rating || '4.5'}</span>
            <span className="sn-product-card__reviews">({product.reviewCount || 0})</span>
          </div>
          {product.inStock ? (
            <span className="sn-product-card__stock is-in">In Stock</span>
          ) : (
            <span className="sn-product-card__stock is-out">Out of Stock</span>
          )}
        </div>
      </div>
    </Card>
  );
};

export const ProductGrid = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="sn-product-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="sn-empty-state">
        <span className="material-symbols-outlined">inventory_2</span>
        <h3>No products found</h3>
        <p>We couldn't find any products matching your selection.</p>
      </div>
    );
  }

  return (
    <div className="sn-product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export const FilterSidebar = ({ categories, selectedCategory, onCategoryChange, priceRange, onPriceChange }) => {
  return (
    <aside className="sn-filter-sidebar">
      <div className="sn-filter-section">
        <h4 className="sn-filter-title">Categories</h4>
        <div className="sn-filter-list">
          {categories?.map(cat => (
            <button 
              key={cat.id} 
              className={`sn-filter-item ${selectedCategory === cat.id ? 'is-active' : ''}`}
              onClick={() => onCategoryChange(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="sn-filter-section">
        <h4 className="sn-filter-title">Price Range</h4>
        <div className="sn-price-range">
          <input 
            type="range" 
            min="0" 
            max="10000" 
            step="500"
            value={priceRange[1]} 
            onChange={(e) => onPriceChange([0, parseInt(e.target.value)])}
          />
          <div className="sn-price-labels">
            <span>₹0</span>
            <span>₹{priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="sn-filter-section">
        <h4 className="sn-filter-title">Customer Ratings</h4>
        <div className="sn-filter-list">
          {[4, 3, 2].map(star => (
            <label key={star} className="sn-filter-checkbox">
              <input type="checkbox" />
              <span>{star} Stars & Up</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};
