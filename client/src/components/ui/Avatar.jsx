import React from 'react';

export default function Avatar({ src, alt = 'avatar', size = 40, fallback }) {
  const dim = typeof size === 'number' ? `${size}px` : size;
  return (
    <div className="inline-flex items-center justify-center rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700" style={{ width: dim, height: dim }}>
      {src ? (
        <img src={src} alt={alt} style={{ width: '100%', height: '100%' }} />
      ) : (
        <span className="text-xs text-gray-600 dark:text-gray-300">{fallback || '?'}</span>
      )}
    </div>
  );
}

