'use client';

/**
 * UX-D (09/10/2026) — Project settings → Details → "Cover image".
 * Thư viện 29 ảnh bìa tự dựng (4 nhóm) + tải ảnh riêng (PNG/JPEG/WebP ≤ 8 MB, máy chủ nén lại JPEG) + chọn điểm lấy
 * nét dọc bằng cách KÉO ảnh xem trước (hoặc thanh trượt — dùng được bằng bàn phím). Chỉ ADMIN dự án đổi được.
 * Bìa hiện ở: thẻ dự án, dải đầu trang dự án, cổng khách, ảnh xem trước link mời/link công khai, thư mời.
 */

import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Check, ImagePlus, Trash2 } from 'lucide-react';
import type { ProjectConfig } from '@/lib/work-api';
import { workError } from '@/lib/work-api';
import { COVERS, COVER_GROUPS, coverSrc, type CoverGroup } from '@/lib/work-covers';
import { COVER_IMAGE_TYPES, workCoverApi } from '@/lib/work-uxd-api';
import { cn } from '@/lib/utils';
import { ProjectMark, Spinner } from '../ui';
import ProjectCover from '../cover/ProjectCover';
import { Section } from './shared';
import { useProjectInvalidate } from './useProjectInvalidate';

export function ProjectCoverPicker({ config, slug }: { config: ProjectConfig; slug: string }) {
  const invalidate = useProjectInvalidate(config.id, slug);
  const qc = useQueryClient();
  const canEdit = config.permissions.settings;
  const [y, setY] = useState(config.coverPositionY ?? 50);
  const [group, setGroup] = useState<CoverGroup>(() => (COVERS.find((c) => `preset:${c.id}` === config.coverUrl)?.group ?? 'professional'));
  useEffect(() => setY(config.coverPositionY ?? 50), [config.coverPositionY, config.coverUrl]);
  const after = (msg?: string) => { if (msg) toast.success(msg); invalidate(); void qc.invalidateQueries({ queryKey: ['work'] }); };

  const pick = useMutation({ mutationFn: (preset: string | null) => workCoverApi.setCover(config.id, { preset }), onSuccess: (_d, p) => after(p ? 'Cover updated' : 'Cover removed'), onError: (e) => toast.error(workError(e, 'Could not change the cover')) });
  const move = useMutation({ mutationFn: (positionY: number) => workCoverApi.setCover(config.id, { positionY }), onSuccess: () => after(), onError: (e) => toast.error(workError(e, 'Could not move the cover')) });
  const upload = useMutation({ mutationFn: (f: File) => workCoverApi.uploadCover(config.id, f, 50), onSuccess: () => after('Cover uploaded'), onError: (e) => toast.error(workError(e, 'Could not upload the cover')) });
  const fileRef = useRef<HTMLInputElement>(null);

  // Kéo dọc trên ảnh xem trước ⇒ đổi điểm lấy nét (kéo xuống = thấy phần trên của ảnh, như Notion).
  const drag = useRef<{ startY: number; startPos: number; h: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canEdit || !config.coverUrl) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { startY: e.clientY, startPos: y, h: e.currentTarget.getBoundingClientRect().height };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current; if (!d) return;
    setY(Math.max(0, Math.min(100, Math.round(d.startPos - ((e.clientY - d.startY) / d.h) * 100))));
  };
  const onPointerUp = () => { if (drag.current && y !== (config.coverPositionY ?? 50)) move.mutate(y); drag.current = null; };

  const busy = pick.isPending || upload.isPending;
  const brand = { key: config.key, coverUrl: config.coverUrl, coverPositionY: y, color: config.color };
  const uploaded = !!config.coverUrl && !config.coverUrl.startsWith('preset:');

  return (
    <Section title="Cover image" description="Shown on the project card, at the top of project pages, in the client portal, and in link previews for invitations and public links.">
      <div className="flex max-w-[720px] flex-col gap-4" data-testid="project-cover-picker">
        <div
          className={cn('relative h-[132px] select-none overflow-hidden rounded-[10px] border border-[var(--w-border)]', canEdit && config.coverUrl && 'cursor-ns-resize touch-none')}
          onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
        >
          <ProjectCover brand={brand} className="absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 flex items-end gap-2.5 bg-gradient-to-t from-black/55 to-transparent px-4 pb-3 pt-10">
            <ProjectMark k={config.key} size={32} letters={2} brand={config} />
            <span className="truncate text-[16px] font-semibold text-white drop-shadow">{config.name}</span>
          </div>
          {canEdit && config.coverUrl && <span className="absolute right-2 top-2 rounded-[6px] bg-black/55 px-2 py-0.5 text-[11px] text-white">Drag to reposition</span>}
          {busy && <div className="absolute inset-0 flex items-center justify-center bg-black/25"><Spinner size={18} /></div>}
        </div>

        {canEdit ? (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <input ref={fileRef} type="file" accept={COVER_IMAGE_TYPES.join(',')} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) upload.mutate(f); }} />
              <button type="button" className="w-btn w-btn-sm" disabled={busy} onClick={() => fileRef.current?.click()} data-testid="project-cover-upload"><ImagePlus size={13} /> Upload image</button>
              {config.coverUrl && <button type="button" className="w-btn w-btn-sm w-btn-ghost" disabled={busy} onClick={() => pick.mutate(null)}><Trash2 size={13} /> Remove cover</button>}
              {config.coverUrl && (
                <label className="ml-auto flex items-center gap-2 text-[12px] text-[var(--w-text-2)]">
                  Vertical position
                  <input type="range" min={0} max={100} value={y} onChange={(e) => setY(Number(e.target.value))} onPointerUp={() => move.mutate(y)} onKeyUp={() => move.mutate(y)} className="w-28 accent-[var(--w-accent)]" aria-valuetext={`${y}%`} />
                </label>
              )}
              <p className="basis-full text-[12px] text-[var(--w-text-3)]">PNG, JPEG or WebP up to 8 MB. Wide images (about 1600 × 640) look best{uploaded ? ' — you are using your own image' : ''}.</p>
            </div>
            <div>
              <div role="tablist" aria-label="Cover collections" className="mb-2 flex flex-wrap gap-1">
                {COVER_GROUPS.map((g) => (
                  <button key={g.key} type="button" role="tab" aria-selected={group === g.key} onClick={() => setGroup(g.key)}
                    className={cn('rounded-[6px] px-2.5 py-1 text-[12px] font-medium', group === g.key ? 'bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}>
                    {g.label}
                  </button>
                ))}
              </div>
              <div role="tabpanel" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {COVERS.filter((c) => c.group === group).map((c) => {
                  const on = config.coverUrl === `preset:${c.id}`;
                  return (
                    <button key={c.id} type="button" disabled={busy} onClick={() => pick.mutate(c.id)} aria-pressed={on} aria-label={`${c.label} cover`}
                      className={cn('group relative h-[58px] overflow-hidden rounded-[8px] border-2 transition-colors', on ? 'border-[var(--w-accent)]' : 'border-transparent hover:border-[var(--w-border-strong,var(--w-border))]')}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={coverSrc(`preset:${c.id}`)!} alt="" className="h-full w-full object-cover" loading="lazy" />
                      <span className="absolute bottom-0.5 left-1 rounded-[4px] bg-black/50 px-1 text-[10px] text-white">{c.label}</span>
                      {on && <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--w-accent)] text-white"><Check size={11} /></span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <p className="text-[12px] text-[var(--w-text-3)]">Only project admins can change the cover.</p>
        )}
      </div>
    </Section>
  );
}
