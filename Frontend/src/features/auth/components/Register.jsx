import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../Hooks/auth.hooks';
import { setError as setGlobalError } from '../slice/auth.slice';
import ThemeToggle from '../../../components/ThemeToggle/ThemeToggle';
import '../style/Register.scss';

const GOOGLE_AUTH_URL = '/api/auth/google';

const Register = () => {
  const { authRegister } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, error } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    contact: '',
    role: 'BUYER',
    password: '',
    confirmPassword: '',
    terms: false,
  });

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      if (user.role === 'SELLER') {
        navigate('/seller');
      } else {
        navigate('/buyer');
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) dispatch(setGlobalError(null));
  };

  const registerHandler = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      dispatch(setGlobalError('Passwords do not match.'));
      return;
    }
    if (!formData.terms) {
      dispatch(setGlobalError('You must agree to the Terms & Conditions.'));
      return;
    }
    try {
      setLoading(true);
      dispatch(setGlobalError(null));
      await authRegister(
        formData.username,
        formData.email,
        formData.password,
        formData.confirmPassword,
        formData.contact,
        formData.role,
      );
      if (formData.role === 'SELLER') {
        navigate('/seller');
      } else {
        navigate('/buyer');
      }
    } catch (err) {
      // Error handled by useAuth dispatch
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Background Layers — left half only on desktop */}
      <img
        alt="Dark theme background"
        className="hero-bg-full theme-dark-only"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQn-B6MQxJej3zFqfr_wXSkJwlEDRJRBlCur0EgaD-p3KRW-oXKE3vHdiwyegoakyH9LiW1gJoZOqMnbM6J2aCCgltm79CMKR-8Xh5oD3LIIGX9Oe5Zss0P2g1q0Br1276U2uZbSw9Wun5LquU3VI0VNNzkdnqpJFib_883pvZsSRi2ESz0PCRE4ydmds1seZC69PfjgkK68Xz3Rr5oXD1VWV3nDl_D73ljOgvdZHdDk7_itwYC3ixeKKBl9M5A8DNWCai2zmi9PU"
      />
      <img
        alt="Light theme background"
        className="hero-bg-full theme-light-only"
        src="/assets/light_bg.png"
      />
      <div className="gradient-overlay" />

      {/* Navigation */}
      <nav className="main-nav animate-fade-up">
        <div className="nav-brand">
          <a className="brand-anchor font-headline" href="/">SNITCH</a>
        </div>
        <div className="nav-actions">
          <ThemeToggle />
          <button className="material-symbols-outlined nav-icon" aria-label="Search">search</button>
          <button className="material-symbols-outlined nav-icon" aria-label="Cart">shopping_bag</button>
        </div>
      </nav>

      {/* Main Grid */}
      <main className="main-content">
        <div className="content-wrapper">

          {/* Left — Brand Side */}
          <section className="typography-section animate-fade-right delay-100">
            <div className="typography-inner">
              <h1 className="hero-headline font-headline italic">
                Shop<br />Your<br />Way
              </h1>
              <p className="hero-subtext font-body">
                Create a free account to track orders, save your wishlist, and get early access to new arrivals and exclusive member drops.
              </p>
              <div className="decorative-accent animate-fade-up delay-400">
                <div className="accent-item">
                  <div className="accent-line" />
                  <span className="accent-label font-label">Season</span>
                  <span className="accent-value font-body">FW/26 Drop</span>
                </div>
                <div className="accent-item">
                  <div className="accent-line" />
                  <span className="accent-label font-label">Free Shipping</span>
                  <span className="accent-value font-body">On Orders 999+</span>
                </div>
              </div>
            </div>
            <div className="watermark-bg font-headline italic">SNITCH</div>
          </section>

          {/* Right — Register Form */}
          <section className="form-section animate-fade-left delay-300">
            <div className="ambient-glow" />

            <div className="form-container">
              <header className="form-header">
                <div className="header-eyebrow">
                  <span className="eyebrow-line" />
                  <span className="eyebrow-text font-label">Create Account</span>
                </div>
                <h2 className="form-title font-headline italic">Register</h2>
              </header>

              {error && (
                <div className="error-banner">
                  <span className="material-symbols-outlined error-icon">error</span>
                  <span className="error-text font-label">{error}</span>
                </div>
              )}

              <form className="register-form" onSubmit={registerHandler} noValidate>

                {/* Row 1: Username + Email */}
                <div className="form-row">
                  <div className="input-group">
                    <input
                      className="form-input font-body"
                      id="reg-username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder=" "
                      required
                      type="text"
                      autoComplete="username"
                    />
                    <label className="form-label font-label" htmlFor="reg-username">Username</label>
                  </div>

                  <div className="input-group">
                    <input
                      className="form-input font-body"
                      id="reg-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder=" "
                      required
                      type="email"
                      autoComplete="email"
                    />
                    <label className="form-label font-label" htmlFor="reg-email">Email Address</label>
                  </div>
                </div>

                {/* Row 2: Contact + Role */}
                <div className="form-row">
                  <div className="input-group">
                    <input
                      className="form-input font-body"
                      id="reg-contact"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      placeholder=" "
                      type="tel"
                      autoComplete="tel"
                    />
                    <label className="form-label font-label" htmlFor="reg-contact">Contact (optional)</label>
                  </div>

                  <div className="input-group select-group">
                    <select
                      className="form-input form-select font-body"
                      id="reg-role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="BUYER">Buyer</option>
                      <option value="SELLER">Seller</option>
                    </select>
                    <label className="form-label font-label active" htmlFor="reg-role">Account Role</label>
                    <span className="material-symbols-outlined select-arrow">expand_more</span>
                  </div>
                </div>

                {/* Row 3: Password + Confirm */}
                <div className="form-row">
                  <div className="input-group">
                    <div className="password-wrapper">
                      <input
                        className="form-input font-body"
                        id="reg-password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder=" "
                        required
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                      />
                      <label className="form-label font-label" htmlFor="reg-password">Password</label>
                      <button
                        className="show-password-btn font-label"
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                      >
                        {showPassword ? 'HIDE' : 'SHOW'}
                      </button>
                    </div>
                  </div>

                  <div className="input-group">
                    <div className="password-wrapper">
                      <input
                        className="form-input font-body"
                        id="reg-confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder=" "
                        required
                        type={showConfirm ? 'text' : 'password'}
                        autoComplete="new-password"
                      />
                      <label className="form-label font-label" htmlFor="reg-confirmPassword">Confirm Password</label>
                      <button
                        className="show-password-btn font-label"
                        type="button"
                        onClick={() => setShowConfirm(v => !v)}
                      >
                        {showConfirm ? 'HIDE' : 'SHOW'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="form-options">
                  <label className="checkbox-label" htmlFor="reg-terms">
                    <div className="checkbox-wrapper">
                      <input
                        className="form-checkbox"
                        id="reg-terms"
                        name="terms"
                        checked={formData.terms}
                        onChange={handleChange}
                        type="checkbox"
                      />
                      <span className="material-symbols-outlined check-icon">check</span>
                    </div>
                    <span className="checkbox-text font-label">
                      I agree to the <a className="terms-link" href="/terms">Terms &amp; Conditions</a>
                    </span>
                  </label>
                </div>

                {/* Submit */}
                <div className="submit-section">
                  <button className="submit-btn" type="submit" disabled={loading}>
                    <span className="btn-text font-headline">
                      {loading ? 'Creating...' : 'Create Account'}
                    </span>
                    <span className="material-symbols-outlined btn-icon">arrow_forward</span>
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div className="divider">
                <div className="divider-line" />
                <div className="divider-text-wrapper">
                  <span className="divider-text font-label">Or continue with</span>
                </div>
              </div>

              {/* Social */}
              <div className="social-logins">
                <button
                  type="button"
                  onClick={() => (window.location.href = GOOGLE_AUTH_URL)}
                  className="social-btn"
                >
                  <svg className="social-icon" viewBox="0 0 24 24">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-1.92 5.36-7.84 5.36-5.08 0-9.24-4.2-9.24-9.36s4.16-9.36 9.24-9.36c2.88 0 4.8 1.2 5.88 2.28l2.6-2.52C19.44 1.16 16.24 0 12.48 0 5.6 0 0 5.6 0 12.4s5.6 12.4 12.48 12.4c7.2 0 12-5.08 12-12.2 0-.84-.08-1.48-.2-2.12h-11.8z" />
                  </svg>
                  <span className="social-label font-label">GOOGLE</span>
                </button>
              </div>

              {/* Footer */}
              <footer className="form-footer">
                <p className="footer-text font-label">
                  Already have an account?
                  <Link className="footer-link" to="/login">Log in here</Link>
                </p>
              </footer>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Register;