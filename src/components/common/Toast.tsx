import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string, duration = 4000) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast: Toast = { id, type, title, message, duration };

      setToasts(prev => [...prev.slice(-4), newToast]); // Keep max 5 toasts

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((title: string, message?: string) => showToast('success', title, message), [showToast]);
  const error = useCallback((title: string, message?: string) => showToast('error', title, message), [showToast]);
  const info = useCallback((title: string, message?: string) => showToast('info', title, message), [showToast]);
  const warning = useCallback((title: string, message?: string) => showToast('warning', title, message), [showToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast, success, error, info, warning }}>
      {children}
      {/* Toast Notification Container */}
      <div 
        id="toast-notifications-container"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map(toast => {
          const getStyles = () => {
            switch (toast.type) {
              case 'success':
                return {
                  border: 'border-emerald-200',
                  bg: 'bg-white',
                  iconBg: 'bg-emerald-50 text-emerald-600',
                  icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
                  bar: 'bg-emerald-500'
                };
              case 'error':
                return {
                  border: 'border-rose-200',
                  bg: 'bg-white',
                  iconBg: 'bg-rose-50 text-rose-600',
                  icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
                  bar: 'bg-rose-500'
                };
              case 'warning':
                return {
                  border: 'border-amber-200',
                  bg: 'bg-white',
                  iconBg: 'bg-amber-50 text-amber-600',
                  icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
                  bar: 'bg-amber-500'
                };
              case 'info':
              default:
                return {
                  border: 'border-indigo-200',
                  bg: 'bg-white',
                  iconBg: 'bg-indigo-50 text-indigo-600',
                  icon: <Info className="w-5 h-5 text-indigo-600 shrink-0" />,
                  bar: 'bg-indigo-500'
                };
            }
          };

          const style = getStyles();

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto rounded-xl shadow-lg border ${style.border} ${style.bg} p-3.5 flex items-start gap-3 animate-fade-in relative overflow-hidden transition-all`}
            >
              <div className={`p-1.5 rounded-lg ${style.iconBg} shrink-0 mt-0.5`}>
                {style.icon}
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <h4 className="text-xs font-bold text-slate-900 tracking-tight">{toast.title}</h4>
                {toast.message && (
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
