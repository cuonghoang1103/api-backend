'use client';

// Practice coach for one exercise, Pro only.
//
//  · Oral defence — the AI examiner asks one question and marks the answer. Two
//    modes: "explain your code", and the harder "here is a change to the
//    requirements, what would you do", which is what a real examiner uses to
//    find out whether the student understands their own design.
//  · Brief check — paste the code, get every requirement in the brief ticked
//    off one by one, so a forgotten menu option is found before the marker
//    finds it.
//
// Nothing is stored: a question you have seen already is worthless, and a code
// review is about code that changes on every run.

import { useCallback, useRef, useState } from 'react';
import {
  GraduationCap, Loader2, Send, RefreshCw, ClipboardCheck, Crown,
  CheckCircle2, AlertTriangle, XCircle, Lightbulb, Wand2, FolderUp, FolderTree, HelpCircle,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { codeLabApi } from '@/lib/code-lab-api';
import type { VivaQuestion, VivaGrade, SpecCheck, ProjectCheck } from '@/types/code-lab';
import { useAuthStore } from '@/store/authStore';
import { usePro } from '@/hooks/usePro';

type Tab = 'viva' | 'check';
type Lang = 'en' | 'vi';

const T = {
  en: {
    title: 'Practice coach', viva: 'Oral defence', check: 'Check my code against the brief',
    explainMode: 'Explain your code', changeMode: 'Change the requirements',
    ask: 'Ask me a question', another: 'Another question', hint: 'A full answer must mention',
    answer: 'Your answer', submit: 'Submit for marking', marking: 'Marking…',
    good: 'What you got right', missing: 'What was missing', model: 'A strong answer',
    paste: 'Paste your Java code (the main classes are enough)',
    review: 'Check it', reviewing: 'Reading your code…', risks: 'Will break in front of the marker',
    met: 'met', signIn: 'Sign in to use this', upgrade: 'Upgrade to Pro',
    emptyViva: 'The examiner will ask one question about this assignment, then mark your answer out of 10.',
    emptyCheck: 'Every requirement in the brief is checked off against your code, one by one.',
    or: 'or', uploadZip: 'Upload the whole project (.zip)',
    zipHint: 'A NetBeans project zip — packages, every class. Structure is checked against the brief too.',
    structure: 'Project structure vs the brief', vivaLikely: 'Questions this code invites',
    filesRead: 'files read', filesSkipped: 'skipped',
  },
  vi: {
    title: 'Luyện tập cùng AI', viva: 'Vấn đáp', check: 'Đối chiếu code với đề',
    explainMode: 'Giải thích code', changeMode: 'Thầy cô đổi yêu cầu',
    ask: 'Hỏi tôi một câu', another: 'Câu khác', hint: 'Câu trả lời đầy đủ phải nhắc tới',
    answer: 'Câu trả lời của bạn', submit: 'Nộp cho chấm', marking: 'Đang chấm…',
    good: 'Bạn đã làm đúng', missing: 'Còn thiếu', model: 'Một câu trả lời tốt',
    paste: 'Dán code Java của bạn (chỉ cần các lớp chính)',
    review: 'Kiểm tra', reviewing: 'Đang đọc code của bạn…', risks: 'Sẽ hỏng ngay trước mặt người chấm',
    met: 'đạt', signIn: 'Đăng nhập để dùng', upgrade: 'Nâng cấp Pro',
    emptyViva: 'Giám khảo sẽ hỏi một câu về bài này, rồi chấm câu trả lời của bạn trên thang 10.',
    emptyCheck: 'Từng yêu cầu trong đề sẽ được đối chiếu với code của bạn, lần lượt từng cái.',
    or: 'hoặc', uploadZip: 'Nộp cả project (.zip)',
    zipHint: 'Zip project NetBeans — đủ package, đủ class. Cấu trúc cũng được đối chiếu với đề.',
    structure: 'Cấu trúc project so với đề', vivaLikely: 'Câu thầy có thể hỏi từ chính code này',
    filesRead: 'file đã đọc', filesSkipped: 'bỏ qua',
  },
} as const;

const STATUS = {
  met: { icon: CheckCircle2, colour: '#22c55e' },
  partial: { icon: AlertTriangle, colour: '#f59e0b' },
  missing: { icon: XCircle, colour: '#ef4444' },
} as const;

export function CoachPanel({ exerciseId }: { exerciseId: number }) {
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const { isPro } = usePro();

  const [tab, setTab] = useState<Tab>('viva');
  const [lang, setLang] = useState<Lang>('vi');
  const t = T[lang];

  // ── viva
  const [mode, setMode] = useState<'explain' | 'change'>('explain');
  const [q, setQ] = useState<VivaQuestion | null>(null);
  const [asked, setAsked] = useState<string[]>([]);
  const [answer, setAnswer] = useState('');
  const [grade, setGrade] = useState<VivaGrade | null>(null);
  const [loadingQ, setLoadingQ] = useState(false);
  const [grading, setGrading] = useState(false);

  // ── brief check
  const [codeText, setCodeText] = useState('');
  // A project review is a SpecCheck plus structure/viva/files — one state, and
  // the extra sections render only when they are actually there.
  const [check, setCheck] = useState<SpecCheck | ProjectCheck | null>(null);
  const zipRef = useRef<HTMLInputElement>(null);
  const [checking, setChecking] = useState(false);

  const fail = (e: unknown, fallback: string) => {
    const st = (e as { response?: { status?: number; data?: { message?: string } } })?.response;
    toast.error(st?.status === 403 ? 'This is a Pro feature.' : st?.data?.message || fallback);
  };

  const newQuestion = useCallback(async () => {
    setLoadingQ(true); setGrade(null); setAnswer('');
    try {
      const r = await codeLabApi.askViva(exerciseId, mode, asked);
      setQ(r.data.data);
      setAsked((a) => [...a, r.data.data.question].slice(-8));
    } catch (e) { fail(e, 'Could not get a question.'); } finally { setLoadingQ(false); }
  }, [exerciseId, mode, asked]);

  const submit = useCallback(async () => {
    if (!q || !answer.trim()) return;
    setGrading(true);
    try {
      const r = await codeLabApi.gradeViva(exerciseId, q.question, answer, mode);
      setGrade(r.data.data);
    } catch (e) { fail(e, 'Could not mark that.'); } finally { setGrading(false); }
  }, [exerciseId, q, answer, mode]);

  const runCheck = useCallback(async () => {
    if (!codeText.trim()) return;
    setChecking(true);
    try {
      const r = await codeLabApi.checkAgainstBrief(exerciseId, codeText);
      setCheck(r.data.data);
    } catch (e) { fail(e, 'Could not review the code.'); } finally { setChecking(false); }
  }, [exerciseId, codeText]);

  /**
   * Whole-project review. One class pasted into a box cannot show whether the
   * packages match the brief or whether Main and the service agree — a LAB211
   * submission is a folder, so it is reviewed as one.
   */
  const runZipCheck = useCallback(async (file: File) => {
    setChecking(true);
    setCheck(null);
    try {
      const r = await codeLabApi.checkProjectZip(exerciseId, file);
      setCheck(r.data.data);
    } catch (e) { fail(e, 'Could not review that project.'); } finally { setChecking(false); }
  }, [exerciseId]);

  const box = { borderColor: 'var(--border-color)', background: 'var(--bg-surface)' } as const;
  const pill = (on: boolean) => (on
    ? { background: 'var(--accent-color, #8b5cf6)', color: '#fff' }
    : { background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' });

  return (
    <section className="mb-5">
      <h2 className="mb-2 flex flex-wrap items-center gap-2 text-sm font-bold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
        <GraduationCap size={14} /> {t.title}
        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
          style={{ background: 'linear-gradient(90deg,#f59e0b,#f97316)', color: '#fff' }}>
          <Crown size={10} /> Pro
        </span>
        <span className="ml-auto flex gap-1">
          {(['en', 'vi'] as const).map((c) => (
            <button key={c} onClick={() => setLang(c)} aria-pressed={lang === c}
              className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold" style={pill(lang === c)}>
              {c === 'en' ? 'EN' : 'VN'}
            </button>
          ))}
        </span>
      </h2>

      <div className="rounded-xl border" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
        <div className="flex border-b" style={{ borderColor: 'var(--border-color)' }}>
          {([['viva', t.viva, GraduationCap], ['check', t.check, ClipboardCheck]] as const).map(([id, label, Icon]) => (
            <button key={id} onClick={() => setTab(id as Tab)}
              className="flex flex-1 items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-semibold"
              style={{
                color: tab === id ? 'var(--accent-color, #8b5cf6)' : 'var(--text-secondary)',
                borderBottom: tab === id ? '2px solid var(--accent-color, #8b5cf6)' : '2px solid transparent',
              }}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {!isAuthed ? (
            <p className="text-center text-sm"><Link href="/login" className="underline" style={{ color: '#6366f1' }}>{t.signIn}</Link></p>
          ) : !isPro ? (
            <div className="text-center">
              <p className="mb-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {tab === 'viva' ? t.emptyViva : t.emptyCheck}
              </p>
              <Link href="/pro" className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold"
                style={{ background: 'linear-gradient(90deg,#f59e0b,#f97316)', color: '#fff' }}>
                <Crown size={15} /> {t.upgrade}
              </Link>
            </div>
          ) : tab === 'viva' ? (
            <>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {([['explain', t.explainMode], ['change', t.changeMode]] as const).map(([m, label]) => (
                  <button key={m} onClick={() => { setMode(m); setQ(null); setGrade(null); }}
                    className="rounded-full px-3 py-1 text-xs font-semibold" style={pill(mode === m)}>
                    {m === 'change' && <Wand2 size={11} className="mr-1 inline" />}{label}
                  </button>
                ))}
              </div>

              {!q ? (
                <div className="text-center">
                  <p className="mb-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{t.emptyViva}</p>
                  <button onClick={() => void newQuestion()} disabled={loadingQ}
                    className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold"
                    style={{ background: 'var(--accent-color, #8b5cf6)', color: '#fff' }}>
                    {loadingQ ? <Loader2 size={15} className="animate-spin" /> : <GraduationCap size={15} />} {t.ask}
                  </button>
                </div>
              ) : (
                <>
                  <div className="rounded-lg border p-3" style={box}>
                    {q.focus && (
                      <div className="mb-1 text-[11px] font-bold uppercase" style={{ color: 'var(--accent-color, #8b5cf6)' }}>
                        {q.focus}
                      </div>
                    )}
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {lang === 'vi' ? q.questionVi : q.question}
                    </p>
                    {(lang === 'vi' ? q.hintVi : q.hint) && (
                      <p className="mt-2 flex items-start gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <Lightbulb size={12} className="mt-0.5 shrink-0" />
                        <span>{t.hint}: {lang === 'vi' ? q.hintVi : q.hint}</span>
                      </p>
                    )}
                  </div>

                  <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={5}
                    placeholder={t.answer}
                    className="mt-3 w-full resize-y rounded-lg border px-3 py-2 text-sm outline-none"
                    style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }} />

                  <div className="mt-2 flex flex-wrap gap-2">
                    <button onClick={() => void submit()} disabled={grading || !answer.trim()}
                      className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-40"
                      style={{ background: 'var(--accent-color, #8b5cf6)', color: '#fff' }}>
                      {grading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                      {grading ? t.marking : t.submit}
                    </button>
                    <button onClick={() => void newQuestion()} disabled={loadingQ}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm"
                      style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
                      {loadingQ ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} {t.another}
                    </button>
                  </div>

                  {grade && (
                    <div className="mt-4 rounded-lg border p-3" style={box}>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold"
                          style={{
                            background: grade.score >= 7 ? '#22c55e22' : grade.score >= 4 ? '#f59e0b22' : '#ef444422',
                            color: grade.score >= 7 ? '#22c55e' : grade.score >= 4 ? '#f59e0b' : '#ef4444',
                          }}>
                          {grade.score}
                        </span>
                        <p className="min-w-0 flex-1 text-sm" style={{ color: 'var(--text-primary)' }}>
                          {lang === 'vi' ? grade.verdictVi : grade.verdict}
                        </p>
                      </div>

                      {(lang === 'vi' ? grade.goodVi : grade.good).length > 0 && (
                        <Bullets title={t.good} colour="#22c55e" items={lang === 'vi' ? grade.goodVi : grade.good} />
                      )}
                      {(lang === 'vi' ? grade.missingVi : grade.missing).length > 0 && (
                        <Bullets title={t.missing} colour="#f59e0b" items={lang === 'vi' ? grade.missingVi : grade.missing} />
                      )}
                      {(lang === 'vi' ? grade.modelAnswerVi : grade.modelAnswer) && (
                        <div className="mt-3">
                          <div className="mb-1 text-[11px] font-bold uppercase" style={{ color: 'var(--text-secondary)' }}>{t.model}</div>
                          <p className="whitespace-pre-wrap text-sm" style={{ color: 'var(--text-primary)' }}>
                            {lang === 'vi' ? grade.modelAnswerVi : grade.modelAnswer}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <textarea value={codeText} onChange={(e) => setCodeText(e.target.value)} rows={10}
                placeholder={t.paste} spellCheck={false}
                className="w-full resize-y rounded-lg border px-3 py-2 font-mono text-[12px] leading-relaxed outline-none"
                style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }} />
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button onClick={() => void runCheck()} disabled={checking || !codeText.trim()}
                  className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-40"
                  style={{ background: 'var(--accent-color, #8b5cf6)', color: '#fff' }}>
                  {checking ? <Loader2 size={15} className="animate-spin" /> : <ClipboardCheck size={15} />}
                  {checking ? t.reviewing : t.review}
                </button>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.or}</span>
                <button onClick={() => zipRef.current?.click()} disabled={checking}
                  className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-40"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                  <FolderUp size={15} /> {t.uploadZip}
                </button>
                <input ref={zipRef} type="file" accept=".zip" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) void runZipCheck(f); e.target.value = ''; }} />
              </div>
              <p className="mt-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>{t.zipHint}</p>

              {check && (
                <div className="mt-4">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="text-2xl font-bold" style={{ color: check.met === check.total ? '#22c55e' : '#f59e0b' }}>
                      {check.met}/{check.total}
                    </span>
                    <p className="min-w-0 flex-1 text-sm" style={{ color: 'var(--text-primary)' }}>
                      {lang === 'vi' ? check.summaryVi : check.summary}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {check.items.map((it, i) => {
                      const S = STATUS[it.status];
                      const Icon = S.icon;
                      return (
                        <div key={i} className="flex gap-2 rounded-lg border p-2.5" style={box}>
                          <Icon size={16} className="mt-0.5 shrink-0" style={{ color: S.colour }} />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                              {lang === 'vi' ? it.requirementVi : it.requirement}
                            </p>
                            {(lang === 'vi' ? it.evidenceVi : it.evidence) && (
                              <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                                {lang === 'vi' ? it.evidenceVi : it.evidence}
                              </p>
                            )}
                            {(lang === 'vi' ? it.fixVi : it.fix) && (
                              <p className="mt-1 text-xs font-medium" style={{ color: S.colour }}>
                                → {lang === 'vi' ? it.fixVi : it.fix}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Project-only sections. A pasted class has no structure to
                      compare and no package to misplace, so they simply are not
                      in the response and nothing renders. */}
                  {'structure' in check && check.structure.length > 0 && (
                    <div className="mt-3 rounded-lg border p-3" style={box}>
                      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase" style={{ color: 'var(--text-secondary)' }}>
                        <FolderTree size={13} /> {t.structure}
                      </div>
                      <ul className="space-y-1">
                        {check.structure.map((s, i) => {
                          const S = STATUS[s.status === 'ok' ? 'met' : s.status === 'misplaced' ? 'partial' : 'missing'];
                          const Icon = S.icon;
                          const where = lang === 'vi' ? s.actualVi : s.actual;
                          return (
                            <li key={i} className="flex gap-1.5 text-sm">
                              <Icon size={14} className="mt-0.5 shrink-0" style={{ color: S.colour }} />
                              <span className="min-w-0" style={{ color: 'var(--text-primary)' }}>
                                <code className="font-mono text-[12px]">{lang === 'vi' ? s.expectedVi : s.expected}</code>
                                {s.status !== 'ok' && where && (
                                  <span style={{ color: 'var(--text-muted)' }}> — {where}</span>
                                )}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {(lang === 'vi' ? check.risksVi : check.risks).length > 0 && (
                    <div className="mt-3 rounded-lg border p-3" style={{ borderColor: '#ef4444', background: '#ef444411' }}>
                      <Bullets title={t.risks} colour="#ef4444" items={lang === 'vi' ? check.risksVi : check.risks} />
                    </div>
                  )}

                  {'vivaQuestions' in check && (lang === 'vi' ? check.vivaQuestionsVi : check.vivaQuestions).length > 0 && (
                    <div className="mt-3 rounded-lg border p-3" style={box}>
                      <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase" style={{ color: '#8b5cf6' }}>
                        <HelpCircle size={13} /> {t.vivaLikely}
                      </div>
                      <ul className="space-y-0.5">
                        {(lang === 'vi' ? check.vivaQuestionsVi : check.vivaQuestions).map((x, i) => (
                          <li key={i} className="flex gap-1.5 text-sm" style={{ color: 'var(--text-primary)' }}>
                            <span style={{ color: '#8b5cf6' }}>•</span><span className="min-w-0">{x}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {'files' in check && (
                    <p className="mt-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      {check.files.included} {t.filesRead}
                      {check.files.skipped ? `, ${check.files.skipped} ${t.filesSkipped}` : ''}
                      {check.files.truncated ? ' ⚠︎' : ''}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function Bullets({ title, colour, items }: { title: string; colour: string; items: string[] }) {
  return (
    <div className="mt-2">
      <div className="mb-1 text-[11px] font-bold uppercase" style={{ color: colour }}>{title}</div>
      <ul className="space-y-0.5">
        {items.map((x, i) => (
          <li key={i} className="flex gap-1.5 text-sm" style={{ color: 'var(--text-primary)' }}>
            <span style={{ color: colour }}>•</span><span className="min-w-0">{x}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
