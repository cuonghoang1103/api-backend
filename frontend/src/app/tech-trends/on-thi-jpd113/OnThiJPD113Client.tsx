'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  Check,
  ChevronDown,
  Clock,
  Target,
  BookOpen,
  Mic,
  FileText,
  ArrowLeft,
  RotateCcw,
  Eye,
  EyeOff,
  AlertTriangle,
  CalendarDays,
  ExternalLink,
  Trophy,
  Flame,
  ListChecks,
  Keyboard,
  Layers,
  Search,
  GraduationCap,
  Ear,
  Scissors,
  CalendarClock,
} from 'lucide-react';

import DrillPanel from './DrillPanel';
import VocabPanel from './VocabPanel';
import KanjiCardPanel from './KanjiCardPanel';
import KanjiNumberPanel from './KanjiNumberPanel';
import LessonPanel from './LessonPanel';
import FeBankPanel from './FeBankPanel';
import PersonalQAPanel from './PersonalQAPanel';
import ListeningPanel from './ListeningPanel';
import ReadAloudPanel from './ReadAloudPanel';
import { LESSONS } from './data/lessons';

import {
  PLAN,
  PHASES,
  DAILY_RITUAL,
  ALL_TASKS,
  TOTAL_MINUTES,
  CORE_MINUTES,
  RITUAL_MINUTES_PER_DAY,
  JPD123_TASKS,
  KIND_META,
  DEFAULT_START,
  START_STORAGE_KEY,
  dateForDay,
  dowForDate,
  EXAM_FE,
  EXAM_READING,
  EXAM_SPEAKING,
  lesson,
  dayMinutes,
  type StudyTask,
  type StudyDay,
} from './data/plan';
import { LISTEN_ITEM_COUNT } from './data/listening';
import {
  HIRAGANA,
  KATAKANA,
  DAKUTEN,
  YOUON,
  KATAKANA_DAKUTEN,
  KATAKANA_YOUON,
  SECTIONS,
  type KanaCell,
  type CheatTable,
} from './data/cheatsheet';
import {
  NAME_RULES,
  NAME_TABLE,
  SURNAME_TABLE,
  HANVIET_TABLE,
} from './data/names';
import {
  PROFILE_FIELDS,
  PROFILE_STORAGE_KEY,
  READINGS,
  TALK_QUESTIONS,
  TALK_GROUPS,
  PICTURE_SETS,
  PICTURE_RULE,
  fillAnswer,
} from './data/speaking';

/**
 * Trang ôn thi JPD113 — 02/08 → 06/08/2026.
 *
 * Ghi chú kỹ thuật:
 *  - Module /tech-trends cố ý dùng nền tối cố định. Ở đây KHÔNG dùng
 *    `text-text-primary` (biến theo theme) mà dùng màu tường minh
 *    (text-white / text-slate-300), nếu không thì người đọc đang ở
 *    theme sáng sẽ thấy chữ tối trên nền tối.
 *  - Tiến độ + hồ sơ cá nhân lưu ở localStorage, CHỈ đọc sau khi
 *    mount để server render và client render đầu tiên khớp nhau.
 */

/**
 * v2: lộ trình 5 ngày cũ đã hoàn thành vòng đời của nó (và kỳ thi đó đã trượt).
 * Giữ nguyên key v1 thì lộ trình 30 ngày mới mở ra đã tích sẵn một mớ việc từ đợt
 * nhồi tháng 8 — vừa sai sự thật vừa làm hỏng thanh tiến độ. Đổi key = bắt đầu sạch.
 */
const PROGRESS_KEY = 'jpd113:progress:v2';

/** Khoá tiến độ của một việc LẶP trong một ngày cụ thể: `<id>@2026-08-11` */
const ritualKey = (id: string, iso: string) => `${id}@${iso}`;

type TabId = 'plan' | 'listen' | 'read' | 'drill' | 'vocab' | 'cheat' | 'speak' | 'exam';

const TABS: { id: TabId; label: string; icon: typeof Target }[] = [
  { id: 'plan', label: 'Lộ trình 30 ngày', icon: CalendarDays },
  { id: 'listen', label: 'Nghe hiểu', icon: Ear },
  { id: 'read', label: 'Đọc to', icon: Scissors },
  { id: 'drill', label: 'Luyện gõ chữ', icon: Keyboard },
  { id: 'vocab', label: 'Từ vựng', icon: Layers },
  { id: 'cheat', label: 'Bảng tra cứu', icon: BookOpen },
  { id: 'speak', label: 'Thi nói & đọc', icon: Mic },
  { id: 'exam', label: 'Đề thi & mục tiêu', icon: FileText },
];

