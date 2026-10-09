'use client';

/**
 * CTW Diagram — các hộp thoại: tạo mới (mẫu / trống / bảng vẽ), AI vẽ từ dữ liệu dự án, nhập tệp, chèn vào trang Docs.
 */

import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FileUp, PenTool, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workDocsApi, workError } from '@/lib/work-api';
import { workCtw4Api, workCtw4Keys } from '@/lib/work-ctw4-api';
import { GENERATABLE, workDiagramsApi, type DiagramDetail, type GenerateResult, type GeneratableType } from '@/lib/work-diagrams-api';
import { Dialog, Field, Spinner } from '@/components/work/ui';
import { useWT, type WKey } from '@/components/work/i18n';
import { MermaidPreview } from './MermaidEditor';
import { TEMPLATES } from './templates';
import { isDarkTheme } from './render';

export const typeKey = (t: string) => `diagram.type_${t}` as WKey;

// ─── Tạo mới ─────────────────────────────────────────────────────

export function NewDialog({ pid, open, onClose, onCreated }: { pid: number; open: boolean; onClose: () => void; onCreated: (d: DiagramDetail) => void }) {
  const { t } = useWT();
  const [pick, setPick] = useState<string>('sequence');
  const [title, setTitle] = useState('');
  const tpl = TEMPLATES.find((x) => x.id === pick);
  const run = useMutation({
    mutationFn: () => pick === 'whiteboard'
      ? workDiagramsApi.create(pid, { format: 'EXCALIDRAW', type: 'WHITEBOARD', title: title.trim() || t('diagram.untitledWhiteboard'), source: JSON.stringify({ type: 'excalidraw', elements: [], appState: {}, files: {} }) })
      : workDiagramsApi.create(pid, { format: 'MERMAID', type: tpl!.type, title: title.trim() || t(tpl!.name), source: tpl!.source }),
    onSuccess: (d) => { onCreated(d); onClose(); setTitle(''); },
    onError: (e) => toast.error(workError(e, t('diagram.createFailed'))),
  });
  return (
    <Dialog open={open} onClose={onClose} title={t('diagram.newTitle')} width={860}
      footer={<><button type="button" className="w-btn" onClick={onClose}>{t('common.cancel')}</button><button type="button" className="w-btn w-btn-primary" disabled={run.isPending} onClick={() => run.mutate()}>{run.isPending ? <Spinner size={12} /> : null} {t('diagram.create')}</button></>}>
      <Field label={t('diagram.titleField')}><input className="w-input" value={title} placeholder={pick === 'whiteboard' ? t('diagram.untitledWhiteboard') : tpl ? t(tpl.name) : ''} onChange={(e) => setTitle(e.target.value)} /></Field>
      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[1fr_1.2fr]">
        <div role="radiogroup" aria-label={t('diagram.startFrom')} className="grid max-h-[420px] grid-cols-2 gap-1.5 overflow-y-auto pr-1">
          {[...TEMPLATES.map((x) => ({ id: x.id, name: t(x.name), hint: t(x.hint) })), { id: 'whiteboard', name: t('diagram.tplWhiteboard'), hint: t('diagram.tplWhiteboardHint') }].map((x) => (
            <button key={x.id} type="button" role="radio" aria-checked={pick === x.id} onClick={() => setPick(x.id)}
              className={cn('rounded-[8px] border px-2.5 py-2 text-left transition-colors', pick === x.id ? 'border-[var(--w-accent)] bg-[var(--w-accent-soft)]' : 'border-[var(--w-border)] hover:bg-[var(--w-hover)]')}>
              <span className="block text-[13px] font-semibold">{x.name}</span>
              <span className="block text-[11.5px] leading-snug text-[var(--w-text-2)]">{x.hint}</span>
            </button>
          ))}
        </div>
        <div className="min-h-[260px] overflow-auto rounded-[8px] border border-[var(--w-border)]" tabIndex={0} role="region" aria-label={t('diagram.previewRegion')}>
          {pick === 'whiteboard' ? (
            <div className="grid h-full place-items-center p-6 text-center text-[13px] text-[var(--w-text-2)]"><span><PenTool className="mx-auto mb-2" size={22} aria-hidden="true" />{t('diagram.tplWhiteboardHint')}</span></div>
          ) : tpl ? <MermaidPreview source={tpl.source} variant={isDarkTheme() ? 'dark' : 'light'} label={t(tpl.name)} /> : null}
        </div>
      </div>
    </Dialog>
  );
}

