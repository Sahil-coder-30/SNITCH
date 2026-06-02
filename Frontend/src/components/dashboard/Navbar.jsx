import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './Navbar.scss';
import { useAuth } from '../../features/auth/Hooks/auth.hooks';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = ({ breadcrumb = ['Dashboard', 'Overview'] }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { itemCount } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  
  const role = user?.role?.toLowerCase() || 'buyer';
  const userName = user?.username || 'Guest';

  const {authLogout} = useAuth();
  const navigate = useNavigate();

  const handleLogout =async () => {
    try {
      await authLogout();
      navigate('/login');
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <header className="navbar">
      {/* Left: Breadcrumb */}
      <div className="navbar__left">
        <nav className="navbar__breadcrumb" aria-label="breadcrumb">
          {breadcrumb.map((crumb, i) => (
            <span key={crumb} className="navbar__breadcrumb-group">
              <span className={`navbar__breadcrumb-item ${i === breadcrumb.length - 1 ? 'navbar__breadcrumb-item--active' : ''}`}>
                {crumb}
              </span>
              {i < breadcrumb.length - 1 && (
                <span className="material-symbols-outlined navbar__breadcrumb-sep">chevron_right</span>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Center: Search (buyer only shows center) */}
      <div className="navbar__center">
        <div className="navbar__search">
          <span className="material-symbols-outlined navbar__search-icon">search</span>
          <input
            type="text"
            className="navbar__search-input"
            placeholder={role === 'buyer' ? 'Search for clothes, brands, styles...' : 'Search...'}
            readOnly
          />
          <kbd className="navbar__search-kbd">⌘K</kbd>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="navbar__right">
        {role === 'buyer' && (
          <>
            <a href="/buyer/track" className="navbar__action-btn" aria-label="Track Order" title="Track Order">
              <span className="material-symbols-outlined">local_shipping</span>
            </a>
            <a href="/buyer/offers" className="navbar__action-btn" aria-label="Offers" title="Offers">
              <span className="material-symbols-outlined">sell</span>
            </a>
            <a href="/buyer/support" className="navbar__action-btn" aria-label="Support" title="Customer Support">
              <span className="material-symbols-outlined">support_agent</span>
            </a>
            <Link to="/buyer/wishlist" className="navbar__action-btn" aria-label="Wishlist" title="Wishlist">
              <span className="material-symbols-outlined">favorite</span>
              {wishlistItems.length > 0 && (
                <span className="navbar__action-badge">{wishlistItems.length}</span>
              )}
            </Link>
            <Link to="/buyer/cart" className="navbar__action-btn" aria-label="Cart" title="Cart">
              <span className="material-symbols-outlined">shopping_cart</span>
              {itemCount > 0 && <span className="navbar__action-badge">{itemCount}</span>}
            </Link>
          </>
        )}

        <ThemeToggle className="navbar__theme-toggle" />

        {/* Notification bell */}
        <button className="navbar__action-btn" aria-label="Notifications">
          <span className="material-symbols-outlined">notifications</span>
          <span className="navbar__action-badge">5</span>
        </button>

        {/* Avatar Dropdown */}
        <div className="navbar__avatar-wrapper">
          <button
            className="navbar__avatar"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-label="Profile menu"
            aria-expanded={dropdownOpen}
          >
            <span className="navbar__avatar-initials">
              {userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </span>
            <span className="material-symbols-outlined navbar__avatar-caret">
              {dropdownOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {dropdownOpen && (
            <div className="navbar__dropdown">
              <div className="navbar__dropdown-header">
                <span className="navbar__dropdown-name">{userName}</span>
                <span className="navbar__dropdown-role">{role === 'seller' ? 'Seller Account' : 'Buyer Account'}</span>
              </div>
              <div className="navbar__dropdown-divider" />
              <a href={`/${role}/profile`}  className="navbar__dropdown-item">
                <span className="material-symbols-outlined">person</span>
                My Profile
              </a>
              <div className="navbar__dropdown-divider" />
              <button onClick={handleLogout}  className="navbar__dropdown-item navbar__dropdown-item--danger">
                <span className="material-symbols-outlined">logout</span>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
