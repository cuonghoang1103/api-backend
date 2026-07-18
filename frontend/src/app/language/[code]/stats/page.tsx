'use client';
/**
 * My Language — Thống kê (Stats) section page (logged-in).
 *  • Daily streak counter.
 *  • Per-section progress rings (learning / reviewing / mastered / total).
 *  • Hand-rolled quiz-history bar chart (recharts is NOT installed).
 */
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { BarChart3, Flame } from 'lucide-react';
import { languageApi } from '@/lib/language-api';
import type { LearningStats, LangItemType } from '@/types/language';
import {
  SectionShell,
  EmptyState,
  ProgressRing,
  useLangUser,
  usePrefersReducedMotion,
} from '@/components/language/primitives';

const SECTION_LABELS: Record<LangItemType, string> = {
  VOCAB: 'Từ vựng',
  ALPHABET: 'Bảng chữ cái',
  GRAMMAR: 'Ngữ pháp',
  LISTENING: 'Nghe',
  CONVERSATION: 'Hội thoại',
  READING: 'Đọc',
  QNA: 'Q&A',
};
const SECTION_ORDER: LangItemType[] = [
  'VOCAB',
  'ALPHABET',
  'GRAMMAR',
  'LISTENING',
  'CONVERSATION',
  'READING',
  'QNA',
];

export default function StatsPage() {
  const code = String(useParams().code);
  const reduced = usePrefersReducedMotion();
  const { isAuthenticated } = useLangUser();

  const [stats, setStats] = useState<LearningStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    languageApi
      .stats(code)
      .then((res) => {
        if (alive) setStats(res.data.data ?? null);
      })
      .catch(() => {
        if (alive) setStats(null);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [code, isAuthenticated]);

  return (
    <SectionShell code={code} title="Thống kê" icon={<BarChart3 />}>
      {!isAuthenticated ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-color)] py-16 text-center">
          <div className="mb-3 text-5xl">🔒</div>
          <p className="font-medium text-text-secondary">Đăng nhập để xem tiến độ</p>
          <p className="mt-1 max-w-sm text-sm text-text-muted">
            Theo dõi chuỗi ngày học, tiến độ từng mục và lịch sử kiểm tra của bạn.
          </p>
          <Link
            href="/login"
            className="mt-4 rounded-full bg-neon-violet/20 px-5 py-2.5 font-medium text-neon-violet ring-1 ring-neon-violet/40 transition hover:bg-neon-violet/30"
          >
            Đăng nhập
          </Link>
        </div>
      ) : loading ? (
        <StatsSkeleton />
      ) : !stats ? (
        <EmptyState
          emoji="📊"
          title="Chưa có dữ liệu"
          hint="Bắt đầu học để xem thống kê tiến độ của bạn tại đây."
        />
      ) : (
        <div className="flex flex-col gap-6">
          <StreakCard streak={stats.streak} />
          <SectionProgress perSection={stats.perSection} />
          <QuizHistoryChart history={stats.quizHistory} reduced={reduced} />
        </div>
      )}
    </SectionShell>
  );
}

// ─── Streak ───────────────────────────────────────────────────────
function StreakCard({ streak }: { streak: number }) {
  return (
    <div className="card flex items-center gap-4 rounded-2xl p-5 shadow-[var(--shadow-md)]">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-neon-orange/15 text-neon-orange">
        <Flame size={28} />
      </div>
      <div>
        <p className="font-heading text-3xl font-bold text-text-primary">
          {streak} <span className="text-base font-medium text-text-muted">ngày</span>
        </p>
        <p className="text-sm text-text-muted">
          {streak > 0 ? 'Chuỗi ngày học liên tiếp — giữ vững nhé!' : 'Học hôm nay để bắt đầu chuỗi ngày.'}
        </p>
      </div>
    </div>
  );
}

