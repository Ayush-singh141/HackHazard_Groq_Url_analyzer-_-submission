import { useRef, useEffect } from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'gray', 
  thickness = 'normal',
  speed = 'normal',
  label = '',
  srOnly = true
}) => {
  const spinnerRef = useRef(null);
  
  // Size classes mapping
  const sizeClasses = {
    xs: 'w-4 h-4',
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16',
    xl: 'w-24 h-24'
  };
  
  // Color classes mapping
  const colorClasses = {
    primary: 'border-blue-500 border-t-transparent',
    secondary: 'border-purple-500 border-t-transparent',
    success: 'border-green-500 border-t-transparent',
    danger: 'border-red-500 border-t-transparent',
    warning: 'border-yellow-500 border-t-transparent',
    info: 'border-cyan-500 border-t-transparent',
    gray: 'border-gray-500 border-t-transparent',
    black: 'border-black border-t-transparent',
    white: 'border-white border-t-transparent'
  };
  
  // Thickness classes mapping
  const thicknessClasses = {
    thin: 'border-2',
    normal: 'border-4',
    thick: 'border-8'
  };
  
  // Animation speed mapping
  const speedClasses = {
    slow: 'animate-spin-slow',
    normal: 'animate-spin',
    fast: 'animate-spin-fast'
  };

  // Add keyframes for custom animation speeds in useEffect
  useEffect(() => {
    if (!document.querySelector('#spinner-animations')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'spinner-animations';
      styleSheet.textContent = `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin 2s linear infinite;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .animate-spin-fast {
          animation: spin 0.5s linear infinite;
        }
      `;
      document.head.appendChild(styleSheet);
      
      return () => {
        const existingStyle = document.querySelector('#spinner-animations');
        if (existingStyle) {
          existingStyle.remove();
        }
      };
    }
  }, []);
  
  return (
    <div className="relative flex flex-col items-center justify-center" role="status">
      <div
        ref={spinnerRef}
        className={`
          rounded-full
          ${sizeClasses[size] || sizeClasses.medium}
          ${colorClasses[color] || colorClasses.gray}
          ${thicknessClasses[thickness] || thicknessClasses.normal}
          ${speedClasses[speed] || speedClasses.normal}
        `}
        aria-hidden="true"
      />
      
      {label && (
        <span className={`mt-2 text-sm text-gray-600 ${srOnly ? 'sr-only' : ''}`}>
          {label}
        </span>
      )}
      
      {!label && (
        <span className="sr-only">Loading...</span>
      )}
    </div>
  );
};

export default LoadingSpinner;