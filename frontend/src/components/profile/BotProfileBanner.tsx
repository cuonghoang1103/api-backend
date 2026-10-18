'use client';

/**
 * BotProfileBanner — the polished hero shown at the top of an automated
 * news-bot's profile (Claude Mini / Codex X / Gemini Mini / Antigravity Mini
 * / CuongMini). Replaces the normal cover+avatar header for bot accounts.
 *
 * Shows a larger animated version of the bot avatar on an ANIMATED gradient
 * background (slow drifting glow), the bot name, a "🤖 Tài khoản bot tự động"
 * note, and the tagline "Bot bản tin của CuongThai — <mô tả>". The bot's
 * posts render below it (owned by ProfileDetail, unchanged).
 *
 * All colours derive from the bot's accent; light + dark safe; the drift
 * animation is disabled under prefers-reduced-motion (see globals rule below,
 * plus the inline style guard).
 */

import type { BotMeta } from '@/lib/botRegistry';

function hexToRgba(hex: string, alpha: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return `rgba(79,91,213,${alpha})`;
  const int = parseInt(m[1], 16);
  return `rgba(${(int >> 16) & 255},${(int >> 8) & 255},${int & 255},${alpha})`;
}

export function BotProfileBanner({
  bot,
  displayName,
  followerCount,
}: {
  bot: BotMeta;
  displayName: string;
  followerCount?: number;
}) {
  const accent = bot.accent;
  return (
    <section
      aria-label={`Trang bot ${bot.name}`}
      className="relative overflow-hidden rounded-2xl border border-darkborder"
      style={{
        background: `linear-gradient(135deg, ${hexToRgba(accent, 0.9)} 0%, ${hexToRgba(accent, 0.55)} 45%, rgba(17,17,30,0.92) 100%)`,
      }}
    >
      {/* Animated gradient glow — two slow-drifting radial blobs. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bot-banner-drift"
        style={{
          background: `radial-gradient(circle at 20% 30%, ${hexToRgba(accent, 0.55)}, transparent 42%), radial-gradient(circle at 82% 70%, ${hexToRgba('#ffffff', 0.18)}, transparent 46%)`,
        }}
      />
      {/* subtle dark veil for text contrast in both themes */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

      <div className="relative z-10 flex flex-col items-center gap-4 px-6 py-8 sm:flex-row sm:items-center sm:gap-6 sm:py-10">
        {/* Large animated avatar on a soft ring */}
        <div
          className="shrink-0 rounded-full p-1.5 shadow-2xl"
          style={{ background: hexToRgba('#ffffff', 0.18), boxShadow: `0 10px 40px ${hexToRgba(accent, 0.5)}` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bot.avatar}
            alt={`Ảnh đại diện ${bot.name}`}
            width={132}
            height={132}
            className="h-[120px] w-[120px] rounded-full bg-white/10 object-cover sm:h-[132px] sm:w-[132px]"
          />
        </div>

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <h1 className="text-2xl font-bold text-white drop-shadow sm:text-3xl">{displayName || bot.name}</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
              🤖 Bot
            </span>
          </div>
          <p className="mt-0.5 text-sm text-white/80">@{bot.username}</p>

          <p className="mt-2 text-[15px] font-medium text-white/95">
            Bot bản tin của CuongThai — {bot.tagline}
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm text-white/85 sm:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1 backdrop-blur-sm">
              <span aria-hidden>🤖</span> Tài khoản bot tự động
            </span>
            {typeof followerCount === 'number' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-black/25 px-3 py-1 backdrop-blur-sm">
                <strong className="font-semibold text-white">{followerCount}</strong> người theo dõi
              </span>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .bot-banner-drift {
          animation: bot-banner-drift 14s ease-in-out infinite alternate;
        }
        @keyframes bot-banner-drift {
          0% {
            transform: translate3d(-4%, -3%, 0) scale(1.05);
          }
          100% {
            transform: translate3d(4%, 3%, 0) scale(1.15);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .bot-banner-drift {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