// ─── AI vẽ từ dữ liệu ────────────────────────────────────────────

const NEEDS_UC: GeneratableType[] = ['SEQUENCE'];
const SOURCE_HINT: Record<GeneratableType, WKey> = {
  SEQUENCE: 'diagram.srcSequence', USE_CASE: 'diagram.srcUseCase', ERD: 'diagram.srcErd', CLASS: 'diagram.srcClass', ACTIVITY: 'diagram.srcActivity',
  STATE: 'diagram.srcState', SCREEN_FLOW: 'diagram.srcScreenFlow', DEPLOYMENT: 'diagram.srcDeployment', ARCHITECTURE: 'diagram.srcArchitecture', DATA_FLOW: 'diagram.srcDataFlow',
};

export function GenerateDialog({ pid, open, onClose, onDone, preset }: { pid: number; open: boolean; onClose: () => void; onDone: (r: GenerateResult) => void; preset?: { type?: GeneratableType; useCase?: number } }) {
  const { t } = useWT();
  const [type, setType] = useState<GeneratableType>(preset?.type ?? 'SEQUENCE');
  const [uc, setUc] = useState<string>(preset?.useCase ? String(preset.useCase) : '');
  const [feature, setFeature] = useState('');
  const [entities, setEntities] = useState('');
  const [instruction, setInstruction] = useState('');
  const srs = useQuery({ queryKey: workCtw4Keys.srs(pid), queryFn: () => workCtw4Api.srs(pid), enabled: open });
  const ucs = useMemo(() => (srs.data?.useCases ?? []).filter((u) => u.status !== 'PROPOSED'), [srs.data]);
  const features = useMemo(() => [...new Set((srs.data?.useCases ?? []).map((u) => u.feature).filter((x): x is string => !!x))], [srs.data]);
  const needUc = NEEDS_UC.includes(type);
  const run = useMutation({
    mutationFn: () => workDiagramsApi.generate(pid, {
      type, useCase: uc ? Number(uc) : null, feature: feature || null,
      entities: entities.trim() ? entities.split(',').map((x) => x.trim()).filter(Boolean) : null, instruction: instruction.trim() || null,
    }),
    onSuccess: (r) => { onDone(r); onClose(); },
    onError: (e) => toast.error(workError(e, t('diagram.generateFailed')), { duration: 9000 }),
  });
  return (
    <Dialog open={open} onClose={onClose} title={<span className="flex items-center gap-1.5"><Sparkles size={15} aria-hidden="true" /> {t('diagram.generateTitle')}</span>} width={600}
      footer={<><button type="button" className="w-btn" onClick={onClose}>{t('common.cancel')}</button><button type="button" className="w-btn w-btn-primary" disabled={run.isPending || (needUc && !uc)} onClick={() => run.mutate()}>{run.isPending ? <Spinner size={12} /> : <Sparkles size={14} />} {run.isPending ? t('diagram.drawing') : t('diagram.draw')}</button></>}>
      <p className="mb-3 text-[13px] text-[var(--w-text-2)]">{t('diagram.generateIntro')}</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label={t('diagram.typeField')}>
          <select className="w-input" value={type} onChange={(e) => setType(e.target.value as GeneratableType)}>
            {GENERATABLE.map((x) => <option key={x} value={x}>{t(typeKey(x))}</option>)}
          </select>
        </Field>
        {(needUc || type === 'ACTIVITY') && (
          <Field label={needUc ? t('diagram.useCaseRequired') : t('diagram.useCaseOptional')}>
            <select className="w-input" value={uc} onChange={(e) => setUc(e.target.value)}>
              <option value="">{needUc ? t('diagram.chooseUseCase') : t('diagram.projectWorkflow')}</option>
              {ucs.map((u) => <option key={u.number} value={u.number}>{u.key} {u.name}</option>)}
            </select>
          </Field>
        )}
        {(type === 'USE_CASE' || type === 'SCREEN_FLOW' || type === 'CLASS') && (
          <Field label={type === 'CLASS' ? t('diagram.packageFilter') : t('diagram.featureOptional')}>
            {type === 'CLASS' ? <input className="w-input" value={feature} onChange={(e) => setFeature(e.target.value)} placeholder="booking" />
              : <select className="w-input" value={feature} onChange={(e) => setFeature(e.target.value)}><option value="">{t('diagram.allFeatures')}</option>{features.map((f) => <option key={f} value={f}>{f}</option>)}</select>}
          </Field>
        )}
        {(type === 'ERD' || type === 'STATE') && (
          <Field label={type === 'ERD' ? t('diagram.entitiesOptional') : t('diagram.stateEntity')} hint={type === 'STATE' ? t('diagram.stateEntityHint') : undefined}>
            <input className="w-input" value={entities} onChange={(e) => setEntities(e.target.value)} placeholder={type === 'ERD' ? 'User, Reservation, Lab' : 'Reservation'} />
          </Field>
        )}
      </div>
      {(type === 'ARCHITECTURE' || type === 'DATA_FLOW' || type === 'DEPLOYMENT' || type === 'ERD') && (
        <Field label={t('diagram.instructionOptional')}><textarea className="w-input min-h-[64px]" value={instruction} onChange={(e) => setInstruction(e.target.value)} maxLength={1000} /></Field>
      )}
      <p className="mt-3 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 text-[12.5px] text-[var(--w-text-2)]">{t(SOURCE_HINT[type])}</p>
      <p className="mt-2 text-[12px] text-[var(--w-text-3)]">{t('diagram.generateNote')}</p>
    </Dialog>
  );
}

