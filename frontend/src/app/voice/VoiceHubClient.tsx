'use client';

/**
 * Voice Hub — public index (client).
 *
 * A cinematic feed of the admin's Vlogs / Reactions / Coding-experience /
 * Podcasts / Tutorials. Featured hero + type filter + series filter + search
 * over a responsive card grid. Read-only; posting is admin-only elsewhere.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Play, Eye, Heart, MessageSquare, Loader2, Radio, Youtube, Video, Mic } from 'lucide-react';
import { voiceApi, type VoicePostCard, type VoiceSeries, type VoiceType } from '@/lib/api';
import { VOICE_TYPE_ORDER, typeMeta, posterFor, formatDuration, formatVoiceDate } from './voiceMeta';

function MediaIcon({ kind, className }: { kind: string; className?: string }) {
  if (kind === 'YOUTUBE') return <Youtube className={className} />;
  if (kind === 'AUDIO') return <Mic className={className} />;
  return <Video className={className} />;
}

function Poster({ post, big = false }: { post: VoicePostCard; big?: boolean }) {
  const src = posterFor(post);
  const meta = typeMeta(post.type);
  const dur = formatDuration(post.durationSec);
  return (
    <div className={['relative overflow-hidden rounded-2xl border border-darkborder bg-darkbg', big ? 'aspect-video' : 'aspect-video'].join(' ')}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={post.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      ) : (
        <div className={['absolute inset-0 bg-gradient-to-br', meta.accent, 'opacity-30'].join(' ')} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Play affordance */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="w-14 h-14 rounded-full bg-white/90 text-black flex items-center justify-center shadow-lg">
          <Play className="w-6 h-6 fill-current ml-0.5" />
        </span>
      </div>

      {/* Type chip */}
      <span className={['absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold text-white bg-black/50 border border-white/10 backdrop-blur-md'].join(' ')}>
        <span>{meta.emoji}</span>
        <span>{meta.label}</span>
      </span>

      {/* Media kind + duration */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        {dur && <span className="px-1.5 py-0.5 rounded-md text-[11px] font-semibold text-white bg-black/70">{dur}</span>}
        <span className="w-7 h-7 rounded-md bg-black/60 text-white flex items-center justify-center">
          <MediaIcon kind={post.mediaKind} className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}

