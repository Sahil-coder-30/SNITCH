import React, { useState, useEffect } from 'react';
import './style/feedback.scss';

export const Toast = ({ message, type = 'info', duration = 3000, onExited }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onExited, 300); // Wait for fade out animation
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onExited]);

  const icons = {
    info: 'info',
    success: 'check_circle',
    error: 'error',
    warning: 'warning'
  };

  return (
    <div className={`sn-toast sn-toast--${type} ${isVisible ? 'is-visible' : ''}`}>
      <span className="material-symbols-outlined">{icons[type]}</span>
      <span className="sn-toast__message">{message}</span>
    </div>
  );
};

export const Spinner = ({ size = 'md', color = 'accent' }) => {
  return (
    <div className={`sn-spinner sn-spinner--${size} sn-spinner--${color}`}></div>
  );
};

export const Skeleton = ({ width, height, variant = 'rect', className = '' }) => {
  const style = {
    width: width || '100%',
    height: height || '20px',
    borderRadius: variant === 'circle' ? '50%' : '8px'
  };

  return <div className={`sn-skeleton ${className}`} style={style}></div>;
};

export const ProgressSteps = ({ steps, currentStep }) => {
  return (
    <div className="sn-progress-steps">
      {steps.map((step, idx) => (
        <React.Fragment key={step}>
          <div className={`sn-step ${idx <= currentStep ? 'is-active' : ''}`}>
            <div className="sn-step__circle">
              {idx < currentStep ? (
                <span className="material-symbols-outlined">check</span>
              ) : (
                idx + 1
              )}
            </div>
            <span className="sn-step__label">{step}</span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`sn-step-line ${idx < currentStep ? 'is-active' : ''}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export const ProductCardSkeleton = () => (
  <div className="sn-product-card is-skeleton">
    <div className="sn-product-card__image-wrap">
      <Skeleton height="100%" />
    </div>
    <div className="sn-product-card__info">
      <Skeleton width="40%" height="0.75rem" className="mb-2" />
      <Skeleton width="90%" height="1.25rem" className="mb-3" />
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <Skeleton width="30%" height="1.25rem" />
        <Skeleton width="20%" height="1rem" />
      </div>
      <div className="sn-product-card__footer">
        <Skeleton width="40%" height="1rem" />
        <Skeleton width="30%" height="1rem" />
      </div>
    </div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="sn-stat-card is-skeleton">
    <Skeleton width="56px" height="56px" variant="rect" className="rounded-xl" />
    <div style={{ flex: 1 }}>
      <Skeleton width="40%" height="0.875rem" className="mb-2" />
      <Skeleton width="60%" height="1.5rem" />
    </div>
  </div>
);

export const HeroSkeleton = () => (
  <div className="sn-hero-skeleton">
    <div className="sn-hero-skeleton__content">
      <Skeleton width="200px" height="1rem" className="mb-4" />
      <Skeleton width="80%" height="4rem" className="mb-6" />
      <Skeleton width="60%" height="1.5rem" className="mb-8" />
      <Skeleton width="180px" height="3.5rem" className="rounded-lg" />
    </div>
  </div>
);
