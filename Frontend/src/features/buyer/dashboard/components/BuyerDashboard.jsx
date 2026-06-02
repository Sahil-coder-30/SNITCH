import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateFilters } from '../../../store/slice/product.slice';
import { CATEGORIES } from '../../../store/data/products';
import { useAuth } from '../../../../features/auth/Hooks/auth.hooks';
import { useCart } from '../../../cart/hooks/cart.hooks';
import { useWishlist } from '../../../wishlist/hooks/wishlist.hooks';
import '../style/BuyerDashboard.scss';
import '../../../store/style/StoreFront.scss';

// ── Category Icons Mapping ─────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
const BuyerDashboard = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('buyer-sidebar-collapsed');
    return saved !== null ? saved === 'true' : true;
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isLight, setIsLight] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const location  = useLocation();
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const searchTimeoutRef = useRef(null);
  const settingsRef = useRef(null);
  const subnavRef = useRef(null);
  const lastScrollY = useRef(0);
  const subnavAnimating = useRef(false);

  const { filters } = useSelector(state => state.products);
  const { user } = useSelector(state => state.auth);
  const { authFetchCart } = useCart();
  const { authFetchWishlist } = useWishlist();
  const cartCount = useSelector(state => state.cart?.itemCount || 0);
  const wishlistCount = useSelector(state => state.wishlist?.items?.length || 0);
  const { authLogout } = useAuth();
  
  const [animateCart, setAnimateCart] = useState(false);
  const prevCartCount = useRef(cartCount);

  useEffect(() => {
    if (cartCount > prevCartCount.current) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 800);
      return () => clearTimeout(timer);
    }
    prevCartCount.current = cartCount;
  }, [cartCount]);

  const userName = user?.username || 'Guest';

  // Save sidebar collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('buyer-sidebar-collapsed', sidebarCollapsed);
  }, [sidebarCollapsed]);

  // Handle clicking outside the settings popover
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // GSAP-driven scroll-hide for category subnav — animates height+opacity for
  // smooth collapse inside sticky header (no layout thrash, GPU-composited opacity)
  useEffect(() => {
    // Only set up animation when subnav is mounted (home pages only)
    if (!subnavRef.current) return;

    let hidden = false;
    // Capture natural height at mount time
    const naturalHeight = subnavRef.current.scrollHeight || 44;

    const hideSubnav = () => {
      if (hidden || subnavAnimating.current || !subnavRef.current) return;
      hidden = true;
      subnavAnimating.current = true;
      gsap.to(subnavRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
        overwrite: 'auto',
        onComplete: () => {
          subnavAnimating.current = false;
          if (subnavRef.current) subnavRef.current.style.pointerEvents = 'none';
        }
      });
    };

    const showSubnav = () => {
      if (!hidden || subnavAnimating.current || !subnavRef.current) return;
      hidden = false;
      subnavAnimating.current = true;
      subnavRef.current.style.pointerEvents = '';
      gsap.to(subnavRef.current, {
        height: naturalHeight,
        opacity: 1,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
        onComplete: () => { subnavAnimating.current = false; }
      });
    };

    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > 60 && currentY > lastScrollY.current) {
        hideSubnav();
      } else {
        showSubnav();
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Kill any running GSAP tweens on cleanup
      if (subnavRef.current) gsap.killTweensOf(subnavRef.current);
    };
  // Re-run when showCategoryBar changes (subnav mounts/unmounts on navigation)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Sync theme
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

  // Sync cart and wishlist count on load or user change
  useEffect(() => {
    if (user && user.role === 'BUYER') {
      authFetchCart().catch(err => console.error('Error fetching cart:', err));
      authFetchWishlist().catch(err => console.error('Error fetching wishlist:', err));
    }
  }, [user]);

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
    await authLogout();
    navigate('/login');
  };

  // isStorefront: pages that show the global storefront nav (not the inner app-bar)
  const isStorefront = location.pathname === '/' || location.pathname === '/buyer' || location.pathname === '/search' || !user;
  // showCategoryBar: ONLY show the horizontal category subnav on the home/storefront pages (not search)
  const showCategoryBar = location.pathname === '/' || location.pathname === '/buyer' || (!user && location.pathname !== '/search');
  const showSidebar  = true; // Show sidebar on all pages, including storefront
  const pageInfo     = getPageInfo(location.pathname);

  // Dynamic menu items based on whether user is logged in
  const menuItems = [
    { label: 'Home',        icon: 'home',        path: user ? '/buyer' : '/' },
    { label: 'My Cart',     icon: 'shopping_cart',path: user ? '/buyer/cart'    : '/login?redirect=/buyer/cart', badge: user ? cartCount : 0 },
    { label: 'Wishlist',    icon: 'favorite',    path: user ? '/buyer/wishlist' : '/login?redirect=/buyer/wishlist', badge: user ? wishlistCount : 0 },
    ...(user ? [
      { label: 'My Orders',   icon: 'inventory_2', path: '/buyer/orders'   },
      { label: 'My Profile',  icon: 'person',      path: '/buyer/profile'  },
      { label: 'Addresses',   icon: 'location_on', path: '#!'              },
      { label: 'Payments',    icon: 'payments',    path: '#!'              },
    ] : []),
    { label: 'Help Center', icon: 'help',        path: '#!'              },
  ];

  const handleCategoryClick = (catId) => {
    dispatch(updateFilters({ category: catId }));
    const targetPath = user ? '/buyer' : '/';
    if (location.pathname !== targetPath && location.pathname !== '/' && location.pathname !== '/buyer') {
      navigate(targetPath);
    }
  };

  // Sync search state from URL search params or store
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q !== null) {
      setLocalSearch(q);
    } else {
      setLocalSearch(filters.search || '');
    }
  }, [location.search, filters.search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    clearTimeout(searchTimeoutRef.current);
    navigate(`/search?q=${encodeURIComponent(localSearch.trim())}`);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setLocalSearch(val);
    clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      navigate(`/search?q=${encodeURIComponent(val.trim())}`);
    }, 500);
  };

  return (
    <div className={`sf-root buyer-dashboard ${showSidebar ? 'buyer-dashboard--with-sidebar' : ''}`}>

      {/* ── Global Storefront Navbar ── */}
      {/* Renders on all pages on desktop, but only on storefront pages on mobile */}
      <header className={`sf-nav ${!isStorefront ? 'sf-nav--desktop-only' : ''}`} role="banner">
        <div className="sf-nav__inner">
          <div className="sf-nav__left">
            {/* Show hamburger ONLY on storefront pages on mobile */}
            {isStorefront && (
              <button
                className="sf-nav__hamburger"
                onClick={() => setMobileMenuOpen(o => !o)}
                aria-label="Toggle menu"
              >
                <span className="material-symbols-outlined">
                  {mobileMenuOpen ? 'close' : 'menu'}
                </span>
              </button>
            )}
            <Link to="/" className="sf-nav__logo" aria-label="SNITCH Home">
              <span className="sf-nav__logo-text">SNITCH</span>
            </Link>
          </div>

          <form onSubmit={handleSearchSubmit} className="sf-nav__search-wrap">
            <span className="material-symbols-outlined sf-nav__search-icon">search</span>
            <input
              type="text"
              placeholder="Search products..."
              value={localSearch}
              onChange={handleSearchChange}
              className="sf-nav__search"
            />
          </form>

          <nav className="sf-nav__actions" aria-label="User actions">
            {/* Wishlist Button */}
            <Link to={user ? '/buyer/wishlist' : '/login?redirect=/buyer/wishlist'} className="sf-nav__action-btn" id="nav-wishlist-btn" aria-label="Wishlist" title="Wishlist">
              <span className="material-symbols-outlined">favorite</span>
              {wishlistCount > 0 && (
                <span className="sf-nav__cart-badge">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <Link 
              to={user ? '/buyer/cart' : '/login?redirect=/buyer/cart'} 
              className={`sf-nav__action-btn ${animateCart ? 'sf-nav__action-btn--pop' : ''}`} 
              id="nav-cart-btn" 
              aria-label={`Cart (${cartCount})`} 
              title="Cart"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartCount > 0 && (
                <span className={`sf-nav__cart-badge ${animateCart ? 'sf-nav__cart-badge--pop' : ''}`}>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile / Account Button */}
            {user ? (
              <Link to="/buyer/profile" className="sf-nav__action-btn sf-nav__action-btn--profile" id="nav-profile-btn" aria-label="Profile" title="Profile">
                <div className="sf-nav__profile-avatar">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={userName} />
                  ) : (
                    <span className="material-symbols-outlined">person</span>
                  )}
                </div>
                <span className="sf-nav__action-label">{userName}</span>
              </Link>
            ) : (
              <Link to="/login" className="sf-nav__action-btn sf-nav__action-btn--login" id="nav-login-btn" title="Sign In">
                <span className="material-symbols-outlined">login</span>
                <span className="sf-nav__action-label">Sign In</span>
              </Link>
            )}
          </nav>
        </div>

        {/* ── Category Bar — ONLY on home/storefront, NOT on search or inner pages ── */}
        {showCategoryBar && (
          <nav ref={subnavRef} className="sf-subnav" aria-label="Departments">
            <div className="sf-subnav__inner">
              {CATEGORIES.map(cat => {
                const icon = CATEGORY_ICONS[cat.id] || 'label';
                return (
                  <button
                    key={cat.id}
                    className={`sf-subnav__item ${filters.category === cat.id ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(cat.id)}
                  >
                    <span className="sf-subnav__item-icon material-symbols-outlined">{icon}</span>
                    <span className="sf-subnav__item-label">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        )}

        {/* Mobile menu only active on storefront pages */}
        {isStorefront && mobileMenuOpen && (
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
            {user && (
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="sf-nav__mobile-link sf-nav__mobile-link--logout"
              >
                <span className="material-symbols-outlined">logout</span> Logout
              </button>
            )}
          </div>
        )}
      </header>

      {/* ── App Bar — only visible on mobile for inner pages ── */}
      {!isStorefront && (
        <header className="app-bar app-bar--mobile-only" role="banner">
          {/* Mobile: hamburger to toggle sidebar */}
          <button
            className="app-bar__menu-btn"
            onClick={() => setSidebarCollapsed(c => !c)}
            aria-label="Toggle sidebar"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <h1 className="app-bar__title">{pageInfo.title}</h1>
        </header>
      )}

      {/* ── Main Layout ─────────────────────────────────────── */}
      <div className="buyer-dashboard__page-wrap">

        {/* Sidebar — always visible on inner pages, hidden on storefront home */}
        {showSidebar && (
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

            {/* Scrollable middle content */}
            <div className="buyer-sidebar__scrollable">
              {/* Navigation links */}
              <nav className="buyer-sidebar__nav">
                <span className="buyer-sidebar__section-title">Navigation</span>
                {menuItems.map(item => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`buyer-sidebar__link ${location.pathname === item.path ? 'active' : ''}`}
                    title={sidebarCollapsed ? item.label : ''}
                  >
                    <span className="material-symbols-outlined">{item.icon}</span>
                    <span className="buyer-sidebar__link-text">{item.label}</span>
                    {item.badge > 0 && (
                      <span className="buyer-sidebar__badge" style={{
                        marginLeft: 'auto',
                        background: 'var(--color-accent)',
                        color: 'var(--color-bg)',
                        fontSize: '10px',
                        fontWeight: '700',
                        padding: '2px 6px',
                        borderRadius: '10px',
                        lineHeight: '1.2'
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>

              {/* Sidebar Categories List */}
              <div className="buyer-sidebar__section buyer-sidebar__categories-section">
                <span className="buyer-sidebar__section-title">Categories</span>
                <div className="buyer-sidebar__categories">
                  {CATEGORIES.map(cat => {
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

            {/* Sidebar Footer with interactive settings button */}
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
                <div className={`buyer-sidebar__settings-popover ${sidebarCollapsed ? 'buyer-sidebar__settings-popover--collapsed' : ''}`}>
                  {/* User Profile Info */}
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

                  {/* Theme Toggle (Sliding Switch Button) */}
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

                  {/* Navigation / Action links inside settings */}
                  <div className="settings-popover__actions">
                    {user ? (
                      <>
                        <Link
                          to="/buyer/profile"
                          className="settings-popover__link"
                          onClick={() => setSettingsOpen(false)}
                        >
                          <span className="material-symbols-outlined">manage_accounts</span>
                          View Profile
                        </Link>
                        <button
                          onClick={() => { handleLogout(); setSettingsOpen(false); }}
                          className="settings-popover__logout-btn"
                        >
                          <span className="material-symbols-outlined">logout</span>
                          Log Out
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/login"
                        className="settings-popover__login-btn"
                        onClick={() => setSettingsOpen(false)}
                      >
                        <span className="material-symbols-outlined">login</span>
                        Sign In / Register
                      </Link>
                    )}
                  </div>
                </div>
              )}
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
