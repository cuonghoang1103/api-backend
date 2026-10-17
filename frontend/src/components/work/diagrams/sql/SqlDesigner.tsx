'use client';

/**
 * Database designer — VIẾT SQL THẬT, ERD HIỆN NGAY BÊN CẠNH khi gõ (đọc lại sau ~300 ms ngừng gõ; đang gõ dở thì giữ bản vẽ
 * tốt gần nhất của bảng đó + báo lỗi đúng dòng). Bấm bảng trên ERD ⇒ trình soạn nhảy tới câu CREATE TABLE; con trỏ trong
 * một CREATE TABLE ⇒ ERD tô sáng bảng đó. Bảng "Chuẩn thiết kế" ở dưới; xuất script cho SQL Server / PostgreSQL / MySQL /
 * SQLite / MongoDB / Mermaid / DBML / JSON.
 *
 * Nguồn lưu = SQL + một dòng `-- ctw:meta {…}` cuối (hệ quản trị, hướng sơ đồ, vị trí bảng người kéo) — trình soạn ẩn dòng đó.
 */

import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { ArrowDownUp, ArrowLeftRight, FileUp, LayoutGrid, ListChecks, Package } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useWT } from '@/components/work/i18n';
import {
  analyzeSql, DIALECT_LABEL, joinMeta, relationships, sameName, SOURCE_DIALECTS, splitMeta,
  type Analysis, type DbModel, type Dialect, type Problem, type SqlMeta, type Table,
} from '@/lib/sqlDesign';
import PanZoom, { type PanZoomHandle } from '../viewer/PanZoom';
import { LIMITS, Splitter, useMinWidth } from '../viewer/panels';
import ErdCanvas, { ErdMinimap, type ErdHandle, type ErdVariant } from './ErdCanvas';
import LintPanel, { counts } from './LintPanel';
import SqlEditor, { type SqlEditorHandle } from './SqlEditor';

export interface SqlDesignerHandle {
  /** SVG của ERD (màu tuyệt đối) — để xuất SVG/PNG. */
  svg(): SVGSVGElement | null;
  analysis(): Analysis | null;
  model(): DbModel;
  direction(): 'LR' | 'TB';
  layout(): Record<string, [number, number]> | undefined;
}

const PAPER: Record<ErdVariant, string> = { light: '#fbfaf7', dark: '#141416', print: '#ffffff' };

/** Mô hình để vẽ: bảng đang gõ dở (hoặc cả tệp khi lỗi tách từ) lấy bản đọc được gần nhất. */
function displayModel(a: Analysis, lastGood: DbModel | null): { model: DbModel; broken: Set<string>; stale: boolean } {
  const fatal = a.parse.errors.some((e) => e.fatal);
  if (fatal && lastGood) return { model: lastGood, broken: new Set(), stale: true };
  const broken = new Set<string>();
  const tables: Table[] = a.parse.model.tables.map((t) => {
    if (!t.incomplete) return t;
    broken.add(t.name.toLowerCase());
    const prev = lastGood?.tables.find((x) => sameName(x.name, t.name));
    // Bảng cũ đang sửa ⇒ giữ hình cũ (không nhấp nháy theo từng phím); bảng MỚI đang viết ⇒ hiện phần đã đọc được.
    return prev && prev.columns.length > t.columns.length ? { ...prev, span: t.span, nameSpan: t.nameSpan } : t;
  }).filter((t) => t.columns.length || !t.incomplete);
  return { model: { ...a.parse.model, tables }, broken, stale: false };
}

/**
 * `handleRef` (không phải `ref`): nạp qua `next/dynamic` — dynamic KHÔNG chuyển tiếp ref (xem ExcalidrawEditor).
 */
