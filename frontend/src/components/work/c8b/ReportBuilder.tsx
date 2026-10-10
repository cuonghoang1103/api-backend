'use client';

/**
 * CTW đợt 8b — Reports → Builder: soạn báo cáo bằng KHỐI kéo-thả (tiêu đề, đoạn văn, ô KPI, biểu đồ có sẵn, bảng thẻ theo
 * JQL, rủi ro, nhận xét AI, ngắt trang), lưu thành mẫu, xem trước bằng số liệu thật, xuất PDF/DOCX. Biểu đồ trong xem trước
 * là CÙNG SVG máy chủ nhúng vào tệp xuất (nền trắng như giấy in).
 */

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  BarChart3, ChevronDown, ChevronRight, FileDown, FileText, GripVertical, Heading, LayoutGrid, ListChecks, Plus, Save, ShieldAlert, Sparkles, SplitSquareVertical, Trash2, Type,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError, type ProjectConfig } from '@/lib/work-api';
import {
  CHART_KEYS, ISSUE_COLUMNS, KPI_KEYS, PERIODS, reportBuilderApi, type BlockType, type ReportBlock, type ReportLayout, type ResolvedReport, type TemplateRow,
} from '@/lib/work-c8b-api';
import { EmptyState, PageLoading, Spinner } from '../ui';
import { useWT, type WKey } from '../i18n';

const BLOCK_ICON: Record<BlockType, typeof Heading> = { heading: Heading, text: Type, kpis: LayoutGrid, chart: BarChart3, issues: ListChecks, risks: ShieldAlert, ai: Sparkles, pageBreak: SplitSquareVertical };
const BLOCK_TYPES: BlockType[] = ['heading', 'text', 'kpis', 'chart', 'issues', 'risks', 'ai', 'pageBreak'];
const newId = () => Math.random().toString(36).slice(2, 10);

function blankBlock(type: BlockType): ReportBlock {
  const id = newId();
  switch (type) {
    case 'heading': return { id, type, text: '', level: 1 };
    case 'text': return { id, type, text: '' };
    case 'kpis': return { id, type, metrics: ['open', 'doneInPeriod', 'overdue'] };
    case 'chart': return { id, type, chart: 'burnup' };
    case 'issues': return { id, type, jql: 'resolved >= -7d ORDER BY resolved DESC', columns: ['key', 'title', 'status', 'assignee'], limit: 25 };
    case 'risks': return { id, type, limit: 5 };
    case 'ai': return { id, type, audience: 'team', text: null, refreshOnSend: false };
    case 'pageBreak': return { id, type };
  }
}

