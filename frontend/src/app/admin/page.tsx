'use client';

/**
 * /admin — tổng quan (23/09/2026).
 *
 * Trả lời ba câu hỏi đầu ngày, theo thứ tự: có gì đang CHỜ tôi không, hôm nay
 * web chạy thế nào (người xem, tiền), và cái gì mới xảy ra. Số liệu nằm trên
 * một dải chia bằng đường kẻ mảnh — không thẻ, không ô biểu tượng gradient.
 *
 * Mỗi nguồn số liệu nạp ĐỘC LẬP (allSettled): một endpoint chậm/hỏng chỉ làm
 * ô của nó hiện "—", không kéo cả trang. Không bịa tổng từ một trang phân
 * trang — thiếu tổng thật thì để "—".
 */
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Inbox } from 'lucide-react';
import { api, commerceAdminApi, type CommerceDashboard } from '@/lib/api';
import { BIEU_TUONG_TIN } from '@/components/admin/bieuTuongTin';
import { EmptyState, Metric, PageHeader, Section, Status, relTime, type Tone } from '@/components/admin/ui';

interface Pair { views: number; visitors: number }
interface TrafficOverview { today: Pair; yesterday: Pair; last7d: Pair; last30d: Pair; online: number }
interface Daily { day: string; views: number; visitors: number }
interface TopPage { path: string; views: number; visitors: number }
interface RecentPost { id: number; title: string; status: string; viewCount: number; createdAt: string }
interface TinAdmin {
  id: number; loai: string; tieuDe: string; duongDan: string | null; createdAt: string;
  nguoi: { username: string | null; fullName: string | null } | null;
}

const nf = new Intl.NumberFormat('en-US');
const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
const n = (v: number | null | undefined) => (typeof v === 'number' ? nf.format(v) : '—');
const vnd = (v: number | null | undefined) => (typeof v === 'number' ? `${compact.format(v)} ₫` : '—');

function delta(a: number, b: number): string | null {
  if (!b) return null;
  const pct = Math.round(((a - b) / b) * 100);
  return `${pct >= 0 ? '+' : ''}${pct}% vs yesterday`;
}

const POST_TONE: Record<string, Tone> = { PUBLISHED: 'green', DRAFT: 'gray', SCHEDULED: 'blue', ARCHIVED: 'gray' };

