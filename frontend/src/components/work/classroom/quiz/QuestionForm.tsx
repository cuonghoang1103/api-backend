'use client';

/**
 * CTW đợt 9c — hộp soạn MỘT câu hỏi của ngân hàng: 5 kiểu (một đáp án, nhiều đáp án + chấm từng phần, đúng/sai, điền ngắn
 * với nhiều đáp án chấp nhận + tuỳ chọn hoa thường/dấu, ghép cặp), điểm, giải thích, ảnh (tải lên R2 qua backend), công
 * thức KaTeX trong chữ ($…$) có xem trước ngay. Kiểm hợp lệ thật ở máy chủ (quizRules.validateQuestion) — lỗi hiện nguyên văn.
 */

import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ImagePlus, Plus, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { Dialog, Field, Spinner } from '@/components/work/ui';
import { Select, Switch } from '@/components/work/settings/shared';
import { useWT, type WKey } from '@/components/work/i18n';
import QuizText from './QuizText';
import { fileToBase64, isPair, QUESTION_TYPES, quizApi, quizKeys, type BankQuestion, type QOption, type QPair, type QuestionInput, type QuestionType } from './quizApi';

const blank = (type: QuestionType, topic: string): QuestionInput => {
  const base = { type, topic, prompt: '', imageUrl: null, points: 1, explanation: null, settings: {} };
  if (type === 'SINGLE' || type === 'MULTI') return { ...base, options: [{ id: 'o1', text: '' }, { id: 'o2', text: '' }, { id: 'o3', text: '' }, { id: 'o4', text: '' }], answer: { correct: [] } };
  if (type === 'TRUE_FALSE') return { ...base, options: [], answer: { value: true } };
  if (type === 'SHORT') return { ...base, options: [], answer: { accepted: [''] } };
  return { ...base, options: [{ id: 'p1', left: '', right: '' }, { id: 'p2', left: '', right: '' }, { id: 'p3', left: '', right: '' }], answer: {}, settings: { partial: true } };
};

const nextId = (prefix: string, list: Array<{ id: string }>) => {
  const n = Math.max(0, ...list.map((o) => Number(o.id.replace(/\D/g, '')) || 0)) + 1;
  return `${prefix}${n}`;
};

