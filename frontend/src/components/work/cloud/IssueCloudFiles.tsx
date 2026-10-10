'use client';

/**
 * CT Work đợt 8a — "Tệp đám mây" trong chi tiết thẻ (tab Links): tệp OneDrive/SharePoint hoặc Google Drive gắn vào thẻ
 * DƯỚI DẠNG LIÊN KẾT (tên, biểu tượng theo loại, người sửa cuối) + xem trước nhúng.
 *   - Microsoft: hộp chọn tệp của CT Work (Gần đây / OneDrive của tôi / Được chia sẻ — gồm SharePoint / Tìm), gọi Graph
 *     bằng kết nối của chính người dùng.
 *   - Google: Google Picker (scope drive.file — app chỉ thấy tệp người dùng chọn).
 * Ẩn hẳn khi người xem là khách hoặc không có tệp nào mà cũng không kết nối/cấu hình được gì.
 */

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ChevronRight, Eye, File as FileIcon, FileImage, FileSpreadsheet, FileText, Folder, Presentation, Plus, Search, X } from 'lucide-react';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { c8aApi, c8aKeys, type BrowseItem, type CloudFileRow, type CloudProvider } from '@/lib/work-c8a-api';
import { Dialog, Popover, Spinner } from '../ui';
import { useWT } from '../i18n';
import { ProviderLogo } from './ProviderLogo';

export function IssueCloudFiles({ config, issueNumber }: { config: ProjectConfig; issueNumber: number }) {
  if (config.clientView) return null;
  return <Inner pid={config.id} num={issueNumber} />;
}

