'use client';

// Small presentational helpers shared across the Code Lab pages.
import Link from 'next/link';
import { Code2, Database, Server, Layout, Smartphone, Cloud, Cpu, Boxes, Terminal, Braces, Globe, Gamepad2, Shield, Binary, type LucideIcon } from 'lucide-react';
import { DIFFICULTY_META } from '@/lib/code-lab-api';
import type { CodeDifficulty, CodeLevel } from '@/types/code-lab';
import { CategoryIcon } from '@/components/exp-hub/CategoryIcon';

// Map a group/track slug or icon keyword to a Lucide glyph.
const ICONS: Record<string, LucideIcon> = {
  languages: Braces, backend: Server, frontend: Layout, database: Database,
  mobile: Smartphone, devops: Cloud, algorithms: Binary, 'algorithms-ds': Binary,
  web: Globe, game: Gamepad2, security: Shield, systems: Cpu, cloud: Cloud,
  boxes: Boxes, terminal: Terminal, code: Code2,
};

export function GroupGlyph({ slug, icon, size = 18, className }: { slug?: string; icon?: string | null; size?: number; className?: string }) {
  const key = (icon || slug || 'code').toLowerCase();
  const Cmp = ICONS[key] || (icon && ICONS[icon.toLowerCase()]) || Code2;
  return <Cmp size={size} className={className} />;
}

// Map a Code Lab track slug to the matching Exp Hub brand-logo key, so tracks
// show the SAME real brand SVGs (React, Python, Docker…) as Exp Hub. Slugs that
// already match a brand key pass through; unknowns fall back to a coloured
// initial badge inside CategoryIcon.
const TRACK_BRAND_ALIAS: Record<string, string> = {
  'aspnet-core': 'net-c',
  'django': 'django-fastapi',
  'fastapi': 'django-fastapi',
  'git': 'git-github',
  'laravel': 'php-laravel',
  'linux-bash': 'bash-zsh',
  'nodejs-express': 'nodejs',
  'python': 'python-backend',
  'swiftui-ios': 'ios-swift-swiftui',
  'tailwind-css': 'tailwindcss',
};

// A technology's brand icon (real logo when known). Used on track cards.
export function TechIcon({ slug, name, icon, color, size = 22 }: { slug: string; name: string; icon?: string | null; color?: string | null; size?: number }) {
  return <CategoryIcon name={name} slug={TRACK_BRAND_ALIAS[slug] || slug} icon={icon} color={color} size={size} />;
}

export function DifficultyBadge({ difficulty, small }: { difficulty: CodeDifficulty; small?: boolean }) {
  const m = DIFFICULTY_META[difficulty];
  return (
    <span
      className="inline-flex items-center rounded-full font-semibold"
      style={{
        color: m.color,
        background: m.bg,
        fontSize: small ? 10 : 11,
        padding: small ? '1px 7px' : '2px 9px',
        letterSpacing: 0.2,
      }}
    >
      {m.label}
    </span>
  );
}

const LEVEL_COLORS: Record<CodeLevel, string> = {
  BEGINNER: '#16a34a',
  INTERMEDIATE: '#d97706',
  ADVANCED: '#dc2626',
};

export function LevelPill({ level }: { level: CodeLevel }) {
  const c = LEVEL_COLORS[level];
  return (
    <span
      className="inline-flex items-center rounded-md text-[10px] font-semibold uppercase tracking-wide"
      style={{ color: c, border: `1px solid ${c}55`, padding: '1px 6px' }}
    >
      {level.toLowerCase()}
    </span>
  );
}

export function ProgressRing({ value, size = 40 }: { value: number; size?: number }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ * (1 - Math.max(0, Math.min(1, value)));
  return (
    <svg width={size} height={size} className="shrink-0" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border-color)" strokeWidth={4} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="#22c55e" strokeWidth={4} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={off}
        style={{ transition: 'stroke-dashoffset .5s ease' }}
      />
    </svg>
  );
}

export function TrackCard({ track }: { track: { slug: string; name: string; language: string; color?: string | null; icon?: string | null; description?: string | null; exerciseCount?: number; level: CodeLevel; groupSlug?: string } }) {
  const accent = track.color || '#6366f1';
  return (
    <Link
      href={`/code-lab/${track.slug}`}
      className="group flex flex-col rounded-xl border p-4 transition-all hover:-translate-y-0.5"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
    >
      <div className="mb-2 flex items-center gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ background: `${accent}1a`, color: accent }}
        >
          <TechIcon slug={track.slug} name={track.name} icon={track.icon} color={track.color} size={22} />
        </span>
        <div className="min-w-0">
          <div className="truncate font-semibold" style={{ color: 'var(--text-primary)' }}>{track.name}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{track.language}</div>
        </div>
      </div>
      {track.description && (
        <p className="mb-3 line-clamp-2 text-xs" style={{ color: 'var(--text-secondary)' }}>{track.description}</p>
      )}
      <div className="mt-auto flex items-center justify-between pt-1">
        <LevelPill level={track.level} />
        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          {track.exerciseCount ?? 0} exercises
        </span>
      </div>
    </Link>
  );
}