export default function QuestionForm({ open, onClose, cid, question, defaultTopic, onSaved }: {
  open: boolean; onClose: () => void; cid: number; question: BankQuestion | null; defaultTopic?: string; onSaved?: (q: BankQuestion) => void;
}) {
  const { t } = useWT();
  const qc = useQueryClient();
  const [f, setF] = useState<QuestionInput>(() => blank('SINGLE', defaultTopic || 'General'));
  const [accepted, setAccepted] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    if (question) {
      const { type, topic, prompt, imageUrl, points, explanation, options, answer, settings } = question;
      setF({ type, topic, prompt, imageUrl, points, explanation, options, answer, settings });
      setAccepted((answer.accepted ?? []).join('\n'));
    } else {
      setF(blank('SINGLE', defaultTopic || 'General'));
      setAccepted('');
    }
  }, [open, question, defaultTopic]);

  const payload = (): QuestionInput => ({
    ...f,
    explanation: f.explanation?.trim() || null,
    answer: f.type === 'SHORT' ? { accepted: accepted.split('\n').map((s) => s.trim()).filter(Boolean) } : f.answer,
  });

  const save = useMutation({
    mutationFn: () => (question ? quizApi.updateQuestion(cid, question.id, { question: payload() }) : quizApi.createQuestion(cid, payload())),
    onSuccess: (q) => {
      toast.success(t('c9c.questionSaved'));
      qc.invalidateQueries({ queryKey: quizKeys.bankAll(cid) });
      onSaved?.(q);
      onClose();
    },
    onError: (err) => toast.error(workError(err)),
  });
  const upload = useMutation({
    mutationFn: async (file: File) => quizApi.uploadImage(cid, await fileToBase64(file)),
    onSuccess: (r) => { setF((p) => ({ ...p, imageUrl: r.url })); toast.success(t('c9c.imageUploaded')); },
    onError: (err) => toast.error(workError(err)),
  });

  const setType = (type: QuestionType) => setF((p) => ({ ...blank(type, p.topic), prompt: p.prompt, imageUrl: p.imageUrl, points: p.points, explanation: p.explanation }));
  const opts = f.options.filter((o): o is QOption => !isPair(o));
  const pairs = f.options.filter(isPair) as QPair[];
  const correct = new Set(f.answer.correct ?? []);
  const toggleCorrect = (id: string) => setF((p) => {
    if (p.type === 'SINGLE') return { ...p, answer: { correct: [id] } };
    const s = new Set(p.answer.correct ?? []);
    if (s.has(id)) s.delete(id); else s.add(id);
    return { ...p, answer: { correct: [...s] } };
  });

  return (
    <Dialog open={open} onClose={onClose} width={760} title={question ? t('c9c.editQuestion') : t('c9c.newQuestion')}
      footer={<>
        <button type="button" className="w-btn" onClick={onClose}>{t('c9c.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={save.isPending || !f.prompt.trim()} onClick={() => save.mutate()} data-testid="quiz-q-save">{save.isPending && <Spinner size={12} />}{t('c9c.saveQuestion')}</button>
      </>}>
      <div className="grid gap-x-3 sm:grid-cols-[1fr_1fr_110px]">
        <Field label={t('c9c.qType')}>
          <Select value={f.type} onChange={(e) => setType(e.target.value as QuestionType)} data-testid="quiz-q-type">
            {QUESTION_TYPES.map((k) => <option key={k} value={k}>{t(`c9c.type_${k}` as WKey)}</option>)}
          </Select>
        </Field>
        <Field label={t('c9c.qTopic')}><input className="w-input" value={f.topic} maxLength={60} onChange={(e) => setF({ ...f, topic: e.target.value })} /></Field>
        <Field label={t('c9c.qPoints')}><input className="w-input" type="number" min={0.25} max={100} step={0.25} value={f.points} onChange={(e) => setF({ ...f, points: Number(e.target.value) || 1 })} /></Field>
      </div>
      <Field label={t('c9c.qPrompt')} hint={t('c9c.qPromptHint')}>
        <textarea className="w-input min-h-[84px] py-2" value={f.prompt} maxLength={4000} onChange={(e) => setF({ ...f, prompt: e.target.value })} data-testid="quiz-q-prompt" />
      </Field>
      {(f.prompt.includes('$') || f.prompt.includes('**')) && f.prompt.trim() && (
        <div className="mb-3 rounded-[8px] border border-dashed border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2">
          <div className="w-eyebrow mb-1">{t('c9c.livePreview')}</div>
          <QuizText text={f.prompt} />
        </div>
      )}

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" aria-label={t('c9c.uploadImage')}
          onChange={(e) => { const file = e.target.files?.[0]; if (file) upload.mutate(file); e.target.value = ''; }} />
        <button type="button" className="w-btn w-btn-sm" onClick={() => fileRef.current?.click()} disabled={upload.isPending}>
          {upload.isPending ? <Spinner size={12} /> : <ImagePlus size={13} aria-hidden="true" />}{t('c9c.uploadImage')}
        </button>
        {f.imageUrl && (
          <span className="inline-flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={f.imageUrl} alt="" className="h-12 max-w-[120px] rounded-[4px] border border-[var(--w-border)] object-contain" />
            <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => setF({ ...f, imageUrl: null })}><X size={13} aria-hidden="true" />{t('c9c.removeImage')}</button>
          </span>
        )}
      </div>

      {(f.type === 'SINGLE' || f.type === 'MULTI') && (
        <fieldset className="mb-3">
          <legend className="w-label">{t('c9c.options')} · <span className="font-normal">{t(f.type === 'SINGLE' ? 'c9c.markOne' : 'c9c.markMany')}</span></legend>
          <div className="space-y-1.5">
            {opts.map((o, i) => (
              <div key={o.id} className="flex items-center gap-2">
                <input type={f.type === 'SINGLE' ? 'radio' : 'checkbox'} name="quiz-correct" className="h-4 w-4 accent-[var(--w-accent)]" checked={correct.has(o.id)} onChange={() => toggleCorrect(o.id)} aria-label={t('c9c.markCorrect', { n: i + 1 })} />
                <input className={cn('w-input flex-1', correct.has(o.id) && 'border-[var(--w-green)]')} value={o.text} maxLength={500} placeholder={t('c9c.optionN', { n: i + 1 })}
                  onChange={(e) => setF({ ...f, options: opts.map((x) => (x.id === o.id ? { ...x, text: e.target.value } : x)) })} />
                <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('c9c.removeOption', { n: i + 1 })} disabled={opts.length <= 2}
                  onClick={() => setF({ ...f, options: opts.filter((x) => x.id !== o.id), answer: { correct: (f.answer.correct ?? []).filter((c) => c !== o.id) } })}><Trash2 size={13} /></button>
              </div>
            ))}
          </div>
          {opts.length < 10 && <button type="button" className="w-btn w-btn-ghost w-btn-sm mt-1.5" onClick={() => setF({ ...f, options: [...opts, { id: nextId('o', opts), text: '' }] })}><Plus size={13} aria-hidden="true" />{t('c9c.addOption')}</button>}
          {f.type === 'MULTI' && (
            <label className="mt-2 flex items-center gap-2 text-[13px]">
              <Switch checked={!!f.settings.partial} onChange={(v) => setF({ ...f, settings: { ...f.settings, partial: v } })} label={t('c9c.partial')} />{t('c9c.partial')}
            </label>
          )}
        </fieldset>
      )}

      {f.type === 'TRUE_FALSE' && (
        <fieldset className="mb-3">
          <legend className="w-label">{t('c9c.statementIs')}</legend>
          <div className="flex gap-4 text-[13px]">
            {[true, false].map((v) => (
              <label key={String(v)} className="flex items-center gap-2"><input type="radio" name="quiz-tf" className="h-4 w-4 accent-[var(--w-accent)]" checked={f.answer.value === v} onChange={() => setF({ ...f, answer: { value: v } })} />{t(v ? 'c9c.trueLabel' : 'c9c.falseLabel')}</label>
            ))}
          </div>
        </fieldset>
      )}

      {f.type === 'SHORT' && (
        <div className="mb-3">
          <Field label={t('c9c.accepted')} hint={t('c9c.acceptedHint')}>
            <textarea className="w-input min-h-[70px] py-2" value={accepted} onChange={(e) => setAccepted(e.target.value)} data-testid="quiz-q-accepted" />
          </Field>
          <div className="flex flex-wrap gap-4 text-[13px]">
            <label className="flex items-center gap-2"><Switch checked={!!f.settings.caseSensitive} onChange={(v) => setF({ ...f, settings: { ...f.settings, caseSensitive: v } })} label={t('c9c.caseSensitive')} />{t('c9c.caseSensitive')}</label>
            <label className="flex items-center gap-2"><Switch checked={!!f.settings.accentSensitive} onChange={(v) => setF({ ...f, settings: { ...f.settings, accentSensitive: v } })} label={t('c9c.accentSensitive')} />{t('c9c.accentSensitive')}</label>
          </div>
        </div>
      )}

      {f.type === 'MATCH' && (
        <fieldset className="mb-3">
          <legend className="w-label">{t('c9c.pairs')}</legend>
          <div className="space-y-1.5">
            {pairs.map((p, i) => (
              <div key={p.id} className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-2">
                <input className="w-input" value={p.left} maxLength={500} placeholder={t('c9c.left')} aria-label={`${t('c9c.left')} ${i + 1}`} onChange={(e) => setF({ ...f, options: pairs.map((x) => (x.id === p.id ? { ...x, left: e.target.value } : x)) })} />
                <span aria-hidden="true" className="text-[var(--w-text-3)]">→</span>
                <input className="w-input" value={p.right} maxLength={500} placeholder={t('c9c.right')} aria-label={`${t('c9c.right')} ${i + 1}`} onChange={(e) => setF({ ...f, options: pairs.map((x) => (x.id === p.id ? { ...x, right: e.target.value } : x)) })} />
                <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('c9c.removePair', { n: i + 1 })} disabled={pairs.length <= 2} onClick={() => setF({ ...f, options: pairs.filter((x) => x.id !== p.id) })}><Trash2 size={13} /></button>
              </div>
            ))}
          </div>
          {pairs.length < 10 && <button type="button" className="w-btn w-btn-ghost w-btn-sm mt-1.5" onClick={() => setF({ ...f, options: [...pairs, { id: nextId('p', pairs), left: '', right: '' }] })}><Plus size={13} aria-hidden="true" />{t('c9c.addPair')}</button>}
          <label className="mt-2 flex items-center gap-2 text-[13px]"><Switch checked={f.settings.partial !== false} onChange={(v) => setF({ ...f, settings: { partial: v } })} label={t('c9c.partialMatch')} />{t('c9c.partialMatch')}</label>
        </fieldset>
      )}

      <Field label={t('c9c.qExplanation')}>
        <textarea className="w-input min-h-[60px] py-2" value={f.explanation ?? ''} maxLength={4000} onChange={(e) => setF({ ...f, explanation: e.target.value })} />
      </Field>
    </Dialog>
  );
}