export default function OnThiJPD113Client() {
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<TabId>('plan');
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [profile, setProfile] = useState<Record<string, string>>({});
  const [coreOnly, setCoreOnly] = useState(false);
  const [openDay, setOpenDay] = useState<number | null>(null);
  const [today, setToday] = useState<string>('');
  const [start, setStart] = useState<string>(DEFAULT_START);

  /* ── Hydrate: localStorage + ngày hệ thống ─────────────────── */
  useEffect(() => {
    setMounted(true);
    const now = new Date();
    const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate(),
    ).padStart(2, '0')}`;
    setToday(iso);

    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch {
      /* dữ liệu hỏng — bỏ qua, coi như chưa có tiến độ */
    }
    try {
      const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (raw) setProfile(JSON.parse(raw));
    } catch {
      /* bỏ qua */
    }

    // Ngày bắt đầu do người học chọn. Chưa chọn thì lấy HÔM NAY — lộ trình đánh số
    // Ngày 1..30 nên bắt đầu lúc nào cũng chạy được, không có ngày nào "đã lỡ".
    let startISO = iso;
    try {
      const raw = localStorage.getItem(START_STORAGE_KEY);
      if (raw && /^\d{4}-\d{2}-\d{2}$/.test(raw)) startISO = raw;
    } catch {
      /* bỏ qua */
    }
    setStart(startISO);

    // Mở sẵn ngày hôm nay trong lộ trình; ngoài khoảng thì mở ngày đầu/cuối
    const idx = PLAN.findIndex((d) => dateForDay(startISO, d.n) === iso);
    setOpenDay(
      idx >= 0
        ? PLAN[idx].n
        : iso > dateForDay(startISO, PLAN.length)
          ? PLAN[PLAN.length - 1].n
          : PLAN[0].n,
    );
  }, []);

  const persistStart = useCallback((iso: string) => {
    setStart(iso);
    try {
      localStorage.setItem(START_STORAGE_KEY, iso);
    } catch {
      /* bỏ qua */
    }
  }, []);

  const persistDone = useCallback((next: Record<string, boolean>) => {
    setDone(next);
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
    } catch {
      /* hết quota / chế độ riêng tư — tiến độ chỉ còn trong phiên này */
    }
  }, []);

  const toggle = useCallback(
    (id: string) => {
      persistDone({ ...done, [id]: !done[id] });
    },
    [done, persistDone],
  );

  const persistProfile = useCallback((next: Record<string, string>) => {
    setProfile(next);
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* bỏ qua */
    }
  }, []);

  /* ── Số liệu tiến độ ───────────────────────────────────────── */
  const stats = useMemo(() => {
    const all = ALL_TASKS;
    const doneCount = all.filter((t) => done[t.id]).length;
    const core = all.filter((t) => t.tier === 'core');
    const coreDone = core.filter((t) => done[t.id]).length;
    const minutesDone = all.filter((t) => done[t.id]).reduce((s, t) => s + t.minutes, 0);
    return {
      total: all.length,
      doneCount,
      pct: all.length ? Math.round((doneCount / all.length) * 100) : 0,
      coreTotal: core.length,
      coreDone,
      corePct: core.length ? Math.round((coreDone / core.length) * 100) : 0,
      minutesDone,
    };
  }, [done]);

  /**
   * Việc LẶP tính theo TỪNG NGÀY, không dùng chung ô tích với việc một lần.
   * Nếu dùng chung thì tích xong hôm nay là cả 29 ngày còn lại hiện "đã xong" —
   * đúng thứ phản lại mục đích của một việc phải lặp lại mỗi ngày.
   */
  const ritualStats = useMemo(() => {
    if (!mounted || !today) return { todayDone: 0, fullDays: 0, grid: [] as boolean[] };
    const todayDone = DAILY_RITUAL.filter((t) => done[ritualKey(t.id, today)]).length;
    const grid = PLAN.map((d) => {
      const iso = dateForDay(start, d.n);
      return DAILY_RITUAL.every((t) => !!done[ritualKey(t.id, iso)]);
    });
    return { todayDone, fullDays: grid.filter(Boolean).length, grid };
  }, [done, mounted, today, start]);

  /** Hôm nay là Ngày thứ mấy của lộ trình (1..30); ngoài khoảng thì null */
  const dayNo = useMemo(() => {
    if (!today) return null;
    const diff = Math.round(
      (new Date(`${today}T00:00:00`).getTime() - new Date(`${start}T00:00:00`).getTime()) / 86_400_000,
    );
    return diff >= 0 && diff < PLAN.length ? diff + 1 : null;
  }, [today, start]);

  const resetProgress = () => {
    if (!confirm('Xoá toàn bộ tiến độ đã tích? Hành động này không hoàn tác được.')) return;
    persistDone({});
  };

  return (
    <div className="min-h-screen pt-24 pb-24" style={{ background: '#0a0a0f' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Link
          href="/tech-trends"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Tech Trends
        </Link>

        {/* ═══════════════ HERO ═══════════════ */}
        <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#151125] via-[#12101c] to-[#0d0b14] p-6 sm:p-9 mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-neon-violet/15 text-neon-violet border border-neon-violet/25">
              JPD113 · KỲ 3
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-neon-green/15 text-neon-green border border-neon-green/25">
              JPD123 · KỲ 4
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-neon-orange/15 text-neon-orange border border-neon-orange/25">
              30 NGÀY HỌC LẠI TỪ GỐC
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-bold text-white tracking-tight leading-[1.1] mb-4">
            Học lại tiếng Nhật —{' '}
            <span className="bg-gradient-to-r from-neon-violet via-neon-fuchsia to-neon-orange bg-clip-text text-transparent">
              một tháng xây lại nền
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mb-4">
            Lộ trình <b className="text-white">30 ngày</b> chạy TRƯỚC khi vào kỳ, học song song{' '}
            <b className="text-white">JPD113</b> (học lại cho chắc) và <b className="text-white">JPD123</b>{' '}
            (đi trước một bước) — để vào lớp là đã học rồi, mỗi buổi trên trường thành một buổi ôn.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed max-w-3xl mb-7">
            Lộ trình được viết lại từ biên bản kỳ thi trượt: <b className="text-slate-300">nghe không hiểu
            câu hỏi giám thị</b>, <b className="text-slate-300">đọc rời từng chữ và sai chữ Hán</b>,{' '}
            <b className="text-slate-300">không hiểu câu trắc nghiệm dịch ra gì</b>. Mỗi lỗi có một mạch
            luyện riêng chạy suốt 30 ngày.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              icon={<Flame className="w-4 h-4" />}
              label="Hôm nay"
              value={mounted ? (dayNo ? `Ngày ${dayNo}/30` : 'Ngoài lịch') : '—'}
              sub={mounted && dayNo ? PHASES.find((p) => p.n === PLAN[dayNo - 1].phase)?.name : 'chọn ngày bắt đầu'}
              accent="#fb923c"
            />
            <StatCard
              icon={<ListChecks className="w-4 h-4" />}
              label="Việc đã xong"
              value={mounted ? `${stats.doneCount}/${stats.total}` : '—'}
              sub={`${JPD123_TASKS} việc của JPD123`}
              accent="#4ade80"
            />
            <StatCard
              icon={<Clock className="w-4 h-4" />}
              label="Tổng thời lượng"
              value={`${Math.round(TOTAL_MINUTES / 60)}h`}
              sub={`+ ${RITUAL_MINUTES_PER_DAY}′ việc lặp mỗi ngày`}
              accent="#22d3ee"
            />
            <StatCard
              icon={<Ear className="w-4 h-4" />}
              label="Ngân hàng nghe"
              value={`${LISTEN_ITEM_COUNT}+`}
              sub="mục nghe · khu mới"
              accent="#facc15"
            />
          </div>

          {/* Thanh tiến độ */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400">
                Tiến độ tổng {mounted ? `· đã học ~${Math.round(stats.minutesDone / 60)}h` : ''}
              </span>
              <span className="font-semibold text-white">{mounted ? `${stats.pct}%` : '0%'}</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-neon-violet to-neon-fuchsia transition-all duration-500"
                style={{ width: mounted ? `${stats.pct}%` : '0%' }}
              />
            </div>
            <div className="flex items-center justify-between text-xs mt-3 mb-2">
              <span className="text-slate-400">Riêng phần CỐT LÕI (đủ để qua môn)</span>
              <span className="font-semibold text-neon-green">
                {mounted ? `${stats.coreDone}/${stats.coreTotal}` : '—'}
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-neon-green to-neon-emerald transition-all duration-500"
                style={{ width: mounted ? `${stats.corePct}%` : '0%' }}
              />
            </div>
          </div>
        </header>

        {/* ═══════════════ TABS ═══════════════ */}
        {/* Thanh tab dính mép trên. Phải có nền ĐỤC: chỉ blur thôi thì nội
            dung cuộn phía dưới vẫn lộ qua, đọc rất rối.
            Lưu ý: opacity phải là bước có sẵn của Tailwind (…/95) — `/92`
            không nằm trong scale nên class không được sinh ra chút nào. */}
        <nav className="flex flex-wrap gap-2 mb-8 sticky top-16 z-20 py-2.5 -mx-2 px-2 rounded-b-xl bg-[#0a0a0f]/95 backdrop-blur-md">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 border ${
                  active
                    ? 'bg-neon-violet/15 border-neon-violet/40 text-white'
                    : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </nav>

        {tab === 'plan' && (
          <PlanTab
            mounted={mounted}
            done={done}
            toggle={toggle}
            coreOnly={coreOnly}
            setCoreOnly={setCoreOnly}
            openDay={openDay}
            setOpenDay={setOpenDay}
            today={today}
            start={start}
            onStart={persistStart}
            ritualStats={ritualStats}
            onReset={resetProgress}
          />
        )}
        {tab === 'listen' && <ListeningPanel profile={profile} />}
        {tab === 'read' && <ReadAloudPanel />}
        {tab === 'drill' && <DrillPanel />}
        {tab === 'vocab' && <VocabPanel />}
        {tab === 'cheat' && <CheatTab />}
        {tab === 'speak' && <SpeakTab profile={profile} onProfile={persistProfile} mounted={mounted} />}
        {tab === 'exam' && <ExamTab />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB 1 — LỘ TRÌNH
   ═══════════════════════════════════════════════════════════════ */

function PlanTab({
  mounted,
  done,
  toggle,
  coreOnly,
  setCoreOnly,
  openDay,
  setOpenDay,
  today,
  start,
  onStart,
  ritualStats,
  onReset,
}: {
  mounted: boolean;
  done: Record<string, boolean>;
  toggle: (id: string) => void;
  coreOnly: boolean;
  setCoreOnly: (v: boolean) => void;
  openDay: number | null;
  setOpenDay: (v: number | null) => void;
  today: string;
  start: string;
  onStart: (iso: string) => void;
  ritualStats: { todayDone: number; fullDays: number; grid: boolean[] };
  onReset: () => void;
}) {
  return (
    <div className="space-y-8">
      {/* Vì sao trượt — và lộ trình mới chữa cái gì */}
      <section className="rounded-2xl border border-neon-orange/25 bg-neon-orange/[0.05] p-6">
        <h2 className="flex items-center gap-2 text-lg font-heading font-semibold text-white mb-4">
          <Target className="w-5 h-5 text-neon-orange" />
          Lần trước hỏng ở đâu — và lộ trình này chữa bằng cách nào
        </h2>
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <p>
            <b className="text-white">Nói thẳng: trượt không phải vì bạn kém, mà vì học dồn vào 5 ngày cuối.</b>{' '}
            Kana, nghe hiểu và phản xạ nói là ba thứ <b className="text-white">không nhồi được</b> — chúng cần
            thời gian ngấm. Nhồi 5 ngày thì đúng ba thứ đó sập, và đó chính xác là những gì đã xảy ra.
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            <VerdictCard
              tone="orange"
              title="Nghe — hỏng nặng nhất"
              body="Giám thị hỏi 4 câu, không câu nào nghe ra. Đây là dấu hiệu học tiếng Nhật hoàn toàn bằng MẮT. Chữa bằng khu Nghe hiểu mới: 10 phút mỗi ngày × 30 ngày = 5 giờ tai tiếp xúc với tiếng Nhật thật."
            />
            <VerdictCard
              tone="cyan"
              title="Đọc — sai kỹ thuật"
              body="Ngắt không trôi chảy, chữ Hán không thuộc, đọc rời từng chữ, sai âm ngắt っ và trường âm. Chữa bằng khu Đọc to mới: 13 bài cắt sẵn thành cụm, mỗi cụm có kana đầy đủ và bấm nghe riêng được."
            />
            <VerdictCard
              tone="green"
              title="Trắc nghiệm 3,7 — thiếu kỹ năng dịch"
              body="Khoanh mò vì không hiểu câu dịch ra gì. Đây là kỹ năng RIÊNG, luyện được: quy trình 4 bước khoanh trợ từ → tìm vị ngữ → đọc ngược từ cuối câu → ghép nghĩa. Rải suốt giai đoạn 3 và 4."
            />
          </div>
          <p className="pt-1">
            <b className="text-white">Vì sao học cả hai môn cùng lúc lại DỄ hơn:</b> JPD123 dùng lại toàn bộ
            kana, số, giờ và trợ từ của JPD113. Học JPD113 cho chắc trong tháng này thì một nửa JPD123 coi như
            đã xong. Mỗi ngày từ Ngày 11 có một khối JPD123 ngắn, và 6 ngày cuối dành hẳn cho nó.
          </p>
          <div className="rounded-xl border border-white/15 bg-black/25 p-4">
            <div className="text-xs font-bold text-white mb-2">
              Mỗi ngày khoảng 2,5–3,5 giờ. Nếu hôm nào chỉ có 1 giờ thì cắt theo thứ tự này:
            </div>
            <ol className="space-y-1.5 text-[13px] text-slate-300 leading-relaxed">
              <li>
                <b className="text-neon-green">1. KHÔNG BAO GIỜ BỎ</b> — 5 việc lặp hằng ngày bên dưới (55
                phút). Chúng nhỏ nhưng là thứ duy nhất chống rơi kiến thức. Bỏ chúng là quay lại đúng vết xe cũ.
              </li>
              <li>
                <b className="text-neon-cyan">2. Giữ nếu còn sức</b> — khối 1 của ngày hôm đó (phần lõi), và
                mọi việc gắn nhãn nghe.
              </li>
              <li>
                <b className="text-slate-400">3. Bỏ trước tiên</b> — mọi việc gắn nhãn “NÂNG ĐIỂM”. Bấm nút{' '}
                <b className="text-white">“Chỉ hiện việc CỐT LÕI”</b> bên dưới để ẩn chúng đi.
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Ngày bắt đầu */}
      <section className="rounded-2xl border border-neon-violet/25 bg-neon-violet/[0.05] p-5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-neon-violet" />
            <span className="text-sm font-bold text-white">Ngày bắt đầu lộ trình</span>
          </div>
          <input
            type="date"
            value={start}
            onChange={(e) => e.target.value && onStart(e.target.value)}
            className="px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-neon-violet/60 [color-scheme:dark]"
          />
          <span className="text-[13px] text-slate-400">
            Ngày 30 rơi vào{' '}
            <b className="text-white">{mounted ? fmtDate(dateForDay(start, PLAN.length)) : '—'}</b>
          </span>
        </div>
        <p className="text-[12px] text-slate-500 mt-2.5 leading-relaxed">
          Lộ trình đánh số Ngày 1..30 chứ không gắn cứng vào lịch, nên bắt đầu muộn vài hôm cũng không hỏng —
          chỉ cần đổi lại ngày ở đây. Ngày bắt đầu lưu trên máy bạn.
        </p>
      </section>

      {/* 5 giai đoạn */}
      <section>
        <h2 className="text-lg font-heading font-semibold text-white mb-4">Năm giai đoạn</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PHASES.map((p) => (
            <div
              key={p.n}
              className="rounded-2xl border p-4"
              style={{ borderColor: `${p.color}33`, background: `${p.color}0d` }}
            >
              <div className="flex items-baseline gap-2 mb-1.5">
                <span className="text-[11px] font-bold tracking-wider" style={{ color: p.color }}>
                  GĐ {p.n} · {p.range}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">{p.name}</h3>
              <p className="text-[13px] text-slate-400 leading-relaxed mb-2">{p.goal}</p>
              <p className="text-[12px] leading-relaxed" style={{ color: p.color }}>
                {p.fixes}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Việc lặp hằng ngày */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="flex items-center gap-2 text-lg font-heading font-semibold text-white mb-1">
          <RotateCcw className="w-5 h-5 text-neon-cyan" />
          Năm việc lặp mỗi ngày ({RITUAL_MINUTES_PER_DAY} phút)
        </h2>
        <p className="text-sm text-slate-400 mb-4">
          Làm đủ cả 30 ngày, ngoài lịch của từng ngày. Đây là phần quan trọng hơn cả lịch: kiến thức rơi vì
          không lặp, chứ không phải vì học chưa đủ sâu. Ô tích dưới đây tính riêng cho{' '}
          <b className="text-white">từng ngày</b> — sang ngày mới là tự trống lại.
        </p>

        {/* Lưới 30 ngày — ô sáng là ngày làm TRỌN cả 5 việc lặp */}
        <div className="rounded-xl border border-white/10 bg-black/25 p-4 mb-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
            <span className="text-[13px] text-slate-300">
              Hôm nay:{' '}
              <b className={ritualStats.todayDone === DAILY_RITUAL.length ? 'text-neon-green' : 'text-white'}>
                {mounted ? ritualStats.todayDone : 0}/{DAILY_RITUAL.length}
              </b>
            </span>
            <span className="text-[13px] text-slate-400">
              Trọn vẹn <b className="text-neon-cyan">{mounted ? ritualStats.fullDays : 0}</b>/30 ngày
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PLAN.map((d, i) => {
              const full = mounted && ritualStats.grid[i];
              const isToday = mounted && today === dateForDay(start, d.n);
              return (
                <span
                  key={d.n}
                  title={`Ngày ${d.n}`}
                  className={`w-5 h-5 rounded text-[9px] font-bold flex items-center justify-center ${
                    full
                      ? 'bg-neon-green text-black'
                      : isToday
                        ? 'bg-neon-violet/30 text-white border border-neon-violet'
                        : 'bg-white/[0.05] text-slate-600'
                  }`}
                >
                  {d.n}
                </span>
              );
            })}
          </div>
        </div>

        <div className="space-y-2.5">
          {DAILY_RITUAL.map((t) => (
            <TaskRow
              key={t.id}
              task={t}
              checked={mounted && !!today && !!done[ritualKey(t.id, today)]}
              onToggle={() => today && toggle(ritualKey(t.id, today))}
            />
          ))}
        </div>
      </section>

      {/* Thanh điều khiển */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => setCoreOnly(!coreOnly)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-all active:scale-95 ${
            coreOnly
              ? 'bg-neon-green/15 border-neon-green/40 text-neon-green'
              : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          <Check className="w-4 h-4" />
          {coreOnly ? 'Đang hiện: chỉ việc CỐT LÕI' : 'Chỉ hiện việc CỐT LÕI'}
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-white/[0.03] border border-white/10 text-slate-500 hover:text-neon-red hover:border-neon-red/30 transition-all active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Xoá tiến độ
        </button>
      </div>

      {/* 30 ngày, chia theo giai đoạn */}
      <div className="space-y-8">
        {PHASES.map((phase) => (
          <div key={phase.n}>
            <div className="flex flex-wrap items-baseline gap-3 mb-3">
              <h3 className="text-base font-heading font-bold" style={{ color: phase.color }}>
                GIAI ĐOẠN {phase.n} — {phase.name}
              </h3>
              <span className="text-[12px] text-slate-500">{phase.range}</span>
            </div>
            <div className="space-y-4">
              {PLAN.filter((d) => d.phase === phase.n).map((day) => {
                const date = dateForDay(start, day.n);
                return (
                  <DayCard
                    key={day.n}
                    day={day}
                    date={date}
                    dow={dowForDate(date)}
                    accent={phase.color}
                    open={openDay === day.n}
                    onToggleOpen={() => setOpenDay(openDay === day.n ? null : day.n)}
                    done={done}
                    toggle={toggle}
                    coreOnly={coreOnly}
                    mounted={mounted}
                    isToday={mounted && today === date}
                    isPast={mounted && !!today && today > date}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 2026-09-09 → 09/09/2026 */
function fmtDate(iso: string): string {
  return `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;
}

