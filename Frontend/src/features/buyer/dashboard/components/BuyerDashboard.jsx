import React, { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateFilters } from '../../../store/slice/product.slice';
import ThemeToggle from '../../../../components/ThemeToggle/ThemeToggle';
import { useAuth } from '../../../../features/auth/Hooks/auth.hooks';
import '../style/BuyerDashboard.scss';
import '../../../store/style/StoreFront.scss';

// ── Page metadata for app-bar ─────────────────────────────────
const PAGE_CONFIG = {
  '/buyer/cart':          { title: 'My Cart',         back: '/buyer'          },
  '/buyer/orders':        { title: 'My Orders',        back: '/buyer'          },
  '/buyer/wishlist':      { title: 'Wishlist',          back: '/buyer'          },
  '/buyer/profile':       { title: 'My Profile',       back: '/buyer'          },
  '/buyer/all-orders':    { title: 'All Orders',       back: '/buyer/orders'   },
  '/buyer/return':        { title: 'Return Request',   back: '/buyer/orders'   },
  '/buyer/review':        { title: 'Write a Review',   back: '/buyer/orders'   },
  '/buyer/refund-status': { title: 'Refund Status',    back: '/buyer/orders'   },
};

const getPageInfo = (pathname) => {
  if (PAGE_CONFIG[pathname]) return PAGE_CONFIG[pathname];
  if (pathname.startsWith('/buyer/orders/')) return { title: 'Order Details',  back: '/buyer/orders' };
  if (pathname.startsWith('/buyer/track/'))  return { title: 'Track Order',    back: '/buyer/orders' };
  return { title: 'My Account', back: '/buyer' };
};

// Sidebar shows on every inner page (anything except the storefront home)

// ─────────────────────────────────────────────────────────────
const BuyerDashboard = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location  = useLocation();
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const searchTimeoutRef = useRef(null);
  const { filters } = useSelector(state => state.products);
  const cartCount = 3;
  const { authLogout } = useAuth();

  const handleLogout = async () => {
    await authLogout();
    navigate('/login');
  };

  const isStorefront = location.pathname === '/buyer';
  const showSidebar  = !isStorefront;           // sidebar on all inner pages
  const pageInfo     = getPageInfo(location.pathname);

  const menuItems = [
    { label: 'Home',        icon: 'home',        path: '/buyer'          },
    { label: 'My Cart',     icon: 'shopping_cart',path: '/buyer/cart'     },
    { label: 'My Orders',   icon: 'inventory_2', path: '/buyer/orders'   },
    { label: 'Wishlist',    icon: 'favorite',    path: '/buyer/wishlist' },
    { label: 'My Profile',  icon: 'person',      path: '/buyer/profile'  },
    { label: 'Addresses',   icon: 'location_on', path: '#!'              },
    { label: 'Payments',    icon: 'payments',    path: '#!'              },
    { label: 'Help Center', icon: 'help',        path: '#!'              },
  ];

  const handleSearchChange = (e) => {
    const val = e.target.value;
    clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      dispatch(updateFilters({ search: val }));
    }, 500);
  };

  return (
    <div className={`sf-root buyer-dashboard ${showSidebar ? 'buyer-dashboard--with-sidebar' : ''}`}>

      {isStorefront ? (
        /* ── Storefront Navbar — only on /buyer ──────────────── */
        <header className="sf-nav" role="banner">
          <div className="sf-nav__inner">
            <div className="sf-nav__left">
              <button
                className="sf-nav__hamburger"
                onClick={() => setMobileMenuOpen(o => !o)}
                aria-label="Toggle menu"
              >
                <span className="material-symbols-outlined">
                  {mobileMenuOpen ? 'close' : 'menu'}
                </span>
              </button>
              <Link to="/" className="sf-nav__logo" aria-label="SNITCH Home">
                <span className="sf-nav__logo-text">SNITCH</span>
              </Link>
            </div>

            <div className="sf-nav__search-wrap">
              <span className="material-symbols-outlined sf-nav__search-icon">search</span>
              <input
                id="global-search"
                type="search"
                className="sf-nav__search"
                placeholder="Search for products, brands and more…"
                aria-label="Search products"
                onChange={handleSearchChange}
              />
            </div>

            <nav className="sf-nav__actions" aria-label="User actions">
              <ThemeToggle className="sf-nav__theme-btn" />
              <Link to="/buyer/profile" className="sf-nav__action-btn" id="nav-profile-btn">
                <span className="material-symbols-outlined">person</span>
                <span className="sf-nav__action-label">Profile</span>
              </Link>
              <Link to="/buyer/cart" className="sf-nav__action-btn" id="nav-cart-btn" aria-label={`Cart (${cartCount})`}>
                <span className="material-symbols-outlined">shopping_cart</span>
                <span className="sf-nav__action-label">Cart</span>
                {cartCount > 0 && <span className="sf-nav__cart-badge">{cartCount}</span>}
              </Link>
            </nav>
          </div>

          {mobileMenuOpen && (
            <div className="sf-nav__mobile-menu">
              {menuItems.map(item => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="sf-nav__mobile-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="material-symbols-outlined">{item.icon}</span> {item.label}
                </Link>
              ))}
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="sf-nav__mobile-link sf-nav__mobile-link--logout"
              >
                <span className="material-symbols-outlined">logout</span> Logout
              </button>
            </div>
          )}
        </header>
      ) : (
        /* ── App Bar — all inner pages ──────────────────────── */
        <header className="app-bar" role="banner">
          {/* Mobile: hamburger to toggle sidebar */}
          <button
            className="app-bar__menu-btn"
            onClick={() => setSidebarCollapsed(c => !c)}
            aria-label="Toggle sidebar"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <h1 className="app-bar__title">{pageInfo.title}</h1>

          <div className="app-bar__actions">
            <ThemeToggle />
          </div>
        </header>
      )}

      {/* ── Main Layout ─────────────────────────────────────── */}
      <div className="buyer-dashboard__page-wrap">

        {/* Sidebar — always visible on inner pages, hidden on storefront home */}
        {showSidebar && (
          <aside className={`buyer-sidebar ${sidebarCollapsed ? 'buyer-sidebar--collapsed' : ''}`}>
            <div className="buyer-sidebar__header">
              {!sidebarCollapsed && <span className="buyer-sidebar__title">SNITCH</span>}
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

            <nav className="buyer-sidebar__nav">
              {menuItems.map(item => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`buyer-sidebar__link ${location.pathname === item.path ? 'active' : ''}`}
                  title={sidebarCollapsed ? item.label : ''}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  {!sidebarCollapsed && <span className="buyer-sidebar__link-text">{item.label}</span>}
                </Link>
              ))}
            </nav>

            <div className="buyer-sidebar__footer">
              <button
                onClick={handleLogout}
                className="buyer-sidebar__signout-btn"
                title={sidebarCollapsed ? 'Sign Out' : ''}
              >
                <span className="material-symbols-outlined">logout</span>
                <span className="buyer-sidebar__signout-label">Sign Out</span>
              </button>
            </div>
          </aside>
        )}

        <main className={`buyer-dashboard__main-content ${showSidebar ? 'buyer-dashboard__main-content--has-sidebar' : ''} ${sidebarCollapsed ? 'buyer-dashboard__main-content--collapsed' : ''}`}>
          <div className="buyer-dashboard__container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BuyerDashboard;
