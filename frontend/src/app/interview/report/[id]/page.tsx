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
import { Loader2, ChevronDown, AlertTriangle, RotateCcw, Flag, Volume2, Square } from 'lucide-react';
import { toast } from 'sonner';
import ParticleBackground from '@/components/repos/ParticleBackground';
import Markdown from '@/components/markdown/Markdown';
import { useSpeech } from '@/hooks/useSpeech';
import { interviewApi } from '@/lib/interview-api';
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

export default function InterviewReportPage() {
  const { id } = useParams();
  const sessionId = Number(id);
  const [data, setData] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { speak, stopSpeak, speaking, ttsSupported } = useSpeech();

  useEffect(() => {
    interviewApi.report(sessionId).then((res) => setData(res.data.data)).catch(() => {}).finally(() => setLoading(false));
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

  if (loading) return <div className="min-h-screen bg-darkbg pt-16 flex items-center justify-center text-slate-400"><Loader2 className="w-5 h-5 animate-spin mr-2" /> Đang dựng báo cáo…</div>;
  if (!data) return <div className="min-h-screen bg-darkbg pt-16 flex items-center justify-center text-slate-400">Chưa có báo cáo.</div>;

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
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 mb-1">Kết quả buổi phỏng vấn</p>
              {hire && <p className={`text-2xl font-bold ${hire.cls}`}>{hire.label}</p>}
              <p className="text-sm text-slate-400 mt-1">{bd?.answered ?? 0}/{bd?.total ?? 0} câu · {bd?.redFlagTotal ?? 0} lỗi kiến thức</p>
            </div>
          </div>
          <div className="md:ml-auto flex gap-2">
            {ttsSupported && (
              <button
                onClick={speaking ? stopSpeak : () => { const lang: 'VI' | 'EN' = data.language === 'EN' ? 'EN' : 'VI'; speak(buildReportSpeech(report, lang), lang); }}
                title={speaking ? 'Dừng đọc' : 'Nghe AI đọc đánh giá'}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${speaking ? 'border-amber-500/50 bg-amber-500/10 text-amber-300' : 'border-white/10 text-slate-300 hover:text-white hover:border-slate-500'}`}
              >
                {speaking ? <Square className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />} {speaking ? 'Dừng' : 'Nghe đánh giá'}
              </button>
            )}
            <Link href="/interview" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-slate-950 text-sm font-semibold hover:opacity-90">
              <RotateCcw className="w-4 h-4" /> Luyện tiếp
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Radar by topic */}
          {radarData.length >= 3 && (
            <div className="rounded-2xl border border-white/10 p-4">
              <div className="text-sm font-semibold text-slate-100 mb-2">Năng lực theo chủ đề</div>
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
            <div className="text-sm font-semibold text-slate-100 mb-3">Tự đánh giá vs khách quan</div>
            <div className="flex items-end gap-6 mb-4">
              <Metric label="Bạn tự chấm" value={bd?.self ?? null} />
              <Metric label="Máy chấm" value={bd?.deterministic ?? 0} />
              {bd?.divergence != null && (
                <div>
                  <div className="text-xs text-slate-400">Chênh lệch</div>
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
          <ListCard title="Điểm mạnh" items={report.strengths} tone="ok" empty="Chưa có chủ đề nào đạt mức mạnh — cứ luyện tiếp." />
          <ListCard title="Cần cải thiện" items={report.weaknesses} tone="weak" empty="Không có điểm yếu nổi bật. Tốt!" />
        </div>

        {/* Study plan — resources grounded in the knowledge base (source-traceable) */}
        {Array.isArray(report.suggestedResources) && report.suggestedResources.some((r) => r.sources?.length) && (
          <div className="rounded-2xl border border-white/10 p-4 mb-8">
            <div className="text-sm font-semibold text-slate-100 mb-3">Nên đọc lại (từ kho tri thức)</div>
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
          <div className="px-4 py-3 border-b border-white/10 text-sm font-semibold text-slate-100">Chi tiết từng câu (bấm để mở)</div>
          {turns.map((t) => <TurnRow key={t.order} turn={t} sessionId={sessionId} />)}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number | null }) {
  return (
    <div>
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-2xl font-bold text-slate-100">{value ?? '—'}</div>
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

function TurnRow({ turn, sessionId }: { turn: ReportTurn; sessionId: number }) {
  const [open, setOpen] = useState(false);
  const [flagged, setFlagged] = useState(false);
  const det = turn.deterministicScore;
  const score = turn.turnScore?.final ?? turn.turnScore?.deterministic ?? det?.score ?? null;

  const flag = async () => {
    const reason = window.prompt('Vì sao bạn nghĩ điểm câu này sai? (gửi tới admin xem lại)');
    if (reason === null) return;
    try {
      await interviewApi.flagTurn(sessionId, turn.order, reason || '');
      setFlagged(true);
      toast.success('Đã gửi. Cảm ơn — admin sẽ xem lại điểm này.');
    } catch {
      toast.error('Không gửi được');
    }
  };
  return (
    <div className="border-b border-white/10 last:border-0">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.04]">
        <span className="text-xs font-mono text-slate-400 w-8">#{turn.order + 1}</span>
        <span className="flex-1 text-sm text-slate-100 line-clamp-1">{turn.questionText}</span>
        {turn.injectionAttempted && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
        {turn.topic && <span className="text-xs text-slate-400 hidden sm:inline">{turn.topic}</span>}
        <span className="text-sm font-mono font-semibold shrink-0" style={{ color: gradeColor(det?.grade) }}>{score ?? '—'}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3">
          <Block label="Câu trả lời của bạn" text={turn.userAnswer || '(bỏ trống)'} />
          {det && (
            <div className="text-xs">
              <span className="text-slate-400">Bao phủ: </span>
              {det.mustHit.map((k) => <span key={k} className="inline-block mr-1 mb-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">{k}</span>)}
              {det.mustMiss.map((k) => <span key={k} className="inline-block mr-1 mb-1 px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/10">thiếu: {k}</span>)}
              {det.redFlagsHit.map((k) => <span key={k} className="inline-block mr-1 mb-1 px-1.5 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/30">⚠ {k}</span>)}
            </div>
          )}
          {turn.referenceAnswer && <Block label="Đáp án mẫu" text={turn.referenceAnswer} md />}
          <div className="flex justify-end">
            <button onClick={flag} disabled={flagged} className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-amber-400 disabled:text-emerald-400">
              <Flag className="w-3.5 h-3.5" /> {flagged ? 'Đã gửi phản hồi' : 'Điểm này có vẻ sai?'}
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
