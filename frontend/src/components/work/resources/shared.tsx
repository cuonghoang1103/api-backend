'use client';

/**
 * CT Work — Resources (06/10/2026): mảnh dùng chung — biểu tượng theo loại link, favicon, hộp thêm/sửa link
 * (dán URL ⇒ backend tự điền tiêu đề từ <title>/OpenGraph, có chặn SSRF).
 */

import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Box, Calendar, Code2, Figma, FileSpreadsheet, FileText, Film, FolderOpen, Github, Gitlab, Globe, Image as ImageIcon, Link2, Mail,
  Music, Package, Presentation, StickyNote, Video, type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { KIND_LABEL, resApi, type ResourceGroup, type ResourceInput, type ResourceVisibility, type UrlPreview, type WorkResource } from '@/lib/work-resources-api';
import { Dialog, Field, Spinner } from '../ui';
import { Select } from '../settings/shared';

const KIND_ICON: Record<string, LucideIcon> = {
  github: Github, gitlab: Gitlab, bitbucket: Code2, figma: Figma, gdrive: FolderOpen, gdocs: FileText, gsheets: FileSpreadsheet, gslides: Presentation,
  youtube: Film, notion: StickyNote, unity: Box, freesound: Music, mixamo: Video, polyhaven: ImageIcon, sketchfab: Box, onedrive: FolderOpen,
  dropbox: FolderOpen, npm: Package, meet: Video, zoom: Video, calendar: Calendar, mail: Mail, link: Globe,
};

export function KindIcon({ kind, size = 14, className }: { kind: string; size?: number; className?: string }) {
  const I = KIND_ICON[kind] ?? Link2;
  return <I size={size} className={className} aria-hidden="true" />;
}

/** Favicon (URL Google s2 lưu sẵn) — hỏng/thiếu ⇒ biểu tượng theo loại. */
export function Favicon({ r, size = 18 }: { r: { faviconUrl: string | null; kind: string }; size?: number }) {
  const [bad, setBad] = useState(false);
  if (!r.faviconUrl || bad) {
    return (
      <span className="flex shrink-0 items-center justify-center rounded-[5px] bg-[var(--w-hover)] text-[var(--w-text-2)]" style={{ width: size + 6, height: size + 6 }}>
        <KindIcon kind={r.kind} size={size - 4} />
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={r.faviconUrl} alt="" width={size} height={size} loading="lazy" referrerPolicy="no-referrer" onError={() => setBad(true)}
      className="shrink-0 rounded-[4px]" style={{ width: size, height: size }} />
  );
}

export const kindLabel = (k: string) => KIND_LABEL[k] ?? 'Link';

/** "12k" cho số sao. */
export function compactNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
}

// ─── Hộp thêm / sửa ──────────────────────────────────────────────

interface FormState { url: string; title: string; description: string; tags: string; groupId: string; pinned: boolean; pinnedToSidebar: boolean; visibility: ResourceVisibility }

const blank = (groupId: number | null | undefined): FormState => ({
  url: '', title: '', description: '', tags: '', groupId: groupId ? String(groupId) : '', pinned: false, pinnedToSidebar: false, visibility: 'TEAM',
});

