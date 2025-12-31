import { useEffect, useState } from "react";
import { X } from "lucide-react";

export interface ToastProps {
  id: string;
  message: string;
  isVisible: boolean;
  onDismiss: (id: string) => void;
}

export const ToastNotification = ({ id, message, isVisible, onDismiss }: ToastProps) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        onDismiss(id);
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isVisible, id, onDismiss]);

  if (!shouldRender) return null;

  return (
    <div
      className={`
        fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20
        bg-white border border-gray-200 text-gray-800
        px-4 py-2 rounded-full shadow-lg
        text-sm font-medium
        transition-all duration-400 ease-out
        ${isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-4 opacity-0'
        }
      `}
    >
      <div className="flex items-center gap-2">
        <span>{message}</span>
        <button
          onClick={() => onDismiss(id)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};