// ─── Per-section progress ─────────────────────────────────────────
function SectionProgress({
  perSection,
}: {
  perSection: LearningStats['perSection'];
}) {
  const rows = SECTION_ORDER.map((key) => ({ key, data: perSection[key] })).filter((r) => r.data);
  if (rows.length === 0) {
    return null;
  }
  return (
    <div>
      <h2 className="mb-3 font-heading text-lg font-bold text-text-primary">Tiến độ từng mục</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {rows.map(({ key, data }) => {
          const pct = data.total > 0 ? (data.mastered / data.total) * 100 : 0;
          return (
            <div key={key} className="card flex items-center gap-4 rounded-2xl p-4 shadow-[var(--shadow-md)]">
              <ProgressRing value={pct} />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-text-primary">{SECTION_LABELS[key]}</p>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-text-muted">
                  <span className="text-neon-orange">Đang học: {data.learning}</span>
                  <span className="text-neon-cyan">Ôn tập: {data.reviewing}</span>
                  <span className="text-neon-green">Thành thạo: {data.mastered}</span>
                  <span>Tổng: {data.total}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Quiz history bar chart (hand-rolled) ─────────────────────────
function barColor(ratio: number): string {
  if (ratio >= 0.9) return 'var(--neon-green, #22c55e)';
  if (ratio >= 0.7) return 'var(--neon-cyan, #22d3ee)';
  return 'var(--neon-orange, #f97316)';
}

function QuizHistoryChart({
  history,
  reduced,
}: {
  history: LearningStats['quizHistory'];
  reduced: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const CHART_H = 160;

  const bars = useMemo(
    () =>
      history.map((q, i) => {
        const ratio = q.total > 0 ? q.score / q.total : 0;
        return {
          i,
          ratio,
          score: q.score,
          total: q.total,
          date: new Date(q.createdAt),
          color: barColor(ratio),
        };
      }),
    [history],
  );

  return (
    <div>
      <h2 className="mb-3 font-heading text-lg font-bold text-text-primary">Lịch sử kiểm tra</h2>
      {bars.length === 0 ? (
        <div className="card rounded-2xl p-6 text-center text-sm text-text-muted shadow-[var(--shadow-md)]">
          Chưa có bài kiểm tra nào. Làm quiz để xem lịch sử ở đây.
        </div>
      ) : (
        <div className="card rounded-2xl p-4 shadow-[var(--shadow-md)]">
          <div className="overflow-x-auto">
            <div
              className="flex items-end gap-2"
              style={{ height: CHART_H, minWidth: Math.max(bars.length * 34, 0) }}
            >
              {bars.map((b) => (
                <div
                  key={b.i}
                  className="relative flex h-full flex-col items-center justify-end"
                  style={{ width: 26 }}
                  onMouseEnter={() => setHovered(b.i)}
                  onMouseLeave={() => setHovered((h) => (h === b.i ? null : h))}
                >
                  {hovered === b.i && (
                    <div className="pointer-events-none absolute bottom-full z-10 mb-1 whitespace-nowrap rounded-lg bg-[var(--bg-card)] px-2.5 py-1.5 text-xs shadow-lg ring-1 ring-[var(--border-color)]">
                      <span className="font-semibold text-text-primary">
                        {b.score}/{b.total}
                      </span>
                      <span className="ml-1 text-text-muted">
                        · {b.date.toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  )}
                  <motion.div
                    className="w-full rounded-t-md"
                    style={{ backgroundColor: b.color }}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(b.ratio * 100, 3)}%` }}
                    transition={{ duration: reduced ? 0 : 0.3, ease: 'easeOut' }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
            <LegendDot color={barColor(1)} label="≥ 90%" />
            <LegendDot color={barColor(0.75)} label="≥ 70%" />
            <LegendDot color={barColor(0)} label="< 70%" />
          </div>
        </div>
      )}
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────
function StatsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-24 animate-pulse rounded-2xl bg-[var(--bg-surface)] shadow-[var(--shadow-md)]" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-[var(--bg-surface)] shadow-[var(--shadow-md)]" />
        ))}
      </div>
      <div className="h-48 animate-pulse rounded-2xl bg-[var(--bg-surface)] shadow-[var(--shadow-md)]" />
    </div>
  );
}
