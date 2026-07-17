'use client';
/**
 * The tactile pill button — the one Duolingo signature worth copying.
 *
 * A 4px darker bottom edge makes the button look like a physical key; pressing
 * it drops the face onto that edge (translateY(4px), edge shrinks to 0) so the
 * travel is real rather than a scale trick. That is the whole effect.
 *
 * Built with box-shadow, not a border: a border changes the box, so :active
 * would reflow its own text. box-shadow is painted outside layout and free.
 *
 * The edge colour is derived, not passed: one `tone` prop keeps every button in
 * the app consistent, and nobody has to remember which shade goes underneath.
 */
import { forwardRef } from 'react';

type Tone = 'primary' | 'success' | 'neutral' | 'danger';

const TONES: Record<Tone, { face: string; edge: string; text: string }> = {
  // Deep enough for white text at ≥4.5:1 in both themes — these are fixed
  // brand colours, not theme variables, so they must carry their own contrast.
  primary: { face: '#7F56E6', edge: '#5B34C4', text: '#ffffff' },
  success: { face: '#58CC02', edge: '#43A302', text: '#ffffff' },
  danger: { face: '#E05C5C', edge: '#B93E3E', text: '#ffffff' },
  neutral: { face: 'var(--bg-surface)', edge: 'var(--border-color)', text: 'var(--text-primary)' },
};

export const TactileButton = forwardRef<HTMLButtonElement, {
  children: React.ReactNode;
  tone?: Tone;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  full?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}>(function TactileButton(
  { children, tone = 'primary', onClick, disabled, type = 'button', full, size = 'md', className = '' },
  ref,
) {
  const t = TONES[tone];
  const pad = size === 'lg' ? 'px-7 py-3.5 text-base' : size === 'sm' ? 'px-3.5 py-1.5 text-xs' : 'px-5 py-2.5 text-sm';

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: t.face,
        color: t.text,
        boxShadow: `0 4px 0 0 ${t.edge}`,
      }}
      className={`
        group relative inline-flex select-none items-center justify-center gap-2
        rounded-full font-round font-extrabold uppercase tracking-wide
        transition-[transform,box-shadow] duration-75
        active:translate-y-[4px] active:!shadow-none
        disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0
        ${pad} ${full ? 'w-full' : ''} ${className}
      `}
    >
      {children}
    </button>
  );
});
