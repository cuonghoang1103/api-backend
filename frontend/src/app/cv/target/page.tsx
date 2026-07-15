'use client';

/**
 * /cv/target — job-targeted view (Phase 8a). Paste a JD → coverage matrix (your
 * evidence × the requirement) → an HONEST fit verdict. The product tells the
 * user when a job is a bad fit and never suggests keyword-stuffing a skill they
 * don't have. Deterministic — works with AI off.
 */
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft, Loader2, Target, CheckCircle2, AlertTriangle, XCircle,
  ShieldAlert, ListOrdered, Trash2, Mail, Copy,
} from 'lucide-react';
import { cvApi } from '@/lib/cv-api';
import type { CvJobSummary, CvCoverage, CvTailor, CvCoverageLevel } from '@/types/cv';

const TONES = [{ v: 'DIRECT', l: 'Thẳng thắn' }, { v: 'FORMAL', l: 'Trang trọng' }, { v: 'WARM', l: 'Ấm áp' }];

const LEVEL_META: Record<CvCoverageLevel, { icon: React.ElementType; cls: string; label: string }> = {
  GREEN: { icon: CheckCircle2, cls: 'text-emerald-500', label: 'Có bằng chứng' },
  AMBER: { icon: AlertTriangle, cls: 'text-amber-500', label: 'Yếu / chưa chứng minh' },
  RED: { icon: XCircle, cls: 'text-red-500', label: 'Không có' },
};
const VERDICT_META: Record<string, { label: string; cls: string }> = {
  STRONG: { label: 'Ứng viên mạnh — nộp đi', cls: 'text-emerald-500' },
  STRETCH: { label: 'Job với tay', cls: 'text-amber-500' },
  POOR: { label: 'Job lệch — cân nhắc bỏ qua', cls: 'text-red-500' },
};

