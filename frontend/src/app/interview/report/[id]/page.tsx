'use client';

/**
 * /interview/report/[id] — the payoff screen. The tone shifts from "being
 * evaluated" to "understanding yourself": warmer, data-dense. Every score is
 * traceable — expand a question to see your answer vs the reference, the
 * rubric, and the objective coverage that produced the number.
 */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from 'recharts';
import { Loader2, ChevronDown, AlertTriangle, RotateCcw, Flag, Volume2, Square, Download } from 'lucide-react';
import { toast } from 'sonner';
import ParticleBackground from '@/components/repos/ParticleBackground';
import Markdown from '@/components/markdown/Markdown';
import { useSpeech } from '@/hooks/useSpeech';
import { interviewApi } from '@/lib/interview-api';
import { downloadPdf } from '@/lib/chatExport';
import { makeT, type ILang } from '@/lib/interview-i18n';
import type { InterviewReport, ReportResponse, ReportTurn } from '@/types/interview';

const HIRE_LABEL: Record<string, { label: string; cls: string }> = {
  STRONG_YES: { label: 'Strong Hire', cls: 'text-emerald-400' },
  YES: { label: 'Hire', cls: 'text-emerald-400' },
  LEAN_YES: { label: 'Lean Hire', cls: 'text-lime-400' },
  LEAN_NO: { label: 'Lean No-Hire', cls: 'text-amber-400' },
  NO: { label: 'No Hire', cls: 'text-red-400' },
  STRONG_NO: { label: 'Strong No-Hire', cls: 'text-red-400' },
};

const gradeColor = (g?: string | null) =>
  g === 'A' ? '#10b981' : g === 'B' ? '#84cc16' : g === 'C' ? '#f59e0b' : g === 'D' ? '#f97316' : '#ef4444';

// Colour a turn by the SCORE actually shown (AI final or deterministic), not the
// deterministic letter grade — an AI-graded 85 was rendering red before.
const scoreColor = (s?: number | null) =>
  s == null ? '#94a3b8' : s >= 85 ? '#10b981' : s >= 70 ? '#84cc16' : s >= 55 ? '#f59e0b' : s >= 40 ? '#f97316' : '#ef4444';

// Compose the final report into a spoken script: overall verdict + strengths +
// weaknesses + advice. markdown/list text is read as plain sentences.
function buildReportSpeech(r: InterviewReport, lang: 'VI' | 'EN'): string {
  const vi = lang === 'VI';
  const hire = r.hireRecommendation ? HIRE_LABEL[r.hireRecommendation]?.label ?? '' : '';
  const parts: string[] = [];
  parts.push(
    vi
      ? `Kết quả buổi phỏng vấn: điểm tổng ${r.overallScore ?? 0} trên 100, xếp loại ${r.letterGrade ?? 'chưa có'}.${hire ? ` Đề xuất tuyển dụng: ${hire}.` : ''}`
      : `Interview result: overall score ${r.overallScore ?? 0} out of 100, grade ${r.letterGrade ?? 'n/a'}.${hire ? ` Recommendation: ${hire}.` : ''}`,
  );
  if (r.strengths?.length) parts.push((vi ? 'Điểm mạnh: ' : 'Strengths: ') + r.strengths.join('; ') + '.');
  if (r.weaknesses?.length) parts.push((vi ? 'Cần cải thiện: ' : 'Areas to improve: ') + r.weaknesses.join('; ') + '.');
  if (r.actionableAdvice) parts.push((vi ? 'Lời khuyên: ' : 'Advice: ') + r.actionableAdvice);
  return parts.join(' ');
}

