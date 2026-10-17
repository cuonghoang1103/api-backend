'use client';

/**
 * CTW Diagram — DIAGRAM STUDIO của một dự án (/work/<ws>/<KEY>/diagrams, `?d=N` mở sơ đồ D-N).
 *
 *   Trái   danh sách sơ đồ (lọc loại/trạng thái, tìm) — loại, tên, liên kết UC/thẻ/trang, phiên bản, người sửa
 *   Giữa   trình soạn Mermaid (mã + xem trước trực tiếp + lỗi cú pháp) hoặc bảng vẽ Excalidraw (nạp lười)
 *   Phải   Thông tin (nguồn AI đã dùng, giả định, liên kết) · Lịch sử phiên bản (xem/khôi phục, đề xuất AI) · Bình luận
 *   Đầu    Mới · AI vẽ · Nhập · Đặt vào Report 3/4 — và trên sơ đồ: Lưu · Duyệt · Xuất SVG/PNG/Mermaid · Chèn vào Docs · Xoá
 */

import './diagrams.css';
import '@fontsource/be-vietnam-pro/400.css';
import '@fontsource/be-vietnam-pro/600.css';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  BadgeCheck, Check, Code2, Database, Download, Eye, FileDown, FileUp, History, Info, Maximize2, MessageSquare, Minimize2, PanelLeft, PanelRight, Plus, Save, Search, Shapes, Sparkles, Trash2, Undo2, X,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { workDocs3aApi } from '@/lib/work-docs3a-api';
import {
  DIAGRAM_TYPES, workDiagramKeys, workDiagramsApi, type DiagramDetail, type DiagramListItem, type DiagramStatus, type GenerateResult,
} from '@/lib/work-diagrams-api';
import ProjectHeader from '@/components/work/ProjectHeader';
import { useProjectRealtime } from '@/components/work/hooks';
import { Dialog, EmptyState, PageLoading, Spinner, UserAvatar } from '@/components/work/ui';
import { useWT } from '@/components/work/i18n';
import MermaidEditor from './MermaidEditor';
import type { ExcalidrawHandle } from './ExcalidrawEditor';
import { LIMITS, Splitter, useMinWidth, useStudioLayout, type StudioLayout } from './viewer/panels';
import type { SqlDesignerHandle } from './sql/SqlDesigner';
import type { Analysis } from '@/lib/sqlDesign';
import { DIALECT_LABEL, splitMeta, sqlToMermaid } from '@/lib/sqlDesign';
import { GenerateDialog, ImportDialog, InsertDialog, NewDialog, typeKey } from './dialogs';
import { download, fileSlug, isDarkTheme, renderDiagramSvg, standaloneSvg, svgToPngBlob, type ParseResult, type Variant } from './render';
import { useStoreMermaidRender } from '../c8c/mermaidRender';

const ExcalidrawEditor = dynamic(() => import('./ExcalidrawEditor'), { ssr: false, loading: () => <div className="grid h-full place-items-center"><Spinner /></div> });
// Database designer (Monaco + ERD) nạp lười: chỉ khi mở một sơ đồ SQL.
const SqlDesigner = dynamic(() => import('./sql/SqlDesigner'), { ssr: false, loading: () => <div className="grid h-full place-items-center"><Spinner /></div> });
const SqlExportDialog = dynamic(() => import('./sql/ExportDialog'), { ssr: false });

const STATUS_TONE: Record<DiagramStatus, string> = {
  PROPOSED: 'bg-[var(--w-yellow-soft,rgba(154,116,16,0.12))] text-[var(--w-yellow-text)]',
  DRAFT: 'bg-[var(--w-sunken)] text-[var(--w-text-2)]',
  APPROVED: 'bg-[var(--w-green-soft,rgba(31,133,82,0.12))] text-[var(--w-green-text)]',
};

function StatusPill({ status }: { status: DiagramStatus }) {
  const { t } = useWT();
  return <span className={cn('inline-flex shrink-0 items-center rounded-[4px] px-1.5 py-px text-[11px] font-medium', STATUS_TONE[status])}>{t(`diagram.st_${status}`)}</span>;
}

function useDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(isDarkTheme());
    const mo = new MutationObserver(() => setDark(isDarkTheme()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
  }, []);
  return dark;
}

