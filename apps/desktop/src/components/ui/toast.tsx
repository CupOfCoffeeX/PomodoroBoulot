import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useToastStore, type Toast } from '@/store/toastStore';
import { useTimerStore } from '@/store/timerStore';

const DURATION = 5000;

function useToastLifecycle(toastId: string) {
  const remove = useToastStore((s) => s.remove);
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
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
    setTimeout(() => remove(toastId), 320);
  }

  return { visible, leaving, dismiss };
}

// ── Normal (full-size) toast ──────────────────────────────────────────────────

function ToastItem({ toast }: { toast: Toast }) {
  const { visible, leaving, dismiss } = useToastLifecycle(toast.id);

  return (
    <div
      style={{
        opacity: visible && !leaving ? 1 : 0,
        transform: visible && !leaving ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)',
        transition: 'opacity 280ms ease, transform 280ms ease',
      }}
      className="w-80 bg-card border border-border rounded-2xl shadow-xl overflow-hidden"
    >
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

        {toast.action && (
          <button
            onClick={() => { toast.action!.onClick(); dismiss(); }}
            className="mt-3 w-full text-xs font-medium py-1.5 px-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
          >
            {toast.action.label}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Compact overlay toast — fills the whole widget ───────────────────────────

function CompactToastOverlay({ toast }: { toast: Toast }) {
  const { visible, leaving, dismiss } = useToastLifecycle(toast.id);

  return (
    /* Same wrapper geometry as CompactLayout so it sits perfectly on top */
    <div className="fixed inset-0 z-50 p-[5px] flex pointer-events-none">
      <div
        style={{
          opacity: visible && !leaving ? 1 : 0,
          transform: visible && !leaving ? 'translateY(0) scale(1)' : 'translateY(6px) scale(0.98)',
          transition: 'opacity 240ms ease, transform 240ms ease',
        }}
        className={[
          'flex flex-1 overflow-hidden relative pointer-events-auto',
          'rounded-[20px]',
          'bg-[hsl(224,71%,6%)]/[0.95] backdrop-blur-2xl',
          'border border-white/[0.12]',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_12px_40px_rgba(0,0,0,0.6)]',
        ].join(' ')}
      >
        {/* Countdown bar — same position as widget progress bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/[0.05]">
          <div
            style={{
              width: visible ? '0%' : '100%',
              transition: visible ? `width ${DURATION}ms linear` : 'none',
            }}
            className="absolute inset-y-0 left-0 bg-primary/80"
          />
        </div>

        {/* Content row */}
        <div className="flex items-center gap-3 flex-1 min-w-0 pl-4 pr-2">
          <span className="text-lg leading-none flex-shrink-0">{toast.icon}</span>

          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-white/90 leading-tight truncate">
              {toast.title}
            </p>
            <p className="text-[11px] text-white/50 leading-tight truncate">{toast.message}</p>
          </div>

          {toast.action && (
            <button
              onClick={() => { toast.action!.onClick(); dismiss(); }}
              className="flex-shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-primary/20 hover:bg-primary/35 text-primary transition-colors"
            >
              {toast.action.label}
            </button>
          )}

          <button
            onClick={dismiss}
            className="flex-shrink-0 text-white/30 hover:text-white/70 transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Container ─────────────────────────────────────────────────────────────────

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const isCompact = useTimerStore((s) => s.isCompact);

  if (isCompact) {
    // In compact mode show only the most recent toast as a full-widget overlay
    const toast = toasts[toasts.length - 1];
    return toast ? <CompactToastOverlay key={toast.id} toast={toast} /> : null;
  }

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
