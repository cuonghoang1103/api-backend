'use client';

/** "Create with CuongMini" — ô tải tệp (kéo-thả) + dán link cho MỘT nhóm nguồn (đề bài, mẫu, mã, dữ liệu mẫu…). */

import { useRef, useState } from 'react';
import { Link2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { setupApi, type SetupDraft, type SourceCategory } from '@/lib/work-setup-api';
import { Spinner } from '@/components/work/ui';
import { wt } from '@/components/work/i18n';
import { SourceChip } from './bits';

const MAX = 25 * 1024 * 1024;

export default function SourcesBox({ draft, category, accept, onDraft, linkPlaceholder, allowLink = true, notePlaceholder, disabled }: {
  draft: SetupDraft; category: SourceCategory; accept: string; onDraft: (d: SetupDraft) => void;
  linkPlaceholder?: string; allowLink?: boolean; notePlaceholder?: string; disabled?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<{ name: string; pct: number } | null>(null);
  const [link, setLink] = useState('');
  const [note, setNote] = useState('');
  const [linkBusy, setLinkBusy] = useState(false);
  const [over, setOver] = useState(false);
  const mine = draft.sources.filter((s) => (category === 'CODE' ? s.category === 'CODE' || s.kind === 'REPO' : s.category === category));

  const upload = async (files: FileList | File[]) => {
    for (const f of Array.from(files)) {
      if (f.size > MAX) { toast.error(wt('tcm.fileTooBig', { name: f.name })); continue; }
      setUploading({ name: f.name, pct: 0 });
      try {
        const r = await setupApi.addFile(draft.id, f, category, note.trim(), (pct) => setUploading({ name: f.name, pct }));
        onDraft(r.draft);
        if (r.source.status !== 'OK') toast.message(`${f.name}: ${r.source.error ?? wt(`tcm.src_${r.source.status}` as const)}`);
      } catch (e) { toast.error(workError(e, wt('tcm.uploadFailed'))); }
    }
    setUploading(null);
    setNote('');
  };
  const addLink = async () => {
    const url = link.trim();
    if (!url) return;
    setLinkBusy(true);
    try {
      const r = await setupApi.addLink(draft.id, { url, category, note: note.trim() || undefined });
      onDraft(r.draft);
      setLink(''); setNote('');
      if (r.source.status !== 'OK') toast.message(r.source.error ?? wt(`tcm.src_${r.source.status}` as const));
    } catch (e) { toast.error(workError(e, wt('tcm.linkFailed'))); } finally { setLinkBusy(false); }
  };
  const remove = async (sid: string) => {
    try { onDraft(await setupApi.removeSource(draft.id, sid)); } catch (e) { toast.error(workError(e)); }
  };

  return (
    <div className="min-w-0">
      <div
        className={cn('rounded-[8px] border border-dashed px-3 py-3 transition-colors', over ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)]' : 'border-[var(--w-border-strong)]', disabled && 'opacity-60')}
        onDragOver={(e) => { if (disabled) return; e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); if (!disabled && e.dataTransfer.files.length) void upload(e.dataTransfer.files); }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="w-btn w-btn-sm" disabled={disabled || !!uploading} onClick={() => fileRef.current?.click()}>
            {uploading ? <Spinner size={12} /> : <Upload size={13} />} {wt('tcm.chooseFiles')}
          </button>
          <span className="min-w-0 flex-1 text-[12px] text-[var(--w-text-3)]">
            {uploading ? wt('tcm.uploading', { name: uploading.name, pct: uploading.pct }) : wt('tcm.dropHint')}
          </span>
          <input ref={fileRef} type="file" hidden multiple accept={accept} onChange={(e) => { const fs = e.target.files; if (fs?.length) void upload([...fs]); e.target.value = ''; }} />
        </div>
        <input className="w-input mt-2 h-8 text-[12.5px]" value={note} disabled={disabled} onChange={(e) => setNote(e.target.value)} placeholder={notePlaceholder ?? wt('tcm.notePh')} aria-label={wt('tcm.noteLabel')} />
        {allowLink && (
          <div className="mt-2 flex gap-1.5">
            <div className="relative min-w-0 flex-1">
              <Link2 size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" />
              <input className="w-input h-8 pl-7 text-[12.5px]" value={link} disabled={disabled} onChange={(e) => setLink(e.target.value)} placeholder={linkPlaceholder ?? wt('tcm.linkPh')}
                aria-label={wt('tcm.linkLabel')} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void addLink(); } }} />
            </div>
            <button type="button" className="w-btn w-btn-sm" disabled={disabled || linkBusy || !link.trim()} onClick={() => void addLink()}>{linkBusy ? <Spinner size={12} /> : null} {wt('tcm.addLink')}</button>
          </div>
        )}
      </div>
      {mine.length > 0 && (
        <ul className="mt-2 grid grid-cols-1 gap-1.5 md:grid-cols-2">
          {mine.map((s) => <SourceChip key={s.id} s={s} disabled={disabled} onRemove={() => void remove(s.id)} />)}
        </ul>
      )}
    </div>
  );
}
