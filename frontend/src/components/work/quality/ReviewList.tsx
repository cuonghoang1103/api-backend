'use client';

/**
 * CT Work đợt 6 — danh sách phiên review/inspection + hộp tạo phiên (tài liệu: chọn trang Docs; mã: link PR).
 * Checklist lọc theo loại sản phẩm (Wiegers SRS, use case, SDD, test plan IEEE 829, Java, PR, tự kiểm báo cáo UT).
 */

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ClipboardCheck, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { workDocsApi, workError, type ProjectConfig } from '@/lib/work-api';
import { q6Api, q6Keys, REVIEW_METHODS, type ReviewKind, type ReviewMethod, type ReviewRow } from '@/lib/work-q6-api';
import { Dialog, EmptyState, PageLoading } from '../ui';
import { useWT, type WKey } from '../i18n';
import { Badge, Labeled, NumberInput, Segmented, Tbl, Td, Th, type Tone } from './qui';

export const STATUS_TONE: Record<string, Tone> = { PLANNING: 'muted', PREPARATION: 'blue', MEETING: 'accent', REWORK: 'orange', FOLLOW_UP: 'yellow', CLOSED: 'green' };
export const DECISION_TONE: Record<string, Tone> = { ACCEPT: 'green', ACCEPT_WITH_CHANGES: 'yellow', REINSPECT: 'red' };

export default function ReviewList({ config, pid, onOpen }: { config: ProjectConfig; pid: number; onOpen: (n: number) => void }) {
  const { t, fmtDateTime } = useWT();
  const q = useQuery({ queryKey: q6Keys.reviews(pid), queryFn: () => q6Api.reviews(pid) });
  const [open, setOpen] = useState(false);
  const canEdit = config.permissions.editIssues;
  if (q.isLoading) return <PageLoading />;
  if (q.error) return <EmptyState title={t('q6.loadFailed')} body={workError(q.error)} />;
  const rows = q.data ?? [];
  return (
    <div className="flex flex-col gap-3" data-testid="q6-review-list">
      <div className="flex items-center justify-between gap-2">
        <p className="max-w-[760px] text-[12.5px] text-[var(--w-text-2)]">{t('q6.noReviewsBody')}</p>
        {canEdit && <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setOpen(true)} data-testid="q6-new-review"><Plus size={14} /> {t('q6.newReview')}</button>}
      </div>
      {!rows.length ? (
        <EmptyState icon={<ClipboardCheck size={20} />} title={t('q6.noReviews')} body={t('q6.noReviewsBody')} />
      ) : (
        <Tbl minWidth={980} label={t('q6.tabReviews')}>
          <thead>
            <tr>
              <Th w={80}>{t('q6.colKey')}</Th><Th>{t('q6.colTitle')}</Th><Th w={170}>{t('q6.colType')}</Th><Th w={130}>{t('q6.colStatus')}</Th>
              <Th w={150}>{t('q6.colDecision')}</Th><Th w={70} className="text-right">{t('q6.colDefects')}</Th><Th w={90} className="text-right">{t('q6.colProgress')}</Th>
              <Th w={110} className="text-right">{t('q6.colDensity')}</Th><Th w={100} className="text-right">{t('q6.colEfficiency')}</Th><Th w={150}>{t('q6.colMeeting')}</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r: ReviewRow) => (
              <tr key={r.number} className="cursor-pointer hover:bg-[var(--w-hover)]" onClick={() => onOpen(r.number)}>
                <Td className="font-mono text-[12px]"><button type="button" className="hover:underline" onClick={(e) => { e.stopPropagation(); onOpen(r.number); }}>{r.key}</button></Td>
                <Td><div className="font-medium">{r.title}</div>{r.workProduct && <div className="truncate text-[12px] text-[var(--w-text-3)]">{r.workProduct}</div>}</Td>
                <Td>{t(`q6.kind${r.kind}` as WKey)} · {t(`q6.method${r.method}` as WKey)}</Td>
                <Td><Badge tone={STATUS_TONE[r.status]}>{t(`q6.st${r.status}` as WKey)}</Badge></Td>
                <Td>{r.decision ? <Badge tone={DECISION_TONE[r.decision]}>{t(`q6.dec${r.decision}` as WKey)}</Badge> : <span className="text-[var(--w-text-3)]">—</span>}</Td>
                <Td className="text-right tabular-nums">{r.defects}</Td>
                <Td className="text-right tabular-nums">{r.progress}%</Td>
                <Td className="text-right tabular-nums">{r.density ?? '—'}</Td>
                <Td className="text-right tabular-nums">{r.efficiency ?? '—'}</Td>
                <Td className="text-[12px] text-[var(--w-text-2)]">{r.meetingAt ? fmtDateTime(r.meetingAt) : '—'}</Td>
              </tr>
            ))}
          </tbody>
        </Tbl>
      )}
      {open && <NewReviewDialog config={config} pid={pid} onClose={() => setOpen(false)} onCreated={(n) => { setOpen(false); onOpen(n); }} />}
    </div>
  );
}

