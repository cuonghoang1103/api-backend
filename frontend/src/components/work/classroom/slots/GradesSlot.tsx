'use client';

/**
 * ĐIỂM CẮM CỦA 9b — Sổ điểm (tab Grades). Khung (ClassShell) do 9a sở hữu. Hợp đồng: `slots/types.ts`.
 *
 *   Bảng SV × mục (bài tập 9b + quiz 9c + nguồn khác qua `classGradebookSources.ts`), điểm tổng hệ 10 theo trọng số
 *   loại / chủ đề, lọc + sắp xếp (DataTable), xuất xlsx, nhập điểm từ xlsx (xem trước lỗi từng dòng ⇒ xác nhận).
 *   GV thấy điểm NHÁP (chữ nghiêng, chưa trả); SV chỉ thấy dòng của mình, chỉ điểm đã trả.
 * Mọi hook đặt TRƯỚC lệnh return sớm.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { BookCheck, Download, FileUp, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { Dialog, EmptyState, Field, PageLoading, Spinner } from '@/components/work/ui';
import { Select } from '@/components/work/settings/shared';
import DataTable, { type DataColumn } from '@/components/work/table/DataTable';
import { useWT, type WKey } from '@/components/work/i18n';
import { saveBlob } from '@/components/work/teaching/teachingApi';
import { classworkApi, classworkKeys, readGradeFile, type Gradebook, type GradebookMode, type GradebookRow, type GradeImportPreview } from '../classworkApi';
import { StateChip, pts } from '../classwork/common';
import type { ClassSlotProps } from './types';

export default function GradesSlot({ cls, goTab }: ClassSlotProps) {
  const { t, locale } = useWT();
  const [weightsOpen, setWeightsOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const q = useQuery({ queryKey: classworkKeys.gradebook(cls.id), queryFn: () => classworkApi.gradebook(cls.id) });
  const exp = useMutation({
    mutationFn: () => classworkApi.exportGradebook(cls.id),
    onSuccess: (blob) => saveBlob(blob, `ctwork-grades-${cls.classCode}-${cls.term}.xlsx`),
    onError: (err) => toast.error(workError(err)),
  });
  const g = q.data;

  const columns = useMemo<DataColumn<GradebookRow>[]>(() => {
    if (!g) return [];
    const cols: DataColumn<GradebookRow>[] = [
      { id: 'name', header: t('c9b.colStudent'), width: 190, required: true, value: (r) => r.name, text: (r) => `${r.name} ${r.studentCode ?? ''}`, cell: (r) => (
        <div className="min-w-0"><div className="truncate font-medium">{r.name}</div>{r.studentCode && <div className="text-[12px] text-[var(--w-text-3)]">{r.studentCode}</div>}</div>
      ) },
      { id: 'group', header: t('c9b.colGroup'), width: 110, value: (r) => r.group?.name ?? null, hideBelow: 'md' },
      { id: 'total', header: t('c9b.colTotal'), width: 92, align: 'right', value: (r) => r.total, headerTitle: t(`c9b.mode_${g.settings.mode}`), cell: (r) => <span className="font-semibold tabular-nums" data-testid="gb-total">{pts(r.total, locale)}</span> },
    ];
    for (const it of g.items) {
      cols.push({
        id: it.key, header: it.title, width: 120, align: 'right', headerTitle: `${it.title} · ${it.category}${it.topic ? ` · ${it.topic}` : ''} · /${it.maxPoints}`,
        value: (r) => r.cells[it.key]?.points ?? null,
        exportValue: (r) => r.cells[it.key]?.points ?? '',
        cell: (r) => {
          const c = r.cells[it.key];
          if (!c || c.state === 'NOT_ASSIGNED') return <span className="text-[var(--w-text-3)]" title={t('c9b.state_NOT_ASSIGNED')}>·</span>;
          if (c.points !== null) {
            return (
              <span className={cn('tabular-nums', !c.released && 'italic text-[var(--w-text-2)]')} title={!c.released ? t('c9b.draftCell') : undefined}>
                {pts(c.points, locale)}<span className="text-[var(--w-text-3)]">/{pts(it.maxPoints, locale)}</span>{!c.released && <span className="sr-only"> {t('c9b.draftCell')}</span>}
              </span>
            );
          }
          return c.state === 'ASSIGNED' ? <span className="text-[var(--w-text-3)]">—</span> : <StateChip state={c.state} />;
        },
      });
    }
    return cols;
  }, [g, t, locale]);

  if (q.isLoading) return <PageLoading rows={5} />;
  if (q.error || !g) return <EmptyState title={workError(q.error)} />;
  if (!g.items.length) return <EmptyState icon={<BookCheck size={20} />} title={t('c9b.gbEmptyTitle')} body={t('c9b.gbEmptyBody')} action={<button type="button" className="w-btn" onClick={() => goTab('classwork')}>{t('c9b.openClasswork')}</button>} />;

  if (!g.manage) {
    const r = g.rows[0];
    return (
      <section aria-labelledby="gb-mine" className="space-y-3" data-testid="gb-student">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h3 id="gb-mine" className="text-[15px] font-semibold">{t('c9b.myGrades')}</h3>
          <div className="text-right"><div className="text-[12px] text-[var(--w-text-2)]">{t('c9b.overall')}</div><div className="text-[22px] font-semibold tabular-nums">{pts(r?.total, locale)}<span className="text-[14px] text-[var(--w-text-3)]">/10</span></div></div>
        </div>
        <ul className="divide-y divide-[var(--w-border)] overflow-hidden rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)]">
          {g.items.map((it) => {
            const c = r?.cells[it.key];
            return (
              <li key={it.key} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3.5 py-2.5">
                <button type="button" className="min-w-0 flex-1 text-left" onClick={() => it.link && goTab('classwork', Object.fromEntries(Object.entries(it.link).filter(([k]) => k !== 'tab')))}>
                  <span className="block truncate text-[13.5px] font-medium hover:underline">{it.title}</span>
                  <span className="block text-[12px] text-[var(--w-text-2)]">{it.category}{it.topic ? ` · ${it.topic}` : ''}</span>
                </button>
                {c?.points !== null && c?.points !== undefined ? <span className="tabular-nums text-[14px] font-semibold">{pts(c.points, locale)}<span className="text-[12px] font-normal text-[var(--w-text-3)]">/{pts(it.maxPoints, locale)}</span></span> : c && <StateChip state={c.state} />}
              </li>
            );
          })}
        </ul>
        <p className="text-[12px] text-[var(--w-text-3)]">{t('c9b.studentGbNote')}</p>
      </section>
    );
  }

  return (
    <section aria-labelledby="gb-h" className="space-y-3" data-testid="gb-teacher">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 id="gb-h" className="text-[15px] font-semibold">{t('c9b.gradebook')}</h3>
          <p className="text-[12.5px] text-[var(--w-text-2)]">{t(`c9b.mode_${g.settings.mode}`)}{g.classAverage !== null ? ` · ${t('c9b.classAverage', { avg: pts(g.classAverage, locale) })}` : ''} · {t('c9b.draftLegend')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="w-btn" onClick={() => setWeightsOpen(true)} data-testid="gb-weights"><Scale size={14} />{t('c9b.weights')}</button>
          <button type="button" className="w-btn" onClick={() => setImportOpen(true)} data-testid="gb-import"><FileUp size={14} />{t('c9b.importXlsx')}</button>
          <button type="button" className="w-btn" disabled={exp.isPending} onClick={() => exp.mutate()} data-testid="gb-export">{exp.isPending ? <Spinner size={13} /> : <Download size={14} />}{t('c9b.exportXlsx')}</button>
        </div>
      </div>
      <DataTable<GradebookRow>
        id={`gradebook-${cls.id}`} label={t('c9b.gradebook')} rows={g.rows} columns={columns} rowKey={(r) => r.userId}
        quickFilter filterPlaceholder={t('c9b.filterStudents')} exportable={false} pinColumns={1} paging="auto" height="auto"
        defaultSort={{ col: 'name', dir: 'asc' }}
        empty={<p className="p-6 text-center text-[13px] text-[var(--w-text-2)]">{t('c9b.noStudents')}</p>}
      />
      <WeightsDialog open={weightsOpen} onClose={() => setWeightsOpen(false)} classId={cls.id} g={g} />
      <ImportDialog open={importOpen} onClose={() => setImportOpen(false)} classId={cls.id} />
    </section>
  );
}

function WeightsDialog({ open, onClose, classId, g }: { open: boolean; onClose: () => void; classId: number; g: Gradebook }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const [mode, setMode] = useState<GradebookMode>(g.settings.mode);
  const [w, setW] = useState<Record<string, string>>({});
  const [missingAsZero, setMissing] = useState(g.settings.missingAsZero);
  useEffect(() => {
    if (!open) return;
    setMode(g.settings.mode);
    setMissing(g.settings.missingAsZero);
    setW(Object.fromEntries(Object.entries(g.settings.weights).map(([k, v]) => [k, String(v)])));
  }, [open, g.settings]);
  const keys = mode === 'TOPIC' ? g.topics : g.categories;
  const sum = keys.reduce((a, k) => a + (Number(w[k]) || 0), 0);
  const save = useMutation({
    mutationFn: () => classworkApi.gradebookSettings(classId, {
      mode, missingAsZero, ...(mode === 'POINTS' ? {} : { weights: Object.fromEntries(keys.map((k) => [k, Number(w[k]) || 0])) }),
    }),
    onSuccess: (data) => { qc.setQueryData(classworkKeys.gradebook(classId), data); toast.success(t('c9b.saved')); onClose(); },
    onError: (err) => toast.error(workError(err)),
  });
  return (
    <Dialog open={open} onClose={onClose} title={t('c9b.weightsTitle')} width={520}
      footer={<>
        <button type="button" className="w-btn" onClick={onClose}>{t('c9b.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={save.isPending || (mode !== 'POINTS' && Math.abs(sum - 100) > 0.01)} onClick={() => save.mutate()}>{save.isPending && <Spinner size={13} />}{t('c9b.save')}</button>
      </>}>
      <Field label={t('c9b.gradingMode')}>
        <Select value={mode} onChange={(e) => setMode(e.target.value as GradebookMode)}>
          {(['POINTS', 'CATEGORY', 'TOPIC'] as const).map((m) => <option key={m} value={m}>{t(`c9b.mode_${m}`)}</option>)}
        </Select>
      </Field>
      {mode !== 'POINTS' && (
        <div className="mb-4 space-y-1.5">
          {keys.map((k) => (
            <label key={k} className="grid grid-cols-[minmax(0,1fr)_100px] items-center gap-2 text-[13px]">
              <span className="truncate">{k}</span>
              <input className="w-input text-right" type="number" min={0} max={100} value={w[k] ?? ''} aria-label={t('c9b.weightFor', { name: k })} onChange={(e) => setW({ ...w, [k]: e.target.value })} />
            </label>
          ))}
          <p className={cn('text-right text-[12.5px] tabular-nums', Math.abs(sum - 100) > 0.01 ? 'text-[var(--w-red-text)]' : 'text-[var(--w-text-2)]')}>{t('c9b.weightSum', { sum: Math.round(sum * 100) / 100 })}</p>
        </div>
      )}
      <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" className="h-4 w-4 accent-[var(--w-accent)]" checked={missingAsZero} onChange={(e) => setMissing(e.target.checked)} />{t('c9b.missingAsZero')}</label>
    </Dialog>
  );
}

function ImportDialog({ open, onClose, classId }: { open: boolean; onClose: () => void; classId: number }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [src, setSrc] = useState<{ xlsxBase64?: string; csv?: string } | null>(null);
  const [name, setName] = useState('');
  const [pv, setPv] = useState<GradeImportPreview | null>(null);
  useEffect(() => { if (open) { setSrc(null); setPv(null); setName(''); } }, [open]);
  const preview = useMutation({
    mutationFn: (s: { xlsxBase64?: string; csv?: string }) => classworkApi.importPreview(classId, s),
    onSuccess: setPv,
    onError: (err) => toast.error(workError(err)),
  });
  const run = useMutation({
    mutationFn: () => classworkApi.importGrades(classId, { ...src!, confirm: true }),
    onSuccess: (r) => { toast.success(t('c9b.imported', { count: r.written ?? 0 })); qc.invalidateQueries({ queryKey: ['work', 'class', classId] }); onClose(); },
    onError: (err) => toast.error(workError(err)),
  });
  const errText = (e: string) => {
    const [code, col] = e.split(':');
    return t(`c9b.importErr_${code}` as WKey, { col: col ?? '' });
  };
  return (
    <Dialog open={open} onClose={onClose} title={t('c9b.importTitle')} width={760}
      footer={<>
        <button type="button" className="w-btn" onClick={onClose}>{t('c9b.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary" data-testid="gb-import-confirm" disabled={!pv || !pv.cells || run.isPending} onClick={() => run.mutate()}>{run.isPending && <Spinner size={13} />}{t('c9b.importConfirm', { count: pv?.cells ?? 0 })}</button>
      </>}>
      <p className="mb-3 text-[13px] text-[var(--w-text-2)]">{t('c9b.importHelp')}</p>
      <input ref={fileRef} type="file" accept=".xlsx,.csv" className="hidden" aria-hidden="true" tabIndex={-1} onChange={async (e) => {
        const f = e.target.files?.[0];
        e.target.value = '';
        if (!f) return;
        const s = await readGradeFile(f);
        setSrc(s); setName(f.name); preview.mutate(s);
      }} />
      <button type="button" className="w-btn" onClick={() => fileRef.current?.click()}>{preview.isPending ? <Spinner size={13} /> : <FileUp size={14} />}{name || t('c9b.chooseFile')}</button>
      {pv && (
        <div className="mt-3 space-y-2">
          <p className="text-[13px]">{t('c9b.importSummary', { valid: pv.valid, invalid: pv.invalid, cells: pv.cells })}</p>
          {pv.columns.some((c) => !c.itemKey) && (
            <p className="text-[12.5px] text-[var(--w-orange-text)]">{t('c9b.importSkippedCols', { cols: pv.columns.filter((c) => !c.itemKey).map((c) => c.header).join(', ') })}</p>
          )}
          <div className="max-h-[320px] overflow-auto rounded-[8px] border border-[var(--w-border)]">
            <table className="w-full min-w-[560px] border-collapse text-[12.5px]">
              <thead className="sticky top-0 bg-[var(--w-panel)]"><tr className="text-left text-[var(--w-text-2)]">
                <th className="px-2 py-1.5 font-medium">{t('c9b.line')}</th><th className="px-2 py-1.5 font-medium">{t('c9b.colStudent')}</th><th className="px-2 py-1.5 font-medium">{t('c9b.values')}</th><th className="px-2 py-1.5 font-medium">{t('c9b.problems')}</th>
              </tr></thead>
              <tbody>
                {pv.rows.map((r) => (
                  <tr key={r.line} className={cn('border-t border-[var(--w-border)]', r.errors.length && 'bg-[var(--w-sunken)]')}>
                    <td className="px-2 py-1 tabular-nums text-[var(--w-text-2)]">{r.line}</td>
                    <td className="px-2 py-1">{r.who}</td>
                    <td className="px-2 py-1 tabular-nums">{r.values.map((v) => v.points).join(' · ') || '—'}</td>
                    <td className="px-2 py-1 text-[var(--w-red-text)]">{r.errors.map(errText).join('; ') || <span className="text-[var(--w-green-text)]">{t('c9b.ok')}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Dialog>
  );
}