// ─── Nhập tệp ────────────────────────────────────────────────────

export function ImportDialog({ pid, open, onClose, onDone }: { pid: number; open: boolean; onClose: () => void; onDone: (d: DiagramDetail & { fidelity?: { notes: string[]; merged: string[]; dropped: string[] } }) => void }) {
  const { t } = useWT();
  const [file, setFile] = useState<File | null>(null);
  const [toMermaid, setToMermaid] = useState(false);
  const [page, setPage] = useState(0);
  const run = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error(t('diagram.chooseFile'));
      if (file.size > 8 * 1024 * 1024) throw new Error(t('diagram.fileTooLarge'));
      const buf = new Uint8Array(await file.arrayBuffer());
      let bin = '';
      for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
      return workDiagramsApi.importFile(pid, { fileName: file.name, content: btoa(bin), base64: true, page, to: toMermaid ? 'mermaid' : 'native' });
    },
    onSuccess: (d) => { onDone(d); onClose(); setFile(null); },
    onError: (e) => toast.error(workError(e, t('diagram.importFailed')), { duration: 9000 }),
  });
  const isEx = !!file && /\.excalidraw(\.json)?$/i.test(file.name);
  const isDrawio = !!file && /\.(drawio|xml)|\.drawio\.(png|svg)$/i.test(file.name);
  return (
    <Dialog open={open} onClose={onClose} title={<span className="flex items-center gap-1.5"><FileUp size={15} aria-hidden="true" /> {t('diagram.importTitle')}</span>} width={540}
      footer={<><button type="button" className="w-btn" onClick={onClose}>{t('common.cancel')}</button><button type="button" className="w-btn w-btn-primary" disabled={!file || run.isPending} onClick={() => run.mutate()}>{run.isPending ? <Spinner size={12} /> : null} {t('diagram.import')}</button></>}>
      <p className="mb-3 text-[13px] text-[var(--w-text-2)]">{t('diagram.importIntro')}</p>
      <Field label={t('diagram.fileField')}>
        <input type="file" className="w-input" accept=".drawio,.xml,.png,.svg,.excalidraw,.json,.mmd,.mermaid,.md,.txt" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </Field>
      {isEx && <label className="mt-2 flex items-center gap-2 text-[13px]"><input type="checkbox" checked={toMermaid} onChange={(e) => setToMermaid(e.target.checked)} /> {t('diagram.convertToMermaid')}</label>}
      {isDrawio && <Field label={t('diagram.drawioPage')}><input type="number" min={1} max={100} className="w-input w-24" value={page + 1} onChange={(e) => setPage(Math.max(0, Number(e.target.value) - 1))} /></Field>}
      <p className="mt-3 text-[12px] text-[var(--w-text-3)]">{t('diagram.importPrivacy')}</p>
    </Dialog>
  );
}

