'use client';

/**
 * Admin · Web analytics.
 *
 * Numbers here are deliberately conservative: bots are excluded from every
 * figure (their share is shown separately so a spike stays explainable), and a
 * "visitor" means a distinct browser session, not a request. Admin pages are
 * never recorded, so this dashboard does not count itself.
 */

import { useCallback, useEffect, useState } from 'react';
import { Users, Eye, Activity, Bot, RefreshCw } from 'lucide-react';
import api from '@/lib/api';

interface Pair { views: number; visitors: number }
interface Overview {
  today: Pair; yesterday: Pair; last7d: Pair; last30d: Pair;
  online: number; botShare: number;
}
interface Daily { day: string; views: number; visitors: number }
interface TopPage { path: string; views: number; visitors: number }
interface Breakdown {
  devices: Array<{ device: string; views: number }>;
  referrers: Array<{ host: string; views: number }>;
}
interface Recent { path: string; title: string | null; device: string | null; createdAt: string; userId: number | null }

const REFRESH_MS = 15_000;

function delta(today: number, yesterday: number): { text: string; up: boolean } | null {
  if (!yesterday) return null;
  const pct = Math.round(((today - yesterday) / yesterday) * 100);
  return { text: `${pct >= 0 ? '+' : ''}${pct}%`, up: pct >= 0 };
}

export default function AdminAnalyticsPage() {
  const [ov, setOv] = useState<Overview | null>(null);
  const [daily, setDaily] = useState<Daily[]>([]);
  const [pages, setPages] = useState<TopPage[]>([]);
  const [bd, setBd] = useState<Breakdown | null>(null);
  const [recent, setRecent] = useState<Recent[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [o, d, p, b, r] = await Promise.all([
        api.get('/admin/analytics/overview'),
        api.get('/admin/analytics/daily', { params: { days: 30 } }),
        api.get('/admin/analytics/top-pages', { params: { days: 7, limit: 15 } }),
        api.get('/admin/analytics/breakdown', { params: { days: 7 } }),
        api.get('/admin/analytics/recent', { params: { limit: 25 } }),
      ]);
      setOv(o.data.data); setDaily(d.data.data ?? []); setPages(p.data.data ?? []);
      setBd(b.data.data); setRecent(r.data.data ?? []); setErr(null);
    } catch {
      setErr('Không tải được số liệu. Thử lại sau ít phút.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    void load();
    const id = setInterval(() => void load(), REFRESH_MS);
    return () => clearInterval(id);
  }, [load]);

  const max = Math.max(1, ...daily.map((d) => d.views));
  const dTodayViews = ov ? delta(ov.today.views, ov.yesterday.views) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-text-primary sm:text-3xl">
            <Activity className="h-6 w-6 text-neon-violet" /> Lượt truy cập
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Đã loại bot khỏi mọi con số · &quot;khách&quot; = phiên trình duyệt riêng biệt · trang /admin không được tính
          </p>
        </div>
        <button
          onClick={() => void load()}
          className="inline-flex items-center gap-2 rounded-xl bg-darkcard px-3 py-2 text-sm text-text-secondary hover:opacity-80"
        >
          <RefreshCw className="h-4 w-4" /> Tự làm mới mỗi 15s
        </button>
      </div>

      {err && <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-500">{err}</div>}

      {/* Headline numbers */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Đang xem (5 phút qua)', value: ov?.online, icon: Activity, accent: 'text-emerald-400', live: true },
          { label: 'Lượt xem hôm nay', value: ov?.today.views, icon: Eye, accent: 'text-neon-violet', d: dTodayViews },
          { label: 'Khách hôm nay', value: ov?.today.visitors, icon: Users, accent: 'text-neon-cyan' },
          { label: 'Bot (7 ngày)', value: ov ? `${ov.botShare}%` : undefined, icon: Bot, accent: 'text-slate-400' },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="rounded-2xl border border-darkborder bg-darkcard p-4">
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <Icon className={`h-4 w-4 ${c.accent}`} />
                {c.label}
                {c.live && <span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-emerald-400" />}
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-text-primary">
                  {loading && c.value === undefined ? '—' : c.value ?? 0}
                </span>
                {c.d && (
                  <span className={`text-xs ${c.d.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {c.d.text} so với hôm qua
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 30-day chart. A bare-CSS bar chart on purpose: no chart library for six
          numbers, and it stays readable when the data is sparse at the start. */}
      <div className="rounded-2xl border border-darkborder bg-darkcard p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-text-primary">30 ngày gần nhất</h2>
          <span className="text-xs text-text-secondary">
            7 ngày: {ov?.last7d.views ?? 0} lượt · {ov?.last7d.visitors ?? 0} khách
          </span>
        </div>
        {daily.length === 0 ? (
          <p className="py-8 text-center text-sm text-text-secondary">
            Chưa có dữ liệu — số liệu bắt đầu được ghi từ lúc tính năng này lên prod.
          </p>
        ) : (
          <div className="flex h-40 items-end gap-1">
            {daily.map((d) => (
              <div key={d.day} className="group relative flex-1" title={`${d.day}: ${d.views} lượt · ${d.visitors} khách`}>
                <div
                  className="w-full rounded-t bg-neon-violet/70 transition-all group-hover:bg-neon-violet"
                  style={{ height: `${Math.max(2, (d.views / max) * 100)}%` }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top pages */}
        <div className="rounded-2xl border border-darkborder bg-darkcard p-4">
          <h2 className="mb-3 font-semibold text-text-primary">Trang xem nhiều nhất (7 ngày)</h2>
          {pages.length === 0 ? (
            <p className="py-6 text-center text-sm text-text-secondary">Chưa có dữ liệu.</p>
          ) : (
            <ul className="space-y-1.5">
              {pages.map((p) => (
                <li key={p.path} className="flex items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate font-mono text-text-primary">{p.path}</span>
                  <span className="shrink-0 text-text-secondary">
                    {p.views} <span className="text-text-muted">· {p.visitors} khách</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Devices + referrers + live ticker */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-darkborder bg-darkcard p-4">
            <h2 className="mb-3 font-semibold text-text-primary">Thiết bị &amp; nguồn vào (7 ngày)</h2>
            <div className="flex flex-wrap gap-2 text-xs">
              {(bd?.devices ?? []).map((d) => (
                <span key={d.device} className="rounded-full bg-darkbg px-2.5 py-1 text-text-secondary">
                  {d.device}: <strong className="text-text-primary">{d.views}</strong>
                </span>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {(bd?.referrers ?? []).slice(0, 8).map((r) => (
                <span key={r.host} className="rounded-full bg-darkbg px-2.5 py-1 text-text-secondary">
                  {r.host}: <strong className="text-text-primary">{r.views}</strong>
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-darkborder bg-darkcard p-4">
            <h2 className="mb-3 flex items-center gap-2 font-semibold text-text-primary">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Vừa xem
            </h2>
            {recent.length === 0 ? (
              <p className="py-4 text-center text-sm text-text-secondary">Chưa có lượt truy cập nào.</p>
            ) : (
              <ul className="max-h-64 space-y-1 overflow-y-auto text-xs">
                {recent.map((r, i) => (
                  <li key={`${r.path}-${r.createdAt}-${i}`} className="flex items-center justify-between gap-2">
                    <span className="min-w-0 truncate font-mono text-text-secondary">{r.path}</span>
                    <span className="shrink-0 text-text-muted">
                      {new Date(r.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      {r.device ? ` · ${r.device}` : ''}
                      {r.userId ? ' · đã đăng nhập' : ''}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
