import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  detail?: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        onDismiss(toast.id);
      }, toast.duration || 5000);
      return () => clearTimeout(timer);
    }
  }, [toast, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />,
  };

  return (
    <div
      role="alert"
      className="flex items-start gap-3 p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-md rounded-xl max-w-md w-full animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-auto"
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {toast.message}
        </p>
        {toast.detail && (
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
            {toast.detail}
          </p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1 rounded-md transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
