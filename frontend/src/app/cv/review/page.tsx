'use client';

/**
 * /cv/review — the STATIC rules-engine review (Phase 3). Free, instant, no LLM.
 * A diagnostic, not a celebration: it shows what a recruiter would register in
 * six seconds, then a specific, uncomfortable, correct list of what's wrong.
 * No score animations, no confetti — its power is being sober.
 */
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Loader2, AlertOctagon, AlertTriangle, Info,
  CheckCircle2, ScanEye, Target as TargetIcon,
} from 'lucide-react';
import { cvApi } from '@/lib/cv-api';
import type { CvLintResult, CvSeverity } from '@/types/cv';

const MARKETS = [
  { value: 'VN', label: 'Việt Nam' },
  { value: 'INTERNATIONAL', label: 'Quốc tế (US/EU/remote)' },
];
const LEVELS = ['STUDENT', 'FRESHER', 'JUNIOR', 'MID', 'SENIOR', 'LEAD'];

const SEV_META: Record<CvSeverity, { label: string; icon: React.ElementType; cls: string }> = {
  CRITICAL: { label: 'Nghiêm trọng', icon: AlertOctagon, cls: 'text-red-500' },
  MAJOR: { label: 'Lớn', icon: AlertTriangle, cls: 'text-amber-500' },
  MINOR: { label: 'Nhỏ', icon: Info, cls: 'text-sky-500' },
};
const BAND_META: Record<string, { label: string; cls: string }> = {
  INTERVIEW: { label: 'Có cửa được gọi phỏng vấn', cls: 'text-emerald-500' },
  MAYBE: { label: 'Nửa vời — dễ bị bỏ qua', cls: 'text-amber-500' },
  REJECT: { label: 'Nhiều khả năng bị loại', cls: 'text-red-500' },
};

export default function CvReviewPage() {
  const router = useRouter();
  const [market, setMarket] = useState('VN');
  const [level, setLevel] = useState<string>('');
  const [res, setRes] = useState<CvLintResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [needLogin, setNeedLogin] = useState(false);

  const run = useCallback(async (m: string, l: string) => {
    setLoading(true);
    try {
      const r = await cvApi.lint({ market: m, ...(l ? { level: l } : {}) });
      setRes(r.data.data);
      setLevel(r.data.data.level);
    } catch (e) {
      const status = (e as { response?: { status?: number } })?.response?.status;
      if (status === 401) setNeedLogin(true);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { run('VN', ''); }, [run]);

  const issuesBySeverity = (sev: CvSeverity) => res?.issues.filter((i) => i.severity === sev) ?? [];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-16">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <Link href="/cv" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          <ArrowLeft className="h-4 w-4" /> CV Builder
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Chấm CV — bản miễn phí</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Bắt lỗi bằng luật, không dùng AI, không tốn gì. Đây là những thứ nhà tuyển dụng loại bạn vì chúng —
          trước khi họ kịp làm thế.
        </p>

        {/* Market / level controls */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <select value={market} onChange={(e) => { setMarket(e.target.value); run(e.target.value, level); }}
            className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-1.5 text-sm">
            {MARKETS.map((m) => <option key={m.value} value={m.value}>Thị trường: {m.label}</option>)}
          </select>
          <select value={level} onChange={(e) => { setLevel(e.target.value); run(market, e.target.value); }}
            className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-1.5 text-sm">
            {LEVELS.map((l) => <option key={l} value={l}>Cấp: {l}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="mt-10 flex items-center gap-2 text-[var(--text-secondary)]"><Loader2 className="h-4 w-4 animate-spin" /> Đang chấm…</div>
        ) : needLogin ? (
          <div className="mt-8 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 text-sm text-[var(--text-secondary)]">
            Bạn cần đăng nhập. <Link href="/login" className="text-[var(--accent-color)]">Đăng nhập</Link>
          </div>
        ) : res ? (
          <div className="mt-6 space-y-5">
            {/* Score + band */}
            <section className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
              <div className="flex items-center gap-5">
                <div className="text-center">
                  <div className="text-4xl font-semibold tabular-nums">{res.score}</div>
                  <div className="text-xs text-[var(--text-secondary)]">/ 100</div>
                </div>
                <div className="h-12 w-px bg-[var(--border-color)]" />
                <div>
                  <div className={`text-sm font-semibold ${BAND_META[res.band]?.cls}`}>{BAND_META[res.band]?.label}</div>
                  <div className="mt-1 text-xs text-[var(--text-secondary)]">
                    {res.counts.items} mục · {res.counts.bullets} dòng · {res.counts.strongBullets} mạnh · {res.counts.weakBullets} yếu · {res.counts.bulletsWithMetric} có số
                  </div>
                </div>
              </div>
            </section>

            {/* Six-second test */}
            <section className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
              <div className="flex items-center gap-2 text-sm font-medium"><ScanEye className="h-4 w-4" /> 6 giây đầu tiên nhà tuyển dụng thấy</div>
              <p className="mt-2 rounded-lg bg-[var(--bg-primary)] p-3 text-sm">{res.sixSecondTest}</p>
              <p className="mt-2 text-xs text-[var(--text-secondary)]">Đó là tất cả những gì họ đọc trong lượt quét đầu. Đủ để không loại bạn chưa?</p>
            </section>

            {/* Issues by severity */}
            {(['CRITICAL', 'MAJOR', 'MINOR'] as CvSeverity[]).map((sev) => {
              const list = issuesBySeverity(sev);
              if (list.length === 0) return null;
              const M = SEV_META[sev];
              return (
                <section key={sev} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
                  <div className={`flex items-center gap-2 text-sm font-semibold ${M.cls}`}>
                    <M.icon className="h-4 w-4" /> {M.label} ({list.length})
                  </div>
                  <ul className="mt-3 space-y-3">
                    {list.map((i, idx) => (
                      <li key={idx} className="border-l-2 border-[var(--border-color)] pl-3">
                        <div className="text-sm">{i.problem}</div>
                        {i.suggestedFix && <div className="mt-0.5 text-xs text-[var(--text-secondary)]">→ {i.suggestedFix}</div>}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}

            {/* Skill gaps */}
            {res.skillGaps.length > 0 && (
              <section className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
                <div className="flex items-center gap-2 text-sm font-semibold"><TargetIcon className="h-4 w-4" /> Kỹ năng không có bằng chứng</div>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  Bạn ghi những kỹ năng này nhưng không dòng nào cho thấy bạn đã dùng. Interviewer sẽ hỏi đúng chỗ đó.
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {res.skillGaps.map((s) => (
                    <span key={s} className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-xs">{s}</span>
                  ))}
                </div>
              </section>
            )}

            {/* Strengths */}
            {res.strengths.length > 0 && (
              <section className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-500"><CheckCircle2 className="h-4 w-4" /> Đang làm tốt</div>
                <ul className="mt-2 space-y-1">
                  {res.strengths.map((s, i) => <li key={i} className="text-sm text-[var(--text-secondary)]">• {s}</li>)}
                </ul>
              </section>
            )}

            <p className="pb-4 text-xs text-[var(--text-secondary)]">
              Quy ước {res.market === 'VN' ? 'Việt Nam' : 'quốc tế'} · cấp {res.level}. {res.conventionNotes.level}
            </p>

            <div className="flex gap-2 pb-8">
              <Link href="/cv/profile" className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-color)] px-4 py-2 text-sm font-medium text-white hover:opacity-90">
                Sửa hồ sơ
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
