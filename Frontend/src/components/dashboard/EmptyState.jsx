import React from 'react';
import './EmptyState.scss';

const configs = {
  orders: {
    icon: 'inventory_2',
    title: 'No orders yet',
    desc: "When you receive orders, they'll appear here.",
    cta: null,
  },
  products: {
    icon: 'checkroom',
    title: 'No products listed',
    desc: 'Start adding products to your store and reach buyers.',
    cta: { label: '+ Create New Product', href: '/seller/products/new' },
  },
  cart: {
    icon: 'shopping_cart',
    title: 'Your cart is empty',
    desc: 'Browse our collections and add items to your cart.',
    cta: { label: 'Browse Products', href: '/buyer' },
  },
  wishlist: {
    icon: 'favorite',
    title: 'Your wishlist is empty',
    desc: 'Save items you love and come back to them anytime.',
    cta: { label: 'Explore Collection', href: '/buyer' },
  },
  search: {
    icon: 'search_off',
    title: 'No results found',
    desc: 'Try adjusting your filters or search terms.',
    cta: null,
  },
};

const EmptyState = ({ type = 'orders' }) => {
  const { icon, title, desc, cta } = configs[type] || configs.orders;

  return (
    <div className="empty-state">
      <div className="empty-state__icon-wrap">
        <span className="material-symbols-outlined empty-state__icon">{icon}</span>
      </div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__desc">{desc}</p>
      {cta && (
        <a href={cta.href} className="empty-state__cta">{cta.label}</a>
      )}
    </div>
  );
};

export default EmptyState;
