import React from 'react';

const base = 'flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50';

export default function Input({ className = '', ...props }) {
  return <input className={`${base} ${className}`} {...props} />;
}

