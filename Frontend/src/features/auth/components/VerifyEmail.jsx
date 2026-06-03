import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Hooks/auth.hooks';
import ThemeToggle from '../../../components/ThemeToggle/ThemeToggle';
import '../style/VerifyEmail.scss';

const OTP_LENGTH = 6;

/**
 * VerifyEmail — two-step email OTP verification
 *
 * Step 1 (enter-email):  User confirms/enters their email address.
 *                         "Send Code" → calls resendOtp API → moves to step 2.
 * Step 2 (enter-otp):   User enters the 6-digit code from their inbox.
 *                         "Verify Code" → calls verifyOtp API → redirects to /login.
 *
 * URL params:
 *   ?email=...  Pre-fills email AND auto-sends OTP immediately on mount (for
 *               register redirect and login-blocked redirect).
 *   ?token=...  Handles magic-link clicks from email; verifies silently.
 */
const VerifyEmail = () => {
  const { authVerifyEmailToken, authVerifyOtp, authResendOtp } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token     = searchParams.get('token');
  const initEmail = searchParams.get('email') || '';

  // ── step: 'enter-email' | 'enter-otp' | 'verifying-token' | 'token-error' | 'verified'
  const [step,       setStep]       = useState(() => {
    if (token)     return 'verifying-token';
    if (initEmail) return 'enter-otp';    // email from URL → skip to OTP step
    return 'enter-email';
  });

  const [email,      setEmail]      = useState(initEmail);
  const [digits,     setDigits]     = useState(Array(OTP_LENGTH).fill(''));
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [info,       setInfo]       = useState('');
  const [tokenErr,   setTokenErr]   = useState('');

  const inputsRef   = useRef([]);
  // Guard: only auto-send the OTP once per mount, even in React StrictMode.
  const autoSentRef = useRef(false);

  // ── 1. Magic-link token verification ──────────────────────────────────────
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        await authVerifyEmailToken(token);
        if (!cancelled) setStep('verified');
      } catch (err) {
        if (!cancelled) {
          setTokenErr(err.message || 'This link is invalid or has expired.');
          setStep('token-error');
        }
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ── 2. Auto-send OTP when email arrives from URL ───────────────────────────
  useEffect(() => {
    if (step !== 'enter-otp' || !email || autoSentRef.current) return;
    autoSentRef.current = true;
    (async () => {
      try {
        await authResendOtp(email);
        setInfo(`A 6-digit code was sent to ${email}`);
      } catch (err) {
        setError(err.message || 'Could not send code. Please try again.');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, email]);

  // ── Step 1 submit: send OTP to entered email ───────────────────────────────
  const handleSendCode = useCallback(async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    try {
      setError(''); setInfo(''); setLoading(true);
      await authResendOtp(trimmed);
      setInfo(`A 6-digit code was sent to ${trimmed}`);
      autoSentRef.current = true;
      setStep('enter-otp');
    } catch (err) {
      setError(err.message || 'Failed to send code. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [email, authResendOtp]);

  // ── OTP input handlers ─────────────────────────────────────────────────────
  const handleDigitChange = useCallback((index, val) => {
    if (!/^\d?$/.test(val)) return;
    setDigits(prev => { const n = [...prev]; n[index] = val; return n; });
    setError('');
    if (val && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  }, []);

  const handleDigitKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0)
      inputsRef.current[index - 1]?.focus();
  }, [digits]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const raw = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!raw) return;
    const next = Array(OTP_LENGTH).fill('');
    raw.split('').forEach((c, i) => { next[i] = c; });
    setDigits(next);
    inputsRef.current[Math.min(raw.length, OTP_LENGTH - 1)]?.focus();
  }, []);

  // ── Step 2 submit: verify OTP ──────────────────────────────────────────────
  const handleVerifyOtp = useCallback(async (e) => {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length < OTP_LENGTH) { setError('Enter all 6 digits.'); return; }
    try {
      setError(''); setLoading(true);
      await authVerifyOtp(email, otp);
      setStep('verified');
    } catch (err) {
      setError(err.message || 'Invalid code. Please try again.');
      setDigits(Array(OTP_LENGTH).fill(''));
      setTimeout(() => inputsRef.current[0]?.focus(), 50);
    } finally {
      setLoading(false);
    }
  }, [digits, email, authVerifyOtp]);

  // ── Resend OTP (manual) ────────────────────────────────────────────────────
  const handleResend = useCallback(async () => {
    try {
      setError(''); setInfo(''); setLoading(true);
      await authResendOtp(email);
      setInfo('A new code has been sent to your email.');
      setDigits(Array(OTP_LENGTH).fill(''));
      setTimeout(() => inputsRef.current[0]?.focus(), 50);
    } catch (err) {
      setError(err.message || 'Failed to resend. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [email, authResendOtp]);

  // ── Back to email step ─────────────────────────────────────────────────────
  const backToEmail = useCallback(() => {
    setStep('enter-email');
    setDigits(Array(OTP_LENGTH).fill(''));
    setError(''); setInfo('');
    autoSentRef.current = false;
  }, []);

  // ── After verified: 2 s auto-redirect to login ─────────────────────────────
  useEffect(() => {
    if (step !== 'verified') return;
    const t = setTimeout(() => navigate('/login'), 2500);
    return () => clearTimeout(t);
  }, [step, navigate]);

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="ve-wrap">

      {/* Fixed nav */}
      <nav className="ve-nav">
        <span className="ve-nav__brand font-headline">SNITCH</span>
        <ThemeToggle />
      </nav>

      {/* Left decorative panel (desktop only) */}
      <aside className="ve-aside">
        <div className="ve-aside__inner">
          <p className="ve-aside__eyebrow font-label">Security Module</p>
          <h1 className="ve-aside__headline font-headline">
            Verify<br />Your<br /><span className="ve-aside__accent">Email</span>
          </h1>
          <div className="ve-aside__line" />
          <p className="ve-aside__body font-body">
            Confirm your identity to unlock full access to the SNITCH platform.
          </p>
        </div>
        <span className="ve-aside__watermark font-headline" aria-hidden="true">SNITCH</span>
      </aside>

      {/* Right form panel */}
      <main className="ve-main">
        <div className="ve-glow" aria-hidden="true" />

        <div className="ve-card">

          {/* ── VERIFYING TOKEN ── */}
          {step === 'verifying-token' && (
            <div className="ve-state ve-anim">
              <div className="ve-spinner" />
              <h2 className="ve-state__title font-headline">Verifying Link</h2>
              <p className="ve-state__body font-body">Authenticating your secure token…</p>
            </div>
          )}

          {/* ── TOKEN ERROR ── */}
          {step === 'token-error' && (
            <div className="ve-state ve-anim">
              <span className="material-symbols-outlined ve-icon-err">gpp_bad</span>
              <h2 className="ve-state__title font-headline">Link Expired</h2>
              <p className="ve-state__body font-body">{tokenErr} Use the form below to receive a fresh code.</p>
              <button
                className="ve-outline-btn font-headline"
                onClick={() => { setStep('enter-email'); setTokenErr(''); }}
              >
                <span>Verify with OTP</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          )}

          {/* ── VERIFIED ── */}
          {step === 'verified' && (
            <div className="ve-state ve-anim">
              <div className="ve-check">
                <svg className="ve-check__svg" viewBox="0 0 52 52" fill="none">
                  <circle className="ve-check__circle" cx="26" cy="26" r="25" />
                  <path className="ve-check__tick" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
              </div>
              <h2 className="ve-state__title font-headline">Email Verified</h2>
              <p className="ve-state__body font-body">
                Your account is now active. Redirecting you to the sign-in page…
              </p>
              <Link to="/login" className="ve-primary-btn font-headline">
                <span className="ve-primary-btn__text">Sign In Now</span>
                <span className="material-symbols-outlined ve-primary-btn__icon">arrow_forward</span>
              </Link>
            </div>
          )}

          {/* ── ENTER EMAIL (Step 1) ── */}
          {step === 'enter-email' && (
            <div className="ve-anim">
              <header className="ve-form-hd">
                <div className="ve-eyebrow">
                  <span className="ve-eyebrow__line" />
                  <span className="ve-eyebrow__text font-label">Email Verification</span>
                </div>
                <h1 className="ve-form-hd__title font-headline">Verify Your<br />Email</h1>
              </header>

              {error && <div className="ve-banner ve-banner--err"><span className="material-symbols-outlined">error</span><span className="font-label">{error}</span></div>}
              {info  && <div className="ve-banner ve-banner--ok"><span className="material-symbols-outlined">check_circle</span><span className="font-label">{info}</span></div>}

              <form onSubmit={handleSendCode} noValidate>
                <div className="ve-field">
                  <input
                    id="ve-email"
                    className="ve-input font-body"
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder=" "
                    required
                    autoComplete="email"
                    autoFocus
                  />
                  <label className="ve-label font-label" htmlFor="ve-email">Email Address</label>
                </div>

                <button className="ve-primary-btn font-headline" type="submit" disabled={loading}>
                  <span className="ve-primary-btn__text">{loading ? 'Sending…' : 'Send Verification Code'}</span>
                  {!loading && <span className="material-symbols-outlined ve-primary-btn__icon">arrow_forward</span>}
                </button>
              </form>

              <p className="ve-footer-text font-label">
                Already verified?<Link className="ve-footer-link" to="/login">Sign In</Link>
              </p>
            </div>
          )}

          {/* ── ENTER OTP (Step 2) ── */}
          {step === 'enter-otp' && (
            <div className="ve-anim">
              <header className="ve-form-hd">
                <div className="ve-eyebrow">
                  <span className="ve-eyebrow__line" />
                  <span className="ve-eyebrow__text font-label">Enter Code</span>
                </div>
                <h1 className="ve-form-hd__title font-headline">Check Your<br />Email</h1>
              </header>

              <p className="ve-hint font-body">
                We sent a 6-digit code to <strong className="ve-hint__em">{email}</strong>.
                Enter it below to verify your account.
              </p>

              {error && <div className="ve-banner ve-banner--err"><span className="material-symbols-outlined">error</span><span className="font-label">{error}</span></div>}
              {info  && <div className="ve-banner ve-banner--ok"><span className="material-symbols-outlined">check_circle</span><span className="font-label">{info}</span></div>}

              <form onSubmit={handleVerifyOtp} noValidate>
                <div className="ve-otp" onPaste={handlePaste}>
                  {digits.map((d, i) => (
                    <input
                      key={i}
                      ref={el => inputsRef.current[i] = el}
                      className={`ve-otp__box font-headline${d ? ' ve-otp__box--on' : ''}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={e => handleDigitChange(i, e.target.value)}
                      onKeyDown={e => handleDigitKeyDown(i, e)}
                      aria-label={`Digit ${i + 1} of ${OTP_LENGTH}`}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                <button className="ve-primary-btn font-headline" type="submit" disabled={loading}>
                  <span className="ve-primary-btn__text">{loading ? 'Verifying…' : 'Verify Code'}</span>
                  {!loading && <span className="material-symbols-outlined ve-primary-btn__icon">lock_open</span>}
                </button>
              </form>

              <div className="ve-resend font-label">
                <span className="ve-resend__hint">Didn't receive it?</span>
                <button
                  className="ve-resend__btn"
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                >
                  Resend Code
                </button>
              </div>

              <p className="ve-footer-text font-label">
                Wrong email?
                <button className="ve-footer-link ve-footer-link--btn" type="button" onClick={backToEmail}>
                  Change Email
                </button>
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default VerifyEmail;
