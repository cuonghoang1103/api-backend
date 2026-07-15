'use client';

/**
 * /cv/recruiter-view — simulate how a CV is ACTUALLY read (Phase 5).
 * A recruiter spends ~6–8 seconds on the first pass, scanning for reasons to
 * reject. Users write as if their CV will be read carefully; that mistaken
 * assumption is the root of most bad CVs. Three sobering diagnostics — no score
 * theatrics, no confetti. Pure frontend over data we already have (profile +
 * the plain-text export, which is exactly what an ATS extracts).
 */
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, ScanEye, AlignLeft, Eye } from 'lucide-react';
import { cvApi } from '@/lib/cv-api';
import type { CvProfile } from '@/types/cv';

type Tab = 'six' | 'fpattern' | 'ats';

export default function RecruiterViewPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CvProfile | null>(null);
  const [atsText, setAtsText] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [needLogin, setNeedLogin] = useState(false);
  const [tab, setTab] = useState<Tab>('six');
  const [scanning, setScanning] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const load = useCallback(async () => {
    try {
      const [p, txt] = await Promise.all([
        cvApi.getProfile(),
        cvApi.exportCv('txt').then((r) => (r.data as Blob).text()).catch(() => ''),
      ]);
      setProfile(p.data.data);
      setAtsText(txt);
    } catch (e) {
      const status = (e as { response?: { status?: number } })?.response?.status;
      if (status === 401) setNeedLogin(true);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Six-second registration: only what a scanning eye plausibly catches.
  const latest = profile?.items.find((i) => i.kind === 'EXPERIENCE') ?? profile?.items.find((i) => i.kind === 'PROJECT');
  const edu = profile?.items.find((i) => i.kind === 'EDUCATION');
  const topSkills = (profile?.skills ?? []).slice(0, 6).map((s) => s.name);

  const runScan = () => {
    setRevealed(false); setScanning(true);
    setTimeout(() => { setScanning(false); setRevealed(true); }, 1600);
  };

  if (loading) {
    return <div className="min-h-screen bg-[var(--bg-primary)] pt-16"><div className="mx-auto max-w-3xl px-4 py-12 flex items-center gap-2 text-[var(--text-secondary)]"><Loader2 className="h-4 w-4 animate-spin" /> Đang tải…</div></div>;
  }
  if (needLogin) {
    return <div className="min-h-screen bg-[var(--bg-primary)] pt-16"><div className="mx-auto max-w-3xl px-4 py-12 text-sm text-[var(--text-secondary)]">Bạn cần đăng nhập. <Link href="/login" className="text-[var(--accent-color)]">Đăng nhập</Link></div></div>;
  }

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'six', label: '6 giây', icon: ScanEye },
    { id: 'fpattern', label: 'F-pattern', icon: Eye },
    { id: 'ats', label: 'ATS đọc thế nào', icon: AlignLeft },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-16">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <Link href="/cv" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          <ArrowLeft className="h-4 w-4" /> CV Builder
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">CV của bạn bị đọc thế nào</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Nhà tuyển dụng lướt 6–8 giây, tìm lý do để loại — không đọc kỹ. Đây là sự thật đó, không tô hồng.
        </p>

        <div className="mt-4 flex gap-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] p-1">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm ${tab === t.id ? 'bg-[var(--accent-color)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]'}`}>
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* SIX-SECOND */}
        {tab === 'six' && (
          <section className="mt-5">
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
              {!revealed ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <p className="text-sm text-[var(--text-secondary)]">Mô phỏng lượt quét đầu tiên của nhà tuyển dụng.</p>
                  <button onClick={runScan} disabled={scanning}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--accent-color)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60">
                    {scanning ? <><Loader2 className="h-4 w-4 animate-spin" /> Đang quét…</> : <><ScanEye className="h-4 w-4" /> Bắt đầu quét 6 giây</>}
                  </button>
                </div>
              ) : (
                <>
                  <div className={`space-y-3 transition-opacity duration-500 ${scanning ? 'opacity-0' : 'opacity-100'}`}>
                    <div>
                      <div className="text-xl font-semibold">{profile?.fullName || '(chưa có tên)'}</div>
                      <div className="text-sm text-[var(--text-secondary)]">{profile?.headline || ''}</div>
                    </div>
                    <div className="text-sm">
                      <span className="text-[var(--text-secondary)]">Vai trò gần nhất: </span>
                      {latest ? `${latest.title}${latest.organization ? ' @ ' + latest.organization : ''}` : '(không rõ)'}
                    </div>
                    <div className="text-sm">
                      <span className="text-[var(--text-secondary)]">Học vấn: </span>
                      {edu ? `${edu.title}${edu.organization ? ' — ' + edu.organization : ''}` : '(không rõ)'}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-sm">
                      <span className="text-[var(--text-secondary)]">Kỹ năng nổi: </span>
                      {topSkills.length ? topSkills.map((s) => <span key={s} className="rounded border border-[var(--border-color)] px-1.5 py-0.5 text-xs">{s}</span>) : '(không rõ)'}
                    </div>
                  </div>
                  <div className="mt-5 border-t border-[var(--border-color)] pt-4 text-sm text-[var(--text-secondary)]">
                    Đó là <strong>tất cả</strong> những gì họ đọc. Đủ để họ không loại bạn chưa?
                    <button onClick={runScan} className="ml-2 text-[var(--accent-color)]">Quét lại</button>
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {/* F-PATTERN */}
        {tab === 'fpattern' && (
          <section className="mt-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
            <p className="text-sm text-[var(--text-secondary)]">
              Mắt người đọc theo hình chữ F: quét ngang dòng đầu, ngang phần trên, rồi trượt dọc mép trái. Mọi thứ quan trọng
              nằm ngoài vùng đậm gần như <strong>vô hình</strong>.
            </p>
            <div className="relative mt-4 aspect-[1/1.414] w-full max-w-sm overflow-hidden rounded-lg border border-[var(--border-color)] bg-white">
              {/* Heat zones */}
              <div className="absolute left-0 top-0 h-[14%] w-full bg-[var(--accent-color)] opacity-30" />
              <div className="absolute left-0 top-[22%] h-[10%] w-[70%] bg-[var(--accent-color)] opacity-20" />
              <div className="absolute left-0 top-0 h-full w-[10%] bg-[var(--accent-color)] opacity-15" />
              {/* Fake content lines */}
              <div className="relative space-y-2 p-4">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="h-2 rounded bg-slate-300" style={{ width: `${[90, 70, 55, 80, 45, 60, 40, 75, 50, 65, 42, 58, 38, 70, 48, 55][i]}%` }} />
                ))}
              </div>
            </div>
            <p className="mt-3 text-xs text-[var(--text-secondary)]">Đặt tên + chức danh + thành tích mạnh nhất vào vùng đậm phía trên. Đừng chôn ở giữa/cuối trang.</p>
          </section>
        )}

        {/* ATS VIEW */}
        {tab === 'ats' && (
          <section className="mt-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
            <div className="flex items-center gap-2 text-sm font-medium"><AlignLeft className="h-4 w-4" /> Máy ATS bóc CV của bạn ra thế này</div>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Layout, cột, icon, bảng — máy bỏ hết, chỉ còn text theo thứ tự đọc. Nếu ở đây thiếu thông tin gì, ATS cũng không thấy.
            </p>
            <pre className="mt-3 max-h-[60vh] overflow-auto whitespace-pre-wrap break-words rounded-lg bg-[var(--bg-primary)] p-4 text-[12px] leading-relaxed text-[var(--text-primary)]">
              {atsText || '(chưa có nội dung — hãy nhập/nhập CV trước)'}
            </pre>
          </section>
        )}

        <div className="mt-6 flex gap-2 pb-8">
          <Link href="/cv/review" className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] px-4 py-2 text-sm hover:bg-[var(--bg-card)]">Xem chấm CV</Link>
          <Link href="/cv/profile" className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-color)] px-4 py-2 text-sm font-medium text-white hover:opacity-90">Sửa hồ sơ</Link>
        </div>
      </div>
    </div>
  );
}
