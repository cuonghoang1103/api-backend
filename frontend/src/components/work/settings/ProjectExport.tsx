'use client';

/**
 * Tab "Export" — mọi thành viên xem được dự án đều dùng được (khác tab Import
 * chỉ dành cho admin). Project Tracking theo mẫu SWP391: sheet Product (mỗi Req
 * một dòng: Screen ID, PIC, iteration, Complexity, Planned LOC, Quality, tiến độ
 * SRS/SDS/Coding/Test/Integrate, Evidence) + sheet Summary (LOC theo từng người).
 */

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Archive, Download, FileSpreadsheet } from 'lucide-react';
import { workApi, workError, type ProjectConfig } from '@/lib/work-api';
import { s4Api, s4Keys } from '@/lib/work-s4-api';
import { Spinner } from '../ui';
import { Section } from './shared';

function save(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export default function ProjectExport({ config }: { config: ProjectConfig; slug: string }) {
  const [busy, setBusy] = useState(false);
  const names = config.customFields.map((f) => f.name.toLowerCase());
  const missing = ['Screen ID', 'Planned LOC', 'Quality'].filter((n) => !names.includes(n.toLowerCase()));

  const run = async () => {
    setBusy(true);
    try {
      const { blob, fileName } = await workApi.exportProjectTracking(config.id);
      save(blob, fileName);
      toast.success('Project Tracking downloaded');
    } catch (err) {
      toast.error(workError(err, 'Could not export Project Tracking'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Section
        title="Project Tracking (SWP391)"
        description="The Excel file your lecturer asks for each iteration, built from this board — no more copying by hand."
      >
        <div className="max-w-[640px] space-y-3 text-[13px] text-[var(--w-text-2)]">
          <ul className="list-disc space-y-1 pl-5">
            <li><span className="font-medium text-[var(--w-text)]">Product</span> — one row per requirement (issues labelled <code className="rounded bg-[var(--w-sunken)] px-1 font-mono text-[12px]">Req</code> or with a Screen ID): PIC, iteration, Complexity, Planned LOC, Quality, Graded LOC, status, progress of SRS · SDS · Coding · Test · Integrate, Evidence.</li>
            <li><span className="font-medium text-[var(--w-text)]">Summary</span> — per person: requirements, done, planned LOC per iteration, graded LOC, and how many reached Quality L2 or better.</li>
          </ul>
          {missing.length > 0 && (
            <p className="rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 text-[12.5px]">
              This project has no {missing.join(', ')} field yet — those columns will be empty. Add them in Settings → Fields (names must match).
            </p>
          )}
          <button type="button" className="w-btn w-btn-primary" onClick={run} disabled={busy}>
            {busy ? <Spinner size={12} /> : <FileSpreadsheet size={14} />} Download Project Tracking (.xlsx)
          </button>
          <p className="text-[12px] text-[var(--w-text-3)]">Rename it to {'{Class}_{Group}_{System}_ProjectTracking.xlsx'} before you submit. For a plain list of issues, use Export on the Issues page.</p>
        </div>
      </Section>
      {config.permissions.exportProject && <FullExport pid={config.id} />}
    </>
  );
}

// ─── Đợt S4: xuất TRỌN dự án (ZIP) — chỉ ADMIN dự án ─────────────

const fmtSize = (n: number | null | undefined) => (!n ? '—' : n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

function FullExport({ pid }: { pid: number }) {
  const qc = useQueryClient();
  const [withFiles, setWithFiles] = useState(false);
  const q = useQuery({
    queryKey: s4Keys.exports(pid),
    queryFn: () => s4Api.exports(pid),
    // Đang chạy ⇒ hỏi lại mỗi giây để thanh tiến trình chạy.
    refetchInterval: (query) => (query.state.data?.items.some((e) => e.status === 'QUEUED' || e.status === 'RUNNING') ? 1000 : false),
  });
  const start = useMutation({
    mutationFn: () => s4Api.startExport(pid, withFiles),
    onSuccess: () => { qc.invalidateQueries({ queryKey: s4Keys.exports(pid) }); toast.success('Export started — it runs in the background'); },
    onError: (e) => toast.error(workError(e)),
  });
  const download = async (id: number) => {
    try {
      const l = await s4Api.exportLink(pid, id);
      const a = document.createElement('a');
      a.href = l.url;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      toast.error(workError(e));
    }
  };
  const running = q.data?.items.some((e) => e.status === 'QUEUED' || e.status === 'RUNNING');
  return (
    <Section title="Export the whole project (backup)" description="A ZIP with every table of this project as JSON — issues, comments, history, worklogs, sprints, versions, stages, approvals, handoffs, docs and their versions, change requests, RAID, meetings, finance and reports — plus a manifest of attachments. Project admins only; each export and download is in the audit log.">
      <div className="max-w-[720px] space-y-3 text-[13px] text-[var(--w-text-2)]" data-testid="full-export">
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-0.5" checked={withFiles} onChange={(e) => setWithFiles(e.target.checked)} />
          <span>Include attachment files {q.data ? `(when they total ${fmtSize(q.data.maxFileBytes)} or less — otherwise only the list is included)` : ''}</span>
        </label>
        <button type="button" className="w-btn w-btn-primary" disabled={start.isPending || running} onClick={() => start.mutate()} data-testid="export-start">
          {start.isPending || running ? <Spinner size={12} /> : <Archive size={14} />} Export project (.zip)
        </button>
        <p className="text-[12px] text-[var(--w-text-3)]">Restore (import) is not available yet — the file carries a format version so a later release can import it. Secrets (webhook URLs, tokens) and private AI chats are left out; people appear without email addresses. Files are kept for 72 hours; download links work for 15 minutes.</p>
        {!!q.data?.items.length && (
          <ul className="divide-y divide-[var(--w-border)] rounded-[8px] border border-[var(--w-border)]" data-testid="export-list">
            {q.data.items.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-3 py-2">
                <span className="min-w-0 flex-1 truncate text-[var(--w-text)]">{e.fileName ?? `Export #${e.id}`}</span>
                <span className="text-[12px] text-[var(--w-text-3)]">{new Date(e.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                {(e.status === 'QUEUED' || e.status === 'RUNNING') && (
                  <span className="flex min-w-[160px] items-center gap-2" role="progressbar" aria-valuenow={e.progress} aria-valuemin={0} aria-valuemax={100} aria-label="Export progress">
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--w-sunken)]"><span className="block h-full rounded-full bg-[var(--w-accent)] transition-[width]" style={{ width: `${e.progress}%` }} /></span>
                    <span className="text-[12px] tabular-nums">{e.progress}%</span>
                  </span>
                )}
                {e.status === 'DONE' && (
                  <>
                    <span className="text-[12px] text-[var(--w-text-3)]">{fmtSize(e.size)}{e.includeFiles ? ` · ${e.filesIncluded}/${e.attachmentCount} files` : ` · ${e.attachmentCount} attachments listed`}</span>
                    <button type="button" className="w-btn w-btn-sm" onClick={() => download(e.id)} data-testid={`export-download-${e.id}`}><Download size={13} /> Download</button>
                  </>
                )}
                {e.status === 'FAILED' && <span className="text-[12px] text-[var(--w-red)]">Failed: {e.error}</span>}
                {e.status === 'EXPIRED' && <span className="text-[12px] text-[var(--w-text-3)]">Expired</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
}
