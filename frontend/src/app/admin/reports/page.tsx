'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Search,
  X,
  ChevronDown,
  RefreshCw,
  MessageSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminReportsApi } from '@/lib/api';
import type {
  MessagingThreadReport,
  MessagingThreadReportStats,
  MessagingThreadReportList,
} from '@/lib/api';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import toast from 'react-hot-toast';
import SafeImage from '@/components/ui/SafeImage';

const CATEGORY_LABELS: Record<string, string> = {
  spam: 'Spam / Lừa đảo',
  harassment: 'Quấy rối',
  hate: 'Ngôn từ thù ghét',
  impersonation: 'Mạo danh',
  other: 'Khác',
};

const CATEGORY_COLORS: Record<string, string> = {
  spam: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  harassment: 'bg-red-500/20 text-red-300 border-red-500/30',
  hate: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  impersonation: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  other: 'bg-white/10 text-text-secondary border-white/20',
};

type Tab = 'open' | 'resolved';

export default function AdminReportsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('open');
  const [reports, setReports] = useState<MessagingThreadReport[]>([]);
  const [stats, setStats] = useState<MessagingThreadReportStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [resolvingId, setResolvingId] = useState<number | null>(null);
  const [resolveNote, setResolveNote] = useState('');
  const [showResolveForm, setShowResolveForm] = useState<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadReports = useCallback(
    async (reset = false) => {
      if (loading) return;
      setLoading(true);
      try {
        const res = await adminReportsApi.list({
          status: tab,
          cursor: reset ? undefined : (nextCursor ?? undefined),
          take: 30,
        });
        const data: MessagingThreadReportList = res.data.data;
        if (reset) {
          setReports(data.rows);
        } else {
          setReports((prev) => [...prev, ...data.rows]);
        }
        setNextCursor(data.nextCursor);
        setHasMore(data.nextCursor !== null);
      } catch (e) {
        toast.error('Không thể tải danh sách báo cáo');
      } finally {
        setLoading(false);
      }
    },
    [loading, nextCursor, tab],
  );

  const loadStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const res = await adminReportsApi.stats();
      setStats(res.data.data);
    } catch (e) {
      // non-critical
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Initial load + tab switch
  useEffect(() => {
    void loadReports(true);
    void loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // Auto-refresh every 15s so new reports surface in real-time
  // without requiring a manual page reload.
  useEffect(() => {
    pollIntervalRef.current = setInterval(() => {
      void loadReports(true);
      void loadStats();
    }, 15_000);
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [loadReports, loadStats]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!loadMoreRef.current) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          void loadReports(false);
        }
      },
      { threshold: 0.1 },
    );
    observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, loadReports]);

  const handleResolve = async (reportId: number) => {
    setResolvingId(reportId);
    try {
      await adminReportsApi.resolve(reportId, resolveNote || undefined);
      toast.success('Đã tiếp nhận báo cáo');
      setShowResolveForm(null);
      setResolveNote('');
      setResolvingId(null);
      // Move the resolved item to the resolved tab
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      void loadStats();
    } catch (e) {
      toast.error('Không thể tiếp nhận báo cáo');
      setResolvingId(null);
    }
  };

  // Client-side search across reporter name + reason
  const filtered = reports.filter((r) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (
      r.reporter?.displayName?.toLowerCase().includes(q) ||
      r.reporter?.username?.toLowerCase().includes(q) ||
      r.reason.toLowerCase().includes(q) ||
      r.category?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05050f] via-[#08081a] to-[#03030c] px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-primary" style={{ letterSpacing: '-0.02em' }}>
              Báo cáo vi phạm
            </h1>
            <p className="mt-0.5 text-[11.5px] text-text-muted">
              Tiếp nhận & xử lý khiếu nại từ người dùng về cuộc trò chuyện
            </p>
          </div>
          <button
            onClick={() => { void loadReports(true); void loadStats(); }}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-text-secondary transition-colors hover:bg-white/[0.08]"
          >
            <RefreshCw className="h-3 w-3" />
            Làm mới
          </button>
        </div>

        {/* Stats cards */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <StatCard
            icon={AlertTriangle}
            label="Chưa xử lý"
            value={stats?.open ?? '...'}
            color="text-amber-300"
            bg="bg-amber-500/10 border-amber-500/20"
            loading={loadingStats}
          />
          <StatCard
            icon={CheckCircle2}
            label="Đã xử lý (24h)"
            value={stats?.resolved24h ?? '...'}
            color="text-emerald-300"
            bg="bg-emerald-500/10 border-emerald-500/20"
            loading={loadingStats}
          />
          <StatCard
            icon={ShieldAlert}
            label="Tổng báo cáo"
            value={stats?.total ?? '...'}
            color="text-cyan-300"
            bg="bg-cyan-500/10 border-cyan-500/20"
            loading={loadingStats}
          />
        </div>

        {/* Tab bar */}
        <div className="mb-4 flex items-center gap-1 rounded-xl border border-white/[0.06] bg-white/[0.03] p-1">
          {([['open', 'Chưa xử lý'], ['resolved', 'Đã tiếp nhận']] as [Tab, string][]).map(
            ([t, label]) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'flex-1 rounded-lg px-4 py-2 text-[12px] font-semibold transition-all',
                  tab === t
                    ? 'bg-white/10 text-text-primary shadow-sm'
                    : 'text-text-muted hover:text-text-secondary',
                )}
              >
                {label}
                {t === 'open' && stats && stats.open > 0 && (
                  <span className="ml-1.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500/20 px-1 text-[10px] font-bold text-amber-300">
                    {stats.open}
                  </span>
                )}
              </button>
            ),
          )}
        </div>

        {/* Search */}
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 focus-within:border-cyan-500/40">
          <Search className="h-3.5 w-3.5 shrink-0 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên người báo cáo, lý do..."
            className="flex-1 bg-transparent text-[12px] text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-text-muted hover:text-text-primary">
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* List */}
        <div className="space-y-2.5">
          {loading && reports.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04]">
                <CheckCircle2 className="h-5 w-5 text-text-muted" />
              </div>
              <p className="text-[12.5px] font-semibold text-text-primary">
                {tab === 'open' ? 'Không có báo cáo nào' : 'Không có báo cáo đã xử lý'}
              </p>
              <p className="mt-1 text-[11px] text-text-muted">
                {tab === 'open'
                  ? 'Mọi thứ đều ổn định.'
                  : 'Các báo cáo đã tiếp nhận sẽ hiển thị ở đây.'}
              </p>
            </div>
          ) : (
            <>
              {filtered.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  expanded={expandedId === report.id}
                  onToggle={() =>
                    setExpandedId((cur) => (cur === report.id ? null : report.id))
                  }
                  onResolve={(id) => setShowResolveForm(id)}
                  showResolveForm={showResolveForm === report.id}
                  resolveNote={resolveNote}
                  onResolveNoteChange={setResolveNote}
                  onConfirmResolve={() => void handleResolve(report.id)}
                  resolving={resolvingId === report.id}
                  tab={tab}
                />
              ))}

              {/* Infinite scroll trigger */}
              {hasMore && (
                <div ref={loadMoreRef} className="flex justify-center py-4">
                  {loading && <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
  loading,
}: {
  icon: typeof AlertTriangle;
  label: string;
  value: string | number;
  color: string;
  bg: string;
  loading: boolean;
}) {
  return (
    <div className={cn('rounded-xl border p-3.5', bg)}>
      <div className="mb-2 flex items-center gap-1.5">
        <Icon className={cn('h-3.5 w-3.5', color)} />
        <span className="text-[10.5px] font-semibold uppercase tracking-wider text-text-muted">
          {label}
        </span>
      </div>
      {loading ? (
        <div className="h-6 w-12 animate-pulse rounded bg-white/10" />
      ) : (
        <span className={cn('text-2xl font-bold tabular-nums', color)}>
          {value}
        </span>
      )}
    </div>
  );
}

function ReportCard({
  report,
  expanded,
  onToggle,
  onResolve,
  showResolveForm,
  resolveNote,
  onResolveNoteChange,
  onConfirmResolve,
  resolving,
  tab,
}: {
  report: MessagingThreadReport;
  expanded: boolean;
  onToggle: () => void;
  onResolve: (id: number) => void;
  showResolveForm: boolean;
  resolveNote: string;
  onResolveNoteChange: (v: string) => void;
  onConfirmResolve: () => void;
  resolving: boolean;
  tab: Tab;
}) {
  const router = useRouter();
  const categoryLabel = report.category
    ? CATEGORY_LABELS[report.category] ?? report.category
    : null;

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border transition-colors',
        report.resolvedAt
          ? 'border-white/[0.06] bg-white/[0.02]'
          : 'border-amber-500/20 bg-amber-500/[0.03]',
        tab === 'resolved' && 'opacity-75',
      )}
    >
      {/* Card header — always visible */}
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        {/* Reporter avatar */}
        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full">
          {report.reporter?.avatarUrl ? (
            <SafeImage
              src={report.reporter.avatarUrl}
              alt={report.reporter.displayName ?? 'User'}
              label={(report.reporter.displayName ?? '?').charAt(0)}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #06B6D4, #6366F1)' }}
            >
              {(report.reporter?.displayName ?? '?').charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-[12.5px] font-semibold text-text-primary">
              {report.reporter?.displayName ?? report.reporter?.username ?? 'Người dùng ẩn danh'}
            </span>
            {categoryLabel && (
              <span
                className={cn(
                  'shrink-0 rounded-full border px-1.5 py-0.5 text-[9.5px] font-semibold',
                  CATEGORY_COLORS[report.category!] ?? CATEGORY_COLORS.other,
                )}
              >
                {categoryLabel}
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-[11px] text-text-muted">{report.reason}</p>
        </div>

        {/* Time + expand chevron */}
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden text-[10px] text-text-muted sm:block">
            {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true, locale: vi })}
          </span>
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 text-text-muted transition-transform',
              expanded && 'rotate-180',
            )}
          />
        </div>
      </button>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-t border-white/[0.06] px-4 py-3">
              {/* Meta row */}
              <div className="flex flex-wrap gap-4 text-[11px] text-text-muted">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(report.createdAt).toLocaleString('vi-VN')}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  Thread #{report.thread?.id}
                </span>
                {report.resolvedAt && (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    Tiếp nhận {formatDistanceToNow(new Date(report.resolvedAt), { addSuffix: true, locale: vi })}
                  </span>
                )}
              </div>

              {/* Thread participants */}
              {report.thread && (
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                  <p className="mb-1.5 text-[9.5px] font-semibold uppercase tracking-wider text-text-muted">
                    Cuộc trò chuyện liên quan
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[report.thread.userA, report.thread.userB].filter(Boolean).map((u) => (
                      <div
                        key={u!.id}
                        className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[11px] text-text-secondary"
                      >
                        <span className="font-semibold text-text-primary">
                          {u!.displayName ?? u!.username}
                        </span>
                        <span className="text-text-muted">@{u!.username}</span>
                      </div>
                    ))}
                  </div>
                  {/* Last message preview */}
                  {report.thread.lastMessage && (
                    <p className="mt-2 truncate text-[11px] italic text-text-muted">
                      Tin nhắn gần nhất: {report.thread.lastMessage.content || '(đính kèm)'}
                    </p>
                  )}
                </div>
              )}

              {/* Full reason */}
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                <p className="mb-1 text-[9.5px] font-semibold uppercase tracking-wider text-text-muted">
                  Chi tiết báo cáo
                </p>
                <p className="text-[12px] leading-relaxed text-text-secondary">{report.reason}</p>
              </div>

              {/* Resolution note */}
              {report.resolution && (
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/05 p-2.5">
                  <p className="mb-1 text-[9.5px] font-semibold uppercase tracking-wider text-emerald-400">
                    Ghi chú xử lý
                  </p>
                  <p className="text-[12px] leading-relaxed text-text-secondary">{report.resolution}</p>
                </div>
              )}

              {/* Action buttons */}
              {tab === 'open' && !showResolveForm && (
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => onResolve(report.id)}
                    className="flex-1 rounded-lg border border-amber-500/30 bg-amber-500/15 px-3 py-2 text-[12px] font-semibold text-amber-200 transition-colors hover:bg-amber-500/25"
                  >
                    Tiếp nhận báo cáo
                  </button>
                  {report.thread && (
                    <button
                      onClick={() => router.push(`/messages?peer=chat&thread=${report.thread!.id}`)}
                      className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[12px] font-semibold text-text-secondary transition-colors hover:bg-white/[0.08]"
                    >
                      Xem cuộc trò chuyện
                    </button>
                  )}
                </div>
              )}

              {showResolveForm && (
                <div className="space-y-2 rounded-lg border border-amber-500/20 bg-amber-500/05 p-2.5">
                  <p className="text-[10.5px] font-semibold uppercase tracking-wider text-text-muted">
                    Ghi chú xử lý (tuỳ chọn)
                  </p>
                  <textarea
                    value={resolveNote}
                    onChange={(e) => onResolveNoteChange(e.target.value)}
                    maxLength={500}
                    placeholder="Mô tả hành động đã thực hiện..."
                    className="w-full resize-none rounded-lg border border-white/[0.06] bg-white/[0.03] p-2 text-[12px] text-text-primary placeholder:text-text-muted focus:border-amber-500/40 focus:outline-none"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => { onResolveNoteChange(''); }}
                      className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11.5px] text-text-secondary transition-colors hover:bg-white/[0.08]"
                    >
                      Huỷ
                    </button>
                    <button
                      onClick={onConfirmResolve}
                      disabled={resolving}
                      className="flex-1 rounded-lg border border-amber-500/30 bg-amber-500/20 px-3 py-1.5 text-[11.5px] font-semibold text-amber-200 transition-colors hover:bg-amber-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {resolving ? (
                        <Loader2 className="mx-auto h-3.5 w-3.5 animate-spin" />
                      ) : (
                        'Xác nhận tiếp nhận'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}