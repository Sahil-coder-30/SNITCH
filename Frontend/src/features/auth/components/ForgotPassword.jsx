import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../Hooks/auth.hooks';
import ThemeToggle from '../../../components/ThemeToggle/ThemeToggle';
import '../style/ForgotPassword.scss';

const OTP_LENGTH = 6;
const STEPS = ['Email', 'OTP', 'New Password'];

const ForgotPassword = () => {
  const { authForgetPassword, authResetPassword } = useAuth();
  const [searchParams] = useSearchParams();

  const [step, setStep]         = useState(0);
  const [email, setEmail]       = useState('');
  const [digits, setDigits]     = useState(Array(OTP_LENGTH).fill(''));
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [done, setDone]         = useState(false);

  const otpRefs = useRef([]);

  // ── Read URL params on mount ───────────────────────────────────────────────
  // e.g. /forgot-password?email=foo@bar.com&otp=971115
  useEffect(() => {
    const urlEmail = searchParams.get('email');
    const urlOtp   = searchParams.get('otp');

    if (urlEmail) {
      setEmail(urlEmail);
    }

    if (urlEmail && urlOtp) {
      // Pre-fill OTP digits and jump straight to Step 2 (set new password)
      const otpChars = String(urlOtp).slice(0, OTP_LENGTH).split('');
      const paddedDigits = [...Array(OTP_LENGTH).fill('')];
      otpChars.forEach((c, i) => { paddedDigits[i] = c; });
      setDigits(paddedDigits);
      setStep(2); // skip email + OTP steps
    } else if (urlEmail) {
      // Email pre-filled, user still needs to enter OTP manually
      setStep(1);
    }
  }, []); // run once on mount

  // ── Handlers ──────────────────────────────────────────────────────────────
  const clearError = () => { if (error) setError(''); };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await authForgetPassword(email);
      setStep(1);
    } catch (err) {
      setError(err.message || 'Could not send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDigitChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    clearError();
    const next = [...digits];
    next[idx] = val;
    setDigits(next);
    if (val && idx < OTP_LENGTH - 1) otpRefs.current[idx + 1]?.focus();
  };

  const handleDigitKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const raw = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!raw) return;
    const next = [...digits];
    raw.split('').forEach((c, i) => { if (i < OTP_LENGTH) next[i] = c; });
    setDigits(next);
    otpRefs.current[Math.min(raw.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (digits.join('').length < OTP_LENGTH) {
      setError('Please enter all 6 OTP digits.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPass) { setError('Passwords do not match.'); return; }
    if (password.length < 6)      { setError('Password must be at least 6 characters.'); return; }
    try {
      setLoading(true);
      setError('');
      await authResetPassword(email, digits.join(''), password, confirmPass);
      setDone(true);
    } catch (err) {
      setError(err.message || 'Reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="fp-container">

      {/* Background */}
      <img
        className="fp-hero-bg"
        alt="Streetwear editorial"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJYh9_NxWfhH676rZmOirjwvts79isAUopTotWmbTT9W8AOPNfkV228COtbmSXVQ5QqwgJ2boeXm7Mfgn_lItU2yZXnCo0RCZO95uW9I19RPIP5qUDnClzpErTwtO92Ddo8pqBxpiBePc9cXXKj_bBHxeV6FOrzCvQzj2zCsCZdVA0yk6T4f5a6GNIFIDcdsnr6W5fhv1Cd9tgVH6rrmO4mlvlKTFUcG5NjD84eBB8xyCYAEFU2TyZvi-sQ6aiWWZ51sNx03xlMCU"
      />
      <div className="fp-gradient" />

      {/* Nav */}
      <nav className="fp-nav animate-fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a className="fp-brand font-headline" href="/">SNITCH</a>
        <ThemeToggle />
      </nav>

      {/* Main split */}
      <main className="fp-main">

        {/* Left — brand / step tracker */}
        <section className="fp-left animate-fade-right delay-100">
          <div className="fp-left-inner">
            <h1 className="fp-headline font-headline italic">
              {done
                ? <>All<br/>Set!</>
                : step === 0 ? <>Forgot<br/>Pass?</>
                : step === 1 ? <>Check<br/>Inbox</>
                : <>New<br/>Pass</>
              }
            </h1>

            <p className="fp-sub font-body">
              {done
                ? 'Your password has been reset. Head back to login.'
                : step === 0
                  ? "Enter your registered email and we'll send an OTP straight to your inbox."
                  : step === 1
                    ? `We've sent a 6-digit code to ${email}. Check your spam if you don't see it.`
                    : 'Almost there. Set your new password — make it strong.'}
            </p>

            {!done && (
              <div className="fp-steps animate-fade-up delay-300">
                {STEPS.map((label, i) => (
                  <div
                    key={label}
                    className={`fp-step ${i < step ? 'is-done' : i === step ? 'is-active' : ''}`}
                  >
                    <div className="fp-step-dot">
                      {i < step
                        ? <span className="material-symbols-outlined">check</span>
                        : <span className="fp-step-num">{i + 1}</span>
                      }
                    </div>
                    <span className="fp-step-label font-label">{label}</span>
                    {i < STEPS.length - 1 && <div className="fp-step-line" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="fp-watermark font-headline italic">SNITCH</div>
        </section>

        {/* Right — form panel */}
        <section className="fp-right animate-fade-left delay-300">
          <div className="fp-ambient" />

          <div className="fp-panel">

            {/* ── DONE STATE ────────────────────────────── */}
            {done && (
              <div className="fp-success animate-fade-up">
                <div className="fp-success-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="svg-circle" cx="26" cy="26" r="25" fill="none" />
                    <path className="svg-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                  </svg>
                </div>

                <div className="fp-eyebrow">
                  <span className="fp-eyebrow-line" />
                  <span className="fp-eyebrow-text font-label">Password Reset</span>
                </div>
                <h2 className="fp-title font-headline italic">All Done!</h2>
                <p className="fp-success-text font-body">
                  Your password has been updated. You can now log back in.
                </p>
                <a className="fp-btn" href="/">
                  <span className="fp-btn-text font-headline">Back to Login</span>
                  <span className="material-symbols-outlined fp-btn-icon">arrow_forward</span>
                </a>
              </div>
            )}

            {/* ── STEP 0: EMAIL ───────────────────────── */}
            {!done && step === 0 && (
              <>
                <div className="fp-eyebrow">
                  <span className="fp-eyebrow-line" />
                  <span className="fp-eyebrow-text font-label">Password Recovery</span>
                </div>
                <h2 className="fp-title font-headline italic">Forgot<br/>Password</h2>
                <div className="fp-divider" />

                {error && (
                  <div className="fp-error">
                    <span className="material-symbols-outlined">error</span>
                    <span>{error}</span>
                  </div>
                )}

                <form className="fp-form" onSubmit={handleSendOtp} noValidate>
                  <div className="fp-field">
                    <input
                      className="fp-input font-body"
                      id="fp-email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); clearError(); }}
                      placeholder=" "
                      required
                      autoComplete="email"
                    />
                    <label className="fp-label font-label" htmlFor="fp-email">Email Address</label>
                  </div>

                  <button className="fp-btn" type="submit" disabled={loading}>
                    <span className="fp-btn-text font-headline">{loading ? 'Sending…' : 'Send OTP'}</span>
                    <span className="material-symbols-outlined fp-btn-icon">send</span>
                  </button>
                </form>

                <p className="fp-foot font-label">
                  Remembered it?
                  <a className="fp-foot-link" href="/">Back to Login</a>
                </p>
              </>
            )}

            {/* ── STEP 1: OTP ─────────────────────────── */}
            {!done && step === 1 && (
              <>
                <div className="fp-eyebrow">
                  <span className="fp-eyebrow-line" />
                  <span className="fp-eyebrow-text font-label">Verify Identity</span>
                </div>
                <h2 className="fp-title font-headline italic">Enter<br/>OTP</h2>
                <p className="fp-sent-to font-body">
                  Code sent to <strong className="fp-email-hi">{email}</strong>
                </p>
                <div className="fp-divider" />

                {error && (
                  <div className="fp-error">
                    <span className="material-symbols-outlined">error</span>
                    <span>{error}</span>
                  </div>
                )}

                <form className="fp-form" onSubmit={handleVerifyOtp} noValidate>
                  <div className="fp-otp-grid" onPaste={handlePaste}>
                    {digits.map((d, i) => (
                      <input
                        key={i}
                        ref={el => otpRefs.current[i] = el}
                        className={`fp-otp-box font-headline${d ? ' filled' : ''}`}
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

                  <button className="fp-btn" type="submit">
                    <span className="fp-btn-text font-headline">Verify OTP</span>
                    <span className="material-symbols-outlined fp-btn-icon">arrow_forward</span>
                  </button>
                </form>

                <p className="fp-foot font-label">
                  Wrong email?
                  <button
                    className="fp-foot-btn"
                    type="button"
                    onClick={() => { setStep(0); setDigits(Array(OTP_LENGTH).fill('')); setError(''); }}
                  >
                    Change it
                  </button>
                </p>
              </>
            )}

            {/* ── STEP 2: NEW PASSWORD ─────────────────── */}
            {!done && step === 2 && (
              <>
                <div className="fp-eyebrow">
                  <span className="fp-eyebrow-line" />
                  <span className="fp-eyebrow-text font-label">Set New Password</span>
                </div>
                <h2 className="fp-title font-headline italic">New<br/>Password</h2>
                <div className="fp-divider" />

                {error && (
                  <div className="fp-error">
                    <span className="material-symbols-outlined">error</span>
                    <span>{error}</span>
                  </div>
                )}

                <form className="fp-form" onSubmit={handleResetPassword} noValidate>
                  <div className="fp-field">
                    <input
                      className="fp-input font-body"
                      id="fp-password"
                      name="password"
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); clearError(); }}
                      placeholder=" "
                      required
                      autoComplete="new-password"
                    />
                    <label className="fp-label font-label" htmlFor="fp-password">New Password</label>
                    <button className="fp-show-btn font-label" type="button" onClick={() => setShowPass(v => !v)}>
                      {showPass ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>

                  <div className="fp-field">
                    <input
                      className="fp-input font-body"
                      id="fp-confirm"
                      name="confirmPass"
                      type={showConf ? 'text' : 'password'}
                      value={confirmPass}
                      onChange={e => { setConfirm(e.target.value); clearError(); }}
                      placeholder=" "
                      required
                      autoComplete="new-password"
                    />
                    <label className="fp-label font-label" htmlFor="fp-confirm">Confirm Password</label>
                    <button className="fp-show-btn font-label" type="button" onClick={() => setShowConf(v => !v)}>
                      {showConf ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>

                  <button className="fp-btn" type="submit" disabled={loading}>
                    <span className="fp-btn-text font-headline">{loading ? 'Resetting…' : 'Reset Password'}</span>
                    <span className="material-symbols-outlined fp-btn-icon">lock_reset</span>
                  </button>
                </form>

                <p className="fp-foot font-label">
                  Wrong OTP?
                  <button
                    className="fp-foot-btn"
                    type="button"
                    onClick={() => { setStep(1); setError(''); }}
                  >
                    Re-enter OTP
                  </button>
                </p>
              </>
            )}

          </div>
        </section>
      </main>
    </div>
  );
};

export default ForgotPassword;