export default function DiagramStudio({ config, pid }: { config: ProjectConfig; pid: number }) {
  const { t, fmtRelative } = useWT();
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const qc = useQueryClient();
  useProjectRealtime(pid);
  const selected = Number(search?.get('d')) || null;
  const setSelected = useCallback((n: number | null) => {
    const p = new URLSearchParams(search?.toString());
    if (n) p.set('d', String(n)); else p.delete('d');
    const s = p.toString();
    router.replace(s ? `${pathname}?${s}` : pathname!, { scroll: false });
  }, [router, pathname, search]);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [text, setText] = useState('');
  const [dialog, setDialog] = useState<null | 'new' | 'ai' | 'import' | 'fill'>(null);
  const list = useQuery({ queryKey: [...workDiagramKeys.list(pid), typeFilter, statusFilter], queryFn: () => workDiagramsApi.list(pid, { type: typeFilter || undefined, status: statusFilter || undefined }) });
  const items = useMemo(() => (list.data?.items ?? []).filter((d) => !text.trim() || `${d.key} ${d.title} ${d.useCase?.key ?? ''} ${d.useCase?.name ?? ''}`.toLowerCase().includes(text.trim().toLowerCase())), [list.data, text]);
  const refresh = () => qc.invalidateQueries({ queryKey: workDiagramKeys.list(pid) });
  const opened = (d: DiagramDetail) => { refresh(); qc.setQueryData(workDiagramKeys.one(pid, d.number), d); setSelected(d.number); };
  const onGenerated = (r: GenerateResult) => {
    opened(r.diagram);
    toast.success(t('diagram.generated', { key: r.diagram.key }), { description: r.check.assumptions.length ? t('diagram.generatedAssumptions', { count: r.check.assumptions.length }) : t('diagram.generatedClean'), duration: 8000 });
  };
  const canEdit = list.data?.canEdit ?? false;
  const [lay, setLay] = useStudioLayout();
  const md = useMinWidth(768);
  const listShown = !md || (lay.listOpen && !lay.focus);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ProjectHeader config={config} title={t('diagram.title')}>
        {canEdit && <button type="button" className="w-btn w-btn-sm" onClick={() => setDialog('import')} aria-label={t('diagram.importTitle')}><FileUp size={13} /> <span className="max-sm:hidden">{t('diagram.import')}</span></button>}
        {canEdit && <button type="button" className="w-btn w-btn-sm" onClick={() => setDialog('fill')} aria-label={t('diagram.fillTitle')}><FileDown size={13} /> <span className="max-sm:hidden">{t('diagram.fillShort')}</span></button>}
        {canEdit && <button type="button" className="w-btn w-btn-sm" onClick={() => setDialog('ai')} aria-label={t('diagram.generateTitle')}><Sparkles size={13} /> <span className="max-sm:hidden">{t('diagram.aiDraw')}</span></button>}
        {canEdit && <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => setDialog('new')}><Plus size={13} /> {t('diagram.new')}</button>}
      </ProjectHeader>
      <div className="flex min-h-0 flex-1 max-md:flex-col">
        <aside className={cn('flex min-h-0 shrink-0 flex-col border-b border-[var(--w-border)] md:border-b-0 md:border-r', selected && 'max-md:hidden', !listShown && 'hidden')} style={md ? { width: lay.listW } : undefined} aria-label={t('diagram.listLabel')}>
          <div className="flex flex-col gap-2 border-b border-[var(--w-border)] p-3">
            <label className="relative block">
              <span className="sr-only">{t('diagram.search')}</span>
              <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" aria-hidden="true" />
              <input className="w-input pl-7" value={text} onChange={(e) => setText(e.target.value)} placeholder={t('diagram.search')} />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select className="w-input" aria-label={t('diagram.typeField')} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="">{t('diagram.allTypes')}</option>
                {DIAGRAM_TYPES.map((x) => <option key={x} value={x}>{t(typeKey(x))}</option>)}
              </select>
              <select className="w-input" aria-label={t('diagram.statusField')} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">{t('diagram.allStatuses')}</option>
                {(['PROPOSED', 'DRAFT', 'APPROVED'] as const).map((s) => <option key={s} value={s}>{t(`diagram.st_${s}`)}</option>)}
              </select>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {list.isLoading ? <PageLoading rows={5} /> : !items.length ? (
              <div className="p-4 text-[13px] text-[var(--w-text-2)]">{list.data?.items.length ? t('diagram.noMatch') : t('diagram.emptyList')}</div>
            ) : (
              <ul className="py-1">
                {items.map((d) => <ListRow key={d.id} d={d} active={d.number === selected} onOpen={() => setSelected(d.number)} rel={fmtRelative(d.updatedAt)} />)}
              </ul>
            )}
          </div>
        </aside>
        {md && listShown && <Splitter value={lay.listW} min={LIMITS.listW[0]} max={LIMITS.listW[1]} onChange={(w) => setLay({ listW: w })} side="left" onToggle={() => setLay({ listOpen: false })} label={t('dbd.resizeList')} />}
        <main className={cn('flex min-h-0 min-w-0 flex-1 flex-col', !selected && 'max-md:hidden')}>
          {selected ? <DiagramDetailView key={selected} pid={pid} number={selected} config={config} onBack={() => setSelected(null)} onChanged={refresh} lay={lay} setLay={setLay} onOpen={(n) => setSelected(n)} /> : (
            <EmptyState icon={<Shapes size={22} />} title={t('diagram.emptyTitle')} body={t('diagram.emptyBody')}
              action={canEdit ? <div className="flex flex-wrap justify-center gap-2"><button type="button" className="w-btn w-btn-primary" onClick={() => setDialog('ai')}><Sparkles size={14} /> {t('diagram.aiDraw')}</button><button type="button" className="w-btn" onClick={() => setDialog('new')}><Plus size={14} /> {t('diagram.fromTemplate')}</button></div> : undefined} />
          )}
        </main>
      </div>
      <NewDialog pid={pid} open={dialog === 'new'} onClose={() => setDialog(null)} onCreated={opened} />
      <GenerateDialog pid={pid} open={dialog === 'ai'} onClose={() => setDialog(null)} onDone={onGenerated} />
      <ImportDialog pid={pid} open={dialog === 'import'} onClose={() => setDialog(null)} onDone={(d) => { opened(d); if (d.fidelity?.notes?.length) toast.message(d.fidelity.notes.join(' '), { duration: 9000 }); }} />
      <FillDialog pid={pid} open={dialog === 'fill'} onClose={() => setDialog(null)} base={`/work/${config.workspace.slug}/${config.key}`} />
    </div>
  );
}

function ListRow({ d, active, onOpen, rel }: { d: DiagramListItem; active: boolean; onOpen: () => void; rel: string }) {
  const { t } = useWT();
  return (
    <li>
      <button type="button" onClick={onOpen} aria-current={active ? 'true' : undefined} data-testid={`diagram-row-${d.number}`}
        className={cn('flex w-full flex-col gap-0.5 px-3 py-2 text-left transition-colors', active ? 'bg-[var(--w-accent-soft)]' : 'hover:bg-[var(--w-hover)]')}>
        <span className="flex items-center gap-1.5">
          <span className="font-mono text-[11px] text-[var(--w-text-3)]">{d.key}</span>
          <span className="truncate text-[13px] font-medium">{d.title}</span>
        </span>
        <span className="flex flex-wrap items-center gap-1.5 text-[11.5px] text-[var(--w-text-2)]">
          <span>{t(typeKey(d.type))}</span>
          <StatusPill status={d.status} />
          {d.useCase && <span className="font-mono">{d.useCase.key}</span>}
          <span>v{d.currentVersion}</span>
          {d.pendingProposals > 0 && <span className="text-[var(--w-yellow-text)]">{t('diagram.pendingShort', { count: d.pendingProposals })}</span>}
          {d.openComments > 0 && <span className="inline-flex items-center gap-0.5"><MessageSquare size={11} aria-hidden="true" />{d.openComments}</span>}
        </span>
        <span className="text-[11px] text-[var(--w-text-3)]">{d.updatedBy ? t('diagram.editedBy', { name: d.updatedBy.name, when: rel }) : rel}</span>
      </button>
    </li>
  );
}

// ─── Chi tiết một sơ đồ ──────────────────────────────────────────

