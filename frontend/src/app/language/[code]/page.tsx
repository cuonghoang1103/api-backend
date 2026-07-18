'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Type,
  BookOpen,
  GraduationCap,
  Headphones,
  MessagesSquare,
  Newspaper,
  HelpCircle,
  Flame,
  BarChart3,
  ArrowLeft,
  PenLine,
  Bot,
  NotebookPen,
  Route,
  Dumbbell,
  Languages,
  SpellCheck,
  PenTool,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { languageApi } from '@/lib/language-api';
import type { LanguageOverview } from '@/types/language';
import type { PracticeStateDto } from '@/lib/language-api';
import { EmptyState, useLangUser } from '@/components/language/primitives';
import { MascotScene } from '@/components/language/mascot/MascotScene';
import { useMotion, useCountUp } from '@/lib/motion';

/**
 * The skills, in learning order.
 *
 * `cat` names a colour FAMILY, not a colour: the actual values live in CSS
 * variables that flip with the theme (globals.css). Grouping several skills
 * under one family is deliberate — Nghe and Giao tiếp are both "ears and
 * mouth", and giving all twelve tiles a unique hue is how a page turns into
 * confetti.
 *
 * The old `n: 1..12` is gone. It was the tile's own position rendered into its
 * corner: a number that answered a question nobody asked.
 */
const SECTIONS = [
  { key: 'alphabet', label: 'Bảng chữ cái', desc: 'Chữ cái & phát âm', icon: Type, cat: 'alphabet' },
  { key: 'hanzi', label: 'Luyện viết chữ Hán', desc: 'Nét mẫu, tô theo & viết', icon: PenTool, cat: 'alphabet' },
  { key: 'vocab', label: 'Từ vựng', desc: 'Học từ theo chủ đề', icon: BookOpen, cat: 'vocab' },
  { key: 'grammar', label: 'Ngữ pháp', desc: 'Cấu trúc câu', icon: GraduationCap, cat: 'grammar' },
  { key: 'listening', label: 'Nghe', desc: 'Luyện nghe & shadowing', icon: Headphones, cat: 'listening' },
  { key: 'conversation', label: 'Giao tiếp', desc: 'Hội thoại hằng ngày', icon: MessagesSquare, cat: 'speaking' },
  { key: 'reading', label: 'Đọc', desc: 'Bài đọc & báo', icon: Newspaper, cat: 'reading' },
  { key: 'qna', label: 'Q&A', desc: 'Câu hỏi thường gặp', icon: HelpCircle, cat: 'reading' },
  { key: 'writing', label: 'Luyện viết', desc: 'AI chữa bài & chấm điểm', icon: PenLine, cat: 'ai' },
  { key: 'roleplay', label: 'Hội thoại AI', desc: 'Nhập vai tình huống', icon: Bot, cat: 'ai' },
  { key: 'translate', label: 'Dịch văn bản', desc: 'Dịch 2 chiều & giải thích', icon: Languages, cat: 'ai' },
  { key: 'grammar-check', label: 'Kiểm tra ngữ pháp', desc: 'Soi lỗi, chấm & sửa', icon: SpellCheck, cat: 'ai' },
] as const;

// Tailwind scans source as TEXT, so a class built at runtime from `s.cat` would
// never be generated. Every class this file can emit has to appear here whole.
const CAT_CLASS: Record<string, { bg: string; fg: string; icon: string }> = {
  alphabet: { bg: 'bg-cat-alphabet-bg', fg: 'text-cat-alphabet-fg', icon: 'text-cat-alphabet-icon' },
  vocab: { bg: 'bg-cat-vocab-bg', fg: 'text-cat-vocab-fg', icon: 'text-cat-vocab-icon' },
  grammar: { bg: 'bg-cat-grammar-bg', fg: 'text-cat-grammar-fg', icon: 'text-cat-grammar-icon' },
  listening: { bg: 'bg-cat-listening-bg', fg: 'text-cat-listening-fg', icon: 'text-cat-listening-icon' },
  speaking: { bg: 'bg-cat-speaking-bg', fg: 'text-cat-speaking-fg', icon: 'text-cat-speaking-icon' },
  reading: { bg: 'bg-cat-reading-bg', fg: 'text-cat-reading-fg', icon: 'text-cat-reading-icon' },
  ai: { bg: 'bg-cat-ai-bg', fg: 'text-cat-ai-fg', icon: 'text-cat-ai-icon' },
};

