import React from 'react';

export default function Card({ className = '', children, ...props }) {
  return (
    <div className={`rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

