import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../Hooks/auth.hooks';
import ThemeToggle from '../../../components/ThemeToggle/ThemeToggle';
import '../style/SetPassword.scss';

// Password strength helpers
const getRules = (pwd) => [
  { label: 'At least 8 characters',          met: pwd.length >= 8 },
  { label: 'One uppercase letter',            met: /[A-Z]/.test(pwd) },
  { label: 'One lowercase letter',            met: /[a-z]/.test(pwd) },
  { label: 'One number',                      met: /\d/.test(pwd) },
];

const getStrengthLevel = (pwd) => {
  const rules = getRules(pwd);
  const met = rules.filter(r => r.met).length;
  if (pwd.length === 0) return { level: 0, label: '', color: '' };
  if (met <= 1)         return { level: 1, label: 'Weak',   color: '#ff4444' };
  if (met === 2)        return { level: 2, label: 'Fair',   color: '#ffaa44' };
  if (met === 3)        return { level: 3, label: 'Good',   color: '#88cc44' };
  return               { level: 4, label: 'Strong', color: '#44cc88' };
};

const STEPS = ['Verify Email', 'Set Password'];

const SetPassword = () => {
  const { authSetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [step, setStep]           = useState(0);
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirmPass, setConfirm] = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [showConf, setShowConf]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [done, setDone]           = useState(false);

  const strength  = getStrengthLevel(password);
  const rules     = getRules(password);
  const clearError = () => { if (error) setError(''); };

  // ── Pre-fill email from URL params ─────────────────────────────────────────
  useEffect(() => {
    const urlEmail = searchParams.get('email');
    if (urlEmail) {
      setEmail(urlEmail);
      setStep(1); // email already known — jump straight to password step
    }
  }, []);

  // ── Step 0: Confirm email (fallback if user navigates here manually) ───────
  const handleConfirmEmail = (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    setError('');
    setStep(1);
  };

  // ── Step 1: Set password ───────────────────────────────────────────────────
  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPass) { setError('Passwords do not match.'); return; }
    if (strength.level < 2)      { setError('Please choose a stronger password.'); return; }
    try {
      setLoading(true);
      setError('');
      await authSetPassword(email, password, confirmPass);
      setDone(true);
    } catch (err) {
      setError(err.message || 'Failed to set password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="sp-container">

      {/* Background */}
      <img
        className="sp-hero-bg"
        alt="SNITCH editorial background"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJYh9_NxWfhH676rZmOirjwvts79isAUopTotWmbTT9W8AOPNfkV228COtbmSXVQ5QqwgJ2boeXm7Mfgn_lItU2yZXnCo0RCZO95uW9I19RPIP5qUDnClzpErTwtO92Ddo8pqBxpiBePc9cXXKj_bBHxeV6FOrzCvQzj2zCsCZdVA0yk6T4f5a6GNIFIDcdsnr6W5fhv1Cd9tgVH6rrmO4mlvlKTFUcG5NjD84eBB8xyCYAEFU2TyZvi-sQ6aiWWZ51sNx03xlMCU"
      />
      <div className="sp-gradient" />

      {/* Nav */}
      <nav className="sp-nav animate-fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'auto' }}>
        <a className="sp-brand font-headline" href="/">SNITCH</a>
        <ThemeToggle />
      </nav>

      {/* Main split */}
      <main className="sp-main">

        {/* Left — brand / step tracker */}
        <section className="sp-left animate-fade-right delay-100">
          <div className="sp-left-inner">
            <h1 className="sp-headline font-headline italic">
              {done
                ? <>All<br/>Set!</>
                : step === 0 ? <>Secure<br/>Account</>
                : <>Set<br/>Password</>
              }
            </h1>

            <p className="sp-sub font-body">
              {done
                ? 'Your password is live. You can now sign in with email & password anytime.'
                : step === 0
                  ? 'You signed in via Google. Set a password to also enable direct login going forward.'
                  : `Creating a password for ${email}. Make it strong — you only need to do this once.`
              }
            </p>

            {!done && (
              <div className="sp-steps animate-fade-up delay-300">
                {STEPS.map((label, i) => (
                  <div
                    key={label}
                    className={`sp-step ${i < step ? 'is-done' : i === step ? 'is-active' : ''}`}
                  >
                    <div className="sp-step-dot">
                      {i < step
                        ? <span className="material-symbols-outlined">check</span>
                        : <span className="sp-step-num">{i + 1}</span>
                      }
                    </div>
                    <span className="sp-step-label font-label">{label}</span>
                    {i < STEPS.length - 1 && <div className="sp-step-line" />}
                  </div>
                ))}
              </div>
            )}

            {/* Google badge */}
            {!done && (
              <div className="sp-google-badge animate-fade-up delay-300">
                <svg className="sp-google-icon" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-1.92 5.36-7.84 5.36-5.08 0-9.24-4.2-9.24-9.36s4.16-9.36 9.24-9.36c2.88 0 4.8 1.2 5.88 2.28l2.6-2.52C19.44 1.16 16.24 0 12.48 0 5.6 0 0 5.6 0 12.4s5.6 12.4 12.48 12.4c7.2 0 12-5.08 12-12.2 0-.84-.08-1.48-.2-2.12h-11.8z"/>
                </svg>
                <span className="sp-google-text font-label">Google account detected</span>
              </div>
            )}
          </div>

          <div className="sp-watermark font-headline italic">SNITCH</div>
        </section>

        {/* Right — form panel */}
        <section className="sp-right animate-fade-left delay-300">
          <div className="sp-ambient" />

          <div className="sp-panel">

            {/* ── DONE STATE ───────────────────────────────── */}
            {done && (
              <div className="sp-success animate-fade-up">
                <div className="sp-success-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="svg-circle" cx="26" cy="26" r="25" fill="none" />
                    <path className="svg-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                  </svg>
                </div>

                <div className="sp-eyebrow">
                  <span className="sp-eyebrow-line" />
                  <span className="sp-eyebrow-text font-label">Account Secured</span>
                </div>
                <h2 className="sp-title font-headline italic">Password Set!</h2>
                <p className="sp-success-text font-body">
                  Your SNITCH account is now fully secured. You can sign in with your email and password from now on.
                </p>
                <a className="sp-btn" href="/login">
                  <span className="sp-btn-text font-headline">Sign In Now</span>
                  <span className="material-symbols-outlined sp-btn-icon">arrow_forward</span>
                </a>
              </div>
            )}

            {/* ── STEP 0: Confirm Email (fallback) ───────── */}
            {!done && step === 0 && (
              <>
                <div className="sp-eyebrow">
                  <span className="sp-eyebrow-line" />
                  <span className="sp-eyebrow-text font-label">Account Setup</span>
                </div>
                <h2 className="sp-title font-headline italic">Confirm<br/>Email</h2>
                <div className="sp-divider" />

                {error && (
                  <div className="sp-error">
                    <span className="material-symbols-outlined">error</span>
                    <span>{error}</span>
                  </div>
                )}

                <form className="sp-form" onSubmit={handleConfirmEmail} noValidate>
                  <div className="sp-field">
                    <input
                      className="sp-input font-body"
                      id="sp-email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); clearError(); }}
                      placeholder=" "
                      required
                      autoComplete="email"
                    />
                    <label className="sp-label font-label" htmlFor="sp-email">Google Email Address</label>
                  </div>

                  <button className="sp-btn" type="submit">
                    <span className="sp-btn-text font-headline">Continue</span>
                    <span className="material-symbols-outlined sp-btn-icon">arrow_forward</span>
                  </button>
                </form>

                <p className="sp-foot font-label">
                  Back to
                  <a className="sp-foot-link" href="/login">Sign In</a>
                </p>
              </>
            )}

            {/* ── STEP 1: Set Password ──────────────────── */}
            {!done && step === 1 && (
              <>
                <div className="sp-eyebrow">
                  <span className="sp-eyebrow-line" />
                  <span className="sp-eyebrow-text font-label">Create Password</span>
                </div>
                <h2 className="sp-title font-headline italic">Set<br/>Password</h2>
                <p className="sp-sent-to font-body">
                  Setting password for <strong className="sp-email-hi">{email}</strong>
                </p>
                <div className="sp-divider" />

                {error && (
                  <div className="sp-error">
                    <span className="material-symbols-outlined">error</span>
                    <span>{error}</span>
                  </div>
                )}

                <form className="sp-form" onSubmit={handleSetPassword} noValidate>
                  <div className="sp-field">
                    <input
                      className="sp-input font-body"
                      id="sp-password"
                      name="password"
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); clearError(); }}
                      placeholder=" "
                      required
                      autoComplete="new-password"
                    />
                    <label className="sp-label font-label" htmlFor="sp-password">New Password</label>
                    <button className="sp-show-btn font-label" type="button" onClick={() => setShowPass(v => !v)}>
                      {showPass ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>

                  {/* Strength bar */}
                  {password.length > 0 && (
                    <div className="sp-strength">
                      <div className="sp-strength-bars">
                        {[1, 2, 3, 4].map(lvl => (
                          <div
                            key={lvl}
                            className="sp-strength-bar"
                            style={{
                              backgroundColor: strength.level >= lvl ? strength.color : undefined,
                              opacity: strength.level >= lvl ? 1 : 0.15,
                            }}
                          />
                        ))}
                      </div>
                      <span className="sp-strength-label font-label" style={{ color: strength.color }}>
                        {strength.label}
                      </span>
                    </div>
                  )}

                  {/* Rules checklist */}
                  {password.length > 0 && (
                    <ul className="sp-rules">
                      {rules.map(r => (
                        <li key={r.label} className={`sp-rule ${r.met ? 'met' : ''}`}>
                          <span className="material-symbols-outlined sp-rule-icon">
                            {r.met ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          <span className="font-label">{r.label}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="sp-field" style={{ marginTop: password.length > 0 ? '1.5rem' : '0' }}>
                    <input
                      className="sp-input font-body"
                      id="sp-confirm"
                      name="confirmPass"
                      type={showConf ? 'text' : 'password'}
                      value={confirmPass}
                      onChange={e => { setConfirm(e.target.value); clearError(); }}
                      placeholder=" "
                      required
                      autoComplete="new-password"
                    />
                    <label className="sp-label font-label" htmlFor="sp-confirm">Confirm Password</label>
                    <button className="sp-show-btn font-label" type="button" onClick={() => setShowConf(v => !v)}>
                      {showConf ? 'HIDE' : 'SHOW'}
                    </button>
                    {/* Match indicator */}
                    {confirmPass.length > 0 && (
                      <span className={`sp-match-hint font-label ${password === confirmPass ? 'match' : 'no-match'}`}>
                        {password === confirmPass ? '✓ Passwords match' : '✗ Does not match'}
                      </span>
                    )}
                  </div>

                  <button className="sp-btn" type="submit" disabled={loading}>
                    <span className="sp-btn-text font-headline">{loading ? 'Securing…' : 'Set Password'}</span>
                    <span className="material-symbols-outlined sp-btn-icon">lock</span>
                  </button>
                </form>

                <p className="sp-foot font-label">
                  Wrong account?
                  <button
                    className="sp-foot-btn"
                    type="button"
                    onClick={() => { setStep(0); setEmail(''); setPassword(''); setConfirm(''); setError(''); }}
                  >
                    Change email
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

export default SetPassword;
