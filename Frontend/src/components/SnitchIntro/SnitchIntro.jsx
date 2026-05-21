import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './SnitchIntro.scss';

/**
 * SnitchIntro — Page loader overlay.
 *
 * Shows a black screen with SNITCH text doing a continuous left-to-right
 * shimmer sweep (skeleton-loader style) while the page loads.
 * Once the page is ready (readyState === 'complete' + minimum 1s),
 * it fades out and calls onComplete() to unmount.
 */
const SnitchIntro = ({ onComplete }) => {
  const container = useRef();
  const ready      = useRef(false); // flips true when we're allowed to exit

  // ── Dismiss: stop shimmer and fade out ───────────────────────────────────
  const dismiss = () => {
    if (!container.current) return;
    gsap.to(container.current, {
      opacity:    0,
      duration:   0.6,
      ease:       'power2.inOut',
      onComplete: () => onComplete?.(),
    });
  };

  // ── Page readiness gate ───────────────────────────────────────────────────
  useEffect(() => {
    // Minimum display time so the shimmer feels intentional (not a flash)
    const minTimer = setTimeout(() => {
      ready.current = true;
      // If the page is also already loaded by now, dismiss immediately
      if (document.readyState === 'complete') dismiss();
    }, 1200);

    // Also listen for the page to finish loading
    const handleLoad = () => {
      if (ready.current) dismiss();
      // If minTimer hasn't fired yet, dismiss() will be called from there
    };

    window.addEventListener('load', handleLoad);
    return () => {
      clearTimeout(minTimer);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  // ── Continuous shimmer loop ───────────────────────────────────────────────
  useGSAP(() => {
    // SNITCH is already visible (no pop-in for a loader)
    gsap.set('.intro-wrapper', { scale: 0.5, transformOrigin: 'top left' });
    gsap.set('.intro-letter', { opacity: 0 });

    gsap.delayedCall(0.05, () => {
      if (!container.current) return;

      // ── Center the SNITCH block ─────────────────────────────────────────
      const h1El   = container.current.querySelector('.intro-watermark-text');
      const hEl    = container.current.querySelector('.intro-h-letter');
      const h1Rect = h1El.getBoundingClientRect();
      const hRect  = hEl.getBoundingClientRect();

      const centeredX = window.innerWidth  / 2 - (h1Rect.width + hRect.width) / 2 - h1Rect.left;
      const centeredY = window.innerHeight / 2 - h1Rect.height / 2 - h1Rect.top;
      gsap.set('.intro-wrapper', { x: centeredX, y: centeredY });
      gsap.set('.intro-letter', { opacity: 1 });
      
      // The shimmer animation is now purely CSS-driven via background-clip in SnitchIntro.scss!
    });
  }, { scope: container });

  return (
    <div ref={container} className="snitch-intro">
      <div
        className="intro-wrapper"
        style={{ perspective: '1200px', position: 'absolute', top: 0, left: 0 }}
      >
        <h1 className="font-headline font-black intro-watermark-text leading-none">
          {['S', 'N', 'I', 'T', 'C'].map((char, i) => (
            <span
              key={i}
              className="intro-letter intro-snitc-letter"
              style={{ transformOrigin: 'center center' }}
            >
              {char}
            </span>
          ))}
          <span
            className="intro-letter intro-h-letter"
            style={{ transformOrigin: 'center center' }}
          >
            H
          </span>
        </h1>
      </div>
    </div>
  );
};

export default SnitchIntro;
