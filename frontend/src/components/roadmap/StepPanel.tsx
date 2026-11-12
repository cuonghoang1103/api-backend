'use client';

/**
 * Khung bên của MỘT bước lộ trình. Thứ tự có chủ đích:
 *   1. Học ngay trên CuongThai — bài học / slide / mô phỏng / Code Lab đúng bước này (bấm là mở thẳng, cùng tab).
 *   2. Giảng giải — bài đọc tự đủ (Markdown) để hiểu bước này mà không cần rời trang.
 *   3. Đọc thêm — link ngoài cũ (giữ nguyên) + nguồn bổ sung.
 * Bài đọc tải riêng (GET /roadmaps/:slug/nodes/:id) để trang lộ trình ~300 bước không phải chở vài trăm KB chữ.
 */
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Check, Circle, ExternalLink, GitBranch, Loader2, X, Lightbulb, BookOpenText, Sparkles,
  GraduationCap, Library, Star,
} from 'lucide-react';
import { roadmapApi, type ResourceItemT, type RoadmapLessonT, type RoadmapNodeBodyT, type RoadmapNodeT } from '@/lib/api';
import { roadmapIcon } from './icons';
import { LESSON_KIND, RES_KIND, type Lang, type Strings } from './roadmapUi';

const ChatMarkdown = dynamic(() => import('@/components/chat/ChatMarkdown'), {
  ssr: false,
  loading: () => <div className="h-24 animate-pulse rounded-xl" style={{ background: 'var(--bg-surface)' }} />,
});

const boNhoBody = new Map<string, RoadmapNodeBodyT>();

/** Liên kết "đề xuất" cũ của bước (Code Lab track / khoá / lộ trình khác) — hiện như một chỗ học nữa. */
function linkCu(n: RoadmapNodeT, s: Strings): (RoadmapLessonT & { external?: boolean }) | null {
  if (!n.linkType || !n.linkRef) return null;
  const ten = n.linkRef.replace(/-/g, ' ');
  if (n.linkType === 'code-lab') return { href: `/code-lab/${n.linkRef}`, ten, nguon: s.trackLabel['code-lab'], kieu: 'code-lab' };
  if (n.linkType === 'course') return { href: `/courses/${n.linkRef}`, ten, nguon: s.trackLabel.course, kieu: 'bai-doc' };
  if (n.linkType === 'roadmap') return { href: `/roadmap/${n.linkRef}`, ten, nguon: s.trackLabel.roadmap, kieu: 'trang' };
  if (n.linkType === 'external') {
    const ngoai = /^https?:\/\//.test(n.linkRef);
    return { href: n.linkRef, ten: ngoai ? n.linkRef.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] : ten, nguon: s.trackLabel.external, kieu: 'trang', external: ngoai };
  }
  return null;
}

// Bấm bài học KHÔNG đóng khung: ?buoc=<id> phải còn trên URL để Back về đúng bước này (đóng khung lúc đang chuyển
// trang còn làm replaceState cắt ngang lượt điều hướng của Next — đo 12/11: bấm bài mà trang đứng yên).
function LessonCard({ l, lang, s, featured }: { l: RoadmapLessonT & { external?: boolean }; lang: Lang; s: Strings; featured?: boolean }) {
  const k = LESSON_KIND[l.kieu] ?? LESSON_KIND['bai-doc'];
  const Icon = k.icon;
  const inner = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: `${k.color}1f`, color: k.color }}>
        <Icon size={19} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: k.color }}>
          {featured && <><Star size={10} className="fill-current" /> {s.recommended} ·</>}
          {lang === 'en' ? k.en : k.vi}
          {l.academy && (
            <span className="rounded px-1 py-px text-[10px] font-bold normal-case tracking-normal" style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-secondary)' }}>
              {s.academy}{l.ma ? ` · ${l.ma}` : ''}
            </span>
          )}
        </span>
        <span className="mt-0.5 line-clamp-2 block text-sm font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>{l.ten}</span>
        {l.nguon && <span className="mt-0.5 block truncate text-xs" style={{ color: 'var(--text-muted, var(--text-secondary))' }}>{l.nguon}</span>}
      </span>
      {l.external ? <ExternalLink size={15} className="shrink-0 opacity-50" /> : <ArrowRight size={16} className="shrink-0 opacity-40 transition group-hover:translate-x-0.5 group-hover:opacity-90" />}
    </>
  );
  const cls = 'group flex items-center gap-3 rounded-2xl border p-3 transition hover:-translate-y-0.5 hover:shadow-lg';
  const style = { borderColor: featured ? `${k.color}66` : 'var(--border-color)', background: 'var(--bg-card)' };
  if (l.external) {
    return <a href={l.href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>{inner}</a>;
  }
  return (
    <div className="group/l relative">
      <Link href={l.href} className={cls} style={style}>{inner}</Link>
      <a href={l.href} target="_blank" rel="noopener noreferrer" title={s.newTab} aria-label={s.newTab}
        className="absolute right-9 top-1/2 hidden -translate-y-1/2 rounded-md p-1 opacity-0 transition hover:!opacity-100 focus:opacity-100 group-hover/l:opacity-60 sm:block"
        style={{ color: 'var(--text-secondary)' }}>
        <ExternalLink size={13} />
      </a>
    </div>
  );
}