// ─── Chèn vào Docs ───────────────────────────────────────────────

export function InsertDialog({ pid, diagram, open, onClose }: { pid: number; diagram: DiagramDetail; open: boolean; onClose: () => void }) {
  const { t } = useWT();
  const [page, setPage] = useState<number | null>(diagram.page?.number ?? null);
  const [heading, setHeading] = useState('');
  const [mode, setMode] = useState<'latest' | 'pinned'>('latest');
  const pages = useQuery({ queryKey: ['work', 'pages', pid, 'list-for-diagram'], queryFn: () => workDocsApi.list(pid), enabled: open });
  const heads = useQuery({ queryKey: ['work', 'diagrams', pid, 'headings', page], queryFn: () => workDiagramsApi.headings(pid, page!), enabled: open && !!page });
  const run = useMutation({
    mutationFn: () => workDiagramsApi.embed(pid, diagram.number, { page: page!, mode, heading: heading || null }),
    onSuccess: (r) => { toast.success(t('diagram.inserted', { page: r.page.title })); onClose(); },
    onError: (e) => toast.error(workError(e, t('diagram.insertFailed'))),
  });
  return (
    <Dialog open={open} onClose={onClose} title={t('diagram.insertTitle', { key: diagram.key })} width={540}
      footer={<><button type="button" className="w-btn" onClick={onClose}>{t('common.cancel')}</button><button type="button" className="w-btn w-btn-primary" disabled={!page || run.isPending || heads.data?.canEdit === false} onClick={() => run.mutate()}>{run.isPending ? <Spinner size={12} /> : null} {t('diagram.insert')}</button></>}>
      <Field label={t('diagram.pageField')}>
        <select className="w-input" value={page ?? ''} onChange={(e) => { setPage(Number(e.target.value) || null); setHeading(''); }}>
          <option value="">{t('diagram.choosePage')}</option>
          {(pages.data?.pages ?? []).map((p) => <option key={p.number} value={p.number}>DOC-{p.number} {p.title}</option>)}
        </select>
      </Field>
      {page && (
        <Field label={t('diagram.placeField')}>
          <select className="w-input" value={heading} onChange={(e) => setHeading(e.target.value)}>
            <option value="">{t('diagram.endOfPage')}</option>
            {(heads.data?.headings ?? []).map((h, i) => <option key={`${i}-${h.text}`} value={h.text}>{'  '.repeat(Math.max(0, h.level - 1))}{h.text}</option>)}
          </select>
        </Field>
      )}
      {heads.data?.canEdit === false && <p className="text-[12.5px] text-[var(--w-red-text)]">{t('diagram.pageReadOnly')}</p>}
      <fieldset className="mt-3">
        <legend className="mb-1 text-[12.5px] font-medium">{t('diagram.updateMode')}</legend>
        <label className="flex items-start gap-2 text-[13px]"><input type="radio" name="mode" checked={mode === 'latest'} onChange={() => setMode('latest')} className="mt-1" /><span>{t('diagram.modeLatest')}</span></label>
        <label className="mt-1 flex items-start gap-2 text-[13px]"><input type="radio" name="mode" checked={mode === 'pinned'} onChange={() => setMode('pinned')} className="mt-1" /><span>{t('diagram.modePinned', { v: diagram.currentVersion })}</span></label>
      </fieldset>
    </Dialog>
  );
}
