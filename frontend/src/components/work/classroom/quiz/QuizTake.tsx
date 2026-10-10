'use client';

/**
 * CTW đợt 9c — SINH VIÊN LÀM QUIZ.
 *
 *   QuizStudent  trang quiz của sinh viên: thông tin, các lượt của mình, Bắt đầu / Làm tiếp / Xem kết quả.
 *   QuizTake     màn làm bài toàn màn hình:
 *     · Đồng hồ theo MÁY CHỦ: lệch giờ = serverNow − giờ máy lúc nhận đề; hạn = deadlineAt của lượt. Về 0 ⇒ tự nộp.
 *       Máy chủ vẫn là trọng tài cuối: quá hạn (+2 s) nó từ chối ghi (409 WORK_QUIZ_TIME_UP) và tự nộp phần đã lưu.
 *     · Tự lưu TỪNG CÂU (gom 0,7 s) + bản sao trong localStorage ⇒ tải lại trang / mất mạng không mất bài; mất mạng thì
 *       xếp hàng và gửi lại khi có mạng (sự kiện `online` + thử lại mỗi 5 s).
 *     · Rời tab: chỉ báo máy chủ để ĐẾM (giảng viên xem), không chặn, không cảnh cáo dồn dập.
 *     · Đề không có đáp án (máy chủ đã lọc) — trang này không có gì để lộ.
 *   AttemptReview  kết quả một lượt: điểm; đáp án + giải thích CHỈ khi máy chủ gửi `review` (đã được phép xem).
 * Mọi hook đặt TRƯỚC lệnh return sớm.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle, ArrowLeft, ChevronLeft, ChevronRight, Clock, CloudOff, Loader2, LogOut, Play, RotateCcw, Send, TimerOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { Dialog, EmptyState, PageLoading, Spinner, WorkPortal } from '@/components/work/ui';
import { useWT, type WKey } from '@/components/work/i18n';
import { StateChip } from './QuizEditor';
import QuizText from './QuizText';
import { quizApi, quizKeys, type PaperItem, type QuizDetailStudent, type Resp, type StudentAttempt } from './quizApi';

const LS = (aid: number) => `ctw-quiz-attempt-${aid}`;
function readLocal(aid: number): Record<string, Resp | null> {
  try { const s = localStorage.getItem(LS(aid)); return s ? JSON.parse(s) as Record<string, Resp | null> : {}; } catch { return {}; }
}
function writeLocal(aid: number, v: Record<string, Resp | null>) { try { localStorage.setItem(LS(aid), JSON.stringify(v)); } catch { /* đầy / bị chặn */ } }
function clearLocal(aid: number) { try { localStorage.removeItem(LS(aid)); } catch { /* bỏ qua */ } }

const errCode = (err: unknown) => (err as { response?: { data?: { code?: string; error?: { code?: string } } } })?.response?.data?.code
  ?? (err as { response?: { data?: { error?: { code?: string } } } })?.response?.data?.error?.code;
const isNetwork = (err: unknown) => !(err as { response?: unknown })?.response;

const answered = (r: Resp | null | undefined) => !!r && (!!r.choice || !!r.choices?.length || typeof r.value === 'boolean' || !!r.text?.trim() || !!(r.pairs && Object.keys(r.pairs).length));

function fmtClock(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return `${h ? `${h}:` : ''}${String(m).padStart(h ? 2 : 1, '0')}:${String(sec).padStart(2, '0')}`;
}

// ─── Một câu ────────────────────────────────────────────────────