export function fileKindIcon(mime: string | null, name: string, size = 14) {
  const m = `${mime ?? ''} ${name.toLowerCase()}`;
  if (/spreadsheet|excel|\.xlsx?\b|\.csv\b/.test(m)) return <FileSpreadsheet size={size} className="shrink-0 text-[#1e7e45]" />;
  if (/presentation|powerpoint|\.pptx?\b/.test(m)) return <Presentation size={size} className="shrink-0 text-[#c4561d]" />;
  if (/image\//.test(m)) return <FileImage size={size} className="shrink-0 text-[var(--w-text-2)]" />;
  if (/document|word|pdf|text|\.docx?\b|\.pdf\b|\.md\b/.test(m)) return <FileText size={size} className="shrink-0 text-[#2b63c6]" />;
  return <FileIcon size={size} className="shrink-0 text-[var(--w-text-2)]" />;
}

function Inner({ pid, num }: { pid: number; num: number }) {
  const { t, fmtDateTime } = useWT();
  const qc = useQueryClient();
  const addRef = useRef<HTMLButtonElement>(null);
  const [menu, setMenu] = useState(false);
  const [msOpen, setMsOpen] = useState(false);
  const [preview, setPreview] = useState<{ name: string; url: string } | null>(null);
  const key = c8aKeys.files(pid, num);
  const q = useQuery({ queryKey: key, queryFn: () => c8aApi.files(pid, num), retry: false });
  const refresh = () => qc.invalidateQueries({ queryKey: key });
  const attach = useMutation({
    mutationFn: (b: { provider: CloudProvider; fileId: string; driveId?: string | null }) => c8aApi.attach(pid, num, b),
    onSuccess: () => { toast.success(t('c8a.fileAttached')); refresh(); setMsOpen(false); },
    onError: (e) => toast.error(workError(e)),
  });
  const remove = useMutation({ mutationFn: (id: number) => c8aApi.removeFile(pid, num, id), onSuccess: refresh, onError: (e) => toast.error(workError(e)) });
  const open = useMutation({
    mutationFn: (f: CloudFileRow) => c8aApi.preview(pid, f.id).then((r) => ({ r, f })),
    onSuccess: ({ r, f }) => {
      if (r.kind === 'iframe' && r.url) setPreview({ name: f.name, url: r.url });
      else window.open(r.webUrl, '_blank', 'noopener');
    },
    onError: (e) => toast.error(workError(e)),
  });
  const google = useMutation({
    mutationFn: async () => {
      const cfg = await c8aApi.googlePicker();
      const id = await openGooglePicker(cfg, t('c8a.pickerTitle'));
      if (id) await attach.mutateAsync({ provider: 'google', fileId: id });
    },
    onError: (e) => toast.error(e instanceof Error && e.message === 'picker-load' ? t('c8a.pickerLoadFailed') : workError(e)),
  });

  if (q.error || !q.data) return null;
  const { items, canEdit, providers } = q.data;
  const usable = providers.filter((p) => p.configured);
  if (!items.length && (!canEdit || !usable.length)) return null;
  const connected = usable.filter((p) => p.connected);

  return (
    <section data-testid="issue-cloud-files">
      <div className="mb-2 flex items-center gap-1">
        <h3 className="w-section-title">{t('c8a.cloudFiles')}</h3>
        {canEdit && usable.length > 0 && (
          <button ref={addRef} type="button" className="w-btn w-btn-ghost w-btn-sm ml-auto" onClick={() => setMenu(true)} disabled={attach.isPending || google.isPending}>
            {attach.isPending || google.isPending ? <Spinner size={12} /> : <Plus size={13} />} {t('c8a.attachFile')}
          </button>
        )}
      </div>
      {items.length ? (
        <ul className="overflow-hidden rounded-[6px] border border-[var(--w-border)]">
          {items.map((f) => (
            <li key={f.id} className="group flex min-w-0 items-center gap-2 border-b border-[var(--w-border)] px-2.5 py-1.5 last:border-b-0 hover:bg-[var(--w-hover)]">
              {fileKindIcon(f.mimeType, f.name)}
              <div className="min-w-0 flex-1">
                <a href={f.webUrl} target="_blank" rel="noopener noreferrer" className="block truncate text-[13px] hover:underline" title={f.name}>{f.name}</a>
                <div className="flex items-center gap-1 truncate text-[11.5px] text-[var(--w-text-3)]">
                  <ProviderLogo provider={f.provider} size={10} />
                  {f.lastModifiedBy ? t('c8a.modifiedBy', { who: f.lastModifiedBy, d: fmtDateTime(f.lastModifiedAt) }) : f.lastModifiedAt ? fmtDateTime(f.lastModifiedAt) : ''}
                </div>
              </div>
              <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('c8a.previewT', { t: f.name })} title={t('c8a.preview')} onClick={() => open.mutate(f)}><Eye size={13} /></button>
              {f.canRemove && (
                <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm opacity-0 focus:opacity-100 group-hover:opacity-100 max-md:opacity-100" aria-label={t('c8a.removeT', { t: f.name })} onClick={() => remove.mutate(f.id)}><X size={12} /></button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[12px] text-[var(--w-text-3)]">{t('c8a.noFiles')}</p>
      )}

      <Popover open={menu} onClose={() => setMenu(false)} anchorRef={addRef} width={280} align="end">
        <div className="p-1" role="menu">
          {usable.map((p) => (p.connected ? (
            <button key={p.id} role="menuitem" type="button" className="flex w-full items-center gap-2 rounded-[6px] px-2.5 py-2 text-left text-[13px] hover:bg-[var(--w-hover)]"
              onClick={() => { setMenu(false); if (p.id === 'microsoft') setMsOpen(true); else google.mutate(); }}>
              <ProviderLogo provider={p.id} size={14} /> {p.id === 'microsoft' ? t('c8a.fromOneDrive') : t('c8a.fromDrive')}
            </button>
          ) : (
            <Link key={p.id} role="menuitem" href="/work/connections" className="flex items-center gap-2 rounded-[6px] px-2.5 py-2 text-[13px] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]">
              <ProviderLogo provider={p.id} size={14} /> {t('c8a.connectFirst', { name: p.label })}
            </Link>
          )))}
          {!connected.length && <p className="px-2.5 pb-1.5 pt-1 text-[11.5px] text-[var(--w-text-3)]">{t('c8a.connectHint')}</p>}
        </div>
      </Popover>

      {msOpen && <MsPicker onClose={() => setMsOpen(false)} onPick={(f) => attach.mutate({ provider: 'microsoft', fileId: f.id, driveId: f.driveId })} busy={attach.isPending} />}

      <Dialog open={!!preview} onClose={() => setPreview(null)} title={preview?.name} width={1000}>
        {preview && (
          <iframe src={preview.url} title={t('c8a.previewT', { t: preview.name })} className="h-[70vh] w-full rounded-[6px] border border-[var(--w-border)] bg-white" referrerPolicy="no-referrer" allow="fullscreen" />
        )}
      </Dialog>
    </section>
  );
}

// ─── Hộp chọn tệp Microsoft (Graph, kết nối của chính người dùng) ───

type View = 'recent' | 'root' | 'shared' | 'search' | 'folder';

function MsPicker({ onClose, onPick, busy }: { onClose: () => void; onPick: (f: BrowseItem) => void; busy: boolean }) {
  const { t, fmtDateTime } = useWT();
  const [view, setView] = useState<View>('recent');
  const [crumbs, setCrumbs] = useState<Array<{ id: string; driveId: string | null; name: string }>>([]);
  const [q, setQ] = useState('');
  const [submitted, setSubmitted] = useState('');
  const folder = crumbs[crumbs.length - 1];
  const effView: View = view === 'search' ? 'search' : folder ? 'folder' : view;
  const list = useQuery({
    queryKey: c8aKeys.msFiles(effView, folder?.id ?? '', submitted),
    queryFn: () => c8aApi.msFiles({ view: effView, folderId: folder?.id, driveId: folder?.driveId, q: submitted }),
    enabled: effView !== 'search' || !!submitted,
    retry: false,
  });
  const tabs: Array<[View, string]> = [['recent', t('c8a.msRecent')], ['root', t('c8a.msMine')], ['shared', t('c8a.msShared')], ['search', t('c8a.msSearch')]];
  return (
    <Dialog open onClose={onClose} title={<span className="flex items-center gap-2"><ProviderLogo provider="microsoft" size={15} /> {t('c8a.msPickerTitle')}</span>} width={640}>
      <div className="mb-3 flex flex-wrap gap-1" role="tablist" aria-label={t('c8a.msPickerTitle')}>
        {tabs.map(([k, label]) => (
          <button key={k} type="button" role="tab" aria-selected={view === k} className={`w-btn w-btn-sm ${view === k ? 'w-btn-on' : 'w-btn-ghost'}`} onClick={() => { setView(k); setCrumbs([]); }}>{label}</button>
        ))}
      </div>
      {view === 'search' && (
        <form className="mb-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); setSubmitted(q.trim()); }}>
          <input className="w-input min-w-0 flex-1" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('c8a.msSearchPh')} aria-label={t('c8a.msSearch')} autoFocus />
          <button type="submit" className="w-btn"><Search size={13} /> {t('c8a.msSearch')}</button>
        </form>
      )}
      {crumbs.length > 0 && (
        <nav className="mb-2 flex flex-wrap items-center gap-1 text-[12.5px]" aria-label={t('c8a.msPath')}>
          <button type="button" className="text-[var(--w-accent-text)] hover:underline" onClick={() => setCrumbs([])}>{tabs.find(([k]) => k === view)?.[1]}</button>
          {crumbs.map((c, i) => (
            <span key={c.id} className="flex items-center gap-1"><ChevronRight size={12} className="text-[var(--w-text-3)]" />
              <button type="button" className="hover:underline" onClick={() => setCrumbs(crumbs.slice(0, i + 1))}>{c.name}</button>
            </span>
          ))}
        </nav>
      )}
      <div className="max-h-[50vh] min-h-[160px] overflow-y-auto rounded-[6px] border border-[var(--w-border)]">
        {list.isLoading && effView !== 'search' ? <div className="p-4"><Spinner size={14} /></div>
          : list.error ? <p className="p-3 text-[13px] text-[var(--w-red-text)]">{workError(list.error)}</p>
            : !(list.data?.items.length) ? <p className="p-3 text-[13px] text-[var(--w-text-3)]">{effView === 'search' && !submitted ? t('c8a.msSearchHint') : t('c8a.msEmpty')}</p>
              : (
                <ul>
                  {list.data.items.map((f) => (
                    <li key={`${f.driveId}:${f.id}`}>
                      <button type="button" disabled={busy} className="flex w-full min-w-0 items-center gap-2 border-b border-[var(--w-border)] px-3 py-2 text-left last:border-b-0 hover:bg-[var(--w-hover)] disabled:opacity-60"
                        onClick={() => (f.isFolder ? setCrumbs([...crumbs, { id: f.id, driveId: f.driveId, name: f.name }]) : onPick(f))}>
                        {f.isFolder ? <Folder size={14} className="shrink-0 text-[var(--w-text-2)]" /> : fileKindIcon(f.mimeType, f.name)}
                        <span className="min-w-0 flex-1 truncate text-[13px]">{f.name}</span>
                        <span className="hidden shrink-0 text-[11.5px] text-[var(--w-text-3)] sm:inline">{f.lastModifiedBy ?? ''}{f.lastModifiedAt ? ` · ${fmtDateTime(f.lastModifiedAt)}` : ''}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
      </div>
    </Dialog>
  );
}

// ─── Google Picker ───────────────────────────────────────────────

type PickerCfg = { accessToken: string; appId: string | null; apiKey: string | null };
let gapiPromise: Promise<void> | null = null;
function loadPicker(): Promise<void> {
  if (gapiPromise) return gapiPromise;
  gapiPromise = new Promise<void>((resolve, reject) => {
    const w = window as any;
    const done = () => w.gapi.load('picker', { callback: () => resolve(), onerror: () => reject(new Error('picker-load')) });
    if (w.gapi?.load) return done();
    const s = document.createElement('script');
    s.src = 'https://apis.google.com/js/api.js';
    s.async = true;
    s.onload = done;
    s.onerror = () => { gapiPromise = null; reject(new Error('picker-load')); };
    document.head.appendChild(s);
  });
  return gapiPromise;
}

/** Mở Google Picker; trả id tệp được chọn (null nếu huỷ). */
async function openGooglePicker(cfg: PickerCfg, title: string): Promise<string | null> {
  await loadPicker();
  const g = (window as any).google.picker;
  return new Promise((resolve) => {
    const view = new g.DocsView(g.ViewId.DOCS).setIncludeFolders(true).setSelectFolderEnabled(false);
    let b = new g.PickerBuilder().addView(view).addView(new g.DocsUploadView()).setOAuthToken(cfg.accessToken).setTitle(title)
      .setCallback((data: any) => {
        if (data.action === g.Action.PICKED) resolve(data.docs?.[0]?.id ?? null);
        else if (data.action === g.Action.CANCEL) resolve(null);
      });
    if (cfg.appId) b = b.setAppId(cfg.appId);
    if (cfg.apiKey) b = b.setDeveloperKey(cfg.apiKey);
    b.build().setVisible(true);
  });
}
