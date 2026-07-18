'use client';

// CategoryIcon — resolves a SnippetCategory's icon to a visual, in priority:
//   1. http(s) URL           → <img> (uploaded R2 image)
//   2. a Lucide icon name     → the matching Lucide component (top groups)
//   3. BRAND_LOGOS[slug]      → real brand SVG logo (Node.js, PostgreSQL, …)
//   4. null / unknown         → a colored initial badge
//
// Theme-aware: brand logos whose brand color is near-black/near-white render
// with `currentColor` so they stay visible in both light and dark themes.

import {
  Server, LayoutDashboard, Database, Container, TerminalSquare,
  Smartphone, Wrench, Brain, Folder, Code2, Cloud, Cpu, Boxes,
  Network, ShieldCheck, Gamepad2, FlaskConical, Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { BRAND_LOGOS } from './brandLogos';

const LUCIDE: Record<string, LucideIcon> = {
  Server, LayoutDashboard, Database, Container, TerminalSquare,
  Smartphone, Wrench, Brain, Folder, Code2, Cloud, Cpu, Boxes,
  Network, ShieldCheck, Gamepad2, FlaskConical, Sparkles,
};

function hueFromString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return h;
}

// Relative luminance (0..1) of a #rrggbb hex — used to decide when a brand
// color is too dark/light to show as-is against the theme background.
function luminance(hex: string): number {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return 0.5;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

export function CategoryIcon({
  name,
  slug,
  icon,
  color,
  size = 20,
  className = '',
}: {
  name: string;
  slug?: string | null;
  icon?: string | null;
  color?: string | null;
  size?: number;
  className?: string;
}) {
  const accent = color || `hsl(${hueFromString(name)} 70% 50%)`;

  // 1) Uploaded image
  if (icon && /^https?:\/\//i.test(icon)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={icon}
        alt=""
        width={size}
        height={size}
        className={`shrink-0 rounded object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  // 2) Named Lucide icon (top groups)
  if (icon && LUCIDE[icon]) {
    const Ico = LUCIDE[icon];
    return <Ico className={`shrink-0 ${className}`} style={{ width: size, height: size, color: accent }} />;
  }

  // 3) Real brand logo (technologies)
  const brand = slug ? BRAND_LOGOS[slug] : undefined;
  if (brand) {
    const lum = luminance(brand.h);
    // Near-black or near-white brand marks flip to currentColor so they read
    // in both themes; everything else keeps its authentic brand color.
    const fill = lum < 0.16 || lum > 0.9 ? 'currentColor' : brand.h;
    return (
      <svg
        role="img"
        aria-label={brand.t}
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={`shrink-0 ${className}`}
        style={{ width: size, height: size }}
        fill={fill}
      >
        <path d={brand.p} />
      </svg>
    );
  }

  // 4) Initial badge
  const initial = (name.trim()[0] || '?').toUpperCase();
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded font-bold text-white ${className}`}
      style={{
        width: size,
        height: size,
        background: accent,
        fontSize: Math.round(size * 0.52),
        lineHeight: 1,
      }}
    >
      {initial}
    </span>
  );
}
