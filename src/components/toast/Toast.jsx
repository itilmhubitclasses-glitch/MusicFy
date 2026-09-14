import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import './Toast.css';

const Toast = ({ message, type = 'success', onClose, duration = 3500 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`toast-notification toast-${type}`} role="status" aria-live="polite">
      <div className="toast-icon">
        {type === 'success' && <CheckCircle2 size={18} />}
        {type === 'error' && <AlertCircle size={18} />}
        {type === 'info' && <Info size={18} />}
      </div>
      <span className="toast-message">{message}</span>
      <button
        type="button"
        className="toast-close-btn"
        onClick={onClose}
        aria-label="Xabarni yopish"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;
