import { useEffect, useState, useRef } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  toastKey: number;
  onDismiss: () => void;
}

export const Toast = ({ message, isVisible, toastKey, onDismiss }: ToastProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const canHoverRef = useRef(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dismissTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      canHoverRef.current = false;
      return;
    }

    canHoverRef.current = window.matchMedia('(hover: hover)').matches;
  }, []);

  // Handle mounting/unmounting for animations
  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      setIsActive(false);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(() => {
        setIsActive(true);
      });
    } else {
      setIsActive(false);
      // Allow exit animation to complete before unmounting
      dismissTimeoutRef.current = setTimeout(() => {
        setShouldRender(false);
      }, 250);
    }

    return () => {
      if (dismissTimeoutRef.current) {
        clearTimeout(dismissTimeoutRef.current);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isVisible]);

  // Handle refresh animation + timer reset signal
  useEffect(() => {
    if (!isVisible) return;

    setIsRefreshing(true);
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    refreshTimeoutRef.current = setTimeout(() => {
      setIsRefreshing(false);
    }, 150);
  }, [toastKey, isVisible]);

  // Auto-dismiss with pause on hover
  useEffect(() => {
    if (!isVisible) return;

    const startDismissTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        onDismiss();
      }, 2500);
    };

    if (!canHoverRef.current || !isHovered) startDismissTimer();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible, isHovered, toastKey, onDismiss]);

  // Manual dismiss on click
  const handleClick = () => {
    onDismiss();
  };

  if (!shouldRender) return null;

  return (
    <div
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[200]"
      style={{
        transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isActive ? 1 : 0,
        transform: `translateX(-50%) translateY(${isActive ? '0' : '20px'}) scale(${isRefreshing ? 1.05 : 1})`,
      }}
      onMouseEnter={() => {
        if (!canHoverRef.current) return;
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        if (!canHoverRef.current) return;
        setIsHovered(false);
      }}
      onClick={handleClick}
    >
      <div
        className="px-4 py-2 bg-card border border-border rounded-full shadow-lg cursor-pointer select-none"
        style={{
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <p className="text-sm font-medium text-foreground whitespace-nowrap">
          {message}
        </p>
      </div>
    </div>
  );
};