function DiagramDetailView({ pid, number, config, onBack, onChanged, lay, setLay, onOpen }: { pid: number; number: number; config: ProjectConfig; onBack: () => void; onChanged: () => void; lay: StudioLayout; setLay: (p: Partial<StudioLayout>) => void; onOpen: (n: number) => void }) {
  const { t, fmtRelative, locale } = useWT();
  const qc = useQueryClient();
  const dark = useDark();
  const q = useQuery({ queryKey: workDiagramKeys.one(pid, number), queryFn: () => workDiagramsApi.get(pid, number) });
  const [draft, setDraft] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [title, setTitle] = useState<string | null>(null);
  const [variant, setVariant] = useState<Variant>('light');
  const [panel, setPanel] = useState<'info' | 'history' | 'comments'>('info');
  const [parsed, setParsed] = useState<ParseResult | null>(null);
  const [viewing, setViewing] = useState<{ number: number; source: string } | null>(null);
  const [insert, setInsert] = useState(false);
  // 17/10/2026: ngăn phải / ngăn mã / chế độ "chỉ sơ đồ" nhớ theo người dùng (useStudioLayout) — thay cho mặc định cố định cũ.
  const panelOpen = lay.sideOpen && !lay.focus;
  const setPanelOpen = (f: (v: boolean) => boolean) => setLay({ sideOpen: f(lay.sideOpen), focus: false });
  const showCode = lay.codeOpen && !lay.focus;
  const setShowCode = (f: (v: boolean) => boolean) => setLay({ codeOpen: f(showCode), focus: false });
  const [maximised, setMaximised] = useState(false);
  const lg = useMinWidth(1024);
  const [sqlA, setSqlA] = useState<Analysis | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const sqlRef = useRef<SqlDesignerHandle | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const exRef = useRef<ExcalidrawHandle | null>(null);
  useEffect(() => { setVariant(dark ? 'dark' : 'light'); }, [dark]);
  const d = q.data;
  const [codeForced, setCodeForced] = useState(false);
  // Người chỉ xem: mở sẵn sơ đồ (gập ngăn mã một lần, không ghi đè lựa chọn đã lưu của họ cho sơ đồ khác).
  useEffect(() => { if (d && !d.canEdit && !codeForced) { setCodeForced(true); if (lay.codeOpen && !window.matchMedia('(min-width: 1360px)').matches) setLay({ codeOpen: false }); } }, [d?.canEdit]); // eslint-disable-line react-hooks/exhaustive-deps
  const source = viewing ? viewing.source : draft ?? d?.source ?? '';
  const readOnly = !d?.canEdit || !!viewing;
  const set = (x: DiagramDetail) => { qc.setQueryData(workDiagramKeys.one(pid, number), x); onChanged(); };
  // CTW đợt 8c: gửi ảnh vẽ sẵn của bản ĐÃ LƯU (hoặc phiên bản đang xem) ⇒ GET …/diagrams/:n/image.(svg|png) + MCP diagram_get.
  const savedSrc = viewing ? viewing.source : draft === null ? d?.source ?? null : null;
  useStoreMermaidRender(pid, !d || d.isAgent || savedSrc === null ? null : d.format === 'MERMAID' ? savedSrc : d.format === 'SQL' ? sqlToMermaid(savedSrc) : null);
  const sqlBad = d?.format === 'SQL' && !!sqlA && (sqlA.parse.errors.length > 0 || !sqlA.parse.model.tables.length || sqlA.lint.some((p) => p.severity === 'error'));

  const save = useMutation({
    mutationFn: async () => {
      if (!d) throw new Error('not loaded');
      let src = draft ?? d.source;
      let previewImageId: number | undefined;
      if (d.format === 'EXCALIDRAW' && exRef.current) {
        src = exRef.current.getJson();
        // Ảnh xem trước để nhúng Docs / xuất Word (máy chủ không vẽ được Excalidraw).
        try { previewImageId = (await workDocs3aApi.uploadImage(pid, await exRef.current.toPng(), `${d.key}.png`)).id; } catch { /* vẫn lưu bản vẽ */ }
      }
      return workDiagramsApi.update(pid, number, { source: src, title: title ?? undefined, rev: d.rev, previewImageId });
    },
    onSuccess: (x) => { set(x); setDraft(null); setDirty(false); setTitle(null); toast.success(x.proposedVersion ? t('diagram.savedProposal', { v: x.proposedVersion }) : t('diagram.saved', { v: x.currentVersion })); },
    onError: (e) => toast.error(workError(e, t('diagram.saveFailed'))),
  });
  const approve = useMutation({
    mutationFn: (on: boolean) => workDiagramsApi.approve(pid, number, on, parsed?.ok),
    onSuccess: (x) => { set(x); toast.success(x.status === 'APPROVED' ? t('diagram.approvedToast', { v: x.approvedVersion ?? x.currentVersion }) : t('diagram.unapprovedToast')); },
    onError: (e) => toast.error(workError(e, t('diagram.approveFailed'))),
  });
  const resolve = useMutation({
    mutationFn: ({ v, accept }: { v: number; accept: boolean }) => workDiagramsApi.resolve(pid, number, v, accept),
    onSuccess: (x) => { if ('discarded' in x) { onChanged(); onBack(); toast.success(t('diagram.discarded', { key: x.key })); return; } set(x); setViewing(null); },
    onError: (e) => toast.error(workError(e)),
  });
  const restore = useMutation({
    mutationFn: (v: number) => workDiagramsApi.restore(pid, number, v),
    onSuccess: (x) => { set(x); setViewing(null); setDraft(null); toast.success(t('diagram.restored', { v: x.currentVersion })); },
    onError: (e) => toast.error(workError(e)),
  });
  // Mermaid ERD ⇒ thiết kế SQL (sơ đồ MỚI — sơ đồ Mermaid giữ nguyên).
  const toSql = useMutation({
    mutationFn: async () => {
      if (!d) throw new Error('not loaded');
      const lib = await import('@/lib/sqlDesign');
      const r = lib.mermaidErdToModel(source, 'sqlserver');
      if (!r.model.tables.length) throw new Error(t('dbd.toSqlEmpty'));
      const sql = lib.generateSql(r.model, { target: 'sqlserver', drop: false, lang: locale === 'vi' ? 'vi' : 'en', title: d.title }).text;
      const created = await workDiagramsApi.create(pid, { format: 'SQL', type: 'ERD', title: `${d.title} (SQL)`.slice(0, 200), source: lib.joinMeta(sql, { dialect: 'sqlserver' }), note: `Converted from ${d.key}` });
      return { created, notes: r.notes };
    },
    onSuccess: ({ created, notes }) => {
      onChanged();
      toast.success(t('dbd.toSqlDone', { key: created.key }), { description: notes.slice(0, 4).map((n) => (locale === 'vi' ? n.vi : n.en)).join(' · ') || undefined, duration: 9000 });
      onOpen(created.number);
    },
    onError: (e) => toast.error(workError(e, t('dbd.toSqlFailed'))),
  });
  const del = useMutation({
    mutationFn: () => workDiagramsApi.remove(pid, number),
    onSuccess: () => { onChanged(); onBack(); toast.success(t('diagram.deleted')); },
    onError: (e) => toast.error(workError(e)),
  });

  const exportAs = async (kind: ExportKind) => {
    if (!d) return;
    const name = fileSlug(d.key, d.title);
    try {
      if (d.format === 'SQL') {
        if (kind === 'scripts') { setExportOpen(true); return; }
        if (kind === 'sql') { download(new Blob([`\uFEFF${splitMeta(source).sql}`], { type: 'application/sql;charset=utf-8' }), `${name}.sql`); return; }
        if (kind === 'mmd') { download(new Blob([sqlToMermaid(source) ?? 'erDiagram'], { type: 'text/plain;charset=utf-8' }), `${name}.mmd`); return; }
        const v: Variant = kind === 'print' ? 'print' : variant;
        const raw = await erdSvgString(sqlRef.current, v);
        if (!raw) return;
        const svg = await standaloneSvg(raw, `${d.key} ${d.title}`, v);
        if (kind === 'png') download(await svgToPngBlob(svg, 2), `${name}.png`);
        else download(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), `${name}${kind === 'print' ? '_print' : ''}.svg`);
        return;
      }
      if (kind === 'mmd') { download(new Blob([source], { type: 'text/plain;charset=utf-8' }), `${name}.mmd`); return; }
      if (kind === 'json') { download(new Blob([exRef.current?.getJson() ?? source], { type: 'application/json' }), `${name}.excalidraw`); return; }
      const v: Variant = kind === 'print' ? 'print' : variant;
      const raw = d.format === 'EXCALIDRAW' ? await exRef.current!.toSvg() : await renderDiagramSvg(source, v);
      if (kind === 'png' && d.format === 'EXCALIDRAW') { download(await exRef.current!.toPng(), `${name}.png`); return; }
      const svg = d.format === 'EXCALIDRAW' ? raw : await standaloneSvg(raw, `${d.key} ${d.title}`, v);
      if (kind === 'png') download(await svgToPngBlob(svg, 2), `${name}.png`);
      else download(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), `${name}${kind === 'print' ? '_print' : ''}.svg`);
    } catch (e) { toast.error(workError(e, t('diagram.exportFailed'))); }
  };

  // Ctrl/⌘+S lưu.
  useEffect(() => {
    const on = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's' && (dirty || draft !== null || title !== null) && !save.isPending) { e.preventDefault(); save.mutate(); } };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [dirty, draft, title, save]);

  // F = phóng to khung sơ đồ (khi không đang gõ), Esc = thu lại.
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest('input,textarea,select,[contenteditable="true"],.monaco-editor,.excalidraw')) return;
      if (e.key === 'Escape' && maximised) { setMaximised(false); return; }
      if ((e.key === 'f' || e.key === 'F') && !e.metaKey && !e.ctrlKey && !e.altKey && !el?.closest('.ctw-pz')) { e.preventDefault(); setMaximised((m) => !m); }
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [maximised]);

  if (q.isLoading) return <PageLoading />;
  if (!d) return <EmptyState title={t('diagram.loadFailed')} body={q.error ? workError(q.error) : undefined} />;
  const changed = draft !== null && draft !== d.source || dirty || (title !== null && title !== d.title);
  const pending = d.proposals;
  const base = `/work/${config.workspace.slug}/${config.key}`;

  const toggleMax = () => setMaximised((m) => !m);
  return (
    <div className={cn('flex min-h-0 flex-1 flex-col', maximised && 'fixed inset-0 z-[60] bg-[var(--w-bg,var(--w-panel))]')}>
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--w-border)] px-3 py-2">
        <button type="button" className="w-btn w-btn-ghost w-btn-sm md:hidden" onClick={onBack} aria-label={t('diagram.backToList')}><X size={14} /></button>
        {!maximised && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm max-md:hidden" aria-pressed={lay.listOpen && !lay.focus} onClick={() => setLay({ listOpen: !(lay.listOpen && !lay.focus), focus: false })} aria-label={t('dbd.toggleList')} title={t('dbd.toggleList')}><PanelLeft size={14} /></button>}
        <span className="font-mono text-[12px] text-[var(--w-text-3)]">{d.key}</span>
        <input className="w-input min-w-[220px] flex-1 border-transparent bg-transparent text-[14px] font-semibold hover:border-[var(--w-border)]" aria-label={t('diagram.titleField')} value={title ?? d.title} readOnly={!d.canEdit} onChange={(e) => setTitle(e.target.value)} />
        <span className="text-[12px] text-[var(--w-text-2)]">{t(typeKey(d.type))}</span>
        <StatusPill status={d.status} />
        <span className="text-[12px] text-[var(--w-text-3)]">v{d.currentVersion}{d.approvedVersion ? ` · ${t('diagram.approvedV', { v: d.approvedVersion })}` : ''}</span>
        <span className="flex-1" />
        {d.format === 'MERMAID' && (
          <div className="inline-flex rounded-[6px] border border-[var(--w-border)] p-0.5" role="group" aria-label={t('diagram.previewTheme')}>
            {(['light', 'dark', 'print'] as const).map((v) => (
              <button key={v} type="button" aria-pressed={variant === v} onClick={() => setVariant(v)} className={cn('rounded-[4px] px-2 py-0.5 text-[11.5px]', variant === v ? 'bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'text-[var(--w-text-2)]')}>{t(`diagram.v_${v}`)}</button>
            ))}
          </div>
        )}
        {d.format === 'SQL' && (
          <div className="inline-flex rounded-[6px] border border-[var(--w-border)] p-0.5" role="group" aria-label={t('diagram.previewTheme')}>
            {(['light', 'dark', 'print'] as const).map((v) => (
              <button key={v} type="button" aria-pressed={variant === v} onClick={() => setVariant(v)} className={cn('rounded-[4px] px-2 py-0.5 text-[11.5px]', variant === v ? 'bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'text-[var(--w-text-2)]')}>{t(`diagram.v_${v}`)}</button>
            ))}
          </div>
        )}
        {d.format === 'MERMAID' && d.type === 'ERD' && d.canEdit && !viewing && <button type="button" className="w-btn w-btn-sm" disabled={toSql.isPending} onClick={() => toSql.mutate()} title={t('dbd.toSqlHint')}>{toSql.isPending ? <Spinner size={12} /> : <Database size={13} />} <span className="max-lg:hidden">{t('dbd.toSql')}</span></button>}
        {d.format !== 'EXCALIDRAW' && <button type="button" className="w-btn w-btn-sm" aria-pressed={showCode} onClick={() => setShowCode((v) => !v)} title={d.format === 'SQL' ? t('dbd.codeToggleSql') : undefined}><Code2 size={13} /> <span className="max-sm:hidden">{d.format === 'SQL' ? 'SQL' : t('diagram.code')}</span></button>}
        <button type="button" className="w-btn w-btn-sm" aria-pressed={lay.focus} onClick={() => setLay({ focus: !lay.focus })} title={t('dbd.focusHint')}><Eye size={13} /> <span className="max-lg:hidden">{t('dbd.focus')}</span></button>
        <button type="button" className="w-btn w-btn-sm" aria-pressed={panelOpen} onClick={() => setPanelOpen((v) => !v)} aria-label={t('diagram.sidePanel')} title={t('diagram.sidePanel')}><PanelRight size={13} /></button>
        <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-pressed={maximised} onClick={toggleMax} aria-label={maximised ? t('dbd.restoreSize') : t('dbd.maximise')} title={`${maximised ? t('dbd.restoreSize') : t('dbd.maximise')} (F)`}>{maximised ? <Minimize2 size={14} /> : <Maximize2 size={14} />}</button>
        <ExportMenu format={d.format} onPick={exportAs} />
        {d.status !== 'PROPOSED' && <button type="button" className="w-btn w-btn-sm" onClick={() => setInsert(true)}>{t('diagram.insertShort')}</button>}
        {d.canApprove && d.status !== 'PROPOSED' && (
          d.status === 'APPROVED' && d.approvedVersion === d.currentVersion
            ? <button type="button" className="w-btn w-btn-sm" disabled={approve.isPending} onClick={() => approve.mutate(false)}><Undo2 size={13} /> {t('diagram.unapprove')}</button>
            : <button type="button" className="w-btn w-btn-sm" disabled={approve.isPending || changed || (d.format === 'MERMAID' && parsed?.ok === false) || sqlBad} onClick={() => approve.mutate(true)} title={changed ? t('diagram.saveFirst') : sqlBad ? t('dbd.fixSqlFirst') : undefined}><BadgeCheck size={13} /> {d.status === 'APPROVED' ? t('diagram.approveNew', { v: d.currentVersion }) : t('diagram.approve')}</button>
        )}
        {d.canEdit && <button type="button" className="w-btn w-btn-sm w-btn-primary" disabled={!changed || save.isPending || !!viewing} onClick={() => save.mutate()}>{save.isPending ? <Spinner size={12} /> : <Save size={13} />} {t('diagram.save')}</button>}
        {d.canEdit && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('diagram.delete')} onClick={() => setConfirmDelete(true)}><Trash2 size={14} /></button>}
      </div>
      {d.status === 'PROPOSED' && pending.length === 0 && (
        <ProposalBar text={t('diagram.proposedBanner')} canDecide={d.canApprove} busy={resolve.isPending} onAccept={() => resolve.mutate({ v: d.currentVersion, accept: true })} onDiscard={() => resolve.mutate({ v: d.currentVersion, accept: false })} t={t} />
      )}
      {pending.map((p) => (
        <ProposalBar key={p.number} text={t('diagram.proposalBanner', { v: p.number, who: p.author?.name ?? 'AI' })} canDecide={d.canApprove} busy={resolve.isPending}
          onView={() => setViewing(viewing?.number === p.number ? null : { number: p.number, source: p.source })} viewing={viewing?.number === p.number}
          onAccept={() => resolve.mutate({ v: p.number, accept: true })} onDiscard={() => resolve.mutate({ v: p.number, accept: false })} t={t} />
      ))}
      {viewing && !pending.some((p) => p.number === viewing.number) && (
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-1.5 text-[12.5px]" role="status">
          <History size={13} aria-hidden="true" /> {t('diagram.viewingVersion', { v: viewing.number })}
          <span className="flex-1" />
          {d.canEdit && <button type="button" className="w-btn w-btn-sm" disabled={restore.isPending} onClick={() => restore.mutate(viewing.number)}>{t('diagram.restoreThis')}</button>}
          <button type="button" className="w-btn w-btn-sm w-btn-ghost" onClick={() => setViewing(null)}>{t('diagram.backToCurrent')}</button>
        </div>
      )}
      <div className="relative flex min-h-0 flex-1">
        <div className="min-h-[420px] min-w-0 flex-1">
          {d.format === 'MERMAID' ? (
            <MermaidEditor showCode={showCode} source={source} readOnly={readOnly} variant={variant} onChange={(v) => setDraft(v)} onParsed={setParsed} label={`${d.key} ${d.title}`}
              codeW={lay.codeW} onCodeW={(w) => setLay({ codeW: w })} onToggleCode={() => setShowCode((v) => !v)} fitKey={`${number}-${viewing?.number ?? 'cur'}`} maximised={maximised} onToggleMaximise={toggleMax} />
          ) : d.format === 'SQL' ? (
            <SqlDesigner handleRef={sqlRef} source={source} readOnly={readOnly} dark={dark} variant={variant} label={`${d.key} ${d.title}`} onChange={(v) => setDraft(v)}
              codeOpen={showCode} codeW={lay.codeW} onCodeW={(w) => setLay({ codeW: w })} onToggleCode={() => setShowCode((v) => !v)}
              lintOpen={lay.lintOpen && !lay.focus} lintH={lay.lintH} onLint={(p) => setLay({ ...p, focus: false })} maximised={maximised} onToggleMaximise={toggleMax}
              onAnalysis={setSqlA} onExport={() => setExportOpen(true)} fitKey={`${number}-${viewing?.number ?? 'cur'}`} />
          ) : (
            <ExcalidrawEditor key={viewing ? `v${viewing.number}` : `cur${d.currentVersion}`} handleRef={exRef} source={source} dark={dark} readOnly={readOnly} onDirty={() => setDirty(true)} label={`${d.key} ${d.title}`} />
          )}
        </div>
        {panelOpen && lg && <Splitter value={lay.sideW} min={LIMITS.sideW[0]} max={LIMITS.sideW[1]} onChange={(w) => setLay({ sideW: w })} side="right" onToggle={() => setLay({ sideOpen: false })} label={t('dbd.resizeSide')} />}
        <aside className={cn('flex min-h-0 flex-col bg-[var(--w-panel)]', lg ? 'shrink-0 border-l border-[var(--w-border)]' : 'absolute inset-y-0 right-0 z-30 w-[min(360px,92vw)] border-l border-[var(--w-border)]', !panelOpen && 'hidden')}
          style={lg ? { width: lay.sideW } : { boxShadow: 'var(--w-shadow-pop)' }} aria-label={t('diagram.sidePanel')}>
          {!lg && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm absolute right-1 top-1 z-10" onClick={() => setLay({ sideOpen: false })} aria-label={t('common.close')}><X size={14} /></button>}
          <div className="flex border-b border-[var(--w-border)] px-2" role="tablist">
            {([['info', Info, t('diagram.tabInfo')], ['history', History, t('diagram.tabHistory', { count: d.versions.length })], ['comments', MessageSquare, t('diagram.tabComments', { count: d.comments.filter((c) => !c.resolved).length })]] as const).map(([id, Icon, label]) => (
              <button key={id} type="button" role="tab" aria-selected={panel === id} onClick={() => setPanel(id)}
                className={cn('-mb-px flex items-center gap-1 border-b-2 px-2 py-2 text-[12.5px]', panel === id ? 'border-[var(--w-accent)] text-[var(--w-text)]' : 'border-transparent text-[var(--w-text-2)]')}>
                <Icon size={12} aria-hidden="true" /> {label}
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-3 text-[13px]">
            {panel === 'info' && <InfoPanel d={d} base={base} parsed={parsed} sql={sqlA} />}
            {panel === 'history' && <HistoryPanel pid={pid} d={d} viewing={viewing?.number ?? null} onView={async (v) => {
              if (v === d.currentVersion) { setViewing(null); return; }
              try { const x = await workDiagramsApi.version(pid, number, v); setViewing({ number: v, source: x.source }); } catch (e) { toast.error(workError(e)); }
            }} rel={fmtRelative} />}
            {panel === 'comments' && <CommentsPanel pid={pid} d={d} onChanged={() => q.refetch()} rel={fmtRelative} />}
          </div>
        </aside>
      </div>
      {insert && <InsertDialog pid={pid} diagram={d} open={insert} onClose={() => setInsert(false)} />}
      {d.format === 'SQL' && exportOpen && <SqlExportDialog open={exportOpen} onClose={() => setExportOpen(false)} model={sqlRef.current?.model() ?? sqlA?.parse.model ?? { dialect: 'sqlserver', tables: [], enums: [] }} title={d.title} pid={pid} issueNumber={d.issue?.number ?? null} />}
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)} title={t('diagram.deleteTitle', { key: d.key })} width={420}
        footer={<><button type="button" className="w-btn" onClick={() => setConfirmDelete(false)}>{t('common.cancel')}</button><button type="button" className="w-btn w-btn-danger" disabled={del.isPending} onClick={() => del.mutate()}>{t('diagram.delete')}</button></>}>
        <p className="text-[13px] text-[var(--w-text-2)]">{t('diagram.deleteBody')}</p>
      </Dialog>
    </div>
  );
}

function ProposalBar({ text, canDecide, busy, onAccept, onDiscard, onView, viewing, t }: { text: string; canDecide: boolean; busy: boolean; onAccept: () => void; onDiscard: () => void; onView?: () => void; viewing?: boolean; t: ReturnType<typeof useWT>['t'] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] px-3 py-1.5 text-[12.5px]" role="status">
      <Sparkles size={13} aria-hidden="true" /> <span>{text}</span>
      <span className="flex-1" />
      {onView && <button type="button" className="w-btn w-btn-sm" aria-pressed={viewing} onClick={onView}>{viewing ? t('diagram.hideProposal') : t('diagram.viewProposal')}</button>}
      {canDecide ? (
        <>
          <button type="button" className="w-btn w-btn-sm w-btn-primary" disabled={busy} onClick={onAccept}><Check size={13} /> {t('diagram.accept')}</button>
          <button type="button" className="w-btn w-btn-sm" disabled={busy} onClick={onDiscard}>{t('diagram.discard')}</button>
        </>
      ) : <span className="text-[var(--w-text-2)]">{t('diagram.waitingReview')}</span>}
    </div>
  );
}

type ExportKind = 'svg' | 'png' | 'print' | 'mmd' | 'json' | 'scripts' | 'sql';

/** ERD của Database designer ⇒ chuỗi SVG ở đúng biến thể (vẽ lại tĩnh, không dính trạng thái chọn/rê chuột). */
async function erdSvgString(h: SqlDesignerHandle | null, v: Variant): Promise<string | null> {
  const a = h?.analysis();
  if (!h || !a) return null;
  const [{ renderToStaticMarkup }, { default: ErdCanvas }] = await Promise.all([import('react-dom/server'), import('./sql/ErdCanvas')]);
  return renderToStaticMarkup(<ErdCanvas model={h.model()} variant={v} direction={h.direction()} layout={h.layout()} selected={null} editable={false} getScale={() => 1} onSelect={() => undefined} />);
}

function ExportMenu({ format, onPick }: { format: 'MERMAID' | 'EXCALIDRAW' | 'SQL'; onPick: (k: ExportKind) => void }) {
  const { t } = useWT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const on = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', on);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('mousedown', on); document.removeEventListener('keydown', key); };
  }, [open]);
  const opts: Array<[ExportKind, string]> = format === 'MERMAID'
    ? [['svg', t('diagram.exSvg')], ['png', t('diagram.exPng')], ['print', t('diagram.exPrint')], ['mmd', t('diagram.exMermaid')]]
    : format === 'SQL'
      ? [['scripts', t('dbd.exScripts')], ['sql', t('dbd.exSql')], ['svg', t('diagram.exSvg')], ['png', t('diagram.exPng')], ['print', t('diagram.exPrint')], ['mmd', t('diagram.exMermaid')]]
      : [['svg', t('diagram.exSvg')], ['png', t('diagram.exPng')], ['json', t('diagram.exExcalidraw')]];
  return (
    <div ref={ref} className="relative">
      <button type="button" className="w-btn w-btn-sm" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}><Download size={13} /> <span className="max-sm:hidden">{t('diagram.export')}</span></button>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-30 mt-1 min-w-[200px] rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] p-1" style={{ boxShadow: 'var(--w-shadow-pop)' }}>
          {opts.map(([k, label]) => <button key={k} type="button" role="menuitem" className="block w-full rounded-[6px] px-2.5 py-1.5 text-left text-[13px] hover:bg-[var(--w-hover)]" onClick={() => { setOpen(false); onPick(k); }}>{label}</button>)}
        </div>
      )}
    </div>
  );
}

