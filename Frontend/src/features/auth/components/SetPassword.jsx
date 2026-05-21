import React, { useState } from 'react';
import { useAuth } from '../Hooks/auth.hooks';
import ThemeToggle from '../../../components/ThemeToggle/ThemeToggle';
import '../style/SetPassword.scss';

const SetPassword = () => {
  const { authSetPassword } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPass: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPass) {
      setError('Passwords do not match.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await authSetPassword(formData.email, formData.password, formData.confirmPass);
      setDone(true);
    } catch (err) {
      setError(err.message || 'Failed to set password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setpass-container">
      <div className="ambient-blur top-blur" />
      <div className="ambient-blur bottom-blur" />

      <nav className="fp-nav animate-fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a className="brand-anchor font-headline" href="/">SNITCH</a>
        <ThemeToggle />
      </nav>

      <main className="fp-main">
        <div className="fp-card animate-fade-up delay-150">

          {done ? (
            <div className="success-state animate-fade-up">
              <div className="success-icon-wrap">
                <svg className="success-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                  <circle className="success-svg__circle" cx="26" cy="26" r="25" fill="none" />
                  <path className="success-svg__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
              </div>
              <h2 className="success-title font-headline italic">Password Set!</h2>
              <p className="success-text font-body">Your account is now fully secured. You're ready to go.</p>
              <a className="submit-btn" href="/">
                <span className="btn-text font-headline">Enter Network</span>
                <span className="material-symbols-outlined btn-icon">arrow_forward</span>
              </a>
            </div>
          ) : (
            <>
              <div className="card-header">
                <div className="eyebrow">
                  <span className="eyebrow-line" />
                  <span className="eyebrow-text font-label">Account Setup</span>
                </div>
                <h1 className="card-title font-headline italic">Set<br/>Password</h1>
                <p className="card-subtitle font-body">
                  You signed in via Google. Set a password to also enable direct login.
                </p>
              </div>

              {error && (
                <div className="error-banner">
                  <span className="material-symbols-outlined error-icon">error</span>
                  <span className="error-text font-label">{error}</span>
                </div>
              )}

              <form className="fp-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    className="form-input font-body"
                    id="sp-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder=" "
                    required
                    autoComplete="email"
                  />
                  <label className="form-label font-label" htmlFor="sp-email">Email Address</label>
                </div>

                <div className="input-group">
                  <div className="password-wrapper">
                    <input
                      className="form-input font-body"
                      id="sp-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder=" "
                      required
                      autoComplete="new-password"
                    />
                    <label className="form-label font-label" htmlFor="sp-password">New Password</label>
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
                      id="sp-confirmPass"
                      name="confirmPass"
                      type={showConfirm ? 'text' : 'password'}
                      value={formData.confirmPass}
                      onChange={handleChange}
                      placeholder=" "
                      required
                      autoComplete="new-password"
                    />
                    <label className="form-label font-label" htmlFor="sp-confirmPass">Confirm Password</label>
                    <button
                      className="show-password-btn font-label"
                      type="button"
                      onClick={() => setShowConfirm(v => !v)}
                    >
                      {showConfirm ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>
                </div>

                <button className="submit-btn" type="submit" disabled={loading}>
                  <span className="btn-text font-headline">{loading ? 'Saving...' : 'Set Password'}</span>
                  <span className="material-symbols-outlined btn-icon">lock</span>
                </button>
              </form>

              <footer className="card-footer">
                <p className="footer-text font-label">
                  Skip for now — <a className="footer-link" href="/">Back to Login</a>
                </p>
              </footer>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default SetPassword;
