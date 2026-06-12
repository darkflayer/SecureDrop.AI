export const adminNavActive =
  'flex items-center px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-600 text-blue-800 dark:text-white font-medium';

export const adminNavInactive =
  'flex items-center px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-secondary-700 transition-colors';

export const adminTimeRangeBtn = (active: boolean) =>
  active
    ? 'px-3 py-1 text-sm rounded-md bg-blue-600 text-white'
    : 'px-3 py-1 text-sm rounded-md bg-gray-200 dark:bg-secondary-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-secondary-600 transition-colors';
