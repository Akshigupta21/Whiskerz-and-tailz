import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'success', isVisible, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  const getToastIcon = () => {
    switch (type) {
      case 'success':
      case 'cart':
        return '✓';
      case 'wishlist':
        return '♥';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return '✓';
    }
  };

  const getToastClass = () => {
    switch (type) {
      case 'success':
      case 'cart':
        return 'toast-success';
      case 'wishlist':
        return 'toast-wishlist';
      case 'error':
        return 'toast-error';
      case 'warning':
        return 'toast-warning';
      default:
        return 'toast-success';
    }
  };

  return (
    <div className={`toast ${getToastClass()} ${isVisible ? 'toast-visible' : ''}`}>
      <div className="toast-content">
        <span className="toast-icon">{getToastIcon()}</span>
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
