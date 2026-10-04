'use client';

/**
 * "Linked docs" trong chi tiết thẻ (S2a, chỉ khi mô-đun docs bật) — chiều ngược
 * của "Linked issues" trên trang tài liệu. Khách chỉ thấy trang Client (server lọc).
 */

import Link from 'next/link';
import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { FileText, Link2, X } from 'lucide-react';
import { workDocsApi, workDocsKeys, workError, type ProjectConfig } from '@/lib/work-api';
import { PickerList, Popover } from '../ui';
import { PageStatusPill, VisibilityBadge, docsBase, useDocsList } from './shared';

export function LinkedDocs({ config, issueNumber }: { config: ProjectConfig; issueNumber: number }) {
  const pid = config.id;
  const qc = useQueryClient();
  const ref = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const key = workDocsKeys.issuePages(pid, issueNumber);
  const q = useQuery({ queryKey: key, queryFn: () => workDocsApi.issuePages(pid, issueNumber) });
  const all = useDocsList(pid, open);
  const canEdit = !!q.data?.canEdit && !!config.permissions.editDocs;
  const refresh = () => {
    qc.invalidateQueries({ queryKey: key });
    qc.invalidateQueries({ queryKey: workDocsKeys.all(pid) });
  };
  const link = useMutation({
    mutationFn: (num: number) => workDocsApi.linkIssue(pid, num, issueNumber),
    onSuccess: refresh,
    onError: (err) => toast.error(workError(err, 'Could not link the document')),
  });
  const unlink = useMutation({
    mutationFn: (num: number) => workDocsApi.unlinkIssue(pid, num, issueNumber),
    onSuccess: refresh,
    onError: (err) => toast.error(workError(err, 'Could not unlink the document')),
  });
  const pages = q.data?.pages ?? [];
  if (!pages.length && !canEdit) return null;
  const linked = new Set(pages.map((p) => p.number));
  const base = docsBase(config);
  return (
    <section>
      <div className="mb-2 flex items-center">
        <h3 className="w-section-title">Linked docs</h3>
        {canEdit && (
          <button ref={ref} type="button" className="w-btn w-btn-ghost w-btn-sm ml-auto" onClick={() => setOpen(true)}>
            <Link2 size={13} /> Link a doc
          </button>
        )}
      </div>
      {pages.length ? (
        <ul className="overflow-hidden rounded-[6px] border border-[var(--w-border)]">
          {pages.map((p) => (
            <li key={p.linkId} className="group flex min-w-0 items-center gap-2 border-b border-[var(--w-border)] px-2.5 py-1.5 last:border-b-0 hover:bg-[var(--w-hover)]">
              <Link href={`${base}/${p.number}`} className="flex min-w-0 flex-1 items-center gap-2 text-[13px]">
                <FileText size={13} className="shrink-0 text-[var(--w-text-3)]" />
                <span className="min-w-0 truncate">{p.title}</span>
              </Link>
              <VisibilityBadge visibility={p.visibility} compact />
              {p.status !== 'DRAFT' && <PageStatusPill status={p.status} />}
              {canEdit && (
                <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm opacity-0 focus:opacity-100 group-hover:opacity-100 max-md:opacity-100" aria-label={`Unlink ${p.title}`} onClick={() => unlink.mutate(p.number)}>
                  <X size={12} />
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[12px] text-[var(--w-text-3)]">Link the requirements, design or test plan this issue implements.</p>
      )}
      <Popover open={open} onClose={() => setOpen(false)} anchorRef={ref} width={320} align="end">
        <PickerList
          options={(all.data?.pages ?? []).filter((p) => !linked.has(p.number)).map((p) => ({ value: p.number, label: p.title, icon: <FileText size={13} className="text-[var(--w-text-3)]" /> }))}
          selected={[]}
          onPick={(n) => { link.mutate(n); setOpen(false); }}
          placeholder="Find a document…"
          empty={all.isLoading ? 'Loading…' : 'No document found'}
        />
      </Popover>
    </section>
  );
}
