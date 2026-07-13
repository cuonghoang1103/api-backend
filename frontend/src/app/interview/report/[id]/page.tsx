'use client';

/**
 * /interview/report/[id] — the payoff screen. The tone shifts from "being
 * evaluated" to "understanding yourself": warmer, data-dense. Every score is
 * traceable — expand a question to see your answer vs the reference, the
 * rubric, and the objective coverage that produced the number.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from 'recharts';
import { Loader2, ChevronDown, AlertTriangle, RotateCcw } from 'lucide-react';
import { interviewApi } from '@/lib/interview-api';
import type { ReportResponse, ReportTurn } from '@/types/interview';

const HIRE_LABEL: Record<string, { label: string; cls: string }> = {
  STRONG_YES: { label: 'Strong Hire', cls: 'text-emerald-600 dark:text-emerald-400' },
  YES: { label: 'Hire', cls: 'text-emerald-600 dark:text-emerald-400' },
  LEAN_YES: { label: 'Lean Hire', cls: 'text-lime-600 dark:text-lime-400' },
  LEAN_NO: { label: 'Lean No-Hire', cls: 'text-amber-600 dark:text-amber-400' },
  NO: { label: 'No Hire', cls: 'text-red-600 dark:text-red-400' },
  STRONG_NO: { label: 'Strong No-Hire', cls: 'text-red-600 dark:text-red-400' },
};

const gradeColor = (g?: string | null) =>
  g === 'A' ? '#10b981' : g === 'B' ? '#84cc16' : g === 'C' ? '#f59e0b' : g === 'D' ? '#f97316' : '#ef4444';

export default function InterviewReportPage() {
  const { id } = useParams();
  const sessionId = Number(id);
  const [data, setData] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    interviewApi.report(sessionId).then((res) => setData(res.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) return <div className="min-h-screen bg-[var(--bg-primary)] pt-16 flex items-center justify-center text-[var(--text-secondary)]"><Loader2 className="w-5 h-5 animate-spin mr-2" /> Đang dựng báo cáo…</div>;
  if (!data) return <div className="min-h-screen bg-[var(--bg-primary)] pt-16 flex items-center justify-center text-[var(--text-secondary)]">Chưa có báo cáo.</div>;

  const { report, turns } = data;
  const bd = report.scoreBreakdown;
  const radarData = (bd?.byTopic ?? []).map((t) => ({ topic: t.topic, score: t.avgScore }));
  const hire = report.hireRecommendation ? HIRE_LABEL[report.hireRecommendation] : null;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-16">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Verdict header */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center border-2" style={{ borderColor: gradeColor(report.letterGrade) }}>
              <span className="text-4xl font-bold" style={{ color: gradeColor(report.letterGrade) }}>{report.letterGrade ?? '—'}</span>
              <span className="text-xs font-mono text-[var(--text-secondary)]">{report.overallScore ?? 0}/100</span>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-1">Kết quả buổi phỏng vấn</p>
              {hire && <p className={`text-2xl font-bold ${hire.cls}`}>{hire.label}</p>}
              <p className="text-sm text-[var(--text-secondary)] mt-1">{bd?.answered ?? 0}/{bd?.total ?? 0} câu · {bd?.redFlagTotal ?? 0} lỗi kiến thức</p>
            </div>
          </div>
          <div className="md:ml-auto flex gap-2">
            <Link href="/interview" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] text-sm font-semibold hover:opacity-90">
              <RotateCcw className="w-4 h-4" /> Luyện tiếp
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Radar by topic */}
          {radarData.length >= 3 && (
            <div className="rounded-2xl border border-[var(--border-light)] p-4">
              <div className="text-sm font-semibold text-[var(--text-primary)] mb-2">Năng lực theo chủ đề</div>
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={radarData} outerRadius="72%">
                  <PolarGrid stroke="rgba(120,120,120,0.25)" />
                  <PolarAngleAxis dataKey="topic" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                  <Radar dataKey="score" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Self vs objective + advice */}
          <div className="rounded-2xl border border-[var(--border-light)] p-4">
            <div className="text-sm font-semibold text-[var(--text-primary)] mb-3">Tự đánh giá vs khách quan</div>
            <div className="flex items-end gap-6 mb-4">
              <Metric label="Bạn tự chấm" value={bd?.self ?? null} />
              <Metric label="Máy chấm" value={bd?.deterministic ?? 0} />
              {bd?.divergence != null && (
                <div>
                  <div className="text-xs text-[var(--text-secondary)]">Chênh lệch</div>
                  <div className={`text-2xl font-bold ${Math.abs(bd.divergence) >= 15 ? 'text-amber-500' : 'text-[var(--text-primary)]'}`}>{bd.divergence > 0 ? '+' : ''}{bd.divergence}</div>
                </div>
              )}
            </div>
            {report.actionableAdvice && (
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{report.actionableAdvice.replace(/\*\*/g, '')}</p>
            )}
          </div>
        </div>

        {/* Strengths / weaknesses */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <ListCard title="Điểm mạnh" items={report.strengths} tone="ok" empty="Chưa có chủ đề nào đạt mức mạnh — cứ luyện tiếp." />
          <ListCard title="Cần cải thiện" items={report.weaknesses} tone="weak" empty="Không có điểm yếu nổi bật. Tốt!" />
        </div>

        {/* Per-question drill-down */}
        <div className="rounded-2xl border border-[var(--border-light)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border-light)] text-sm font-semibold text-[var(--text-primary)]">Chi tiết từng câu (bấm để mở)</div>
          {turns.map((t) => <TurnRow key={t.order} turn={t} />)}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number | null }) {
  return (
    <div>
      <div className="text-xs text-[var(--text-secondary)]">{label}</div>
      <div className="text-2xl font-bold text-[var(--text-primary)]">{value ?? '—'}</div>
    </div>
  );
}

