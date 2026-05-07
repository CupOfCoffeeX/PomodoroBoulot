import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useToastStore, type Toast } from '@/store/toastStore';

const DURATION = 5000;

function ToastItem({ toast }: { toast: Toast }) {
  const remove = useToastStore((s) => s.remove);
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Trigger enter animation on next frame
    const raf = requestAnimationFrame(() => setVisible(true));
    timerRef.current = setTimeout(() => dismiss(), DURATION);
    return () => {
      cancelAnimationFrame(raf);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function dismiss() {
    if (leaving) return;
    setLeaving(true);
    setVisible(false);
    setTimeout(() => remove(toast.id), 320);
  }

  return (
    <div
      style={{
        opacity: visible && !leaving ? 1 : 0,
        transform: visible && !leaving ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)',
        transition: 'opacity 280ms ease, transform 280ms ease',
      }}
      className="w-80 bg-card border border-border rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Countdown bar */}
      <div className="h-0.5 bg-border relative overflow-hidden">
        <div
          style={{
            width: visible ? '0%' : '100%',
            transition: visible ? `width ${DURATION}ms linear` : 'none',
          }}
          className="absolute inset-y-0 left-0 bg-primary/60"
        />
      </div>

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl leading-none flex-shrink-0">{toast.icon}</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground leading-snug">{toast.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{toast.message}</p>
            </div>
          </div>
          <button
            onClick={dismiss}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-md hover:bg-muted mt-0.5"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Action */}
        {toast.action && (
          <button
            onClick={() => {
              toast.action!.onClick();
              dismiss();
            }}
            className="mt-3 w-full text-xs font-medium py-1.5 px-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
          >
            {toast.action.label}
          </button>
        )}
      </div>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} />
        </div>
      ))}
    </div>
  );
}
