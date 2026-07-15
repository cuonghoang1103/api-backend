'use client';

/**
 * /cv — CV Builder dashboard (Phase 1).
 * The hub for the user's MASTER career record. The master profile is the thing
 * you maintain over years; individual tailored CVs (later phases) are just views
 * of it. This screen surfaces completeness and routes into the editor. Import,
 * AI review and export land in later phases and are shown honestly as "sắp có"
 * rather than faked.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  FileText, ArrowRight, Loader2, CheckCircle2, Circle,
  Upload, ScanSearch, Eye, Download, Target, Lock, Sparkles,
} from 'lucide-react';
import { CV_BUILDER_ENABLED } from '@/lib/featureFlags';
import { cvApi } from '@/lib/cv-api';
import type { CvCompleteness } from '@/types/cv';

const EXPORT_FORMATS: { fmt: 'pdf' | 'docx' | 'txt' | 'md' | 'json'; label: string; hint?: string }[] = [
  { fmt: 'pdf', label: 'PDF', hint: 'ATS-safe' },
  { fmt: 'docx', label: 'Word (.docx)' },
  { fmt: 'txt', label: 'Text' },
  { fmt: 'md', label: 'Markdown' },
  { fmt: 'json', label: 'JSON Resume' },
];

export default function CvDashboardPage() {
  const router = useRouter();
  const [comp, setComp] = useState<CvCompleteness | null>(null);
  const [loading, setLoading] = useState(true);
  const [needLogin, setNeedLogin] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);

  const download = async (fmt: 'pdf' | 'docx' | 'txt' | 'md' | 'json') => {
    setExporting(fmt);
    try {
      const res = await cvApi.exportCv(fmt);
      const cd = (res.headers?.['content-disposition'] as string | undefined) ?? '';
      const fname = cd.match(/filename="(.+?)"/)?.[1] || `CV.${fmt}`;
      const url = URL.createObjectURL(res.data as Blob);
      const a = document.createElement('a');
      a.href = url; a.download = fname; document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Xuất CV thất bại');
    } finally { setExporting(null); }
  };

  useEffect(() => {
    if (!CV_BUILDER_ENABLED) { router.replace('/'); return; }
    cvApi
      .completeness()
      .then((res) => setComp(res.data.data))
      .catch((e) => {
        const status = (e as { response?: { status?: number } })?.response?.status;
        if (status === 401) setNeedLogin(true);
      })
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-16">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)]">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">CV Builder</h1>
            <p className="mt-1 max-w-xl text-sm text-[var(--text-secondary)]">
              Hồ sơ sự nghiệp gốc của bạn — nguồn sự thật duy nhất. Mỗi CV cụ thể chỉ là
              một lát cắt từ đây. Công cụ này không bịa: nó moi ra điều bạn thật sự đã làm.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="mt-12 flex items-center gap-2 text-[var(--text-secondary)]">
            <Loader2 className="h-4 w-4 animate-spin" /> Đang tải…
          </div>
        ) : needLogin ? (
          <div className="mt-10 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
            <p className="text-sm text-[var(--text-secondary)]">
              Bạn cần đăng nhập để dùng CV Builder.
            </p>
            <Link
              href="/login"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--accent-color)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Đăng nhập <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Completeness */}
            <section className="mt-8 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-[var(--text-secondary)]">Độ hoàn thiện hồ sơ gốc</h2>
                <span className="text-sm font-semibold tabular-nums">{comp?.percent ?? 0}%</span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--border-color)]">
                <div
                  className="h-full rounded-full bg-[var(--accent-color)] transition-[width] duration-500"
                  style={{ width: `${comp?.percent ?? 0}%` }}
                />
              </div>
              <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                {comp?.checks.map((c) => (
                  <li key={c.key} className="flex items-center gap-2 text-sm">
                    {c.done ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 text-[var(--text-secondary)] opacity-50" />
                    )}
                    <span className={c.done ? '' : 'text-[var(--text-secondary)]'}>{c.label}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href="/cv/import"
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-color)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  <Upload className="h-4 w-4" /> Nhập CV có sẵn
                </Link>
                <Link
                  href="/cv/review"
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-color)] px-4 py-2 text-sm font-medium hover:bg-[var(--bg-primary)]"
                >
                  <ScanSearch className="h-4 w-4" /> Chấm CV (miễn phí)
                </Link>
                <Link
                  href="/cv/recruiter-view"
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-color)] px-4 py-2 text-sm font-medium hover:bg-[var(--bg-primary)]"
                >
                  <Eye className="h-4 w-4" /> Recruiter View
                </Link>
                <Link
                  href="/cv/target"
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-color)] px-4 py-2 text-sm font-medium hover:bg-[var(--bg-primary)]"
                >
                  <Target className="h-4 w-4" /> Nhắm theo job
                </Link>
                <Link
                  href="/cv/intake"
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-color)] px-4 py-2 text-sm font-medium hover:bg-[var(--bg-primary)]"
                >
                  <Sparkles className="h-4 w-4" /> AI phỏng vấn lấy nội dung
                </Link>
                <Link
                  href="/cv/profile"
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-color)] px-4 py-2 text-sm font-medium hover:bg-[var(--bg-primary)]"
                >
                  Chỉnh sửa hồ sơ gốc <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            {/* Counts */}
            {comp && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: 'Mục CV', value: comp.counts.items },
                  { label: 'Dòng thành tích', value: comp.counts.bullets },
                  { label: 'Kỹ năng', value: comp.counts.skills },
                  { label: 'Chứng chỉ', value: comp.counts.certifications },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] p-3">
                    <div className="text-xl font-semibold tabular-nums">{s.value}</div>
                    <div className="text-xs text-[var(--text-secondary)]">{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Export */}
            <section className="mt-8 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
              <div className="flex items-center gap-2 text-sm font-medium"><Download className="h-4 w-4" /> Tải CV xuống</div>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                PDF là chữ thật (ATS đọc được, đã kiểm tra round-trip), không phải ảnh. DOCX để nhà tuyển dụng sửa trực tiếp.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {EXPORT_FORMATS.map((f) => (
                  <button
                    key={f.fmt}
                    onClick={() => download(f.fmt)}
                    disabled={exporting !== null}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] px-3 py-1.5 text-sm hover:bg-[var(--bg-primary)] disabled:opacity-50"
                  >
                    {exporting === f.fmt ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                    {f.label}
                    {f.hint && <span className="text-[10px] text-[var(--text-secondary)]">· {f.hint}</span>}
                  </button>
                ))}
              </div>
            </section>

            {/* Roadmap — honest about what isn't built yet */}
            <section className="mt-8">
              <h2 className="text-sm font-medium text-[var(--text-secondary)]">Sắp có</h2>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { icon: Upload, title: 'Kết nối GitHub', desc: 'Chấm điểm repo, gợi ý mục CV (dán text, JSON Resume, PDF/DOCX đã dùng được).' },
                  { icon: FileText, title: 'Cover letter', desc: 'Sinh thư xin việc bám JD, không sáo rỗng (đang làm).' },
                ].map((f) => (
                  <div
                    key={f.title}
                    className="relative flex gap-3 rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-card)]/50 p-4 opacity-80"
                  >
                    <f.icon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--text-secondary)]" />
                    <div>
                      <div className="flex items-center gap-1.5 text-sm font-medium">
                        {f.title}
                        <Lock className="h-3 w-3 text-[var(--text-secondary)]" />
                      </div>
                      <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
