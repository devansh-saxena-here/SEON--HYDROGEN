import React, { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (opts: { title: string; description?: string; variant?: ToastVariant }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    ({
      title,
      description,
      variant = 'info',
    }: {
      title: string;
      description?: string;
      variant?: ToastVariant;
    }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setItems((prev) => [...prev.slice(-3), { id, title, description, variant }]);
      window.setTimeout(() => {
        dismiss(id);
      }, 4200);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-full max-w-sm flex-col gap-2"
      >
        {items.map((item) => (
          <div
            key={item.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 rounded-xl border border-border bg-card p-3.5 text-foreground shadow-lg"
          >
            <div className="mt-0.5 shrink-0">
              {item.variant === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : item.variant === 'error' ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
              ) : (
                <Info className="h-4 w-4 text-sky-500" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-snug">{item.title}</p>
              {item.description && (
                <p className="mt-0.5 text-xs text-muted">{item.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              aria-label="Dismiss notification"
              className="rounded-md p-1 text-muted transition-colors hover:bg-card-muted hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