export default function SqlDesigner(props: {
  handleRef?: MutableRefObject<SqlDesignerHandle | null>;
  source: string;
  onChange: (next: string) => void;
  readOnly: boolean;
  dark: boolean;
  variant: ErdVariant;
  label: string;
  /** Mở ngăn mã (cửa sổ hẹp: thay cho sơ đồ). */
  codeOpen: boolean;
  codeW: number;
  onCodeW: (w: number) => void;
  onToggleCode: () => void;
  lintOpen: boolean;
  lintH: number;
  onLint: (patch: { lintOpen?: boolean; lintH?: number }) => void;
  maximised: boolean;
  onToggleMaximise: () => void;
  onAnalysis?: (a: Analysis) => void;
  onExport: () => void;
  fitKey: string | number;
}) {
  const { handleRef, source, onChange, readOnly, dark, variant, label, codeOpen, codeW, onCodeW, onToggleCode, lintOpen, lintH, onLint, maximised, onToggleMaximise, onAnalysis, onExport, fitKey } = props;
  const { t, locale } = useWT();
  const wide = useMinWidth(900);
  const split = useMemo(() => splitMeta(source), [source]);
  const [text, setText] = useState(split.sql);
  const meta = split.meta;
  // Nguồn đổi từ NGOÀI (xem phiên bản khác, khôi phục, lưu xong…) ⇒ nạp lại chữ. Nguồn do chính mình vừa gửi lên thì bỏ qua:
  // gõ nhanh thì bản gửi lên luôn trễ hơn chữ trong trình soạn — nạp lại nó là nuốt phím và nhảy con trỏ.
  const emitted = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (emitted.current.has(source)) return;
    setText((cur) => (cur.trimEnd() === split.sql.trimEnd() ? cur : split.sql));
  }, [source, split.sql]);
  const emit = useCallback((sql: string, m: SqlMeta) => {
    const next = joinMeta(sql, m);
    emitted.current.add(next);
    if (emitted.current.size > 50) emitted.current = new Set([...emitted.current].slice(-20));
    onChange(next);
  }, [onChange]);

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const lastGood = useRef<DbModel | null>(null);
  const [ms, setMs] = useState(0);
  useEffect(() => {
    const h = setTimeout(() => {
      const t0 = performance.now();
      const a = analyzeSql(joinMeta(text, meta));
      setMs(Math.round(performance.now() - t0));
      setAnalysis(a);
      if (!a.parse.errors.some((e) => e.fatal) && !a.parse.model.tables.some((x) => x.incomplete)) lastGood.current = a.parse.model;
      onAnalysis?.(a);
    }, analysis ? 300 : 0);
    return () => clearTimeout(h);
    // onAnalysis là callback của cha — chỉ đọc lại khi chữ / hệ quản trị đổi.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, meta.dialect]);

  const view = useMemo(() => (analysis ? displayModel(analysis, lastGood.current) : null), [analysis]);
  const model = view?.model ?? { dialect: meta.dialect ?? 'sqlserver', tables: [], enums: [] };
  const problems: Problem[] = useMemo(() => (analysis ? [...analysis.parse.errors, ...analysis.parse.warnings, ...analysis.lint] : []), [analysis]);
  const c = counts(problems);
  const rels = useMemo(() => relationships(model).length, [model]);

  const editor = useRef<SqlEditorHandle>(null);
  const pz = useRef<PanZoomHandle>(null);
  const erd = useRef<ErdHandle>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const selTable = selected ? analysis?.parse.model.tables.find((x) => sameName(x.name, selected)) : undefined;

  useEffect(() => {
    if (!handleRef) return undefined;
    const h: SqlDesignerHandle = {
      svg: () => erd.current?.svgElement() ?? null, analysis: () => analysis, model: () => model,
      direction: () => meta.direction ?? 'LR', layout: () => meta.layout,
    };
    handleRef.current = h;
    return () => { if (handleRef.current === h) handleRef.current = null; };
  }, [handleRef, analysis, model, meta.direction, meta.layout]);

  const selectFromErd = (name: string | null, column?: string) => {
    setSelected(name);
    if (!name) return;
    const tb = analysis?.parse.model.tables.find((x) => sameName(x.name, name));
    if (!tb) return;
    const col = column ? tb.columns.find((x) => sameName(x.name, column)) : undefined;
    if (!codeOpen && !wide) return;
    editor.current?.reveal(col?.nameSpan ?? tb.nameSpan, { select: true });
  };
  const lastCursorTable = useRef<string | null>(null);
  const onCursor = (offset: number) => {
    const tb = analysis?.parse.model.tables.find((x) => offset >= x.span.start && offset <= x.span.end);
    const name = tb?.name ?? null;
    if (name === lastCursorTable.current) return;
    lastCursorTable.current = name;
    if (!name) return;
    setSelected(name);
    const r = erd.current?.rectOf(name);
    if (r) pz.current?.reveal(r);
  };
  const jump = (p: Problem) => {
    if (p.table) setSelected(p.table);
    if (!codeOpen) onToggleCode();
    if (p.span) setTimeout(() => editor.current?.reveal(p.span!, { select: true, focus: true }), codeOpen ? 0 : 60);
  };

  const setMeta = (m: Partial<SqlMeta>) => emit(text, { ...meta, ...m });
  const onMove = (name: string, x: number, y: number) => {
    if (readOnly) return;
    // Lần kéo đầu ⇒ "đóng băng" chỗ của mọi bảng (để các bảng khác không tự nhảy); bảng đã xoá thì bỏ khỏi bố cục.
    const base = meta.layout ?? erd.current?.positions() ?? {};
    const all: Record<string, [number, number]> = Object.fromEntries(Object.entries(base).filter(([k]) => model.tables.some((tb) => tb.name === k)));
    all[name] = [x, y];
    setMeta({ layout: all });
  };
  const importFile = async (f: File) => {
    const sql = (await f.text()).replace(/^﻿/, '').replace(/\r\n?/g, '\n');
    const a = analyzeSql(sql);
    if (!a.parse.model.tables.length) { toast.error(t('dbd.importNoTables')); return; }
    if (text.trim() && !window.confirm(t('dbd.importReplace', { count: a.parse.model.tables.length }))) return;
    setText(sql);
    emit(sql, { dialect: a.parse.detected ?? meta.dialect, direction: meta.direction });
    toast.success(t('dbd.imported', { count: a.parse.model.tables.length, dialect: DIALECT_LABEL[a.parse.dialect] }));
  };
  const fileInput = useRef<HTMLInputElement>(null);

  const showCode = codeOpen;
  const showErd = wide || !codeOpen;
  const direction = meta.direction ?? 'LR';
  const detected = analysis?.parse.detected;

  const toolbar = (
    <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-b border-[var(--w-border)] px-2 py-1.5 text-[12px]">
      <label className="flex items-center gap-1">
        <span className="whitespace-nowrap text-[var(--w-text-3)] max-sm:hidden">{t('dbd.dialect')}</span>
        <select className="w-input h-7 py-0 text-[12px]" value={meta.dialect ?? 'auto'} disabled={readOnly} onChange={(e) => setMeta({ dialect: e.target.value === 'auto' ? undefined : (e.target.value as Dialect) })} aria-label={t('dbd.dialect')}>
          <option value="auto">{t('dbd.autoDetect')}{detected ? ` (${DIALECT_LABEL[detected]})` : ''}</option>
          {SOURCE_DIALECTS.map((d) => <option key={d} value={d}>{DIALECT_LABEL[d]}</option>)}
        </select>
      </label>
      <div className="inline-flex rounded-[6px] border border-[var(--w-border)] p-0.5" role="group" aria-label={t('dbd.direction')}>
        {(['LR', 'TB'] as const).map((d) => (
          <button key={d} type="button" disabled={readOnly && d !== direction} aria-pressed={direction === d} onClick={() => setMeta({ direction: d, layout: undefined })} title={t(d === 'LR' ? 'dbd.dirLR' : 'dbd.dirTB')}
            className={cn('rounded-[4px] px-1.5 py-0.5', direction === d ? 'bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'text-[var(--w-text-2)]')}>
            {d === 'LR' ? <ArrowLeftRight size={13} /> : <ArrowDownUp size={13} />}
          </button>
        ))}
      </div>
      {!readOnly && <button type="button" className="w-btn w-btn-sm" disabled={!meta.layout} onClick={() => setMeta({ layout: undefined })} title={t('dbd.autoLayoutHint')}><LayoutGrid size={13} /> <span className="max-md:hidden">{t('dbd.autoLayout')}</span></button>}
      {!readOnly && (
        <>
          <button type="button" className="w-btn w-btn-sm" onClick={() => fileInput.current?.click()} title={t('dbd.openSqlHint')}><FileUp size={13} /> <span className="max-md:hidden">{t('dbd.openSql')}</span></button>
          <input ref={fileInput} type="file" accept=".sql,.ddl,.txt,text/plain,application/sql" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) void importFile(f); }} />
        </>
      )}
      <span className="flex-1" />
      <button type="button" className={cn('w-btn w-btn-sm', lintOpen && 'w-btn-primary')} aria-pressed={lintOpen} onClick={() => onLint({ lintOpen: !lintOpen })}>
        <ListChecks size={13} />
        <span className="max-sm:hidden">{t('dbd.checks')}</span>
        {c.error > 0 && <span className="rounded-full bg-[var(--w-red-soft,rgba(207,52,47,0.14))] px-1.5 text-[11px] font-semibold text-[var(--w-red-text)]">{c.error}</span>}
        {c.warning > 0 && <span className="rounded-full bg-[var(--w-yellow-soft,rgba(154,116,16,0.14))] px-1.5 text-[11px] font-semibold text-[var(--w-yellow-text)]">{c.warning}</span>}
        {!c.error && !c.warning && c.info > 0 && <span className="rounded-full bg-[var(--w-accent-soft)] px-1.5 text-[11px] text-[var(--w-accent-text)]">{c.info}</span>}
      </button>
      <button type="button" className="w-btn w-btn-sm" onClick={onExport} disabled={!model.tables.length}><Package size={13} /> {t('dbd.exportScripts')}</button>
    </div>
  );

  const status = (
    <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-0.5 border-t border-[var(--w-border)] px-2.5 py-1 text-[11.5px] text-[var(--w-text-2)]" role="status" aria-live="polite">
      <span>{t('dbd.tablesN', { count: model.tables.length })}</span>
      <span>{t('dbd.relsN', { count: rels })}</span>
      <span>{analysis ? `${DIALECT_LABEL[analysis.parse.dialect]}${!meta.dialect && detected ? ` · ${t('dbd.detected')}` : ''}` : '…'}</span>
      {c.error > 0 ? <button type="button" className="text-[var(--w-red-text)] hover:underline" onClick={() => { const e = problems.find((p) => p.severity === 'error'); if (e) jump(e); }}>{t('dbd.errorsN', { count: c.error })}{analysis?.parse.errors[0]?.span ? ` — ${t('dbd.lineN', { n: analysis.parse.errors[0].span.line })}: ${locale === 'vi' ? analysis.parse.errors[0].message.vi : analysis.parse.errors[0].message.en}` : ''}</button> : <span className="text-[var(--w-green-text)]">{t('dbd.noErrors')}</span>}
      {view?.stale && <span className="text-[var(--w-yellow-text)]">{t('dbd.staleDrawing')}</span>}
      <span className="flex-1" />
      {Object.keys(analysis?.parse.skipped ?? {}).length > 0 && <span className="max-md:hidden" title={Object.entries(analysis!.parse.skipped).map(([k, v]) => `${v} × ${k}`).join('\n')}>{t('dbd.skippedN', { count: Object.values(analysis!.parse.skipped).reduce((s, v) => s + v, 0) })}</span>}
      <span className="font-mono text-[var(--w-text-3)] max-md:hidden">{ms} ms</span>
    </div>
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      {toolbar}
      <div className="flex min-h-0 flex-1">
        {showCode && (
          <div className={cn('flex min-h-0 flex-col', wide ? 'shrink-0' : 'flex-1')} style={wide ? { width: codeW } : undefined}>
            <div className="min-h-0 flex-1">
              <SqlEditor ref={editor} value={text} readOnly={readOnly} dark={dark} problems={problems} model={analysis?.parse.model ?? null} dialect={analysis?.parse.dialect ?? 'sqlserver'}
                highlight={selTable?.span ?? null} onCursor={onCursor} label={t('dbd.editorLabel')}
                onChange={(v) => { setText(v); emit(v, meta); }} />
            </div>
          </div>
        )}
        {showCode && wide && <Splitter value={codeW} min={LIMITS.codeW[0]} max={LIMITS.codeW[1]} onChange={onCodeW} side="left" onToggle={onToggleCode} label={t('dbd.resizeCode')} />}
        {showErd && (
          <div className="relative min-h-0 min-w-0 flex-1">
            {model.tables.length ? (
              <PanZoom ref={pz} fitKey={fitKey} label={label} background={PAPER[variant]} maximised={maximised} onToggleMaximise={onToggleMaximise} onBackgroundClick={() => setSelected(null)}
                minimap={(s) => <ErdMinimap model={model} direction={direction} layout={meta.layout} variant={variant} width={s.w} height={s.h} />}>
                <ErdCanvas ref={erd} model={model} variant={variant} direction={direction} layout={meta.layout} selected={selected} broken={view?.broken} editable={!readOnly}
                  getScale={() => pz.current?.scale() ?? 1} onSelect={selectFromErd} onMove={onMove} />
              </PanZoom>
            ) : (
              <div className="grid h-full place-items-center p-6 text-center text-[13px] text-[var(--w-text-2)]" style={{ background: PAPER[variant] }}>
                <div className="max-w-[360px]"><p className="font-medium text-[var(--w-text)]">{t('dbd.emptyErd')}</p><p className="mt-1">{t('dbd.emptyErdHint')}</p></div>
              </div>
            )}
          </div>
        )}
      </div>
      {status}
      {lintOpen && (
        <>
          <Splitter orientation="horizontal" value={lintH} min={LIMITS.lintH[0]} max={LIMITS.lintH[1]} onChange={(h) => onLint({ lintH: h })} side="bottom" onToggle={() => onLint({ lintOpen: false })} label={t('dbd.resizeChecks')} />
          <div className="shrink-0 border-t border-[var(--w-border)]" style={{ height: lintH }}>
            <LintPanel problems={problems} onJump={jump} onClose={() => onLint({ lintOpen: false })} />
          </div>
        </>
      )}
    </div>
  );
}