/**
 * Card chrome that does NOT depend on the palette.
 *
 * If a --cat-* variable ever fails to resolve, `background-color: var(--x)` is
 * simply invalid and the card paints transparent — which is exactly what
 * shipped once: a page of black rectangles with no edges, because the tile had
 * no other background and no border. The surface and ring below come from the
 * base theme, so the worst a broken palette can now do is make the tiles plain.
 */
const CARD_BASE = 'rounded-2xl bg-[var(--bg-card)] ring-1 ring-[var(--border-color)]';

// Kanji/hanzi only exist in Japanese and Chinese — showing the tile on English
// would promise a page with nothing in it.
const CJK_ONLY = new Set(['hanzi']);
const CJK_CODES = new Set(['ja', 'zh']);

const AI_SECTIONS = new Set(['writing', 'roleplay', 'translate', 'grammar-check']);

/** One stat, counted up on mount. `tint` colours the icon bubble (static classes). */
function StatChip({ icon, value, label, tint }: { icon: string; value: number; label: string; tint: string }) {
  const n = useCountUp(value);
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-[var(--bg-card)] px-3 py-2 ring-1 ring-[var(--border-color)] shadow-[var(--shadow-md)]">
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base leading-none ${tint}`}>{icon}</span>
      <div className="flex min-w-0 flex-col">
        <span className="font-round text-lg font-extrabold leading-none text-text-primary tabular-nums">{n}</span>
        <span className="mt-0.5 text-[10px] uppercase leading-none tracking-wide text-text-muted">{label}</span>
      </div>
    </div>
  );
}

/** Roadmap / Practice — the two primary entries. */
function HeroCard({ href, icon, title, desc, tone, m }: {
  href: string; icon: React.ReactNode; title: string; desc: string;
  tone: 'violet' | 'green'; m: ReturnType<typeof useMotion>;
}) {
  // Full literal classes — a runtime-built `group-hover:${c.fg}` would never be
  // generated (Tailwind scans source as text), same reason CAT_CLASS exists.
  const c = tone === 'violet'
    ? { ring: 'ring-neon-violet/30', bg: 'bg-neon-violet/10', fg: 'text-neon-violet', grad: 'from-neon-violet/10', hoverFg: 'group-hover:text-neon-violet' }
    : { ring: 'ring-neon-green/30', bg: 'bg-neon-green/10', fg: 'text-neon-green', grad: 'from-neon-green/10', hoverFg: 'group-hover:text-neon-green' };
  return (
    <motion.div {...m.cardHover} {...m.buttonPress} className="h-full">
      <Link href={href} className={`group relative flex h-full items-center gap-4 overflow-hidden rounded-3xl bg-[var(--bg-card)] p-5 ring-1 ${c.ring} shadow-[var(--shadow-md)] transition-shadow duration-200 hover:shadow-lg`}>
        <span className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${c.grad} to-transparent`} aria-hidden />
        <span className={`relative inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${c.bg} ${c.fg} transition-transform duration-200 group-hover:scale-110`}>
          {icon}
        </span>
        <div className="relative min-w-0 flex-1">
          <h3 className="font-round text-lg font-extrabold text-text-primary">{title}</h3>
          <p className="mt-0.5 text-xs leading-snug text-text-muted">{desc}</p>
        </div>
        <ChevronRight size={20} className={`relative shrink-0 text-text-muted transition-transform duration-200 group-hover:translate-x-1 ${c.hoverFg}`} />
      </Link>
    </motion.div>
  );
}

