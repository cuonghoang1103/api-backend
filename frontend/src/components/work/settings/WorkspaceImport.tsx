'use client';

/**
 * Cài đặt không gian → Import project (đợt S5c). Nhập lại một ZIP "Export the whole project" (S4, format version 1)
 * thành DỰ ÁN MỚI — không bao giờ ghi đè dự án cũ. Ba bước: tải lên (server kiểm toàn vẹn + chạy thử) → xem trước số
 * lượng, ánh xạ người, cảnh báo, chọn mã/tên → nhập chạy nền có tiến trình. Chỉ OWNER/ADMIN không gian (server kiểm).
 */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle2, FileArchive, Upload, XCircle } from 'lucide-react';
import { workError, type WorkspaceDetail } from '@/lib/work-api';
import { workS5cApi, workS5cKeys, type ProjectImport } from '@/lib/work-s5c-api';
import { wk } from '../hooks';
import { relativeTime, Spinner } from '../ui';
import { ReadOnlyNotice, Section } from './shared';

const KEY_RE = /^[A-Z][A-Z0-9]{1,9}$/;
const mb = (b: number) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(b < 10 * 1024 * 1024 ? 1 : 0)} MB`);

export default function WorkspaceImport({ ws }: { ws: WorkspaceDetail }) {
  const canManage = ws.role === 'OWNER' || ws.role === 'ADMIN';
  const qc = useQueryClient();
  const list = useQuery({ queryKey: workS5cKeys.imports(ws.id), queryFn: () => workS5cApi.imports(ws.id), enabled: canManage });
  const [activeId, setActiveId] = useState<number | null>(null);
  const [uploadPct, setUploadPct] = useState<number | null>(null);
  const [key, setKey] = useState('');
  const [name, setName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const job = useQuery({
    queryKey: workS5cKeys.import(ws.id, activeId ?? 0),
    queryFn: () => workS5cApi.getImport(ws.id, activeId!),
    enabled: !!activeId,
    refetchInterval: (q) => (['QUEUED', 'RUNNING'].includes(q.state.data?.status ?? '') ? 1000 : false),
  });
  const cur: ProjectImport | undefined = job.data;
  useEffect(() => {
    if (cur?.status === 'UPLOADED' && cur.plan) {
      setKey((k) => k || cur.projectKey || cur.plan!.suggestedKey);
      setName((n) => n || cur.projectName || cur.plan!.source.name);
    }
    if (cur?.status === 'DONE') {
      qc.invalidateQueries({ queryKey: workS5cKeys.imports(ws.id) });
      qc.invalidateQueries({ queryKey: wk.workspace(ws.slug) });
      qc.invalidateQueries({ queryKey: wk.workspaces });
    }
  }, [cur?.status, cur?.plan, cur?.projectKey, cur?.projectName, qc, ws.id, ws.slug]);

  const upload = useMutation({
    mutationFn: (f: File) => workS5cApi.uploadImport(ws.id, f, setUploadPct),
    onSuccess: (r) => { setUploadPct(null); setKey(''); setName(''); setActiveId(r.id); qc.setQueryData(workS5cKeys.import(ws.id, r.id), r); list.refetch(); },
    onError: (err) => { setUploadPct(null); toast.error(workError(err, 'Could not read this file')); },
  });
  const start = useMutation({
    mutationFn: () => workS5cApi.startImport(ws.id, activeId!, { key, name }),
    onSuccess: (r) => { qc.setQueryData(workS5cKeys.import(ws.id, r.id), r); job.refetch(); },
    onError: (err) => toast.error(workError(err, 'Could not start the import')),
  });
  const cancel = useMutation({
    mutationFn: (id: number) => workS5cApi.cancelImport(ws.id, id),
    onSuccess: () => { setActiveId(null); list.refetch(); },
    onError: (err) => toast.error(workError(err, 'Could not cancel')),
  });

  const description = 'Restore a project from a CT Work export (.zip from Project settings → Export → Export the whole project, up to 200 MB). It always creates a NEW project — nothing existing is overwritten.';
  if (!canManage) {
    return <Section title="Import project" description={description}><ReadOnlyNotice>Only workspace owners and admins can import projects.</ReadOnlyNotice></Section>;
  }
  const keyOk = KEY_RE.test(key);

  return (
    <>
      <Section title="Import project" description={description}>
        {list.data && !list.data.storageReady && (
          <ReadOnlyNotice>Import needs cloud storage (Cloudflare R2), which is not configured on this server.</ReadOnlyNotice>
        )}
        {(!cur || ['DONE', 'FAILED', 'CANCELLED', 'EXPIRED'].includes(cur.status)) && (
          <div className="flex flex-col items-center rounded-[8px] border border-dashed border-[var(--w-border-strong)] px-4 py-8 text-center">
            <FileArchive size={22} className="mb-2 text-[var(--w-text-3)]" />
            <div className="text-[13px] font-medium">Choose a project export (.zip)</div>
            <p className="mt-1 max-w-[440px] text-[12px] text-[var(--w-text-3)]">We check the file first and show what will be imported — nothing is created until you confirm.</p>
            <input
              ref={fileRef} type="file" accept=".zip,application/zip" className="sr-only" aria-label="Project export file"
              onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) upload.mutate(f); }}
            />
            <button type="button" className="w-btn w-btn-primary mt-3" disabled={upload.isPending || list.data?.storageReady === false} onClick={() => fileRef.current?.click()}>
              {upload.isPending ? <Spinner size={12} /> : <Upload size={13} />} {upload.isPending ? (uploadPct !== null && uploadPct < 100 ? `Uploading ${uploadPct}%` : 'Checking the file…') : 'Choose file'}
            </button>
          </div>
        )}

        {cur?.status === 'UPLOADED' && cur.plan && (
          <div className="space-y-4" data-testid="import-preview">
            <div className="rounded-[8px] border border-[var(--w-border)] px-3.5 py-3">
              <div className="flex flex-wrap items-center gap-2 text-[13px]">
                <CheckCircle2 size={15} className="text-[var(--w-green)]" />
                <span className="font-medium">{cur.fileName}</span>
                <span className="text-[var(--w-text-3)]">· {cur.size ? mb(cur.size) : ''}</span>
              </div>
              <p className="mt-1 text-[12.5px] text-[var(--w-text-2)]">
                Export of <span className="font-mono">{cur.plan.source.key}</span> “{cur.plan.source.name}”{cur.plan.source.workspace ? ` from ${cur.plan.source.workspace}` : ''}
                {cur.plan.source.exportedAt ? `, ${new Date(cur.plan.source.exportedAt).toLocaleString('en-GB')}` : ''}. Format checked
                {cur.plan.checksumsVerified ? `, ${cur.plan.checksumsVerified} file checksums verified` : ''}.
              </p>
            </div>

            {cur.plan.warnings.length > 0 && (
              <ul className="space-y-1.5 rounded-[8px] border border-[color-mix(in_srgb,var(--w-orange)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-orange)_8%,transparent)] px-3.5 py-3">
                {cur.plan.warnings.map((w, i) => (
                  <li key={i} className="flex gap-2 text-[12.5px] leading-snug"><AlertTriangle size={13} className="mt-0.5 shrink-0 text-[var(--w-orange)]" />{w}</li>
                ))}
              </ul>
            )}

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="min-w-0">
                <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--w-text-3)]">What will be imported</div>
                <div className="max-h-[300px] overflow-y-auto rounded-[8px] border border-[var(--w-border)]">
                  <table className="w-full text-[12.5px]">
                    <tbody>
                      {cur.plan.tables.filter((t) => t.rows > 0).map((t) => (
                        <tr key={t.table} className="border-b border-[var(--w-border)] last:border-0" title={t.note}>
                          <td className="px-3 py-1.5">{t.table}</td>
                          <td className="px-3 py-1.5 text-right tabular-nums">{t.rows}</td>
                          <td className="px-3 py-1.5 text-right text-[11.5px] text-[var(--w-text-3)]">{t.import ? '' : 'skipped'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-1.5 text-[12px] text-[var(--w-text-3)]">
                  Attachments: {cur.plan.files.withContent} with file content, {cur.plan.files.missing} as broken links.
                  {cur.plan.teams.length > 0 && ` Teams: ${cur.plan.teams.map((t) => `${t.key} (${t.action === 'reuse' ? 'existing' : 'new'})`).join(', ')}.`}
                </p>
              </div>
              <div className="min-w-0">
                <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--w-text-3)]">People</div>
                <ul className="max-h-[300px] divide-y divide-[var(--w-border)] overflow-y-auto rounded-[8px] border border-[var(--w-border)]">
                  {cur.plan.people.map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-2 px-3 py-1.5 text-[12.5px]">
                      <span className="min-w-0 truncate">{p.name}</span>
                      {p.mappedTo
                        ? <span className="shrink-0 text-[var(--w-green)]">→ @{p.mappedTo.username}{p.how === 'email' ? ' (email)' : ''}</span>
                        : <span className="shrink-0 text-[var(--w-text-3)]">not in this workspace</span>}
                    </li>
                  ))}
                  {!cur.plan.people.length && <li className="px-3 py-2 text-[12px] text-[var(--w-text-3)]">No people in this export.</li>}
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-3 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3.5 py-3">
              <label className="flex flex-col gap-1 text-[12px] font-medium">
                New project key
                <input className="w-input !w-[140px] font-mono uppercase" value={key} maxLength={10} onChange={(e) => setKey(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} aria-invalid={!keyOk} />
              </label>
              <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-[12px] font-medium">
                Project name
                <input className="w-input" value={name} maxLength={120} onChange={(e) => setName(e.target.value)} />
              </label>
              <div className="flex gap-2">
                <button type="button" className="w-btn" onClick={() => cancel.mutate(cur.id)} disabled={cancel.isPending}>Cancel</button>
                <button type="button" className="w-btn w-btn-primary" disabled={!keyOk || start.isPending} onClick={() => start.mutate()}>
                  {start.isPending && <Spinner size={12} />} Import as new project
                </button>
              </div>
              {!keyOk && key && <p className="w-full text-[12px] text-[var(--w-red)]">2–10 characters, starting with a letter: A–Z and 0–9.</p>}
            </div>
          </div>
        )}

        {cur && (cur.status === 'QUEUED' || cur.status === 'RUNNING') && (
          <div className="rounded-[8px] border border-[var(--w-border)] px-3.5 py-3" role="status" aria-live="polite">
            <div className="flex items-center gap-2 text-[13px] font-medium"><Spinner size={13} /> Importing {cur.projectKey} — {cur.stage ?? 'starting'}</div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--w-sunken)]">
              <div className="h-full rounded-full bg-[var(--w-accent)] transition-[width]" style={{ width: `${cur.progress}%` }} />
            </div>
            <p className="mt-1.5 text-[12px] text-[var(--w-text-3)]">{cur.progress}% · you can leave this page; the import keeps running.</p>
          </div>
        )}

        {cur?.status === 'DONE' && (
          <div className="mt-4 rounded-[8px] border border-[color-mix(in_srgb,var(--w-green)_40%,transparent)] px-3.5 py-3" data-testid="import-done">
            <div className="flex flex-wrap items-center gap-2 text-[13px] font-medium">
              <CheckCircle2 size={15} className="text-[var(--w-green)]" /> Imported as {cur.projectKey} “{cur.projectName}”
              <Link href={`/work/${ws.slug}/${cur.projectKey}`} className="w-btn w-btn-sm w-btn-primary ml-auto">Open project</Link>
            </div>
            {cur.result && (
              <p className="mt-1 text-[12.5px] text-[var(--w-text-2)]">
                {Object.entries(cur.result.tables).filter(([, v]) => v.imported).slice(0, 8).map(([k, v]) => `${v.imported} ${k}`).join(' · ')}
                {cur.result.peopleUnmatched ? ` · ${cur.result.peopleUnmatched} people not matched` : ''}
              </p>
            )}
          </div>
        )}
        {cur?.status === 'FAILED' && (
          <div className="mt-4 flex gap-2 rounded-[8px] border border-[color-mix(in_srgb,var(--w-red)_45%,transparent)] px-3.5 py-3 text-[12.5px]">
            <XCircle size={15} className="mt-0.5 shrink-0 text-[var(--w-red)]" />
            <span>The import failed and nothing was created. {cur.error}</span>
          </div>
        )}
      </Section>

      {!!list.data?.items.length && (
        <Section title="Recent imports">
          <ul className="divide-y divide-[var(--w-border)] overflow-hidden rounded-[8px] border border-[var(--w-border)]">
            {list.data.items.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 text-[12.5px]">
                <span className="min-w-0 flex-1 truncate">{r.fileName ?? 'export.zip'} {r.sourceKey ? <span className="text-[var(--w-text-3)]">({r.sourceKey})</span> : null}</span>
                <span className="text-[var(--w-text-3)]">{relativeTime(r.createdAt)}</span>
                <span className="w-[92px] text-right font-medium">{r.status === 'DONE' && r.projectKey ? <Link className="hover:underline" href={`/work/${ws.slug}/${r.projectKey}`}>{r.projectKey}</Link> : r.status.toLowerCase()}</span>
                {r.status === 'UPLOADED' && r.id !== activeId && <button type="button" className="w-btn w-btn-sm" onClick={() => setActiveId(r.id)}>Review</button>}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
