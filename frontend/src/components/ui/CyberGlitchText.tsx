'use client';

import { useEffect, useRef } from 'react';

interface CyberGlitchTextProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
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
    // @ts-expect-error - dynamic tag with ref
    <Tag
      ref={ref}
      className={`glitch-text ${className}`}
      data-text={text}
    >
      {children}
    </Tag>
  );
}
