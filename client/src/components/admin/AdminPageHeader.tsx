import React from 'react';
import DarkModeToggle from '../DarkModeToggle';

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  onLogout?: () => void;
}

const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({ title, subtitle, onLogout }) => {
  const adminName = localStorage.getItem('adminName') || 'Admin';

  return (
    <header className="bg-white dark:bg-secondary-800 shadow-sm px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-secondary-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <DarkModeToggle />
          <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Welcome, {adminName}
          </span>
          {onLogout && (
            <button
              onClick={onLogout}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm sm:text-base transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminPageHeader;
