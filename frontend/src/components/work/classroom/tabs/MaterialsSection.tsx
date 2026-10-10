'use client';

/**
 * CTW đợt 9a — TÀI LIỆU LỚP trong tab Classwork: chủ đề / tuần ⊃ mục (slide, đề cương, tệp, link, video).
 *   GV/OWNER: thêm/sửa/xoá chủ đề + mục, kéo-thả (chuột) hoặc Alt+↑/↓ trên tay nắm (bàn phím) để sắp chủ đề và mục (kể cả
 *             kéo mục sang chủ đề khác), bản nháp, xem ai đã xem.
 *   SV:       mở tệp/link (tự đánh dấu đã xem) hoặc bấm "Đánh dấu đã xem".
 *   `&m=<id>` mở sẵn một mục (dòng Stream "tài liệu mới" trỏ về đây).
 * Mọi hook đặt TRƯỚC lệnh return sớm.
 */

import { useEffect, useMemo, useRef, useState, type DragEvent, type KeyboardEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  BookOpen, CheckCircle2, ChevronDown, ChevronRight, Eye, FileText, FolderPlus, GripVertical, Link2, Pencil, Plus, Presentation, ScrollText, Trash2, Video,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError, userName } from '@/lib/work-api';
import { Dialog, EmptyState, Field, PageLoading, Spinner } from '@/components/work/ui';
import { ConfirmDialog, Select } from '@/components/work/settings/shared';
import { useWT, type WKey } from '@/components/work/i18n';
import {
  MATERIAL_KINDS, classroomApi, classroomKeys, type ClassFile, type Material, type MaterialKind, type MaterialsView, type Topic,
} from '../classroomApi';
import type { ClassSlotProps } from '../slots/types';
import { AttachBar, FileChips, LinkCards } from './classShared';

const KIND_ICON: Record<MaterialKind, LucideIcon> = { SLIDE: Presentation, SYLLABUS: ScrollText, FILE: FileText, LINK: Link2, VIDEO: Video };
type Drag = { type: 'topic'; id: number } | { type: 'material'; id: number } | null;

// ─── Hộp thoại ──────────────────────────────────────────────────

function TopicDialog({ classId, topic, open, onClose }: { classId: number; topic: Topic | null; open: boolean; onClose: () => void }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const [title, setTitle] = useState('');
  const [week, setWeek] = useState('');
  useEffect(() => { if (open) { setTitle(topic?.title ?? ''); setWeek(topic?.week !== null && topic?.week !== undefined ? String(topic.week) : ''); } }, [open, topic]);
  const save = useMutation({
    mutationFn: () => {
      const b = { title: title.trim() || undefined, week: week ? Number(week) : null };
      return topic ? classroomApi.updateTopic(classId, topic.id, b) : classroomApi.createTopic(classId, b);
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: classroomKeys.materials(classId) }); onClose(); },
    onError: (err) => toast.error(workError(err)),
  });
  return (
    <Dialog open={open} onClose={onClose} title={topic ? t('c9a.editTopic') : t('c9a.addTopic')} width={440}
      footer={<>
        <button type="button" className="w-btn" onClick={onClose}>{t('c9a.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={(!title.trim() && !week) || save.isPending} onClick={() => save.mutate()}>{save.isPending && <Spinner size={13} />}{t('c9a.save')}</button>
      </>}>
      <div className="grid gap-x-3 sm:grid-cols-[110px_1fr]">
        <Field label={t('c9a.week')}><input className="w-input" type="number" min={0} max={60} value={week} onChange={(e) => setWeek(e.target.value)} /></Field>
        <Field label={t('c9a.topicTitle')} hint={t('c9a.topicTitleHint')}><input className="w-input" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} autoFocus /></Field>
      </div>
    </Dialog>
  );
}

