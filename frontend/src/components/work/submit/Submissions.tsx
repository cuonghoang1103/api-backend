'use client';

/**
 * CT Work — Trang NỘP BÀI: gom deliverable của cả nhóm vào một chỗ.
 * Mỗi người × thẻ × trạng thái (đã nộp / đúng giờ / quá hạn) + tệp đính kèm bấm tải,
 * nút "Tải tất cả" (zip) cho nhóm trưởng, và bảng cấu hình CỔNG (ADMIN) bật/tắt + soft/hard.
 */

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Download, FileSpreadsheet, PackageCheck, Settings2, Clock, CheckCircle2, AlertTriangle, Paperclip } from 'lucide-react';
import { submitApi, submitKeys, type SubmitGateConfig, type SubmissionItem } from '@/lib/work-submit-api';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { EmptyState, PageLoading } from '@/components/work/ui';
import { cn } from '@/lib/utils';
import { taiVe, tepDinhKem, useXemTep } from '@/components/work/xemTep/XemTep';

const KB = (n: number) => (n < 1024 ? `${n} B` : n < 1024 * 1024 ? `${(n / 1024).toFixed(0)} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`);
const dmy = (s: string | null) => (s ? new Date(s).toLocaleDateString('vi-VN') : '—');

function StatusChip({ it }: { it: SubmissionItem }) {
  if (it.done && it.onTime === true) return <span className="inline-flex items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--w-green)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-green)_10%,transparent)] px-2 py-0.5 text-[11px] text-[var(--w-green-text)]"><CheckCircle2 size={12} /> Đúng hạn</span>;
  if (it.done && it.onTime === false) return <span className="inline-flex items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--w-yellow)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-yellow)_10%,transparent)] px-2 py-0.5 text-[11px] text-[var(--w-yellow-text)]"><Clock size={12} /> Trễ hạn</span>;
  if (it.done) return <span className="inline-flex items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--w-green)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-green)_10%,transparent)] px-2 py-0.5 text-[11px] text-[var(--w-green-text)]"><CheckCircle2 size={12} /> Đã xong</span>;
  if (it.overdue) return <span className="inline-flex items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--w-red)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-red)_10%,transparent)] px-2 py-0.5 text-[11px] text-[var(--w-red-text)]"><AlertTriangle size={12} /> Quá hạn</span>;
  return <span className="rounded-full border border-[var(--w-border)] px-2 py-0.5 text-[11px] text-[var(--w-text-dim)]">{it.status}</span>;
}

function GatePanel({ pid, gate, onSaved }: { pid: number; gate: SubmitGateConfig; onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<SubmitGateConfig>(gate);
  const save = useMutation({
    mutationFn: () => submitApi.setGate(pid, draft),
    onSuccess: () => { onSaved(); setOpen(false); },
  });
  if (!open) {
    return (
      <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => { setDraft(gate); setOpen(true); }}>
        <Settings2 size={14} /> Cổng nộp bài: {gate.enabled ? (gate.mode === 'hard' ? 'Bắt buộc' : 'Nhắc nhở') : 'Tắt'}
      </button>
    );
  }
  return (
    <div className="rounded-lg border border-[var(--w-border)] bg-[var(--w-surface)] p-3 text-[13px]">
      <div className="mb-2 font-medium">Cấu hình cổng nộp bài</div>
      <label className="mb-2 flex items-center gap-2">
        <input type="checkbox" checked={draft.enabled} onChange={(e) => setDraft({ ...draft, enabled: e.target.checked })} />
        Bật cổng (yêu cầu đính kèm trước khi kéo thẻ sang Done)
      </label>
      <div className={cn('ml-6 space-y-2', !draft.enabled && 'pointer-events-none opacity-40')}>
        <label className="flex items-center gap-2">
          <input type="radio" name="mode" checked={draft.mode === 'soft'} onChange={() => setDraft({ ...draft, mode: 'soft' })} />
          <span><b>Nhắc nhở</b> — kéo Done thì hiện form check-out; cho phép xác nhận "không cần nộp"</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="mode" checked={draft.mode === 'hard'} onChange={() => setDraft({ ...draft, mode: 'hard' })} />
          <span><b>Bắt buộc</b> — chưa đính kèm thì KHÔNG cho sang Done</span>
        </label>
        <label className="flex items-center gap-2">
          Số tệp tối thiểu
          <input type="number" min={1} max={20} value={draft.minAttachments}
            onChange={(e) => setDraft({ ...draft, minAttachments: Math.max(1, Math.min(20, Number(e.target.value) || 1)) })}
            className="w-16 rounded border border-[var(--w-border)] bg-transparent px-2 py-1" />
        </label>
      </div>
      {save.error ? <div className="mt-2 text-[12px] text-[var(--w-red-text)]">{workError(save.error)}</div> : null}
      <div className="mt-3 flex gap-2">
        <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={save.isPending} onClick={() => save.mutate()}>Lưu</button>
        <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => setOpen(false)}>Huỷ</button>
      </div>
    </div>
  );
}