/** Compose the full report as Markdown for the PDF export. */
function buildReportMarkdown(r: InterviewReport, turns: ReportTurn[], lang: 'VI' | 'EN'): string {
  const vi = lang === 'VI';
  const hire = r.hireRecommendation ? HIRE_LABEL[r.hireRecommendation]?.label ?? r.hireRecommendation : '';
  const bd = r.scoreBreakdown;
  const L = (v: string, e: string) => (vi ? v : e);
  const md: string[] = [];
  md.push(`# ${L('Báo cáo phỏng vấn', 'Interview Report')}`);
  md.push(`${L('Điểm tổng', 'Overall score')}: **${r.overallScore ?? 0}/100** · ${L('Xếp loại', 'Grade')}: **${r.letterGrade ?? '—'}**${hire ? ` · ${L('Đề xuất', 'Recommendation')}: **${hire}**` : ''}`);
  md.push(`${L('Đã trả lời', 'Answered')}: ${bd?.answered ?? 0}/${bd?.total ?? 0} · ${L('Lỗi kiến thức', 'Knowledge errors')}: ${bd?.redFlagTotal ?? 0}`);
  if (r.strengths?.length) { md.push(`## ${L('Điểm mạnh', 'Strengths')}`); r.strengths.forEach((s) => md.push(`- ${s}`)); }
  if (r.weaknesses?.length) { md.push(`## ${L('Cần cải thiện', 'Areas to improve')}`); r.weaknesses.forEach((s) => md.push(`- ${s}`)); }
  if (r.actionableAdvice) { md.push(`## ${L('Lời khuyên', 'Advice')}`); md.push(r.actionableAdvice.replace(/\*\*/g, '')); }
  md.push(`## ${L('Chi tiết từng câu', 'Per-question detail')}`);
  turns.forEach((tn) => {
    const sc = tn.turnScore?.final ?? tn.turnScore?.deterministic ?? tn.deterministicScore?.score ?? null;
    md.push(`### #${tn.order + 1} ${tn.topic ? `(${tn.topic})` : ''} — ${sc ?? '—'}/100`);
    md.push(`**${L('Câu hỏi', 'Question')}:** ${tn.questionText}`);
    md.push(`**${L('Câu trả lời của bạn', 'Your answer')}:** ${tn.userAnswer || L('(bỏ trống)', '(blank)')}`);
    if (tn.referenceAnswer) md.push(`**${L('Đáp án mẫu', 'Model answer')}:** ${tn.referenceAnswer}`);
  });
  return md.join('\n\n');
}

