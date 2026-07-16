'use client';
/**
 * Admin — who is spending Pro AI, on which feature.
 *
 * One table per product (Interview / My Language / CV Builder): the user, their
 * Pro standing, how many calls, how many tokens, what it cost, when they first
 * and last used it, and a breakdown by task. Read-only.
 */
import { Fragment, useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Crown, ShieldCheck, AlertTriangle, RefreshCw, ChevronDown, ChevronRight, User as UserIcon } from 'lucide-react';

export type Feature = 'interview' | 'language' | 'cv';

interface Row {
  userId: number;
  username: string;
  fullName: string | null;
  email: string | null;
  isPro: boolean;
  proExpiresAt: string | null;
  isAdmin: boolean;
  calls: number;
  failed: number;
  tokens: number;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  firstUsedAt: string | null;
  lastUsedAt: string | null;
  breakdown: Array<{ key: string; calls: number; tokens: number }>;
}

const fmt = (n: number) => n.toLocaleString('vi-VN');
const mtok = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(2)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}k` : String(n));
const dt = (s: string | null) => (s ? new Date(s).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—');

// The task names the logs store, in the words an admin would use.
const TASK_LABEL: Record<string, string> = {
  interview: 'Chấm câu trả lời',
  report: 'Báo cáo cuối phiên',
  generation: 'Sinh câu hỏi',
  critique: 'Chấm CV',
  intake: 'Phỏng vấn lấy thông tin',
  cover_letter: 'Thư xin việc',
  jd_parse: 'Đọc JD',
  parse_fallback: 'Đọc CV (dự phòng)',
  translate: 'Dịch',
};
const TITLE: Record<Feature, { title: string; hint: string }> = {
  interview: { title: 'Phỏng vấn AI', hint: 'Chấm câu trả lời + báo cáo cuối phiên (Pro)' },
  language: { title: 'My Language AI', hint: 'Gia sư, chấm phát âm, quiz, chấm viết, role-play, dịch, kiểm tra ngữ pháp (Pro)' },
  cv: { title: 'CV Builder AI', hint: 'Chấm CV, thư xin việc, đọc JD, intake (Pro/Max)' },
};

export default function FeatureUsers({ feature }: { feature: Feature }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await api.get('/ai/analytics/feature-users', { params: { feature } });
      setRows(Array.isArray(r.data?.data) ? r.data.data : []);
      setErr(null);
    } catch {
      setErr('Không tải được thống kê');
    }
  }, [feature]);

  useEffect(() => {
    setRows(null);
    void load();
    const t = setInterval(() => void load(), 15000);
    return () => clearInterval(t);
  }, [load]);

  if (err) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-neon-orange/30 bg-neon-orange/10 p-4 text-neon-orange">
        <AlertTriangle size={18} /> {err}
      </div>
    );
  }
  if (!rows) return <div className="h-40 animate-pulse rounded-2xl border border-darkborder bg-darkcard" />;

  const meta = TITLE[feature];
  const totals = rows.reduce(
    (a, r) => ({ calls: a.calls + r.calls, tokens: a.tokens + r.tokens, cost: a.cost + r.costUsd }),
    { calls: 0, tokens: 0, cost: 0 },
  );
  const proUsers = rows.filter((r) => r.isPro || r.isAdmin).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-heading text-lg font-bold text-text-primary">{meta.title}</h3>
          <p className="text-sm text-text-secondary">{meta.hint}</p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-1.5 rounded-full bg-darkcard px-3 py-1.5 text-xs font-semibold text-text-muted ring-1 ring-darkborder transition hover:text-text-secondary"
        >
          <RefreshCw size={13} /> Làm mới
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Mini label="Người dùng" value={fmt(rows.length)} />
        <Mini label="Trong đó Pro/Admin" value={fmt(proUsers)} tone="violet" />
        <Mini label="Tổng lệnh gọi" value={fmt(totals.calls)} tone="cyan" />
        <Mini label="Tổng token" value={mtok(totals.tokens)} hint={`$${totals.cost.toFixed(2)}`} tone="green" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-darkborder bg-darkcard">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-darkborder text-left text-xs uppercase tracking-wide text-text-muted">
                <th className="px-4 py-2.5 font-medium">Người dùng</th>
                <th className="px-3 py-2.5 font-medium">Gói</th>
                <th className="px-3 py-2.5 text-right font-medium">Lệnh gọi</th>
                <th className="px-3 py-2.5 text-right font-medium">Token</th>
                <th className="px-3 py-2.5 text-right font-medium">Vào / Ra</th>
                <th className="px-3 py-2.5 text-right font-medium">Chi phí</th>
                <th className="px-3 py-2.5 font-medium">Lần đầu</th>
                <th className="px-3 py-2.5 font-medium">Gần nhất</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                // Fragment needs the key: a bare <> in a map gives React nothing
                // to track rows by, so expanding one re-renders the whole table.
                <Fragment key={r.userId}>
                  <tr
                    onClick={() => setOpen(open === r.userId ? null : r.userId)}
                    className="cursor-pointer border-b border-darkborder/50 transition hover:bg-darkbg/40 last:border-0"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {open === r.userId ? <ChevronDown size={14} className="text-text-muted" /> : <ChevronRight size={14} className="text-text-muted" />}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-text-primary">{r.fullName || r.username}</span>
                            {r.isAdmin && <ShieldCheck size={12} className="text-neon-cyan" />}
                          </div>
                          <div className="truncate text-[11px] text-text-muted">@{r.username}{r.email ? ` · ${r.email}` : ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      {r.isAdmin ? (
                        <span className="rounded-full bg-neon-cyan/15 px-2 py-0.5 text-[11px] font-semibold text-neon-cyan">Admin</span>
                      ) : r.isPro ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-neon-violet/15 px-2 py-0.5 text-[11px] font-semibold text-neon-violet">
                          <Crown size={10} /> Pro
                        </span>
                      ) : (
                        // Someone with no Pro but real usage is worth seeing: it
                        // is either an expired plan or a hole in a gate.
                        <span className="rounded-full bg-neon-orange/15 px-2 py-0.5 text-[11px] font-semibold text-neon-orange">Không Pro</span>
                      )}
                      {r.isPro && r.proExpiresAt && (
                        <div className="mt-0.5 text-[10px] text-text-muted">hết hạn {dt(r.proExpiresAt)}</div>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right font-medium text-text-primary">
                      {fmt(r.calls)}
                      {r.failed > 0 && <div className="text-[11px] text-neon-orange">{r.failed} lỗi</div>}
                    </td>
                    <td className="px-3 py-3 text-right font-medium text-text-primary">{mtok(r.tokens)}</td>
                    <td className="px-3 py-3 text-right text-text-secondary">{mtok(r.inputTokens)} / {mtok(r.outputTokens)}</td>
                    <td className="px-3 py-3 text-right text-text-secondary">${r.costUsd.toFixed(3)}</td>
                    <td className="px-3 py-3 text-xs text-text-muted">{dt(r.firstUsedAt)}</td>
                    <td className="px-3 py-3 text-xs text-text-secondary">{dt(r.lastUsedAt)}</td>
                  </tr>
                  {open === r.userId && (
                    <tr className="border-b border-darkborder/50 bg-darkbg/30">
                      <td colSpan={8} className="px-4 py-3">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Dùng vào việc gì</p>
                        <div className="flex flex-wrap gap-1.5">
                          {r.breakdown.map((b) => (
                            <span key={b.key} className="inline-flex items-center gap-1.5 rounded-full bg-darkcard px-2.5 py-1 text-xs ring-1 ring-darkborder">
                              <span className="text-text-secondary">{TASK_LABEL[b.key] ?? b.key}</span>
                              <span className="font-semibold text-text-primary">{fmt(b.calls)} lệnh</span>
                              <span className="text-text-muted">· {mtok(b.tokens)}</span>
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-text-muted">
                    <UserIcon size={22} className="mx-auto mb-2 opacity-40" />
                    Chưa có ai dùng tính năng này
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {feature !== 'cv' && (
        <p className="text-[11px] text-text-muted">
          Lệnh gọi trước ngày gắn nhãn tính năng không được tính ở đây (chúng không ghi rõ thuộc tính năng nào) — số liệu tính từ lần deploy này trở đi.
        </p>
      )}
    </div>
  );
}

function Mini({ label, value, hint, tone = 'muted' }: { label: string; value: string; hint?: string; tone?: 'violet' | 'cyan' | 'green' | 'muted' }) {
  const tones: Record<string, string> = {
    violet: 'text-neon-violet', cyan: 'text-neon-cyan', green: 'text-neon-green', muted: 'text-text-primary',
  };
  return (
    <div className="rounded-2xl border border-darkborder bg-darkcard p-3.5">
      <p className="text-xs text-text-secondary">{label}</p>
      <p className={`mt-1 font-heading text-xl font-bold ${tones[tone]}`}>{value}</p>
      {hint && <p className="text-[11px] text-text-muted">{hint}</p>}
    </div>
  );
}
