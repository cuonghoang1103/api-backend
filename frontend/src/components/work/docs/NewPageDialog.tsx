'use client';

/**
 * "New page" = thư viện mẫu (S2a): trang trắng hoặc một trong 36 mẫu của quy trình
 * nhận dự án (SRS, SOW, NDA, test plan, runbook…), nhóm theo giai đoạn đầu tiên
 * dùng mẫu đó. Bên phải xem trước nội dung mẫu. Tạo xong ⇒ mở trang mới.
 *
 * Mẫu viết bằng tiếng Việt (chuẩn nghề trong nước), tên mẫu hiện bằng tiếng Anh.
 */

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { FilePlus2, FileText, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workDocsApi, workDocsKeys, workError, type DocTemplateInfo, type ProjectConfig } from '@/lib/work-api';
import { Dialog, Field, PageLoading, Spinner } from '../ui';
import { RichView } from '../RichEditor';
import { docsBase } from './shared';

const BLANK = '__blank__';

export default function NewPageDialog({ open, onClose, config, parentNumber, parentTitle, stageId }: {
  open: boolean;
  onClose: () => void;
  config: ProjectConfig;
  parentNumber?: number | null;
  parentTitle?: string | null;
  stageId?: number | null;
}) {
  const pid = config.id;
  const router = useRouter();
  const qc = useQueryClient();
  const [pick, setPick] = useState<string>(BLANK);
  const [title, setTitle] = useState('');
  const [q, setQ] = useState('');
  useEffect(() => { if (open) { setPick(BLANK); setTitle(''); setQ(''); } }, [open]);

  const lib = useQuery({ queryKey: workDocsKeys.templates(pid), queryFn: () => workDocsApi.templates(pid), enabled: open, staleTime: 10 * 60_000 });
  const preview = useQuery({
    queryKey: [...workDocsKeys.templates(pid), pick],
    queryFn: () => workDocsApi.template(pid, pick),
    enabled: open && pick !== BLANK,
    staleTime: 10 * 60_000,
  });

  const groups = useMemo(() => {
    const t = q.trim().toLowerCase();
    const list = (lib.data ?? []).filter((x) => !t || `${x.title} ${x.titleVi} ${x.key}`.toLowerCase().includes(t));
    const by = new Map<string, { label: string; n: number; items: DocTemplateInfo[] }>();
    for (const x of list) {
      const s = x.stages[0];
      // CTW đợt 3A: mẫu có nhóm riêng (bộ "FPT Capstone" — Report 1→7) đứng đầu danh sách.
      const group = (x as DocTemplateInfo & { group?: string | null }).group;
      const k = group ? `group:${group}` : s ? s.slug : 'other';
      const g = by.get(k) ?? { label: group ? `${group} · Report 1 → 7` : s ? `${String(s.n).padStart(2, '0')} · ${s.titleEn}` : 'Other', n: group ? -1 : s ? s.n : 99, items: [] };
      g.items.push(x);
      by.set(k, g);
    }
    return [...by.values()].sort((a, b) => a.n - b.n);
  }, [lib.data, q]);

  const chosen = lib.data?.find((x) => x.key === pick) ?? null;
  const create = useMutation({
    mutationFn: () => workDocsApi.create(pid, {
      title: title.trim() || (chosen ? undefined : 'Untitled'),
      templateKey: chosen?.key ?? null,
      parentNumber: parentNumber ?? null,
      stageId: stageId ?? null,
    }),
    onSuccess: (p) => {
      qc.invalidateQueries({ queryKey: workDocsKeys.all(pid) });
      toast.success(chosen ? `Created “${p.title}” from a template` : 'Page created');
      onClose();
      router.push(`${docsBase(config)}/${p.number}`);
    },
    onError: (err) => toast.error(workError(err, 'Could not create the page')),
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={parentTitle ? `New page in “${parentTitle}”` : 'New page'}
      width={1040}
      footer={
        <>
          <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="w-btn w-btn-primary" disabled={create.isPending} onClick={() => create.mutate()} data-testid="docs-create">
            {create.isPending ? <Spinner size={12} /> : <FilePlus2 size={13} />} {chosen ? 'Use template' : 'Create blank page'}
          </button>
        </>
      }
    >
      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-[320px_minmax(0,1fr)]">
        <div className="min-w-0">
          <div className="relative mb-2">
            <Search size={13} aria-hidden="true" className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" />
            <input className="w-input !pl-7" value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${lib.data?.length ?? ''} templates`} aria-label="Search templates" />
          </div>
          <div className="max-h-[52vh] overflow-y-auto rounded-[8px] border border-[var(--w-border)] p-1" role="listbox" aria-label="Templates">
            <TemplateRow active={pick === BLANK} onClick={() => setPick(BLANK)} title="Blank page" sub="Start from an empty page" blank />
            {lib.isLoading && <PageLoading rows={4} />}
            {groups.map((g) => (
              <div key={g.label}>
                <div className="w-eyebrow px-2 pb-1 pt-3">{g.label}</div>
                {g.items.map((t) => (
                  <TemplateRow key={t.key} active={pick === t.key} onClick={() => setPick(t.key)} title={t.title} sub={`${t.sections} section${t.sections === 1 ? '' : 's'}${t.stages.length > 1 ? ` · used in ${t.stages.length} stages` : ''}`} />
                ))}
              </div>
            ))}
            {!lib.isLoading && !groups.length && <p className="px-2 py-4 text-center text-[12px] text-[var(--w-text-3)]">No template matches “{q}”.</p>}
          </div>
        </div>
        <div className="flex min-w-0 flex-col">
          <Field label="Title">
            <input
              className="w-input"
              value={title}
              maxLength={255}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={chosen ? chosen.title : 'Untitled'}
              aria-label="Page title"
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) create.mutate(); }}
            />
          </Field>
          {chosen ? (
            <div className="min-w-0">
              {chosen.summary && <p className="mb-2 text-[13px] leading-relaxed text-[var(--w-text-2)]">{chosen.summary}</p>}
              <div className="mb-2 flex flex-wrap gap-1.5 text-[12px] text-[var(--w-text-3)]">
                <span className="rounded-[4px] bg-[var(--w-sunken)] px-1.5 leading-[20px]" title="Original (Vietnamese) title">{chosen.titleVi}</span>
                {chosen.stages.map((s) => <span key={s.slug} className="rounded-[4px] bg-[var(--w-accent-soft)] px-1.5 leading-[20px] text-[var(--w-accent-text)]">Stage {String(s.n).padStart(2, '0')}</span>)}
              </div>
              <div className="w-doc max-h-[40vh] min-w-0 overflow-y-auto rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] px-4 py-3">
                {preview.isLoading ? <PageLoading rows={6} /> : preview.data ? <RichView value={preview.data.contentJson} docs /> : <p className="text-[13px] text-[var(--w-text-3)]">{workError(preview.error, 'Could not load the template')}</p>}
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center rounded-[8px] border border-dashed border-[var(--w-border-strong)] px-6 py-10 text-center">
              <FileText size={22} className="mb-2 text-[var(--w-text-3)]" />
              <p className="max-w-[360px] text-[13px] leading-relaxed text-[var(--w-text-2)]">
                A blank page. Pick a template from the list to start from a proven structure — requirements, contracts, test plans and runbooks from the studio process.
              </p>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}

function TemplateRow({ active, onClick, title, sub, blank }: { active: boolean; onClick: () => void; title: string; sub: string; blank?: boolean }) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={active}
      onClick={onClick}
      className={cn('flex w-full min-w-0 items-start gap-2 rounded-[6px] px-2 py-1.5 text-left', active ? 'bg-[var(--w-active)]' : 'hover:bg-[var(--w-hover)]')}
    >
      {blank ? <FilePlus2 size={14} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" /> : <FileText size={14} className={cn('mt-0.5 shrink-0', active ? 'text-[var(--w-accent-text)]' : 'text-[var(--w-text-3)]')} />}
      <span className="min-w-0">
        <span className="block truncate text-[13px] font-medium text-[var(--w-text)]">{title}</span>
        <span className="block truncate text-[11.5px] text-[var(--w-text-3)]">{sub}</span>
      </span>
    </button>
  );
}
