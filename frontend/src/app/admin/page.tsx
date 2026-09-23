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
import { ArrowUpRight, Activity, BarChart3, FileText, Inbox, Sparkles, TrendingUp, Wallet } from 'lucide-react';
import { api, commerceAdminApi, type CommerceDashboard } from '@/lib/api';
import { BIEU_TUONG_TIN } from '@/components/admin/bieuTuongTin';
import { EmptyState, Metric, PageHeader, Section, Status, relTime, type Tone } from '@/components/admin/ui';
import { useAdminT } from '@/components/admin/i18n';

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

function delta(a: number, b: number, duoi: string): string | null {
  if (!b) return null;
  const pct = Math.round(((a - b) / b) * 100);
  return `${pct >= 0 ? '+' : ''}${pct}% ${duoi}`;
}

const POST_TONE: Record<string, Tone> = { PUBLISHED: 'green', DRAFT: 'gray', SCHEDULED: 'blue', ARCHIVED: 'gray' };

/** Cột mảnh MỘT MÀU cho mỗi biểu đồ (một chuỗi dữ liệu = một hue, không tô
 *  cầu vồng), bo 3px ở đầu trên, cách nhau 2px, lưới ngang mờ phía sau, mốc
 *  lớn nhất ghi ở góc, tooltip khi rê. Màu lấy từ bộ hue đã kiểm mù màu
 *  trong admin.css. Chuỗi toàn số 0 thì nói thẳng là chưa có số liệu, chứ
 *  không vẽ một khung lưới trống cho người xem tự đoán. */