export default function InterviewReportPage() {
  const { id } = useParams();
  const sessionId = Number(id);
  const [data, setData] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayLang, setDisplayLang] = useState<ILang>('VI');
  const [pdfBusy, setPdfBusy] = useState(false);
  const t = makeT(displayLang);
  const { speak, stopSpeak, speaking, ttsSupported } = useSpeech();

  const downloadReportPdf = async () => {
    if (!data) return;
    setPdfBusy(true);
    try {
      const md = buildReportMarkdown(data.report, data.turns, displayLang === 'EN' ? 'EN' : 'VI');
      await downloadPdf(md, `interview-report-${sessionId}.pdf`);
    } catch {
      toast.error(displayLang === 'EN' ? 'PDF export failed' : 'Xuất PDF thất bại');
    } finally {
      setPdfBusy(false);
    }
  };

  useEffect(() => {
    interviewApi.report(sessionId).then((res) => {
      setData(res.data.data);
      setDisplayLang(res.data.data.language === 'EN' ? 'EN' : 'VI');
    }).catch(() => {}).finally(() => setLoading(false));
  }, [sessionId]);

  // Auto-read the final evaluation aloud once when it loads (user opted in).
  const spokenRef = useRef(false);
  useEffect(() => {
    if (!data || !ttsSupported || spokenRef.current) return;
    spokenRef.current = true;
    const lang: 'VI' | 'EN' = data.language === 'EN' ? 'EN' : 'VI';
    speak(buildReportSpeech(data.report, lang), lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, ttsSupported]);
  // Stop reading if the user leaves the report.
  useEffect(() => () => stopSpeak(), [stopSpeak]);

  if (loading) return <div className="min-h-screen bg-darkbg pt-16 flex items-center justify-center text-slate-400"><Loader2 className="w-5 h-5 animate-spin mr-2" /> {t('buildingReport')}</div>;
  if (!data) return <div className="min-h-screen bg-darkbg pt-16 flex items-center justify-center text-slate-400">{t('noReport')}</div>;

  const { report, turns } = data;
  const bd = report.scoreBreakdown;
  const radarData = (bd?.byTopic ?? []).map((t) => ({ topic: t.topic, score: t.avgScore }));
  const hire = report.hireRecommendation ? HIRE_LABEL[report.hireRecommendation] : null;

  return (
    <div className="relative min-h-screen bg-darkbg text-slate-100 pt-16 overflow-hidden">
      <ParticleBackground density="medium" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-10">
        {/* Verdict header */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center border-2" style={{ borderColor: gradeColor(report.letterGrade) }}>
              <span className="text-4xl font-bold" style={{ color: gradeColor(report.letterGrade) }}>{report.letterGrade ?? '—'}</span>
              <span className="text-xs font-mono text-slate-400">{report.overallScore ?? 0}/100</span>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 mb-1">{t('interviewResult')}</p>
              {hire && <p className={`text-2xl font-bold ${hire.cls}`}>{hire.label}</p>}
              <p className="text-sm text-slate-400 mt-1">{t('answeredSummary', { a: bd?.answered ?? 0, total: bd?.total ?? 0, rf: bd?.redFlagTotal ?? 0 })}</p>
            </div>
          </div>
          <div className="md:ml-auto flex gap-2 items-center">
            {/* Display-language toggle (realtime); defaults to the session language. */}
            <div className="flex rounded-lg border border-white/10 overflow-hidden text-[11px] font-mono">
              {(['VI', 'EN'] as const).map((lg) => (
                <button
                  key={lg}
                  onClick={() => setDisplayLang(lg)}
                  className={`px-2 py-1.5 transition-colors ${displayLang === lg ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'}`}
                >
                  {lg}
                </button>
              ))}
            </div>
            {ttsSupported && (
              <button
                onClick={speaking ? stopSpeak : () => { const lang: 'VI' | 'EN' = data.language === 'EN' ? 'EN' : 'VI'; speak(buildReportSpeech(report, lang), lang); }}
                title={speaking ? t('stopReading') : t('hearEvalTitle')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${speaking ? 'border-amber-500/50 bg-amber-500/10 text-amber-300' : 'border-white/10 text-slate-300 hover:text-white hover:border-slate-500'}`}
              >
                {speaking ? <Square className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />} {speaking ? t('stop') : t('hearEval')}
              </button>
            )}
            <button
              onClick={downloadReportPdf}
              disabled={pdfBusy}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-slate-300 text-sm font-semibold hover:text-white hover:border-slate-500 transition-colors disabled:opacity-50"
            >
              {pdfBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} PDF
            </button>
            <Link href="/interview" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-slate-950 text-sm font-semibold hover:opacity-90">
              <RotateCcw className="w-4 h-4" /> {t('practiceMore')}
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Radar by topic */}
          {radarData.length >= 3 && (
            <div className="rounded-2xl border border-white/10 p-4">
              <div className="text-sm font-semibold text-slate-100 mb-2">{t('competencyByTopic')}</div>
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={radarData} outerRadius="72%">
                  <PolarGrid stroke="rgba(120,120,120,0.25)" />
                  <PolarAngleAxis dataKey="topic" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Radar dataKey="score" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Self vs objective + advice */}
          <div className="rounded-2xl border border-white/10 p-4">
            <div className="text-sm font-semibold text-slate-100 mb-3">{t('selfVsObjective')}</div>
            <div className="flex items-end gap-6 mb-4">
              <Metric label={t('youSelfScored')} value={bd?.self ?? null} suffix="/100" />
              <Metric label={t('objectiveScore')} value={bd?.deterministic ?? 0} suffix="/100" />
              {bd?.divergence != null && (
                <div>
                  <div className="text-xs text-slate-400">{t('divergence')}</div>
                  <div className={`text-2xl font-bold ${Math.abs(bd.divergence) >= 15 ? 'text-amber-500' : 'text-slate-100'}`}>{bd.divergence > 0 ? '+' : ''}{bd.divergence}</div>
                </div>
              )}
            </div>
            {report.actionableAdvice && (
              <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">{report.actionableAdvice.replace(/\*\*/g, '')}</p>
            )}
          </div>
        </div>

        {/* Strengths / weaknesses */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <ListCard title={t('strengths')} items={report.strengths} tone="ok" empty={t('emptyStrengths')} />
          <ListCard title={t('weaknesses')} items={report.weaknesses} tone="weak" empty={t('emptyWeaknesses')} />
        </div>

        {/* Study plan — resources grounded in the knowledge base (source-traceable) */}
        {Array.isArray(report.suggestedResources) && report.suggestedResources.some((r) => r.sources?.length) && (
          <div className="rounded-2xl border border-white/10 p-4 mb-8">
            <div className="text-sm font-semibold text-slate-100 mb-3">{t('suggestedReading')}</div>
            <div className="space-y-3">
              {report.suggestedResources.filter((r) => r.sources?.length).map((r) => (
                <div key={r.topicId}>
                  <div className="text-xs font-mono uppercase tracking-wide text-amber-400/90 mb-1">{r.topic}</div>
                  <ul className="space-y-1">
                    {r.sources!.map((s) => {
                      const label = s.headingPath ? `${s.title} — ${s.headingPath}` : s.title;
                      return (
                        <li key={`${r.topicId}-${s.documentId}-${s.headingPath ?? ''}`} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                          {s.sourceUrl ? (
                            <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">{label}</a>
                          ) : (
                            <span>{label}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Per-question drill-down */}
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 text-sm font-semibold text-slate-100">{t('perQuestion')}</div>
          {turns.map((tn) => <TurnRow key={tn.order} turn={tn} sessionId={sessionId} lang={displayLang} />)}
        </div>

        {/* Interview → CV (P9): a topic you explained well here may be worth adding to your CV. */}
        <a href="/cv/intake" className="mt-4 block rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-4 hover:border-amber-500/60">
          <div className="text-sm font-semibold text-amber-200">Vừa giải thích tốt một chủ đề?</div>
          <div className="mt-1 text-xs text-slate-300">Nếu điều bạn vừa trình bày là từ một dự án thật mà CV chưa nhắc tới, hãy đưa nó vào — mở CV Builder để AI phỏng vấn lấy nội dung →</div>
        </a>
      </div>
    </div>
  );
}

function Metric({ label, value, suffix = '' }: { label: string; value: number | null; suffix?: string }) {
  return (
    <div>
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-2xl font-bold text-slate-100">{value ?? '—'}{value != null ? <span className="text-sm font-normal text-slate-400">{suffix}</span> : null}</div>
    </div>
  );
}

function ListCard({ title, items, tone, empty }: { title: string; items: string[]; tone: 'ok' | 'weak'; empty: string }) {
  return (
    <div className="rounded-2xl border border-white/10 p-4">
      <div className="text-sm font-semibold text-slate-100 mb-2">{title}</div>
      {items.length ? (
        <ul className="space-y-1.5">
          {items.map((it) => (
            <li key={it} className="text-sm text-slate-400 flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${tone === 'ok' ? 'bg-emerald-500' : 'bg-amber-500'}`} /> {it}
            </li>
          ))}
        </ul>
      ) : <p className="text-sm text-slate-400">{empty}</p>}
    </div>
  );
}

