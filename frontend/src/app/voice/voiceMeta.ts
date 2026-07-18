import type { VoiceType } from '@/lib/api';

/** Shared type metadata for Voice Hub — labels, emojis, accent gradients. */
export const VOICE_TYPE_META: Record<VoiceType, { label: string; emoji: string; accent: string }> = {
  VLOG: { label: 'Vlog', emoji: '🎬', accent: 'from-neon-indigo to-neon-violet' },
  REACTION: { label: 'Reaction', emoji: '😮', accent: 'from-neon-fuchsia to-neon-red' },
  CODE_EXP: { label: 'Kinh nghiệm code', emoji: '💻', accent: 'from-neon-cyan to-neon-indigo' },
  PODCAST: { label: 'Podcast', emoji: '🎙️', accent: 'from-neon-orange to-neon-fuchsia' },
  TUTORIAL: { label: 'Tutorial', emoji: '📚', accent: 'from-neon-emerald to-neon-cyan' },
};

export const VOICE_TYPE_ORDER: VoiceType[] = ['VLOG', 'REACTION', 'CODE_EXP', 'PODCAST', 'TUTORIAL'];

export function typeMeta(t: string) {
  return VOICE_TYPE_META[t as VoiceType] ?? { label: t, emoji: '🎥', accent: 'from-neon-indigo to-neon-violet' };
}

/** Poster image for a card: explicit thumbnail, else YouTube's, else null. */
export function posterFor(p: { thumbnailUrl: string | null; youtubeId: string | null; mediaKind: string }): string | null {
  if (p.thumbnailUrl) return p.thumbnailUrl;
  if (p.youtubeId) return `https://i.ytimg.com/vi/${p.youtubeId}/hqdefault.jpg`;
  return null;
}

export function formatDuration(sec: number | null): string {
  if (!sec || sec <= 0) return '';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatVoiceDate(iso: string | null): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}
