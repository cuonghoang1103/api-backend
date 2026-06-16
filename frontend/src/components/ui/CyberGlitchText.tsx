'use client';

import { useEffect, useRef } from 'react';

type GlitchTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p' | 'div' | 'a';

interface CyberGlitchTextProps {
  children: React.ReactNode;
  as?: GlitchTag;
  className?: string;
  enabled?: boolean;
  interval?: number;
}

/**
 * CyberGlitchText — renders text with a glitch animation.
 *
 * Uses CSS clip-path glitch animation. The glitch fires periodically
 * rather than continuously to avoid distraction.
 */
export default function CyberGlitchText({
  children,
  as: Tag = 'span',
  className = '',
  enabled = true,
  interval = 4000,
}: CyberGlitchTextProps) {
  const ref = useRef<HTMLElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const el = ref.current;

    const trigger = () => {
      el.classList.add('glitch-active');
      timeoutRef.current = setTimeout(() => {
        el.classList.remove('glitch-active');
        timeoutRef.current = setTimeout(trigger, interval + Math.random() * 2000);
      }, 400);
    };

    timeoutRef.current = setTimeout(trigger, interval);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [enabled, interval]);

  const text = typeof children === 'string' ? children : '';

  return (
    // Tag is a dynamic HTML element (h1/h2/span/...). The union of all
    // possible ref types blows up TypeScript's "too complex" heuristic
    // (TS2590). We suppress the per-element check and use `unknown`
    // because the ref is forwarded by the caller, who knows which
    // element type they expect.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag
      ref={ref as any}
      className={`glitch-text ${className}`}
      data-text={text}
    >
      {children}
    </Tag>
  );
}
