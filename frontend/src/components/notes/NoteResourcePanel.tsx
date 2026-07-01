'use client';

// NoteResourcePanel — attachments + links for a Note OR a Subject.
// Reused by the note side-panel and the subject resources view.
// - Attachments: upload via the existing /files/upload flow, then
//   record metadata; shows icon + name + size; click to open.
// - Links: YouTube → lazy embedded player; web → preview card
//   (favicon + label) that opens in a new tab.
// Self-contained: manages its own add/delete and calls onChanged so
// the parent can refetch counts if it wants.

import { useRef, useState } from 'react';
import {
  Paperclip, LinkIcon, Plus, Trash2, FileText, FileArchive, FileImage,
  ExternalLink, Loader2, Youtube,
} from 'lucide-react';
import { fileApi, notesApi } from '@/lib/api';
import type { NoteAttachment, NoteLink } from '@/types';

type Parent = { noteId: number; subjectId?: undefined } | { subjectId: number; noteId?: undefined };

interface Props {
  parent: Parent;
  attachments: NoteAttachment[];
  links: NoteLink[];
  onChanged: () => void;
}

const MAX_BYTES = 70 * 1024 * 1024; // 70 MB

function fmtSize(b: number | null): string {
  if (!b && b !== 0) return '';
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

function fileIcon(type: string | null, name: string) {
  const t = `${type ?? ''} ${name}`.toLowerCase();
  if (/image|\.(png|jpe?g|gif|webp|svg)$/.test(t)) return FileImage;
  if (/zip|rar|7z|tar|gz/.test(t)) return FileArchive;
  return FileText;
}

function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/i);
  return m ? m[1] : null;
}

function hostOf(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
}

export default function NoteResourcePanel({ parent, attachments, links, onChanged }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkLabel, setLinkLabel] = useState('');
  const [err, setErr] = useState<string | null>(null);

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setErr(null);
    if (file.size > MAX_BYTES) { setErr('Tệp quá lớn (tối đa 70MB)'); return; }
    setUploading(true);
    try {
      const up = await fileApi.upload(file, 'documents');
      const url = (up.data as { data?: { url?: string } })?.data?.url;
      if (!url) throw new Error('upload failed');
      await notesApi.addAttachment({ ...parent, fileName: file.name, fileUrl: url, fileType: file.type || null, fileSizeBytes: file.size });
      onChanged();
    } catch { setErr('Tải tệp lên thất bại, thử lại nhé'); }
    finally { setUploading(false); }
  };

  const submitLink = async () => {
    const url = linkUrl.trim();
    if (!url) return;
    setAdding(true); setErr(null);
    try {
      await notesApi.addLink({ ...parent, url, label: linkLabel.trim() || undefined });
      setLinkUrl(''); setLinkLabel('');
      onChanged();
    } catch { setErr('Không thêm được liên kết'); }
    finally { setAdding(false); }
  };

  return (
    <div className="space-y-5 text-sm">
      {err && <div className="rounded-md bg-amber-500/10 px-2.5 py-1.5 text-[12px] text-amber-300">{err}</div>}

      {/* Attachments */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">
            <Paperclip className="h-3.5 w-3.5" /> Tệp đính kèm
          </h3>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-teal-600 dark:text-teal-300 hover:bg-teal-100 dark:bg-teal-500/10 disabled:opacity-50 min-h-[32px]"
          >
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />} Thêm
          </button>
          <input ref={fileRef} type="file" hidden onChange={onPickFile} />
        </div>
        {attachments.length === 0 ? (
          <p className="px-1 text-[12px] text-slate-500 dark:text-slate-500 dark:text-slate-600">Chưa có tệp nào.</p>
        ) : (
          <ul className="space-y-1">
            {attachments.map((a) => {
              const Icon = fileIcon(a.fileType, a.fileName);
              return (
                <li key={a.id} className="group flex items-center gap-2 rounded-lg border border-slate-200 dark:border-white/[0.05] bg-slate-100 dark:bg-white/[0.02] px-2.5 py-2 min-h-[44px]">
                  <Icon className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-300/80" />
                  <a href={a.fileUrl} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1 truncate text-[13px] text-slate-800 dark:text-slate-200 hover:text-teal-700 dark:hover:text-teal-200" title={a.fileName}>
                    {a.fileName}
                  </a>
                  <span className="shrink-0 text-[10px] tabular-nums text-slate-500 dark:text-slate-500">{fmtSize(a.fileSizeBytes)}</span>
                  <button onClick={async () => { await notesApi.deleteAttachment(a.id); onChanged(); }} className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-slate-500 dark:text-slate-500 dark:text-slate-600 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100" aria-label="Xoá tệp">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Links */}
      <section>
        <h3 className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">
          <LinkIcon className="h-3.5 w-3.5" /> Liên kết
        </h3>

        {/* Add link */}
        <div className="mb-2 space-y-1.5 rounded-lg border border-slate-200 dark:border-white/[0.05] bg-slate-100 dark:bg-white/[0.02] p-2">
          <input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Dán URL (YouTube tự nhúng được)"
            className="w-full rounded-md bg-slate-100 dark:bg-slate-800/60 px-2 py-1.5 text-[13px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500/40"
          />
          <div className="flex gap-1.5">
            <input
              value={linkLabel}
              onChange={(e) => setLinkLabel(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') void submitLink(); }}
              placeholder="Nhãn (tuỳ chọn)"
              className="min-w-0 flex-1 rounded-md bg-slate-100 dark:bg-slate-800/60 px-2 py-1.5 text-[13px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500/40"
            />
            <button onClick={submitLink} disabled={adding || !linkUrl.trim()} className="flex shrink-0 items-center gap-1 rounded-md bg-teal-100 dark:bg-teal-500/15 px-3 text-[12px] text-teal-700 dark:text-teal-200 hover:bg-teal-500/25 disabled:opacity-40 min-h-[36px]">
              {adding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Thêm'}
            </button>
          </div>
        </div>

        {links.length === 0 ? (
          <p className="px-1 text-[12px] text-slate-500 dark:text-slate-500 dark:text-slate-600">Chưa có liên kết nào.</p>
        ) : (
          <ul className="space-y-2">
            {links.map((l) => {
              const yt = l.type === 'YOUTUBE' ? youtubeId(l.url) : null;
              return (
                <li key={l.id} className="group rounded-lg border border-slate-200 dark:border-white/[0.05] bg-slate-100 dark:bg-white/[0.02] p-2">
                  <div className="flex items-center gap-2">
                    {yt ? <Youtube className="h-4 w-4 shrink-0 text-red-400" /> : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`https://www.google.com/s2/favicons?domain=${hostOf(l.url)}&sz=64`} alt="" className="h-4 w-4 shrink-0 rounded" loading="lazy" />
                    )}
                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1 truncate text-[13px] text-slate-800 dark:text-slate-200 hover:text-teal-700 dark:hover:text-teal-200" title={l.url}>
                      {l.label || hostOf(l.url)}
                    </a>
                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-slate-500 dark:text-slate-500 hover:text-teal-600 dark:hover:text-teal-300" aria-label="Mở liên kết"><ExternalLink className="h-3.5 w-3.5" /></a>
                    <button onClick={async () => { await notesApi.deleteLink(l.id); onChanged(); }} className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-slate-500 dark:text-slate-500 dark:text-slate-600 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100" aria-label="Xoá liên kết">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {yt && (
                    <div className="mt-2 aspect-video w-full overflow-hidden rounded-md">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${yt}`}
                        title={l.label || 'YouTube'}
                        loading="lazy"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="h-full w-full border-0"
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
