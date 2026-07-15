'use client';

/**
 * /admin/cv — CV Builder admin (Phase 10). Anonymized aggregates + the LLM cost
 * dashboard. Never exposes an individual CV (spec) — only counts and spend.
 * Dark-only palette to match the other admin pages.
 */
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, DollarSign, FileText, Cpu, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';
import { cvAdminApi, type CvAdminUsage } from '@/lib/cv-api';

export default function AdminCvPage() {
  const [overview, setOverview] = useState<Record<string, number> | null>(null);
  const [usage, setUsage] = useState<CvAdminUsage | null>(null);
  const [analytics, setAnalytics] = useState<Awaited<ReturnType<typeof cvAdminApi.analytics>>['data']['data'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([cvAdminApi.overview(), cvAdminApi.usage(), cvAdminApi.analytics()])
      .then(([o, u, a]) => { setOverview(o.data.data); setUsage(u.data.data); setAnalytics(a.data.data); })
      .catch(() => toast.error('Không tải được dữ liệu admin'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center gap-2 p-8 text-slate-400"><Loader2 className="h-4 w-4 animate-spin" /> Đang tải…</div>;

  const money = (n: number) => `$${n.toFixed(4)}`;
  const num = (n?: number) => (n ?? 0).toLocaleString();

  return (
    <div className="p-4 sm:p-6 text-slate-100">
      <h1 className="text-2xl font-semibold">CV Builder — Admin</h1>
      <p className="mt-1 text-sm text-slate-400">Chỉ số tổng hợp ẩn danh + chi phí AI. Không hiển thị CV của bất kỳ ai.</p>

      {/* Counts */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Hồ sơ', value: overview?.profiles, icon: FileText },
          { label: 'Mục CV', value: overview?.items, icon: FileText },
          { label: 'Dòng thành tích', value: overview?.bullets, icon: FileText },
          { label: 'Lần nhập', value: overview?.imports, icon: FileText },
          { label: 'Job targets', value: overview?.jobs, icon: FileText },
          { label: 'GitHub sync', value: overview?.github, icon: FileText },
          { label: 'Reviews (AI lưu)', value: overview?.reviews, icon: FileText },
          { label: 'Documents', value: overview?.documents, icon: FileText },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-2xl font-bold">{num(s.value)}</div>
            <div className="text-xs text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* LLM cost */}
      <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-center gap-2 text-sm font-semibold"><DollarSign className="h-4 w-4" /> Chi phí AI</div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Tổng lượt gọi" value={num(usage?.totalCalls)} />
          <Stat label="Input tokens" value={num(usage?.totalInputTokens)} />
          <Stat label="Output tokens" value={num(usage?.totalOutputTokens)} />
          <Stat label="Chi phí ước tính" value={money(usage?.totalCostUsd ?? 0)} accent />
        </div>

        {/* Providers */}
        <div className="mt-4 flex flex-wrap gap-2">
          {usage?.providers.map((p) => (
            <span key={p.name} className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs ${p.hasKey ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-white/10 bg-white/[0.03]'}`}>
              <Cpu className="h-3.5 w-3.5" /> {p.name}
              {p.hasKey ? <CheckCircle2 className="h-3 w-3 text-emerald-400" /> : <AlertCircle className="h-3 w-3 text-slate-500" />}
              {p.trainsOnInput && <span className="text-amber-400">trains-on-input</span>}
              {p.circuitOpen && <span className="text-red-400">circuit open</span>}
            </span>
          ))}
          {usage?.forceStatic && <span className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-300">FORCE_STATIC bật</span>}
        </div>

        {/* By task */}
        {usage && usage.byTask.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400">
                <tr className="border-b border-white/10">
                  <th className="py-2 pr-3">Task</th><th className="pr-3">Model</th><th className="pr-3">OK</th>
                  <th className="pr-3 text-right">Lượt</th><th className="pr-3 text-right">In</th><th className="pr-3 text-right">Out</th><th className="text-right">$</th>
                </tr>
              </thead>
              <tbody>
                {usage.byTask.map((r, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-1.5 pr-3">{r.task}</td>
                    <td className="pr-3 text-slate-400">{r.model}</td>
                    <td className="pr-3">{r.success ? '✓' : <span className="text-red-400">✗</span>}</td>
                    <td className="pr-3 text-right tabular-nums">{num(r.calls)}</td>
                    <td className="pr-3 text-right tabular-nums">{num(r.inputTokens)}</td>
                    <td className="pr-3 text-right tabular-nums">{num(r.outputTokens)}</td>
                    <td className="text-right tabular-nums">{money(r.costUsd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Analytics */}
      {analytics && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-sm font-semibold">Nguồn nhập CV</div>
            <ul className="mt-2 space-y-1 text-sm">
              {analytics.importsBySource.length === 0 && <li className="text-slate-500">Chưa có</li>}
              {analytics.importsBySource.map((r, i) => (
                <li key={i} className="flex justify-between"><span className="text-slate-400">{r.source} · {r.status}</span><span className="tabular-nums">{r.count}</span></li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-sm font-semibold">Chất lượng & an toàn</div>
            <ul className="mt-2 space-y-1 text-sm">
              {analytics.bulletStrength.map((r, i) => (
                <li key={i} className="flex justify-between"><span className="text-slate-400">Bullet {r.strength}</span><span className="tabular-nums">{r.count}</span></li>
              ))}
              <li className="flex justify-between"><span className="text-slate-400">Bullet đã xác nhận</span><span className="tabular-nums">{num(analytics.verifiedBullets)}</span></li>
              <li className="flex justify-between"><span className="text-slate-400">Bullet AI tạo</span><span className="tabular-nums">{num(analytics.aiBullets)}</span></li>
              <li className="flex items-center justify-between"><span className="flex items-center gap-1 text-slate-400"><ShieldAlert className="h-3.5 w-3.5" /> JD nghi chèn chỉ thị</span><span className="tabular-nums">{num(analytics.injectionAttempts)}</span></li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
      <div className={`text-xl font-bold ${accent ? 'text-emerald-400' : ''}`}>{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}
