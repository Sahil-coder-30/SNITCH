import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/Hooks/auth.hooks';
import { updateFilters } from '../../store/slice/product.slice';
import { CATEGORIES } from '../../store/data/products';

// Import sidebars' stylesheets
import '../../buyer/dashboard/style/BuyerDashboard.scss';
import '../../../components/dashboard/Sidebar.scss';

// ── Category Icons Mapping (Buyer) ─────────────────────────────
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

// ── Seller Navigation Menu ─────────────────────────────────────
const SELLER_NAV = [
  { icon: 'dashboard',          label: 'Overview',            path: '/seller' },
  { icon: 'checkroom',          label: 'My Products',         path: '/seller/products' },
  { icon: 'menu_book',          label: 'Style Passbook',      path: '/seller/style-passbook' },
  { icon: 'add_circle',         label: 'Create Product',      path: '/seller/products/new', cta: true },
  { icon: 'inventory_2',        label: 'Orders',              path: '/seller/orders' },
  { icon: 'view_carousel',      label: 'Manage Banners',      path: '/admin/banners' },
  { icon: 'chat_bubble',        label: 'Messages',            path: '/seller/messages',     badge: 3 },
  { icon: 'payments',           label: 'Earnings & Payouts',  path: '/seller/earnings' },
  { icon: 'star',               label: 'Reviews & Ratings',   path: '/seller/reviews' },
  { icon: 'campaign',           label: 'Promotions',          path: '/seller/promotions' },
  { icon: 'person',             label: 'My Profile',          path: '/seller/profile' },
  { icon: 'store',              label: 'Store Settings',      path: '/seller/settings' },
  { icon: 'notifications',      label: 'Notifications',       path: '/seller/notifications', badge: 5 },
];