function InfoPanel({ d, base, parsed, sql }: { d: DiagramDetail; base: string; parsed: ParseResult | null; sql: Analysis | null }) {
  const { t } = useWT();
  const o = d.origin;
  return (
    <div className="flex flex-col gap-3">
      <dl className="grid grid-cols-[96px_1fr] gap-x-2 gap-y-1.5 text-[12.5px]">
        <dt className="text-[var(--w-text-3)]">{t('diagram.format')}</dt><dd>{d.format === 'MERMAID' ? 'Mermaid' : d.format === 'SQL' ? `SQL${sql ? ` · ${DIALECT_LABEL[sql.parse.dialect]}` : ''}` : 'Excalidraw'}</dd>
        {d.format === 'SQL' && sql && <><dt className="text-[var(--w-text-3)]">{t('dbd.design')}</dt><dd>{t('dbd.tablesN', { count: sql.parse.model.tables.length })} · {t('dbd.checksN', { count: sql.lint.length })}</dd></>}
        {d.useCase && <><dt className="text-[var(--w-text-3)]">{t('diagram.useCase')}</dt><dd><Link className="text-[var(--w-accent-text)] hover:underline" href={`${base}/requirements?uc=${d.useCase.number}`}>{d.useCase.key} {d.useCase.name}</Link></dd></>}
        {d.issue && <><dt className="text-[var(--w-text-3)]">{t('diagram.issue')}</dt><dd><Link className="text-[var(--w-accent-text)] hover:underline" href={`${base}/issue/${d.issue.number}`}>{d.issue.key} {d.issue.title}</Link></dd></>}
        {d.page && <><dt className="text-[var(--w-text-3)]">{t('diagram.page')}</dt><dd><Link className="text-[var(--w-accent-text)] hover:underline" href={`${base}/docs/${d.page.number}`}>DOC-{d.page.number} {d.page.title}</Link></dd></>}
        {d.feature && <><dt className="text-[var(--w-text-3)]">{t('diagram.feature')}</dt><dd>{d.feature}</dd></>}
        <dt className="text-[var(--w-text-3)]">{t('diagram.createdBy')}</dt><dd className="flex items-center gap-1">{d.createdBy && <UserAvatar user={{ username: d.createdBy.username, displayName: d.createdBy.name, fullName: null, avatarUrl: null }} size={16} />}{d.createdBy?.name ?? '—'}</dd>
      </dl>
      {d.format === 'SQL' && sql && (sql.parse.errors.length > 0 || sql.lint.some((p) => p.severity === 'error')) && <p className="rounded-[6px] border border-[var(--w-border)] px-2.5 py-2 text-[12.5px] text-[var(--w-red-text)]">{t('dbd.fixSqlFirst')}</p>}
      {d.format === 'MERMAID' && parsed && !parsed.ok && <p className="rounded-[6px] border border-[var(--w-border)] px-2.5 py-2 text-[12.5px] text-[var(--w-red-text)]">{t('diagram.fixBeforeApprove')}</p>}
      {o?.sources?.length ? (
        <section>
          <h3 className="mb-1 text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--w-text-3)]">{o.generator === 'ai' ? t('diagram.aiSources') : o.generator === 'import' ? t('diagram.importedFrom') : t('diagram.dataSources')}</h3>
          <ul className="list-disc pl-4 text-[12.5px] text-[var(--w-text-2)]">{o.sources.map((s, i) => <li key={i}>{s.label}</li>)}</ul>
          {o.generator === 'ai' && o.model && <p className="mt-1 text-[11.5px] text-[var(--w-text-3)]">{t('diagram.model', { m: o.model })}</p>}
        </section>
      ) : null}
      {o?.assumptions?.length ? (
        <section className="rounded-[8px] border border-[var(--w-yellow-border,rgba(154,116,16,0.4))] bg-[var(--w-yellow-soft,rgba(154,116,16,0.08))] p-2.5">
          <h3 className="mb-1 text-[12.5px] font-semibold text-[var(--w-yellow-text)]">{t('diagram.assumptions', { count: o.assumptions.length })}</h3>
          <ul className="list-disc pl-4 text-[12.5px]">{o.assumptions.map((a, i) => <li key={i}>{a}</li>)}</ul>
          <p className="mt-1 text-[11.5px] text-[var(--w-text-2)]">{t('diagram.assumptionsHint')}</p>
        </section>
      ) : o?.generator === 'ai' || o?.generator === 'data' ? <p className="text-[12.5px] text-[var(--w-green-text)]">{t('diagram.noAssumptions')}</p> : null}
      {o?.notes?.length ? <ul className="list-disc pl-4 text-[12px] text-[var(--w-text-2)]">{o.notes.map((n, i) => <li key={i}>{n}</li>)}</ul> : null}
      {o?.fidelity && (o.fidelity.merged.length || o.fidelity.dropped.length) ? (
        <section><h3 className="mb-1 text-[12px] font-semibold text-[var(--w-text-3)]">{t('diagram.fidelity')}</h3>
          <ul className="list-disc pl-4 text-[12px] text-[var(--w-text-2)]">{[...o.fidelity.merged, ...o.fidelity.dropped].map((x, i) => <li key={i}>{x}</li>)}</ul></section>
      ) : null}
      {d.description && <p className="whitespace-pre-wrap text-[12.5px] text-[var(--w-text-2)]">{d.description}</p>}
    </div>
  );
}

