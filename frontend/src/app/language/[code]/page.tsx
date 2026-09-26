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
  Target,
} from 'lucide-react';
import { languageApi } from '@/lib/language-api';
import type { LanguageOverview } from '@/types/language';
import type { PracticeStateDto } from '@/lib/language-api';
import { EmptyState, useLangUser } from '@/components/language/primitives';
import { useMotion, useCountUp } from '@/lib/motion';
import s from './hub.module.css';

/**
 * The skills, in learning order.
 *
 * No per-skill colour: the old hub gave every family its own tinted tile and
 * the page read as confetti. Hierarchy now comes from type, not hue — see
 * hub.module.css.
 *
 * The old `n: 1..12` is gone. It was the tile's own position rendered into its
 * corner: a number that answered a question nobody asked.
 */
const SECTIONS = [
  { key: 'alphabet', label: 'Bảng chữ cái', desc: 'Chữ cái & phát âm', icon: Type },
  { key: 'hanzi', label: 'Luyện viết chữ Hán', desc: 'Nét mẫu, tô theo & viết', icon: PenTool },
  { key: 'vocab', label: 'Từ vựng', desc: 'Học từ theo chủ đề', icon: BookOpen },
  { key: 'grammar', label: 'Ngữ pháp', desc: 'Cấu trúc câu', icon: GraduationCap },
  { key: 'listening', label: 'Nghe', desc: 'Luyện nghe & shadowing', icon: Headphones },
  { key: 'conversation', label: 'Giao tiếp', desc: 'Hội thoại hằng ngày', icon: MessagesSquare },
  { key: 'reading', label: 'Đọc', desc: 'Bài đọc & báo', icon: Newspaper },
  { key: 'qna', label: 'Q&A', desc: 'Câu hỏi thường gặp', icon: HelpCircle },
  { key: 'writing', label: 'Luyện viết', desc: 'AI chữa bài & chấm điểm', icon: PenLine },
  { key: 'roleplay', label: 'Hội thoại AI', desc: 'Nhập vai tình huống', icon: Bot },
  { key: 'translate', label: 'Dịch văn bản', desc: 'Dịch 2 chiều & giải thích', icon: Languages },
  { key: 'grammar-check', label: 'Kiểm tra ngữ pháp', desc: 'Soi lỗi, chấm & sửa', icon: SpellCheck },
] as const;

// Kanji/hanzi only exist in Japanese and Chinese — showing the tile on English
// would promise a page with nothing in it.
const CJK_ONLY = new Set(['hanzi']);
const CJK_CODES = new Set(['ja', 'zh']);

const AI_SECTIONS = new Set(['writing', 'roleplay', 'translate', 'grammar-check']);

/** One stat, counted up on mount. Plain numbers — no emoji bubbles. */
function Stat({ value, label }: { value: number; label: string }) {
  const n = useCountUp(value);
  return (
    <div className={s.stat}>
      <div className={s.statValue}>{n}</div>
      <div className={s.statLabel}>{label}</div>
    </div>
  );
}

/** Roadmap / Practice — the two primary entries. */
function StartCard({ href, icon, title, desc }: { href: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Link href={href} className={s.card}>
      <span className={s.cardIcon}>{icon}</span>
      <div className="min-w-0">
        <h3 className={s.cardTitle}>{title}</h3>
        <p className={s.cardDesc}>{desc}</p>
      </div>
      <ChevronRight size={18} className={s.chev} />
    </Link>
  );
}