export function ResourceDialog({
  pid, open, onClose, groups, editing, defaultGroupId, clientPortal, onSaved,
}: {
  pid: number; open: boolean; onClose: () => void; groups: ResourceGroup[]; editing?: WorkResource | null; defaultGroupId?: number | null;
  /** Dự án bật cổng khách ⇒ hiện ô "Visible to the client". */
  clientPortal: boolean;
  onSaved: (r: WorkResource) => void;
}) {
  const [f, setF] = useState<FormState>(blank(defaultGroupId));
  const [preview, setPreview] = useState<UrlPreview | null>(null);
  const titleTouched = useRef(false);
  const descTouched = useRef(false);
  const lastPreviewed = useRef('');

  useEffect(() => {
    if (!open) return;
    titleTouched.current = !!editing;
    descTouched.current = !!editing;
    lastPreviewed.current = editing?.url ?? '';
    setPreview(null);
    setF(editing ? {
      url: editing.url, title: editing.title, description: editing.description ?? '', tags: editing.tags.join(', '),
      groupId: editing.groupId ? String(editing.groupId) : '', pinned: editing.pinned, pinnedToSidebar: editing.pinnedToSidebar, visibility: editing.visibility,
    } : blank(defaultGroupId));
  }, [open, editing, defaultGroupId]);

  const set = (p: Partial<FormState>) => setF((s) => ({ ...s, ...p }));

  const pv = useMutation({
    mutationFn: (url: string) => resApi.preview(pid, url),
    onSuccess: (p) => {
      setPreview(p);
      setF((s) => ({
        ...s,
        url: p.url,
        title: titleTouched.current && s.title ? s.title : p.title,
        description: descTouched.current && s.description ? s.description : (p.description ?? s.description),
      }));
    },
    onError: (e) => { setPreview(null); toast.error(workError(e)); },
  });

  const runPreview = (url: string) => {
    const u = url.trim();
    if (!u || u === lastPreviewed.current) return;
    lastPreviewed.current = u;
    pv.mutate(u);
  };

  const save = useMutation({
    mutationFn: () => {
      const body: ResourceInput & { url: string } = {
        url: f.url.trim(), title: f.title.trim() || null, description: f.description.trim() || null,
        tags: f.tags.split(/[,;]/).map((t) => t.trim()).filter(Boolean),
        groupId: f.groupId ? Number(f.groupId) : null, pinned: f.pinned, pinnedToSidebar: f.pinnedToSidebar,
        ...(clientPortal || editing?.visibility === 'CLIENT' ? { visibility: f.visibility } : {}),
      };
      return editing ? resApi.update(pid, editing.id, body) : resApi.create(pid, body);
    },
    onSuccess: (r) => { toast.success(editing ? 'Link updated' : 'Link added'); onSaved(r); onClose(); },
    onError: (e) => toast.error(workError(e)),
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={editing ? 'Edit link' : 'Add link'}
      width={560}
      footer={(
        <>
          <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="w-btn w-btn-primary" disabled={!f.url.trim() || save.isPending} onClick={() => save.mutate()} data-testid="resource-save">
            {save.isPending && <Spinner size={12} />}{editing ? 'Save' : 'Add link'}
          </button>
        </>
      )}
    >
      <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); if (f.url.trim()) save.mutate(); }}>
        <Field label="URL" hint="Paste a link — the title fills in by itself. http(s) or mailto.">
          <div className="relative">
            <input
              className="w-input pr-8" value={f.url} autoFocus={!editing} maxLength={2100} placeholder="https://github.com/your-team/repo"
              onChange={(e) => set({ url: e.target.value })}
              onPaste={(e) => { const t = e.clipboardData.getData('text'); if (t) setTimeout(() => runPreview(t), 0); }}
              onBlur={(e) => runPreview(e.target.value)}
              data-testid="resource-url"
            />
            {pv.isPending && <span className="absolute right-2 top-1/2 -translate-y-1/2"><Spinner size={13} /></span>}
          </div>
        </Field>
        {preview?.duplicateOf && (!editing || preview.duplicateOf.id !== editing.id) && (
          <p className="rounded-[6px] bg-[var(--w-hover)] px-3 py-2 text-[12.5px] text-[var(--w-text-2)]">Already in Resources as “{preview.duplicateOf.title}”.</p>
        )}
        {preview?.github && (
          <p className="text-[12.5px] text-[var(--w-text-2)]">★ {compactNumber(preview.github.stars)} · {preview.github.defaultBranch ?? 'main'}{preview.github.language ? ` · ${preview.github.language}` : ''}</p>
        )}
        <Field label="Title">
          <input className="w-input" value={f.title} maxLength={200} onChange={(e) => { titleTouched.current = true; set({ title: e.target.value }); }} placeholder="Filled in from the page" data-testid="resource-title" />
        </Field>
        <Field label="Description">
          <textarea className="w-input" rows={2} maxLength={4000} value={f.description} onChange={(e) => { descTouched.current = true; set({ description: e.target.value }); }} />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Group">
            <Select value={f.groupId} onChange={(e) => set({ groupId: e.target.value })}>
              <option value="">Ungrouped</option>
              {groups.map((g) => <option key={g.id} value={g.id}>{g.icon ? `${g.icon} ` : ''}{g.name}</option>)}
            </Select>
          </Field>
          <Field label="Tags" hint="Comma separated">
            <input className="w-input" value={f.tags} onChange={(e) => set({ tags: e.target.value })} placeholder="frontend, sfx" />
          </Field>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-[13px]">
          <label className="flex items-center gap-2"><input type="checkbox" checked={f.pinned} onChange={(e) => set({ pinned: e.target.checked })} /> Star (show at the top)</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={f.pinnedToSidebar} onChange={(e) => set({ pinnedToSidebar: e.target.checked })} /> Pin to project sidebar</label>
          {(clientPortal || editing?.visibility === 'CLIENT') && (
            <label className="flex items-center gap-2"><input type="checkbox" checked={f.visibility === 'CLIENT'} onChange={(e) => set({ visibility: e.target.checked ? 'CLIENT' : 'TEAM' })} /> Visible to the client</label>
          )}
        </div>
        <button type="submit" hidden />
      </form>
    </Dialog>
  );
}

/** Ô chọn màu nhỏ cho nhóm. */
export const GROUP_COLORS = ['#2563eb', '#0891b2', '#db2777', '#7c3aed', '#ea580c', '#65a30d', '#0d9488', '#ca8a04', '#dc2626', '#64748b'];

export function GroupDialog({ open, onClose, initial, onSubmit, pending }: {
  open: boolean; onClose: () => void; initial?: { name: string; icon: string | null; color: string | null } | null; pending?: boolean;
  onSubmit: (v: { name: string; icon: string | null; color: string | null }) => void;
}) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [color, setColor] = useState<string | null>(null);
  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? '');
    setIcon(initial?.icon ?? '');
    setColor(initial?.color ?? null);
  }, [open, initial]);
  return (
    <Dialog open={open} onClose={onClose} title={initial ? 'Edit group' : 'New group'} width={420}
      footer={(
        <>
          <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="w-btn w-btn-primary" disabled={!name.trim() || pending} onClick={() => onSubmit({ name: name.trim(), icon: icon.trim() || null, color })}>{pending && <Spinner size={12} />}{initial ? 'Save' : 'Create group'}</button>
        </>
      )}
    >
      <div className="space-y-3">
        <div className="grid grid-cols-[72px_1fr] gap-3">
          <Field label="Icon"><input className="w-input text-center" value={icon} maxLength={8} onChange={(e) => setIcon(e.target.value)} placeholder="🎧" /></Field>
          <Field label="Name"><input className="w-input" value={name} maxLength={80} autoFocus onChange={(e) => setName(e.target.value)} placeholder="Audio" /></Field>
        </div>
        <Field label="Colour">
          <div className="flex flex-wrap gap-1.5">
            {GROUP_COLORS.map((c) => (
              <button key={c} type="button" aria-label={c} aria-pressed={color === c} onClick={() => setColor(color === c ? null : c)}
                className={cn('h-6 w-6 rounded-full border-2', color === c ? 'border-[var(--w-text)]' : 'border-transparent')} style={{ background: c }} />
            ))}
          </div>
        </Field>
      </div>
    </Dialog>
  );
}