function ResourceRow({ r, lang }: { r: ResourceItemT; lang: Lang }) {
  const m = RES_KIND[r.type] || RES_KIND.article;
  const noiBo = r.url.startsWith('/');
  const cls = 'group flex items-start gap-2.5 rounded-xl px-2.5 py-2 transition hover:bg-[var(--bg-surface-hover)]';
  const body = (
    <>
      <span className="mt-0.5 shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: `${m.color}22`, color: m.color }}>{lang === 'en' ? m.en : m.vi}</span>
      <span className="flex-1 text-sm leading-snug" style={{ color: 'var(--text-primary)' }}>{r.title}</span>
      {noiBo ? <ArrowRight size={13} className="mt-1 shrink-0 opacity-40" /> : <ExternalLink size={13} className="mt-1 shrink-0 opacity-40 transition group-hover:opacity-80" />}
    </>
  );
  return noiBo
    ? <Link href={r.url} className={cls}>{body}</Link>
    : <a href={r.url} target="_blank" rel="noopener noreferrer" className={cls}>{body}</a>;
}

function SectionTitle({ icon: Icon, title, sub, color }: { icon: typeof Lightbulb; title: string; sub?: string; color: string }) {
  return (
    <div className="mb-3 flex items-start gap-2.5">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: `${color}1c`, color }}><Icon size={15} /></span>
      <div>
        <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        {sub && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{sub}</p>}
      </div>
    </div>
  );
}

