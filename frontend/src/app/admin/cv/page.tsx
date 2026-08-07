'use client';

/**
 * /admin/cv — CV Builder admin (Phase 10). Anonymized aggregates + the LLM cost
 * dashboard. Never exposes an individual CV (spec) — only counts and spend.
 * Dark-only palette to match the other admin pages.
 */
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, DollarSign, FileText, Cpu, ShieldAlert, CheckCircle2, AlertCircle, BookOpen, Save, Globe } from 'lucide-react';
import { cvAdminApi, type CvAdminUsage, type CvRuleOverrides, type PublicCvConfig } from '@/lib/cv-api';

export default function AdminCvPage() {
  const [overview, setOverview] = useState<Record<string, number> | null>(null);
  const [usage, setUsage] = useState<CvAdminUsage | null>(null);
  const [analytics, setAnalytics] = useState<Awaited<ReturnType<typeof cvAdminApi.analytics>>['data']['data'] | null>(null);
  const [loading, setLoading] = useState(true);

  // W6 — rules-engine overrides (edit dictionaries without a deploy)
  const [rules, setRules] = useState<Record<keyof CvRuleOverrides, string>>({ strongVerbs: '', weakVerbs: '', bannedOpeners: '', buzzwords: '' });
  const [savingRules, setSavingRules] = useState(false);
  const saveRules = async () => {
    setSavingRules(true);
    try {
      const toList = (s: string) => s.split(/[\n,]/).map((x) => x.trim()).filter(Boolean);
      await cvAdminApi.setRules({ strongVerbs: toList(rules.strongVerbs), weakVerbs: toList(rules.weakVerbs), bannedOpeners: toList(rules.bannedOpeners), buzzwords: toList(rules.buzzwords) });
      toast.success('Đã lưu — linter áp dụng trong ≤60s (không cần deploy)');
    } catch { toast.error('Lưu thất bại'); } finally { setSavingRules(false); }
  };

  // CV công khai trên /about — bật/tắt tại đây (mặc định TẮT).
  const [publicCv, setPublicCv] = useState<PublicCvConfig | null>(null);
  const [savingPublicCv, setSavingPublicCv] = useState(false);
  const savePublicCv = async () => {
    if (!publicCv) return;
    if (publicCv.enabled && !publicCv.userId) { toast.error('Cần nhập user id trước khi bật'); return; }
    setSavingPublicCv(true);
    try {
      const res = await cvAdminApi.setPublicCv(publicCv);
      setPublicCv(res.data.data);
      toast.success(res.data.data.enabled ? 'Đã bật — nút "Tải CV" sẽ hiện trên /about' : 'Đã tắt — nút "Tải CV" ẩn khỏi /about');
    } catch { toast.error('Lưu thất bại'); } finally { setSavingPublicCv(false); }
  };

  useEffect(() => {
    Promise.all([cvAdminApi.overview(), cvAdminApi.usage(), cvAdminApi.analytics(), cvAdminApi.getRules().catch(() => null), cvAdminApi.getPublicCv().catch(() => null)])
      .then(([o, u, a, r, p]) => {
        setOverview(o.data.data); setUsage(u.data.data); setAnalytics(a.data.data);
        if (r) {
          const d = r.data.data;
          setRules({ strongVerbs: d.strongVerbs.join(', '), weakVerbs: d.weakVerbs.join(', '), bannedOpeners: d.bannedOpeners.join('\n'), buzzwords: d.buzzwords.join('\n') });
        }
        if (p) setPublicCv(p.data.data);
      })
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

      {/* Rules-engine overrides (W6) — extend dictionaries without a deploy */}
      <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-center gap-2 text-sm font-semibold"><BookOpen className="h-4 w-4" /> Từ điển rules-engine (bổ sung, không cần deploy)</div>
        <p className="mt-1 text-xs text-slate-400">Thêm vào danh sách gốc (không xoá được baseline — an toàn). Phân cách bằng dấu phẩy hoặc xuống dòng. Linter áp dụng trong ≤60 giây.</p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {([
            ['strongVerbs', 'Động từ MẠNH thêm (built, shipped…)'],
            ['weakVerbs', 'Động từ YẾU thêm (helped, assisted…)'],
            ['bannedOpeners', 'Cụm mở đầu CẤM thêm (responsible for…)'],
            ['buzzwords', 'Buzzword thêm (team player…)'],
          ] as [keyof CvRuleOverrides, string][]).map(([k, label]) => (
            <label key={k} className="text-xs text-slate-400">{label}
              <textarea value={rules[k]} onChange={(e) => setRules((r) => ({ ...r, [k]: e.target.value }))}
                rows={3} className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.02] p-2 text-xs text-slate-100" />
            </label>
          ))}
        </div>
        <button onClick={saveRules} disabled={savingRules}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50">
          {savingRules ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Lưu từ điển
        </button>
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
              {'suggestions' in analytics && (analytics as unknown as { suggestions: { accepted: number; rejected: number; pending: number } }).suggestions && (() => {
                const s = (analytics as unknown as { suggestions: { accepted: number; rejected: number; pending: number } }).suggestions;
                const decided = s.accepted + s.rejected;
                return (
                  <li className="flex items-center justify-between">
                    <span className="text-slate-400">AI viết lại — tỉ lệ chấp nhận</span>
                    <span className="tabular-nums">{decided ? Math.round((s.accepted / decided) * 100) + '%' : '—'} ({s.accepted}/{decided})</span>
                  </li>
                );
              })()}
            </ul>
          </div>
        </div>
      )}

      {/* ── CV công khai (08/08/2026) ─────────────────────────────────────
          Bật thì trang /about mới hiện nút "Tải CV"; tắt thì endpoint công
          khai trả 404 và nút tự biến mất. Đây là NGOẠI LỆ có chủ đích với
          nguyên tắc "admin không xem CV của ai": nó không HIỆN CV nào cả, chỉ
          bật/tắt CV của CHÍNH chủ site theo user id do chính admin nhập. */}
      {publicCv && (
        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Globe className="h-4 w-4" /> CV công khai trên trang /about
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Bật để khách tải CV của bạn mà không cần đăng nhập. Chỉ phục vụ đúng user id dưới đây —
            hồ sơ chưa có tên hoặc chưa có nội dung thì nút vẫn ẩn.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={publicCv.enabled}
                onChange={(e) => setPublicCv({ ...publicCv, enabled: e.target.checked })}
                className="h-4 w-4 accent-emerald-500"
              />
              Bật tải CV công khai
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={publicCv.redactContact}
                onChange={(e) => setPublicCv({ ...publicCv, redactContact: e.target.checked })}
                className="h-4 w-4 accent-emerald-500"
              />
              Ẩn số điện thoại &amp; địa chỉ (khuyến nghị)
            </label>

            <label className="text-xs text-slate-400">
              User id của bạn
              <input
                type="number"
                min={1}
                value={publicCv.userId ?? ''}
                onChange={(e) => setPublicCv({ ...publicCv, userId: e.target.value ? Number(e.target.value) : null })}
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
                placeholder="ví dụ 1"
              />
            </label>
            <label className="text-xs text-slate-400">
              Mẫu CV
              <select
                value={publicCv.template}
                onChange={(e) => setPublicCv({ ...publicCv, template: e.target.value })}
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
              >
                {['technical', 'ats', 'vietnam', 'senior'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="text-xs text-slate-400">
              Thị trường
              <select
                value={publicCv.market}
                onChange={(e) => setPublicCv({ ...publicCv, market: e.target.value === 'INTERNATIONAL' ? 'INTERNATIONAL' : 'VN' })}
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
              >
                <option value="VN">VN</option>
                <option value="INTERNATIONAL">INTERNATIONAL</option>
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={savePublicCv}
              disabled={savingPublicCv}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {savingPublicCv ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Lưu
            </button>
            {publicCv.enabled && (
              <a
                href="/api/v1/cv/public/download/pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-300 underline underline-offset-4 hover:text-white"
              >
                Thử tải bản công khai →
              </a>
            )}
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
