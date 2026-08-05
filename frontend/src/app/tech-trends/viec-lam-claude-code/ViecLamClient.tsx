'use client';

/**
 * Chuyên đề "Việc làm Claude Code".
 *
 * Ghi chú giao diện — giống các chuyên đề khác trong /tech-trends:
 *  - Trang tự mang nền tối cố định (#0a0a0f), KHÔNG dùng biến thể `dark:` của
 *    Tailwind. Ở dự án này `dark:` được giữ riêng cho khối Notes; đặt class
 *    `dark` ra ngoài phạm vi đó từng làm hỏng bộ đổi theme của Notes.
 *  - Tiến độ tick lưu localStorage và CHỈ đọc sau khi mount, nếu không sẽ
 *    lệch HTML giữa server và client (hydration mismatch).
 *  - Mọi con số lấy từ STATS, không gõ cứng.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, BadgeCheck, Briefcase, ClipboardList, FolderGit2,
  GraduationCap, Send, ShieldAlert, Target,
} from 'lucide-react';
import { PROGRESS_KEY, STATS, TOTAL_TASKS } from './data';
import OverviewPanel from './OverviewPanel';
import RoadmapPanel from './RoadmapPanel';
import ProjectsPanel from './ProjectsPanel';
import SkillsPanel from './SkillsPanel';
import JobsPanel from './JobsPanel';
import ApplyPanel from './ApplyPanel';

type TabId = 'tong-quan' | 'lo-trinh' | 'du-an' | 'ky-nang' | 'viec-lam' | 'nop';

const TABS: { id: TabId; label: string; icon: typeof Target; count?: number }[] = [
  { id: 'tong-quan', label: 'Tổng quan', icon: BadgeCheck },
  { id: 'lo-trinh', label: 'Lộ trình', icon: Target, count: STATS.phases },
  { id: 'du-an', label: 'Dự án thật', icon: FolderGit2, count: STATS.projects },
  { id: 'ky-nang', label: 'Kỹ năng', icon: GraduationCap, count: STATS.skills },
  { id: 'viec-lam', label: 'Việc làm', icon: Briefcase, count: STATS.jobs },
  { id: 'nop', label: 'Nộp hồ sơ', icon: Send, count: STATS.applyItems },
];

export default function ViecLamClient() {
  const [tab, setTab] = useState<TabId>('tong-quan');

  /**
   * Tiến độ tick của tab Lộ trình. Đọc sau khi mount để không lệch hydration;
   * `ready` giữ cho thanh tiến độ không nhấp nháy từ 0 lên số thật.
   */
  const [done, setDone] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (raw) setDone(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* localStorage bị chặn (chế độ riêng tư) — cứ chạy với tiến độ rỗng */
    }
    setReady(true);
  }, []);

  const toggle = useCallback((id: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify([...next]));
      } catch {
        /* không lưu được thì vẫn cho tick trong phiên này */
      }
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    setDone(new Set());
    try {
      localStorage.removeItem(PROGRESS_KEY);
    } catch {
      /* bỏ qua */
    }
  }, []);

  const pct = useMemo(
    () => (TOTAL_TASKS === 0 ? 0 : Math.round((done.size / TOTAL_TASKS) * 100)),
    [done.size],
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200">
      {/* ── Đầu trang ─────────────────────────────────────────── */}
      <header className="border-b border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8">
          <Link
            href="/tech-trends"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Tech Trends
          </Link>

          <h1 className="mt-4 text-2xl sm:text-4xl font-heading font-bold text-white leading-tight">
            Việc làm Claude Code
          </h1>
          <p className="mt-2 max-w-2xl text-sm sm:text-base text-slate-400 leading-relaxed">
            {STATS.jobs} tin tuyển dụng có nhắc Claude Code, đã bấm lại từng link để kiểm chứng.
            Kèm lộ trình {STATS.phases} chặng và {STATS.projects} dự án thật để đủ sức ứng tuyển —
            kỹ năng đo từ toàn văn mô tả công việc, không đoán.
          </p>

          {/* Cảnh báo quan trọng nhất, đặt ngay đầu để không ai bỏ sót */}
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-500/25 bg-amber-500/[0.07] p-3 sm:p-3.5">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            <p className="text-[13px] sm:text-sm text-amber-100/90 leading-relaxed">
              Việc là <strong className="font-semibold text-amber-200">thật</strong> — nhưng chỉ{' '}
              <strong className="font-semibold text-amber-200">{STATS.byTier.A}/{STATS.jobs}</strong>{' '}
              tin là người ở Việt Nam nộp được ngay, và chúng chỉ đến từ{' '}
              {STATS.tierAUnique} công ty. Đọc tab Tổng quan trước khi nộp bất cứ đâu.
            </p>
          </div>

          {/* Thanh tiến độ — chỉ hiện khi đã đọc xong localStorage */}
          {ready && done.size > 0 && (
            <div className="mt-5">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <ClipboardList className="h-3.5 w-3.5" />
                  Tiến độ lộ trình
                </span>
                <span className="tabular-nums text-slate-300">
                  <strong className="font-semibold text-emerald-400">{done.size}</strong>
                  {' / '}{TOTAL_TASKS} việc · {pct}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-400 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── Thanh tab ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0a0f]/95 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
                  ].join(' ')}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                  {t.count !== undefined && (
                    <span
                      className={[
                        'ml-0.5 rounded-md px-1.5 py-px text-[10px] tabular-nums',
                        active ? 'bg-emerald-500/25 text-emerald-200' : 'bg-white/[0.06] text-slate-500',
                      ].join(' ')}
                    >
                      {t.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ── Nội dung ──────────────────────────────────────────── */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10">
        {tab === 'tong-quan' && <OverviewPanel onGoTo={setTab} />}
        {tab === 'lo-trinh' && (
          <RoadmapPanel done={done} ready={ready} onToggle={toggle} onReset={resetProgress} />
        )}
        {tab === 'du-an' && <ProjectsPanel />}
        {tab === 'ky-nang' && <SkillsPanel />}
        {tab === 'viec-lam' && <JobsPanel />}
        {tab === 'nop' && <ApplyPanel />}
      </main>
    </div>
  );
}

export type { TabId };
