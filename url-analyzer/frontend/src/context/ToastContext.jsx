import { createContext, useState, useContext } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now().toString();
    
    setToasts(prevToasts => [
      ...prevToasts,
      { id, message, type, duration }
    ]);

    if (duration !== Infinity) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  const success = (message, duration) => {
    return addToast(message, 'success', duration);
  };

  const error = (message, duration) => {
    return addToast(message, 'error', duration);
  };

  const info = (message, duration) => {
    return addToast(message, 'info', duration);
  };

  const warning = (message, duration) => {
    return addToast(message, 'warning', duration);
  };

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        success,
        error,
        info,
        warning
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext; 