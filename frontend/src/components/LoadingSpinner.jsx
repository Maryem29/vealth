import React from 'react';

const LoadingSpinner = ({ size = 'medium', message = '', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Spinner */}
      <div className="relative">
        <div
          className={`${sizeClasses[size]} border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin`}
        ></div>
        
        {/* Inner spinner for visual appeal */}
        <div
          className={`absolute inset-2 ${size === 'large' ? 'border-2' : 'border'} border-gray-100 border-t-equine-500 rounded-full animate-spin`}
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        ></div>
      </div>

      {/* Loading Message */}
      {message && (
        <p className={`mt-3 text-gray-600 text-center ${size === 'small' ? 'text-xs' : size === 'large' ? 'text-base' : 'text-sm'}`}>
          {message}
        </p>
      )}
      
      {/* Animated dots */}
      {!message && (
        <div className="mt-2 flex space-x-1">
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse animation-delay-200"></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse animation-delay-400"></div>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;