function Card({ post }: { post: VoicePostCard }) {
  return (
    <Link href={`/voice/${post.slug}`} className="group block">
      <Poster post={post} />
      <div className="mt-3 flex gap-3">
        {post.author?.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.author.avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-indigo to-neon-violet shrink-0 mt-0.5" />
        )}
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold text-text-primary leading-snug line-clamp-2 group-hover:text-neon-violet transition-colors">
            {post.title}
          </h3>
          {post.series && <p className="mt-0.5 text-xs text-neon-violet truncate">{post.series.title}</p>}
          <div className="mt-1 flex items-center gap-3 text-[11px] text-text-muted">
            <span className="inline-flex items-center gap-1"><Eye className="w-3 h-3" />{post.viewCount}</span>
            <span className="inline-flex items-center gap-1"><Heart className="w-3 h-3" />{post.likeCount}</span>
            <span className="inline-flex items-center gap-1"><MessageSquare className="w-3 h-3" />{post.commentCount}</span>
            <span className="truncate">· {formatVoiceDate(post.publishedAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function VoiceHubClient() {
  const [posts, setPosts] = useState<VoicePostCard[]>([]);
  const [featured, setFeatured] = useState<VoicePostCard | null>(null);
  const [series, setSeries] = useState<VoiceSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<VoiceType | 'ALL'>('ALL');
  const [activeSeries, setActiveSeries] = useState<string>('');
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 350);
    return () => clearTimeout(t);
  }, [q]);

  // Series list loads once.
  useEffect(() => {
    voiceApi.series().then((r) => setSeries(r.data.data)).catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await voiceApi.list({
        size: 48,
        type: type === 'ALL' ? undefined : type,
        series: activeSeries || undefined,
        q: debouncedQ || undefined,
      });
      const list = r.data.data.posts;
      // The first pinned/featured item becomes the hero when no filter is active.
      if (type === 'ALL' && !activeSeries && !debouncedQ) {
        const hero = list.find((p) => p.isFeatured) ?? list.find((p) => p.isPinned) ?? list[0] ?? null;
        setFeatured(hero);
        setPosts(hero ? list.filter((p) => p.id !== hero.id) : list);
      } else {
        setFeatured(null);
        setPosts(list);
      }
    } catch {
      setPosts([]);
      setFeatured(null);
    } finally {
      setLoading(false);
    }
  }, [type, activeSeries, debouncedQ]);

  useEffect(() => { load(); }, [load]);

  const tabs = useMemo(() => ['ALL', ...VOICE_TYPE_ORDER] as const, []);

  return (
    <div className="min-h-screen pt-24 pb-24" style={{ background: '#0a0a0f' }}>
      {/* Decorative glow */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-neon-indigo/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-neon-fuchsia/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-violet/10 border border-neon-violet/20 text-neon-violet text-xs font-semibold mb-3">
            <Radio className="w-3.5 h-3.5" /> Voice · Kênh chia sẻ
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-text-primary tracking-tight">
            Voice — Vlog, Reaction & Kinh nghiệm code
          </h1>
          <p className="mt-3 text-text-secondary max-w-2xl">
            Nơi mình chia sẻ hành trình làm nghề: vlog, reaction, kinh nghiệm lập trình và podcast. Xem trực tiếp ngay tại đây.
          </p>
        </header>

        {/* Search + type filter */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm video, chủ đề, tag…"
              className="w-full pl-9 pr-3 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 focus:ring-2 focus:ring-neon-violet/15 transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => {
              const active = type === t;
              const label = t === 'ALL' ? 'Tất cả' : typeMeta(t).label;
              const emoji = t === 'ALL' ? '✨' : typeMeta(t).emoji;
              return (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={[
                    'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-all',
                    active
                      ? 'bg-gradient-to-r from-neon-indigo to-neon-violet text-white border-transparent shadow-neon'
                      : 'bg-white/[0.03] text-text-secondary border-darkborder hover:border-neon-violet/30 hover:text-text-primary',
                  ].join(' ')}
                >
                  <span>{emoji}</span> {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Series pills */}
        {series.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveSeries('')}
              className={['px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors', !activeSeries ? 'bg-neon-violet/15 text-neon-violet border-neon-violet/30' : 'bg-white/[0.03] text-text-muted border-darkborder hover:text-text-secondary'].join(' ')}
            >
              Mọi series
            </button>
            {series.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSeries(activeSeries === s.slug ? '' : s.slug)}
                className={['px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors', activeSeries === s.slug ? 'bg-neon-violet/15 text-neon-violet border-neon-violet/30' : 'bg-white/[0.03] text-text-muted border-darkborder hover:text-text-secondary'].join(' ')}
              >
                {s.title}{s._count ? ` (${s._count.posts})` : ''}
              </button>
            ))}
          </div>
        )}

        {/* Hero featured */}
        {featured && (
          <Link href={`/voice/${featured.slug}`} className="group block mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center rounded-3xl border border-darkborder bg-darkcard/40 p-4 sm:p-6">
              <Poster post={featured} big />
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold text-white bg-gradient-to-r from-neon-fuchsia to-neon-red">
                  ⭐ Nổi bật
                </span>
                <h2 className="mt-3 text-2xl sm:text-3xl font-heading font-bold text-text-primary leading-tight group-hover:text-neon-violet transition-colors">
                  {featured.title}
                </h2>
                {featured.summary && <p className="mt-3 text-text-secondary line-clamp-3">{featured.summary}</p>}
                <div className="mt-4 flex items-center gap-4 text-sm text-text-muted">
                  <span className="inline-flex items-center gap-1"><Eye className="w-4 h-4" />{featured.viewCount}</span>
                  <span className="inline-flex items-center gap-1"><Heart className="w-4 h-4" />{featured.likeCount}</span>
                  <span className="inline-flex items-center gap-1"><MessageSquare className="w-4 h-4" />{featured.commentCount}</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-text-muted gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Đang tải…
          </div>
        ) : posts.length === 0 && !featured ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-3">🎬</div>
            <p className="text-text-secondary">Chưa có nội dung nào ở đây.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8">
            {posts.map((p) => <Card key={p.id} post={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