export default function ReportBuilder({ config, pid }: { config: ProjectConfig; pid: number }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ['c8b-templates', pid], queryFn: () => reportBuilderApi.templates(pid) });
  const [ref, setRef] = useState<string>('builtin:weekly');
  const [layout, setLayout] = useState<ReportLayout | null>(null);
  const [name, setName] = useState('');
  const [dirty, setDirty] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [preview, setPreview] = useState<ResolvedReport | null>(null);

  const all: TemplateRow[] = useMemo(() => (list.data ? [...list.data.builtins, ...list.data.templates] : []), [list.data]);
  const current = all.find((x) => x.ref === ref) ?? null;
  useEffect(() => {
    if (!current) return;
    setLayout(JSON.parse(JSON.stringify(current.layout)) as ReportLayout);
    setName(current.builtin ? '' : current.name);
    setDirty(false);
    setPreview(null);
  }, [current]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const edit = (fn: (l: ReportLayout) => ReportLayout) => { setLayout((l) => (l ? fn(l) : l)); setDirty(true); };
  const setBlock = (id: string, patch: Partial<ReportBlock>) => edit((l) => ({ ...l, blocks: l.blocks.map((b) => (b.id === id ? ({ ...b, ...patch } as ReportBlock) : b)) }));
  const onDragEnd = (e: DragEndEvent) => {
    if (!e.over || e.active.id === e.over.id) return;
    edit((l) => {
      const from = l.blocks.findIndex((b) => b.id === e.active.id);
      const to = l.blocks.findIndex((b) => b.id === e.over!.id);
      return { ...l, blocks: arrayMove(l.blocks, from, to) };
    });
  };

  const doPreview = useMutation({ mutationFn: () => reportBuilderApi.preview(pid, layout!), onSuccess: setPreview, onError: (e) => toast.error(workError(e)) });
  const doExport = useMutation({ mutationFn: (f: 'pdf' | 'docx') => reportBuilderApi.exportFile(pid, layout!, f), onError: (e) => toast.error(workError(e)) });
  const save = useMutation({
    mutationFn: async (asNew: boolean) => {
      const n = name.trim() || layout!.title;
      if (!asNew && current && !current.builtin && current.id) return reportBuilderApi.update(pid, current.id, { name: n, layout: layout! });
      return reportBuilderApi.create(pid, { name: n, layout: layout! });
    },
    onSuccess: async (row) => { await qc.invalidateQueries({ queryKey: ['c8b-templates', pid] }); setRef(row.ref); setDirty(false); toast.success(t('c8b.saved')); },
    onError: (e) => toast.error(workError(e)),
  });
  const remove = useMutation({
    mutationFn: () => reportBuilderApi.remove(pid, current!.id!),
    onSuccess: async () => { await qc.invalidateQueries({ queryKey: ['c8b-templates', pid] }); setRef('builtin:weekly'); toast.success(t('c8b.deleted')); },
    onError: (e) => toast.error(workError(e)),
  });
  const ai = useMutation({
    mutationFn: (b: Extract<ReportBlock, { type: 'ai' }>) => reportBuilderApi.ai(pid, b.audience).then((r) => ({ id: b.id, ...r })),
    onSuccess: (r) => setBlock(r.id, { text: r.text, generatedAt: r.generatedAt } as Partial<ReportBlock>),
    onError: (e) => toast.error(workError(e)),
  });

  if (list.isLoading || !layout) return <PageLoading />;
  if (list.error) return <EmptyState title={t('c8b.loadFailed')} body={workError(list.error)} />;
  const canEdit = !!list.data?.canEdit;

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="min-w-0 space-y-3">
        <section className="w-card p-4" aria-label={t('c8b.template')}>
          <div className="flex flex-wrap items-end gap-2">
            <label className="min-w-[200px] flex-1 text-[12.5px]">
              <span className="mb-1 block text-[var(--w-text-2)]">{t('c8b.template')}</span>
              <select className="w-input" value={ref} onChange={(e) => { if (dirty && !window.confirm(t('c8b.discard'))) return; setRef(e.target.value); }} data-testid="c8b-template">
                <optgroup label={t('c8b.builtins')}>{list.data!.builtins.map((b) => <option key={b.ref} value={b.ref}>{b.name}</option>)}</optgroup>
                {list.data!.templates.length > 0 && <optgroup label={t('c8b.saved_tpl')}>{list.data!.templates.map((b) => <option key={b.ref} value={b.ref}>{b.name}</option>)}</optgroup>}
              </select>
            </label>
            {canEdit && (
              <>
                <label className="min-w-[180px] flex-1 text-[12.5px]">
                  <span className="mb-1 block text-[var(--w-text-2)]">{t('c8b.templateName')}</span>
                  <input className="w-input" value={name} maxLength={120} placeholder={layout.title} onChange={(e) => { setName(e.target.value); setDirty(true); }} />
                </label>
                {current && !current.builtin && <button type="button" className="w-btn" disabled={save.isPending} onClick={() => save.mutate(false)} data-testid="c8b-save"><Save size={13} /> {t('c8b.save')}</button>}
                <button type="button" className="w-btn" disabled={save.isPending} onClick={() => save.mutate(true)} data-testid="c8b-save-as"><Plus size={13} /> {t('c8b.saveAs')}</button>
                {current && !current.builtin && <button type="button" className="w-btn w-btn-ghost" aria-label={t('c8b.deleteTpl')} onClick={() => window.confirm(t('c8b.deleteConfirm')) && remove.mutate()}><Trash2 size={13} /></button>}
              </>
            )}
          </div>
          {current?.description && <p className="mt-2 text-[12.5px] text-[var(--w-text-2)]">{current.description}</p>}
        </section>

        <section className="w-card space-y-3 p-4" aria-label={t('c8b.settings')}>
          <h2 className="w-section-title">{t('c8b.settings')}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="text-[12.5px]"><span className="mb-1 block text-[var(--w-text-2)]">{t('c8b.title')}</span>
              <input className="w-input" value={layout.title} maxLength={200} onChange={(e) => edit((l) => ({ ...l, title: e.target.value }))} /></label>
            <label className="text-[12.5px]"><span className="mb-1 block text-[var(--w-text-2)]">{t('c8b.subtitle')}</span>
              <input className="w-input" value={layout.subtitle ?? ''} maxLength={300} onChange={(e) => edit((l) => ({ ...l, subtitle: e.target.value || null }))} /></label>
            <label className="text-[12.5px]"><span className="mb-1 block text-[var(--w-text-2)]">{t('c8b.period')}</span>
              <select className="w-input" value={layout.period} onChange={(e) => edit((l) => ({ ...l, period: e.target.value as ReportLayout['period'] }))}>
                {PERIODS.map((p) => <option key={p} value={p}>{t(`c8b.period_${p}` as WKey)}</option>)}
              </select></label>
            <label className="text-[12.5px]"><span className="mb-1 block text-[var(--w-text-2)]">{t('c8b.language')}</span>
              <select className="w-input" value={layout.language ?? ''} onChange={(e) => edit((l) => ({ ...l, language: (e.target.value || null) as ReportLayout['language'] }))}>
                <option value="">{t('c8b.langProject')}</option><option value="en">English</option><option value="vi">Tiếng Việt</option>
              </select></label>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12.5px]">
            {(['cover', 'toc', 'logo', 'coverImage'] as const).map((k) => (
              <label key={k} className="flex items-center gap-1.5"><input type="checkbox" checked={layout.options[k]} onChange={(e) => edit((l) => ({ ...l, options: { ...l.options, [k]: e.target.checked } }))} /> {t(`c8b.opt_${k}` as WKey)}</label>
            ))}
            <label className="flex items-center gap-1.5">{t('c8b.accent')}
              <input type="color" aria-label={t('c8b.accent')} value={layout.options.accent ?? config.color ?? '#4f5bd5'} onChange={(e) => edit((l) => ({ ...l, options: { ...l.options, accent: e.target.value } }))} className="h-6 w-8 cursor-pointer rounded border border-[var(--w-border)] bg-transparent" />
            </label>
          </div>
        </section>

        <section className="w-card p-4" aria-label={t('c8b.blocks')}>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="w-section-title">{t('c8b.blocks')}</h2>
            <span className="text-[12px] text-[var(--w-text-3)]">{t('c8b.dragHint')}</span>
          </div>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={layout.blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              <ul className="mt-2 space-y-1.5" data-testid="c8b-blocks">
                {layout.blocks.map((b) => (
                  <BlockRow key={b.id} block={b} open={open === b.id} onToggle={() => setOpen(open === b.id ? null : b.id)}
                    onChange={(p) => setBlock(b.id, p)} onRemove={() => edit((l) => ({ ...l, blocks: l.blocks.filter((x) => x.id !== b.id) }))}
                    onAi={b.type === 'ai' ? () => ai.mutate(b) : undefined} aiBusy={ai.isPending} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
          <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label={t('c8b.addBlock')}>
            {BLOCK_TYPES.map((ty) => { const I = BLOCK_ICON[ty]; return (
              <button key={ty} type="button" className="w-btn w-btn-sm" disabled={layout.blocks.length >= 60} onClick={() => { const nb = blankBlock(ty); edit((l) => ({ ...l, blocks: [...l.blocks, nb] })); setOpen(nb.id); }} data-testid={`c8b-add-${ty}`}>
                <Plus size={12} /><I size={12} /> {t(`c8b.b_${ty}` as WKey)}
              </button>
            ); })}
          </div>
        </section>
      </div>

      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="w-btn w-btn-primary" disabled={doPreview.isPending} onClick={() => doPreview.mutate()} data-testid="c8b-preview">
            {doPreview.isPending ? <Spinner size={12} /> : <FileText size={13} />} {t('c8b.preview')}
          </button>
          <button type="button" className="w-btn" disabled={doExport.isPending} onClick={() => doExport.mutate('pdf')} data-testid="c8b-export-pdf"><FileDown size={13} /> PDF</button>
          <button type="button" className="w-btn" disabled={doExport.isPending} onClick={() => doExport.mutate('docx')} data-testid="c8b-export-docx"><FileDown size={13} /> DOCX</button>
          {doExport.isPending && <Spinner size={12} />}
        </div>
        {preview ? <Preview r={preview} /> : <div className="w-card p-6 text-center text-[13px] text-[var(--w-text-3)]">{t('c8b.previewHint')}</div>}
      </div>
    </div>
  );
}

function BlockRow({ block, open, onToggle, onChange, onRemove, onAi, aiBusy }: {
  block: ReportBlock; open: boolean; onToggle: () => void; onChange: (p: Partial<ReportBlock>) => void; onRemove: () => void; onAi?: () => void; aiBusy: boolean;
}) {
  const { t } = useWT();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const I = BLOCK_ICON[block.type];
  const summary = block.type === 'heading' || block.type === 'text' ? block.text.slice(0, 60) : block.type === 'chart' ? t(`c8b.ch_${block.chart}` as WKey)
    : block.type === 'kpis' ? `${block.metrics.length}` : block.type === 'issues' ? block.jql.slice(0, 50) : '';
  return (
    <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={cn('rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)]', isDragging && 'opacity-60 shadow-lg')}>
      <div className="flex items-center gap-1.5 px-2 py-1.5">
        <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm cursor-grab" aria-label={t('c8b.dragBlock')} {...attributes} {...listeners}><GripVertical size={14} /></button>
        <button type="button" className="flex min-w-0 flex-1 items-center gap-1.5 text-left text-[13px]" aria-expanded={open} onClick={onToggle}>
          {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}<I size={13} className="shrink-0 text-[var(--w-text-3)]" />
          <span className="font-medium">{t(`c8b.b_${block.type}` as WKey)}</span>
          {summary && <span className="min-w-0 truncate text-[var(--w-text-3)]">· {summary}</span>}
        </button>
        <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('c8b.removeBlock')} onClick={onRemove}><Trash2 size={13} /></button>
      </div>
      {open && <div className="space-y-2 border-t border-[var(--w-border)] p-3 text-[12.5px]"><BlockEditor block={block} onChange={onChange} onAi={onAi} aiBusy={aiBusy} /></div>}
    </li>
  );
}

function BlockEditor({ block: b, onChange, onAi, aiBusy }: { block: ReportBlock; onChange: (p: Partial<ReportBlock>) => void; onAi?: () => void; aiBusy: boolean }) {
  const { t, fmtDateTime } = useWT();
  const titleInput = 'title' in b || b.type === 'kpis' || b.type === 'chart' || b.type === 'issues' || b.type === 'risks' || b.type === 'ai'
    ? <label className="block"><span className="mb-1 block text-[var(--w-text-2)]">{t('c8b.blockTitle')}</span><input className="w-input" maxLength={120} value={(b as { title?: string | null }).title ?? ''} placeholder={t('c8b.auto')} onChange={(e) => onChange({ title: e.target.value || null } as Partial<ReportBlock>)} /></label>
    : null;
  switch (b.type) {
    case 'heading':
      return (
        <div className="flex gap-2">
          <input className="w-input flex-1" aria-label={t('c8b.b_heading')} maxLength={200} value={b.text} onChange={(e) => onChange({ text: e.target.value })} />
          <select className="w-input w-24" aria-label={t('c8b.level')} value={b.level} onChange={(e) => onChange({ level: Number(e.target.value) as 1 | 2 | 3 })}>{[1, 2, 3].map((n) => <option key={n} value={n}>H{n}</option>)}</select>
        </div>
      );
    case 'text':
      return <textarea className="w-input min-h-[110px]" aria-label={t('c8b.b_text')} maxLength={8000} value={b.text} placeholder={t('c8b.textHint')} onChange={(e) => onChange({ text: e.target.value })} />;
    case 'kpis':
      return (
        <>{titleInput}
          <fieldset><legend className="mb-1 text-[var(--w-text-2)]">{t('c8b.metrics')}</legend>
            <div className="grid gap-1 sm:grid-cols-2">
              {KPI_KEYS.map((k) => (
                <label key={k} className="flex items-center gap-1.5"><input type="checkbox" checked={b.metrics.includes(k)} disabled={!b.metrics.includes(k) && b.metrics.length >= 8}
                  onChange={(e) => onChange({ metrics: e.target.checked ? [...b.metrics, k] : b.metrics.filter((x) => x !== k).length ? b.metrics.filter((x) => x !== k) : b.metrics })} /> {t(`c8b.k_${k}` as WKey)}</label>
              ))}
            </div>
          </fieldset>
        </>
      );
    case 'chart':
      return (
        <>{titleInput}
          <div className="grid gap-2 sm:grid-cols-2">
            <label><span className="mb-1 block text-[var(--w-text-2)]">{t('c8b.chart')}</span>
              <select className="w-input" value={b.chart} onChange={(e) => onChange({ chart: e.target.value as typeof b.chart })}>{CHART_KEYS.map((c) => <option key={c} value={c}>{t(`c8b.ch_${c}` as WKey)}</option>)}</select></label>
            {['cfd', 'defects', 'createdResolved'].includes(b.chart) && (
              <label><span className="mb-1 block text-[var(--w-text-2)]">{t('c8b.days')}</span>
                <input type="number" className="w-input" min={7} max={180} value={b.days ?? 30} onChange={(e) => onChange({ days: Math.min(180, Math.max(7, Number(e.target.value) || 30)) })} /></label>
            )}
          </div>
        </>
      );
    case 'issues':
      return (
        <>{titleInput}
          <label className="block"><span className="mb-1 block text-[var(--w-text-2)]">JQL</span>
            <input className="w-input font-mono" maxLength={1000} value={b.jql} onChange={(e) => onChange({ jql: e.target.value })} placeholder="status = Done AND resolved >= -7d" /></label>
          <fieldset><legend className="mb-1 text-[var(--w-text-2)]">{t('c8b.columns')}</legend>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {ISSUE_COLUMNS.map((c) => (
                <label key={c} className="flex items-center gap-1.5"><input type="checkbox" checked={b.columns.includes(c)} onChange={(e) => onChange({ columns: e.target.checked ? ISSUE_COLUMNS.filter((x) => x === c || b.columns.includes(x)) : b.columns.filter((x) => x !== c).length ? b.columns.filter((x) => x !== c) : b.columns })} /> {t(`c8b.col_${c}` as WKey)}</label>
              ))}
            </div>
          </fieldset>
          <label className="block w-40"><span className="mb-1 block text-[var(--w-text-2)]">{t('c8b.limit')}</span>
            <input type="number" className="w-input" min={1} max={200} value={b.limit} onChange={(e) => onChange({ limit: Math.min(200, Math.max(1, Number(e.target.value) || 25)) })} /></label>
        </>
      );
    case 'risks':
      return (<>{titleInput}<label className="block w-40"><span className="mb-1 block text-[var(--w-text-2)]">{t('c8b.limit')}</span><input type="number" className="w-input" min={1} max={20} value={b.limit} onChange={(e) => onChange({ limit: Math.min(20, Math.max(1, Number(e.target.value) || 5)) })} /></label></>);
    case 'ai':
      return (
        <>{titleInput}
          <div className="flex flex-wrap items-end gap-2">
            <label><span className="mb-1 block text-[var(--w-text-2)]">{t('c8b.audience')}</span>
              <select className="w-input" value={b.audience} onChange={(e) => onChange({ audience: e.target.value as typeof b.audience })}>{(['team', 'teacher', 'client'] as const).map((a) => <option key={a} value={a}>{t(`c8b.aud_${a}` as WKey)}</option>)}</select></label>
            <button type="button" className="w-btn" disabled={aiBusy} onClick={onAi} data-testid="c8b-ai-generate">{aiBusy ? <Spinner size={12} /> : <Sparkles size={13} />} {b.text ? t('c8b.aiRegenerate') : t('c8b.aiGenerate')}</button>
          </div>
          <label className="flex items-center gap-1.5"><input type="checkbox" checked={b.refreshOnSend} onChange={(e) => onChange({ refreshOnSend: e.target.checked })} /> {t('c8b.aiRefresh')}</label>
          {b.text ? (
            <>
              <textarea className="w-input min-h-[120px]" aria-label={t('c8b.b_ai')} maxLength={20000} value={b.text} onChange={(e) => onChange({ text: e.target.value })} />
              {b.generatedAt && <p className="text-[11.5px] text-[var(--w-text-3)]">{t('c8b.aiGenerated', { d: fmtDateTime(b.generatedAt) })}</p>}
            </>
          ) : <p className="text-[var(--w-text-3)]">{t('c8b.aiEmpty')}</p>}
        </>
      );
    case 'pageBreak':
      return <p className="text-[var(--w-text-3)]">{t('c8b.pageBreakHint')}</p>;
  }
}

/** Xem trước kiểu giấy in (nền trắng ở cả theme tối — đúng với tệp xuất). */
function Preview({ r }: { r: ResolvedReport }) {
  const { t, fmtDate } = useWT();
  const ink = '#111827', muted = '#6b7280';
  return (
    <article className="overflow-hidden rounded-[10px] border border-[var(--w-border)] bg-white p-6 text-[13px]" style={{ color: ink }} data-testid="c8b-paper" aria-label={t('c8b.previewLabel')}>
      <div className="mb-4 h-1.5 rounded-full" style={{ background: r.accent }} />
      <p style={{ color: muted }} className="text-[12px]">{r.workspace.name} · {r.project.name} ({r.project.key})</p>
      <h2 className="mt-1 text-[22px] font-bold leading-tight">{r.title}</h2>
      {r.subtitle && <p style={{ color: muted }}>{r.subtitle}</p>}
      <p style={{ color: muted }} className="mt-1 text-[12px]">{fmtDate(r.period.from)} – {fmtDate(r.period.to)}{r.period.sprint ? ` · ${r.period.sprint.name}` : ''}</p>
      <div className="mt-4 space-y-4">
        {r.blocks.map((b) => {
          switch (b.type) {
            case 'heading': return b.level === 1
              ? <h3 key={b.id} className="border-b pb-1 text-[17px] font-bold" style={{ color: r.accent, borderColor: `${r.accent}55` }}>{b.text}</h3>
              : <h4 key={b.id} className={b.level === 2 ? 'text-[15px] font-semibold' : 'text-[13.5px] font-semibold'}>{b.text}</h4>;
            case 'text': return <div key={b.id} className="space-y-2">{b.text.split(/\n{2,}/).map((p, i) => <p key={i} className="whitespace-pre-line">{p}</p>)}</div>;
            case 'pageBreak': return <hr key={b.id} className="border-dashed" style={{ borderColor: '#d1d5db' }} aria-label={t('c8b.b_pageBreak')} />;
            case 'error': return <p key={b.id} className="italic" style={{ color: muted }}>[{t('c8b.unavailable')}: {b.message}]</p>;
            case 'kpis': return (
              <div key={b.id}>
                {b.title && <p className="mb-1 font-semibold">{b.title}</p>}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {b.items.map((k) => (
                    <div key={k.key} className="rounded-[8px] border bg-[#f9fafb] p-2.5" style={{ borderColor: '#e5e7eb', borderLeft: `3px solid ${r.accent}` }}>
                      <p className="text-[11px]" style={{ color: muted }}>{k.label}</p>
                      <p className="text-[20px] font-bold leading-tight">{k.value}</p>
                      {k.hint && <p className="truncate text-[10.5px]" style={{ color: muted }}>{k.hint}</p>}
                    </div>
                  ))}
                </div>
              </div>
            );
            // eslint-disable-next-line @next/next/no-img-element
            case 'chart': return <img key={b.id} src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(b.svg)}`} alt={b.title} className="h-auto w-full" />;
            case 'issues': return (
              <div key={b.id}>
                {b.title && <p className="mb-1 font-semibold">{b.title}</p>}
                {b.rows.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-[12px]">
                      <thead><tr style={{ background: `${r.accent}22` }}>{b.columns.map((c) => <th key={c} className="px-2 py-1 text-left font-semibold">{c}</th>)}</tr></thead>
                      <tbody>{b.rows.map((row, i) => <tr key={i} className="border-b" style={{ borderColor: '#e5e7eb', background: i % 2 ? '#f9fafb' : undefined }}>{row.map((c, j) => <td key={j} className={cn('px-2 py-1 align-top', b.colKeys[j] === 'key' && 'font-semibold')}>{c}</td>)}</tr>)}</tbody>
                    </table>
                    {b.total > b.rows.length && <p className="mt-1 text-[11px]" style={{ color: muted }}>{t('c8b.showing', { n: b.rows.length, total: b.total })}</p>}
                  </div>
                ) : <p style={{ color: muted }}>{t('c8b.noIssues')}</p>}
              </div>
            );
            case 'risks': return (
              <div key={b.id}>
                <p className="mb-1 font-semibold">{b.title}</p>
                {b.note || !b.items.length ? <p style={{ color: muted }}>{b.note ?? t('c8b.noRisks')}</p> : (
                  <ul className="space-y-1.5">{b.items.map((it) => <li key={it.key}><span className="mr-2 rounded-full px-2 py-0.5 text-[10.5px] font-semibold" style={{ background: '#fee2e2', color: '#991b1b' }}>{it.level ?? '—'}</span><b>{it.key} {it.title}</b>{(it.owner || it.mitigation) && <span className="block text-[12px]" style={{ color: muted }}>{[it.owner, it.mitigation].filter(Boolean).join(' · ')}</span>}</li>)}</ul>
                )}
              </div>
            );
            case 'ai': return (
              <div key={b.id} className="rounded-[8px] border p-3" style={{ borderColor: `${r.accent}66`, background: `${r.accent}0f` }}>
                <p className="font-semibold" style={{ color: r.accent }}>{b.title}</p>
                <p className="text-[11px] italic" style={{ color: muted }}>{b.note}</p>
                <p className="mt-1 whitespace-pre-line">{b.text.replace(/^#+\s*/gm, '').replace(/\*\*(.+?)\*\*/g, '$1')}</p>
              </div>
            );
          }
        })}
      </div>
    </article>
  );
}
