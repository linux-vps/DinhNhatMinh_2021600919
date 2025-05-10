import React from 'react';

export default function Banner() {
  return (
    <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900 rounded-lg">
      <div className="text-center">
        <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">Nâng cấp lên Pro</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Để có thêm tính năng</p>
        <button className="mt-2 w-full py-1 px-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors duration-200">
          Nâng cấp ngay
        </button>
      </div>
    </div>
  );
} 