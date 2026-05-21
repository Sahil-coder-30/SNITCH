import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../Hooks/auth.hooks';
import { setError as setGlobalError } from '../slice/auth.slice';
import ThemeToggle from '../../../components/ThemeToggle/ThemeToggle';
import '../style/Login.scss';

const Login = () => {
  const { authLogin } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, error } = useSelector((state) => state.auth);
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    retain: false
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
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) dispatch(setGlobalError(null));
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      dispatch(setGlobalError(null));
      const loggedUser = await authLogin(formData.email, formData.password);
      if (loggedUser?.role === 'SELLER') {
        navigate('/seller');
      } else {
        navigate('/buyer');
      }
    } catch (err) {
      // Error is already handled by useAuth dispatching to Redux
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background Layers */}
      <img 
        alt="Dark theme background" 
        className="hero-bg-full theme-dark-only" 
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJYh9_NxWfhH676rZmOirjwvts79isAUopTotWmbTT9W8AOPNfkV228COtbmSXVQ5QqwgJ2boeXm7Mfgn_lItU2yZXnCo0RCZO95uW9I19RPIP5qUDnClzpErTwtO92Ddo8pqBxpiBePc9cXXKj_bBHxeV6FOrzCvQzj2zCsCZdVA0yk6T4f5a6GNIFIDcdsnr6W5fhv1Cd9tgVH6rrmO4mlvlKTFUcG5NjD84eBB8xyCYAEFU2TyZvi-sQ6aiWWZ51sNx03xlMCU"
      />
      <img 
        alt="Light theme background" 
        className="hero-bg-full theme-light-only" 
        src="/assets/light_bg.png"
      />
      <div className="gradient-overlay right-glow"></div>
      
      {/* Main Navigation */}
      <nav className="main-nav animate-fade-up">
        <div className="nav-brand">
          <span className="brand-anchor font-headline">SNITCH</span>
        </div>
        <div className="nav-actions">
          <ThemeToggle />
          <button className="material-symbols-outlined nav-icon">search</button>
          <button className="material-symbols-outlined nav-icon">shopping_bag</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          
          {/* Left Side: Typography */}
          <section className="typography-section animate-fade-right delay-100">
            <div className="typography-inner">
              <h1 className="hero-headline drop-shadow-2xl font-headline italic">
                Welcome<br/>Back
              </h1>
              
              <p className="hero-subtext relative font-body">
                Sign in to access your account, track your orders, and shop the latest drops.
              </p>

              {/* Decorative Accent */}
              <div className="decorative-accent animate-fade-up delay-400">
                 <div className="accent-item group">
                   <div className="accent-line"></div>
                   <span className="accent-label font-label">Collection</span>
                   <span className="accent-value font-body">FW/26 Drop</span>
                 </div>
                 <div className="accent-item group">
                   <div className="accent-line"></div>
                   <span className="accent-label font-label">Free Returns</span>
                   <span className="accent-value font-body">30 Days</span>
                 </div>
              </div>
            </div>
            
            <div className="watermark-bg font-headline italic">
               SNITCH
            </div>
          </section>

          {/* Right Side: Login Form */}
          <section className="form-section animate-fade-left delay-300">
            <div className="ambient-glow"></div>

            <div className="form-container">
              <header className="form-header">
                <div className="header-eyebrow">
                  <span className="eyebrow-line"></span>
                  <span className="eyebrow-text font-label uppercase">Member Login</span>
                </div>
                <h2 className="form-title font-headline italic uppercase">Sign In</h2>
              </header>

              {error && (
                <div className="error-banner">
                  <span className="material-symbols-outlined error-icon">error</span>
                  <span className="error-text font-label">{error}</span>
                </div>
              )}

              <form className="login-form" onSubmit={loginHandler}>
                <div className="input-group">
                  <input className="form-input font-body" id="email" name="email" value={formData.email} onChange={handleChange} placeholder=" " required type="email"/>
                  <label className="form-label font-label uppercase" htmlFor="email">Email Address</label>
                </div>

                <div className="input-group">
                  <div className="password-wrapper">
                    <input className="form-input font-body w-full" id="password" name="password" value={formData.password} onChange={handleChange} placeholder=" " required type={showPassword ? "text" : "password"}/>
                    <label className="form-label font-label uppercase" htmlFor="password">Password</label>
                    <button className="show-password-btn font-label uppercase" type="button" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? "HIDE" : "SHOW"}
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="checkbox-label group">
                    <div className="checkbox-wrapper">
                      <input className="form-checkbox" id="retain" name="retain" checked={formData.retain} onChange={handleChange} type="checkbox"/>
                      <span className="material-symbols-outlined check-icon">check</span>
                    </div>
                    <span className="checkbox-text font-label">Remember Me</span>
                  </label>
                  <a className="forgot-link font-label" href="/forgot-password">Forgot Password?</a>
                </div>

                <div className="submit-section">
                  <button className="submit-btn group" type="submit" disabled={loading}>
                    <span className="btn-text font-headline uppercase relative z-10">
                      {loading ? 'Signing in...' : 'Sign In'}
                    </span>
                    <span className="material-symbols-outlined btn-icon text-base relative z-10">
                      {loading ? 'sync' : 'arrow_forward'}
                    </span>
                  </button>
                </div>
              </form>

              <div className="divider">
                <div className="divider-line"></div>
                <div className="divider-text-wrapper">
                  <span className="divider-text font-label uppercase">Or continue with</span>
                </div>
              </div>

              <div className="social-logins">
                <button type="button" onClick={() => window.location.href = '/api/auth/google'} className="social-btn group">
                  <svg className="social-icon transition-transform group-hover:scale-110" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-1.92 5.36-7.84 5.36-5.08 0-9.24-4.2-9.24-9.36s4.16-9.36 9.24-9.36c2.88 0 4.8 1.2 5.88 2.28l2.6-2.52C19.44 1.16 16.24 0 12.48 0 5.6 0 0 5.6 0 12.4s5.6 12.4 12.48 12.4c7.2 0 12-5.08 12-12.2 0-.84-.08-1.48-.2-2.12h-11.8z"></path></svg>
                  <span className="social-label font-label uppercase">GOOGLE</span>
                </button>
                <button type="button" onClick={() => window.location.href = '/api/auth/apple'} className="social-btn group">
                  <svg className="social-icon transition-transform group-hover:scale-110" viewBox="0 0 24 24"><path d="M17.05 20.28c-.96.95-2.04 1.43-3.23 1.43-1.16 0-2.12-.41-2.9-1.22-.79.81-1.8 1.22-3.03 1.22-1.2 0-2.28-.48-3.24-1.43-1.34-1.31-2.01-3.24-2.01-5.78 0-2.45.65-4.4 1.94-5.84 1.05-1.16 2.37-1.74 3.96-1.74 1.07 0 1.95.27 2.62.8.55.43.91.89 1.09 1.38.2-.49.56-.95 1.09-1.38.67-.53 1.55-.8 2.62-.8 1.59 0 2.91.58 3.96 1.74 1.29 1.44 1.94 3.39 1.94 5.84 0 2.54-.67 4.47-2.01 5.78zm-3.08-17.65c0 .08.01.16.01.24 0 1.29-.53 2.5-1.4 3.42-1.02 1.09-2.3 1.66-3.66 1.66-.08 0-.16 0-.25-.01 0-1.27.53-2.52 1.42-3.45.99-1.03 2.31-1.63 3.65-1.63.08 0 .16 0 .23.01z"></path></svg>
                  <span className="social-label font-label uppercase">APPLE</span>
                </button>
              </div>

              <footer className="form-footer pt-8 text-center">
                <p className="footer-text font-label uppercase">
                    New here? <Link className="footer-link" to="/register">Create an account</Link>
                </p>
              </footer>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Login;