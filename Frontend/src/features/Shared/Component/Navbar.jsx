import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '../../auth/Hooks/auth.hooks';
import { updateFilters } from '../../store/slice/product.slice';
import { CATEGORIES } from '../../store/data/products';
import ThemeToggle from '../../../components/ThemeToggle/ThemeToggle';
import './Navbar.scss';

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

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) => state.cart?.itemCount || 0);
  const wishlistCount = useSelector((state) => state.wishlist?.items?.length || 0);
  const { filters } = useSelector((state) => state.products || { filters: { category: 'all', search: '' } });

  const { authLogout } = useAuth();

  const [localSearch, setLocalSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const subnavRef = useRef(null);
  const lastScrollY = useRef(0);
  const subnavAnimating = useRef(false);

  const role = user?.role || 'GUEST';
  const userName = user?.username || 'Guest';

  // Sync search state from URL or Redux
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q !== null) {
      setLocalSearch(q);
    } else {
      setLocalSearch(filters.search || '');
    }
  }, [location.search, filters.search]);

  // Click outside listener for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // GSAP-driven scroll-hide for category subnav
  useEffect(() => {
    if (!subnavRef.current) return;

    let hidden = false;
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
      if (subnavRef.current) gsap.killTweensOf(subnavRef.current);
    };
  }, [location.pathname]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await authLogout();
      setDropdownOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setLocalSearch(val);
    clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      navigate(`/search?q=${encodeURIComponent(val.trim())}`);
    }, 500);
  };

  // Handle Search Submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    clearTimeout(searchTimeoutRef.current);
    navigate(`/search?q=${encodeURIComponent(localSearch.trim())}`);
  };

  // Handle Category Clicks
  const handleCategoryClick = (catId) => {
    dispatch(updateFilters({ category: catId }));
    const targetPath = user ? '/buyer' : '/';
    if (location.pathname !== targetPath && location.pathname !== '/' && location.pathname !== '/buyer') {
      navigate(targetPath);
    }
  };

  // Dynamic Breadcrumb Generator (Seller role)
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const crumbs = [];

    // Map segments to friendly labels
    const friendlyNames = {
      seller: 'Dashboard',
      products: 'Products',
      new: 'Create Product',
      orders: 'Orders',
      earnings: 'Earnings',
      profile: 'My Profile',
      'style-passbook': 'Style Passbook',
      admin: 'Dashboard',
      banners: 'Admin Banners'
    };

    pathSegments.forEach((segment, idx) => {
      // Skip ID parameters in path for breadcrumb labels
      if (segment.match(/^[a-fA-F0-9]{24}$/) || !isNaN(segment)) {
        crumbs.push('Details');
        return;
      }
      crumbs.push(friendlyNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1));
    });

    if (crumbs.length === 1 && crumbs[0] === 'Dashboard') {
      crumbs.push('Overview');
    }

    return crumbs;
  };

  const showCategoryBar =
    (location.pathname === '/' || location.pathname === '/buyer' || (!user && location.pathname !== '/search')) &&
    role !== 'SELLER';

  // ── SELLER VIEW ─────────────────────────────────────────────────────────────
  if (role === 'SELLER') {
    const breadcrumbs = getBreadcrumbs();
    return (
      <header className="shared-navbar" role="banner">
        <div className="shared-navbar__inner">
          {/* Brand & Breadcrumbs */}
          <div className="shared-navbar__left">
            <Link to="/seller" className="shared-navbar__logo" aria-label="SNITCH Seller Home">
              <span className="shared-navbar__logo-text">SNITCH</span>
              <span className="shared-navbar__logo-badge">Seller</span>
            </Link>
            <nav className="shared-navbar__breadcrumb" aria-label="breadcrumb">
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="shared-navbar__breadcrumb-group">
                  <span
                    className={`shared-navbar__breadcrumb-item ${
                      i === breadcrumbs.length - 1 ? 'shared-navbar__breadcrumb-item--active' : ''
                    }`}
                  >
                    {crumb}
                  </span>
                  {i < breadcrumbs.length - 1 && (
                    <span className="material-symbols-outlined shared-navbar__breadcrumb-sep">chevron_right</span>
                  )}
                </span>
              ))}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="shared-navbar__right">

            {/* Notifications */}
            <button className="shared-navbar__action-btn" aria-label="Notifications" title="Notifications">
              <span className="material-symbols-outlined">notifications</span>
              <span className="shared-navbar__cart-badge">5</span>
            </button>

            {/* Profile Menu */}
            <div className="shared-navbar__avatar-wrapper" ref={dropdownRef}>
              <button
                className="shared-navbar__avatar"
                onClick={() => setDropdownOpen((prev) => !prev)}
                aria-label="Profile menu"
                aria-expanded={dropdownOpen}
              >
                <div className="shared-navbar__avatar-img-box">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={userName} />
                  ) : (
                    <span className="material-symbols-outlined">person</span>
                  )}
                </div>
                <span className="shared-navbar__action-label">{userName}</span>
                <span className="material-symbols-outlined shared-navbar__avatar-caret">
                  {dropdownOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {dropdownOpen && (
                <div className="shared-navbar__dropdown">
                  <div className="shared-navbar__dropdown-header">
                    <span className="shared-navbar__dropdown-name">{userName}</span>
                    <span className="shared-navbar__dropdown-role">Seller Panel</span>
                  </div>
                  <Link to="/seller/profile" className="shared-navbar__dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <span className="material-symbols-outlined">person</span>
                    My Profile
                  </Link>
                  <Link to="/seller/products" className="shared-navbar__dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <span className="material-symbols-outlined">inventory</span>
                    My Listings
                  </Link>
                  <div style={{ height: '1px', background: 'var(--color-border)', margin: '4px 0' }} />
                  <div className="shared-navbar__dropdown-theme-row">
                    <span className="material-symbols-outlined">palette</span>
                    <span className="shared-navbar__dropdown-theme-label">Appearance</span>
                    <ThemeToggle className="shared-navbar__dropdown-theme-toggle" />
                  </div>
                  <div style={{ height: '1px', background: 'var(--color-border)', margin: '4px 0' }} />
                  <button onClick={handleLogout} className="shared-navbar__dropdown-item shared-navbar__dropdown-item--danger">
                    <span className="material-symbols-outlined">logout</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
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
    ] : []),
  ];

  return (
    <>
      <header className="shared-navbar" role="banner">
        <div className="shared-navbar__inner">
          {/* Logo & Mobile Hamburger */}
          <div className="shared-navbar__left">
            <button
              className="shared-navbar__hamburger"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
            <Link to={user ? '/buyer' : '/'} className="shared-navbar__logo" aria-label="SNITCH Home">
              <span className="shared-navbar__logo-text">SNITCH</span>
            </Link>
          </div>

          {/* Search bar */}
          <div className="shared-navbar__center">
            <form onSubmit={handleSearchSubmit} className="shared-navbar__search-wrap">
              <span className="material-symbols-outlined shared-navbar__search-icon">search</span>
              <input
                type="text"
                placeholder="Search premium products..."
                value={localSearch}
                onChange={handleSearchChange}
                className="shared-navbar__search"
                aria-label="Search items"
              />
            </form>
          </div>

          {/* Actions */}
          <div className="shared-navbar__right">
            {/* Wishlist */}
            <Link
              to={user ? '/buyer/wishlist' : '/login?redirect=/buyer/wishlist'}
              className="shared-navbar__action-btn"
              id="nav-wishlist-btn"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <span className="material-symbols-outlined">favorite</span>
              {wishlistCount > 0 && (
                <span className="shared-navbar__cart-badge">{wishlistCount}</span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to={user ? '/buyer/cart' : '/login?redirect=/buyer/cart'}
              className="shared-navbar__action-btn"
              id="nav-cart-btn"
              aria-label="Cart"
              title="Cart"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartCount > 0 && (
                <span className="shared-navbar__cart-badge">{cartCount}</span>
              )}
            </Link>


            {/* Account Profile / Login */}
            {user ? (
              <div className="shared-navbar__avatar-wrapper" ref={dropdownRef}>
                <button
                  className="shared-navbar__avatar"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  aria-label="Profile menu"
                  aria-expanded={dropdownOpen}
                >
                  <div className="shared-navbar__avatar-img-box">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={userName} />
                    ) : (
                      <span className="material-symbols-outlined">person</span>
                    )}
                  </div>
                  <span className="shared-navbar__action-label">{userName}</span>
                  <span className="material-symbols-outlined shared-navbar__avatar-caret">
                    {dropdownOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="shared-navbar__dropdown">
                    <div className="shared-navbar__dropdown-header">
                      <span className="shared-navbar__dropdown-name">{userName}</span>
                      <span className="shared-navbar__dropdown-role">Buyer Account</span>
                    </div>
                    <Link to="/buyer/profile" className="shared-navbar__dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <span className="material-symbols-outlined">person</span>
                      My Profile
                    </Link>
                    <Link to="/buyer/orders" className="shared-navbar__dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <span className="material-symbols-outlined">local_shipping</span>
                      My Orders
                    </Link>
                    <Link to="/buyer/wishlist" className="shared-navbar__dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <span className="material-symbols-outlined">favorite</span>
                      My Wishlist
                    </Link>
                    <div style={{ height: '1px', background: 'var(--color-border)', margin: '4px 0' }} />
                    <div className="shared-navbar__dropdown-theme-row">
                      <span className="material-symbols-outlined">palette</span>
                      <span className="shared-navbar__dropdown-theme-label">Appearance</span>
                      <ThemeToggle className="shared-navbar__dropdown-theme-toggle" />
                    </div>
                    <div style={{ height: '1px', background: 'var(--color-border)', margin: '4px 0' }} />
                    <button onClick={handleLogout} className="shared-navbar__dropdown-item shared-navbar__dropdown-item--danger">
                      <span className="material-symbols-outlined">logout</span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="shared-navbar__action-btn" title="Sign In" aria-label="Sign In">
                <span className="material-symbols-outlined">login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="shared-navbar__mobile-menu">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="shared-navbar__mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="material-symbols-outlined">{item.icon}</span> {item.label}
              </Link>
            ))}
            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="shared-navbar__mobile-link shared-navbar__mobile-link--danger"
                style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}
              >
                <span className="material-symbols-outlined" style={{ color: 'rgba(248, 113, 113, 0.85)' }}>logout</span> Logout
              </button>
            )}
          </div>
        )}
      </header>

      {/* Horizontal categories list under header (Only on storefront paths) */}
      {showCategoryBar && (
        <nav ref={subnavRef} className="shared-subnav" aria-label="Departments">
          <div className="shared-subnav__inner">
            {CATEGORIES.map((cat) => {
              const icon = CATEGORY_ICONS[cat.id] || 'label';
              return (
                <button
                  key={cat.id}
                  className={`shared-subnav__item ${filters.category === cat.id ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  <span className="shared-subnav__item-icon material-symbols-outlined">{icon}</span>
                  <span className="shared-subnav__item-label">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