export default function CvTargetPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<CvJobSummary[]>([]);
  const [needLogin, setNeedLogin] = useState(false);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jd, setJd] = useState('');
  const [busy, setBusy] = useState(false);
  const [coverage, setCoverage] = useState<CvCoverage | null>(null);
  const [tailor, setTailor] = useState<CvTailor | null>(null);
  // cover letter
  const [clAvailable, setClAvailable] = useState<boolean | null>(null);
  const [clNeedPro, setClNeedPro] = useState(false);
  const [clTone, setClTone] = useState('DIRECT');
  const [clBusy, setClBusy] = useState(false);
  const [coverLetter, setCoverLetter] = useState<{ body: string; wordCount: number } | null>(null);

  useEffect(() => {
    cvApi.coverLetterStatus()
      .then((r) => { setClAvailable(r.data.data.available); setClNeedPro(!!r.data.data.needPro); })
      .catch(() => setClAvailable(false));
  }, []);

  const genCoverLetter = async () => {
    if (!coverage) return;
    setClBusy(true);
    try {
      const r = await cvApi.coverLetter(coverage.job.id, clTone);
      setCoverLetter({ body: r.data.data.body, wordCount: r.data.data.wordCount });
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Sinh cover letter thất bại');
    } finally { setClBusy(false); }
  };

  const loadJobs = useCallback(async () => {
    try { setJobs((await cvApi.listJobs()).data.data); }
    catch (e) { if ((e as { response?: { status?: number } })?.response?.status === 401) setNeedLogin(true); }
  }, []);
  useEffect(() => { loadJobs(); }, [loadJobs]);

  const openJob = async (id: number) => {
    setBusy(true); setCoverage(null); setTailor(null); setCoverLetter(null);
    try {
      const [cov, tl] = await Promise.all([cvApi.jobCoverage(id), cvApi.jobTailor(id)]);
      setCoverage(cov.data.data); setTailor(tl.data.data);
    } catch { toast.error('Không tải được coverage'); } finally { setBusy(false); }
  };

  const analyze = async () => {
    if (!title.trim() || jd.trim().length < 30) { toast.error('Nhập chức danh và dán JD đầy đủ hơn'); return; }
    setBusy(true);
    try {
      const created = (await cvApi.createJob({ title, company: company || null, rawJobDescription: jd })).data.data;
      await loadJobs();
      await openJob(created.id);
      setJd('');
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Phân tích thất bại');
    } finally { setBusy(false); }
  };

  const del = async (id: number) => {
    try { await cvApi.deleteJob(id); if (coverage?.job.id === id) { setCoverage(null); setTailor(null); } await loadJobs(); }
    catch { toast.error('Xoá thất bại'); }
  };

  if (needLogin) {
    return <div className="min-h-screen bg-[var(--bg-primary)] pt-16"><div className="mx-auto max-w-3xl px-4 py-12 text-sm text-[var(--text-secondary)]">Bạn cần đăng nhập. <Link href="/login" className="text-[var(--accent-color)]">Đăng nhập</Link></div></div>;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-16">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <Link href="/cv" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          <ArrowLeft className="h-4 w-4" /> CV Builder
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Nhắm theo một công việc</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Dán JD → xem kỹ năng yêu cầu vs bằng chứng của bạn, và một đánh giá độ hợp <strong>thật thà</strong>. Không tô hồng, không xui bạn nhồi keyword.
        </p>

        {/* Form */}
        <section className="mt-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Chức danh (Senior Backend Engineer)" />
            <input className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Công ty (tuỳ chọn)" />
          </div>
          <textarea className="mt-2 min-h-[160px] w-full resize-y rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm" value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Dán toàn bộ mô tả công việc (JD) vào đây…" />
          <button onClick={analyze} disabled={busy} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[var(--accent-color)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />} Phân tích độ hợp
          </button>
        </section>

        {/* Past jobs */}
        {jobs.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {jobs.map((j) => (
              <span key={j.id} className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] px-2 py-1 text-xs">
                <button onClick={() => openJob(j.id)} className="hover:underline">{j.title}{j.company ? ` · ${j.company}` : ''}</button>
                <button onClick={() => del(j.id)} className="text-red-500 hover:opacity-80" aria-label="Xoá job này"><Trash2 className="h-3 w-3" /></button>
              </span>
            ))}
          </div>
        )}

        {/* Coverage */}
        {coverage && (
          <div className="mt-5 space-y-4">
            {coverage.job.injectionAttempted && (
              <div className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-500"><ShieldAlert className="h-4 w-4" /> JD này chứa nội dung giống chỉ thị lạ — đã bỏ qua, chỉ phân tích yêu cầu thật.</div>
            )}
            <section className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
              <div className={`text-sm font-semibold ${VERDICT_META[coverage.summary.verdict]?.cls}`}>{VERDICT_META[coverage.summary.verdict]?.label}</div>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{coverage.summary.message}</p>
              <div className="mt-2 text-xs text-[var(--text-secondary)]">Khớp {coverage.summary.mustHaveMatched}/{coverage.summary.mustHaveTotal} must-have · {coverage.summary.mustHaveStrong} có bằng chứng rõ</div>
            </section>

            <section className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
              <h3 className="text-sm font-medium">Kỹ năng yêu cầu × bằng chứng của bạn</h3>
              <ul className="mt-3 space-y-2">
                {coverage.rows.map((r, i) => {
                  const M = LEVEL_META[r.level];
                  return (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <M.icon className={`mt-0.5 h-4 w-4 shrink-0 ${M.cls}`} />
                      <div>
                        <span className="font-medium">{r.skill}</span>
                        <span className="text-xs text-[var(--text-secondary)]"> · {r.required ? 'bắt buộc' : 'ưu tiên'}</span>
                        {r.evidence && <div className="text-xs text-[var(--text-secondary)]">{r.evidence}</div>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            {tailor && (tailor.reorder.length > 0 || tailor.consider_dropping.length > 0) && (
              <section className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
                <div className="flex items-center gap-2 text-sm font-medium"><ListOrdered className="h-4 w-4" /> Gợi ý điều chỉnh cho job này</div>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">{tailor.note}</p>
                {tailor.reorder.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs font-medium text-[var(--text-secondary)]">Đưa lên trên</div>
                    <ul className="mt-1 space-y-1">{tailor.reorder.map((r) => <li key={r.itemId} className="text-sm">• {r.title} <span className="text-xs text-[var(--text-secondary)]">— {r.reason}</span></li>)}</ul>
                  </div>
                )}
                {tailor.consider_dropping.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs font-medium text-[var(--text-secondary)]">Cân nhắc rút gọn</div>
                    <ul className="mt-1 space-y-1">{tailor.consider_dropping.map((r) => <li key={r.itemId} className="text-sm">• {r.title} <span className="text-xs text-[var(--text-secondary)]">— {r.reason}</span></li>)}</ul>
                  </div>
                )}
              </section>
            )}

            {/* Cover letter (Phase 8b) */}
            <section className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-medium"><Mail className="h-4 w-4" /> Cover letter</div>
                {clAvailable !== false && (
                  <div className="flex items-center gap-2">
                    <select value={clTone} onChange={(e) => setClTone(e.target.value)} className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-2 py-1 text-xs">
                      {TONES.map((t) => <option key={t.v} value={t.v}>{t.l}</option>)}
                    </select>
                    <button onClick={genCoverLetter} disabled={clBusy} className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-color)] px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50">
                      {clBusy ? <><Loader2 className="h-4 w-4 animate-spin" /> Đang viết…</> : <><Mail className="h-4 w-4" /> {coverLetter ? 'Viết lại' : 'Sinh cover letter'}</>}
                    </button>
                  </div>
                )}
              </div>
              {clAvailable === false && (clNeedPro ? (
                <p className="mt-2 text-sm">Cover letter AI dành cho tài khoản <strong>Pro</strong>.
                  <Link href="/pro" className="ml-2 inline-flex items-center gap-1 rounded bg-amber-500 px-2.5 py-1 text-xs font-semibold text-black hover:opacity-90">Nâng cấp Pro</Link>
                </p>
              ) : (
                <p className="mt-2 text-xs text-[var(--text-secondary)]">Cover letter cần AI — chưa cấu hình khoá.</p>
              ))}
              {coverLetter && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <span>{coverLetter.wordCount} từ</span>
                    <button onClick={() => { navigator.clipboard.writeText(coverLetter.body); toast.success('Đã copy'); }} className="inline-flex items-center gap-1 hover:text-[var(--text-primary)]"><Copy className="h-3 w-3" /> Copy</button>
                  </div>
                  <textarea className="mt-2 min-h-[280px] w-full resize-y rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] p-3 text-sm leading-relaxed"
                    value={coverLetter.body} onChange={(e) => setCoverLetter({ ...coverLetter, body: e.target.value })} />
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">AI chỉ dùng sự thật trong hồ sơ + JD — không bịa. Đọc lại và chỉnh cho giống giọng bạn trước khi gửi.</p>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
