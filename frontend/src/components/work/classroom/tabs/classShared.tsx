'use client';

/** CTW đợt 9a — mảnh dùng chung của Stream / tài liệu: thẻ link (Resources), chip tệp, ô thêm link, nút tải tệp. */

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { FileText, Link2, Paperclip, Plus, X } from 'lucide-react';
import { workError } from '@/lib/work-api';
import { formatBytes, Spinner } from '@/components/work/ui';
import { useWT } from '@/components/work/i18n';
import { Favicon, kindLabel } from '@/components/work/resources/shared';
import { classroomApi, openClassFile, type ClassFile, type LinkCard } from '../classroomApi';

export function LinkCards({ links, onOpen }: { links: LinkCard[]; onOpen?: (l: LinkCard) => void }) {
  if (!links?.length) return null;
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {links.map((l) => (
        <li key={l.url} className="min-w-0">
          <a href={l.url} target="_blank" rel="noopener noreferrer" onClick={() => onOpen?.(l)}
            className="flex min-w-0 items-center gap-2.5 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] px-2.5 py-2 hover:bg-[var(--w-hover)]">
            <Favicon r={l} size={18} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium">{l.title}</span>
              <span className="block truncate text-[11.5px] text-[var(--w-text-2)]">{kindLabel(l.kind)} · {l.url.replace(/^https?:\/\//, '')}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function FileChips({ classId, files, onRemove, onOpen }: { classId: number; files: ClassFile[]; onRemove?: (f: ClassFile) => void; onOpen?: (f: ClassFile) => void }) {
  const { t } = useWT();
  if (!files?.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {files.map((f) => (
        <li key={f.id} className="flex min-w-0 max-w-full items-center gap-1 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] pl-2 pr-1">
          <FileText size={14} className="shrink-0 text-[var(--w-text-3)]" aria-hidden="true" />
          <button type="button" className="min-w-0 truncate py-1.5 text-left text-[13px] hover:underline"
            onClick={() => { onOpen?.(f); openClassFile(classId, f).catch((err) => toast.error(workError(err))); }}>
            {f.fileName}
          </button>
          <span className="shrink-0 text-[11.5px] tabular-nums text-[var(--w-text-2)]">{formatBytes(f.size)}</span>
          {onRemove && (
            <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`${t('c9a.removeFile')} ${f.fileName}`} onClick={() => onRemove(f)}><X size={13} /></button>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Nút tải tệp lên (nháp) + ô thêm link — dùng cho trình soạn thông báo và tài liệu. */
export function AttachBar({ classId, files, setFiles, links, setLinks }: {
  classId: number;
  files: ClassFile[]; setFiles: (f: ClassFile[]) => void;
  links: Array<{ url: string; title?: string }>; setLinks: (l: Array<{ url: string; title?: string }>) => void;
}) {
  const { t } = useWT();
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(0);
  const [linkOpen, setLinkOpen] = useState(false);
  const [url, setUrl] = useState('');
  const onFiles = async (list: FileList | null) => {
    const picked = list ? Array.from(list) : [];
    if (!picked.length) return;
    setBusy((n) => n + picked.length);
    const done: ClassFile[] = [];
    for (const f of picked) {
      try { done.push(await classroomApi.uploadFile(classId, f)); } catch (err) { toast.error(workError(err)); } finally { setBusy((n) => n - 1); }
    }
    setFiles([...files, ...done]);
  };
  const addLink = () => {
    const u = url.trim();
    if (!u) return;
    if (!/^https?:\/\//i.test(u) && !/^[\w-]+(\.[\w-]+)+/.test(u)) { toast.error(t('c9a.badLink')); return; }
    setLinks([...links, { url: /^https?:\/\//i.test(u) ? u : `https://${u}` }]);
    setUrl('');
    setLinkOpen(false);
  };
  return (
    <div className="space-y-2">
      {(files.length > 0 || links.length > 0) && (
        <div className="space-y-2">
          <FileChips classId={classId} files={files} onRemove={(f) => { setFiles(files.filter((x) => x.id !== f.id)); void classroomApi.discardFile(classId, f.id).catch(() => undefined); }} />
          {links.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {links.map((l) => (
                <li key={l.url} className="flex min-w-0 max-w-full items-center gap-1 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] pl-2 pr-1">
                  <Link2 size={13} className="shrink-0 text-[var(--w-text-3)]" aria-hidden="true" />
                  <span className="min-w-0 truncate py-1.5 text-[13px]">{l.url.replace(/^https?:\/\//, '')}</span>
                  <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`${t('c9a.removeLink')} ${l.url}`} onClick={() => setLinks(links.filter((x) => x.url !== l.url))}><X size={13} /></button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <input ref={ref} type="file" multiple className="sr-only" aria-label={t('c9a.attachFile')} onChange={(e) => { void onFiles(e.target.files); e.target.value = ''; }} />
        <button type="button" className="w-btn w-btn-sm" onClick={() => ref.current?.click()} disabled={busy > 0}>
          {busy > 0 ? <Spinner size={13} /> : <Paperclip size={13} aria-hidden="true" />}<span className="ml-1">{t('c9a.attachFile')}</span>
        </button>
        {linkOpen ? (
          <form className="flex min-w-0 flex-1 items-center gap-1.5" onSubmit={(e) => { e.preventDefault(); addLink(); }}>
            <input className="w-input h-[28px] min-w-0 flex-1 text-[13px]" autoFocus value={url} onChange={(e) => setUrl(e.target.value)} placeholder={t('c9a.linkPh')} aria-label={t('c9a.addLink')} maxLength={2000} />
            <button type="submit" className="w-btn w-btn-sm">{t('c9a.add')}</button>
            <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => { setLinkOpen(false); setUrl(''); }}>{t('c9a.cancel')}</button>
          </form>
        ) : (
          <button type="button" className="w-btn w-btn-sm" onClick={() => setLinkOpen(true)}><Plus size={13} aria-hidden="true" /><span className="ml-1">{t('c9a.addLink')}</span></button>
        )}
      </div>
    </div>
  );
}