function ListCard({ title, items, tone, empty }: { title: string; items: string[]; tone: 'ok' | 'weak'; empty: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border-light)] p-4">
      <div className="text-sm font-semibold text-[var(--text-primary)] mb-2">{title}</div>
      {items.length ? (
        <ul className="space-y-1.5">
          {items.map((it) => (
            <li key={it} className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${tone === 'ok' ? 'bg-emerald-500' : 'bg-amber-500'}`} /> {it}
            </li>
          ))}
        </ul>
      ) : <p className="text-sm text-[var(--text-secondary)]">{empty}</p>}
    </div>
  );
}

function TurnRow({ turn }: { turn: ReportTurn }) {
  const [open, setOpen] = useState(false);
  const det = turn.deterministicScore;
  const score = turn.turnScore?.deterministic ?? det?.score ?? null;
  return (
    <div className="border-b border-[var(--border-light)] last:border-0">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--bg-surface)]">
        <span className="text-xs font-mono text-[var(--text-secondary)] w-8">#{turn.order + 1}</span>
        <span className="flex-1 text-sm text-[var(--text-primary)] line-clamp-1">{turn.questionText}</span>
        {turn.injectionAttempted && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
        {turn.topic && <span className="text-xs text-[var(--text-secondary)] hidden sm:inline">{turn.topic}</span>}
        <span className="text-sm font-mono font-semibold shrink-0" style={{ color: gradeColor(det?.grade) }}>{score ?? '—'}</span>
        <ChevronDown className={`w-4 h-4 text-[var(--text-secondary)] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3">
          <Block label="Câu trả lời của bạn" text={turn.userAnswer || '(bỏ trống)'} />
          {det && (
            <div className="text-xs">
              <span className="text-[var(--text-secondary)]">Bao phủ: </span>
              {det.mustHit.map((k) => <span key={k} className="inline-block mr-1 mb-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">{k}</span>)}
              {det.mustMiss.map((k) => <span key={k} className="inline-block mr-1 mb-1 px-1.5 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-light)]">thiếu: {k}</span>)}
              {det.redFlagsHit.map((k) => <span key={k} className="inline-block mr-1 mb-1 px-1.5 py-0.5 rounded bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/30">⚠ {k}</span>)}
            </div>
          )}
          {turn.referenceAnswer && <Block label="Đáp án mẫu" text={turn.referenceAnswer} />}
        </div>
      )}
    </div>
  );
}

function Block({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] mb-1">{label}</div>
      <p className="text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap bg-[var(--bg-surface)] rounded-lg p-3 border border-[var(--border-light)]">{text}</p>
    </div>
  );
}