const Sidebar = ({ sidebarCollapsed, setSidebarCollapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);
  const role = user?.role; // 'BUYER' | 'SELLER' | undefined

  const cartCount = useSelector((state) => state.cart?.itemCount || 0);
  const wishlistCount = useSelector((state) => state.wishlist?.items?.length || 0);
  const { filters } = useSelector((state) => state.products || { filters: { category: 'all' } });

  const { authLogout } = useAuth();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isLight, setIsLight] = useState(false);
  const settingsRef = useRef(null);

  const userName = user?.username || 'Guest';

  // Click outside settings popover (Buyer)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Theme Sync on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
      setIsLight(true);
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      setIsLight(false);
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  const toggleTheme = () => {
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
      setIsLight(false);
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      setIsLight(true);
    }
  };

  const handleLogout = async () => {
    try {
      await authLogout();
      setSettingsOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleCategoryClick = (catId) => {
    dispatch(updateFilters({ category: catId }));
    const targetPath = user ? '/buyer' : '/';
    if (location.pathname !== targetPath && location.pathname !== '/' && location.pathname !== '/buyer') {
      navigate(targetPath);
    }
  };

  // ── SELLER VIEW ────────────────────────────────────────────────────────────
  if (role === 'SELLER') {
    const roleLabel = 'Seller Account';
    const navItems = SELLER_NAV.map((item) => ({
      ...item,
      active: location.pathname === item.path,
    }));

    return (
      <aside className={`sidebar ${sidebarCollapsed ? 'sidebar--collapsed' : ''}`}>
        {/* Brand */}
        <div className="sidebar__brand">
          <span className="sidebar__brand-logo">SNITCH</span>
          <button
            className="sidebar__collapse-btn material-symbols-outlined"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? 'menu_open' : 'menu'}
          </button>
        </div>

        {/* User Identity */}
        <div className="sidebar__user">
          <div className="sidebar__avatar">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={userName} className="sidebar__avatar-img" />
            ) : (
              <span className="sidebar__avatar-initials">
                {userName
                  .split(' ')
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </span>
            )}
          </div>
          <div className="sidebar__user-info">
            <span className="sidebar__user-name">{userName}</span>
            <span className="sidebar__user-role">{roleLabel}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav">
          <span className="sidebar__nav-label">Navigation</span>
          <ul className="sidebar__nav-list">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className={`sidebar__nav-item ${item.active ? 'sidebar__nav-item--active' : ''} ${
                    item.cta ? 'sidebar__nav-item--cta' : ''
                  }`}
                  title={sidebarCollapsed ? item.label : ''}
                >
                  <span className="material-symbols-outlined sidebar__nav-icon">{item.icon}</span>
                  <span className="sidebar__nav-text">{item.label}</span>
                  {item.badge && (
                    <>
                      <span className="sidebar__badge">{item.badge}</span>
                      <span className="sidebar__badge sidebar__badge--dot" />
                    </>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Footer */}
        <div className="sidebar__footer">
          <button onClick={handleLogout} className="sidebar__signout-btn" title={sidebarCollapsed ? 'Sign Out' : ''}>
            <span className="material-symbols-outlined sidebar__nav-icon">logout</span>
            <span className="sidebar__signout-label">Sign Out</span>
          </button>
        </div>
      </aside>
    );
  }

  // ── BUYER / GUEST VIEW ──────────────────────────────────────────────────────
  const menuItems = [
    { label: 'Home', icon: 'home', path: user ? '/buyer' : '/' },
    { label: 'My Cart', icon: 'shopping_cart', path: user ? '/buyer/cart' : '/login?redirect=/buyer/cart', badge: user ? cartCount : 0 },
    { label: 'Wishlist', icon: 'favorite', path: user ? '/buyer/wishlist' : '/login?redirect=/buyer/wishlist', badge: user ? wishlistCount : 0 },
    ...(user ? [
      { label: 'My Orders', icon: 'inventory_2', path: '/buyer/orders' },
      { label: 'My Profile', icon: 'person', path: '/buyer/profile' },
      { label: 'Addresses', icon: 'location_on', path: '#!' },
      { label: 'Payments', icon: 'payments', path: '#!' },
    ] : []),
    { label: 'Help Center', icon: 'help', path: '#!' },
  ];

  return (
    <aside className={`buyer-sidebar ${sidebarCollapsed ? 'buyer-sidebar--collapsed' : ''}`}>
      <div className="buyer-sidebar__header">
        <span className="buyer-sidebar__title">SNITCH</span>
        <button
          className="buyer-sidebar__toggle"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="material-symbols-outlined">
            {sidebarCollapsed ? 'menu' : 'keyboard_double_arrow_left'}
          </span>
        </button>
      </div>

      <div className="buyer-sidebar__scrollable">
        {/* Navigation Section */}
        <nav className="buyer-sidebar__nav">
          <span className="buyer-sidebar__section-title">Navigation</span>
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`buyer-sidebar__link ${location.pathname === item.path ? 'active' : ''}`}
              title={sidebarCollapsed ? item.label : ''}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="buyer-sidebar__link-text">{item.label}</span>
              {item.badge > 0 && (
                <span
                  className="buyer-sidebar__badge"
                  style={{
                    marginLeft: 'auto',
                    background: 'var(--color-accent)',
                    color: 'var(--color-bg)',
                    fontSize: '10px',
                    fontWeight: '700',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    lineHeight: '1.2'
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Categories Section */}
        <div className="buyer-sidebar__section buyer-sidebar__categories-section">
          <span className="buyer-sidebar__section-title">Categories</span>
          <div className="buyer-sidebar__categories">
            {CATEGORIES.map((cat) => {
              const isActive = filters.category === cat.id;
              const icon = CATEGORY_ICONS[cat.id] || 'label';
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`buyer-sidebar__category-btn ${isActive ? 'active' : ''}`}
                  title={sidebarCollapsed ? cat.label : ''}
                >
                  <span className="material-symbols-outlined">{icon}</span>
                  <span className="buyer-sidebar__category-label">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Settings */}
      <div className="buyer-sidebar__footer" ref={settingsRef}>
        <button
          className={`buyer-sidebar__settings-btn ${settingsOpen ? 'active' : ''}`}
          onClick={() => setSettingsOpen(!settingsOpen)}
          aria-label="Settings"
          title={sidebarCollapsed ? 'Settings' : ''}
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="buyer-sidebar__settings-label">Settings</span>
        </button>

        {settingsOpen && (
          <div
            className={`buyer-sidebar__settings-popover ${
              sidebarCollapsed ? 'buyer-sidebar__settings-popover--collapsed' : ''
            }`}
          >
            <div className="settings-popover__profile">
              <div className="settings-popover__avatar">
                {user ? (
                  user.profilePicture ? (
                    <img src={user.profilePicture} alt={userName} />
                  ) : (
                    <span className="material-symbols-outlined">person</span>
                  )
                ) : (
                  <span className="material-symbols-outlined">account_circle</span>
                )}
              </div>
              <div className="settings-popover__info">
                <p className="settings-popover__name">{userName}</p>
                <p className="settings-popover__role">
                  {user ? user.email || 'Buyer Account' : 'Guest Account'}
                </p>
              </div>
            </div>

            <hr className="settings-popover__divider" />

            {/* Dark/Light mode switch */}
            <div className="settings-popover__theme">
              <span className="material-symbols-outlined">
                {isLight ? 'light_mode' : 'dark_mode'}
              </span>
              <span className="settings-popover__theme-label">Light Mode</span>
              <button
                className={`settings-popover__switch ${isLight ? 'settings-popover__switch--active' : ''}`}
                onClick={toggleTheme}
                aria-label="Toggle dark/light theme"
                type="button"
              >
                <span className="settings-popover__switch-handle" />
              </button>
            </div>

            <hr className="settings-popover__divider" />

            <div className="settings-popover__actions">
              {user ? (
                <>
                  <Link to="/buyer/profile" className="settings-popover__link" onClick={() => setSettingsOpen(false)}>
                    <span className="material-symbols-outlined">manage_accounts</span>
                    View Profile
                  </Link>
                  <button onClick={handleLogout} className="settings-popover__logout-btn">
                    <span className="material-symbols-outlined">logout</span>
                    Log Out
                  </button>
                </>
              ) : (
                <Link to="/login" className="settings-popover__login-btn" onClick={() => setSettingsOpen(false)}>
                  <span className="material-symbols-outlined">login</span>
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