function DayCard({
  day,
  date,
  dow,
  accent,
  open,
  onToggleOpen,
  done,
  toggle,
  coreOnly,
  mounted,
  isToday,
  isPast,
}: {
  day: StudyDay;
  date: string;
  dow: string;
  accent: string;
  open: boolean;
  onToggleOpen: () => void;
  done: Record<string, boolean>;
  toggle: (id: string) => void;
  coreOnly: boolean;
  mounted: boolean;
  isToday: boolean;
  isPast: boolean;
}) {
  const tasks = day.blocks.flatMap((b) => b.tasks);
  const doneCount = mounted ? tasks.filter((t) => done[t.id]).length : 0;
  const pct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;
  const [dd, mm] = [date.slice(8, 10), date.slice(5, 7)];
  const hasJpd123 = tasks.some((t) => t.course === 'JPD123');
  const isCheck = day.title.startsWith('KIỂM TRA') || day.title.startsWith('THI THỬ') || day.title.startsWith('TỔNG DUYỆT');

  return (
    <section
      className={`rounded-2xl border overflow-hidden transition-colors ${
        isToday
          ? 'border-neon-violet/50 bg-neon-violet/[0.06]'
          : isCheck
            ? 'border-neon-red/35 bg-neon-red/[0.04]'
            : 'border-white/10 bg-white/[0.02]'
      }`}
    >
      <button onClick={onToggleOpen} className="w-full text-left p-5 sm:p-6 flex items-start gap-4">
        <ProgressRing pct={pct} label={mounted ? `${dd}/${mm}` : `${day.n}`} accent={accent} />

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[11px] font-semibold tracking-wider text-slate-500">
              NGÀY {day.n}
              {mounted && dow ? ` · ${dow.toUpperCase()}` : ''}
            </span>
            {isToday && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neon-violet text-white">
                HÔM NAY
              </span>
            )}
            {isCheck && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neon-red text-white">
                NGÀY ĐO
              </span>
            )}
            {hasJpd123 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neon-green/15 text-neon-green border border-neon-green/25">
                + JPD123
              </span>
            )}
            {isPast && !isToday && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-slate-500">
                đã qua
              </span>
            )}
          </div>

          <h3 className="text-lg sm:text-xl font-heading font-bold text-white mb-1.5">{day.title}</h3>
          <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 sm:line-clamp-none">{day.mission}</p>

          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {(dayMinutes(day) / 60).toFixed(1).replace('.', ',')} giờ
            </span>
            <span className="inline-flex items-center gap-1">
              <ListChecks className="w-3.5 h-3.5" />
              {mounted ? `${doneCount}/${tasks.length}` : tasks.length} việc
            </span>
          </div>
        </div>

        <ChevronDown
          className={`w-5 h-5 text-slate-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="px-5 sm:px-6 pb-6 space-y-5">
          <div className="rounded-xl bg-neon-green/[0.06] border border-neon-green/20 p-4">
            <div className="text-[11px] font-bold tracking-wider text-neon-green mb-1">
              CUỐI NGÀY PHẢI LÀM ĐƯỢC
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{day.outcome}</p>
          </div>

          {day.blocks.map((block) => {
            const visible = coreOnly ? block.tasks.filter((t) => t.tier === 'core') : block.tasks;
            if (!visible.length) return null;
            return (
              <div key={block.id}>
                <div className="flex flex-wrap items-baseline gap-2 mb-3">
                  <h4 className="text-sm font-bold text-white">{block.label}</h4>
                  <span className="text-xs text-slate-500">{block.goal}</span>
                </div>
                <div className="space-y-2.5">
                  {visible.map((t) => (
                    <TaskRow
                      key={t.id}
                      task={t}
                      checked={mounted && !!done[t.id]}
                      onToggle={() => toggle(t.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function TaskRow({
  task,
  checked,
  onToggle,
}: {
  task: StudyTask;
  checked: boolean;
  onToggle: () => void;
}) {
  const meta = KIND_META[task.kind];
  // Việc nào đã soạn bài giảng thì mở học ngay tại chỗ, không phải đi tìm
  // nguồn khác. Việc chưa có bài thì đơn giản là không hiện nút.
  const lesson = LESSONS[task.id];
  const [openLesson, setOpenLesson] = useState(false);

  return (
    <div
      className={`rounded-xl border p-3.5 transition-all ${
        checked ? 'border-neon-green/25 bg-neon-green/[0.04]' : 'border-white/10 bg-white/[0.02]'
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          aria-pressed={checked}
          aria-label={checked ? `Bỏ đánh dấu: ${task.title}` : `Đánh dấu xong: ${task.title}`}
          className={`mt-0.5 w-5 h-5 shrink-0 rounded-md border-2 flex items-center justify-center transition-all active:scale-90 ${
            checked
              ? 'bg-neon-green border-neon-green'
              : 'border-white/25 hover:border-neon-violet'
          }`}
        >
          {checked && <Check className="w-3.5 h-3.5 text-black" strokeWidth={3.5} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span
              className={`text-sm font-semibold leading-snug ${
                checked ? 'text-slate-500 line-through' : 'text-white'
              }`}
            >
              {task.title}
            </span>
            <span
              className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide shrink-0"
              style={{ background: `${meta.color}1f`, color: meta.color }}
            >
              {meta.label}
            </span>
            {task.course === 'JPD123' && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-neon-green/15 text-neon-green shrink-0">
                JPD123
              </span>
            )}
            {task.tier === 'plus' && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/[0.06] text-slate-400 shrink-0">
                NÂNG ĐIỂM
              </span>
            )}
            <span className="text-[11px] text-slate-500 shrink-0">{task.minutes}′</span>
          </div>

          <p className={`text-[13px] leading-relaxed ${checked ? 'text-slate-600' : 'text-slate-400'}`}>
            {task.detail}
          </p>

          {(lesson || (task.links && task.links.length > 0)) && (
            <div className="flex flex-wrap gap-2 mt-2.5">
              {lesson && (
                <button
                  onClick={() => setOpenLesson((v) => !v)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                    openLesson
                      ? 'bg-neon-cyan/20 border-neon-cyan/50 text-white'
                      : 'bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/20'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  {openLesson ? 'Đóng bài học' : 'Học ngay tại đây'}
                </button>
              )}
              {task.links?.map((l) => (
                <Link
                  key={l.href + l.label}
                  href={l.href}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-neon-violet/10 text-neon-violet border border-neon-violet/20 hover:bg-neon-violet/20 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  {l.label}
                </Link>
              ))}
            </div>
          )}

          {lesson && openLesson && <LessonPanel lesson={lesson} />}
        </div>
      </div>
    </div>
  );
}

