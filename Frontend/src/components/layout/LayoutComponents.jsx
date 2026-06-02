import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { Button } from '../common/UI';
import { useCart } from '../../features/cart/hooks/cart.hooks';
import './style/layout.scss';

export const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { authFetchCart } = useCart();
  const { user } = useSelector(state => state.auth);
  const { itemCount } = useSelector(state => state.cart);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user && user.role === 'BUYER') {
      authFetchCart();
    }
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search logic here
  };

  return (
    <nav className="sn-nav">
      <div className="sn-nav__container">
        <Link to="/" className="sn-logo">SNITCH</Link>

        <div className={`sn-nav__menu ${isMenuOpen ? 'is-open' : ''}`}>
          <Link to="/" className="sn-nav__link">Shop</Link>
          <Link to="/new-drops" className="sn-nav__link">New Drops</Link>
          <Link to="/collections" className="sn-nav__link">Collections</Link>
        </div>

        <form className="sn-nav__search" onSubmit={handleSearch}>
          <span className="material-symbols-outlined">search</span>
          <input 
            type="text" 
            placeholder="Search premium drops..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="sn-nav__actions">
          <ThemeToggle />
          
          <button className="sn-nav__icon-btn" aria-label="Wishlist">
            <span className="material-symbols-outlined">favorite</span>
          </button>

          <Link to="/buyer/cart" className="sn-nav__icon-btn sn-cart-btn">
            <span className="material-symbols-outlined">shopping_bag</span>
            <span className="sn-cart-badge">{itemCount}</span>
          </Link>

          {user ? (
            <div className="sn-nav__profile">
              <button className="sn-nav__avatar" onClick={() => navigate(user.role === 'SELLER' ? '/seller' : '/buyer')}>
                {user.name?.charAt(0) || 'U'}
              </button>
            </div>
          ) : (
            <Button variant="primary" size="sm" onClick={() => navigate('/login')}>Sign In</Button>
          )}

          <button className="sn-nav__mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export const Footer = () => {
  return (
    <footer className="sn-footer">
      <div className="sn-footer__container">
        <div className="sn-footer__grid">
          <div className="sn-footer__brand">
            <h2 className="sn-footer__logo">SNITCH</h2>
            <p className="sn-footer__tagline">Wear the narrative. Premium aesthetics for the modern generation.</p>
            <div className="sn-footer__socials">
              {['instagram', 'facebook', 'twitter'].map(s => (
                <a key={s} href={`#${s}`} className="sn-footer__social-link">
                  <i className={`fab fa-${s}`}></i>
                </a>
              ))}
            </div>
          </div>

          <div className="sn-footer__links-group">
            <h4 className="sn-footer__heading">Shop</h4>
            <Link to="/new-arrivals">New Arrivals</Link>
            <Link to="/best-sellers">Best Sellers</Link>
            <Link to="/sale">Sale</Link>
            <Link to="/collections">Collections</Link>
          </div>

          <div className="sn-footer__links-group">
            <h4 className="sn-footer__heading">Support</h4>
            <Link to="/track-order">Track Order</Link>
            <Link to="/shipping">Shipping Info</Link>
            <Link to="/returns">Returns & Exchanges</Link>
            <Link to="/faq">FAQs</Link>
          </div>

          <div className="sn-footer__newsletter">
            <h4 className="sn-footer__heading">Newsletter</h4>
            <p>Join the SNITCH family for exclusive drops and offers.</p>
            <div className="sn-footer__subscribe">
              <input type="email" placeholder="Enter your email" />
              <Button variant="primary" size="sm">Join</Button>
            </div>
          </div>
        </div>

        <div className="sn-footer__bottom">
          <p>© 2026 SNITCH. All rights reserved.</p>
          <div className="sn-footer__legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
