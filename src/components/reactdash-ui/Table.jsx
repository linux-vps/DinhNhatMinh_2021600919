import React from 'react';

export default function Table({ children, className = '', ...props }) {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700 ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className = '', ...props }) {
  return (
    <thead className={`bg-gray-50 dark:bg-gray-800 ${className}`} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = '', ...props }) {
  return (
    <tbody className={`bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700 ${className}`} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = '', ...props }) {
  return (
    <tr className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${className}`} {...props}>
      {children}
    </tr>
  );
}

export function TableHeader({ children, className = '', ...props }) {
  return (
    <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${className}`} {...props}>
      {children}
    </th>
  );
}

export function TableCell({ children, className = '', ...props }) {
  return (
    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${className}`} {...props}>
      {children}
    </td>
  );
} 