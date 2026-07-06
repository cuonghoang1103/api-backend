'use client';
/**
 * MoneyFlow — shared UI primitives.
 * Theme via CSS vars (never Tailwind `dark:`). Money-semantic accents:
 * income/positive = green, expense/debt = red/orange, savings = blue,
 * investment = purple. All animations respect prefers-reduced-motion.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn, formatVnd } from '@/lib/utils';

// ─── Count-up number (respects reduced motion) ───────────────
export function CountUp({ value, className, format = formatVnd }: { value: number | string; className?: string; format?: (n: number) => string }) {
  const reduced = useReducedMotion();
  const target = typeof value === 'string' ? Number(value) || 0 : value;
  const [display, setDisplay] = useState(reduced ? target : 0);
  const raf = useRef<number>();

  useEffect(() => {
    if (reduced) { setDisplay(target); return; }
    const from = display;
    const start = performance.now();
    const dur = 550;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (target - from) * eased);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, reduced]);

  return <span className={className}>{format(Math.round(display))}</span>;
}

// ─── Card ────────────────────────────────────────────────────
export function Card({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 shadow-sm',
        onClick && 'cursor-pointer transition-colors hover:border-neon-violet/50',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function StatCard({ label, value, accent = 'default', sub, format }: {
  label: string; value: number | string; sub?: ReactNode; format?: (n: number) => string;
  accent?: 'income' | 'expense' | 'savings' | 'debt' | 'default';
}) {
  const color = {
    income: 'text-neon-green', expense: 'text-neon-orange', savings: 'text-neon-cyan',
    debt: 'text-neon-red', default: 'text-text-primary',
  }[accent];
  return (
    <Card className="min-w-0">
      <div className="text-xs font-medium text-text-muted truncate">{label}</div>
      <div className={cn('mt-1 text-xl sm:text-2xl font-heading font-bold tabular-nums truncate', color)}>
        <CountUp value={value} format={format} />
      </div>
      {sub && <div className="mt-1 text-xs text-text-muted">{sub}</div>}
    </Card>
  );
}

// ─── Progress bar (budget etc.) ──────────────────────────────
export function ProgressBar({ ratio, status }: { ratio: number; status?: 'ok' | 'warn' | 'over' | string }) {
  const reduced = useReducedMotion();
  const color = status === 'over' ? 'bg-neon-red' : status === 'warn' ? 'bg-neon-orange' : 'bg-neon-green';
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--border-color)]">
      <motion.div
        className={cn('h-full rounded-full', color)}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, ratio)}%` }}
        transition={{ duration: reduced ? 0 : 0.5, ease: 'easeOut' }}
      />
    </div>
  );
}

// ─── Buttons / inputs ────────────────────────────────────────
export function Button({ children, onClick, variant = 'primary', type = 'button', className, disabled }: {
  children: ReactNode; onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean; className?: string;
  variant?: 'primary' | 'ghost' | 'danger' | 'outline';
}) {
  const styles = {
    primary: 'bg-neon-violet text-white hover:bg-neon-violet/90',
    danger: 'bg-neon-red text-white hover:bg-neon-red/90',
    ghost: 'text-text-secondary hover:bg-[var(--border-color)]',
    outline: 'border border-[var(--border-color)] text-text-primary hover:border-neon-violet/50',
  }[variant];
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={cn('inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed', styles, className)}>
      {children}
    </button>
  );
}

export const inputCls = 'w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-text-primary outline-none focus:border-neon-violet transition-colors';

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-text-secondary">{label}</span>
      {children}
    </label>
  );
}

// ─── Modal / bottom sheet ────────────────────────────────────
export function Sheet({ open, onClose, title, children, size = 'md' }: {
  open: boolean; onClose: () => void; title?: string; children: ReactNode; size?: 'md' | 'lg';
}) {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[70] bg-black/55" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.15 } }} onClick={onClose} />
          <motion.div
            role="dialog" aria-modal="true"
            className={cn(
              'fixed z-[71] bg-[var(--bg-card)] shadow-2xl',
              'inset-x-0 bottom-0 max-h-[92dvh] overflow-y-auto rounded-t-3xl',
              'sm:inset-auto sm:right-1/2 sm:top-1/2 sm:max-h-[85dvh] sm:w-full sm:translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl',
              size === 'lg' ? 'sm:max-w-2xl' : 'sm:max-w-md',
            )}
            initial={reduced ? { opacity: 0 } : { y: '100%' }}
            animate={reduced ? { opacity: 1 } : { y: 0 }}
            exit={reduced ? { opacity: 0 } : { y: '100%', transition: { duration: 0.2 } }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.25 }}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-3">
              <h3 className="font-heading font-semibold text-text-primary">{title}</h3>
              <button onClick={onClose} className="rounded-lg p-1.5 text-text-muted hover:bg-[var(--border-color)]"><X size={18} /></button>
            </div>
            <div className="p-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Misc ────────────────────────────────────────────────────
export function EmptyState({ icon, title, hint, action }: { icon?: ReactNode; title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--border-color)] py-12 text-center">
      {icon && <div className="text-3xl opacity-70">{icon}</div>}
      <div className="font-medium text-text-secondary">{title}</div>
      {hint && <div className="max-w-xs text-sm text-text-muted">{hint}</div>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-text-muted">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-neon-violet border-t-transparent" />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}

export function Pill({ children, tone = 'default' }: { children: ReactNode; tone?: 'green' | 'red' | 'orange' | 'violet' | 'default' }) {
  const styles = {
    green: 'bg-neon-green/15 text-neon-green', red: 'bg-neon-red/15 text-neon-red',
    orange: 'bg-neon-orange/15 text-neon-orange', violet: 'bg-neon-violet/15 text-neon-violet',
    default: 'bg-[var(--border-color)] text-text-secondary',
  }[tone];
  return <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', styles)}>{children}</span>;
}
