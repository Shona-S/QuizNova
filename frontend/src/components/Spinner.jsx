import React from 'react';

const Spinner = ({ size = 'md', color = 'brand' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-[3px]',
    lg: 'h-12 w-12 border-4',
  };

  const colorClasses = {
    brand: 'border-emerald-600 border-t-transparent dark:border-emerald-500 dark:border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  return (
    <div
      className={`animate-spin rounded-full border-solid ${sizeClasses[size]} ${colorClasses[color]}`}
      role="status"
    />
  );
};

export default Spinner;