function MaterialDialog({ classId, topics, material, defaultTopic, open, onClose }: {
  classId: number; topics: Topic[]; material: Material | null; defaultTopic: number | null; open: boolean; onClose: () => void;
}) {
  const { t } = useWT();
  const qc = useQueryClient();
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState<MaterialKind>('FILE');
  const [topicId, setTopicId] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<ClassFile[]>([]);
  const [links, setLinks] = useState<Array<{ url: string; title?: string }>>([]);
  const [draft, setDraft] = useState(false);
  useEffect(() => {
    if (!open) return;
    setTitle(material?.title ?? ''); setKind(material?.kind ?? 'FILE'); setTopicId(material ? material.topicId : defaultTopic);
    setDescription(material?.description ?? ''); setFiles(material?.files ?? []); setLinks(material?.links.map((l) => ({ url: l.url, title: l.title })) ?? []); setDraft(material?.draft ?? false);
  }, [open, material, defaultTopic]);
  const save = useMutation({
    mutationFn: () => {
      const keep = new Set(files.map((f) => f.id));
      const had = new Set(material?.files.map((f) => f.id) ?? []);
      const b = {
        title: title.trim(), kind, topicId, description: description.trim() || null, links, draft,
        fileIds: files.filter((f) => !had.has(f.id)).map((f) => f.id),
        removeFileIds: [...had].filter((id) => !keep.has(id)),
      };
      return material ? classroomApi.updateMaterial(classId, material.id, b) : classroomApi.createMaterial(classId, b);
    },
    onSuccess: () => { toast.success(t('c9a.saved')); void qc.invalidateQueries({ queryKey: classroomKeys.materials(classId) }); void qc.invalidateQueries({ queryKey: classroomKeys.stream(classId) }); onClose(); },
    onError: (err) => toast.error(workError(err)),
  });
  return (
    <Dialog open={open} onClose={onClose} title={material ? t('c9a.editMaterial') : t('c9a.addMaterial')} width={620}
      footer={<>
        <label className="mr-auto flex items-center gap-2 text-[13px]"><input type="checkbox" className="h-4 w-4 accent-[var(--w-accent)]" checked={draft} onChange={(e) => setDraft(e.target.checked)} />{t('c9a.saveAsDraft')}</label>
        <button type="button" className="w-btn" onClick={onClose}>{t('c9a.cancel')}</button>
        <button type="button" data-testid="c9a-material-save" className="w-btn w-btn-primary" disabled={!title.trim() || save.isPending} onClick={() => save.mutate()}>{save.isPending && <Spinner size={13} />}{draft ? t('c9a.save') : t('c9a.publish')}</button>
      </>}>
      <Field label={t('c9a.materialTitle')}><input className="w-input" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={255} autoFocus /></Field>
      <div className="grid gap-x-3 sm:grid-cols-2">
        <Field label={t('c9a.kind')}>
          <Select value={kind} onChange={(e) => setKind(e.target.value as MaterialKind)}>
            {MATERIAL_KINDS.map((k) => <option key={k} value={k}>{t(`c9a.kind_${k}` as WKey)}</option>)}
          </Select>
        </Field>
        <Field label={t('c9a.topic')}>
          <Select value={topicId ?? ''} onChange={(e) => setTopicId(e.target.value ? Number(e.target.value) : null)}>
            <option value="">{t('c9a.noTopic')}</option>
            {topics.map((tp) => <option key={tp.id} value={tp.id}>{tp.title}</option>)}
          </Select>
        </Field>
      </div>
      <Field label={t('c9a.description')}><textarea className="w-input min-h-[80px] py-2" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={5000} /></Field>
      <AttachBar classId={classId} files={files} setFiles={setFiles} links={links} setLinks={setLinks} />
    </Dialog>
  );
}

