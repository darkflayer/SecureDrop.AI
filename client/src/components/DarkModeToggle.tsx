import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="relative inline-flex items-center justify-center w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full transition-all duration-300 ease-in-out hover:shadow-lg group"
      aria-label="Toggle dark mode"
    >
      {/* Toggle Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 dark:from-indigo-500 dark:to-purple-600 rounded-full transition-all duration-300 ease-in-out opacity-100" />
      
      {/* Toggle Switch */}
      <div
        className={`relative w-5 h-5 bg-white rounded-full shadow-lg transform transition-all duration-300 ease-in-out flex items-center justify-center ${
          isDarkMode ? 'translate-x-3' : '-translate-x-3'
        }`}
      >
        {isDarkMode ? (
          <MoonIcon className="w-3 h-3 text-indigo-600 transition-all duration-300" />
        ) : (
          <SunIcon className="w-3 h-3 text-amber-600 transition-all duration-300" />
        )}
      </div>
      
      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/20 to-orange-500/20 dark:from-indigo-500/20 dark:to-purple-600/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
};

export default DarkModeToggle;