function HistoryPanel({ d, viewing, onView, rel }: { pid: number; d: DiagramDetail; viewing: number | null; onView: (v: number) => void; rel: (iso: string) => string }) {
  const { t } = useWT();
  return (
    <ol className="flex flex-col gap-1">
      {d.versions.map((v) => (
        <li key={v.number}>
          <button type="button" onClick={() => onView(v.number)} aria-current={(viewing ?? d.currentVersion) === v.number ? 'true' : undefined}
            className={cn('flex w-full flex-col rounded-[6px] px-2 py-1.5 text-left', (viewing ?? d.currentVersion) === v.number ? 'bg-[var(--w-accent-soft)]' : 'hover:bg-[var(--w-hover)]')}>
            <span className="flex items-center gap-1.5 text-[12.5px] font-medium">
              v{v.number}
              {v.number === d.currentVersion && <span className="text-[11px] text-[var(--w-accent-text)]">{t('diagram.current')}</span>}
              {v.number === d.approvedVersion && <span className="text-[11px] text-[var(--w-green-text)]">{t('diagram.approvedTag')}</span>}
              {v.state === 'PROPOSED' && <span className="text-[11px] text-[var(--w-yellow-text)]">{t('diagram.proposalTag')}</span>}
              {v.state === 'DISCARDED' && <span className="text-[11px] text-[var(--w-text-3)] line-through">{t('diagram.discardedTag')}</span>}
            </span>
            <span className="text-[11.5px] text-[var(--w-text-2)]">{v.note ?? '—'}</span>
            <span className="text-[11px] text-[var(--w-text-3)]">{v.author?.name ?? '—'} · {rel(v.createdAt)}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}

function CommentsPanel({ pid, d, onChanged, rel }: { pid: number; d: DiagramDetail; onChanged: () => void; rel: (iso: string) => string }) {
  const { t } = useWT();
  const [body, setBody] = useState('');
  const [anchor, setAnchor] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const add = useMutation({
    mutationFn: () => workDiagramsApi.comment(pid, d.number, { body, anchor: anchor || null, parentId: replyTo }),
    onSuccess: () => { setBody(''); setAnchor(''); setReplyTo(null); onChanged(); },
    onError: (e) => toast.error(workError(e)),
  });
  const upd = useMutation({ mutationFn: ({ id, resolved }: { id: number; resolved: boolean }) => workDiagramsApi.updateComment(pid, d.number, id, { resolved }), onSuccess: onChanged, onError: (e) => toast.error(workError(e)) });
  const rm = useMutation({ mutationFn: (id: number) => workDiagramsApi.deleteComment(pid, d.number, id), onSuccess: onChanged, onError: (e) => toast.error(workError(e)) });
  const roots = d.comments.filter((c) => !c.parentId);
  return (
    <div className="flex flex-col gap-3">
      {!roots.length && <p className="text-[12.5px] text-[var(--w-text-2)]">{t('diagram.noComments')}</p>}
      {roots.map((c) => (
        <div key={c.id} className={cn('rounded-[8px] border border-[var(--w-border)] p-2', c.resolved && 'opacity-70')}>
          {[c, ...d.comments.filter((r) => r.parentId === c.id)].map((x, i) => (
            <div key={x.id} className={cn(i > 0 && 'mt-2 border-t border-[var(--w-border)] pt-2 pl-2')}>
              <div className="flex items-center gap-1.5 text-[11.5px] text-[var(--w-text-3)]">
                <span className="font-medium text-[var(--w-text)]">{x.author?.name ?? '—'}</span> · {rel(x.createdAt)}{x.versionNumber ? ` · v${x.versionNumber}` : ''}
              </div>
              {x.anchor && <div className="mt-0.5 inline-block rounded-[4px] bg-[var(--w-sunken)] px-1.5 font-mono text-[11px]">@ {x.anchor}</div>}
              <p className="mt-0.5 whitespace-pre-wrap text-[12.5px]">{x.body}</p>
              {x.mine && <button type="button" className="text-[11px] text-[var(--w-text-3)] hover:text-[var(--w-red-text)]" onClick={() => rm.mutate(x.id)}>{t('diagram.deleteComment')}</button>}
            </div>
          ))}
          {d.canComment && (
            <div className="mt-1.5 flex gap-2 text-[11.5px]">
              <button type="button" className="text-[var(--w-accent-text)] hover:underline" onClick={() => setReplyTo(c.id)}>{t('diagram.reply')}</button>
              <button type="button" className="text-[var(--w-text-2)] hover:underline" onClick={() => upd.mutate({ id: c.id, resolved: !c.resolved })}>{c.resolved ? t('diagram.reopen') : t('diagram.resolve')}</button>
            </div>
          )}
        </div>
      ))}
      {d.canComment && (
        <form className="flex flex-col gap-1.5" onSubmit={(e) => { e.preventDefault(); if (body.trim()) add.mutate(); }}>
          {replyTo && <div className="flex items-center gap-1 text-[11.5px] text-[var(--w-text-2)]">{t('diagram.replying')} <button type="button" className="underline" onClick={() => setReplyTo(null)}>{t('common.cancel')}</button></div>}
          <label className="sr-only" htmlFor="dg-anchor">{t('diagram.anchorLabel')}</label>
          {!replyTo && <input id="dg-anchor" className="w-input" value={anchor} onChange={(e) => setAnchor(e.target.value)} placeholder={t('diagram.anchorPlaceholder')} maxLength={160} />}
          <label className="sr-only" htmlFor="dg-comment">{t('diagram.commentLabel')}</label>
          <textarea id="dg-comment" className="w-input min-h-[64px]" value={body} onChange={(e) => setBody(e.target.value)} placeholder={t('diagram.commentPlaceholder')} />
          <button type="submit" className="w-btn w-btn-sm w-btn-primary self-end" disabled={!body.trim() || add.isPending}>{t('diagram.comment')}</button>
        </form>
      )}
    </div>
  );
}

// ─── Đặt vào Report 3/4 ──────────────────────────────────────────

function FillDialog({ pid, open, onClose, base }: { pid: number; open: boolean; onClose: () => void; base: string }) {
  const { t } = useWT();
  const run = useMutation({
    mutationFn: (report: 3 | 4) => workDiagramsApi.fillReport(pid, report),
    onSuccess: (r) => {
      if (!r.filled.length) { toast.message(r.diagrams ? t('diagram.fillNothing') : t('diagram.fillNoApproved')); return; }
      toast.success(t('diagram.filledToast', { page: r.page.title, count: r.filled.length }), { action: { label: t('diagram.openPage'), onClick: () => window.location.assign(`${base}/docs/${r.page.number}`) } });
      onClose();
    },
    onError: (e) => toast.error(workError(e, t('diagram.fillFailed'))),
  });
  return (
    <Dialog open={open} onClose={onClose} title={t('diagram.fillTitle')} width={520}>
      <p className="mb-3 text-[13px] text-[var(--w-text-2)]">{t('diagram.fillIntro')}</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {([3, 4] as const).map((n) => (
          <button key={n} type="button" disabled={run.isPending} onClick={() => run.mutate(n)} className="rounded-[8px] border border-[var(--w-border)] p-3 text-left hover:bg-[var(--w-hover)]">
            <span className="block text-[13.5px] font-semibold">{t(n === 3 ? 'diagram.fillR3' : 'diagram.fillR4')}</span>
            <span className="block text-[12px] text-[var(--w-text-2)]">{t(n === 3 ? 'diagram.fillR3Hint' : 'diagram.fillR4Hint')}</span>
          </button>
        ))}
      </div>
      {run.isPending && <p className="mt-2 flex items-center gap-1.5 text-[12.5px]"><Spinner size={12} /> {t('diagram.filling')}</p>}
    </Dialog>
  );
}
