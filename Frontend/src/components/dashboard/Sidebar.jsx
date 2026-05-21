import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/Hooks/auth.hooks';
import './Sidebar.scss';

const SellerNav = [
  { icon: 'dashboard',          label: 'Overview',            path: '/seller',              active: true },
  { icon: 'checkroom',          label: 'My Products',         path: '/seller/products' },
  { icon: 'add_circle',         label: 'Create Product',      path: '/seller/products/new', cta: true },
  { icon: 'inventory_2',        label: 'Orders',              path: '/seller/orders' },
  { icon: 'chat_bubble',        label: 'Messages',            path: '/seller/messages',     badge: 3 },
  { icon: 'payments',           label: 'Earnings & Payouts',  path: '/seller/earnings' },
  { icon: 'star',               label: 'Reviews & Ratings',   path: '/seller/reviews' },
  { icon: 'campaign',           label: 'Promotions',          path: '/seller/promotions' },
  { icon: 'store',              label: 'Store Settings',      path: '/seller/settings' },
  { icon: 'notifications',      label: 'Notifications',       path: '/seller/notifications', badge: 5 },
];

const BuyerNav = [
  { icon: 'home',               label: 'Browse Products',     path: '/buyer',               active: true },
  { icon: 'inventory_2',        label: 'My Orders',           path: '/buyer/orders' },
  { icon: 'favorite',           label: 'Wishlist',            path: '/buyer/wishlist',       badge: 12 },
  { icon: 'shopping_cart',      label: 'My Cart',             path: '/buyer/cart',           badge: 3 },
  { icon: 'person',             label: 'My Profile',          path: '/buyer/profile' },
  { icon: 'location_on',        label: 'Saved Addresses',     path: '/buyer/addresses' },
  { icon: 'credit_card',        label: 'Payment Methods',     path: '/buyer/payments' },
  { icon: 'star',               label: 'My Reviews',          path: '/buyer/reviews' },
  { icon: 'notifications',      label: 'Notifications',       path: '/buyer/notifications' },
];

const Sidebar = ({ role = 'seller' }) => {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') return window.innerWidth < 1024;
    return false;
  });
  const navItems = role === 'seller' ? SellerNav : BuyerNav;
  const userName  = role === 'seller' ? 'Arjun Mehta'  : 'Priya Sharma';
  const roleLabel = role === 'seller' ? 'Seller Account' : 'Buyer Account';

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { authLogout } = useAuth();

  const handleLogout = async () => {
    await authLogout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Brand */}
      <div className="sidebar__brand">
        <span className="sidebar__brand-logo">SNITCH</span>
        <button
          className="sidebar__collapse-btn material-symbols-outlined"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? 'menu_open' : 'menu'}
        </button>
      </div>

      {/* User Identity */}
      <div className="sidebar__user">
        <div className="sidebar__avatar">
          <span className="sidebar__avatar-initials">
            {userName.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        {!collapsed && (
          <div className="sidebar__user-info">
            <span className="sidebar__user-name">{userName}</span>
            <span className="sidebar__user-role">{roleLabel}</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        {!collapsed && <span className="sidebar__nav-label">Navigation</span>}
        <ul className="sidebar__nav-list">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.path}
                className={`sidebar__nav-item ${item.active ? 'sidebar__nav-item--active' : ''} ${item.cta ? 'sidebar__nav-item--cta' : ''}`}
                title={collapsed ? item.label : ''}
              >
                <span className="material-symbols-outlined sidebar__nav-icon">{item.icon}</span>
                {!collapsed && <span className="sidebar__nav-text">{item.label}</span>}
                {!collapsed && item.badge && (
                  <span className="sidebar__badge">{item.badge}</span>
                )}
                {collapsed && item.badge && (
                  <span className="sidebar__badge sidebar__badge--dot" />
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      
      <div className="sidebar__footer">
        <button
          onClick={handleLogout}
          className="sidebar__signout-btn"
          title={collapsed ? 'Sign Out' : ''}
        >
          <span className="material-symbols-outlined sidebar__nav-icon">logout</span>
          <span className="sidebar__signout-label">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