function ProgressRing({ pct, label, accent = '#8b5cf6' }: { pct: number; label: string; accent?: string }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative w-16 h-16 shrink-0">
      {/* Dùng màu đặc theo giai đoạn thay vì gradient: 30 vòng trên một trang thì
          một <linearGradient id> dùng chung sẽ trùng id, còn sinh 30 id riêng thì
          thừa. Màu đặc vừa đúng ý đồ phân giai đoạn vừa nhẹ hơn. */}
      <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke={accent}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct) / 100}
          className="transition-all duration-500"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white">
        {label}
      </span>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
      <div className="flex items-center gap-1.5 text-[11px] font-medium mb-1.5" style={{ color: accent }}>
        {icon}
        {label}
      </div>
      <div className="text-xl font-heading font-bold text-white leading-none">{value}</div>
      {sub && <div className="text-[11px] text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}

function VerdictCard({ tone, title, body }: { tone: 'green' | 'cyan' | 'orange'; title: string; body: string }) {
  const colors = {
    green: { border: 'border-neon-green/25', bg: 'bg-neon-green/[0.05]', text: 'text-neon-green' },
    cyan: { border: 'border-neon-cyan/25', bg: 'bg-neon-cyan/[0.05]', text: 'text-neon-cyan' },
    orange: { border: 'border-neon-orange/25', bg: 'bg-neon-orange/[0.05]', text: 'text-neon-orange' },
  }[tone];
  return (
    <div className={`rounded-xl border ${colors.border} ${colors.bg} p-4`}>
      <div className={`text-xs font-bold mb-1.5 ${colors.text}`}>{title}</div>
      <p className="text-[13px] text-slate-400 leading-relaxed">{body}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB 2 — BẢNG TRA CỨU
   ═══════════════════════════════════════════════════════════════ */

function CheatTab() {
  const [showRomaji, setShowRomaji] = useState(true);
  /**
   * Mặc định ĐÓNG HẾT. Bảng tra cứu có 10 mục, mỗi mục vài nghìn pixel —
   * mở sẵn bất cứ mục nào là đẩy các mục còn lại xuống quá tầm nhìn và
   * người dùng tưởng chúng không tồn tại.
   */
  const [openSection, setOpenSection] = useState<string | null>(null);

  /**
   * Mở một mục rồi cuộn tới nó.
   *
   * Bảng tra cứu đã có 9 mục và các mục đóng sẵn, nên mục nằm cuối
   * (Kanji, Từ vựng) dễ bị tưởng là không tồn tại. Hàng chip này cho
   * thấy TOÀN BỘ mục ngay từ đầu tab.
   */
  const jumpTo = (id: string) => {
    setOpenSection(id);
    setTimeout(() => {
      document.getElementById(`cheat-${id}`)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }, 60);
  };

  return (
    <div className="space-y-6">
      {/* Mục lục nhanh */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-2.5">
          Bảng tra cứu có {SECTIONS.length + 1} mục — bấm để nhảy tới
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => jumpTo('kana')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              openSection === 'kana'
                ? 'bg-neon-violet/15 border-neon-violet/45 text-white'
                : 'bg-white/[0.04] border-white/10 text-slate-300 hover:text-white hover:border-neon-violet/40'
            }`}
          >
            🔤 Bảng chữ cái
          </button>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => jumpTo(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                openSection === s.id
                  ? 'bg-neon-violet/15 border-neon-violet/45 text-white'
                  : 'bg-white/[0.04] border-white/10 text-slate-300 hover:text-white hover:border-neon-violet/40'
              }`}
            >
              {s.icon} {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Kana — GẤP LẠI ĐƯỢC như mọi mục khác.
          Trước đây mục này luôn mở và cao ~3.800px, đẩy 9 mục còn lại
          xuống dưới 7 màn hình điện thoại; người dùng cuộn mãi chỉ thấy
          kana và tưởng bảng tra cứu không có gì khác. */}
      <section
        id="cheat-kana"
        className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden scroll-mt-32"
      >
        <button
          onClick={() => setOpenSection(openSection === 'kana' ? null : 'kana')}
          className="w-full text-left p-5 sm:p-6 flex items-start gap-4"
        >
          <span className="text-2xl leading-none shrink-0">🔤</span>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-heading font-bold text-white mb-1">Bảng chữ cái</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Hiragana &amp; katakana đầy đủ, cả âm đục và âm ghép. Tắt romaji khi đã thuộc —
              đọc thẳng kana ra âm là mục tiêu cuối cùng.
            </p>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-slate-500 shrink-0 transition-transform ${
              openSection === 'kana' ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSection === 'kana' && (
        <div className="px-5 sm:px-6 pb-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowRomaji(!showRomaji)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white transition-colors"
          >
            {showRomaji ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showRomaji ? 'Ẩn romaji' : 'Hiện romaji'}
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <KanaGrid title="Hiragana ひらがな — 46 âm gốc" rows={HIRAGANA} showRomaji={showRomaji} cols={5} />
          <KanaGrid title="Katakana カタカナ — 46 âm gốc" rows={KATAKANA} showRomaji={showRomaji} cols={5} />
          <KanaGrid title="Hiragana — âm đục & bán đục ゛゜" rows={DAKUTEN} showRomaji={showRomaji} cols={5} />
          <KanaGrid title="Katakana — âm đục & bán đục" rows={KATAKANA_DAKUTEN} showRomaji={showRomaji} cols={5} />
          <KanaGrid title="Hiragana — âm ghép (ゃ ゅ ょ)" rows={YOUON} showRomaji={showRomaji} cols={3} />
          <KanaGrid title="Katakana — âm ghép (ャ ュ ョ)" rows={KATAKANA_YOUON} showRomaji={showRomaji} cols={3} />
        </div>

        <div className="mt-5 rounded-xl border border-neon-red/25 bg-neon-red/[0.05] p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-neon-red mb-2">
            <AlertTriangle className="w-4 h-4" />Ô viền đỏ = ký tự hay bị nhầm
          </div>
          <p className="text-[13px] text-slate-400 leading-relaxed">
            Hiragana: は/ほ · ぬ/め · る/ろ · れ/わ. Katakana: シ/ツ (nét dài đi lên vs đi xuống) ·
            ソ/ン · ノ/メ/ヌ. Mẹo vị trí: ン gần như không bao giờ mở đầu từ, ソ thì hay mở đầu.
            Ngoài ra: っ (tsu nhỏ) là một nhịp NGHỈ — がっこう đọc &ldquo;gak-kou&rdquo;.
          </p>
        </div>
        </div>
        )}
      </section>

      {/* Các mục tra cứu */}
      {SECTIONS.map((s) => {
        const open = openSection === s.id;
        return (
          <section
            key={s.id}
            id={`cheat-${s.id}`}
            className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden scroll-mt-32"
          >
            <button
              onClick={() => setOpenSection(open ? null : s.id)}
              className="w-full text-left p-5 sm:p-6 flex items-start gap-4"
            >
              <span className="text-2xl leading-none shrink-0">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-heading font-bold text-white mb-1">{s.title}</h2>
                <p className="text-sm text-slate-400 leading-relaxed">{s.summary}</p>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-slate-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
              />
            </button>

            {open && (
              <div className="px-5 sm:px-6 pb-6 space-y-6">
                {/* Khu lật thẻ đứng ĐẦU mục: bảng thì để tra, còn thứ thật sự
                    làm nhớ được mặt chữ là lật thẻ. Đặt sau các bảng thì phải
                    cuộn qua vài nghìn pixel mới thấy — đúng lỗi đã mắc một lần. */}
                {s.id === 'kanji' && <KanjiCardPanel />}
                {/* Lợi thế riêng của người Việt — đặt TRƯỚC các bảng cách đọc,
                    vì đoán được nghĩa rồi thì học cách đọc nhẹ hơn hẳn. */}
                {s.id === 'kanji' && <HanVietBlock />}
                {/* Số bằng chữ Hán đứng ĐẦU mục Số: bảng bên dưới tra cách đọc
                    khi đã biết con số, còn khu này dạy chiều ngược lại (nhìn
                    二万四千八百 ra 24.800) — đúng chiều đề FE hỏi. */}
                {s.id === 'number' && <KanjiNumberPanel />}
                {s.tables.map((t) => (
                  <DataTable key={t.id} table={t} />
                ))}
                {s.examples && s.examples.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-white mb-2.5">
                      {s.examplesTitle ?? 'Câu ví dụ'}
                    </h3>
                    <div className="space-y-2">
                      {s.examples.map((ex, i) => (
                        <div
                          key={i}
                          className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2.5"
                        >
                          <div className="text-base text-white leading-snug">{ex.jp}</div>
                          {ex.read && ex.read !== ex.jp && (
                            <div className="text-[13px] text-neon-cyan mt-0.5">{ex.read}</div>
                          )}
                          {ex.romaji && <div className="text-[12px] text-slate-500 mt-0.5">{ex.romaji}</div>}
                          <div className="text-[13px] text-slate-300 mt-1">{ex.vi}</div>
                          {ex.note && (
                            <div className="text-[12px] text-slate-500 leading-relaxed mt-1.5">{ex.note}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {s.tips?.map((tip) => (
                  <div key={tip.title} className="rounded-xl border border-neon-cyan/20 bg-neon-cyan/[0.04] p-4">
                    <div className="text-xs font-bold text-neon-cyan mb-1.5">★ {tip.title}</div>
                    <p className="text-[13px] text-slate-300 leading-relaxed">{tip.body}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

/**
 * Hán-Việt: lợi thế mà chỉ người học Việt Nam có.
 * Người Âu-Mỹ phải học thuộc nghĩa từng từ ghép kanji; người Việt thì
 * phần lớn đã có sẵn từ tương ứng trong tiếng mẹ đẻ.
 */
function HanVietBlock() {
  return (
    <div className="rounded-xl border border-neon-green/25 bg-neon-green/[0.05] p-4 sm:p-5">
      <div className="text-sm font-bold text-neon-green mb-1.5">
        ★ Lợi thế của người Việt — đoán nghĩa qua từ Hán-Việt
      </div>
      <p className="text-[13px] text-slate-300 leading-relaxed mb-4">
        Kanji vào tiếng Nhật và từ Hán-Việt vào tiếng Việt đều mượn từ cùng một gốc chữ Hán, nên
        rất nhiều từ ghép trong môn này <b className="text-white">bạn đã biết nghĩa từ trước mà
        không nhận ra</b>. Bạn chỉ còn phải nhớ cách đọc — nhẹ hơn hẳn so với người học phương Tây
        phải học cả nghĩa lẫn âm.
      </p>
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-sm min-w-[420px]">
          <thead>
            <tr className="bg-white/[0.04]">
              {['Chữ Hán', 'Cách đọc', 'Hán-Việt bạn đã biết', 'Nghĩa'].map((h, i) => (
                <th
                  key={`${h}-${i}`}
                  className="text-left px-3 py-2.5 text-[11px] font-bold tracking-wide text-slate-400 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HANVIET_TABLE.map((h) => (
              <tr key={h.kanji} className="border-t border-white/[0.06]">
                <td className="px-3 py-2.5 text-lg text-white">{h.kanji}</td>
                <td className="px-3 py-2.5 text-neon-cyan">{h.kana}</td>
                <td className="px-3 py-2.5 text-neon-green font-semibold">{h.hanviet}</td>
                <td className="px-3 py-2.5 text-slate-400">{h.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[12px] text-slate-500 leading-relaxed mt-3">
        Vài từ lệch nghĩa so với Hán-Việt nên đừng suy bừa: <b className="text-slate-300">勉強</b>{' '}
        (べんきょう) là “MIỄN CƯỠNG” nhưng nghĩa tiếng Nhật là <b className="text-slate-300">học
        tập</b>, còn <b className="text-slate-300">料理</b> (りょうり) “LIỆU LÝ” nghĩa là{' '}
        <b className="text-slate-300">món ăn</b>. Hán-Việt là mẹo đoán, không phải luật.
      </p>
    </div>
  );
}

function KanaGrid({
  title,
  rows,
  showRomaji,
  cols,
}: {
  title: string;
  rows: KanaCell[][];
  showRomaji: boolean;
  cols: number;
}) {
  return (
    <div>
      <h3 className="text-sm font-bold text-white mb-2.5">{title}</h3>
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {rows.flat().map((cell, i) =>
          cell.kana ? (
            <div
              key={i}
              className={`rounded-lg border py-2 text-center ${
                cell.tricky ? 'border-neon-red/40 bg-neon-red/[0.06]' : 'border-white/10 bg-white/[0.03]'
              }`}
            >
              <div className="text-lg leading-none text-white">{cell.kana}</div>
              {showRomaji && <div className="text-[10px] text-slate-500 mt-1">{cell.romaji}</div>}
            </div>
          ) : (
            <div key={i} />
          ),
        )}
      </div>
    </div>
  );
}

function DataTable({ table }: { table: CheatTable }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-white mb-1">{table.title}</h3>
      {table.note && <p className="text-xs text-slate-500 mb-2.5 leading-relaxed">{table.note}</p>}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm min-w-[420px]">
          <thead>
            <tr className="bg-white/[0.04]">
              {/* Bảng hai cột đôi lặp lại đúng tên cột ("Ngày", "Cách đọc"),
                  nên key phải kèm chỉ số — nếu không React báo trùng key. */}
              {table.headers.map((h, i) => (
                <th
                  key={`${h}-${i}`}
                  className="text-left px-3 py-2.5 text-[11px] font-bold tracking-wide text-slate-400 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => {
              const danger = table.dangerRows?.includes(i);
              return (
                <tr
                  key={i}
                  className={`border-t border-white/[0.06] ${danger ? 'bg-neon-red/[0.05]' : ''}`}
                >
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={`px-3 py-2.5 leading-relaxed ${
                        j === 0 ? 'text-white font-medium' : danger ? 'text-neon-orange' : 'text-slate-300'
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB 3 — THI NÓI & ĐỌC
   ═══════════════════════════════════════════════════════════════ */

function SpeakTab({
  profile,
  onProfile,
  mounted,
}: {
  profile: Record<string, string>;
  onProfile: (p: Record<string, string>) => void;
  mounted: boolean;
}) {
  const [sub, setSub] = useState<'read' | 'talk' | 'picture' | 'personal'>('read');
  const [showRomaji, setShowRomaji] = useState(true);
  const [showVi, setShowVi] = useState(true);
  const [openReading, setOpenReading] = useState<number | null>(1);

  return (
    <div className="space-y-6">
      {/* Cơ cấu điểm */}
      <section className="rounded-2xl border border-neon-pink/25 bg-neon-pink/[0.05] p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-heading font-bold text-white mb-3">
          <Mic className="w-5 h-5 text-neon-pink" />
          Thi nói — 100 điểm chia làm ba
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { p: 'READING', s: '30', d: 'Đọc to một bài cho sẵn. Không phải dịch, không phải trả lời câu hỏi về nó.' },
            { p: 'TALKING', s: '60', d: '1 câu hỏi không tranh + 3 câu hỏi về một bức tranh.' },
            { p: 'PRESENTING', s: '10', d: 'Tác phong: chào, ngồi thẳng, nhìn giám thị, cảm ơn khi ra. Điểm cho không.' },
          ].map((x) => (
            <div key={x.p} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-xs font-bold text-white tracking-wide">{x.p}</span>
                <span className="text-xl font-heading font-bold text-neon-pink">{x.s}</span>
              </div>
              <p className="text-[13px] text-slate-400 leading-relaxed">{x.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-neon-green/25 bg-neon-green/[0.06] p-4">
          <div className="text-xs font-bold text-neon-green mb-1.5">★ 10 điểm lấy trước khi nói tiếng Nhật</div>
          <p className="text-[13px] text-slate-300 leading-relaxed">
            しつれいします (khi vào) → よろしくおねがいします → ngồi thẳng, nhìn giám thị →{' '}
            ありがとうございました → しつれいしました (khi ra). Không nghe rõ câu hỏi thì nói{' '}
            <b className="text-white">もういちど おねがいします</b> — hỏi lại KHÔNG bị trừ điểm.
          </p>
        </div>
      </section>

      {/* Tên bằng katakana — câu 1 giám thị hỏi */}
      <NameSection />

      {/* Hồ sơ cá nhân */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
        <h2 className="text-lg font-heading font-bold text-white mb-1">Hồ sơ thi nói của bạn</h2>
        <p className="text-sm text-slate-400 mb-5 leading-relaxed">
          Điền một lần — trang sẽ tự ghép thành câu trả lời tiếng Nhật hoàn chỉnh cho gần hết 22 câu hỏi bên dưới.
          Học thuộc <b className="text-white">câu của chính bạn</b> luôn nhanh hơn học thuộc câu mẫu của người khác.
          Dữ liệu chỉ lưu trên máy bạn.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {PROFILE_FIELDS.map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">{f.label}</label>
              <input
                type="text"
                value={mounted ? (profile[f.key] ?? '') : ''}
                onChange={(e) => onProfile({ ...profile, [f.key]: e.target.value })}
                placeholder={f.fallback}
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-neon-violet/50 transition-colors"
              />
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{f.hint}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sub tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'read' as const, label: `13 bài đọc (READING 30đ)` },
          { id: 'talk' as const, label: `22 câu hỏi (TALKING)` },
          { id: 'picture' as const, label: `6 bộ tranh (37 câu)` },
          { id: 'personal' as const, label: `⭐ Hỏi về CHÍNH BẠN + đúng/sai` },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => setSub(s.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all active:scale-95 ${
              sub === s.id
                ? 'bg-neon-pink/15 border-neon-pink/40 text-white'
                : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* 13 bài đọc */}
      {sub === 'read' && (
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-[13px] text-slate-400 leading-relaxed max-w-xl">
              11/13 bài dựng theo cùng một khung: tên/quốc tịch → nghề hoặc trường → lịch tuần
              (から…まで) → sở thích. Đọc trôi một bài là gần như đọc trôi cả nhóm. Hai bài ngoại lệ là{' '}
              <b className="text-white">bài 7</b> (kính ngữ nhà hàng) và <b className="text-white">bài 9</b>{' '}
              (mọi số viết bằng kanji).
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowRomaji(!showRomaji)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white transition-colors"
              >
                {showRomaji ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />} Romaji
              </button>
              <button
                onClick={() => setShowVi(!showVi)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white transition-colors"
              >
                {showVi ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />} Bản dịch
              </button>
            </div>
          </div>

          {READINGS.map((r) => {
            const open = openReading === r.n;
            const levelColor =
              r.level === 'hard' ? '#f43f5e' : r.level === 'medium' ? '#fb923c' : '#4ade80';
            const levelLabel = r.level === 'hard' ? 'KHÓ' : r.level === 'medium' ? 'TRUNG BÌNH' : 'DỄ';
            return (
              <div key={r.n} className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                <button
                  onClick={() => setOpenReading(open ? null : r.n)}
                  className="w-full text-left p-4 sm:p-5 flex items-center gap-3"
                >
                  <span className="w-9 h-9 shrink-0 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-sm font-bold text-white">
                    {r.n}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-white">{r.title}</span>
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                        style={{ background: `${levelColor}1f`, color: levelColor }}
                      >
                        {levelLabel}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
                  />
                </button>

                {open && (
                  <div className="px-4 sm:px-5 pb-5 space-y-3">
                    <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                      <div className="text-[10px] font-bold tracking-wider text-slate-500 mb-2">
                        BÀI ĐỌC — đọc to, không đọc thầm
                      </div>
                      <p className="text-[17px] leading-[2] text-white whitespace-pre-line">{r.jp}</p>
                    </div>
                    {showRomaji && (
                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
                        <div className="text-[10px] font-bold tracking-wider text-slate-500 mb-1.5">ROMAJI</div>
                        <p className="text-[13px] leading-relaxed text-slate-400 italic">{r.romaji}</p>
                      </div>
                    )}
                    {showVi && (
                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
                        <div className="text-[10px] font-bold tracking-wider text-slate-500 mb-1.5">
                          NGHĨA (chỉ để hiểu nhịp — thi KHÔNG hỏi phần dịch)
                        </div>
                        <p className="text-[13px] leading-relaxed text-slate-400">{r.vi}</p>
                      </div>
                    )}
                    <div className="rounded-xl border border-neon-orange/25 bg-neon-orange/[0.05] p-3.5">
                      <div className="text-[10px] font-bold tracking-wider text-neon-orange mb-1.5">
                        CHỖ DỄ VẤP
                      </div>
                      <p className="text-[13px] leading-relaxed text-slate-300">{r.watch}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* 22 câu hỏi */}
      {sub === 'talk' && (
        <section className="space-y-6">
          <div className="rounded-xl border border-neon-violet/25 bg-neon-violet/[0.05] p-4">
            <p className="text-[13px] text-slate-300 leading-relaxed">
              <b className="text-white">Chiến thuật:</b> giám thị chỉ hỏi 1 trong 4 câu, nhưng bạn không biết
              trước là câu nào. Đừng học 22 câu trả lời rời rạc — hãy thuộc <b className="text-white">một câu
              thật về bản thân cho mỗi nhóm</b> rồi tái sử dụng. Tên, quốc tịch, nghề, sinh nhật, sở thích,
              giờ dậy và một hoạt động cuối tuần trả lời được gần hết ngân hàng này.
            </p>
          </div>

          {TALK_GROUPS.map((g) => {
            const qs = TALK_QUESTIONS.filter((q) => q.group === g);
            if (!qs.length) return null;
            return (
              <div key={g}>
                <h3 className="text-sm font-bold text-white mb-3">{g}</h3>
                <div className="space-y-2.5">
                  {qs.map((q) => (
                    <div key={q.n} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 shrink-0 rounded-lg bg-white/[0.05] flex items-center justify-center text-[11px] font-bold text-slate-400">
                          {q.n}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[15px] text-white leading-relaxed">{q.jp}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{q.vi}</p>

                          <div className="mt-2.5 rounded-lg border border-neon-green/25 bg-neon-green/[0.06] px-3 py-2.5">
                            <div className="text-[10px] font-bold tracking-wider text-neon-green mb-1">
                              CÂU TRẢ LỜI CỦA BẠN
                            </div>
                            <p className="text-[15px] text-white leading-relaxed">
                              {mounted ? fillAnswer(q.answer, profile) : q.answer}
                            </p>
                          </div>

                          {q.note && (
                            <p className="text-[12px] text-neon-orange mt-2 leading-relaxed">⚠ {q.note}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* 6 bộ tranh */}
      {sub === 'picture' && (
        <section className="space-y-4">
          <div className="rounded-xl border border-neon-red/25 bg-neon-red/[0.05] p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-neon-red mb-1.5">
              <AlertTriangle className="w-4 h-4" />
              Quy tắc quan trọng nhất phần tranh
            </div>
            <p className="text-[13px] text-slate-300 leading-relaxed">{PICTURE_RULE}</p>
          </div>

          {PICTURE_SETS.map((p) => (
            <div key={p.n} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="text-base font-heading font-bold text-white mb-3">
                Bộ {p.n} — {p.title}
              </h3>

              <div className="rounded-xl border border-white/10 bg-black/30 p-4 mb-4">
                <div className="text-[10px] font-bold tracking-wider text-slate-500 mb-2">
                  DỮ LIỆU TRONG TRANH
                </div>
                <ul className="space-y-1">
                  {p.data.map((d) => (
                    <li key={d} className="text-[13px] text-slate-300 leading-relaxed">
                      • {d}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                {p.qa.map((qa, i) => (
                  <div key={i} className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3">
                    <p className="text-sm text-slate-300 leading-relaxed">{qa.q}</p>
                    <p className="text-sm text-neon-green leading-relaxed mt-1">→ {qa.a}</p>
                  </div>
                ))}
              </div>

              <p className="text-[12px] text-slate-500 mt-3 leading-relaxed border-l-2 border-white/15 pl-3">
                {p.note}
              </p>
            </div>
          ))}
        </section>
      )}

      {sub === 'personal' && <PersonalQAPanel profile={profile} />}

      <div className="flex flex-wrap gap-3">
        <Link
          href={EXAM_SPEAKING}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-neon-pink/15 border border-neon-pink/40 text-white hover:bg-neon-pink/25 transition-colors"
        >
          <Mic className="w-4 h-4" />
          Thi thử vấn đáp trong Phòng thi
        </Link>
        <Link
          href={lesson('jpd113-speaking-cau-truc')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Chương Thi nói đầy đủ trong Academy
        </Link>
      </div>
    </div>
  );
}

/**
 * Viết tên tiếng Việt bằng katakana.
 *
 * Câu đầu tiên giám thị hỏi là おなまえは？ nên đây là thứ đầu tiên người
 * học cần, mà giáo trình lại không dạy — ai cũng tự mò.
 */
function NameSection() {
  const [q, setQ] = useState('');

  const hits = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    const norm = (v: string) =>
      v
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/đ/g, 'd');
    return [...NAME_TABLE, ...SURNAME_TABLE].filter(
      (n) => norm(n.vi).includes(norm(s)) || n.kata.includes(q.trim()),
    );
  }, [q]);

  return (
    <section className="rounded-2xl border border-neon-cyan/25 bg-neon-cyan/[0.05] p-5 sm:p-6">
      <h2 className="text-lg font-heading font-bold text-white mb-1">
        Tên bạn viết bằng katakana thế nào?
      </h2>
      <p className="text-sm text-slate-300 leading-relaxed mb-5">
        Câu <b className="text-white">đầu tiên</b> giám thị hỏi là{' '}
        <b className="text-white">おなまえは？</b> — nên đây là thứ phải chắc nhất.
        Giám thị KHÔNG chấm chính tả katakana của tên bạn, nhưng nói theo âm Nhật thì họ nghe ra
        dễ hơn nhiều.
      </p>

      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Gõ tên bạn (không cần dấu): cuong, linh, nguyen…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-neon-cyan/50 transition-colors"
        />
      </div>

      {q.trim() && (
        <div className="mb-5">
          {hits.length > 0 ? (
            <div className="space-y-2">
              {hits.slice(0, 8).map((n) => (
                <div
                  key={n.vi + n.kata}
                  className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-neon-cyan/25 bg-neon-cyan/[0.06] px-4 py-3"
                >
                  <span className="text-sm text-slate-300 w-28">{n.vi}</span>
                  <span className="text-2xl text-white">{n.kata}</span>
                  <span className="text-xs text-slate-500">{n.romaji}</span>
                  <span className="text-[13px] text-neon-green ml-auto">
                    わたしの なまえは {n.kata} です。
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-slate-400 leading-relaxed rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
              Không có trong bảng — ghép theo quy tắc bên dưới. Bỏ hết dấu thanh, đổi âm cuối
              n/ng/nh thành ン, rồi đọc từng âm một.
            </p>
          )}
        </div>
      )}

      <details className="group">
        <summary className="cursor-pointer text-sm font-semibold text-white mb-3 list-none flex items-center gap-2">
          <ChevronDown className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" />
          Vì sao tên bị đổi dạng — 7 quy tắc
        </summary>
        <div className="overflow-x-auto rounded-xl border border-white/10 mb-4">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="bg-white/[0.04]">
                {['Trường hợp', 'Ví dụ tiếng Việt', 'Thành', 'Vì sao'].map((h, i) => (
                  <th
                    key={`${h}-${i}`}
                    className="text-left px-3 py-2.5 text-[11px] font-bold tracking-wide text-slate-400 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {NAME_RULES.map((r) => (
                <tr key={r.pattern} className="border-t border-white/[0.06]">
                  <td className="px-3 py-2.5 text-white font-medium">{r.pattern}</td>
                  <td className="px-3 py-2.5 text-slate-400">{r.vi}</td>
                  <td className="px-3 py-2.5 text-neon-cyan text-base">{r.kata}</td>
                  <td className="px-3 py-2.5 text-slate-400 text-[13px] leading-relaxed">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-sm font-semibold text-white mb-2.5">
          Tên thường gặp ({NAME_TABLE.length})
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
          {NAME_TABLE.map((n) => (
            <div
              key={n.vi}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
            >
              <div className="text-[11px] text-slate-500">{n.vi}</div>
              <div className="text-base text-white leading-tight">{n.kata}</div>
            </div>
          ))}
        </div>

        <div className="text-sm font-semibold text-white mb-2.5">Họ thường gặp</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {SURNAME_TABLE.map((n) => (
            <div
              key={n.vi}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
            >
              <div className="text-[11px] text-slate-500">{n.vi}</div>
              <div className="text-base text-white leading-tight">{n.kata}</div>
            </div>
          ))}
        </div>
      </details>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB 4 — ĐỀ THI & MỤC TIÊU
   ═══════════════════════════════════════════════════════════════ */

function ExamTab() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-heading font-bold text-white mb-4">
          <Trophy className="w-5 h-5 text-neon-orange" />
          Ba phần thi & cách phân bổ công sức
        </h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm min-w-[540px]">
            <thead>
              <tr className="bg-white/[0.04]">
                {['Phần thi', 'Dạng', 'Có sẵn trong hệ thống', 'Mức khó', 'Ưu tiên'].map((h, i) => (
                  <th
                    key={`${h}-${i}`}
                    className="text-left px-3 py-2.5 text-[11px] font-bold tracking-wide text-slate-400 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-white/[0.06]">
                <td className="px-3 py-3 text-white font-medium">Vấn đáp (PE)</td>
                <td className="px-3 py-3 text-slate-300">Đọc to + trả lời 4 câu</td>
                <td className="px-3 py-3 text-slate-300">13 bài đọc · 22 câu · 6 bộ tranh · 5 đề thử</td>
                <td className="px-3 py-3 text-neon-green">Dễ nhất — biết trước đề</td>
                <td className="px-3 py-3 text-neon-green font-semibold">CAO NHẤT</td>
              </tr>
              <tr className="border-t border-white/[0.06]">
                <td className="px-3 py-3 text-white font-medium">Đọc hiểu</td>
                <td className="px-3 py-3 text-slate-300">Đoạn văn + trắc nghiệm</td>
                <td className="px-3 py-3 text-slate-300">16 đề (6 đề gốc của giáo viên)</td>
                <td className="px-3 py-3 text-neon-cyan">Vừa</td>
                <td className="px-3 py-3 text-neon-cyan font-semibold">CAO</td>
              </tr>
              <tr className="border-t border-white/[0.06]">
                <td className="px-3 py-3 text-white font-medium">Trắc nghiệm (FE)</td>
                <td className="px-3 py-3 text-slate-300">30 câu / 45 phút</td>
                <td className="px-3 py-3 text-slate-300">14 đề thật — 420 câu, có giải thích từng câu</td>
                <td className="px-3 py-3 text-neon-orange">Khó nhất — cần vốn từ</td>
                <td className="px-3 py-3 text-neon-orange font-semibold">CÀY ĐỀU MỖI NGÀY</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
        <h2 className="text-lg font-heading font-bold text-white mb-1">
          Trắc nghiệm FE — đề thật ra những gì
        </h2>
        <p className="text-sm text-slate-400 mb-4 leading-relaxed">
          Tỉ lệ dưới đây rút từ chính 420 câu trong 14 đề thật. Nhìn vào đây để biết học gì trước:
          70% số điểm nằm ở dạng điền chỗ trống, mà chỗ trống thì gần như luôn là trợ từ, từ để hỏi,
          đại từ chỉ định hoặc một từ vựng theo ngữ cảnh.
        </p>
        <div className="space-y-2.5">
          {[
            { label: 'Điền chỗ trống (trợ từ, từ để hỏi, chỉ định, động từ, từ vựng)', pct: 70 },
            { label: 'Đọc Hán tự → hiragana', pct: 11 },
            { label: 'Chọn Hán tự đúng cho từ cho sẵn', pct: 11 },
            { label: 'Sắp xếp từ gợi ý thành câu', pct: 4 },
            { label: 'Từ mượn katakana → nghĩa tiếng Việt', pct: 2 },
            { label: 'Chọn từ khác loại (odd one out)', pct: 2 },
          ].map((r) => (
            <div key={r.label}>
              <div className="flex items-center justify-between text-[13px] mb-1">
                <span className="text-slate-300">{r.label}</span>
                <span className="text-white font-semibold shrink-0 ml-3">~{r.pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-neon-violet to-neon-fuchsia"
                  style={{ width: `${r.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-neon-red/25 bg-neon-red/[0.05] p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-neon-red mb-2">
            <AlertTriangle className="w-4 h-4" />
            Bốn chỗ mất điểm nhiều nhất
          </div>
          <ul className="space-y-1.5 text-[13px] text-slate-300 leading-relaxed">
            <li>
              • <b className="text-white">Đọc số bất quy tắc</b> — 一日 ついたち, 二十歳 はたち, 三階 さんがい,
              八分 はっぷん, 八千 はっせん. Không suy ra được, phải học vẹt.
            </li>
            <li>
              • <b className="text-white">これ/それ/あれ vs この/その/あの</b> — hỏi đi hỏi lại trong cả 14 đề.
            </li>
            <li>
              • <b className="text-white">6 từ để hỏi</b> — đọc đáp án trước rồi suy ngược ra từ hỏi.
            </li>
            <li>
              • <b className="text-white">Collocation từ vựng</b> — mua ở đâu, ăn bằng gì. Đây là phần lớn nhất
              và cũng là phần khó nhồi cấp tốc nhất.
            </li>
          </ul>
        </div>
      </section>

      <FeBankPanel />

      <section className="rounded-2xl border border-neon-green/25 bg-neon-green/[0.05] p-5 sm:p-6">
        <h2 className="text-lg font-heading font-bold text-white mb-3">Mục tiêu điểm theo từng phần</h2>
        <p className="text-sm text-slate-400 mb-4 leading-relaxed">
          Đừng nhắm 9 đều cả ba phần — hãy nhắm cao ở chỗ dễ ăn điểm và chấp nhận vừa phải ở chỗ khó.
          Đây là phân bổ thực tế để tổng kết đạt 7+ và có cơ hội chạm 9.
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { part: 'Vấn đáp', safe: '8–9', best: '10', why: 'Biết trước toàn bộ ngân hàng đề. Chỉ cần luyện đọc to và thuộc câu của mình.' },
            { part: 'Đọc hiểu', safe: '7–8', best: '9', why: 'Bài đọc lặp khuôn. Đọc được kana + thuộc bảng số là làm được phần lớn câu.' },
            { part: 'Trắc nghiệm FE', safe: '6–7', best: '8–9', why: 'Phụ thuộc vốn từ. Cày đủ 14 đề và ghi sổ lỗi là cách kéo điểm nhanh nhất.' },
          ].map((x) => (
            <div key={x.part} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-sm font-bold text-white mb-2">{x.part}</div>
              <div className="flex items-baseline gap-3 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wide">An toàn</div>
                  <div className="text-xl font-heading font-bold text-neon-green">{x.safe}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wide">Tối đa</div>
                  <div className="text-xl font-heading font-bold text-neon-cyan">{x.best}</div>
                </div>
              </div>
              <p className="text-[12px] text-slate-400 leading-relaxed">{x.why}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
        <h2 className="text-lg font-heading font-bold text-white mb-4">Vào thẳng chỗ luyện</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <LinkCard
            href={EXAM_FE}
            icon={<FileText className="w-5 h-5" />}
            title="Phòng thi — 14 đề trắc nghiệm FE thật"
            sub="420 câu, giải thích song ngữ từng câu, tự chấm điểm"
          />
          <LinkCard
            href={EXAM_READING}
            icon={<BookOpen className="w-5 h-5" />}
            title="Phòng thi — 16 đề đọc hiểu"
            sub="Kèm romaji, bản dịch và ghi chú kanji cho từng đoạn"
          />
          <LinkCard
            href={EXAM_SPEAKING}
            icon={<Mic className="w-5 h-5" />}
            title="Phòng thi — 5 đề vấn đáp"
            sub="Chấm theo rubric READING 30 / TALKING 60 / PRESENTING 10"
          />
          <LinkCard
            href={lesson('jpd113-gioi-thieu')}
            icon={<BookOpen className="w-5 h-5" />}
            title="Academy JPD113 — 44 bài học"
            sub="Kana → số → ngữ pháp → kanji → thi nói, song ngữ Anh-Việt"
          />
          <LinkCard
            href="/language/ja/vocab?level=JPD113"
            icon={<Target className="w-5 h-5" />}
            title="My Language — 231 từ vựng JPD113"
            sub="Học lặp ngắt quãng (SRS), chia 11 chủ đề"
          />
        </div>
      </section>
    </div>
  );
}

function LinkCard({
  href,
  icon,
  title,
  sub,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-neon-violet/40 hover:bg-white/[0.05] transition-all group"
    >
      <span className="w-10 h-10 shrink-0 rounded-xl bg-neon-violet/10 text-neon-violet flex items-center justify-center">
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-semibold text-white group-hover:text-neon-violet transition-colors">
          {title}
        </span>
        <span className="block text-[12px] text-slate-500 mt-0.5 leading-relaxed">{sub}</span>
      </span>
      <ExternalLink className="w-4 h-4 text-slate-600 shrink-0 mt-1" />
    </Link>
  );
}
