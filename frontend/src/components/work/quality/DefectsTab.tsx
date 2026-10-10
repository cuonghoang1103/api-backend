'use client';

/**
 * CT Work đợt 6 — T8/T12 PHÂN TÍCH LỖI: nguyên nhân gốc + pha gây lỗi (nuôi số đo DRE/leakage/RCA), công cụ phát hiện,
 * cấp kiểm thử, cách sửa + bằng chứng — và xuất "báo cáo lỗi theo thành viên" (SWT301 Lab 2.5) ra .docx/.pdf.
 */

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { PHASES, q6Api, q6Keys, ROOT_CAUSES, TEST_LEVELS, type DefectRowQ } from '@/lib/work-q6-api';
import { EmptyState, PageLoading } from '../ui';
import { useWT, type WKey } from '../i18n';
import { Badge, Card, Tbl, Td, Th } from './qui';

const SEV_TONE = { CRITICAL: 'red', MAJOR: 'orange', MINOR: 'yellow', TRIVIAL: 'muted' } as const;

export default function DefectsTab({ config, pid, onOpenIssue }: { config: ProjectConfig; pid: number; onOpenIssue: (n: number) => void }) {
  const { t, locale } = useWT();
  const qc = useQueryClient();
  const key = [...q6Keys.tests(pid), 'defects'];
  const q = useQuery({ queryKey: key, queryFn: () => q6Api.defects(pid) });
  const set = useMutation({
    mutationFn: (v: { num: number; body: Parameters<typeof q6Api.setDefect>[2] }) => q6Api.setDefect(pid, v.num, v.body),
    onSuccess: (rows) => { qc.setQueryData(key, rows); qc.invalidateQueries({ queryKey: [...q6Keys.tests(pid), 'quality'] }); },
    onError: (e) => toast.error(workError(e)),
  });
  const canEdit = config.permissions.editIssues;
  if (q.isLoading) return <PageLoading />;
  if (q.error) return <EmptyState title={t('q6.loadFailed')} body={workError(q.error)} />;
  const rows = q.data ?? [];
  const err = (e: unknown) => toast.error(workError(e));
  return (
    <div className="p-4" data-testid="q6-defects-tab">
      <Card title={t('q6.defectsTitle')} desc={t('q6.defectsDesc')}
        actions={<>
          <button type="button" className="w-btn w-btn-sm" onClick={() => q6Api.exportDefects(pid, 'docx', locale).catch(err)} data-testid="q6-defects-docx"><Download size={13} /> {t('q6.defectReport')} (.docx)</button>
          <button type="button" className="w-btn w-btn-sm" onClick={() => q6Api.exportDefects(pid, 'pdf', locale).catch(err)}><Download size={13} /> .pdf</button>
        </>}>
        {!rows.length ? <p className="text-[12.5px] text-[var(--w-text-3)]">{t('q6.noDefects')}</p> : (
          <Tbl minWidth={1180} maxHeight={640} label={t('q6.defectsTitle')}>
            <thead><tr>
              <Th w={90}>{t('q6.colKey')}</Th><Th>{t('q6.colTitle')}</Th><Th w={100}>{t('q6.severity')}</Th><Th w={140}>{t('q6.rootCause')}</Th><Th w={140}>{t('q6.injectedPhase')}</Th>
              <Th w={150}>{t('q6.detectedByTool')}</Th><Th w={130}>{t('q6.testLevel')}</Th><Th w={220}>{t('q6.fixNote')}</Th><Th w={120}>{t('q6.reporter')}</Th>
            </tr></thead>
            <tbody>
              {rows.map((r: DefectRowQ) => (
                <tr key={r.number}>
                  <Td className="font-mono text-[12px]"><button type="button" className={r.open ? 'hover:underline' : 'line-through opacity-70 hover:underline'} onClick={() => onOpenIssue(r.number)}>{r.key}</button></Td>
                  <Td className="text-[12.5px]">{r.title}{r.activity && <div className="text-[11.5px] text-[var(--w-text-3)]">{r.activity}</div>}</Td>
                  <Td>{r.severity ? <Badge tone={SEV_TONE[r.severity]}>{t(`q6.sev${r.severity}` as WKey)}</Badge> : '—'}</Td>
                  <Td><Pick label={t('q6.rootCause')} disabled={!canEdit} value={r.rootCause} options={ROOT_CAUSES.map((x) => [x, t(`q6.rc${x}` as WKey)])} onChange={(v) => set.mutate({ num: r.number, body: { rootCause: v } })} /></Td>
                  <Td><Pick label={t('q6.injectedPhase')} disabled={!canEdit} value={r.injectedPhase} options={PHASES.map((x) => [x, t(`q6.ph${x}` as WKey)])} onChange={(v) => set.mutate({ num: r.number, body: { injectedPhase: v } })} /></Td>
                  <Td><Text label={t('q6.detectedByTool')} disabled={!canEdit} value={r.detectedByTool} onSave={(v) => set.mutate({ num: r.number, body: { detectedByTool: v } })} /></Td>
                  <Td><Pick label={t('q6.testLevel')} disabled={!canEdit} value={r.testLevel} options={TEST_LEVELS.map((x) => [x, t(`q6.lv${x}` as WKey)])} onChange={(v) => set.mutate({ num: r.number, body: { testLevel: v } })} /></Td>
                  <Td><Text label={t('q6.fixNote')} disabled={!canEdit} value={r.fixNote} onSave={(v) => set.mutate({ num: r.number, body: { fixNote: v } })} /></Td>
                  <Td className="text-[12px]">{r.reporter ?? '—'}</Td>
                </tr>
              ))}
            </tbody>
          </Tbl>
        )}
      </Card>
    </div>
  );
}

function Pick({ value, options, onChange, label, disabled }: { value: string | null; options: Array<[string, string]>; onChange: (v: string | null) => void; label: string; disabled?: boolean }) {
  return (
    <select aria-label={label} className="w-input h-7 w-full py-0 text-[12px]" disabled={disabled} value={value ?? ''} onChange={(e) => onChange(e.target.value || null)}>
      <option value="">—</option>
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}

function Text({ value, onSave, label, disabled }: { value: string | null; onSave: (v: string | null) => void; label: string; disabled?: boolean }) {
  const [v, setV] = useState(value ?? '');
  useEffect(() => setV(value ?? ''), [value]);
  return <input aria-label={label} className="w-input h-7 w-full py-0 text-[12.5px]" disabled={disabled} value={v} onChange={(e) => setV(e.target.value)} onBlur={() => v !== (value ?? '') && onSave(v.trim() || null)} onKeyDown={(e) => e.key === 'Enter' && (e.currentTarget as HTMLInputElement).blur()} />;
}