function NewReviewDialog({ config, pid, onClose, onCreated }: { config: ProjectConfig; pid: number; onClose: () => void; onCreated: (n: number) => void }) {
  const { t, locale } = useWT();
  const qc = useQueryClient();
  const [kind, setKind] = useState<ReviewKind>('DOC');
  const [method, setMethod] = useState<ReviewMethod>('INSPECTION');
  const [title, setTitle] = useState('');
  const [checklistKey, setChecklistKey] = useState('');
  const [pageNumber, setPageNumber] = useState<number | null>(null);
  const [workProduct, setWorkProduct] = useState('');
  const [prUrl, setPrUrl] = useState('');
  const [size, setSize] = useState<number | null>(null);
  const [meetingAt, setMeetingAt] = useState('');
  const [entry, setEntry] = useState('');
  const [exit, setExit] = useState('');
  const lists = useQuery({ queryKey: [...q6Keys.base(pid), 'checklists', locale], queryFn: () => q6Api.checklists(pid, locale) });
  const pages = useQuery({ queryKey: ['work', 'docs', pid, 'list-q6'], queryFn: () => workDocsApi.list(pid), enabled: kind === 'DOC', retry: false });
  const options = useMemo(() => (lists.data ?? []).filter((c) => c.kind === kind), [lists.data, kind]);
  const chosen = options.find((c) => c.key === checklistKey) ?? options[0];
  const m = useMutation({
    mutationFn: () => q6Api.createReview(pid, {
      title: title.trim(), kind, method, checklistKey: chosen!.key, language: locale,
      pageNumber: kind === 'DOC' ? pageNumber : null, workProduct: workProduct.trim() || null, prUrl: kind === 'CODE' ? prUrl.trim() || null : null,
      size, meetingAt: meetingAt ? new Date(meetingAt).toISOString() : null, entryCriteria: entry.trim() || null, exitCriteria: exit.trim() || null,
    }),
    onSuccess: (r) => { toast.success(t('q6.created', { k: r.key })); qc.invalidateQueries({ queryKey: q6Keys.reviews(pid) }); onCreated(r.number); },
    onError: (e) => toast.error(workError(e)),
  });
  void config;
  return (
    <Dialog open onClose={onClose} title={t('q6.newReview')} width={640}
      footer={<>
        <button type="button" className="w-btn w-btn-sm" onClick={onClose}>{t('common.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={!title.trim() || !chosen || m.isPending} onClick={() => m.mutate()} data-testid="q6-create-review">{t('q6.create')}</button>
      </>}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Labeled label={t('q6.reviewTitle')} className="sm:col-span-2"><input className="w-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('q6.reviewTitlePh')} autoFocus data-testid="q6-review-title" /></Labeled>
        <Labeled label={t('q6.reviewKind')}>
          <Segmented value={kind} label={t('q6.reviewKind')} onChange={(v) => { setKind(v); setChecklistKey(''); }} options={[{ value: 'DOC', label: t('q6.kindDOC') }, { value: 'CODE', label: t('q6.kindCODE') }]} />
        </Labeled>
        <Labeled label={t('q6.reviewMethod')}>
          <select className="w-input" value={method} onChange={(e) => setMethod(e.target.value as ReviewMethod)}>
            {REVIEW_METHODS.map((x) => <option key={x} value={x}>{t(`q6.method${x}` as WKey)}</option>)}
          </select>
        </Labeled>
        <Labeled label={t('q6.checklist')} className="sm:col-span-2" hint={chosen ? t('q6.checklistSource', { s: chosen.source }) : undefined}>
          <select className="w-input" value={chosen?.key ?? ''} onChange={(e) => setChecklistKey(e.target.value)} data-testid="q6-checklist">
            {options.map((c) => <option key={c.key} value={c.key}>{c.name} ({c.items})</option>)}
          </select>
        </Labeled>
        {kind === 'DOC' ? (
          <Labeled label={t('q6.docPage')} className="sm:col-span-2">
            <select className="w-input" value={pageNumber ?? ''} onChange={(e) => setPageNumber(e.target.value ? Number(e.target.value) : null)}>
              <option value="">{t('q6.docPageNone')}</option>
              {(pages.data?.pages ?? []).map((p) => <option key={p.number} value={p.number}>{p.number}. {p.title}</option>)}
            </select>
          </Labeled>
        ) : (
          <Labeled label={t('q6.prUrl')} className="sm:col-span-2"><input className="w-input" type="url" value={prUrl} onChange={(e) => setPrUrl(e.target.value)} placeholder="https://github.com/org/repo/pull/12" /></Labeled>
        )}
        <Labeled label={t('q6.workProduct')}><input className="w-input" value={workProduct} onChange={(e) => setWorkProduct(e.target.value)} placeholder={t('q6.workProductPh')} /></Labeled>
        <Labeled label={`${t('q6.size')} (${t(kind === 'CODE' ? 'q6.sizeLOC' : 'q6.sizePAGE')})`}><NumberInput value={size} onChange={setSize} min={0} label={t('q6.size')} /></Labeled>
        <Labeled label={t('q6.meetingAt')}><input className="w-input" type="datetime-local" value={meetingAt} onChange={(e) => setMeetingAt(e.target.value)} /></Labeled>
        <div />
        <Labeled label={t('q6.entryCriteria')}><textarea className="w-input min-h-[60px]" value={entry} onChange={(e) => setEntry(e.target.value)} placeholder={t('q6.entryCriteriaPh')} /></Labeled>
        <Labeled label={t('q6.exitCriteria')}><textarea className="w-input min-h-[60px]" value={exit} onChange={(e) => setExit(e.target.value)} placeholder={t('q6.exitCriteriaPh')} /></Labeled>
      </div>
    </Dialog>
  );
}
