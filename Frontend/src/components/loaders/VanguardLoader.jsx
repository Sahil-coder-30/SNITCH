import React from 'react';
import './Loader.scss';

/**
 * VanguardLoader
 * Sleek, brutalist loading spinner adhering to the SNITCH design system.
 * Great for buttons or API waiting states.
 * 
 * @param {string} size - 'small', 'medium', 'large'
 * @param {boolean} fullScreen - if true, overlays the entire viewport
 */
export const VanguardLoader = ({ size = 'medium', fullScreen = false }) => {
  const loaderCore = (
    <div className={`vanguard-loader-wrapper size-${size}`}>
      <div className="vg-ring"></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="vg-fullscreen-loader">
        {loaderCore}
      </div>
    );
  }

  return loaderCore;
};

/**
 * VanguardTextLoader
 * A glitchy, flashing text loader. Useful for page transitions.
 */
export const VanguardTextLoader = ({ text = "LOADING SECURE PROTOCOL..." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#CCFF00] to-transparent animate-pulse"></div>
      <p className="font-['Epilogue'] font-black text-xs tracking-[0.4em] text-[#CCFF00] uppercase animate-pulse">
        {text}
      </p>
      <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#CCFF00] to-transparent animate-pulse"></div>
    </div>
  );
};
