'use client';

/**
 * CT Work 27/10/2026 — CuongMini LÀM THAY trưởng nhóm / mentor ở trang Reviews:
 *   (A) "Review cùng CuongMini": xét các thẻ ở cột Review ⇒ gói đề xuất (Done / trả về In Progress / giữ + bình luận soạn
 *       sẵn); bỏ chọn dòng không đồng ý, sửa bình luận, "Áp dụng" ⇒ chạy dưới tên người bấm.
 *   (B) Review tự động: bật/tắt (ADMIN / trưởng dự án), danh sách lần tự làm gần đây + Hoàn tác.
 * Chỉ hiện với người được review (permissions.aiCodeReview). Server kiểm lại mọi quyền.
 */

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Sparkles, Undo2 } from 'lucide-react';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { cn } from '@/lib/utils';
import { Spinner } from '../ui';
import { wt } from '@/components/work/i18n';
import { codeApi, type CardDecision, type QueueItem } from './codeApi';

type Row = QueueItem & { pick: boolean; choice: CardDecision; text: string };

export default function CuongMiniReviewQueue({ config, onOpenIssue }: { config: ProjectConfig; onOpenIssue: (n: number) => void }) {
  const pid = config.id;
  const qc = useQueryClient();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [meta, setMeta] = useState<{ remaining: number; reviewColumn: boolean } | null>(null);
  const [busy, setBusy] = useState<'run' | 'apply' | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const auto = useQuery({ queryKey: ['work', 'project', pid, 'code', 'auto-review'], queryFn: () => codeApi.autoReview(pid), retry: false, staleTime: 30_000 });

  const run = async () => {
    setBusy('run'); setError(null); setMsg(null);
    try {
      const r = await codeApi.reviewQueue(pid, { max: 6 });
      setRows(r.items.map((x) => ({ ...x, pick: x.decision !== 'KEEP' || !!x.comment, choice: x.decision, text: x.comment })));
      setMeta({ remaining: r.remaining, reviewColumn: r.reviewColumn });
    } catch (err) { setError(workError(err, wt('code.qFailed'))); } finally { setBusy(null); }
  };
  const apply = async () => {
    if (!rows) return;
    const picked = rows.filter((r) => r.pick);
    setBusy('apply'); setError(null);
    try {
      const r = await codeApi.reviewQueueApply(pid, picked.map((x) => ({ number: x.issue.number, decision: x.choice, comment: x.text })));
      const ok = r.results.filter((x) => x.ok).length;
      setMsg(wt('code.qApplied', { ok, n: picked.length }));
      const failed = r.results.filter((x) => !x.ok);
      if (failed.length) setError(failed.map((f) => `#${f.number}: ${f.error}`).join(' · '));
      setRows(rows.filter((x) => !x.pick || failed.some((f) => f.number === x.issue.number)));
      void qc.invalidateQueries({ queryKey: ['work', 'project', pid] });
    } catch (err) { setError(workError(err, wt('code.qFailed'))); } finally { setBusy(null); }
  };
  const patch = (n: number, p: Partial<Row>) => setRows((rs) => rs?.map((r) => (r.issue.number === n ? { ...r, ...p } : r)) ?? null);
  const toggleAuto = async (on: boolean) => {
    try { await codeApi.setAutoReview(pid, on); void auto.refetch(); } catch (err) { setError(workError(err)); }
  };
  const undo = async (id: number) => {
    try { await codeApi.undoAutoReview(pid, id); void auto.refetch(); void qc.invalidateQueries({ queryKey: ['work', 'project', pid] }); } catch (err) { setError(workError(err)); }
  };
  const picked = rows?.filter((r) => r.pick).length ?? 0;
  const a = auto.data;

  return (
    <section className="w-card mb-4 overflow-hidden" aria-label={wt('code.qTitle')}>
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--w-border)] px-4 py-3">
        <Sparkles size={15} className="text-[var(--w-accent-text)]" aria-hidden="true" />
        <h2 className="text-[14px] font-semibold">{wt('code.qTitle')}</h2>
        <button type="button" className="w-btn w-btn-primary ml-auto" onClick={run} disabled={!!busy}>
          {busy === 'run' ? <Spinner size={11} /> : null}{busy === 'run' ? wt('code.qRunning') : wt('code.qRun')}
        </button>
      </div>
      <p className="px-4 pt-2 text-[12.5px] text-[var(--w-text-2)]">{wt('code.qHint')}</p>
      {error && <p className="px-4 pt-2 text-[12.5px] text-[var(--w-red-text)]" role="alert">{error}</p>}
      {msg && <p className="px-4 pt-2 text-[12.5px] text-[var(--w-green)]">{msg}</p>}

      {rows && (
        rows.length === 0 ? (
          <p className="px-4 py-3 text-[13px] text-[var(--w-text-2)]">{meta?.reviewColumn === false ? wt('code.qNoColumn') : wt('code.qEmpty')}</p>
        ) : (
          <>
            <ul className="mt-2 divide-y divide-[var(--w-border)] border-t border-[var(--w-border)]">
              {rows.map((r) => (
                <li key={r.issue.number} className={cn('px-4 py-3', !r.pick && 'opacity-60')}>
                  <div className="flex flex-wrap items-center gap-2">
                    <input type="checkbox" checked={r.pick} onChange={(e) => patch(r.issue.number, { pick: e.target.checked })} aria-label={r.issue.key} />
                    <button type="button" className="font-mono text-[12px] text-[var(--w-accent-text)] hover:underline" onClick={() => onOpenIssue(r.issue.number)}>{r.issue.key}</button>
                    <span className="min-w-0 flex-1 truncate text-[13px] font-medium" title={r.issue.title}>{r.issue.title}</span>
                    <select className="w-input h-7 text-[12px]" value={r.choice} onChange={(e) => patch(r.issue.number, { choice: e.target.value as CardDecision })}>
                      {(['DONE', 'BACK', 'KEEP'] as const).map((d) => <option key={d} value={d}>{wt(`code.q${d}` as 'code.qDONE')}</option>)}
                    </select>
                  </div>
                  {r.summary && <p className="mt-1 text-[12.5px] text-[var(--w-text-2)]">{r.summary}{r.code ? ` · ${r.code.label}` : ''}</p>}
                  {r.acceptance.some((c) => c.met !== 'yes') && (
                    <ul className="mt-1 list-disc pl-5 text-[12px] text-[var(--w-text-2)]">
                      {r.acceptance.filter((c) => c.met !== 'yes').slice(0, 5).map((c, i) => <li key={i}>{c.criterion} — {c.met}{c.evidence ? ` (${c.evidence})` : ''}</li>)}
                    </ul>
                  )}
                  {r.findings.filter((f) => f.severity !== 'NIT').slice(0, 4).map((f, i) => (
                    <p key={i} className="mt-0.5 text-[12px] text-[var(--w-text-2)]"><span className="font-medium">[{f.severity}]</span> <code className="text-[11.5px]">{f.file}{f.line ? `:${f.line}` : ''}</code> {f.message}</p>
                  ))}
                  <textarea className="w-input mt-2 w-full text-[12.5px]" rows={3} value={r.text} maxLength={6000} onChange={(e) => patch(r.issue.number, { text: e.target.value })} />
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-2 border-t border-[var(--w-border)] px-4 py-2.5">
              {meta?.remaining ? <span className="text-[12px] text-[var(--w-text-3)]">{wt('code.qMore', { n: meta.remaining })}</span> : null}
              <button type="button" className="w-btn w-btn-primary ml-auto" onClick={apply} disabled={!!busy || !picked}>
                {busy === 'apply' ? <Spinner size={11} /> : null}{wt('code.qApply', { n: picked })}
              </button>
            </div>
          </>
        )
      )}

      {a && (
        <div className="border-t border-[var(--w-border)] px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-semibold">{wt('code.autoTitle')}</span>
            <span className={cn('rounded-full px-2 py-0.5 text-[11.5px]', a.settings.enabled ? 'bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'bg-[var(--w-hover)] text-[var(--w-text-2)]')}>{a.settings.enabled ? wt('code.autoIsOn') : wt('code.autoIsOff')}</span>
            {a.canConfigure && <button type="button" className="w-btn ml-auto h-7 px-2.5 text-[12px]" onClick={() => toggleAuto(!a.settings.enabled)}>{a.settings.enabled ? wt('code.autoOff') : wt('code.autoOn')}</button>}
          </div>
          <p className="mt-1 text-[12px] text-[var(--w-text-2)]">{wt('code.autoHint')}</p>
          {a.recent.length > 0 && (
            <>
              <p className="mt-2 text-[12px] font-medium">{wt('code.autoRecent')}</p>
              <ul className="mt-1 space-y-1">
                {a.recent.slice(0, 10).map((x) => (
                  <li key={x.id} className="flex flex-wrap items-center gap-2 text-[12px]">
                    {x.issue && <button type="button" className="font-mono text-[var(--w-accent-text)] hover:underline" onClick={() => onOpenIssue(x.issue!.number)}>{x.issue.key}</button>}
                    <span className="font-medium">{x.decision}</span>
                    {x.from && x.to && <span className="text-[var(--w-text-3)]">{x.from} → {x.to}</span>}
                    <span className="min-w-0 flex-1 truncate text-[var(--w-text-2)]">{x.summary}</span>
                    {x.undoneAt ? <span className="text-[var(--w-text-3)]">{wt('code.autoUndone')}</span>
                      : x.canUndo && <button type="button" className="inline-flex items-center gap-1 text-[var(--w-accent-text)] hover:underline" onClick={() => undo(x.id)}><Undo2 size={11} /> {wt('code.autoUndo')}</button>}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </section>
  );
}