function TurnRow({ turn, sessionId, lang }: { turn: ReportTurn; sessionId: number; lang: ILang }) {
  const [open, setOpen] = useState(false);
  const [flagged, setFlagged] = useState(false);
  const t = makeT(lang);
  const det = turn.deterministicScore;
  const score = turn.turnScore?.final ?? turn.turnScore?.deterministic ?? det?.score ?? null;

  const flag = async () => {
    const reason = window.prompt(t('flagPrompt'));
    if (reason === null) return;
    try {
      await interviewApi.flagTurn(sessionId, turn.order, reason || '');
      setFlagged(true);
      toast.success(t('flagSent'));
    } catch {
      toast.error(t('flagFail'));
    }
  };
  return (
    <div className="border-b border-white/10 last:border-0">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.04]">
        <span className="text-xs font-mono text-slate-400 w-8">#{turn.order + 1}</span>
        <span className="flex-1 text-sm text-slate-100 line-clamp-1">{turn.questionText}</span>
        {turn.injectionAttempted && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
        {turn.topic && <span className="text-xs text-slate-400 hidden sm:inline">{turn.topic}</span>}
        <span className="text-sm font-mono font-semibold shrink-0" style={{ color: scoreColor(score) }}>{score ?? '—'}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3">
          <Block label={t('yourAnswer')} text={turn.userAnswer || t('blank')} />
          {det && (
            <div className="text-xs">
              <span className="text-slate-400">{t('coverageShort')}</span>
              {det.mustHit.map((k) => <span key={k} className="inline-block mr-1 mb-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">{k}</span>)}
              {det.mustMiss.map((k) => <span key={k} className="inline-block mr-1 mb-1 px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/10">{t('missingInline', { k })}</span>)}
              {det.redFlagsHit.map((k) => <span key={k} className="inline-block mr-1 mb-1 px-1.5 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/30">⚠ {k}</span>)}
            </div>
          )}
          {turn.referenceAnswer && <Block label={t('modelAnswerShort')} text={turn.referenceAnswer} md />}
          <div className="flex justify-end">
            <button onClick={flag} disabled={flagged} className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-amber-400 disabled:text-emerald-400">
              <Flag className="w-3.5 h-3.5" /> {flagged ? t('flagged') : t('flagWrong')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Block({ label, text, md }: { label: string; text: string; md?: boolean }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">{label}</div>
      {md ? (
        <div className="text-sm text-slate-100 leading-relaxed bg-white/[0.04] rounded-lg p-3 border border-white/10 markdown-body"><Markdown mdx={text} openLinksInNewTab /></div>
      ) : (
        <p className="text-sm text-slate-100 leading-relaxed whitespace-pre-wrap bg-white/[0.04] rounded-lg p-3 border border-white/10">{text}</p>
      )}
    </div>
  );
}
