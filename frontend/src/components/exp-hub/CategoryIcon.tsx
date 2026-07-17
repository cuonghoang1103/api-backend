'use client';

// CategoryIcon — resolves a SnippetCategory's `icon` field to a visual:
//   • http(s) URL        → <img> (uploaded R2 image)
//   • a Lucide icon name → the matching Lucide component (used by the seeded
//                          top groups: Server / Database / …)
//   • null / unknown     → a colored initial badge derived from name + color
//
// Theme-aware: the fallback badge uses the category's own `color` (or a
// slug-derived hue) so it looks the same in light and dark.

import {
  Server, LayoutDashboard, Database, Container, TerminalSquare,
  Smartphone, Wrench, Brain, Folder, Code2, Cloud, Cpu, Boxes,
  type LucideIcon,
} from 'lucide-react';

// Names we seed on the top-level groups (plus a few sensible extras admins
// might type). Anything not here falls back to the initial badge.
const LUCIDE: Record<string, LucideIcon> = {
  Server, LayoutDashboard, Database, Container, TerminalSquare,
  Smartphone, Wrench, Brain, Folder, Code2, Cloud, Cpu, Boxes,
};

// Deterministic hue from a string — used when a category has no color set.
function hueFromString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return h;
}

export function CategoryIcon({
  name,
  icon,
  color,
  size = 20,
  className = '',
}: {
  name: string;
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

  // 2) Named Lucide icon
  if (icon && LUCIDE[icon]) {
    const Ico = LUCIDE[icon];
    return <Ico className={`shrink-0 ${className}`} style={{ width: size, height: size, color: accent }} />;
  }

  // 3) Initial badge (first meaningful letter)
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
