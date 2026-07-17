'use client';

import { BRAND_LOGOS } from './brandLogos';

interface LanguageIconProps {
  language: string;
  className?: string;
  size?: number;
}

// A few language ids differ from the brand-logo slug.
const LANG_TO_BRAND: Record<string, string> = {
  js: 'javascript', ts: 'typescript', py: 'python', golang: 'go',
  'c++': 'cpp', node: 'nodejs', nodejs: 'nodejs', reactjs: 'react',
};

// Language color mapping
const LANGUAGE_COLORS: Record<string, string> = {
  javascript: '#f7df1e',
  typescript: '#3178c6',
  python: '#3776ab',
  java: '#ed8b00',
  go: '#00add8',
  rust: '#ce422b',
  c: '#a8b9cc',
  cpp: '#00599c',
  csharp: '#239120',
  php: '#777bb4',
  ruby: '#cc342d',
  swift: '#fa7343',
  kotlin: '#7f52ff',
  scala: '#dc322f',
  sql: '#e38c00',
  bash: '#4eaa25',
  shell: '#4eaa25',
  html: '#e34f26',
  css: '#1572b6',
  scss: '#cc6699',
  json: '#292929',
  yaml: '#cb171e',
  xml: '#f16529',
  markdown: '#083fa1',
  dockerfile: '#2496ed',
  vue: '#4fc08d',
  svelte: '#ff3e00',
  react: '#61dafb',
  graphql: '#e10098',
  r: '#276dc3',
  haskell: '#5e5086',
  elixir: '#6e4a7e',
  clojure: '#5881d8',
  dart: '#0175c2',
  lua: '#000080',
  perl: '#39457e',
  tcl: '#e0832a',
  powershell: '#012456',
  terraform: '#7b42bc',
};

// Short language name mapping
const LANGUAGE_NAMES: Record<string, string> = {
  javascript: 'JS',
  typescript: 'TS',
  python: 'PY',
  java: 'JV',
  go: 'GO',
  rust: 'RS',
  c: 'C',
  cpp: 'C++',
  csharp: 'C#',
  php: 'PHP',
  ruby: 'RB',
  swift: 'SW',
  kotlin: 'KT',
  scala: 'SC',
  sql: 'SQL',
  bash: 'SH',
  shell: 'SH',
  html: 'HTML',
  css: 'CSS',
  json: 'JSON',
  yaml: 'YAML',
  xml: 'XML',
  markdown: 'MD',
  dockerfile: 'DOCK',
  vue: 'VUE',
  svelte: 'SVT',
  react: 'REACT',
  graphql: 'GQL',
  r: 'R',
  haskell: 'HS',
  elixir: 'EX',
  clojure: 'CLJ',
  dart: 'DART',
  lua: 'LUA',
  perl: 'PERL',
  tcl: 'TCL',
  powershell: 'PS',
  terraform: 'TF',
};

export function LanguageIcon({ language, className = '', size = 24 }: LanguageIconProps) {
  const normalizedLang = language.toLowerCase();
  const color = LANGUAGE_COLORS[normalizedLang] || '#6b7280';
  const shortName = LANGUAGE_NAMES[normalizedLang] || language.slice(0, 4).toUpperCase();

  // Prefer a real brand logo when we have one for this language.
  const brand = BRAND_LOGOS[LANG_TO_BRAND[normalizedLang] ?? normalizedLang];
  if (brand) {
    // Sit the logo on a soft brand-tinted rounded tile for a consistent look.
    const dark = parseInt(brand.h.slice(1), 16) < 0x333333;
    return (
      <div
        className={`relative shrink-0 flex items-center justify-center rounded overflow-hidden ${className}`}
        style={{ width: size, height: size, background: `${brand.h}1f` }}
      >
        <svg viewBox="0 0 24 24" width={size * 0.68} height={size * 0.68} fill={dark ? 'var(--text-primary)' : brand.h} aria-label={brand.t}>
          <path d={brand.p} />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center rounded overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect width="100" height="100" fill={color} rx="4" />
        <text
          x="50"
          y="50"
          dominantBaseline="central"
          textAnchor="middle"
          fill="white"
          fontSize={size > 20 ? '24' : '16'}
          fontWeight="bold"
          fontFamily="monospace"
        >
          {shortName}
        </text>
      </svg>
    </div>
  );
}

// Badge style for larger display
export function LanguageBadge({ language, className = '' }: { language: string; className?: string }) {
  const normalizedLang = language.toLowerCase();
  const color = LANGUAGE_COLORS[normalizedLang] || '#6b7280';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium text-white ${className}`}
      style={{ backgroundColor: color }}
    >
      <span className="uppercase">{language}</span>
    </span>
  );
}
