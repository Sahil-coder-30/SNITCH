import React, { useEffect, useState } from 'react';
import './ThemeToggle.scss';

const ThemeToggle = ({ className = '' }) => {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
      setIsLight(true);
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      setIsLight(false);
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  const toggleTheme = () => {
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
      setIsLight(false);
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      setIsLight(true);
    }
  };

  return (
    <button 
      className={`theme-toggle-btn ${className}`} 
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <span className="material-symbols-outlined icon">
        {isLight ? 'dark_mode' : 'light_mode'}
      </span>
    </button>
  );
};

export default ThemeToggle;