/** Cột mảnh một màu — đủ để thấy xu hướng, không cần thư viện biểu đồ. */
function Bars({ values, labels, format }: { values: number[]; labels: string[]; format: (v: number) => string }) {
  const max = Math.max(1, ...values);
  return (
    <div className="flex h-24 items-end gap-[3px] pt-3" role="img" aria-label="Daily chart">
      {values.map((v, i) => (
        <div key={i} className="group relative flex h-full flex-1 items-end">
          <div
            className="w-full rounded-[2px] bg-[var(--a-text-3)] opacity-60 group-hover:bg-[var(--a-accent)] group-hover:opacity-100"
            style={{ height: `${Math.max(v > 0 ? 3 : 1, (v / max) * 100)}%` }}
          />
          <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded-[5px] border border-[var(--a-border-strong)] bg-[var(--a-raised)] px-2 py-1 text-[11.5px] tabular-nums text-[var(--a-text)] group-hover:block">
            {labels[i]} · {format(v)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const [traffic, setTraffic] = useState<TrafficOverview | null>(null);
  const [daily, setDaily] = useState<Daily[]>([]);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [commerce, setCommerce] = useState<CommerceDashboard | null>(null);
  const [posts, setPosts] = useState<RecentPost[]>([]);
  const [totals, setTotals] = useState<{ posts: number | null; users: number | null }>({ posts: null, users: null });
  const [chat, setChat] = useState<Record<string, number>>({});
  const [pending, setPending] = useState<TinAdmin[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [ov, dl, tp, cm, ps, us, ch, tb] = await Promise.allSettled([
        api.get('/admin/analytics/overview'),
        api.get('/admin/analytics/daily', { params: { days: 30 } }),
        api.get('/admin/analytics/top-pages', { params: { days: 7, limit: 6 } }),
        commerceAdminApi.dashboard(30),
        api.get('/admin/posts?page=0&size=6'),
        api.get('/admin/users?page=0&size=1'),
        api.get('/ai/analytics/overview'),
        fetch('/api/v1/admin/thong-bao?limit=6&canXuLy=1', { credentials: 'include' }).then((r) => r.json()),
      ]);
      if (!alive) return;
      if (ov.status === 'fulfilled') setTraffic(ov.value.data?.data ?? null);
      if (dl.status === 'fulfilled') setDaily(dl.value.data?.data ?? []);
      if (tp.status === 'fulfilled') setTopPages(tp.value.data?.data ?? []);
      if (cm.status === 'fulfilled') setCommerce(cm.value.data?.data ?? null);
      if (ps.status === 'fulfilled') {
        const rows = Array.isArray(ps.value.data?.data) ? ps.value.data.data : [];
        setPosts(rows.map((p: RecentPost) => ({ id: p.id, title: p.title, status: p.status, viewCount: p.viewCount || 0, createdAt: p.createdAt })));
      }
      setTotals({
        posts: ps.status === 'fulfilled' && typeof ps.value.data?.pagination?.total === 'number' ? ps.value.data.pagination.total : null,
        users: us.status === 'fulfilled' && typeof us.value.data?.pagination?.total === 'number' ? us.value.data.pagination.total : null,
      });
      if (ch.status === 'fulfilled') setChat(ch.value.data?.data ?? {});
      if (tb.status === 'fulfilled' && tb.value?.data) {
        setPending(tb.value.data.items ?? []);
        setPendingCount(tb.value.data.canXuLy ?? 0);
      }
      setLoaded(true);
    })();
    return () => { alive = false; };
  }, []);

  const today = useMemo(
    () => new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }),
    [],
  );

  const rev = commerce?.theoNgay ?? [];
  const cho = commerce?.tomTat.canXuLy;

  return (
    <div className="mx-auto max-w-[1180px]">
      <PageHeader
        title="Overview"
        description={today}
        actions={
          <a href="/" target="_blank" rel="noreferrer" className="a-btn">
            Open site <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        }
      />

      {/* Dải chỉ số */}
      <div className="grid grid-cols-2 border-y border-[var(--a-border)] sm:grid-cols-3 lg:grid-cols-6 [&>*]:border-[var(--a-border)] [&>*:not(:first-child)]:lg:border-l">
        <Metric
          label="Visitors today"
          value={traffic ? n(traffic.today.visitors) : '—'}
          hint={traffic ? delta(traffic.today.visitors, traffic.yesterday.visitors) ?? `${n(traffic.online)} online` : undefined}
        />
        <Metric label="Page views today" value={traffic ? n(traffic.today.views) : '—'} hint={traffic ? `${n(traffic.last7d.views)} last 7 days` : undefined} />
        <Metric label="Revenue today" value={commerce ? vnd(commerce.tomTat.homNay.tienThat) : '—'} hint={commerce ? `${vnd(commerce.tomTat.bayNgay.tienThat)} last 7 days` : undefined} />
        <Metric label="Revenue · 30 days" value={commerce ? vnd(commerce.tomTat.baMuoiNgay.tienThat) : '—'} hint={commerce ? `${n(commerce.thanhToan.daTra)} paid orders` : undefined} />
        <Metric label="Users" value={n(totals.users)} hint={`${n(totals.posts)} posts`} />
        <Metric label="AI conversations" value={n(chat.totalSessions)} hint={`${n(chat.totalMessages)} messages`} />
      </div>

      <div className="mt-8 grid gap-x-10 gap-y-8 lg:grid-cols-2">
        {/* Việc chờ */}
        <Section
          title={<>Needs attention{pendingCount > 0 && <span className="ml-1.5 tabular-nums text-[var(--a-text-3)]">{pendingCount}</span>}</>}
          action={<Link href="/admin/thong-bao" className="text-[12px] text-[var(--a-text-3)] hover:text-[var(--a-text)]">Inbox</Link>}
        >
          {cho && (cho.chuyenKhoanChoDuyet > 0 || cho.yeuCauDoiKey > 0 || cho.donChoThanhToan > 0) && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 border-b border-[var(--a-border)] py-2 text-[12px] text-[var(--a-text-3)]">
              {cho.chuyenKhoanChoDuyet > 0 && (
                <Link href="/admin/commerce?tab=chuyenkhoan" className="hover:text-[var(--a-text)]">
                  <Status tone="orange">{cho.chuyenKhoanChoDuyet} transfers to confirm</Status>
                </Link>
              )}
              {cho.yeuCauDoiKey > 0 && (
                <Link href="/admin/commerce?tab=doikey" className="hover:text-[var(--a-text)]">
                  <Status tone="orange">{cho.yeuCauDoiKey} key replacements</Status>
                </Link>
              )}
              {cho.donChoThanhToan > 0 && <Status tone="gray">{cho.donChoThanhToan} orders awaiting payment</Status>}
            </div>
          )}
          {!loaded ? (
            <SkeletonRows />
          ) : pending.length === 0 ? (
            <EmptyState icon={Inbox} title="Nothing pending">Mọi việc đã xử lý xong.</EmptyState>
          ) : (
            <ul>
              {pending.map((t) => {
                const Icon = BIEU_TUONG_TIN[t.loai] ?? BIEU_TUONG_TIN.KHAC;
                const row = (
                  <>
                    <Icon className="h-4 w-4 shrink-0 text-[var(--a-text-3)]" strokeWidth={1.75} />
                    <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--a-text)]">{t.tieuDe}</span>
                    {t.nguoi?.username && (
                      <span className="hidden max-w-[120px] shrink-0 truncate text-[12px] text-[var(--a-text-3)] sm:block">
                        {t.nguoi.fullName || t.nguoi.username}
                      </span>
                    )}
                    <span className="w-9 shrink-0 text-right text-[12px] tabular-nums text-[var(--a-text-3)]">{relTime(t.createdAt)}</span>
                  </>
                );
                return (
                  <li key={t.id} className="border-b border-[var(--a-border)]">
                    {t.duongDan ? (
                      <Link href={t.duongDan} className="-mx-2 flex h-9 items-center gap-3 rounded-[6px] px-2 hover:bg-[var(--a-hover)]">{row}</Link>
                    ) : (
                      <div className="flex h-9 items-center gap-3">{row}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Section>

        {/* Bài viết mới */}
        <Section
          title="Recent posts"
          action={<Link href="/admin/posts" className="text-[12px] text-[var(--a-text-3)] hover:text-[var(--a-text)]">All posts</Link>}
        >
          {!loaded ? (
            <SkeletonRows />
          ) : posts.length === 0 ? (
            <EmptyState title="No posts yet" />
          ) : (
            <ul>
              {posts.map((p) => (
                <li key={p.id} className="flex h-9 items-center gap-3 border-b border-[var(--a-border)]">
                  <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--a-text)]">{p.title}</span>
                  <span className="w-[92px] shrink-0">
                    <Status tone={POST_TONE[p.status] ?? 'gray'}>{p.status.charAt(0) + p.status.slice(1).toLowerCase()}</Status>
                  </span>
                  <span className="w-14 shrink-0 text-right text-[12px] tabular-nums text-[var(--a-text-3)]">{n(p.viewCount)}</span>
                  <span className="w-9 shrink-0 text-right text-[12px] tabular-nums text-[var(--a-text-3)]">{relTime(p.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        {/* Doanh thu 30 ngày */}
        <Section
          title="Revenue · last 30 days"
          action={<Link href="/admin/commerce" className="text-[12px] text-[var(--a-text-3)] hover:text-[var(--a-text)]">Details</Link>}
        >
          {rev.length ? (
            <>
              <Bars
                values={rev.map((d) => d.tienThat)}
                labels={rev.map((d) => new Date(d.ngay).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }))}
                format={(v) => `${nf.format(v)} ₫`}
              />
              <div className="mt-2 flex justify-between text-[11.5px] tabular-nums text-[var(--a-text-3)]">
                <span>{new Date(rev[0].ngay).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                <span>
                  {commerce && `${commerce.thanhToan.tiLeHoanTat}% checkout completion`}
                </span>
                <span>Today</span>
              </div>
            </>
          ) : (
            <EmptyState title={loaded ? 'No revenue data' : 'Loading…'} />
          )}
        </Section>

        {/* Lượt xem 30 ngày */}
        <Section
          title="Page views · last 30 days"
          action={<Link href="/admin/analytics" className="text-[12px] text-[var(--a-text-3)] hover:text-[var(--a-text)]">Traffic</Link>}
        >
          {daily.length ? (
            <>
              <Bars
                values={daily.map((d) => d.views)}
                labels={daily.map((d) => new Date(d.day).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }))}
                format={(v) => `${nf.format(v)} views`}
              />
              <div className="mt-2 flex justify-between text-[11.5px] tabular-nums text-[var(--a-text-3)]">
                <span>{new Date(daily[0].day).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                <span>{traffic && `${n(traffic.last30d.visitors)} visitors`}</span>
                <span>Today</span>
              </div>
            </>
          ) : (
            <EmptyState title={loaded ? 'No traffic data' : 'Loading…'} />
          )}
        </Section>

        {/* Trang được xem nhiều */}
        <Section title="Top pages · 7 days">
          {topPages.length === 0 ? (
            loaded ? <EmptyState title="No data" /> : <SkeletonRows />
          ) : (
            <ul>
              {topPages.map((p) => {
                const max = topPages[0]?.views || 1;
                return (
                  <li key={p.path} className="relative flex h-9 items-center gap-3 border-b border-[var(--a-border)]">
                    <span
                      className="absolute inset-y-[7px] left-0 rounded-[3px] bg-white/[0.035]"
                      style={{ width: `${(p.views / max) * 100}%` }}
                      aria-hidden
                    />
                    <a
                      href={p.path}
                      target="_blank"
                      rel="noreferrer"
                      className="relative min-w-0 flex-1 truncate pl-2 font-mono text-[12px] text-[var(--a-text-2)] hover:text-[var(--a-text)]"
                    >
                      {p.path}
                    </a>
                    <span className="relative w-16 shrink-0 text-right text-[12px] tabular-nums text-[var(--a-text-2)]">{n(p.views)}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </Section>

        {/* AI chat */}
        <Section
          title="AI assistant"
          action={<Link href="/admin/ai-analytics" className="text-[12px] text-[var(--a-text-3)] hover:text-[var(--a-text)]">Analytics</Link>}
        >
          <dl className="text-[13px]">
            {[
              ['Conversations', n(chat.totalSessions)],
              ['Messages', n(chat.totalMessages)],
              ['Positive feedback', typeof chat.positiveFeedbackPercent === 'number' ? `${chat.positiveFeedbackPercent}%` : '—'],
              ['Avg. response time', chat.avgResponseTimeMs ? `${nf.format(Math.round(chat.avgResponseTimeMs))} ms` : '—'],
            ].map(([k, v]) => (
              <div key={k} className="flex h-9 items-center justify-between border-b border-[var(--a-border)]">
                <dt className="text-[var(--a-text-3)]">{k}</dt>
                <dd className="tabular-nums text-[var(--a-text)]">{v}</dd>
              </div>
            ))}
          </dl>
        </Section>
      </div>
    </div>
  );
}

function SkeletonRows() {
  return (
    <div>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex h-9 items-center border-b border-[var(--a-border)]">
          <div className="h-2.5 animate-pulse rounded bg-white/[0.05]" style={{ width: `${70 - i * 12}%` }} />
        </div>
      ))}
    </div>
  );
}
