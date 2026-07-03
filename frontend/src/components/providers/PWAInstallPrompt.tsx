'use client';

import { useEffect, useState } from 'react';
import { X, Share, Plus, Download } from 'lucide-react';

// Lightweight, dismissible "install this app" banner (2026-07-03).
//
// Two paths, because iOS Safari does NOT support beforeinstallprompt:
//   • Android / Chromium → capture `beforeinstallprompt`, show a one-tap
//     "Install" button that calls prompt().
//   • iOS Safari → show a hint to use Share → "Add to Home Screen".
// Never shown when already installed (display-mode: standalone) or on
// desktop. Dismissal is remembered for 14 days.

const DISMISS_KEY = 'pwa-install-dismissed-at';
const DISMISS_DAYS = 14;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function recentlyDismissed(): boolean {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY) || '0');
    return Date.now() - at < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export default function PWAInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // iOS Safari exposes standalone on navigator, not matchMedia.
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;
    if (recentlyDismissed()) return;

    // Only bother on touch / small screens.
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (!isMobile) return;

    const onBeforeInstall = (e: Event) => {
      e.preventDefault(); // stop Chrome's mini-infobar; we show our own
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);

    // iOS Safari: no beforeinstallprompt — detect and show the manual hint.
    const ua = window.navigator.userAgent;
    const isIos = /iphone|ipad|ipod/i.test(ua);
    const isSafari = /safari/i.test(ua) && !/crios|fxios|edgios/i.test(ua);
    if (isIos && isSafari) {
      const t = window.setTimeout(() => {
        setShowIosHint(true);
        setVisible(true);
      }, 3000);
      return () => {
        window.removeEventListener('beforeinstallprompt', onBeforeInstall);
        window.clearTimeout(t);
      };
    }

    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  // While the banner is up, hide the AI robot FAB (globals.css rule keyed on
  // this class) — they float in the same bottom-right band.
  useEffect(() => {
    const cls = 'pwa-banner-open';
    if (visible) document.documentElement.classList.add(cls);
    else document.documentElement.classList.remove(cls);
    return () => document.documentElement.classList.remove(cls);
  }, [visible]);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice.catch(() => undefined);
    setDeferred(null);
    dismiss();
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 z-[90] px-3"
      style={{
        // Sit above the mobile bottom nav + safe area, AND above the AI
        // robot FAB band (which floats at nav + music-offset + 12px with a
        // ~64px body) so the banner never covers the robot or its bubble.
        bottom:
          'calc(var(--app-bottom-nav-h, 0px) + env(safe-area-inset-bottom, 0px) + var(--music-offset, 0px) + 88px)',
      }}
      role="dialog"
      aria-label="Cài đặt ứng dụng"
    >
      <div
        className="mx-auto flex max-w-md items-center gap-3 rounded-2xl border p-3 shadow-xl backdrop-blur-md"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border-light)',
          color: 'var(--text-primary)',
        }}
      >
        <img
          src="/android-chrome-192x192.png"
          alt="CuongThai"
          className="h-10 w-10 shrink-0 rounded-xl"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Cài CuongThai lên màn hình chính</p>
          {showIosHint ? (
            <p
              className="mt-0.5 flex items-center gap-1 text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              Bấm <Share className="inline h-3.5 w-3.5" /> rồi chọn “Thêm vào MH chính”
              <Plus className="inline h-3.5 w-3.5" />
            </p>
          ) : (
            <p className="mt-0.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
              Dùng như một app — mở nhanh, toàn màn hình, tự cập nhật.
            </p>
          )}
        </div>
        {!showIosHint && deferred && (
          <button
            onClick={install}
            className="flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            <Download className="h-4 w-4" />
            Cài đặt
          </button>
        )}
        <button
          onClick={dismiss}
          aria-label="Đóng"
          className="shrink-0 rounded-lg p-1.5"
          style={{ color: 'var(--text-muted)' }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
