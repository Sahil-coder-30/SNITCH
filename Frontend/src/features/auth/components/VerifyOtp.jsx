import React, { useState, useRef } from 'react';
import { useAuth } from '../Hooks/auth.hooks';
import ThemeToggle from '../../../components/ThemeToggle/ThemeToggle';
import '../style/VerifyOtp.scss';

const OTP_LENGTH = 6;

const VerifyOtp = () => {
  const { authVerifyOtp, authResendOtp } = useAuth();
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email'); // 'email' | 'otp'
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [resendMsg, setResendMsg] = useState('');
  const inputsRef = useRef([]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setStep('otp');
  };

  const handleDigitChange = (index, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[index] = val;
    setDigits(next);
    setError('');
    if (val && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...digits];
    pasted.split('').forEach((c, i) => { if (i < OTP_LENGTH) next[i] = c; });
    setDigits(next);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputsRef.current[focusIdx]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length < OTP_LENGTH) { setError('Please enter all 6 digits.'); return; }
    try {
      setLoading(true);
      setError('');
      await authVerifyOtp(email, otp);
      setVerified(true);
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      setResendMsg('');
      setError('');
      await authResendOtp(email);
      setResendMsg('A new OTP has been sent.');
      setDigits(Array(OTP_LENGTH).fill(''));
    } catch (err) {
      setError(err.message || 'Failed to resend OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="verifyotp-container">
      <div className="ambient-blur top-blur" />
      <div className="ambient-blur bottom-blur" />

      <nav className="fp-nav animate-fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a className="brand-anchor font-headline" href="/">SNITCH</a>
        <ThemeToggle />
      </nav>

      <main className="fp-main">
        <div className="fp-card animate-fade-up delay-150">

          {verified ? (
            <div className="success-state animate-fade-up">
              <div className="success-icon-wrap">
                <svg className="success-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                  <circle className="success-svg__circle" cx="26" cy="26" r="25" fill="none" />
                  <path className="success-svg__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
              </div>
              <h2 className="success-title font-headline italic">Verified!</h2>
              <p className="success-text font-body">Your identity is confirmed. You can now access your account.</p>
              <a className="submit-btn" href="/">
                <span className="btn-text font-headline">Enter Network</span>
                <span className="material-symbols-outlined btn-icon">arrow_forward</span>
              </a>
            </div>
          ) : step === 'email' ? (
            <>
              <div className="card-header">
                <div className="eyebrow">
                  <span className="eyebrow-line" />
                  <span className="eyebrow-text font-label">OTP Verification</span>
                </div>
                <h1 className="card-title font-headline italic">Verify<br/>Account</h1>
                <p className="card-subtitle font-body">Enter the email address associated with your account.</p>
              </div>

              <form className="fp-form" onSubmit={handleEmailSubmit}>
                <div className="input-group">
                  <input
                    className="form-input font-body"
                    id="otp-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder=" "
                    required
                    autoComplete="email"
                  />
                  <label className="form-label font-label" htmlFor="otp-email">Email Address</label>
                </div>

                <button className="submit-btn" type="submit">
                  <span className="btn-text font-headline">Continue</span>
                  <span className="material-symbols-outlined btn-icon">arrow_forward</span>
                </button>
              </form>

              <footer className="card-footer">
                <p className="footer-text font-label">
                  Back to <a className="footer-link" href="/">Login</a>
                </p>
              </footer>
            </>
          ) : (
            <>
              <div className="card-header">
                <div className="eyebrow">
                  <span className="eyebrow-line" />
                  <span className="eyebrow-text font-label">OTP Verification</span>
                </div>
                <h1 className="card-title font-headline italic">Enter<br/>Code</h1>
                <p className="card-subtitle font-body">
                  We sent a 6-digit code to <strong className="highlight">{email}</strong>
                </p>
              </div>

              {error && (
                <div className="error-banner">
                  <span className="material-symbols-outlined error-icon">error</span>
                  <span className="error-text font-label">{error}</span>
                </div>
              )}

              {resendMsg && (
                <div className="success-banner">
                  <span className="material-symbols-outlined success-icon">check_circle</span>
                  <span className="success-text-sm font-label">{resendMsg}</span>
                </div>
              )}

              <form onSubmit={handleVerify}>
                <div className="otp-grid" onPaste={handlePaste}>
                  {digits.map((d, i) => (
                    <input
                      key={i}
                      ref={el => inputsRef.current[i] = el}
                      className={`otp-input font-headline ${d ? 'filled' : ''}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={e => handleDigitChange(i, e.target.value)}
                      onKeyDown={e => handleDigitKeyDown(i, e)}
                      aria-label={`OTP digit ${i + 1}`}
                    />
                  ))}
                </div>

                <button className="submit-btn" type="submit" disabled={loading}>
                  <span className="btn-text font-headline">{loading ? 'Verifying...' : 'Verify OTP'}</span>
                  <span className="material-symbols-outlined btn-icon">lock_open</span>
                </button>
              </form>

              <div className="resend-row">
                <p className="footer-text font-label">
                  Didn't receive it?{' '}
                  <button className="resend-btn" type="button" onClick={handleResend} disabled={resending}>
                    {resending ? 'Sending...' : 'Resend OTP'}
                  </button>
                </p>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
};

export default VerifyOtp;