/** A labelled group of skill tiles. */
function SkillSection({ title, items, code, counts, loading, m, isAi }: {
  title: string;
  items: ReadonlyArray<(typeof SECTIONS)[number]>;
  code: string;
  counts: Record<string, number> | undefined;
  loading: boolean;
  m: ReturnType<typeof useMotion>;
  isAi?: boolean;
}) {
  if (!items.length) return null;
  return (
    <motion.section variants={m.childEnter} className="mb-6">
      <h2 className="mb-3 flex items-center gap-2 px-1 font-round text-sm font-extrabold uppercase tracking-wide text-text-muted">
        {isAi && <Sparkles size={14} className="text-cat-ai-icon" />}
        {title}
        <span className="rounded-full bg-[var(--bg-card)] px-2 py-0.5 text-[10px] font-bold tabular-nums text-text-muted ring-1 ring-[var(--border-color)]">
          {items.length}
        </span>
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((sec) => {
          const Icon = sec.icon;
          const cc = CAT_CLASS[sec.cat];
          const count = counts?.[sec.key] ?? 0;
          return (
            <motion.div key={sec.key} variants={m.childEnter} {...m.cardHover} {...m.buttonPress}>
              <Link href={`/language/${code}/${sec.key}`} className={`group flex h-full flex-col ${CARD_BASE} ${cc.bg} p-4 shadow-[var(--shadow-md)] transition-shadow duration-200 hover:shadow-lg`}>
                <span className={`mb-2.5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--bg-card)]/60 ${cc.icon} transition-transform duration-200 group-hover:scale-110`}>
                  <Icon size={24} />
                </span>
                <h3 className={`font-round font-extrabold leading-tight ${cc.fg}`}>{sec.label}</h3>
                <p className={`mt-0.5 text-xs leading-snug ${cc.fg} opacity-70`}>{sec.desc}</p>
                <span className="mt-auto pt-2.5">
                  {isAi ? (
                    <span className={`inline-flex items-center gap-1 rounded-full bg-[var(--bg-card)]/70 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${cc.fg}`}>
                      <Sparkles size={9} /> AI · Pro
                    </span>
                  ) : (
                    <span className={`inline-flex rounded-full bg-[var(--bg-card)]/70 px-2 py-0.5 text-[10px] font-bold ${cc.fg}`}>
                      {loading ? '…' : `${count} mục`}
                    </span>
                  )}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

export default function LanguageHomePage() {
  const params = useParams();
  const code = String(params.code);
  const { isAuthenticated } = useLangUser();
  const [lang, setLang] = useState<LanguageOverview | null>(null);
  const [due, setDue] = useState(0);
  const [st, setSt] = useState<PracticeStateDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    languageApi
      .overview(code)
      .then((res) => alive && setLang(res.data.data ?? null))
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [code]);

  useEffect(() => {
    if (!isAuthenticated) return;
    languageApi
      .reviewQueue(code)
      .then((res) => setDue(res.data.data?.count ?? 0))
      .catch(() => {});
    // Streak/XP/hearts for the hero chips. This reuses the Practice endpoint
    // rather than adding one for three numbers — it over-fetches the lesson
    // tree, but it is the same call the learner triggers one tap later, and a
    // second endpoint returning a subset of an existing one is a second thing
    // to keep in sync. Non-blocking: the chips appear when it lands.
    languageApi
      .practice(code)
      .then((res) => setSt(res.data.data?.state ?? null))
      .catch(() => {});
  }, [code, isAuthenticated]);

  const m = useMotion();
  const counts = useMemo(() => (lang?.counts ?? undefined) as Record<string, number> | undefined, [lang]);

  // Hanzi only exists in Japanese and Chinese — showing the tile on English
  // would promise a page with nothing in it.
  const visible = useMemo(
    () => SECTIONS.filter((sec) => !CJK_ONLY.has(sec.key) || CJK_CODES.has(code)),
    [code],
  );
  const learnSections = useMemo(() => visible.filter((sec) => !AI_SECTIONS.has(sec.key)), [visible]);
  const aiSections = useMemo(() => visible.filter((sec) => AI_SECTIONS.has(sec.key)), [visible]);

  if (!loading && !lang) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <EmptyState emoji="🔎" title="Không tìm thấy ngôn ngữ" hint="Ngôn ngữ này chưa tồn tại hoặc đã bị ẩn." />
        <div className="mt-6 text-center">
          <Link href="/language" className="text-neon-violet hover:underline">
            ← Về danh sách ngôn ngữ
          </Link>
        </div>
      </div>
    );
  }

  // pt-16 is deliberate: the bar below should abut the nav, and the notch is
  // already covered by .app-main.
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-16">
      {/* The STUCK position is the part that needs the nav's real height. A
          sticky element resolves `top` against the scrollport, so it never sees
          .app-main's safe-area padding: at a hard top-16 this bar parked BEHIND
          the nav on a notched PWA, where the nav is 4rem + inset. */}
      <div className="sticky top-[var(--app-nav-h)] z-20 border-b border-[var(--border-color)] bg-[var(--bg-glass)] backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-3 py-3 sm:px-5">
          <Link href="/language" className="text-text-muted hover:text-neon-violet" aria-label="Quay lại">
            <ArrowLeft size={20} />
          </Link>
          <span className="text-2xl">{lang?.flagEmoji ?? '🏳️'}</span>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-heading text-lg font-bold text-text-primary">{lang?.name ?? code}</h1>
          </div>
          {isAuthenticated && (
            <>
              <Link
                href={`/language/notebook?code=${code}`}
                className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-surface)] px-3 py-1.5 text-sm text-text-secondary ring-1 ring-[var(--border-color)] hover:text-neon-violet"
              >
                <NotebookPen size={15} /> Sổ tay
              </Link>
              <Link
                href={`/language/${code}/stats`}
                className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-surface)] px-3 py-1.5 text-sm text-text-secondary ring-1 ring-[var(--border-color)] hover:text-neon-violet"
              >
                <BarChart3 size={15} /> Thống kê
              </Link>
            </>
          )}
        </div>
      </div>

      <motion.div variants={m.pageEnter} initial="hidden" animate="show" className="mx-auto max-w-5xl px-3 py-6 sm:px-5">
        {/* ── Hero: mascot + 3 chỉ số. Ai vào trang cũng thấy tiến độ của
               mình trước, rồi mới đến việc phải làm. ── */}
        {isAuthenticated && st && (
          <motion.div
            variants={m.childEnter}
            className="mb-5 overflow-hidden rounded-3xl bg-[var(--bg-card)] ring-1 ring-[var(--border-color)] shadow-[var(--shadow-md)]"
          >
            <div className="flex flex-col gap-4 bg-gradient-to-br from-neon-violet/10 via-transparent to-neon-cyan/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="flex items-center gap-3">
                <MascotScene context={st.streak > 0 ? 'streak' : 'welcome'} size={64} />
                <div className="min-w-0">
                  <p className="font-round text-lg font-extrabold leading-tight text-text-primary">
                    {st.streak > 0 ? `Chuỗi ${st.streak} ngày rồi!` : 'Chào bạn quay lại 👋'}
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {st.streak > 0 ? 'Giữ lửa nhé — học tiếp hôm nay nào.' : 'Bắt đầu một chuỗi ngày học mới thôi.'}
                  </p>
                </div>
              </div>
              <div className="grid shrink-0 grid-cols-3 gap-2 sm:flex">
                <StatChip icon="🔥" value={st.streak} label="ngày" tint="bg-neon-orange/15" />
                <StatChip icon="⚡" value={st.xp} label="XP" tint="bg-neon-violet/15" />
                <StatChip icon="❤️" value={st.hearts} label="tim" tint="bg-neon-pink/15" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Roadmap + Practice — the two ways IN. Bigger than the skill tiles
            on purpose: a hub with fourteen equal cards has no entry point. */}
        <motion.div variants={m.childEnter} className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <HeroCard
            href={`/language/${code}/roadmap`}
            icon={<Route size={30} />}
            title="Lộ trình học"
            desc="Sơ đồ dẫn đường từ cơ bản đến nâng cao"
            tone="violet"
            m={m}
          />
          <HeroCard
            href={`/language/${code}/practice`}
            icon={<Dumbbell size={30} />}
            title="Luyện tập"
            desc="Bài tập kiểu Duolingo — XP, chuỗi ngày, vương miện"
            tone="green"
            m={m}
          />
        </motion.div>

        {isAuthenticated && due > 0 && (
          <motion.div variants={m.childEnter} className="mb-5">
            <Link
              href={`/language/${code}/vocab?mode=review`}
              className="flex items-center justify-center gap-2 rounded-2xl bg-neon-gradient px-4 py-3 font-round font-extrabold text-white shadow-neon transition hover:opacity-95"
            >
              <Flame size={18} /> Ôn tập ngay ({due} thẻ đến hạn)
            </Link>
          </motion.div>
        )}

        {/* Two sections, because a lesson and an AI tool are different promises:
            one has content waiting, the other needs Pro and writes something new. */}
        <SkillSection
          title="Học tập"
          items={learnSections}
          code={code}
          counts={counts}
          loading={loading}
          m={m}
        />
        <SkillSection
          title="Công cụ AI"
          items={aiSections}
          code={code}
          counts={counts}
          loading={loading}
          m={m}
          isAi
        />
      </motion.div>
    </div>
  );
}
