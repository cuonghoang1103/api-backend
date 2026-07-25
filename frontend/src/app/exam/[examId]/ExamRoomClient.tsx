'use client';

/**
 * Exam Room — the live exam-taking experience for one exam.
 *
 * Handles all four kinds behind one shell (intro → taking → submit → redirect
 * to review): FE multiple-choice (single & multi-select, question navigator,
 * flags), PE CODE (read problems, upload one .zip), PE WRITE (English essays),
 * PE SPEAK (record audio per question, auto-generate questions if none).
 * Server-authoritative countdown (expiresAt); auto-submits on timeout. EN/VN
 * toggle throughout. Anti-cheat: counts tab/window blur events.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  Clock as ClockIcon, Flag as FlagIcon, Check as CheckIcon,
  ArrowLeft as ArrowLeftIcon, ArrowRight as ArrowRightIcon,
  Upload as ArrowUpTrayIcon, Download as ArrowDownTrayIcon,
  Mic as MicrophoneIcon, Square as StopIcon, FileText as DocumentTextIcon,
} from 'lucide-react';
import { examApi, type ExamHeader, type ExamTakingQuestion } from '@/lib/api';
import { pickLang, sanitizeHtml, stripInlineColors } from '@/lib/utils';
import ExamRichContent from '../ExamRichContent';
import './../exam.css';

type FullExam = ExamHeader & { questions: ExamTakingQuestion[] };
type Phase = 'loading' | 'intro' | 'taking' | 'submitting';

function fmt(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const p = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${p(h)}:${p(m)}:${p(sec)}` : `${p(m)}:${p(sec)}`;
}

export default function ExamRoomClient({ examId }: { examId: number }) {
  const router = useRouter();
  // Exams default to English; local toggle only (does not change site locale).
  const [L, setL] = useState<'en' | 'vi'>('en');
  const isVi = L === 'vi';

  const [phase, setPhase] = useState<Phase>('loading');
  const [exam, setExam] = useState<FullExam | null>(null);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const startedRef = useRef<number>(Date.now());
  const blurCount = useRef<number>(0);

  // Answers
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [flags, setFlags] = useState<Set<number>>(new Set());
  const [essays, setEssays] = useState<Record<number, string>>({});
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [recordings, setRecordings] = useState<Record<string, Blob>>({}); // key `${qid}:${promptIdx}`
  const [genPrompts, setGenPrompts] = useState<Record<number, { text: string }[]>>({});

  const submittedRef = useRef(false);

  // ── Load exam ────────────────────────────────────────────────────────
  useEffect(() => {
    let alive = true;
    examApi.getForTaking(examId)
      .then((r) => { if (alive) { setExam(r.data.data); setPhase('intro'); } })
      .catch((e) => { toast.error(e?.response?.data?.message || 'Không tải được đề thi'); router.push('/exam'); });
    return () => { alive = false; };
  }, [examId, router]);

  // ── Timer tick ───────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'taking') return;
    const t = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(t);
  }, [phase]);

  // ── Anti-cheat: count blur/visibility while taking ───────────────────
  useEffect(() => {
    if (phase !== 'taking') return;
    const onBlur = () => { blurCount.current += 1; };
    const onVis = () => { if (document.hidden) blurCount.current += 1; };
    window.addEventListener('blur', onBlur);
    document.addEventListener('visibilitychange', onVis);
    return () => { window.removeEventListener('blur', onBlur); document.removeEventListener('visibilitychange', onVis); };
  }, [phase]);

  const remaining = expiresAt ? expiresAt - nowMs : 0;
  const timeSpentSeconds = () => Math.max(0, Math.floor((Date.now() - startedRef.current) / 1000));

  // ── Start / resume ───────────────────────────────────────────────────
  const start = useCallback(async () => {
    try {
      const r = await examApi.start(examId);
      setAttemptId(r.data.data.attemptId);
      setExpiresAt(r.data.data.expiresAt ? new Date(r.data.data.expiresAt).getTime() : null);
      startedRef.current = Date.now();
      setNowMs(Date.now());
      setPhase('taking');
      if (r.data.data.resumed) toast(isVi ? 'Tiếp tục bài thi đang dở' : 'Resumed your in-progress attempt');
    } catch (e) {
      toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không bắt đầu được');
    }
  }, [examId, isVi]);

  // ── Submit ───────────────────────────────────────────────────────────
  const doSubmit = useCallback(async (auto = false) => {
    if (!exam || !attemptId || submittedRef.current) return;
    submittedRef.current = true;
    setPhase('submitting');
    const ts = timeSpentSeconds();
    const integrity = { blurCount: blurCount.current, auto };
    try {
      if (exam.kind === 'FE') {
        const payload: Record<string, number[]> = {};
        for (const [k, v] of Object.entries(answers)) payload[k] = v;
        await examApi.submitFe(attemptId, { answers: payload, timeSpentSeconds: ts, integritySignals: integrity });
      } else if (exam.peType === 'CODE') {
        if (!zipFile) { submittedRef.current = false; setPhase('taking'); toast.error(isVi ? 'Hãy chọn file .zip để nộp' : 'Please choose a .zip to submit'); return; }
        await examApi.submitCode(attemptId, zipFile, ts);
      } else if (exam.peType === 'WRITE') {
        const payload: Record<string, string> = {};
        for (const [k, v] of Object.entries(essays)) payload[k] = v;
        await examApi.submitWrite(attemptId, { essays: payload, timeSpentSeconds: ts });
      } else if (exam.peType === 'SPEAK') {
        const q = exam.questions.find((x) => x.kind === 'SPEAK');
        if (q) {
          const prompts = (q.speakingPrompts?.length ? q.speakingPrompts : genPrompts[q.id]) || [];
          const blobs: Blob[] = [];
          for (let i = 0; i < prompts.length; i++) {
            const b = recordings[`${q.id}:${i}`];
            if (b) blobs.push(b);
          }
          if (!blobs.length) { submittedRef.current = false; setPhase('taking'); toast.error(isVi ? 'Hãy thu âm ít nhất một câu' : 'Please record at least one answer'); return; }
          await examApi.submitSpeak(attemptId, q.id, blobs, ts);
        }
      }
      toast.success(isVi ? 'Đã nộp bài!' : 'Submitted!');
      router.push(`/exam/attempt/${attemptId}`);
    } catch (e) {
      submittedRef.current = false;
      setPhase('taking');
      toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message || (isVi ? 'Nộp bài thất bại' : 'Submit failed'));
    }
  }, [exam, attemptId, answers, essays, zipFile, recordings, genPrompts, router, isVi]);

  // Auto-submit on timeout
  useEffect(() => {
    if (phase === 'taking' && expiresAt && remaining <= 0 && !submittedRef.current) {
      toast(isVi ? 'Hết giờ — tự động nộp bài' : "Time's up — auto-submitting");
      void doSubmit(true);
    }
  }, [phase, expiresAt, remaining, doSubmit, isVi]);

  if (phase === 'loading' || !exam) {
    return <div className="min-h-[60vh] flex items-center justify-center text-text-muted">{isVi ? 'Đang tải…' : 'Loading…'}</div>;
  }

  const answeredCount = exam.kind === 'FE'
    ? exam.questions.filter((q) => (answers[q.id]?.length ?? 0) > 0).length
    : 0;

  // ── Intro screen ─────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="exam-root" data-ml={L}>
        <div className="max-w-2xl mx-auto px-4 py-10">
          <button onClick={() => router.push('/exam')} className="text-sm text-text-secondary hover:text-text-primary flex items-center gap-1 mb-6">
            <ArrowLeftIcon className="w-4 h-4" /> {isVi ? 'Phòng thi' : 'Exam Room'}
          </button>
          <div className="exam-card p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-3">
              <span className={`exam-badge ${exam.kind === 'FE' ? 'exam-badge-fe' : 'exam-badge-pe'}`}>
                {exam.kind === 'FE' ? (isVi ? 'Trắc nghiệm (FE)' : 'Multiple Choice (FE)') : `PE · ${exam.peType}`}
              </span>
              {exam.source === 'REAL' && <span className="exam-badge exam-badge-real">{isVi ? 'Đề thật' : 'Real paper'}</span>}
              {exam.code && <span className="exam-badge" style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>{exam.code}</span>}
            </div>
            <h1 className="text-2xl font-bold mb-2">{pickLang(exam.title, L)}</h1>
            {exam.description && <p className="text-text-secondary mb-4">{pickLang(exam.description, L)}</p>}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
              <Stat label={isVi ? 'Thời gian' : 'Duration'} value={`${exam.durationMinutes}'`} />
              <Stat label={isVi ? 'Số câu' : 'Questions'} value={String(exam.questions.length)} />
              <Stat label={isVi ? 'Điểm tối đa' : 'Max score'} value={String(exam.totalPoints)} />
              <Stat label={isVi ? 'Điểm đạt' : 'Pass'} value={`≥ ${exam.passMark}`} />
            </div>

            {exam.instructions && (
              <div className="rich-content text-sm text-text-secondary mb-5" data-ml={L}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(stripInlineColors(pickLang(exam.instructions, L))) }} />
            )}

            {exam.attachmentUrl && (
              <a href={exam.attachmentUrl} download
                className="inline-flex items-center gap-2 px-4 py-2.5 mb-5 rounded-xl border border-[var(--exam-accent)] text-[var(--exam-accent)] font-semibold text-sm hover:bg-[rgba(99,102,241,.08)]">
                <ArrowDownTrayIcon className="w-4 h-4" />
                {pickLang(exam.attachmentName || (isVi ? 'Tải file đề (Given)|||Download exam files (Given)' : 'Download exam files (Given)'), L)}
              </a>
            )}

            <div className="exam-explain text-sm mb-6">
              {exam.kind === 'FE'
                ? (isVi ? 'Chọn đáp án cho từng câu. Có câu chọn nhiều đáp án. Đồng hồ chạy ngay khi bắt đầu và tự nộp khi hết giờ.' : 'Answer each question. Some allow multiple answers. The timer starts immediately and auto-submits when it ends.')
                : exam.peType === 'CODE'
                  ? (isVi ? 'Đọc đề, viết code ở IDE/VS Code của bạn, nén tất cả file thành .zip rồi nộp để AI chấm.' : 'Read the problems, code in your own IDE/VS Code, then upload all files as one .zip for AI grading.')
                  : exam.peType === 'WRITE'
                    ? (isVi ? 'Viết bài bằng TIẾNG ANH ngay trong phòng thi. Bài được AI chấm theo tiêu chí.' : 'Write your answer in ENGLISH here in the exam room. Graded by AI against a rubric.')
                    : (isVi ? 'Đề nói: thu âm câu trả lời bằng tiếng Anh cho từng câu hỏi. AI chấm nội dung & phát âm.' : 'Speaking exam: record your English answer for each question. AI grades content & pronunciation.')}
            </div>

            {exam.my && exam.my.attempts > 0 && (
              <div className="text-sm text-text-secondary mb-4">
                {isVi ? 'Lần trước' : 'Previous'}: <b className="text-text-primary">{exam.my.lastScore ?? '—'}</b>/{exam.totalPoints}
                {exam.my.bestScore != null && <> · {isVi ? 'Cao nhất' : 'Best'}: <b className="text-text-primary">{exam.my.bestScore}</b></>}
                {exam.my.lastAttemptId && <> · <button className="text-[var(--exam-accent)] underline" onClick={() => router.push(`/exam/attempt/${exam.my!.lastAttemptId}`)}>{isVi ? 'Xem lại' : 'Review'}</button></>}
              </div>
            )}

            <button onClick={start}
              className="w-full py-3.5 rounded-xl font-semibold text-white transition-transform active:scale-[.99]"
              style={{ background: 'linear-gradient(135deg, var(--exam-accent), var(--exam-accent-2))' }}>
              {exam.my?.inProgressId ? (isVi ? 'Tiếp tục bài thi' : 'Resume attempt') : (isVi ? 'Bắt đầu thi' : 'Start exam')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Taking / submitting ──────────────────────────────────────────────
  const q = exam.questions[idx];
  const timerCls = remaining <= 60_000 ? 'exam-timer-danger' : remaining <= 300_000 ? 'exam-timer-warn' : 'exam-timer-normal';

  const totalQ = exam.questions.length;
  const doneCount = exam.kind === 'FE'
    ? answeredCount
    : exam.peType === 'WRITE'
      ? exam.questions.filter((qq) => (essays[qq.id]?.trim().length ?? 0) > 0).length
      : 0;
  const showProgress = exam.kind === 'FE' || exam.peType === 'WRITE';
  const progressPct = totalQ ? Math.round((doneCount / totalQ) * 100) : 0;

  return (
    <div className="exam-root min-h-screen" data-ml={L}>
      {/* Sticky bar */}
      <div className="exam-bar">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => { if (window.confirm(isVi ? 'Thoát phòng thi? Bài đang làm vẫn được lưu để làm tiếp.' : 'Leave the exam? Your progress is saved so you can resume.')) router.push('/exam'); }}
              className="shrink-0 p-2 rounded-lg border border-[var(--border-color)] hover:border-[var(--exam-accent)]" aria-label={isVi ? 'Thoát' : 'Exit'}>
              <ArrowLeftIcon className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{pickLang(exam.title, L)}</div>
              <div className="text-xs text-text-muted">{showProgress ? `${doneCount}/${totalQ} ${isVi ? 'đã làm' : 'done'} · ${progressPct}%` : (exam.peType || '')}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {expiresAt && (
              <div className={`exam-timer flex items-center gap-1.5 font-bold text-lg ${timerCls}`}>
                <ClockIcon className="w-5 h-5" /> {fmt(remaining)}
              </div>
            )}
            <button onClick={() => { setL(isVi ? 'en' : 'vi'); }} className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[var(--border-color)] hover:border-[var(--exam-accent)]">
              {isVi ? 'EN' : 'VI'}
            </button>
          </div>
        </div>
        {showProgress && (
          <div className="exam-progress" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100} title={`${doneCount}/${totalQ}`}>
            <div className="exam-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 grid lg:grid-cols-[1fr_280px] gap-5">
        {/* Main content */}
        <div className="min-w-0">
          {exam.kind === 'FE' && (
            <McqQuestion
              q={q} idx={idx} total={exam.questions.length} L={L} isVi={isVi}
              selected={answers[q.id] || []}
              flagged={flags.has(q.id)}
              onFlag={() => setFlags((s) => { const n = new Set(s); n.has(q.id) ? n.delete(q.id) : n.add(q.id); return n; })}
              onSelect={(optIdx) => setAnswers((a) => {
                const cur = new Set(a[q.id] || []);
                if (q.multiSelect) { cur.has(optIdx) ? cur.delete(optIdx) : cur.add(optIdx); }
                else { cur.clear(); cur.add(optIdx); }
                return { ...a, [q.id]: [...cur].sort((x, y) => x - y) };
              })}
            />
          )}

          {exam.kind === 'PE' && exam.peType === 'CODE' && (
            <CodeRunner exam={exam} L={L} isVi={isVi} zipFile={zipFile} setZipFile={setZipFile} />
          )}

          {exam.kind === 'PE' && exam.peType === 'WRITE' && (
            <WriteRunner
              q={exam.questions[idx]} idx={idx} total={exam.questions.length} L={L} isVi={isVi}
              value={essays[exam.questions[idx].id] || ''}
              onChange={(v) => setEssays((e) => ({ ...e, [exam.questions[idx].id]: v }))}
            />
          )}

          {exam.kind === 'PE' && exam.peType === 'SPEAK' && (
            <SpeakRunner
              exam={exam} L={L} isVi={isVi} recordings={recordings} setRecordings={setRecordings}
              genPrompts={genPrompts} setGenPrompts={setGenPrompts}
            />
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-[76px] self-start space-y-4">
          {exam.kind === 'FE' && (
            <div className="exam-card p-4">
              <div className="text-xs font-semibold text-text-secondary mb-3">{isVi ? 'Danh sách câu' : 'Questions'}</div>
              <div className="exam-nav-grid">
                {exam.questions.map((qq, i) => (
                  <button key={qq.id} className="exam-nav-cell"
                    data-answered={(answers[qq.id]?.length ?? 0) > 0}
                    data-current={i === idx} data-flagged={flags.has(qq.id)}
                    onClick={() => setIdx(i)}>{i + 1}</button>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-3 text-[11px] text-text-muted">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: 'rgba(99,102,241,.16)', border: '1px solid var(--exam-accent)' }} />{isVi ? 'Đã trả lời' : 'Answered'}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: 'var(--exam-warn)' }} />{isVi ? 'Đánh dấu' : 'Flagged'}</span>
              </div>
            </div>
          )}

          {(exam.kind === 'FE' || exam.peType === 'WRITE') && (
            <div className="exam-card p-4 flex items-center justify-between gap-2">
              <button disabled={idx === 0} onClick={() => setIdx((i) => Math.max(0, i - 1))}
                className="flex-1 py-2 rounded-lg border border-[var(--border-color)] disabled:opacity-40 flex items-center justify-center gap-1 text-sm"><ArrowLeftIcon className="w-4 h-4" />{isVi ? 'Trước' : 'Prev'}</button>
              <button disabled={idx === exam.questions.length - 1} onClick={() => setIdx((i) => Math.min(exam.questions.length - 1, i + 1))}
                className="flex-1 py-2 rounded-lg border border-[var(--border-color)] disabled:opacity-40 flex items-center justify-center gap-1 text-sm">{isVi ? 'Sau' : 'Next'}<ArrowRightIcon className="w-4 h-4" /></button>
            </div>
          )}

          <button onClick={() => doSubmit(false)} disabled={phase === 'submitting'}
            className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-60 transition-transform active:scale-[.99]"
            style={{ background: 'linear-gradient(135deg, var(--exam-accent), var(--exam-accent-2))' }}>
            {phase === 'submitting' ? (isVi ? 'Đang chấm…' : 'Grading…') : (isVi ? 'Nộp bài' : 'Submit')}
          </button>
          {exam.kind !== 'FE' && <p className="text-[11px] text-text-muted text-center">{isVi ? 'AI sẽ chấm và trả kết quả ngay.' : 'AI grades and returns your result right away.'}</p>}
        </aside>
      </div>
    </div>
  );
}

// ── Small pieces ───────────────────────────────────────────────────────
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-3 text-center">
      <div className="text-lg font-bold text-text-primary exam-timer">{value}</div>
      <div className="text-[11px] text-text-muted mt-0.5">{label}</div>
    </div>
  );
}

// Content may be either a pipe string "EN|||VI" (FE) or HTML with .ml-en/.ml-vi
// blocks (PE). pickLang resolves the pipe form; HTML with no "|||" passes
// through and the data-ml wrapper toggles it. Either way → one language.
function Prompt({ html, L }: { html: string; L: 'en' | 'vi' }) {
  return <ExamRichContent html={html} L={L} />;
}

function McqQuestion({ q, idx, total, L, isVi, selected, flagged, onSelect, onFlag }: {
  q: ExamTakingQuestion; idx: number; total: number; L: 'en' | 'vi'; isVi: boolean;
  selected: number[]; flagged: boolean; onSelect: (i: number) => void; onFlag: () => void;
}) {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  return (
    <div className="exam-card p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-semibold text-text-secondary">{isVi ? 'Câu' : 'Question'} {idx + 1}/{total}
          {q.multiSelect && <span className="ml-2 exam-badge exam-badge-fe">{isVi ? `Chọn ${q.selectCount} đáp án` : `Choose ${q.selectCount}`}</span>}
        </div>
        <button onClick={onFlag} className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg border ${flagged ? 'border-[var(--exam-warn)] text-[var(--exam-warn)]' : 'border-[var(--border-color)] text-text-muted'}`}>
          <FlagIcon className="w-3.5 h-3.5" /> {isVi ? 'Đánh dấu' : 'Flag'}
        </button>
      </div>
      <div className="mb-5 text-[15px] leading-relaxed"><Prompt html={q.prompt} L={L} /></div>
      {q.imageUrl && <img src={q.imageUrl} alt="" className="max-w-full rounded-lg border border-[var(--border-color)] mb-5" />}
      <div className="space-y-2.5">
        {(q.options || []).map((o, i) => {
          const sel = selected.includes(i);
          return (
            <button key={i} className="exam-opt" data-selected={sel} data-multi={q.multiSelect} onClick={() => onSelect(i)}>
              <span className="exam-opt-mark">{sel ? <CheckIcon className="w-4 h-4" /> : letters[i]}</span>
              <span className="pt-0.5">{pickLang(o.text, L)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CodeRunner({ exam, L, isVi, zipFile, setZipFile }: {
  exam: FullExam; L: 'en' | 'vi'; isVi: boolean; zipFile: File | null; setZipFile: (f: File | null) => void;
}) {
  return (
    <div className="space-y-4">
      {exam.attachmentUrl && (
        <a href={exam.attachmentUrl} download
          className="flex items-center gap-2 exam-card p-4 border-dashed hover:border-[var(--exam-accent)]">
          <ArrowDownTrayIcon className="w-5 h-5 text-[var(--exam-accent)]" />
          <span className="text-sm font-semibold text-[var(--exam-accent)]">{pickLang(exam.attachmentName || 'Download exam files (Given)|||Tải file đề (Given)', L)}</span>
          <span className="text-xs text-text-muted ml-auto">{isVi ? 'giải nén rồi làm' : 'extract & work on it'}</span>
        </a>
      )}
      {exam.questions.filter((q) => q.kind === 'CODE').map((q, i) => (
        <div key={q.id} className="exam-card p-5">
          <div className="text-sm font-semibold text-text-secondary mb-2">{isVi ? 'Câu' : 'Question'} {i + 1} · {q.points}đ{q.language ? ` · ${q.language}` : ''}</div>
          <div className="text-[15px] leading-relaxed"><Prompt html={q.prompt} L={L} /></div>
          {q.imageUrl && <img src={q.imageUrl} alt="" className="max-w-full rounded-lg border border-[var(--border-color)] my-3" />}
          {q.starterCode && (<div className="mt-3"><div className="text-xs text-text-muted mb-1">{isVi ? 'Mã cho sẵn' : 'Starter'}</div><pre className="exam-terminal">{q.starterCode}</pre></div>)}
          {q.expectedOutput && (<div className="mt-3"><div className="text-xs text-text-muted mb-1">{isVi ? 'Ví dụ / kết quả mong đợi' : 'Example / expected output'}</div><pre className="exam-terminal">{q.expectedOutput}</pre></div>)}
        </div>
      ))}
      <div className="exam-card p-5 border-dashed">
        <div className="flex items-center gap-2 font-semibold mb-2"><ArrowUpTrayIcon className="w-5 h-5 text-[var(--exam-accent)]" />{isVi ? 'Nộp bài (.zip)' : 'Submit (.zip)'}</div>
        <p className="text-sm text-text-secondary mb-3">{isVi ? 'Nén tất cả file mã nguồn (Q1.c, Q2.c…) thành 1 file .zip rồi tải lên. AI sẽ chấm từng câu theo đề + đáp án mẫu.' : 'Zip all your source files (Q1.c, Q2.c…) into one .zip and upload. AI grades each question against the spec + reference solution.'}</p>
        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border-color)] cursor-pointer hover:border-[var(--exam-accent)] text-sm">
          <input type="file" accept=".zip" className="hidden" onChange={(e) => setZipFile(e.target.files?.[0] || null)} />
          {zipFile ? zipFile.name : (isVi ? 'Chọn file .zip' : 'Choose .zip file')}
        </label>
      </div>
    </div>
  );
}

function WriteRunner({ q, idx, total, L, isVi, value, onChange }: {
  q: ExamTakingQuestion; idx: number; total: number; L: 'en' | 'vi'; isVi: boolean; value: string; onChange: (v: string) => void;
}) {
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  return (
    <div className="exam-card p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-3">
        <DocumentTextIcon className="w-5 h-5 text-[var(--exam-accent)]" />
        <span className="text-sm font-semibold text-text-secondary">{isVi ? 'Câu' : 'Question'} {idx + 1}/{total} · {q.points}đ</span>
      </div>
      <div className="mb-4 text-[15px] leading-relaxed"><Prompt html={q.prompt} L={L} /></div>
      <textarea value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={isVi ? 'Viết bài của bạn bằng tiếng Anh tại đây…' : 'Write your answer in English here…'}
        className="w-full min-h-[320px] rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 text-[15px] leading-relaxed outline-none focus:border-[var(--exam-accent)] resize-y exam-scroll" />
      <div className="text-xs text-text-muted mt-2">{words} {isVi ? 'từ' : 'words'} · {isVi ? 'Viết bằng tiếng Anh' : 'Write in English'}</div>
    </div>
  );
}

function SpeakRunner({ exam, L, isVi, recordings, setRecordings, genPrompts, setGenPrompts }: {
  exam: FullExam; L: 'en' | 'vi';
  isVi: boolean; recordings: Record<string, Blob>; setRecordings: (fn: (r: Record<string, Blob>) => Record<string, Blob>) => void;
  genPrompts: Record<number, { text: string }[]>; setGenPrompts: (fn: (g: Record<number, { text: string }[]>) => Record<number, { text: string }[]>) => void;
}) {
  const q = exam.questions.find((x) => x.kind === 'SPEAK')!;
  const [genLoading, setGenLoading] = useState(false);
  const prompts = (q.speakingPrompts?.length ? q.speakingPrompts : genPrompts[q.id]) || [];

  const genQuestions = async () => {
    setGenLoading(true);
    try {
      const r = await examApi.genSpeakingQuestions(q.id, 4);
      setGenPrompts((g) => ({ ...g, [q.id]: r.data.data }));
    } catch { toast.error(isVi ? 'Không tạo được câu hỏi' : 'Could not generate questions'); }
    finally { setGenLoading(false); }
  };

  return (
    <div className="space-y-4">
      <div className="exam-card p-5">
        <div className="text-sm font-semibold text-text-secondary mb-2">{isVi ? 'Đề nói' : 'Speaking task'} · {q.points}đ</div>
        <div className="text-[15px] leading-relaxed"><Prompt html={q.prompt} L={L} /></div>
      </div>
      {prompts.length === 0 && (
        <div className="exam-card p-5 text-center">
          <p className="text-sm text-text-secondary mb-3">{isVi ? 'Đề chưa có câu hỏi nói. Tạo câu hỏi từ đề để luyện thi:' : 'This paper has no speaking questions yet. Generate questions from the topic:'}</p>
          <button onClick={genQuestions} disabled={genLoading} className="px-4 py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-60" style={{ background: 'linear-gradient(135deg, var(--exam-accent), var(--exam-accent-2))' }}>
            {genLoading ? (isVi ? 'Đang tạo…' : 'Generating…') : (isVi ? 'Tạo câu hỏi' : 'Generate questions')}
          </button>
        </div>
      )}
      {prompts.map((p, i) => (
        <Recorder key={i} index={i} text={pickLang(p.text, L)} isVi={isVi}
          blob={recordings[`${q.id}:${i}`]}
          onRecorded={(b) => setRecordings((r) => ({ ...r, [`${q.id}:${i}`]: b }))} />
      ))}
    </div>
  );
}

function Recorder({ index, text, isVi, blob, onRecorded }: {
  index: number; text: string; isVi: boolean; blob?: Blob; onRecorded: (b: Blob) => void;
}) {
  const [recording, setRecording] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<BlobPart[]>([]);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (blob) { const u = URL.createObjectURL(blob); setUrl(u); return () => URL.revokeObjectURL(u); }
  }, [blob]);

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunks.current = [];
      mr.ondataavailable = (e) => { if (e.data.size) chunks.current.push(e.data); };
      mr.onstop = () => { onRecorded(new Blob(chunks.current, { type: 'audio/webm' })); stream.getTracks().forEach((t) => t.stop()); };
      mr.start();
      mediaRef.current = mr;
      setRecording(true);
    } catch { toast.error(isVi ? 'Không truy cập được micro' : 'Microphone access denied'); }
  };
  const stopRec = () => { mediaRef.current?.stop(); setRecording(false); };

  return (
    <div className="exam-card p-4">
      <div className="text-sm font-medium mb-3">{index + 1}. {text}</div>
      <div className="flex items-center gap-3">
        {!recording ? (
          <button onClick={startRec} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border-color)] hover:border-[var(--exam-accent)] text-sm"><MicrophoneIcon className="w-4 h-4 text-[var(--exam-danger)]" />{blob ? (isVi ? 'Thu lại' : 'Re-record') : (isVi ? 'Thu âm' : 'Record')}</button>
        ) : (
          <button onClick={stopRec} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm" style={{ background: 'var(--exam-danger)' }}><StopIcon className="w-4 h-4" />{isVi ? 'Dừng' : 'Stop'}</button>
        )}
        {url && <audio src={url} controls className="h-9" />}
        {blob && <span className="exam-badge exam-badge-pass"><CheckIcon className="w-3.5 h-3.5" />{isVi ? 'Đã thu' : 'Recorded'}</span>}
      </div>
    </div>
  );
}
