import { useState, useCallback } from 'react';

let globalToastState: {
  onShow: (message: string) => void;
  onHide: () => void;
} | null = null;

export const useToast = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [toastKey, setToastKey] = useState(0);

  // Register this toast instance globally
  const register = useCallback(() => {
    globalToastState = {
      onShow: (newMessage: string) => {
        setMessage(newMessage);
        setToastKey((prev) => prev + 1);
        setIsVisible(true);
      },
      onHide: () => {
        setIsVisible(false);
      },
    };
  }, []);

  // Unregister when component unmounts
  const unregister = useCallback(() => {
    globalToastState = null;
  }, []);

  const showToast = useCallback((newMessage: string) => {
    globalToastState?.onShow(newMessage);
  }, []);

  const hideToast = useCallback(() => {
    globalToastState?.onHide();
  }, []);

  return {
    isVisible,
    message,
    toastKey,
    register,
    unregister,
    showToast,
    hideToast,
  };
};
