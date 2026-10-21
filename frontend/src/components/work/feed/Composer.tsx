'use client';

/**
 * Ô soạn bài bảng tin: chọn nơi đăng (không gian / dự án mình đăng được) · chữ Markdown có gợi ý @nhắc · ảnh/video/tệp
 * (chọn, kéo-thả, dán ảnh; % tải; mô tả ảnh ALT; bỏ) · bình chọn 2–6 lựa chọn · xem trước link (máy chủ tải, chặn SSRF) ·
 * `clientKey` chống đăng trùng khi mạng chập chờn.
 *
 * Tải tệp: ảnh luôn qua backend (máy chủ làm thumbnail, bỏ EXIF/GPS). Video/tệp: URL ký sẵn PUT thẳng R2 (≤ 200/100 MB);
 * PUT hỏng (app desktop: CSP) mà tệp ≤ 25 MB ⇒ lùi về qua backend. Video: client trích khung hình làm poster + đo kích
 * thước/thời lượng.
 */

import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { BarChart3, ChevronDown, Film, Globe2, ImagePlus, Paperclip, Plus, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import {
  FEED_BODY_MAX, FEED_DIRECT_MAX, FEED_FILE_MAX, FEED_IMAGE_MAX, FEED_MAX_FILES, FEED_MAX_MEDIA, FEED_VIDEO_MAX, feedApi, putSigned,
  type FeedAttachment, type FeedLinkPreview, type FeedScope,
} from '@/lib/work-feed-api';
import { useAuthStore } from '@/store/authStore';
import { Dialog, Popover, ProjectMark, Spinner, UserAvatar } from '@/components/work/ui';
import { wt } from '@/components/work/i18n';
import { mb } from './feedCache';
import { MentionTextarea, type MentionTextareaHandle } from './MentionTextarea';
import { LinkCard } from './PostParts';

export interface Audience { workspaceId: number; projectId: number | null; label: string; sub: string; projectKey?: string }

export function audiencesOf(scopes: FeedScope[]): Audience[] {
  const out: Audience[] = [];
  for (const s of scopes) {
    if (s.canPost) out.push({ workspaceId: s.workspace.id, projectId: null, label: wt('feed.everyoneIn', { name: s.workspace.name }), sub: s.workspace.name });
    for (const p of s.projects) if (p.canPost) out.push({ workspaceId: s.workspace.id, projectId: p.id, label: wt('feed.projectTeam', { name: p.name }), sub: s.workspace.name, projectKey: p.key });
  }
  return out;
}

interface Draft {
  key: string; file: File; kind: 'IMAGE' | 'VIDEO' | 'FILE'; preview: string | null; pct: number; att?: FeedAttachment; error?: string; alt: string;
}

const isImage = (f: File) => /^image\/(jpeg|png|webp|gif)$/.test(f.type);
const isVideo = (f: File) => /^video\//.test(f.type) || /\.(mp4|mov|webm|m4v)$/i.test(f.name);
const newKey = () => `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

/** Kích thước + thời lượng + khung hình (JPEG) của video cục bộ. Hỏng/quá 8 s ⇒ null. */
function videoMeta(file: File): Promise<{ width: number; height: number; durationMs: number; poster: Blob | null } | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement('video');
    v.preload = 'metadata';
    v.muted = true;
    v.playsInline = true;
    let done = false;
    const finish = (r: Awaited<ReturnType<typeof videoMeta>>) => { if (done) return; done = true; URL.revokeObjectURL(url); resolve(r); };
    const t = setTimeout(() => finish(null), 8000);
    v.onerror = () => { clearTimeout(t); finish(null); };
    v.onloadedmetadata = () => { v.currentTime = Math.min(1, (v.duration || 0) / 3); };
    v.onseeked = () => {
      clearTimeout(t);
      const w = v.videoWidth;
      const h = v.videoHeight;
      const base = { width: w, height: h, durationMs: Math.round((v.duration || 0) * 1000) };
      try {
        const scale = Math.min(1, 1280 / Math.max(w, h, 1));
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(w * scale));
        c.height = Math.max(1, Math.round(h * scale));
        c.getContext('2d')?.drawImage(v, 0, 0, c.width, c.height);
        c.toBlob((b) => finish({ ...base, poster: b }), 'image/jpeg', 0.82);
      } catch {
        finish({ ...base, poster: null });
      }
    };
    v.src = url;
  });
}

async function uploadOne(workspaceId: number, d: Draft, onPct: (n: number) => void): Promise<FeedAttachment> {
  const f = d.file;
  if (d.kind === 'IMAGE') return feedApi.upload(workspaceId, f, onPct, d.alt || undefined);
  const meta = d.kind === 'VIDEO' ? await videoMeta(f) : null;
  let att: FeedAttachment;
  try {
    const ps = await feedApi.presign({ workspaceId, fileName: f.name || 'file', mime: f.type || 'application/octet-stream', size: f.size, kind: d.kind === 'VIDEO' ? 'VIDEO' : 'FILE' });
    await putSigned(ps.uploadUrl, f, ps.headers, onPct);
    att = await feedApi.complete(ps.attachment.id, meta ? { width: meta.width, height: meta.height, durationMs: meta.durationMs } : {});
  } catch (err) {
    // App desktop chặn PUT thẳng R2 (CSP) ⇒ tệp nhỏ đi qua backend.
    if (f.size > FEED_DIRECT_MAX) throw err;
    att = await feedApi.upload(workspaceId, f, onPct);
  }
  if (meta?.poster) att = await feedApi.poster(att.id, meta.poster).catch(() => att);
  return att;
}

function AudiencePicker({ list, value, onChange, locked }: { list: Audience[]; value: Audience | null; onChange: (a: Audience) => void; locked?: boolean }) {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  if (!value) return null;
  const inner = (
    <>
      {value.projectKey ? <ProjectMark k={value.projectKey} size={14} /> : <Globe2 size={13} />}
      <span className="max-w-[220px] truncate">{value.label}</span>
      {!locked && list.length > 1 && <ChevronDown size={13} />}
    </>
  );
  if (locked || list.length <= 1) return <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-[var(--w-sunken)] px-2.5 text-[12.5px] font-medium text-[var(--w-text-2)]">{inner}</span>;
  return (
    <>
      <button ref={btn} type="button" aria-haspopup="listbox" aria-expanded={open} aria-label={`${wt('feed.postTo')}: ${value.label}`} onClick={() => setOpen((o) => !o)}
        className="inline-flex h-7 items-center gap-1.5 rounded-full bg-[var(--w-sunken)] px-2.5 text-[12.5px] font-medium text-[var(--w-text-2)] hover:bg-[var(--w-hover)]">
        {inner}
      </button>
      <Popover open={open} onClose={() => setOpen(false)} anchorRef={btn} width={300}>
        <div className="p-1">
          <div className="w-eyebrow px-2 pb-1 pt-1.5">{wt('feed.postTo')}</div>
          <ul role="listbox" className="max-h-[320px] overflow-y-auto">
            {list.map((a) => {
              const on = a.workspaceId === value.workspaceId && a.projectId === value.projectId;
              return (
                <li key={`${a.workspaceId}:${a.projectId ?? 0}`} role="option" aria-selected={on}>
                  <button type="button" onClick={() => { onChange(a); setOpen(false); }} className={cn('flex w-full items-center gap-2 rounded-[6px] px-2 py-1.5 text-left text-[13px]', on ? 'bg-[var(--w-active)]' : 'hover:bg-[var(--w-hover)]')}>
                    {a.projectKey ? <ProjectMark k={a.projectKey} size={18} /> : <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[4px] bg-[var(--w-sunken)]"><Globe2 size={12} /></span>}
                    <span className="min-w-0 flex-1"><span className="block truncate font-medium">{a.label}</span><span className="block truncate text-[11.5px] text-[var(--w-text-3)]">{a.sub}</span></span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </Popover>
    </>
  );
}

export function Composer({ scopes, fixed, prefer, onPosted }: {
  scopes: FeedScope[];
  /** Trang dự án: khoá nơi đăng. */
  fixed?: { workspaceId: number; projectId: number | null } | null;
  /** Trang không gian: mặc định đăng lên không gian này. */
  prefer?: { workspaceId: number; projectId?: number | null } | null;
  onPosted: () => void;
}) {
  const qc = useQueryClient();
  const me = useAuthStore((s) => s.user);
  const list = useMemo(() => audiencesOf(scopes), [scopes]);
  const pickDefault = useCallback((): Audience | null => {
    const want = fixed ?? prefer;
    if (want) {
      const hit = list.find((a) => a.workspaceId === want.workspaceId && a.projectId === (want.projectId ?? null));
      if (hit) return hit;
      if (!fixed) return list.find((a) => a.workspaceId === want.workspaceId) ?? list[0] ?? null;
      return null;
    }
    return list[0] ?? null;
  }, [list, fixed, prefer]);
  const [aud, setAud] = useState<Audience | null>(null);
  useEffect(() => { setAud((cur) => (cur && list.some((a) => a.workspaceId === cur.workspaceId && a.projectId === cur.projectId) && !fixed ? cur : pickDefault())); }, [list, pickDefault, fixed]);

  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [poll, setPoll] = useState<{ options: string[]; multi: boolean; days: 0 | 1 | 3 | 7 } | null>(null);
  const [link, setLink] = useState<{ url: string; data: FeedLinkPreview | null; loading: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [altFor, setAltFor] = useState<Draft | null>(null);
  const [altText, setAltText] = useState('');
  const ta = useRef<MentionTextareaHandle>(null);
  const mediaInput = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const clientKey = useRef(newKey());

  // Xem trước link web đầu tiên (không phải /work/…): chờ người gõ ngừng 700 ms.
  useEffect(() => {
    const m = /https?:\/\/[^\s<>()]+/i.exec(text.replace(/```[\s\S]*?```/g, ' '));
    const url = m ? m[0].replace(/[.,;:!?'")\]]+$/, '') : null;
    if (!url || /\/work\//.test(new URL(url, 'https://x.invalid').pathname)) { setLink(null); return; }
    if (link?.url === url) return;
    const t = setTimeout(() => {
      setLink({ url, data: null, loading: true });
      feedApi.linkPreview(url).then((data) => setLink((cur) => (cur?.url === url ? { url, data, loading: false } : cur))).catch(() => setLink(null));
    }, 700);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const patch = (key: string, p: Partial<Draft>) => setDrafts((ds) => ds.map((d) => (d.key === key ? { ...d, ...p } : d)));
  const addFiles = useCallback((input: FileList | File[]) => {
    if (!aud) return;
    setOpen(true);
    const arr = Array.from(input);
    const mediaNow = drafts.filter((d) => d.kind !== 'FILE' && !d.error).length;
    const filesNow = drafts.filter((d) => d.kind === 'FILE' && !d.error).length;
    let m = mediaNow;
    let f = filesNow;
    const add: Draft[] = [];
    for (const file of arr) {
      const kind = isImage(file) ? 'IMAGE' : isVideo(file) ? 'VIDEO' : 'FILE';
      const max = kind === 'IMAGE' ? FEED_IMAGE_MAX : kind === 'VIDEO' ? FEED_VIDEO_MAX : FEED_FILE_MAX;
      if (file.size > max) { toast.error(wt('feed.fileTooBig', { name: file.name, size: mb(max) })); continue; }
      if (kind === 'FILE') { if (f >= FEED_MAX_FILES) { toast.error(wt('feed.tooManyFiles', { n: FEED_MAX_FILES })); continue; } f += 1; }
      else { if (m >= FEED_MAX_MEDIA) { toast.error(wt('feed.tooManyMedia', { n: FEED_MAX_MEDIA })); continue; } m += 1; }
      add.push({ key: newKey(), file, kind, preview: kind === 'IMAGE' || kind === 'VIDEO' ? URL.createObjectURL(file) : null, pct: 0, alt: '' });
    }
    if (!add.length) return;
    setDrafts((ds) => [...ds, ...add]);
    for (const d of add) {
      uploadOne(aud.workspaceId, d, (pct) => patch(d.key, { pct }))
        .then((att) => patch(d.key, { att, pct: 100 }))
        .catch((err) => { patch(d.key, { error: workError(err, wt('feed.uploadFailed')) }); toast.error(`${d.file.name}: ${workError(err, wt('feed.uploadFailed'))}`); });
    }
  }, [aud, drafts]);

  const removeDraft = (d: Draft) => {
    setDrafts((ds) => ds.filter((x) => x.key !== d.key));
    if (d.preview) URL.revokeObjectURL(d.preview);
    if (d.att) void feedApi.discard(d.att.id).catch(() => undefined);
  };
  const reset = () => {
    for (const d of drafts) if (d.preview) URL.revokeObjectURL(d.preview);
    setText(''); setDrafts([]); setPoll(null); setLink(null); setOpen(false);
    clientKey.current = newKey();
  };
  const discard = () => {
    for (const d of drafts) if (d.att) void feedApi.discard(d.att.id).catch(() => undefined);
    reset();
  };

  const uploading = drafts.some((d) => !d.att && !d.error);
  const ready = drafts.filter((d) => d.att && !d.error);
  const pollOk = !poll || poll.options.filter((o) => o.trim()).length >= 2;
  const canPost = !!aud && !busy && !uploading && pollOk && text.length <= FEED_BODY_MAX && (text.trim().length > 0 || ready.length > 0 || (!!poll && pollOk));

  const submit = async () => {
    if (!aud || !canPost) return;
    setBusy(true);
    try {
      // Đổi ALT trong lúc tải ⇒ ghi lại (ảnh đã tải xong trước khi gõ mô tả).
      await Promise.all(ready.filter((d) => d.kind === 'IMAGE' && (d.alt || null) !== (d.att!.alt ?? null)).map((d) => feedApi.setAlt(d.att!.id, d.alt || null).catch(() => undefined)));
      const closesAt = poll?.days ? new Date(Date.now() + poll.days * 86_400_000).toISOString() : null;
      await feedApi.create({
        workspaceId: aud.workspaceId, projectId: aud.projectId, body: text, attachmentIds: ready.map((d) => d.att!.id),
        poll: poll ? { options: poll.options.map((o) => o.trim()).filter(Boolean), multi: poll.multi, closesAt } : null,
        clientKey: clientKey.current,
      });
      reset();
      await qc.invalidateQueries({ queryKey: ['work', 'feed', 'list'] });
      onPosted();
    } catch (err) {
      toast.error(workError(err, wt('feed.postFailed')));
    } finally {
      setBusy(false);
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files);
  };

  if (!aud) return null;
  const meUser = me ? { id: Number(me.id), username: me.username ?? '', displayName: me.displayName ?? null, fullName: null, avatarUrl: me.avatarUrl ?? null } : null;
  const media = drafts.filter((d) => d.kind !== 'FILE');
  const files = drafts.filter((d) => d.kind === 'FILE');

  return (
    <section
      aria-label={wt('feed.startPost')}
      className={cn('w-card relative p-3.5 transition-colors', dragging && 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)]')}
      onDragOver={(e) => { if (e.dataTransfer?.types?.includes('Files')) { e.preventDefault(); setDragging(true); } }}
      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false); }}
      onDrop={onDrop}
      data-testid="feed-composer"
    >
      <div className="flex items-start gap-3">
        <UserAvatar user={meUser} size={40} className="shrink-0" />
        {!open ? (
          <button type="button" onClick={() => { setOpen(true); setTimeout(() => ta.current?.focus(), 0); }}
            className="flex h-10 min-w-0 flex-1 items-center rounded-full border border-[var(--w-border)] bg-[var(--w-sunken)] px-4 text-left text-[14px] text-[var(--w-text-3)] transition-colors hover:bg-[var(--w-hover)]">
            <span className="truncate">{wt('feed.startPost')}</span>
          </button>
        ) : (
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span className="text-[12px] text-[var(--w-text-3)]">{wt('feed.postTo')}</span>
              <AudiencePicker list={list} value={aud} onChange={setAud} locked={!!fixed} />
            </div>
            <MentionTextarea
              ref={ta}
              value={text}
              onChange={setText}
              scope={{ workspaceId: aud.workspaceId, projectId: aud.projectId }}
              ariaLabel={wt('feed.placeholder')}
              placeholder={wt('feed.placeholder')}
              minRows={3}
              maxRows={16}
              maxLength={FEED_BODY_MAX + 200}
              onSubmit={submit}
              onPasteFiles={(fs) => addFiles(fs)}
              onEscape={() => { if (!text && !drafts.length && !poll) setOpen(false); }}
              className="py-1 text-[15px]"
            />
            {text.length > FEED_BODY_MAX - 500 && <div className={cn('text-right text-[11.5px] tabular-nums', text.length > FEED_BODY_MAX ? 'text-[var(--w-red-text)]' : 'text-[var(--w-text-3)]')}>{wt('feed.charsLeft', { n: FEED_BODY_MAX - text.length })}</div>}
          </div>
        )}
      </div>

      {open && (
        <div className="mt-3 grid gap-3 sm:pl-[52px]">
          {media.length > 0 && (
            <ul className="grid grid-cols-3 gap-1.5 sm:grid-cols-4" aria-label={wt('feed.addMedia')}>
              {media.map((d) => (
                <li key={d.key} className="group relative aspect-square overflow-hidden rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)]">
                  {d.kind === 'IMAGE' && d.preview
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={d.preview} alt={d.alt} className="h-full w-full object-cover" />
                    : d.preview ? <video src={d.preview} muted playsInline className="h-full w-full object-cover" /> : null}
                  {d.kind === 'VIDEO' && <span className="absolute left-1.5 top-1.5 rounded-[4px] bg-black/60 p-0.5 text-white"><Film size={12} /></span>}
                  {!d.att && !d.error && (
                    <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/45 text-[11.5px] font-medium text-white" aria-live="polite">
                      <Spinner size={14} />{d.pct >= 100 ? wt('feed.processing') : wt('feed.uploadingN', { n: d.pct })}
                    </span>
                  )}
                  {d.error && <span className="absolute inset-0 flex items-center justify-center bg-[color-mix(in_srgb,var(--w-red)_70%,transparent)] p-2 text-center text-[11px] font-medium text-white">{wt('feed.uploadFailed')}</span>}
                  <button type="button" className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80" aria-label={wt('feed.removeX', { name: d.file.name })} onClick={() => removeDraft(d)}><X size={13} /></button>
                  {d.kind === 'IMAGE' && (
                    <button type="button" className={cn('absolute bottom-1 left-1 rounded-[4px] px-1.5 py-0.5 text-[10.5px] font-bold tracking-wide', d.alt ? 'bg-[var(--w-accent)] text-white' : 'bg-black/60 text-white hover:bg-black/80')}
                      aria-label={`${wt('feed.altText')}: ${d.file.name}`} onClick={() => { setAltFor(d); setAltText(d.alt); }}>
                      {wt('feed.addAlt')}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          {files.length > 0 && (
            <ul className="flex flex-wrap gap-1.5" aria-label={wt('feed.addFile')}>
              {files.map((d) => (
                <li key={d.key} className={cn('w-file-chip', d.error && 'w-file-chip-error')}>
                  <Paperclip size={13} className="shrink-0 text-[var(--w-text-3)]" aria-hidden="true" />
                  <span className="min-w-0 max-w-[220px] truncate">{d.file.name}</span>
                  {d.error ? <span className="shrink-0 text-[11px] text-[var(--w-red-text)]">{wt('feed.uploadFailed')}</span> : !d.att ? <span className="shrink-0 text-[11px] tabular-nums text-[var(--w-text-3)]">{d.pct}%</span> : <span className="shrink-0 text-[11px] text-[var(--w-text-3)]">{mb(d.file.size)}</span>}
                  <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm h-5 w-5" aria-label={wt('feed.removeX', { name: d.file.name })} onClick={() => removeDraft(d)}><X size={11} /></button>
                </li>
              ))}
            </ul>
          )}
          {poll && (
            <div className="rounded-[10px] border border-[var(--w-border)] p-3">
              <p className="mb-2 text-[12px] text-[var(--w-text-3)]">{wt('feed.pollHint')}</p>
              <div className="grid gap-1.5">
                {poll.options.map((o, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <input className="w-input h-9 flex-1" maxLength={120} value={o} placeholder={wt('feed.pollOption', { n: i + 1 })} aria-label={wt('feed.pollOption', { n: i + 1 })}
                      onChange={(e) => setPoll((p) => p && { ...p, options: p.options.map((x, k) => (k === i ? e.target.value : x)) })} />
                    {poll.options.length > 2 && <button type="button" className="w-btn w-btn-ghost w-btn-icon" aria-label={wt('feed.removeX', { name: wt('feed.pollOption', { n: i + 1 }) })} onClick={() => setPoll((p) => p && { ...p, options: p.options.filter((_, k) => k !== i) })}><X size={14} /></button>}
                  </div>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px]">
                {poll.options.length < 6 && <button type="button" className="inline-flex items-center gap-1 font-medium text-[var(--w-accent-text)] hover:underline" onClick={() => setPoll((p) => p && { ...p, options: [...p.options, ''] })}><Plus size={14} />{wt('feed.pollAddOption')}</button>}
                <label className="inline-flex items-center gap-1.5"><input type="checkbox" checked={poll.multi} onChange={(e) => setPoll((p) => p && { ...p, multi: e.target.checked })} className="accent-[var(--w-accent)]" />{wt('feed.pollMulti')}</label>
                <label className="inline-flex items-center gap-1.5">{wt('feed.pollCloses')}
                  <select className="w-input h-8 py-0" value={poll.days} onChange={(e) => setPoll((p) => p && { ...p, days: Number(e.target.value) as 0 | 1 | 3 | 7 })}>
                    <option value={0}>{wt('feed.pollNever')}</option><option value={1}>{wt('feed.poll1d')}</option><option value={3}>{wt('feed.poll3d')}</option><option value={7}>{wt('feed.poll7d')}</option>
                  </select>
                </label>
                <button type="button" className="ml-auto inline-flex items-center gap-1 text-[var(--w-text-3)] hover:text-[var(--w-red-text)]" onClick={() => setPoll(null)}><Trash2 size={13} />{wt('feed.removePoll')}</button>
              </div>
            </div>
          )}
          {link && (link.loading ? <p className="text-[12.5px] text-[var(--w-text-3)]">{wt('feed.linkPreviewLoading')}</p> : link.data ? <div className="-mx-4"><LinkCard p={link.data} /></div> : null)}
          <p className="text-[12px] text-[var(--w-text-3)]">{wt('feed.issueHint')}</p>
        </div>
      )}

      <div className={cn('mt-3 flex flex-wrap items-center gap-1 border-t border-[var(--w-border)] pt-2.5', !open && 'mt-3')}>
        <button type="button" className="w-btn w-btn-ghost h-8 gap-1.5 px-2.5 text-[13px]" onClick={() => mediaInput.current?.click()}>
          <ImagePlus size={16} className="text-[var(--w-green-text)]" /> <span>{wt('feed.addMedia')}</span>
        </button>
        <button type="button" className="w-btn w-btn-ghost h-8 gap-1.5 px-2.5 text-[13px]" onClick={() => fileInput.current?.click()}>
          <Paperclip size={16} className="text-[var(--w-blue-text)]" /> <span>{wt('feed.addFile')}</span>
        </button>
        <button type="button" className="w-btn w-btn-ghost h-8 gap-1.5 px-2.5 text-[13px]" aria-pressed={!!poll} onClick={() => { setOpen(true); setPoll((p) => p ?? { options: ['', ''], multi: false, days: 0 }); }}>
          <BarChart3 size={16} className="text-[var(--w-orange-text)]" /> <span>{wt('feed.addPoll')}</span>
        </button>
        <input ref={mediaInput} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm" className="hidden" onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ''; }} />
        <input ref={fileInput} type="file" multiple className="hidden" onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ''; }} />
        {open && (
          <div className="ml-auto flex items-center gap-1.5">
            <button type="button" className="w-btn w-btn-ghost h-8 text-[13px]" onClick={discard}>{wt('feed.discardDraft')}</button>
            <button type="button" className="w-btn w-btn-primary h-8 min-w-[84px] gap-1.5 text-[13px]" disabled={!canPost} onClick={submit} data-testid="feed-post-submit">
              {busy || uploading ? <Spinner size={12} /> : null}{busy ? wt('feed.posting') : wt('feed.post')}
            </button>
          </div>
        )}
      </div>
      {dragging && <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[inherit] text-[14px] font-medium text-[var(--w-accent-text)]">{wt('feed.dropHere')}</div>}

      <Dialog open={!!altFor} onClose={() => setAltFor(null)} title={wt('feed.altTitle')} width={440}
        footer={<><button type="button" className="w-btn" onClick={() => setAltFor(null)}>{wt('feed.cancel')}</button><button type="button" className="w-btn w-btn-primary" onClick={() => { if (altFor) patch(altFor.key, { alt: altText.trim() }); setAltFor(null); }}>{wt('feed.saveChanges')}</button></>}>
        {altFor?.preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={altFor.preview} alt="" className="mb-3 max-h-[220px] w-full rounded-[8px] object-contain" />
        )}
        <p className="mb-2 text-[13px] text-[var(--w-text-2)]">{wt('feed.altBody')}</p>
        <textarea className="w-input min-h-[72px] w-full py-2" maxLength={300} value={altText} placeholder={wt('feed.altPlaceholder')} aria-label={wt('feed.altText')} onChange={(e) => setAltText(e.target.value)} />
      </Dialog>
    </section>
  );
}
