import { useState, useCallback } from "react";
import { ToastNotification } from "./ToastNotification";

interface Toast {
  id: string;
  message: string;
  isVisible: boolean;
}

export const useCartToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, isVisible: true };
    
    setToasts(prev => [...prev, newToast]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => 
      prev.map(toast => 
        toast.id === id ? { ...toast, isVisible: false } : toast
      )
    );
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const ToastContainer = useCallback(() => (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-20">
      {toasts.map(toast => (
        <ToastNotification
          key={toast.id}
          id={toast.id}
          message={toast.message}
          isVisible={toast.isVisible}
          onDismiss={dismissToast}
        />
      ))}
    </div>
  ), [toasts, dismissToast]);

  return {
    showToast,
    ToastContainer
  };
};