export default function Submissions({ pid, config }: { pid: number; config: ProjectConfig }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: submitKeys.all(pid), queryFn: () => submitApi.list(pid), refetchInterval: 120_000 });
  const [downloading, setDownloading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // 20/10/2026: bấm tệp ⇒ trình xem trong trang (←/→ qua các tệp của thẻ); nút ⬇ để tải về.
  const xem = useXemTep();
  async function downloadAll() {
    setErr(null); setDownloading(true);
    try { await submitApi.downloadAll(pid); }
    catch (e) { setErr(workError(e)); }
    finally { setDownloading(false); }
  }
  async function exportCsv() {
    setErr(null);
    try { await submitApi.downloadReport(pid); }
    catch (e) { setErr(workError(e)); }
  }

  if (q.isLoading) return <PageLoading />;
  if (q.error || !q.data) return <EmptyState title="Không tải được trang Nộp bài" body={q.error ? workError(q.error) : undefined} />;
  const d = q.data;

  return (
    <div className="mx-auto max-w-[1100px] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <PackageCheck size={18} className="text-[var(--w-accent-text)]" />
          <h1 className="text-[15px] font-semibold">Nộp bài & bàn giao</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {d.canConfig ? <GatePanel pid={pid} gate={d.gate} onSaved={() => qc.invalidateQueries({ queryKey: submitKeys.all(pid) })} /> : null}
          <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={exportCsv} title="Xuất CSV: ai nộp gì, đúng hạn không (mở bằng Excel)">
            <FileSpreadsheet size={14} /> Xuất CSV
          </button>
          <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={downloading || !d.totals.files} onClick={downloadAll} title={d.totals.files ? 'Tải toàn bộ tệp đính kèm (zip, kèm INDEX.csv)' : 'Chưa có tệp nào'}>
            <Download size={14} /> {downloading ? 'Đang nén…' : `Tải tất cả (${d.totals.files})`}
          </button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[['Thành viên', d.totals.members], ['Thẻ', d.totals.issues], ['Đã nộp', d.totals.submitted], ['Quá hạn', d.totals.overdue]].map(([k, v]) => (
          <div key={k as string} className="rounded-lg border border-[var(--w-border)] bg-[var(--w-surface)] px-3 py-2">
            <div className="text-[11px] text-[var(--w-text-dim)]">{k}</div>
            <div className={cn('text-[18px] font-semibold', k === 'Quá hạn' && (v as number) > 0 && 'text-[var(--w-red-text)]')}>{v as number}</div>
          </div>
        ))}
      </div>

      {err ? <div className="mb-3 rounded border border-[color-mix(in_srgb,var(--w-red)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-red)_10%,transparent)] px-3 py-2 text-[12px] text-[var(--w-red-text)]">{err}</div> : null}

      {d.members.length === 0 ? <EmptyState title="Chưa có thẻ nào được giao" body="Gán thẻ cho thành viên để theo dõi nộp bài ở đây." /> : null}

      <div className="space-y-4">
        {d.members.map((m) => (
          <div key={m.username ?? m.name} className="rounded-lg border border-[var(--w-border)] bg-[var(--w-surface)]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--w-border)] px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">{m.name}</span>
                {m.kind === 'AGENT' ? <span title="AI agent">🤖</span> : null}
                <span className="text-[12px] text-[var(--w-text-dim)]">{m.submitted}/{m.total} đã nộp · {m.files} tệp</span>
              </div>
              <div className="flex items-center gap-2 text-[12px]">
                {m.onTimeOf > 0 ? <span className="text-[var(--w-green-text)]">{m.onTime}/{m.onTimeOf} đúng hạn</span> : null}
                {m.overdue > 0 ? <span className="text-[var(--w-red-text)]">{m.overdue} quá hạn</span> : null}
              </div>
            </div>
            <div className="divide-y divide-[var(--w-border)]">
              {m.items.map((it) => (
                <div key={it.key} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 text-[13px]">
                  <span className="font-mono text-[11px] text-[var(--w-text-dim)]">{it.key}</span>
                  <span className="min-w-0 flex-1 truncate">{it.title}</span>
                  <StatusChip it={it} />
                  <span className="text-[11px] text-[var(--w-text-dim)]">Hạn {dmy(it.dueDate)}</span>
                  <span className={cn('inline-flex items-center gap-1 text-[11px]', it.submitted ? 'text-[var(--w-text)]' : 'text-[var(--w-text-dim)]')}>
                    <Paperclip size={11} /> {it.attachmentCount}
                  </span>
                  {it.attachments.length ? (
                    <span className="flex flex-wrap gap-1">
                      {it.attachments.map((a, i) => (
                        <span key={a.id} className="inline-flex items-center rounded border border-[var(--w-border)] text-[11px]">
                          <button type="button" onClick={() => xem.mo(it.attachments.map((x) => tepDinhKem(pid, x)), i)}
                            className="rounded-l px-1.5 py-0.5 hover:bg-[var(--w-hover)]" title={`${a.fileName} · ${KB(a.size)}`}>
                            {a.fileName.length > 20 ? `${a.fileName.slice(0, 18)}…` : a.fileName}
                          </button>
                          <button type="button" onClick={() => void taiVe(tepDinhKem(pid, a))} aria-label={`Tải ${a.fileName}`} title="Tải về"
                            className="rounded-r border-l border-[var(--w-border)] px-1 py-0.5 text-[var(--w-text-3)] hover:bg-[var(--w-hover)] hover:text-[var(--w-text)]">
                            <Download size={11} />
                          </button>
                        </span>
                      ))}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {d.gate.enabled ? (
        <p className="mt-4 text-[12px] text-[var(--w-text-dim)]">
          Cổng đang {d.gate.mode === 'hard' ? <b>bắt buộc</b> : <b>nhắc nhở</b>}: thành viên cần đính kèm ≥ {d.gate.minAttachments} tệp vào thẻ trước khi kéo sang Done.
        </p>
      ) : null}
      {xem.khung}
    </div>
  );
}