export function QuestionField({ item, index, value, onChange, readOnly }: { item: PaperItem; index: number; value: Resp | null | undefined; onChange?: (v: Resp | null) => void; readOnly?: boolean }) {
  const { t } = useWT();
  const name = `quiz-${item.key}`;
  const labelId = `${name}-label`;
  return (
    <div>
      <div id={labelId} className="mb-2">
        <div className="mb-1 flex items-center gap-2 text-[12px] text-[var(--w-text-2)]">
          <span className="font-semibold text-[var(--w-text)]">{t('c9c.questionN', { n: index + 1 })}</span>
          <span className="tabular-nums">{t('c9c.pts', { n: item.points })}</span>
          <span>· {t(item.type === 'MULTI' ? 'c9c.chooseMany' : item.type === 'SHORT' ? 'c9c.typeAnswer' : item.type === 'MATCH' ? 'c9c.matchEach' : 'c9c.chooseOne')}</span>
        </div>
        <QuizText text={item.prompt} className="text-[14.5px]" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {item.imageUrl && <img src={item.imageUrl} alt="" className="mt-2 max-h-[340px] max-w-full rounded-[6px] border border-[var(--w-border)]" />}
      </div>
      {(item.type === 'SINGLE' || item.type === 'TRUE_FALSE') && (
        <div role="radiogroup" aria-labelledby={labelId} className="space-y-1.5">
          {(item.type === 'TRUE_FALSE' ? [{ id: 'T', text: t('c9c.trueLabel') }, { id: 'F', text: t('c9c.falseLabel') }] : item.options ?? []).map((o) => {
            const checked = item.type === 'TRUE_FALSE' ? (o.id === 'T' ? value?.value === true : value?.value === false) : value?.choice === o.id;
            return (
              <label key={o.id} className={cn('flex cursor-pointer items-start gap-2.5 rounded-[8px] border px-3 py-2 text-[14px] transition-colors', checked ? 'border-[var(--w-accent)] bg-[var(--w-accent-soft)]' : 'border-[var(--w-border)] hover:bg-[var(--w-hover)]', readOnly && 'cursor-default')}>
                <input type="radio" name={name} className="mt-1 h-4 w-4 shrink-0 accent-[var(--w-accent)]" checked={checked} disabled={readOnly}
                  onChange={() => onChange?.(item.type === 'TRUE_FALSE' ? { value: o.id === 'T' } : { choice: o.id })} />
                <QuizText text={o.text} className="flex-1" />
              </label>
            );
          })}
        </div>
      )}
      {item.type === 'MULTI' && (
        <div role="group" aria-labelledby={labelId} className="space-y-1.5">
          {(item.options ?? []).map((o) => {
            const set = new Set(value?.choices ?? []);
            const checked = set.has(o.id);
            return (
              <label key={o.id} className={cn('flex cursor-pointer items-start gap-2.5 rounded-[8px] border px-3 py-2 text-[14px] transition-colors', checked ? 'border-[var(--w-accent)] bg-[var(--w-accent-soft)]' : 'border-[var(--w-border)] hover:bg-[var(--w-hover)]', readOnly && 'cursor-default')}>
                <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-[var(--w-accent)]" checked={checked} disabled={readOnly}
                  onChange={(e) => { if (e.target.checked) set.add(o.id); else set.delete(o.id); onChange?.(set.size ? { choices: [...set] } : null); }} />
                <QuizText text={o.text} className="flex-1" />
              </label>
            );
          })}
        </div>
      )}
      {item.type === 'SHORT' && (
        <input className="w-input max-w-[480px]" aria-labelledby={labelId} value={value?.text ?? ''} readOnly={readOnly} maxLength={500} placeholder={t('c9c.yourAnswer')}
          onChange={(e) => onChange?.(e.target.value ? { text: e.target.value } : null)} autoComplete="off" spellCheck={false} />
      )}
      {item.type === 'MATCH' && (
        <div role="group" aria-labelledby={labelId} className="space-y-1.5">
          {(item.left ?? []).map((l) => (
            <div key={l.id} className="grid items-center gap-2 sm:grid-cols-[1fr_auto_1fr]">
              <div className="rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 text-[14px]"><QuizText text={l.text} inline /></div>
              <span aria-hidden="true" className="hidden text-[var(--w-text-3)] sm:inline">→</span>
              <select className="w-input" aria-label={l.text} value={value?.pairs?.[l.id] ?? ''} disabled={readOnly}
                onChange={(e) => {
                  const pairs = { ...(value?.pairs ?? {}) };
                  if (e.target.value) pairs[l.id] = e.target.value; else delete pairs[l.id];
                  onChange?.(Object.keys(pairs).length ? { pairs } : null);
                }}>
                <option value="">{t('c9c.matchPick')}</option>
                {(item.right ?? []).map((r) => <option key={r.id} value={r.id}>{r.text}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Màn làm bài ────────────────────────────────────────────────

export function QuizTake({ cid, qid, attempt, onFinished, onExit }: { cid: number; qid: number; attempt: StudentAttempt; onFinished: (a: StudentAttempt) => void; onExit: () => void }) {
  const { t, fmtDateTime } = useWT();
  const aid = attempt.id;
  const [answers, setAnswers] = useState<Record<string, Resp | null>>(() => ({ ...attempt.responses, ...readLocal(aid) }));
  const [dirty, setDirty] = useState<Set<string>>(() => new Set(Object.keys(readLocal(aid))));
  const [saving, setSaving] = useState(false);
  const [offline, setOffline] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(attempt.lastSavedAt);
  const [page, setPage] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const offset = useRef(new Date(attempt.serverNow).getTime() - Date.now());
  const deadline = attempt.deadlineAt ? new Date(attempt.deadlineAt).getTime() : null;
  const [now, setNow] = useState(() => Date.now() + offset.current);
  const answersRef = useRef(answers);
  const dirtyRef = useRef(dirty);
  const finished = useRef(false);
  answersRef.current = answers;
  dirtyRef.current = dirty;
  const paper = attempt.paper;
  const onePerPage = attempt.layout === 'ONE_PER_PAGE';

  const finishWith = useCallback((a: StudentAttempt) => {
    if (finished.current) return;
    finished.current = true;
    clearLocal(aid);
    onFinished(a);
  }, [aid, onFinished]);

  /** Hết giờ / đã nộp ở nơi khác ⇒ đọc kết quả lượt từ máy chủ. */
  const loadResult = useCallback(async () => {
    try {
      const v = await quizApi.attempt(cid, qid, aid);
      if (!v.manage && v.attempt.status === 'SUBMITTED') finishWith(v.attempt);
    } catch { /* thử lại ở nhịp sau */ }
  }, [cid, qid, aid, finishWith]);

  const flush = useCallback(async () => {
    const keys = [...dirtyRef.current];
    if (!keys.length || finished.current) return;
    const batch: Record<string, Resp | null> = {};
    for (const k of keys) batch[k] = answersRef.current[k] ?? null;
    setSaving(true);
    try {
      const r = await quizApi.save(cid, qid, aid, batch);
      offset.current = new Date(r.serverNow).getTime() - Date.now();
      setSavedAt(r.savedAt);
      setOffline(false);
      // Chỉ xoá cờ của câu KHÔNG đổi thêm trong lúc gửi.
      setDirty((prev) => {
        const next = new Set(prev);
        for (const k of keys) if (JSON.stringify(answersRef.current[k] ?? null) === JSON.stringify(batch[k])) next.delete(k);
        return next;
      });
    } catch (err) {
      const code = errCode(err);
      if (code === 'WORK_QUIZ_TIME_UP' || code === 'WORK_QUIZ_SUBMITTED') { toast.message(t('c9c.timeUp')); await loadResult(); return; }
      if (isNetwork(err)) setOffline(true);
      else toast.error(workError(err));
    } finally { setSaving(false); }
  }, [cid, qid, aid, loadResult, t]);

  // Gom lưu 0,7 s sau thay đổi.
  useEffect(() => {
    writeLocal(aid, Object.fromEntries([...dirty].map((k) => [k, answers[k] ?? null])));
    if (!dirty.size) return;
    const h = window.setTimeout(() => void flush(), 700);
    return () => window.clearTimeout(h);
  }, [answers, dirty, aid, flush]);

  // Mất mạng ⇒ thử lại mỗi 5 s + ngay khi có mạng.
  useEffect(() => {
    const on = () => void flush();
    window.addEventListener('online', on);
    const h = window.setInterval(() => { if (dirtyRef.current.size) void flush(); }, 5000);
    return () => { window.removeEventListener('online', on); window.clearInterval(h); };
  }, [flush]);

  // Rời tab: chỉ ghi nhận.
  useEffect(() => {
    const onVis = () => { quizApi.focus(cid, qid, aid, document.visibilityState === 'hidden' ? 'blur' : 'focus').catch(() => undefined); };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [cid, qid, aid]);

  const submit = useCallback(async (auto: boolean) => {
    if (finished.current) return;
    setSubmitting(true);
    const pending: Record<string, Resp | null> = {};
    for (const k of dirtyRef.current) pending[k] = answersRef.current[k] ?? null;
    try {
      const r = await quizApi.submit(cid, qid, aid, Object.keys(pending).length ? pending : undefined);
      if (auto) toast.message(t('c9c.timeUp'));
      finishWith(r);
    } catch (err) {
      const code = errCode(err);
      if (code === 'WORK_QUIZ_TIME_UP' || code === 'WORK_QUIZ_SUBMITTED') { await loadResult(); return; }
      if (isNetwork(err)) { setOffline(true); toast.error(t('c9c.submitOffline')); } else toast.error(workError(err));
    } finally { setSubmitting(false); setConfirm(false); }
  }, [cid, qid, aid, finishWith, loadResult, t]);

  // Đồng hồ.
  const autoFired = useRef(false);
  useEffect(() => {
    const h = window.setInterval(() => {
      const n = Date.now() + offset.current;
      setNow(n);
      if (deadline && n >= deadline && !autoFired.current) { autoFired.current = true; void submit(true); }
      // Mất mạng lúc hết giờ: máy chủ đã tự nộp — hỏi lại kết quả.
      if (deadline && n >= deadline + 5000 && !finished.current) void loadResult();
    }, 1000);
    return () => window.clearInterval(h);
  }, [deadline, submit, loadResult]);

  const setAnswer = (key: string, v: Resp | null) => {
    setAnswers((p) => ({ ...p, [key]: v }));
    setDirty((p) => new Set(p).add(key));
  };
  const answeredCount = useMemo(() => paper.filter((p) => answered(answers[p.key])).length, [paper, answers]);
  const remaining = deadline ? deadline - now : null;
  const low = remaining !== null && remaining < 60_000;
  const shown = onePerPage ? [paper[Math.min(page, paper.length - 1)]] : paper;

  return (
    <WorkPortal>
      <div className="fixed inset-0 z-[60] flex flex-col bg-[var(--w-bg)]" role="dialog" aria-modal="true" aria-labelledby="quiz-take-title" data-testid="quiz-take">
        <header className="flex flex-wrap items-center gap-3 border-b border-[var(--w-border)] bg-[var(--w-panel)] px-4 py-2.5">
          <div className="min-w-0 flex-1">
            <h2 id="quiz-take-title" className="truncate text-[15px] font-semibold">{attempt.title}</h2>
            <div className="text-[12px] text-[var(--w-text-2)]">{t('c9c.attemptN', { n: attempt.number })} · {t('c9c.answeredCount', { n: answeredCount, total: paper.length })}</div>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-[var(--w-text-2)]" role="status" aria-live="polite">
            {offline ? <><CloudOff size={14} aria-hidden="true" className="text-[var(--w-orange-text)]" /><span className="text-[var(--w-orange-text)]">{t('c9c.offlineShort')}</span></>
              : saving ? <><Loader2 size={14} aria-hidden="true" className="animate-spin" />{t('c9c.saving')}</>
                : dirty.size ? <span>{t('c9c.unsaved')}</span>
                  : savedAt ? <span>{t('c9c.savedAt', { t: fmtDateTime(savedAt) })}</span> : null}
          </div>
          <div className={cn('flex items-center gap-1.5 rounded-[8px] px-2.5 py-1 font-mono text-[15px] font-semibold tabular-nums', low ? 'bg-[var(--w-danger-bg)] text-white' : 'bg-[var(--w-sunken)]')}
            role="timer" aria-label={t('c9c.timeLeft')} data-testid="quiz-timer">
            <Clock size={14} aria-hidden="true" />{remaining === null ? t('c9c.noLimit') : fmtClock(remaining)}
          </div>
          <button type="button" className="w-btn w-btn-sm" onClick={() => { void flush(); onExit(); }}><LogOut size={13} aria-hidden="true" />{t('c9c.exit')}</button>
          <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={submitting} onClick={() => setConfirm(true)} data-testid="quiz-submit"><Send size={13} aria-hidden="true" />{t('c9c.submit')}</button>
        </header>
        {offline && <div className="border-b border-[var(--w-border)] bg-[var(--w-sunken)] px-4 py-1.5 text-[12.5px] text-[var(--w-orange-text)]" role="alert">{t('c9c.offline')}</div>}

        <div className="flex min-h-0 flex-1">
          <nav aria-label={t('c9c.questionNav')} className="hidden w-[180px] shrink-0 overflow-y-auto border-r border-[var(--w-border)] p-3 md:block">
            <div className="grid grid-cols-5 gap-1.5">
              {paper.map((p, i) => (
                <button key={p.key} type="button" aria-label={t('c9c.jumpTo', { n: i + 1 })} aria-current={onePerPage && i === page ? 'step' : undefined}
                  onClick={() => { if (onePerPage) setPage(i); else document.getElementById(`quiz-q-${p.key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                  className={cn('h-8 rounded-[6px] border text-[12px] font-medium tabular-nums', answered(answers[p.key]) ? 'border-[var(--w-accent)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'border-[var(--w-border)] text-[var(--w-text-2)]', onePerPage && i === page && 'ring-2 ring-[var(--w-accent-border)]')}>
                  {i + 1}
                </button>
              ))}
            </div>
            <p className="mt-3 text-[11.5px] leading-relaxed text-[var(--w-text-3)]">{t('c9c.tabNote')}</p>
          </nav>
          <main className="min-w-0 flex-1 overflow-y-auto">
            <div className="mx-auto max-w-[760px] space-y-4 px-4 py-5">
              {shown.map((p) => {
                const i = paper.indexOf(p);
                return (
                  <section key={p.key} id={`quiz-q-${p.key}`} className="w-card scroll-mt-4 p-4" aria-label={t('c9c.questionN', { n: i + 1 })}>
                    <QuestionField item={p} index={i} value={answers[p.key]} onChange={(v) => setAnswer(p.key, v)} />
                  </section>
                );
              })}
              {onePerPage && (
                <div className="flex items-center justify-between">
                  <button type="button" className="w-btn" disabled={page === 0} onClick={() => setPage((x) => x - 1)}><ChevronLeft size={14} aria-hidden="true" />{t('c9c.prev')}</button>
                  <span className="text-[12.5px] tabular-nums text-[var(--w-text-2)]">{t('c9c.questionOf', { n: page + 1, total: paper.length })}</span>
                  {page < paper.length - 1
                    ? <button type="button" className="w-btn w-btn-primary" onClick={() => setPage((x) => x + 1)}>{t('c9c.next')}<ChevronRight size={14} aria-hidden="true" /></button>
                    : <button type="button" className="w-btn w-btn-primary" onClick={() => setConfirm(true)}><Send size={13} aria-hidden="true" />{t('c9c.submit')}</button>}
                </div>
              )}
              {!onePerPage && <div className="flex justify-end"><button type="button" className="w-btn w-btn-primary" onClick={() => setConfirm(true)}><Send size={13} aria-hidden="true" />{t('c9c.submit')}</button></div>}
            </div>
          </main>
        </div>
      </div>
      <Dialog open={confirm} onClose={() => setConfirm(false)} width={440} title={t('c9c.submitConfirm')}
        footer={<>
          <button type="button" className="w-btn" onClick={() => setConfirm(false)}>{t('c9c.keepWorking')}</button>
          <button type="button" className="w-btn w-btn-primary" autoFocus disabled={submitting} onClick={() => void submit(false)} data-testid="quiz-submit-confirm">{submitting && <Spinner size={12} />}{t('c9c.submit')}</button>
        </>}>
        <p className="text-[13px] leading-relaxed text-[var(--w-text-2)]">{t('c9c.submitBody', { answered: answeredCount, total: paper.length })}</p>
        {answeredCount < paper.length && <p className="mt-2 flex items-center gap-1.5 text-[13px] text-[var(--w-orange-text)]"><AlertTriangle size={14} aria-hidden="true" />{t('c9c.unansweredN', { n: paper.length - answeredCount })}</p>}
      </Dialog>
    </WorkPortal>
  );
}

// ─── Kết quả một lượt ───────────────────────────────────────────

export function AttemptReview({ attempt }: { attempt: StudentAttempt }) {
  const { t, fmtDateTime } = useWT();
  const pct = attempt.maxScore ? Math.round(((attempt.score ?? 0) / attempt.maxScore) * 1000) / 10 : 0;
  return (
    <div className="space-y-3" data-testid="quiz-review">
      <div className="w-card flex flex-wrap items-center gap-4 p-4">
        <div>
          <div className="w-eyebrow">{t('c9c.attemptN', { n: attempt.number })}</div>
          <div className="text-[26px] font-semibold tabular-nums">{attempt.score ?? 0}<span className="text-[16px] text-[var(--w-text-2)]"> / {attempt.maxScore}</span></div>
          <div className="text-[12.5px] text-[var(--w-text-2)]">{pct}% · {attempt.submittedAt ? t('c9c.submittedAt', { t: fmtDateTime(attempt.submittedAt) }) : ''}</div>
        </div>
        {attempt.autoSubmitted && <span className="inline-flex items-center gap-1.5 text-[13px] text-[var(--w-orange-text)]"><TimerOff size={14} aria-hidden="true" />{t('c9c.autoSubmitted')}</span>}
        {!attempt.reveal && (
          <p className="ml-auto max-w-[420px] text-[13px] text-[var(--w-text-2)]">
            {attempt.revealAt ? t('c9c.answersAfter', { t: fmtDateTime(attempt.revealAt) }) : t('c9c.answersNever')}
          </p>
        )}
      </div>
      <ol className="space-y-2">
        {attempt.paper.map((p, i) => {
          const rv = attempt.review?.[p.key];
          return (
            <li key={p.key} className={cn('w-card p-4', rv && (rv.correct ? 'border-[var(--w-green)]' : rv.partial ? 'border-[var(--w-yellow)]' : 'border-[var(--w-red)]'))}>
              {rv && (
                <div className={cn('mb-2 flex items-center justify-between text-[12.5px] font-medium', rv.correct ? 'text-[var(--w-green-text)]' : rv.partial ? 'text-[var(--w-yellow-text)]' : 'text-[var(--w-red-text)]')}>
                  <span>{t(rv.correct ? 'c9c.correctBadge' : rv.partial ? 'c9c.partialBadge' : 'c9c.wrongBadge')}</span>
                  <span className="tabular-nums">{rv.earned} / {rv.max}</span>
                </div>
              )}
              <QuestionField item={p} index={i} value={attempt.responses[p.key]} readOnly />
              {rv && (
                <div className="mt-3 space-y-1.5 border-t border-[var(--w-border)] pt-2 text-[13px]">
                  <div><span className="text-[var(--w-text-2)]">{t('c9c.correctAnswer')}: </span><span className="text-[var(--w-green-text)]">{reviewAnswer(p, rv.answer, t)}</span></div>
                  {rv.explanation && <div className="text-[var(--w-text-2)]"><span className="font-medium">{t('c9c.explanation')}: </span><QuizText text={rv.explanation} className="mt-0.5" /></div>}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function reviewAnswer(p: PaperItem, a: { correct?: string[]; value?: boolean; accepted?: string[]; pairs?: Record<string, string> }, t: (k: WKey) => string) {
  if (p.type === 'SINGLE' || p.type === 'MULTI') return (a.correct ?? []).map((c) => p.options?.find((o) => o.id === c)?.text).filter(Boolean).join(' · ');
  if (p.type === 'TRUE_FALSE') return t(a.value ? 'c9c.trueLabel' : 'c9c.falseLabel');
  if (p.type === 'SHORT') return (a.accepted ?? []).join(' | ');
  return (p.left ?? []).map((l) => `${l.text} → ${p.right?.find((r) => r.id === a.pairs?.[l.id])?.text ?? ''}`).join(' · ');
}

// ─── Trang quiz của sinh viên ───────────────────────────────────

export function QuizStudent({ cid, qid, onBack }: { cid: number; qid: number; onBack: () => void }) {
  const { t, fmtDateTime } = useWT();
  const qc = useQueryClient();
  const detail = useQuery({ queryKey: quizKeys.quiz(cid, qid), queryFn: () => quizApi.get(cid, qid) });
  const [taking, setTaking] = useState<StudentAttempt | null>(null);
  const [viewing, setViewing] = useState<StudentAttempt | null>(null);
  const refresh = () => { qc.invalidateQueries({ queryKey: quizKeys.quiz(cid, qid) }); qc.invalidateQueries({ queryKey: quizKeys.list(cid) }); };
  const start = useMutation({ mutationFn: () => quizApi.start(cid, qid), onSuccess: (a) => { setViewing(null); setTaking(a); }, onError: (err) => { toast.error(workError(err)); refresh(); } });
  const open = useMutation({
    mutationFn: (aid: number) => quizApi.attempt(cid, qid, aid),
    onSuccess: (v) => { if (!v.manage) { if (v.attempt.status === 'IN_PROGRESS') setTaking(v.attempt); else setViewing(v.attempt); } },
    onError: (err) => toast.error(workError(err)),
  });
  const onFinished = useCallback((a: StudentAttempt) => { setTaking(null); setViewing(a); refresh(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (detail.isLoading) return <PageLoading rows={3} />;
  const q = detail.data && !detail.data.manage ? detail.data as QuizDetailStudent : null;
  if (detail.error || !q) return <EmptyState title={workError(detail.error)} action={<button type="button" className="w-btn" onClick={onBack}>{t('c9c.back')}</button>} />;
  const me = q.me;

  return (
    <div className="space-y-4" data-testid="quiz-student">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-[13px] text-[var(--w-text-2)] hover:text-[var(--w-text)]"><ArrowLeft size={14} aria-hidden="true" />{t('c9c.back')}</button>
      <div className="w-card space-y-3 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2"><StateChip state={q.state} />{q.topic && <span className="text-[12px] text-[var(--w-text-2)]">{q.topic}</span>}</div>
            <h3 className="text-[18px] font-semibold">{q.title}</h3>
          </div>
          <div className="flex gap-2">
            {me.canResume && me.inProgressId && <button type="button" className="w-btn w-btn-primary" onClick={() => open.mutate(me.inProgressId!)} disabled={open.isPending} data-testid="quiz-resume"><Play size={14} aria-hidden="true" />{t('c9c.resume')}</button>}
            {me.canStart && <button type="button" className="w-btn w-btn-primary" onClick={() => start.mutate()} disabled={start.isPending} data-testid="quiz-start">{start.isPending ? <Spinner size={12} /> : me.attemptsUsed ? <RotateCcw size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}{me.attemptsUsed ? t('c9c.tryAgain', { n: me.attemptsLeft }) : t('c9c.start')}</button>}
          </div>
        </div>
        {q.description && <QuizText text={q.description} className="text-[13.5px] text-[var(--w-text-2)]" />}
        <dl className="grid gap-x-6 gap-y-1.5 text-[13px] sm:grid-cols-2">
          <Info k={t('c9c.questionsLabel')} v={t('c9c.questionsPoints', { n: q.questionCount, p: q.totalPoints })} />
          <Info k={t('c9c.timeLimit')} v={q.timeLimitMin ? t('c9c.minutes', { n: q.timeLimitMin }) : t('c9c.noLimit')} />
          <Info k={t('c9c.attemptsCol')} v={t('c9c.attemptsUsed', { used: me.attemptsUsed, max: q.maxAttempts })} />
          <Info k={t('c9c.scoring')} v={t(`c9c.scoring_${q.scoring}` as WKey)} />
          {q.openAt && <Info k={t('c9c.openAt')} v={fmtDateTime(q.openAt)} />}
          <Info k={t('c9c.closeAt')} v={q.closeAt ? fmtDateTime(q.closeAt) : t('c9c.noDeadline')} />
          <Info k={t('c9c.showAnswers')} v={t(`c9c.show_${q.showAnswers}` as WKey)} />
          {me.score && <Info k={t('c9c.keptScore')} v={`${me.score.score} / ${me.score.max}`} strong />}
        </dl>
        {q.state === 'SCHEDULED' && <p className="text-[13px] text-[var(--w-blue-text)]">{t('c9c.notOpen', { t: fmtDateTime(q.openAt) })}</p>}
        {q.state === 'CLOSED' && <p className="text-[13px] text-[var(--w-text-2)]">{t('c9c.closedMsg')}</p>}
        {q.state === 'OPEN' && !me.canStart && !me.canResume && <p className="text-[13px] text-[var(--w-text-2)]">{t('c9c.noAttemptsLeft')}</p>}
        {(me.canStart || me.canResume) && <p className="text-[12.5px] text-[var(--w-text-3)]">{t('c9c.beforeStart')}</p>}
      </div>

      {!!q.attempts.length && (
        <section aria-labelledby="quiz-my-attempts">
          <h4 id="quiz-my-attempts" className="w-section-title mb-2">{t('c9c.yourAttempts')}</h4>
          <ul className="divide-y divide-[var(--w-border)] rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)]">
            {q.attempts.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center gap-3 px-3 py-2 text-[13px]">
                <span className="font-medium">{t('c9c.attemptN', { n: a.number })}</span>
                <span className="tabular-nums text-[var(--w-text-2)]">{a.status === 'SUBMITTED' ? `${a.score} / ${a.maxScore}` : t('c9c.inProgress')}</span>
                {a.autoSubmitted && <span className="text-[12px] text-[var(--w-orange-text)]">{t('c9c.autoTag')}</span>}
                <span className="text-[12px] text-[var(--w-text-3)]">{fmtDateTime(a.submittedAt ?? a.startedAt)}</span>
                <button type="button" className="w-btn w-btn-sm ml-auto" onClick={() => open.mutate(a.id)}>{a.status === 'SUBMITTED' ? t('c9c.viewResult') : t('c9c.resume')}</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {viewing && <AttemptReview attempt={viewing} />}
      {taking && <QuizTake cid={cid} qid={qid} attempt={taking} onFinished={onFinished} onExit={() => { setTaking(null); refresh(); }} />}
    </div>
  );
}

function Info({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return <div className="flex gap-2"><dt className="w-[140px] shrink-0 text-[var(--w-text-2)]">{k}</dt><dd className={cn(strong && 'font-semibold')}>{v}</dd></div>;
}