function ViewersDialog({ classId, material, onClose }: { classId: number; material: Material | null; onClose: () => void }) {
  const { t, fmtDateTime } = useWT();
  const q = useQuery({ queryKey: classroomKeys.viewers(classId, material?.id ?? 0), queryFn: () => classroomApi.viewers(classId, material!.id), enabled: !!material });
  return (
    <Dialog open={!!material} onClose={onClose} title={t('c9a.whoViewed', { title: material?.title ?? '' })} width={520}>
      {q.isLoading && <Spinner />}
      {q.data && (
        <>
          <p className="mb-2 text-[13px] text-[var(--w-text-2)]">{t('c9a.viewedOf', { n: q.data.viewed, total: q.data.total })}</p>
          <div className="max-h-[50vh] overflow-auto rounded-[8px] border border-[var(--w-border)]">
            <table className="w-full border-collapse text-[13px]">
              <thead className="sticky top-0 bg-[var(--w-panel)]">
                <tr className="border-b border-[var(--w-border)] text-left text-[12px] text-[var(--w-text-2)]">
                  <th scope="col" className="px-3 py-1.5 font-medium">{t('classroom.studentCode')}</th>
                  <th scope="col" className="px-3 py-1.5 font-medium">{t('classroom.fullName')}</th>
                  <th scope="col" className="px-3 py-1.5 font-medium">{t('c9a.viewedAt')}</th>
                </tr>
              </thead>
              <tbody>
                {q.data.rows.map((r) => (
                  <tr key={r.studentId} className="border-b border-[var(--w-border)] last:border-0">
                    <td className="px-3 py-1.5 tabular-nums">{r.studentCode ?? '—'}</td>
                    <td className="px-3 py-1.5">{r.fullName ?? (r.user ? userName(r.user) : '—')}</td>
                    <td className={cn('px-3 py-1.5', r.viewedAt ? 'text-[var(--w-green-text)]' : 'text-[var(--w-text-2)]')}>{r.viewedAt ? fmtDateTime(r.viewedAt) : t('c9a.notYet')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Dialog>
  );
}

// ─── Một mục ────────────────────────────────────────────────────

function MaterialRow({ m, classId, manage, students, open, onToggle, onEdit, onDelete, onViewers, drag }: {
  m: Material; classId: number; manage: boolean; students: number; open: boolean; onToggle: () => void; onEdit: () => void; onDelete: () => void; onViewers: () => void;
  drag: { onDragStart: (e: DragEvent) => void; onDragOver: (e: DragEvent) => void; onDrop: (e: DragEvent) => void; onKey: (e: KeyboardEvent) => void; dragging: boolean };
}) {
  const { t } = useWT();
  const qc = useQueryClient();
  const Icon = KIND_ICON[m.kind] ?? FileText;
  const viewed = useMutation({
    mutationFn: () => classroomApi.markViewed(classId, m.id),
    onSuccess: () => qc.setQueryData<MaterialsView>(classroomKeys.materials(classId), (old) => old && ({ ...old, materials: old.materials.map((x) => (x.id === m.id ? { ...x, viewed: true } : x)) })),
  });
  const markOnOpen = () => { if (!manage && !m.viewed) viewed.mutate(); };
  return (
    <li id={`material-${m.id}`} className={cn('bg-[var(--w-panel)]', drag.dragging && 'opacity-50')} draggable={manage} onDragStart={drag.onDragStart} onDragOver={drag.onDragOver} onDrop={drag.onDrop}>
      <div className="flex items-center gap-2 px-2.5 py-2">
        {manage && (
          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm cursor-grab" aria-label={t('c9a.moveMaterial', { title: m.title })} title={t('c9a.moveHint')} onKeyDown={drag.onKey}><GripVertical size={14} /></button>
        )}
        <button type="button" className="flex min-w-0 flex-1 items-center gap-2.5 text-left" aria-expanded={open} onClick={onToggle}>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--w-sunken)] text-[var(--w-accent)]"><Icon size={15} aria-hidden="true" /></span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13.5px] font-medium">{m.title}</span>
            <span className="block truncate text-[12px] text-[var(--w-text-2)]">
              {t(`c9a.kind_${m.kind}` as WKey)}
              {m.files.length > 0 && ` · ${t('c9a.filesN', { count: m.files.length })}`}
              {m.links.length > 0 && ` · ${t('c9a.linksN', { count: m.links.length })}`}
            </span>
          </span>
          {open ? <ChevronDown size={14} className="shrink-0 text-[var(--w-text-3)]" aria-hidden="true" /> : <ChevronRight size={14} className="shrink-0 text-[var(--w-text-3)]" aria-hidden="true" />}
        </button>
        {m.draft && <span className="shrink-0 rounded-[4px] bg-[var(--w-sunken)] px-1.5 py-0.5 text-[11px] font-medium text-[var(--w-text-2)]">{t('c9a.draft')}</span>}
        {manage ? (
          <button type="button" className="shrink-0 rounded-[6px] px-1.5 py-1 text-[12px] tabular-nums text-[var(--w-text-2)] hover:bg-[var(--w-hover)]" onClick={onViewers} aria-label={t('c9a.whoViewed', { title: m.title })}>
            <Eye size={12} className="mr-1 inline" aria-hidden="true" />{m.views ?? 0}/{students}{m.viewRate !== null && m.viewRate !== undefined ? ` · ${m.viewRate}%` : ''}
          </button>
        ) : m.viewed ? (
          <span className="inline-flex shrink-0 items-center gap-1 text-[12px] text-[var(--w-green-text)]"><CheckCircle2 size={13} aria-hidden="true" />{t('c9a.viewed')}</span>
        ) : (
          <button type="button" className="w-btn w-btn-sm shrink-0" disabled={viewed.isPending} onClick={() => viewed.mutate()}>{t('c9a.markViewed')}</button>
        )}
        {manage && (
          <>
            <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`${t('c9a.edit')} ${m.title}`} onClick={onEdit}><Pencil size={13} /></button>
            <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`${t('c9a.delete')} ${m.title}`} onClick={onDelete}><Trash2 size={13} /></button>
          </>
        )}
      </div>
      {open && (
        <div className="space-y-2.5 border-t border-[var(--w-border)] px-4 py-3">
          {m.description && <p className="whitespace-pre-wrap text-[13.5px]">{m.description}</p>}
          <LinkCards links={m.links} onOpen={markOnOpen} />
          <FileChips classId={classId} files={m.files} onOpen={markOnOpen} />
          {!m.description && !m.links.length && !m.files.length && <p className="text-[12.5px] text-[var(--w-text-2)]">{t('c9a.materialEmpty')}</p>}
        </div>
      )}
    </li>
  );
}

// ─── Phần tài liệu ──────────────────────────────────────────────

export default function MaterialsSection({ cls }: ClassSlotProps) {
  const { t } = useWT();
  const qc = useQueryClient();
  const search = useSearchParams();
  const focusId = Number(search?.get('m') ?? '') || null;
  const q = useQuery({ queryKey: classroomKeys.materials(cls.id), queryFn: () => classroomApi.materials(cls.id) });
  const [openIds, setOpenIds] = useState<Set<number>>(new Set());
  const [topicDlg, setTopicDlg] = useState<{ topic: Topic | null } | null>(null);
  const [matDlg, setMatDlg] = useState<{ material: Material | null; topicId: number | null } | null>(null);
  const [delMat, setDelMat] = useState<Material | null>(null);
  const [delTopic, setDelTopic] = useState<Topic | null>(null);
  const [viewers, setViewers] = useState<Material | null>(null);
  const drag = useRef<Drag>(null);
  const [draggingKey, setDraggingKey] = useState<string | null>(null);
  const scrolled = useRef(false);

  useEffect(() => {
    if (!focusId || !q.data || scrolled.current) return;
    if (!q.data.materials.some((m) => m.id === focusId)) return;
    scrolled.current = true;
    setOpenIds((s) => new Set(s).add(focusId));
    requestAnimationFrame(() => document.getElementById(`material-${focusId}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }));
  }, [focusId, q.data]);

  const sections = useMemo(() => {
    const d = q.data;
    if (!d) return [];
    const by = (tid: number | null) => d.materials.filter((m) => m.topicId === tid).sort((a, b) => a.position - b.position || a.id - b.id);
    const loose = by(null);
    return [...(loose.length ? [{ topic: null as Topic | null, items: loose }] : []), ...d.topics.map((tp) => ({ topic: tp as Topic | null, items: by(tp.id) }))];
  }, [q.data]);

  const reorderTopics = useMutation({
    mutationFn: (ids: number[]) => classroomApi.reorderTopics(cls.id, ids),
    onError: (err) => toast.error(workError(err)),
    onSettled: () => qc.invalidateQueries({ queryKey: classroomKeys.materials(cls.id) }),
  });
  const reorderMats = useMutation({
    mutationFn: (v: { topicId: number | null; ids: number[] }) => classroomApi.reorderMaterials(cls.id, v.topicId, v.ids),
    onError: (err) => toast.error(workError(err)),
    onSettled: () => qc.invalidateQueries({ queryKey: classroomKeys.materials(cls.id) }),
  });
  const delM = useMutation({ mutationFn: (id: number) => classroomApi.deleteMaterial(cls.id, id), onSuccess: () => { setDelMat(null); toast.success(t('c9a.deleted')); void qc.invalidateQueries({ queryKey: classroomKeys.materials(cls.id) }); void qc.invalidateQueries({ queryKey: classroomKeys.stream(cls.id) }); }, onError: (err) => toast.error(workError(err)) });
  const delT = useMutation({ mutationFn: (id: number) => classroomApi.deleteTopic(cls.id, id), onSuccess: () => { setDelTopic(null); void qc.invalidateQueries({ queryKey: classroomKeys.materials(cls.id) }); }, onError: (err) => toast.error(workError(err)) });

  /** Đặt cục bộ trước (kéo-thả mượt), máy chủ xác nhận sau. */
  const applyMaterials = (topicId: number | null, ids: number[]) => {
    qc.setQueryData<MaterialsView>(classroomKeys.materials(cls.id), (old) => old && ({
      ...old, materials: old.materials.map((m) => { const i = ids.indexOf(m.id); return i < 0 ? m : { ...m, topicId, position: i }; }),
    }));
    reorderMats.mutate({ topicId, ids });
  };
  const applyTopics = (ids: number[]) => {
    qc.setQueryData<MaterialsView>(classroomKeys.materials(cls.id), (old) => old && ({ ...old, topics: ids.map((id, i) => ({ ...old.topics.find((x) => x.id === id)!, position: i })) }));
    reorderTopics.mutate(ids);
  };
  const moveMaterial = (id: number, toTopic: number | null, beforeId: number | null) => {
    const sec = sections.find((s) => (s.topic?.id ?? null) === toTopic);
    const ids = (sec?.items ?? []).map((m) => m.id).filter((x) => x !== id);
    const at = beforeId !== null ? ids.indexOf(beforeId) : -1;
    ids.splice(at < 0 ? ids.length : at, 0, id);
    applyMaterials(toTopic, ids);
  };
  const topicIds = () => (q.data?.topics ?? []).map((x) => x.id);

  if (q.isLoading) return <PageLoading rows={3} />;
  if (q.error || !q.data) return <EmptyState title={workError(q.error)} />;
  const d = q.data;
  const manage = d.manage;

  const endDrag = () => { drag.current = null; setDraggingKey(null); };
  const allowDrop = (e: DragEvent) => { if (drag.current) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; } };

  return (
    <section aria-labelledby="c9a-materials-h" className="space-y-3" data-testid="c9a-materials" onDragEnd={endDrag}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 id="c9a-materials-h" className="flex items-center gap-1.5 text-[15px] font-semibold"><BookOpen size={16} aria-hidden="true" />{t('c9a.materials')}</h3>
        {manage && (
          <div className="flex gap-2">
            <button type="button" className="w-btn w-btn-sm" onClick={() => setTopicDlg({ topic: null })}><FolderPlus size={13} aria-hidden="true" /><span className="ml-1">{t('c9a.addTopic')}</span></button>
            <button type="button" data-testid="c9a-add-material" className="w-btn w-btn-sm w-btn-primary" onClick={() => setMatDlg({ material: null, topicId: d.topics[d.topics.length - 1]?.id ?? null })}><Plus size={13} aria-hidden="true" /><span className="ml-1">{t('c9a.addMaterial')}</span></button>
          </div>
        )}
      </div>
      {!sections.length && !d.topics.length && (
        <EmptyState icon={<BookOpen size={20} />} title={t('c9a.materialsEmpty')} body={manage ? t('c9a.materialsEmptyTeacher') : t('c9a.materialsEmptyStudent')} />
      )}
      {sections.map(({ topic, items }, si) => {
        const tid = topic?.id ?? null;
        const topicDrag = manage && topic ? {
          onDragStart: (e: DragEvent) => { drag.current = { type: 'topic', id: topic.id }; setDraggingKey(`t${topic.id}`); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', `topic:${topic.id}`); },
        } : {};
        const onDropTopic = (e: DragEvent) => {
          const dg = drag.current;
          if (!dg) return;
          e.preventDefault();
          if (dg.type === 'topic' && topic && dg.id !== topic.id) {
            const ids = topicIds().filter((x) => x !== dg.id);
            ids.splice(ids.indexOf(topic.id), 0, dg.id);
            applyTopics(ids);
          } else if (dg.type === 'material') moveMaterial(dg.id, tid, null);
          endDrag();
        };
        const keyTopic = (e: KeyboardEvent) => {
          if (!topic || !e.altKey || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
          e.preventDefault();
          const ids = topicIds();
          const i = ids.indexOf(topic.id);
          const j = e.key === 'ArrowUp' ? i - 1 : i + 1;
          if (j < 0 || j >= ids.length) return;
          [ids[i], ids[j]] = [ids[j], ids[i]];
          applyTopics(ids);
        };
        return (
          <div key={tid ?? 'none'} className={cn('min-w-0', draggingKey === `t${tid}` && 'opacity-50')} onDragOver={allowDrop} onDrop={onDropTopic}>
            <div className="mb-1.5 flex items-center gap-1.5 border-b border-[var(--w-border)] pb-1" draggable={manage && !!topic} {...topicDrag}>
              {manage && topic && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm cursor-grab" aria-label={t('c9a.moveTopic', { title: topic.title })} title={t('c9a.moveHint')} onKeyDown={keyTopic}><GripVertical size={14} /></button>}
              <h4 className="min-w-0 flex-1 truncate text-[13.5px] font-semibold">
                {topic ? <>{topic.week !== null && !topic.title.toLowerCase().startsWith('week') && <span className="mr-1.5 text-[var(--w-text-2)]">{t('c9a.weekN', { n: topic.week })} ·</span>}{topic.title}</> : t('c9a.noTopic')}
              </h4>
              {manage && topic && (
                <>
                  <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`${t('c9a.addMaterial')} — ${topic.title}`} onClick={() => setMatDlg({ material: null, topicId: topic.id })}><Plus size={13} /></button>
                  <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`${t('c9a.editTopic')} ${topic.title}`} onClick={() => setTopicDlg({ topic })}><Pencil size={13} /></button>
                  <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`${t('c9a.deleteTopic')} ${topic.title}`} onClick={() => setDelTopic(topic)}><Trash2 size={13} /></button>
                </>
              )}
            </div>
            {!items.length ? (
              <p className="rounded-[8px] border border-dashed border-[var(--w-border)] px-3 py-3 text-[12.5px] text-[var(--w-text-2)]">{manage ? t('c9a.dropHere') : t('c9a.topicEmpty')}</p>
            ) : (
              <ul className="divide-y divide-[var(--w-border)] overflow-hidden rounded-[10px] border border-[var(--w-border)]">
                {items.map((m, i) => (
                  <MaterialRow key={m.id} m={m} classId={cls.id} manage={manage} students={d.students}
                    open={openIds.has(m.id)}
                    onToggle={() => setOpenIds((s) => { const n = new Set(s); if (n.has(m.id)) n.delete(m.id); else n.add(m.id); return n; })}
                    onEdit={() => setMatDlg({ material: m, topicId: m.topicId })} onDelete={() => setDelMat(m)} onViewers={() => setViewers(m)}
                    drag={{
                      dragging: draggingKey === `m${m.id}`,
                      onDragStart: (e) => { e.stopPropagation(); drag.current = { type: 'material', id: m.id }; setDraggingKey(`m${m.id}`); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', `material:${m.id}`); },
                      onDragOver: allowDrop,
                      onDrop: (e) => {
                        const dg = drag.current;
                        if (!dg || dg.type !== 'material') return;
                        e.preventDefault(); e.stopPropagation();
                        if (dg.id !== m.id) moveMaterial(dg.id, tid, m.id);
                        endDrag();
                      },
                      onKey: (e) => {
                        if (!e.altKey || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
                        e.preventDefault();
                        const up = e.key === 'ArrowUp';
                        if (up && i === 0 && si > 0) { moveMaterial(m.id, sections[si - 1].topic?.id ?? null, null); return; }
                        if (!up && i === items.length - 1 && si < sections.length - 1) { const nx = sections[si + 1]; moveMaterial(m.id, nx.topic?.id ?? null, nx.items[0]?.id ?? null); return; }
                        const ids = items.map((x) => x.id);
                        const j = up ? i - 1 : i + 1;
                        if (j < 0 || j >= ids.length) return;
                        [ids[i], ids[j]] = [ids[j], ids[i]];
                        applyMaterials(tid, ids);
                      },
                    }} />
                ))}
              </ul>
            )}
          </div>
        );
      })}
      {manage && (
        <>
          <TopicDialog classId={cls.id} topic={topicDlg?.topic ?? null} open={!!topicDlg} onClose={() => setTopicDlg(null)} />
          <MaterialDialog classId={cls.id} topics={d.topics} material={matDlg?.material ?? null} defaultTopic={matDlg?.topicId ?? null} open={!!matDlg} onClose={() => setMatDlg(null)} />
          <ViewersDialog classId={cls.id} material={viewers} onClose={() => setViewers(null)} />
          <ConfirmDialog open={!!delMat} onClose={() => setDelMat(null)} title={t('c9a.deleteMaterial')} body={t('c9a.deleteMaterialBody', { title: delMat?.title ?? '' })} confirmLabel={t('c9a.delete')} onConfirm={() => delMat && delM.mutate(delMat.id)} pending={delM.isPending} />
          <ConfirmDialog open={!!delTopic} onClose={() => setDelTopic(null)} title={t('c9a.deleteTopic')} body={t('c9a.deleteTopicBody', { title: delTopic?.title ?? '' })} confirmLabel={t('c9a.delete')} onConfirm={() => delTopic && delT.mutate(delTopic.id)} pending={delT.isPending} />
        </>
      )}
    </section>
  );
}
