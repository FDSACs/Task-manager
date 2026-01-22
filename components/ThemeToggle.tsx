
import React from 'react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="p-2.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:ring-2 hover:ring-blue-500 transition-all outline-none group"
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <i className="fa-solid fa-sun text-lg group-hover:rotate-45 transition-transform duration-300"></i>
      ) : (
        <i className="fa-solid fa-moon text-lg group-hover:-rotate-12 transition-transform duration-300"></i>
      )}
    </button>
  );
};

export default ThemeToggle;
