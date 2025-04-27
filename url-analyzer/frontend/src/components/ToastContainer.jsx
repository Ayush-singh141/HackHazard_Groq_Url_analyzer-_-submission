import { useRef, useEffect } from 'react';
import { useToast } from '../context/ToastContext';

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();
  const toastsRef = useRef([]);
  
  // Add new toasts to the ref array
  useEffect(() => {
    toastsRef.current = toastsRef.current.slice(0, toasts.length);
  }, [toasts]);
  
  // Get icon based on toast type
  const getIcon = (type) => {
    switch(type) {
      case 'success':
        return (
          <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };
  
  // Get toast background color based on type
  const getToastBgColor = (type) => {
    switch(type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          ref={el => toastsRef.current[index] = el}
          className={`animate-toast-in max-w-md rounded-lg shadow-lg border px-4 py-3 flex items-start ${getToastBgColor(toast.type)}`}
          style={{ opacity: 1 }} // Ensure visibility
        >
          <div className="shrink-0 mr-3">
            {getIcon(toast.type)}
          </div>
          <div className="flex-1">
            <p className="text-gray-800">{toast.message}</p>
          </div>
          <button
            className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={() => removeToast(toast.id)}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer; 