function Bars({
  values, labels, format, color, emptyLabel,
}: {
  values: number[];
  labels: string[];
  format: (v: number) => string;
  color: string;
  emptyLabel: string;
}) {
  const max = Math.max(...values, 0);
  if (max <= 0) {
    return (
      <div className="flex h-[108px] items-center justify-center text-[12.5px] text-[var(--a-text-3)]">
        {emptyLabel}
      </div>
    );
  }
  return (
    <div className="relative pt-3">
      {/* lưới ngang: 4 vạch mờ, lùi hẳn ra sau số liệu */}
      <div className="pointer-events-none absolute inset-x-0 top-3 h-24">
        {[0, 33, 66, 100].map((t) => (
          <div key={t} className="absolute inset-x-0 border-t border-[var(--c-grid)]" style={{ top: `${t}%` }} />
        ))}
        <span className="absolute -top-[9px] right-0 bg-[var(--a-panel)] pl-1.5 text-[11px] tabular-nums text-[var(--a-text-3)]">
          {format(max)}
        </span>
      </div>
      <div className="relative flex h-24 items-end gap-[2px]" role="img" aria-label="Daily chart">
        {values.map((v, i) => (
          <div key={i} className="a-bar-col group relative flex h-full flex-1 items-end">
            <div
              className="a-bar w-full"
              style={{
                height: `${Math.max(v > 0 ? 4 : 1.5, (v / max) * 100)}%`,
                // màu đặc trước, chuyển sắc sau: trình duyệt cũ không hiểu
                // color-mix() thì bỏ qua dòng thứ hai và cột vẫn có màu.
                backgroundColor: v > 0 ? color : 'var(--a-border-strong)',
                backgroundImage: v > 0
                  ? `linear-gradient(180deg, ${color}, color-mix(in srgb, ${color} 62%, transparent))`
                  : undefined,
              }}
            />
            <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded-[6px] border border-[var(--a-border-strong)] bg-[var(--a-raised)] px-2 py-1 text-[11.5px] tabular-nums text-[var(--a-text)] shadow-lg group-hover:block">
              <span className="text-[var(--a-text-3)]">{labels[i]}</span> · {format(v)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { t, lang } = useAdminT();
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
    () => new Date().toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' }),
    [lang],
  );

  const rev = commerce?.theoNgay ?? [];
  const cho = commerce?.tomTat.canXuLy;

  return (
    <div className="mx-auto max-w-[1180px]">
      <PageHeader
        title={t('overview')}
        description={today}
        actions={
          <a href="/" target="_blank" rel="noreferrer" className="a-btn">
            {t('openSite')} <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        }
      />

      {/* Dải chỉ số */}
      <div className="grid grid-cols-2 border-y border-[var(--a-border)] sm:grid-cols-3 xl:grid-cols-6 [&>*]:border-[var(--a-border)] xl:[&>*:not(:first-child)]:border-l">
        <Metric
          label={t('visitorsToday')}
          value={traffic ? n(traffic.today.visitors) : '—'}
          tone="var(--c-1)"
          hint={traffic ? delta(traffic.today.visitors, traffic.yesterday.visitors, t('vsYesterday')) ?? `${n(traffic.online)} ${t('online')}` : undefined}
          up={traffic && traffic.yesterday.visitors ? traffic.today.visitors >= traffic.yesterday.visitors : undefined}
        />
        <Metric label={t('viewsToday')} value={traffic ? n(traffic.today.views) : '—'} tone="var(--c-1)" hint={traffic ? `${n(traffic.last7d.views)} ${t('last7')}` : undefined} />
        <Metric label={t('revenueToday')} value={commerce ? vnd(commerce.tomTat.homNay.tienThat) : '—'} tone="var(--c-3)" hint={commerce ? `${vnd(commerce.tomTat.bayNgay.tienThat)} ${t('last7')}` : undefined} />
        <Metric label={t('revenue30')} value={commerce ? vnd(commerce.tomTat.baMuoiNgay.tienThat) : '—'} tone="var(--c-3)" hint={commerce ? `${n(commerce.thanhToan.daTra)} ${t('paidOrders')}` : undefined} />
        <Metric label={t('users')} value={n(totals.users)} tone="var(--c-2)" hint={`${n(totals.posts)} ${t('posts')}`} />
        <Metric label={t('aiConversations')} value={n(chat.totalSessions)} tone="var(--c-6)" hint={`${n(chat.totalMessages)} ${t('messages')}`} />
      </div>

      <div className="mt-8 grid gap-x-10 gap-y-8 lg:grid-cols-2">
        {/* Việc chờ */}
        <Section
          icon={Inbox}
          tone="var(--a-orange)"
          title={<>{t('needsAttention')}{pendingCount > 0 && <span className="ml-1.5 tabular-nums text-[var(--a-text-3)]">{pendingCount}</span>}</>}
          action={<Link href="/admin/thong-bao" className="text-[12px] text-[var(--a-text-3)] hover:text-[var(--a-text)]">{t('inbox')}</Link>}
        >
          {cho && (cho.chuyenKhoanChoDuyet > 0 || cho.yeuCauDoiKey > 0 || cho.donChoThanhToan > 0) && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 border-b border-[var(--a-border)] py-2 text-[12px] text-[var(--a-text-3)]">
              {cho.chuyenKhoanChoDuyet > 0 && (
                <Link href="/admin/commerce?tab=chuyenkhoan" className="hover:text-[var(--a-text)]">
                  <Status tone="orange">{cho.chuyenKhoanChoDuyet} {t('transfersToConfirm')}</Status>
                </Link>
              )}
              {cho.yeuCauDoiKey > 0 && (
                <Link href="/admin/commerce?tab=doikey" className="hover:text-[var(--a-text)]">
                  <Status tone="orange">{cho.yeuCauDoiKey} {t('keyReplacements')}</Status>
                </Link>
              )}
              {cho.donChoThanhToan > 0 && <Status tone="gray">{cho.donChoThanhToan} {t('ordersAwaiting')}</Status>}
            </div>
          )}
          {!loaded ? (
            <SkeletonRows />
          ) : pending.length === 0 ? (
            <EmptyState icon={Inbox} title={t('nothingPending')}>{t('allDone')}</EmptyState>
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
          icon={FileText}
          tone="var(--c-6)"
          title={t('recentPosts')}
          action={<Link href="/admin/posts" className="text-[12px] text-[var(--a-text-3)] hover:text-[var(--a-text)]">{t('allPosts')}</Link>}
        >
          {!loaded ? (
            <SkeletonRows />
          ) : posts.length === 0 ? (
            <EmptyState title={t('noPosts')} />
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
          icon={Wallet}
          tone="var(--c-3)"
          title={t('revenue30d')}
          action={<Link href="/admin/commerce" className="text-[12px] text-[var(--a-text-3)] hover:text-[var(--a-text)]">{t('details')}</Link>}
        >
          {rev.length ? (
            <>
              <Bars
                values={rev.map((d) => d.tienThat)}
                labels={rev.map((d) => new Date(d.ngay).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }))}
                format={(v) => `${nf.format(v)} ₫`}
                color="var(--c-3)"
                emptyLabel={t('noRevenue30')}
              />
              <div className="mt-2 flex justify-between text-[11.5px] tabular-nums text-[var(--a-text-3)]">
                <span>{new Date(rev[0].ngay).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                <span>
                  {commerce && `${commerce.thanhToan.tiLeHoanTat}% ${t('checkoutCompletion')}`}
                </span>
                <span>{t('today')}</span>
              </div>
            </>
          ) : (
            <EmptyState title={loaded ? t('noRevenue30') : '…'} />
          )}
        </Section>

        {/* Lượt xem 30 ngày */}
        <Section
          icon={TrendingUp}
          tone="var(--c-1)"
          title={t('views30d')}
          action={<Link href="/admin/analytics" className="text-[12px] text-[var(--a-text-3)] hover:text-[var(--a-text)]">{t('traffic')}</Link>}
        >
          {daily.length ? (
            <>
              <Bars
                values={daily.map((d) => d.views)}
                labels={daily.map((d) => new Date(d.day).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }))}
                format={(v) => `${nf.format(v)} ${t('viewsUnit')}`}
                color="var(--c-1)"
                emptyLabel={t('noViews')}
              />
              <div className="mt-2 flex justify-between text-[11.5px] tabular-nums text-[var(--a-text-3)]">
                <span>{new Date(daily[0].day).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                <span>{traffic && `${n(traffic.last30d.visitors)} ${t('visitors')}`}</span>
                <span>{t('today')}</span>
              </div>
            </>
          ) : (
            <EmptyState title={loaded ? t('noViews') : '…'} />
          )}
        </Section>

        {/* Trang được xem nhiều */}
        <Section icon={BarChart3} tone="var(--c-4)" title={t('topPages')}>
          {topPages.length === 0 ? (
            loaded ? <EmptyState title={t('noData')} /> : <SkeletonRows />
          ) : (
            <ul>
              {topPages.map((p) => {
                const max = topPages[0]?.views || 1;
                return (
                  <li key={p.path} className="relative flex h-9 items-center gap-3 border-b border-[var(--a-border)]">
                    <span
                      className="absolute inset-y-[6px] left-0 rounded-[3px]"
                      style={{ width: `${(p.views / max) * 100}%`, backgroundColor: 'rgba(201, 133, 0, 0.18)' }}
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
          icon={Sparkles}
          tone="var(--c-6)"
          title={t('aiAssistant')}
          action={<Link href="/admin/ai-analytics" className="text-[12px] text-[var(--a-text-3)] hover:text-[var(--a-text)]">{t('analytics')}</Link>}
        >
          <dl className="text-[13px]">
            {[
              [t('conversations'), n(chat.totalSessions)],
              [t('messagesCap'), n(chat.totalMessages)],
              [t('avgResponse'), chat.avgResponseTimeMs ? `${nf.format(Math.round(chat.avgResponseTimeMs))} ms` : '—'],
            ].map(([k, v]) => (
              <div key={k} className="flex h-9 items-center justify-between border-b border-[var(--a-border)]">
                <dt className="text-[var(--a-text-3)]">{k}</dt>
                <dd className="tabular-nums text-[var(--a-text)]">{v}</dd>
              </div>
            ))}
            {/* Tỉ lệ hài lòng: một thanh mảnh nói nhanh hơn con số đứng một mình */}
            <div className="flex h-9 items-center justify-between gap-3 border-b border-[var(--a-border)]">
              <dt className="shrink-0 text-[var(--a-text-3)]">{t('positiveFeedback')}</dt>
              <dd className="flex min-w-0 flex-1 items-center justify-end gap-2.5">
                <span className="h-1.5 w-full max-w-[140px] overflow-hidden rounded-full bg-white/[0.06]">
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: `${Math.min(100, Math.max(0, Number(chat.positiveFeedbackPercent) || 0))}%`,
                      background: 'var(--a-green)',
                    }}
                  />
                </span>
                <span className="w-10 shrink-0 text-right tabular-nums text-[var(--a-text)]">
                  {typeof chat.positiveFeedbackPercent === 'number' ? `${chat.positiveFeedbackPercent}%` : '—'}
                </span>
              </dd>
            </div>
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
