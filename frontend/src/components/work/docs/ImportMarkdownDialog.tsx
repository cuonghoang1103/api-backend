'use client';

/**
 * CTW-4 (06/10/2026): "Import Markdown" — dán Markdown hoặc chọn tệp .md ⇒ trang tài liệu mới.
 * Máy chủ chuyển bằng CHÍNH bộ chuyển của xuất .md / mẫu tài liệu (tiêu đề, danh sách, bảng, code,
 * checklist, liên kết an toàn). Không nhập tiêu đề ⇒ lấy dòng `# …` đầu tiên.
 */

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { FileUp, Upload } from 'lucide-react';
import { workDocsKeys, workError, type ProjectConfig } from '@/lib/work-api';
import { workDocsImportApi } from '@/lib/work-ctw-api';
import { Dialog, Field, Spinner, formatBytes } from '../ui';
import { docsBase } from './shared';

const MAX = 1_000_000;

export default function ImportMarkdownDialog({ open, onClose, config, parentNumber, stageId }: {
  open: boolean; onClose: () => void; config: ProjectConfig; parentNumber?: number | null; stageId?: number | null;
}) {
  const router = useRouter();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [md, setMd] = useState('');
  const [title, setTitle] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  useEffect(() => { if (open) { setMd(''); setTitle(''); setFileName(null); } }, [open]);

  const h1 = /^\s*#\s+(.+?)\s*#*\s*$/m.exec(md.split('\n').find((l) => l.trim()) ?? '')?.[1] ?? '';
  const create = useMutation({
    mutationFn: () => workDocsImportApi.create(config.id, { markdown: md, ...(title.trim() ? { title: title.trim() } : {}), parentNumber: parentNumber ?? null, stageId: stageId ?? null }),
    onSuccess: (p) => {
      qc.invalidateQueries({ queryKey: workDocsKeys.all(config.id) });
      toast.success(`Imported “${p.title}”`);
      onClose();
      router.push(`${docsBase(config)}/${p.number}`);
    },
    onError: (err) => toast.error(workError(err, 'Could not import the Markdown')),
  });

  const pickFile = async (f: File | undefined) => {
    if (!f) return;
    if (f.size > MAX) { toast.error(`The file is ${formatBytes(f.size)} — Markdown imports are limited to 1 MB`); return; }
    setMd(await f.text());
    setFileName(f.name);
    if (!title.trim()) setTitle('');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Import Markdown"
      width={680}
      footer={(
        <>
          <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="w-btn w-btn-primary" disabled={!md.trim() || md.length > MAX || create.isPending} onClick={() => create.mutate()} data-testid="docs-import-md-submit">
            {create.isPending ? <Spinner size={12} /> : <Upload size={13} />} Create page
          </button>
        </>
      )}
    >
      <p className="mb-3 text-[12.5px] leading-relaxed text-[var(--w-text-2)]">
        Headings, lists, checklists, tables, code blocks and links are converted to a normal page you can edit. Raw HTML is not imported.
      </p>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input ref={fileRef} type="file" accept=".md,.markdown,.txt,text/markdown,text/plain" className="hidden" onChange={(e) => { void pickFile(e.target.files?.[0]); e.target.value = ''; }} />
        <button type="button" className="w-btn w-btn-sm" onClick={() => fileRef.current?.click()}><FileUp size={13} /> Choose a .md file</button>
        {fileName && <span className="truncate text-[12px] text-[var(--w-text-3)]">{fileName}</span>}
      </div>
      <Field label="Title (optional)" hint={!title.trim() && h1 ? `Uses the first heading: “${h1}”` : undefined}>
        <input className="w-input" value={title} maxLength={255} onChange={(e) => setTitle(e.target.value)} placeholder={h1 || 'Untitled'} />
      </Field>
      <Field label="Markdown" hint={md.length > MAX ? 'Too large — 1 MB max' : md ? `${md.length.toLocaleString('en-US')} characters` : undefined}>
        <textarea className="w-input font-mono text-[12.5px]" rows={14} value={md} onChange={(e) => setMd(e.target.value)} placeholder={'# Game design document\n\n## Goals\n\n- Day/night globe\n- Moon phases\n\n| Item | Owner |\n|---|---|\n| Globe | Client |'} data-testid="docs-import-md" />
      </Field>
    </Dialog>
  );
}
