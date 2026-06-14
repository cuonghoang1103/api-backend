'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          'error-callback'?: () => void;
          'expired-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact' | 'flexible';
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

interface TurnstileWidgetProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark' | 'auto';
}

/**
 * Cloudflare Turnstile invisible CAPTCHA widget.
 * Renders a small badge in the corner; user doesn't need to click.
 *
 * Reference: https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
 */
export function TurnstileWidget({
  siteKey,
  onVerify,
  onError,
  onExpire,
  theme = 'dark',
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (!scriptReady || !containerRef.current || !window.turnstile) return;

    if (widgetIdRef.current) {
      try {
        window.turnstile.remove(widgetIdRef.current);
      } catch {
        // ignore
      }
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token) => onVerify(token),
      'error-callback': () => onError?.(),
      'expired-callback': () => onExpire?.(),
      theme,
      size: 'flexible',
    });

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptReady, siteKey, theme]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
        strategy="lazyOnload"
        onLoad={() => setScriptReady(true)}
      />
      <div
        ref={containerRef}
        className="cf-turnstile"
        data-sitekey={siteKey}
        data-theme={theme}
        data-size="flexible"
      />
    </>
  );
}
