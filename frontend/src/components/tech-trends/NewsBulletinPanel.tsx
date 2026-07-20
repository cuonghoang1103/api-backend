'use client';

/**
 * Admin panel for the AI news bulletin.
 *
 * Three things an editor actually needs, in the order they need them:
 *   1. are my sources healthy?      → feed list with last-fetch + last error
 *   2. what would today's bulletin be made of?  → candidate preview
 *   3. publish it — now, or at a set time.
 *
 * The candidate preview matters more than it looks: it is the moment a human
 * can see the real headlines the model will be restricted to, before any tokens
 * are spent. If that list looks wrong, the bulletin would have been wrong too.
 */

import { useCallback, useEffect, useState } from 'react';
import { toast as sonner } from 'sonner';
import {
  adminTechTrendsApi,
  type NewsFeedDto,
  type NewsCandidateDto,
  type NewsIngestResult,
} from '@/lib/api';

interface Props {
  onPublished?: () => void;
}

function timeAgo(iso: string | null): string {
  if (!iso) return 'chưa lấy';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return 'vừa xong';
  if (m < 60) return `${m} phút trước`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} giờ trước`;
  return `${Math.round(h / 24)} ngày trước`;
}

/** Default schedule: tomorrow 07:30 local, formatted for datetime-local. */
function defaultSchedule(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(7, 30, 0, 0);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function NewsBulletinPanel({ onPublished }: Props) {
  const [open, setOpen] = useState(false);
  const [feeds, setFeeds] = useState<NewsFeedDto[]>([]);
  const [candidates, setCandidates] = useState<NewsCandidateDto[]>([]);
  const [ingesting, setIngesting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [loadingFeeds, setLoadingFeeds] = useState(false);
  const [lastIngest, setLastIngest] = useState<NewsIngestResult | null>(null);
  const [schedule, setSchedule] = useState<string>(defaultSchedule());
  const [useSchedule, setUseSchedule] = useState(false);

  const toast = useCallback(
    (m: string, k: 'success' | 'error' = 'success') => (k === 'error' ? sonner.error(m) : sonner.success(m)),
    [],
  );

  const loadFeeds = useCallback(async () => {
    setLoadingFeeds(true);
    try {
      const [f, c] = await Promise.all([
        adminTechTrendsApi.newsFeeds(),
        adminTechTrendsApi.newsCandidates(12),
      ]);
      setFeeds(f.data.data ?? []);
      setCandidates(c.data.data ?? []);
    } catch {
      toast('Không tải được danh sách nguồn tin', 'error');
    } finally {
      setLoadingFeeds(false);
    }
  }, [toast]);

  useEffect(() => {
    if (open && feeds.length === 0) void loadFeeds();
  }, [open, feeds.length, loadFeeds]);

  const handleSeed = async () => {
    try {
      const r = await adminTechTrendsApi.newsSeedFeeds();
      toast(`Đã thêm ${r.data.data.created} nguồn (đã có ${r.data.data.existing})`);
      await loadFeeds();
    } catch {
      toast('Không thêm được nguồn mặc định', 'error');
    }
  };

  const handleIngest = async () => {
    setIngesting(true);
    try {
      const r = await adminTechTrendsApi.newsIngest();
      setLastIngest(r.data.data);
      toast(`Hút xong: ${r.data.data.itemsNew} tin mới / ${r.data.data.ok} nguồn OK`);
      await loadFeeds();
    } catch {
      toast('Hút tin thất bại', 'error');
    } finally {
      setIngesting(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const publishAt = useSchedule ? new Date(schedule).toISOString() : undefined;
      const r = await adminTechTrendsApi.newsGenerate({ publishAt });
      const d = r.data.data;
      toast(
        d.status === 'PUBLISHED'
          ? `Đã đăng bản tin (${d.sources} nguồn) — /tech-trends/${d.slug}`
          : `Đã hẹn giờ đăng bản tin (${d.sources} nguồn)`,
      );
      setCandidates([]);
      onPublished?.();
      await loadFeeds();
    } catch (err) {
      const res = (err as { response?: { status?: number; data?: { message?: string } } })?.response;
      if (!res) {
        // No response at all means the BROWSER gave up, not the server. The
        // server keeps writing and will publish the bulletin — saying "thất
        // bại" here is how five bulletins got posted in four minutes.
        toast(
          'Trình duyệt hết giờ chờ, nhưng máy chủ vẫn đang soạn bản tin. '
          + 'ĐỪNG bấm lại — kiểm tra danh sách bài sau vài phút.',
          'error',
        );
        onPublished?.();
      } else {
        toast(res.data?.message || 'Tạo bản tin thất bại', 'error');
      }
    } finally {
      setGenerating(false);
    }
  };

  const toggleFeed = async (feed: NewsFeedDto) => {
    try {
      await adminTechTrendsApi.newsUpdateFeed(feed.id, { isActive: !feed.isActive });
      setFeeds((prev) => prev.map((f) => (f.id === feed.id ? { ...f, isActive: !f.isActive } : f)));
    } catch {
      toast('Không đổi được trạng thái nguồn', 'error');
    }
  };

  const brokenFeeds = feeds.filter((f) => f.isActive && f.lastError);

  return (
    <div className="rounded-2xl border border-darkborder bg-darkcard overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-darkbg transition-colors"
      >
        <span className="flex items-center gap-2">
          <span className="text-xl">📰</span>
          <span className="font-semibold text-text-primary">Bảng tin AI</span>
          <span className="text-xs text-text-secondary">
            tổng hợp tin trong ngày từ nguồn chính thức
          </span>
        </span>
        <span className="flex items-center gap-2">
          {brokenFeeds.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500">
              {brokenFeeds.length} nguồn lỗi
            </span>
          )}
          <span className="text-text-secondary">{open ? '▲' : '▼'}</span>
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-darkborder pt-4">
          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleIngest}
              disabled={ingesting}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-darkbg text-text-primary hover:opacity-80 disabled:opacity-50"
            >
              {ingesting ? 'Đang hút tin…' : '↻ Hút tin mới'}
            </button>
            <button
              type="button"
              onClick={() => void loadFeeds()}
              disabled={loadingFeeds}
              className="px-3 py-2 rounded-lg text-sm bg-darkbg text-text-secondary hover:opacity-80 disabled:opacity-50"
            >
              Xem tin ứng viên
            </button>
            {feeds.length === 0 && (
              <button
                type="button"
                onClick={handleSeed}
                className="px-3 py-2 rounded-lg text-sm bg-darkbg text-text-secondary hover:opacity-80"
              >
                + Thêm 19 nguồn mặc định
              </button>
            )}
          </div>

          {lastIngest && (
            <p className="text-xs text-text-secondary">
              Lần hút gần nhất: <strong>{lastIngest.itemsNew}</strong> tin mới ·{' '}
              {lastIngest.ok}/{lastIngest.feeds} nguồn OK
              {lastIngest.failed > 0 && <span className="text-amber-500"> · {lastIngest.failed} lỗi</span>}
            </p>
          )}

          {/* Candidates — the human check before spending tokens */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-2">
              Tin sẽ đưa vào bản tin{' '}
              <span className="font-normal text-text-secondary">
                ({candidates.length} tin — AI chỉ được viết từ đúng những tin này)
              </span>
            </h4>
            {candidates.length === 0 ? (
              <p className="text-sm text-text-secondary">
                Chưa có tin ứng viên. Bấm “Hút tin mới” trước.
              </p>
            ) : (
              <ul className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {candidates.map((c) => (
                  <li key={c.id} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-darkbg text-text-secondary">
                      {c.score}
                    </span>
                    <span className="min-w-0">
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-primary hover:underline break-words"
                      >
                        {c.title}
                      </a>
                      <span className="text-text-secondary">
                        {' '}· {c.publisher}
                        {c.publishedAt ? ` · ${timeAgo(c.publishedAt)}` : ' · không rõ giờ'}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Publish */}
          <div className="rounded-xl bg-darkbg p-3 space-y-3">
            <label className="flex items-center gap-2 text-sm text-text-primary">
              <input
                type="checkbox"
                checked={useSchedule}
                onChange={(e) => setUseSchedule(e.target.checked)}
                className="rounded"
              />
              Hẹn giờ đăng
            </label>
            {useSchedule && (
              <input
                type="datetime-local"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-darkcard border border-darkborder text-text-primary text-sm"
              />
            )}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating || candidates.length < 3}
              className="w-full px-4 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:opacity-90 disabled:opacity-50"
            >
              {generating
                ? 'AI đang viết bản tin… (vài phút, đừng bấm lại)'
                : useSchedule
                  ? '📰 Tạo & hẹn giờ đăng'
                  : '📰 Tạo & đăng ngay'}
            </button>
            <p className="text-xs text-text-secondary">
              Bài đăng dưới tên tài khoản admin của bạn, gắn nhãn “AI tổng hợp”, và luôn kèm mục
              “Nguồn chính thức” dẫn thẳng tới bài gốc.
            </p>
            <p className="text-xs text-text-muted">
              Soạn một bản tin mất <strong>vài phút</strong>. Nếu có báo lỗi, hãy xem danh sách bài
              trước khi bấm lại — máy chủ thường vẫn đăng xong.
            </p>
          </div>

          {/* Feed health */}
          <details>
            <summary className="text-sm font-semibold text-text-primary cursor-pointer">
              Nguồn tin ({feeds.filter((f) => f.isActive).length}/{feeds.length} đang bật)
            </summary>
            <ul className="mt-2 space-y-1">
              {feeds.map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-2 text-sm py-1">
                  <span className="min-w-0">
                    <button
                      type="button"
                      onClick={() => void toggleFeed(f)}
                      className={`mr-2 text-xs px-1.5 py-0.5 rounded ${
                        f.isActive ? 'bg-emerald-500/15 text-emerald-500' : 'bg-darkbg text-text-secondary'
                      }`}
                    >
                      {f.isActive ? 'bật' : 'tắt'}
                    </button>
                    <span className="text-text-primary">{f.name}</span>
                    <span className="text-text-secondary">
                      {' '}· {f._count?.items ?? 0} tin · {timeAgo(f.lastFetchAt)}
                    </span>
                  </span>
                  {f.lastError && (
                    <span className="shrink-0 text-xs text-amber-500" title={f.lastError}>
                      lỗi
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </details>
        </div>
      )}
    </div>
  );
}