/** A labelled group of skills, laid out as a table of contents. */
function SkillSection({ title, note, items, code, counts, loading, m, isAi }: {
  title: string;
  note?: string;
  items: ReadonlyArray<(typeof SECTIONS)[number]>;
  code: string;
  counts: Record<string, number> | undefined;
  loading: boolean;
  m: ReturnType<typeof useMotion>;
  isAi?: boolean;
}) {
  if (!items.length) return null;
  return (
    <motion.section variants={m.childEnter} className={s.section}>
      <div className={s.sectionHead}>
        <h2 className={s.h2}>{title}</h2>
        {note && <span className={s.sectionNote}>{note}</span>}
      </div>
      <div className={s.list}>
        {items.map((sec) => {
          const Icon = sec.icon;
          const count = counts?.[sec.key] ?? 0;
          return (
            <Link key={sec.key} href={`/language/${code}/${sec.key}`} className={s.row}>
              <span className={s.rowIcon}>
                <Icon size={19} strokeWidth={1.75} />
              </span>
              <div className={s.rowBody}>
                <h3 className={s.rowTitle}>{sec.label}</h3>
                <p className={s.rowDesc}>{sec.desc}</p>
              </div>
              {isAi ? (
                <span className={s.proTag}>PRO</span>
              ) : (
                <span className={s.rowMeta}>{loading ? '…' : `${count.toLocaleString('vi-VN')} mục`}</span>
              )}
              <ChevronRight size={16} className={s.chev} />
            </Link>
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
      <div className={s.root}>
        <div className={s.notFound}>
          <EmptyState emoji="🔎" title="Không tìm thấy ngôn ngữ" hint="Ngôn ngữ này chưa tồn tại hoặc đã bị ẩn." />
          <div className="mt-6">
            <Link href="/language" className={s.notFoundLink}>
              ← Về danh sách ngôn ngữ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const name = lang?.name ?? code.toUpperCase();
  const heading = st && st.streak > 0 ? `Ngày thứ ${st.streak} liên tiếp.` : 'Hôm nay học gì?';
  const lede = due > 0
    ? `Có ${due} thẻ từ vựng đến hạn ôn. Ôn trước, rồi học tiếp bài mới — trí nhớ giữ lâu hơn theo thứ tự đó.`
    : 'Đi theo lộ trình nếu muốn có người dẫn đường, hoặc chọn thẳng một kỹ năng bên dưới.';

  // padding-top on .root is deliberate: the bar below should abut the nav, and
  // the notch is already covered by .app-main.
  return (
    <div className={s.root}>
      {/* The STUCK position is the part that needs the nav's real height. A
          sticky element resolves `top` against the scrollport, so it never sees
          .app-main's safe-area padding: at a hard top-16 this bar parked BEHIND
          the nav on a notched PWA, where the nav is 4rem + inset. */}
      <div className={s.bar}>
        <div className={s.barInner}>
          <Link href="/language" className={s.back} aria-label="Quay lại">
            <ArrowLeft size={18} />
          </Link>
          <span className="text-lg leading-none">{lang?.flagEmoji ?? '🏳️'}</span>
          <span className={s.barTitle}>{name}</span>
          {isAuthenticated && (
            <>
              <Link href={`/language/notebook?code=${code}`} className={s.barLink}>
                <NotebookPen size={16} /> <span className={s.barLinkText}>Sổ tay</span>
              </Link>
              <Link href={`/language/${code}/stats`} className={s.barLink}>
                <BarChart3 size={16} /> <span className={s.barLinkText}>Thống kê</span>
              </Link>
            </>
          )}
        </div>
      </div>

      <motion.div variants={m.pageEnter} initial="hidden" animate="show" className={s.wrap}>
        {/* ── Đầu trang: tiến độ của mình trước, rồi mới đến việc phải làm. ── */}
        <motion.header variants={m.childEnter} className={s.head}>
          <div className="min-w-0">
            <p className={s.eyebrow}>{name} · Khoá của bạn</p>
            <h1 className={s.h1}>{heading}</h1>
            <p className={s.lede}>{lede}</p>
          </div>
          {isAuthenticated && st && (
            <div className={s.stats}>
              <Stat value={st.streak} label="ngày liên tiếp" />
              <Stat value={st.xp} label="điểm XP" />
              <Stat value={st.hearts} label="tim còn lại" />
            </div>
          )}
        </motion.header>

        {/* Ôn tập + Lộ trình + Luyện tập — the ways IN. Bigger than the skill
            rows on purpose: a hub with fourteen equal entries has no entry point. */}
        <motion.section variants={m.childEnter} className={s.section}>
          <div className={s.sectionHead}>
            <h2 className={s.h2}>Bắt đầu</h2>
          </div>
          {isAuthenticated && due > 0 && (
            <div className={s.review}>
              <div className="min-w-0">
                <p className={s.reviewTitle}>{due} thẻ đến hạn ôn tập</p>
                <p className={s.reviewDesc}>Lặp lại ngắt quãng — ôn đúng lúc sắp quên để nhớ lâu.</p>
              </div>
              <Link href={`/language/${code}/vocab?mode=review`} className={s.primaryBtn}>
                Ôn ngay <ChevronRight size={16} />
              </Link>
            </div>
          )}
          <div className={s.startGrid}>
            <StartCard
              href={`/language/${code}/roadmap`}
              icon={<Route size={22} strokeWidth={1.75} />}
              title="Lộ trình học"
              desc="Đi từng chặng từ cơ bản đến nâng cao"
            />
            <StartCard
              href={`/language/${code}/practice`}
              icon={<Dumbbell size={22} strokeWidth={1.75} />}
              title="Luyện tập"
              desc="Bài tập ngắn mỗi ngày, tính XP và chuỗi ngày"
            />
            {/* IELTS sống ở đây, không ở /tech-trends nữa: một chỗ học tiếng Anh. */}
            {code === 'en' && (
              <StartCard
                href="/language/en/ielts"
                icon={<Target size={22} strokeWidth={1.75} />}
                title="IELTS nền tảng"
                desc="15 ngày từ con số 0, có gia sư AI giảng từng trang"
              />
            )}
          </div>
        </motion.section>

        {/* Two sections, because a lesson and an AI tool are different promises:
            one has content waiting, the other needs Pro and writes something new. */}
        <SkillSection
          title="Kỹ năng"
          note={`${learnSections.length} phần`}
          items={learnSections}
          code={code}
          counts={counts}
          loading={loading}
          m={m}
        />
        <SkillSection
          title="Công cụ AI"
          note="Dành cho gói Pro"
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
