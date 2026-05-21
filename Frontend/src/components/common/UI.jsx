import React from 'react';
import './style/common.scss';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false, 
  icon, 
  iconPosition = 'left',
  className = '',
  ...props 
}) => {
  return (
    <button 
      className={`sn-btn sn-btn--${variant} sn-btn--${size} ${className} ${loading ? 'is-loading' : ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="sn-btn__spinner"></span>}
      {!loading && icon && iconPosition === 'left' && <span className="material-symbols-outlined sn-btn__icon">{icon}</span>}
      <span className="sn-btn__text">{children}</span>
      {!loading && icon && iconPosition === 'right' && <span className="material-symbols-outlined sn-btn__icon">{icon}</span>}
    </button>
  );
};

export const Input = ({ 
  label, 
  error, 
  icon, 
  className = '', 
  wrapperClassName = '',
  ...props 
}) => {
  return (
    <div className={`sn-input-group ${wrapperClassName} ${error ? 'has-error' : ''}`}>
      {label && <label className="sn-input-label">{label}</label>}
      <div className="sn-input-wrapper">
        {icon && <span className="material-symbols-outlined sn-input-icon">{icon}</span>}
        <input 
          className={`sn-input ${icon ? 'has-icon' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="sn-input-error-text">{error}</p>}
    </div>
  );
};

export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  return (
    <span className={`sn-badge sn-badge--${variant} sn-badge--${size} ${className}`}>
      {children}
    </span>
  );
};

export const Card = ({ children, hoverable = false, className = '', ...props }) => {
  return (
    <div className={`sn-card ${hoverable ? 'is-hoverable' : ''} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  if (!isOpen) return null;

  return (
    <div className="sn-modal-overlay" onClick={onClose}>
      <div className={`sn-modal sn-modal--${size}`} onClick={e => e.stopPropagation()}>
        <div className="sn-modal__header">
          <h3 className="sn-modal__title">{title}</h3>
          <button className="sn-modal__close" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="sn-modal__body">
          {children}
        </div>
        {footer && (
          <div className="sn-modal__footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
