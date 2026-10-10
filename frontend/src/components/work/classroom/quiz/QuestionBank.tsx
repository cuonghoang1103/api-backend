'use client';

/**
 * CTW đợt 9c — NGÂN HÀNG CÂU HỎI của lớp (chỉ giảng viên): lọc theo chủ đề / tìm / nháp AI, soạn câu, lưu trữ, duyệt nháp AI
 * từng câu, nhập từ bảng xlsx/CSV (mẫu tải về) · Aiken · GIFT với xem trước lỗi từng dòng, và AI gợi ý từ tài liệu lớp.
 * `onPick` có mặt ⇒ chế độ CHỌN câu cho quiz (nút "Thêm" trên từng câu; nháp AI chưa duyệt không chọn được).
 */

import { useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Archive, Check, Download, FileUp, Pencil, Plus, Search, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { Dialog, EmptyState, Field, PageLoading, Spinner } from '@/components/work/ui';
import { ConfirmDialog, Select } from '@/components/work/settings/shared';
import { useWT, type WKey } from '@/components/work/i18n';
import QuestionForm from './QuestionForm';
import QuizText from './QuizText';
import { fileToBase64, isPair, QUESTION_TYPES, quizApi, quizKeys, type BankQuestion, type ImportFormat, type ImportPreview, type QuestionType } from './quizApi';

export function TypeChip({ type }: { type: QuestionType }) {
  const { t } = useWT();
  return <span className="inline-flex h-5 items-center rounded-[4px] bg-[var(--w-sunken)] px-1.5 text-[11px] font-medium text-[var(--w-text-2)]">{t(`c9c.type_${type}` as WKey)}</span>;
}

/** Tóm tắt đáp án đúng (cho giảng viên) — một dòng. */
export function answerSummary(q: Pick<BankQuestion, 'type' | 'options' | 'answer'>, t: (k: WKey) => string): string {
  if (q.type === 'SINGLE' || q.type === 'MULTI') {
    const set = new Set(q.answer.correct ?? []);
    return q.options.filter((o) => !isPair(o) && set.has(o.id)).map((o) => ('text' in o ? o.text : '')).join(' · ');
  }
  if (q.type === 'TRUE_FALSE') return t(q.answer.value ? 'c9c.trueLabel' : 'c9c.falseLabel');
  if (q.type === 'SHORT') return (q.answer.accepted ?? []).join(' | ');
  return q.options.filter(isPair).map((p) => `${p.left} → ${p.right}`).join(' · ');
}

export default function QuestionBank({ cid, onPick, pickedIds }: { cid: number; onPick?: (q: BankQuestion) => void; pickedIds?: ReadonlySet<number> }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const [topic, setTopic] = useState('');
  const [search, setSearch] = useState('');
  const [drafts, setDrafts] = useState(false);
  const [editing, setEditing] = useState<BankQuestion | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [archiving, setArchiving] = useState<BankQuestion | null>(null);
  const filter = { topic: topic || undefined, q: search.trim() || undefined, drafts };
  const bank = useQuery({ queryKey: quizKeys.bank(cid, filter), queryFn: () => quizApi.bank(cid, filter) });
  const approve = useMutation({
    mutationFn: (id: number) => quizApi.updateQuestion(cid, id, { approve: true }),
    onSuccess: () => { toast.success(t('c9c.approved')); qc.invalidateQueries({ queryKey: quizKeys.bankAll(cid) }); },
    onError: (err) => toast.error(workError(err)),
  });
  const archive = useMutation({
    mutationFn: (id: number) => quizApi.archiveQuestion(cid, id),
    onSuccess: () => { toast.success(t('c9c.archived')); setArchiving(null); qc.invalidateQueries({ queryKey: quizKeys.bankAll(cid) }); },
    onError: (err) => toast.error(workError(err)),
  });

  const data = bank.data;
  return (
    <div className="space-y-3" data-testid="quiz-bank">
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative min-w-[200px] flex-1">
          <span className="sr-only">{t('c9c.search')}</span>
          <Search size={14} aria-hidden="true" className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" />
          <input className="w-input pl-8" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('c9c.search')} />
        </label>
        <Select value={topic} onChange={(e) => setTopic(e.target.value)} aria-label={t('c9c.qTopic')} className="w-auto min-w-[160px]">
          <option value="">{t('c9c.allTopics')}</option>
          {(data?.topics ?? []).map((x) => <option key={x.topic} value={x.topic}>{x.topic} ({x.count})</option>)}
        </Select>
        {!!data?.drafts && (
          <button type="button" className={cn('w-btn w-btn-sm', drafts && 'w-btn-primary')} aria-pressed={drafts} onClick={() => setDrafts((v) => !v)}>
            <Sparkles size={13} aria-hidden="true" />{t('c9c.draftsOnly', { n: data.drafts })}
          </button>
        )}
        <div className="ml-auto flex flex-wrap gap-2">
          <button type="button" className="w-btn w-btn-sm" onClick={() => setAiOpen(true)}><Sparkles size={13} aria-hidden="true" />{t('c9c.aiSuggest')}</button>
          <button type="button" className="w-btn w-btn-sm" onClick={() => setImportOpen(true)} data-testid="quiz-import-open"><FileUp size={13} aria-hidden="true" />{t('c9c.import')}</button>
          <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => { setEditing(null); setFormOpen(true); }} data-testid="quiz-q-new"><Plus size={13} aria-hidden="true" />{t('c9c.newQuestion')}</button>
        </div>
      </div>

      {bank.isLoading ? <PageLoading rows={3} /> : bank.error ? <EmptyState title={workError(bank.error)} /> : !data?.questions.length ? (
        <EmptyState title={t('c9c.noQuestions')} body={t('c9c.noQuestionsBody')} />
      ) : (
        <ul className="divide-y divide-[var(--w-border)] rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)]">
          {data.questions.map((q) => {
            const picked = pickedIds?.has(q.id);
            return (
              <li key={q.id} className="flex items-start gap-3 px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-1.5 text-[12px] text-[var(--w-text-2)]">
                    <TypeChip type={q.type} />
                    <span>{q.topic}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{t('c9c.pts', { n: q.points })}</span>
                    {q.draft && <span className="rounded-[4px] bg-[var(--w-accent-soft)] px-1.5 text-[11px] font-medium text-[var(--w-accent-text)]">{t('c9c.aiDraftBadge')}</span>}
                    {q.usedIn > 0 && <span>· {t('c9c.usedIn', { n: q.usedIn })}</span>}
                  </div>
                  <QuizText text={q.prompt} className="text-[13.5px]" />
                  <div className="mt-1 truncate text-[12px] text-[var(--w-green-text)]"><Check size={12} aria-hidden="true" className="mr-1 inline" />{answerSummary(q, t)}</div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {q.draft && <button type="button" className="w-btn w-btn-sm" onClick={() => approve.mutate(q.id)} disabled={approve.isPending}>{t('c9c.approve')}</button>}
                  {onPick && (
                    <button type="button" className={cn('w-btn w-btn-sm', !picked && 'w-btn-primary')} disabled={picked || q.draft} onClick={() => onPick(q)} title={q.draft ? t('c9c.approveFirst') : undefined}>
                      {picked ? t('c9c.picked') : t('c9c.pick')}
                    </button>
                  )}
                  <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('c9c.editQuestion')} onClick={() => { setEditing(q); setFormOpen(true); }}><Pencil size={13} /></button>
                  {!onPick && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('c9c.archive')} onClick={() => setArchiving(q)}><Archive size={13} /></button>}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <QuestionForm open={formOpen} onClose={() => setFormOpen(false)} cid={cid} question={editing} defaultTopic={topic || undefined} onSaved={(q) => onPick && !editing && onPick(q)} />
      <ImportDialog open={importOpen} onClose={() => setImportOpen(false)} cid={cid} />
      <AiDialog open={aiOpen} onClose={() => setAiOpen(false)} cid={cid} topics={(data?.topics ?? []).map((x) => x.topic)} onDone={() => setDrafts(true)} />
      <ConfirmDialog open={!!archiving} onClose={() => setArchiving(null)} onConfirm={() => archiving && archive.mutate(archiving.id)} pending={archive.isPending}
        title={t('c9c.archive')} body={t('c9c.archiveBody')} confirmLabel={t('c9c.archive')} />
    </div>
  );
}

// ─── Nhập câu hỏi ───────────────────────────────────────────────

function ImportDialog({ open, onClose, cid }: { open: boolean; onClose: () => void; cid: number }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const [format, setFormat] = useState<ImportFormat>('table');
  const [text, setText] = useState('');
  const [xlsx, setXlsx] = useState<{ name: string; b64: string } | null>(null);
  const [topic, setTopic] = useState('');
  const [pv, setPv] = useState<ImportPreview | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const body = () => ({ format, topic: topic.trim() || undefined, ...(xlsx && format === 'table' ? { xlsxBase64: xlsx.b64 } : { text }) });
  const check = useMutation({ mutationFn: () => quizApi.importQuestions(cid, body()), onSuccess: setPv, onError: (err) => toast.error(workError(err)) });
  const run = useMutation({
    mutationFn: () => quizApi.importQuestions(cid, { ...body(), confirm: true }),
    onSuccess: (r) => { toast.success(t('c9c.importedN', { n: r.imported })); qc.invalidateQueries({ queryKey: quizKeys.bankAll(cid) }); reset(); onClose(); },
    onError: (err) => toast.error(workError(err)),
  });
  const reset = () => { setPv(null); setText(''); setXlsx(null); };
  const onFile = async (file: File) => {
    setPv(null);
    if (/\.xlsx$/i.test(file.name)) { setFormat('table'); setXlsx({ name: file.name, b64: await fileToBase64(file) }); return; }
    setXlsx(null);
    const s = await file.text();
    setText(s);
    if (/\.gift$/i.test(file.name) || /\{[\s\S]*[=~][\s\S]*\}/.test(s)) setFormat('gift');
    else if (/^ANSWER\s*:/im.test(s)) setFormat('aiken');
    else setFormat('table');
  };
  const hasInput = format === 'table' ? !!xlsx || !!text.trim() : !!text.trim();
  return (
    <Dialog open={open} onClose={onClose} width={820} title={t('c9c.importTitle')}
      footer={<>
        <button type="button" className="w-btn" onClick={onClose}>{t('c9c.cancel')}</button>
        <button type="button" className="w-btn" disabled={!hasInput || check.isPending} onClick={() => check.mutate()} data-testid="quiz-import-check">{check.isPending && <Spinner size={12} />}{t('c9c.check')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={!pv?.valid || run.isPending} onClick={() => run.mutate()} data-testid="quiz-import-run">{run.isPending && <Spinner size={12} />}{t('c9c.importN', { n: pv?.valid ?? 0 })}</button>
      </>}>
      <div className="mb-3 flex flex-wrap items-end gap-3">
        <Field label={t('c9c.format')}>
          <Select value={format} onChange={(e) => { setFormat(e.target.value as ImportFormat); setPv(null); }} className="w-auto min-w-[200px]">
            <option value="table">{t('c9c.fmtTable')}</option>
            <option value="aiken">{t('c9c.fmtAiken')}</option>
            <option value="gift">{t('c9c.fmtGift')}</option>
          </Select>
        </Field>
        <Field label={t('c9c.defaultTopic')}><input className="w-input" value={topic} maxLength={60} onChange={(e) => setTopic(e.target.value)} /></Field>
        <div className="mb-3 flex gap-2">
          <input ref={fileRef} type="file" accept=".xlsx,.csv,.txt,.gift" className="sr-only" aria-label={t('c9c.chooseFile')} onChange={(e) => { const f = e.target.files?.[0]; if (f) void onFile(f); e.target.value = ''; }} />
          <button type="button" className="w-btn" onClick={() => fileRef.current?.click()}><FileUp size={14} aria-hidden="true" />{t('c9c.chooseFile')}</button>
          <button type="button" className="w-btn w-btn-ghost" onClick={() => quizApi.template(cid).catch((err) => toast.error(workError(err)))}><Download size={14} aria-hidden="true" />{t('c9c.downloadTemplate')}</button>
        </div>
      </div>
      {xlsx && format === 'table' ? (
        <div className="mb-3 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 text-[13px]">{xlsx.name} <button type="button" className="ml-2 underline" onClick={() => { setXlsx(null); setPv(null); }}>{t('c9c.remove')}</button></div>
      ) : (
        <Field label={t('c9c.orPaste')} hint={t(`c9c.fmtHint_${format}` as WKey)}>
          <textarea className="w-input min-h-[140px] py-2 font-mono text-[12.5px]" value={text} onChange={(e) => { setText(e.target.value); setPv(null); }} data-testid="quiz-import-text" />
        </Field>
      )}
      {pv && (
        <div>
          <div className="mb-2 text-[13px] font-medium" role="status">{t('c9c.previewSummary', { valid: pv.valid, invalid: pv.invalid })}</div>
          <div className="max-h-[300px] overflow-auto rounded-[8px] border border-[var(--w-border)]">
            <table className="w-full min-w-[560px] border-collapse text-[12.5px]">
              <thead className="sticky top-0 bg-[var(--w-sunken)]"><tr className="text-left text-[var(--w-text-2)]">
                <th scope="col" className="px-2 py-1.5">{t('c9c.line')}</th><th scope="col" className="px-2 py-1.5">{t('c9c.qPrompt')}</th><th scope="col" className="px-2 py-1.5">{t('c9c.qType')}</th><th scope="col" className="px-2 py-1.5">{t('c9c.status')}</th>
              </tr></thead>
              <tbody>
                {pv.rows.map((r, i) => (
                  <tr key={`${r.line}-${i}`} className="border-t border-[var(--w-border)] align-top">
                    <td className="px-2 py-1 tabular-nums text-[var(--w-text-2)]">{r.line}</td>
                    <td className="px-2 py-1">{r.source || '—'}</td>
                    <td className="px-2 py-1">{r.question ? <TypeChip type={r.question.type} /> : '—'}</td>
                    <td className={cn('px-2 py-1', r.errors.length ? 'text-[var(--w-red-text)]' : 'text-[var(--w-green-text)]')}>{r.errors.length ? r.errors.join(' · ') : t('c9c.ok')}</td>
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

// ─── AI gợi ý ───────────────────────────────────────────────────

function AiDialog({ open, onClose, cid, topics, onDone }: { open: boolean; onClose: () => void; cid: number; topics: string[]; onDone: () => void }) {
  const { t, locale } = useWT();
  const qc = useQueryClient();
  const [source, setSource] = useState('');
  const [count, setCount] = useState(5);
  const [topic, setTopic] = useState('');
  const [types, setTypes] = useState<QuestionType[]>(['SINGLE', 'MULTI', 'TRUE_FALSE', 'SHORT']);
  const run = useMutation({
    mutationFn: () => quizApi.aiSuggest(cid, { source, count, topic: topic.trim() || undefined, types, language: locale }),
    onSuccess: (r) => {
      toast.success(t('c9c.aiDone', { n: r.created }));
      if (r.rejected) toast.message(t('c9c.aiRejected', { n: r.rejected }));
      qc.invalidateQueries({ queryKey: quizKeys.bankAll(cid) });
      onDone();
      onClose();
    },
    onError: (err) => toast.error(workError(err)),
  });
  const listId = useMemo(() => `quiz-topics-${cid}`, [cid]);
  return (
    <Dialog open={open} onClose={onClose} width={680} title={t('c9c.aiTitle')}
      footer={<>
        <button type="button" className="w-btn" onClick={onClose}>{t('c9c.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={source.trim().length < 80 || !types.length || run.isPending} onClick={() => run.mutate()}>{run.isPending && <Spinner size={12} />}<Sparkles size={13} aria-hidden="true" />{t('c9c.aiGo')}</button>
      </>}>
      <p className="mb-3 text-[13px] leading-relaxed text-[var(--w-text-2)]">{t('c9c.aiIntro')}</p>
      <Field label={t('c9c.aiSource')} hint={t('c9c.aiSourceHint')}>
        <textarea className="w-input min-h-[160px] py-2" value={source} maxLength={24000} onChange={(e) => setSource(e.target.value)} />
      </Field>
      <div className="grid gap-x-3 sm:grid-cols-[120px_1fr]">
        <Field label={t('c9c.aiCount')}><input className="w-input" type="number" min={1} max={15} value={count} onChange={(e) => setCount(Math.min(15, Math.max(1, Number(e.target.value) || 5)))} /></Field>
        <Field label={t('c9c.qTopic')}>
          <input className="w-input" list={listId} value={topic} maxLength={60} onChange={(e) => setTopic(e.target.value)} />
          <datalist id={listId}>{topics.map((x) => <option key={x} value={x} />)}</datalist>
        </Field>
      </div>
      <fieldset>
        <legend className="w-label">{t('c9c.aiTypes')}</legend>
        <div className="flex flex-wrap gap-3 text-[13px]">
          {QUESTION_TYPES.map((k) => (
            <label key={k} className="flex items-center gap-1.5">
              <input type="checkbox" className="h-4 w-4 accent-[var(--w-accent)]" checked={types.includes(k)} onChange={(e) => setTypes((p) => (e.target.checked ? [...p, k] : p.filter((x) => x !== k)))} />
              {t(`c9c.type_${k}` as WKey)}
            </label>
          ))}
        </div>
      </fieldset>
    </Dialog>
  );
}
