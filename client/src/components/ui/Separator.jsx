import React from 'react';

export default function Separator({ className = '' }) {
  return <div className={`w-full h-px bg-gray-200 dark:bg-gray-800 ${className}`} />;
}