export default function StepPanel({
  slug, node, stageLabel, stageNo, color, lang, s, isDone, isAuthenticated, toggling, onToggleDone, onClose, onPrev, onNext, posLabel,
}: {
  slug: string; node: RoadmapNodeT; stageLabel: string; stageNo: number; color: string; lang: Lang; s: Strings;
  isDone: boolean; isAuthenticated: boolean; toggling: boolean;
  onToggleDone: () => void; onClose: () => void; onPrev: (() => void) | null; onNext: (() => void) | null; posLabel: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [chiTiet, setChiTiet] = useState<RoadmapNodeBodyT | null>(() => boNhoBody.get(`${slug}:${node.id}`) ?? null);
  const [dangTai, setDangTai] = useState(false);
  const cuon = useRef<HTMLDivElement>(null);
  useEffect(() => setMounted(true), []);

  // Esc đóng, ←/→ chuyển bước (trừ khi đang gõ trong ô nhập).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onNext, onPrev]);

  // Khoá cuộn trang nền khi khung mở.
  useEffect(() => {
    const cu = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = cu; };
  }, []);

  useEffect(() => {
    cuon.current?.scrollTo({ top: 0 });
    const k = `${slug}:${node.id}`;
    const co = boNhoBody.get(k);
    if (co) { setChiTiet(co); return; }
    setChiTiet(null);
    if (!node.hasBody) return;
    let alive = true;
    setDangTai(true);
    roadmapApi.node(slug, node.id)
      .then((res) => { const d = res.data.data; if (d) boNhoBody.set(k, d); if (alive) setChiTiet(d ?? null); })
      .catch(() => {})
      .finally(() => alive && setDangTai(false));
    return () => { alive = false; };
  }, [slug, node.id, node.hasBody]);

  if (!mounted) return null;
  const Icon = roadmapIcon(node.icon);
  const lessons = node.lessons ?? [];
  const cu = linkCu(node, s);
  const trungCu = cu && lessons.some((l) => l.href === cu.href);
  const resources = node.resources ?? [];
  const free = resources.filter((r) => !r.premium);
  const premium = resources.filter((r) => r.premium);
  const body = chiTiet?.body?.trim();

  return createPortal(
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[200] flex justify-end bg-black/50 backdrop-blur-[2px]" onClick={onClose}>
      <motion.aside
        initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 40, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 360, damping: 34 }}
        onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={node.title}
        className="flex h-full w-full max-w-[760px] flex-col border-l shadow-2xl"
        style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>

        {/* Đầu khung */}
        <header className="relative shrink-0 overflow-hidden border-b px-5 pb-4 pt-4 sm:px-7" style={{ borderColor: 'var(--border-color)' }}>
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(120% 140% at 0% 0%, ${color}26, transparent 60%)` }} />
          <div className="relative flex items-center justify-between gap-3">
            <p className="min-w-0 truncate text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              <span className="mr-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white" style={{ background: color }}>{stageNo}</span>
              {stageLabel} <span className="opacity-60">· {posLabel}</span>
            </p>
            <div className="flex shrink-0 items-center gap-1">
              <button type="button" onClick={onPrev ?? undefined} disabled={!onPrev} aria-label={s.prev} title={`${s.prev} (←)`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-[var(--bg-surface-hover)] disabled:opacity-30" style={{ color: 'var(--text-secondary)' }}>
                <ArrowLeft size={16} />
              </button>
              <button type="button" onClick={onNext ?? undefined} disabled={!onNext} aria-label={s.nextStep} title={`${s.nextStep} (→)`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-[var(--bg-surface-hover)] disabled:opacity-30" style={{ color: 'var(--text-secondary)' }}>
                <ArrowRight size={16} />
              </button>
              <button type="button" onClick={onClose} aria-label={s.close} title={`${s.close} (Esc)`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-[var(--bg-surface-hover)]" style={{ color: 'var(--text-secondary)' }}>
                <X size={18} />
              </button>
            </div>
          </div>
          <div className="relative mt-3 flex items-start gap-3.5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg" style={{ background: isDone ? 'linear-gradient(135deg,#22c55e,#15803d)' : `linear-gradient(135deg, ${color}, ${color}b3)` }}>
              {isDone ? <Check size={22} /> : <Icon size={22} />}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-extrabold leading-tight tracking-tight sm:text-2xl" style={{ color: 'var(--text-primary)' }}>{node.title}</h2>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                {node.subtitle && <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{node.subtitle}</span>}
                {node.kind === 'alternative' && <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: '#06b6d41f', color: '#0891b2' }}><GitBranch size={10} /> {s.branch}</span>}
                {node.kind === 'info' && <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-secondary)' }}><Lightbulb size={10} /> {s.concept}</span>}
                {isDone && <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: '#22c55e1f', color: '#16a34a' }}><Check size={10} /> {s.markedDone}</span>}
              </div>
            </div>
          </div>
        </header>

        {/* Thân khung */}
        <div ref={cuon} className="min-h-0 flex-1 space-y-7 overflow-y-auto px-5 py-6 sm:px-7">
          {(lessons.length > 0 || (cu && !trungCu)) && (
            <section>
              <SectionTitle icon={GraduationCap} title={s.learnHere} sub={s.learnHereSub} color={color} />
              <div className="grid gap-2.5">
                {lessons.map((l, i) => <LessonCard key={l.href} l={l} lang={lang} s={s} featured={i === 0} />)}
                {cu && !trungCu && <LessonCard l={cu} lang={lang} s={s} featured={lessons.length === 0} />}
              </div>
            </section>
          )}

          <section>
            <SectionTitle icon={BookOpenText} title={s.readHere} color={color} />
            {node.description && !body && (
              <p className="mb-3 text-[15px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>{node.description}</p>
            )}
            {dangTai ? (
              <div className="space-y-2">
                {[92, 100, 76, 88].map((w, i) => <div key={i} className="h-3.5 animate-pulse rounded" style={{ width: `${w}%`, background: 'var(--bg-surface)' }} />)}
              </div>
            ) : body ? (
              <div className="roadmap-doc rounded-2xl border px-4 py-4 text-[15px] leading-relaxed sm:px-5" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
                <ChatMarkdown content={body} />
              </div>
            ) : (
              <p className="flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs" style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                <Sparkles size={13} className="mt-0.5 shrink-0" /> {s.noBody}
              </p>
            )}
          </section>

          {resources.length > 0 && (
            <section>
              <SectionTitle icon={Library} title={s.moreReading} sub={s.moreReadingSub} color="#64748b" />
              <div className="rounded-2xl border p-1.5" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
                {free.map((r, i) => <ResourceRow key={`f${i}`} r={r} lang={lang} />)}
                {premium.length > 0 && (
                  <>
                    <p className="px-2.5 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#a855f7' }}>{s.premium}</p>
                    {premium.map((r, i) => <ResourceRow key={`p${i}`} r={r} lang={lang} />)}
                  </>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Chân khung */}
        <footer className="shrink-0 border-t px-5 py-3 sm:px-7" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-primary)' }}>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onToggleDone} disabled={toggling}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-semibold transition disabled:opacity-60"
              style={{
                borderColor: isDone ? '#22c55e66' : 'var(--border-color)',
                background: isDone ? '#22c55e1a' : 'var(--bg-card)',
                color: isDone ? '#16a34a' : 'var(--text-primary)',
              }}>
              {toggling ? <Loader2 size={15} className="animate-spin" /> : isDone ? <Check size={15} /> : <Circle size={15} />}
              {isDone ? s.markedDone : s.markDone}
            </button>
            {onNext && (
              <button type="button" onClick={onNext}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                style={{ background: color }}>
                {s.nextStep} <ArrowRight size={15} />
              </button>
            )}
          </div>
          {!isAuthenticated && <p className="pt-2 text-center text-[11px]" style={{ color: 'var(--text-secondary)' }}>{s.loginToSave}</p>}
        </footer>
      </motion.aside>
    </motion.div>,
    document.body,
  );
}
