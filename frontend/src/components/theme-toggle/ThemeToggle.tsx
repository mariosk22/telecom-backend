// src/components/theme-toggle/ThemeToggle.tsx
import { useState, useEffect } from 'react';

function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  // Načítanie témy pri štarte aplikácie
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isLightMode = savedTheme === 'light';
    
    setIsLight(isLightMode);
    
    if (isLightMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, []);

  const toggleTheme = () => {
    const newIsLight = !isLight;
    setIsLight(newIsLight);

    if (newIsLight) {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <button 
      id="themeToggle" 
      className="theme-fixed-btn"
      onClick={toggleTheme}
    >
      <i className={`fa-solid ${isLight ? 'fa-sun' : 'fa-moon'}`}></i>
    </button>
  );
}

export default ThemeToggle;