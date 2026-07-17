/**
 * Placeholder data for the new landing page (front door, English-only, dark).
 *
 * `videoUrl` is null for now — the marquee renders an animated gradient frame in
 * its place. When the admin promo-video upload lands (LandingPromo table), these
 * come from the API and each card plays a short muted loop instead of the frame.
 */
export interface LandingFeature {
  key: string;
  title: string;
  tagline: string;
  href: string;
  /** Tailwind-ready accent (hex) used for the card glow + label. */
  accent: string;
  /** Short muted promo clip; null until an admin uploads one. */
  videoUrl: string | null;
}

export const LANDING_FEATURES: LandingFeature[] = [
  { key: 'interview', title: 'Interview Simulator', tagline: 'Practice real interviews, graded by AI', href: '/interview', accent: '#8b5cf6', videoUrl: null },
  { key: 'language', title: 'Language Learning', tagline: 'English · Japanese · Chinese, with an AI tutor', href: '/language', accent: '#06b6d4', videoUrl: null },
  { key: 'cv', title: 'CV Builder', tagline: 'Craft an IT résumé that gets read', href: '/cv', accent: '#22c55e', videoUrl: null },
  { key: 'games', title: 'Playground', tagline: 'Quick games, real leaderboards', href: '/games', accent: '#f59e0b', videoUrl: null },
  { key: 'chat', title: 'AI Chat', tagline: 'Ask anything — code, ideas, docs', href: '/chat', accent: '#ec4899', videoUrl: null },
  { key: 'music', title: 'Music', tagline: 'Listen together, in real time', href: '/music', accent: '#38bdf8', videoUrl: null },
];
