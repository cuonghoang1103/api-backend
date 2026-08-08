'use client';

/**
 * /cv/xem — XEM CV của chủ site ngay trên web, không cần đăng nhập, không cần
 * tải file về.
 *
 * ─── VÌ SAO CÓ TRANG NÀY ─────────────────────────────────────────────────────
 * Trang /about mới đầu chỉ có nút TẢI. Nhưng người đọc CV đầu tiên thường là
 * nhà tuyển dụng đang lướt trên điện thoại: bắt họ tải một file PDF về máy chỉ
 * để liếc 20 giây là mất người. Xem được ngay thì mới có cơ hội đó.
 *
 * ─── NGUỒN DỮ LIỆU ───────────────────────────────────────────────────────────
 * `GET /api/v1/cv/public/data` trả đúng cấu trúc `RenderCv` mà bộ dựng PDF/DOCX
 * dùng, và đi qua CÙNG một hàm lược PII. Nên trang này và file tải về không bao
 * giờ lệch nội dung — không có chuyện web hiện một đằng, PDF một nẻo.
 *
 * Chưa bật CV công khai (mặc định TẮT, bật ở /admin/cv) ⇒ API trả 404 ⇒ trang
 * hiện thông báo gọn, KHÔNG phải màn hình lỗi.
 *
 * ─── THIẾT KẾ ────────────────────────────────────────────────────────────────
 * Nền tối theo phần còn lại của site, nhưng TỜ CV thì nền sáng cố ý: CV là thứ
 * người ta in ra và đọc trên giấy, và bản in trắng-đen là bản mà nhà tuyển dụng
 * thực sự cầm. Xem trên web giống bản in thì không có bất ngờ nào.
 */
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Download, ArrowLeft, Printer, Mail, MapPin, Phone, Link2 } from 'lucide-react';

interface RenderItem {
  kind: string;
  title: string;
  organization?: string | null;
  location?: string | null;
  dateRange: string;
  url?: string | null;
  techStack: string[];
  gpa?: string | null;
  bullets: string[];
}
interface RenderCv {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  dateOfBirth: string | null;
  links: { label: string; url: string }[];
  summary: string;
  experiences: RenderItem[];
  projects: RenderItem[];
  education: RenderItem[];
  others: RenderItem[];
  skillGroups: { category: string; names: string[] }[];
  languageSkills: { language: string; detail: string }[];
  certifications: { name: string; issuer?: string | null }[];
}
interface PublicCvView {
  cv: RenderCv;
  updatedAt: string;
  formats: string[];
}

/** 'loading' | 'off' (chưa bật) | dữ liệu. Ba trạng thái tách bạch để không
 *  nhấp nháy "chưa có CV" trong lúc còn đang tải. */
type State = { s: 'loading' } | { s: 'off' } | { s: 'ok'; data: PublicCvView };

export default function PublicCvPage() {
  const { locale } = useTranslation();
  const lang: 'vi' | 'en' = locale === 'en' ? 'en' : 'vi';
  const L = (vi: string, en: string): string => (lang === 'en' ? en : vi);

  const [state, setState] = useState<State>({ s: 'loading' });

  useEffect(() => {
    let alive = true;
    fetch('/api/v1/cv/public/data', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!alive) return;
        setState(j?.success && j.data ? { s: 'ok', data: j.data as PublicCvView } : { s: 'off' });
      })
      .catch(() => alive && setState({ s: 'off' }));
    return () => { alive = false; };
  }, []);

  if (state.s === 'loading') {
    return (
      <div className="min-h-screen pt-24 pb-16" style={{ background: '#0a0a0f' }}>
        <div className="mx-auto max-w-4xl px-4">
          <div className="h-[60vh] animate-pulse rounded-2xl border border-darkborder/50 bg-darkcard" />
        </div>
      </div>
    );
  }

  if (state.s === 'off') {
    return (
      <div className="min-h-screen pt-24 pb-16" style={{ background: '#0a0a0f' }}>
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            {L('CV chưa được công khai', 'The CV is not public yet')}
          </h1>
          <p className="mt-3 text-text-secondary">
            {L(
              'Chủ trang chưa bật chia sẻ CV. Bạn có thể liên hệ trực tiếp qua trang giới thiệu.',
              'The owner has not enabled CV sharing. You can get in touch from the about page.',
            )}
          </p>
          <Link
            href="/about"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-darkborder bg-darkcard px-5 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-neon-violet hover:text-neon-violet"
          >
            <ArrowLeft className="h-4 w-4" />
            {L('Về trang giới thiệu', 'Back to about')}
          </Link>
        </div>
      </div>
    );
  }

  const { cv, updatedAt, formats } = state.data;
  const dateStr = new Date(updatedAt).toLocaleDateString(lang === 'en' ? 'en-GB' : 'vi-VN');

  /** Các nhóm mục — chỉ vẽ nhóm nào có nội dung. Một tiêu đề "KINH NGHIỆM" đứng
   *  trên khoảng trống trông tệ hơn là không có mục đó. */
  const sections: { title: string; items: RenderItem[] }[] = [
    { title: L('Kinh nghiệm', 'Experience'), items: cv.experiences },
    { title: L('Dự án', 'Projects'), items: cv.projects },
    { title: L('Học vấn', 'Education'), items: cv.education },
    { title: L('Khác', 'Other'), items: cv.others },
  ].filter((s) => s.items.length > 0);

  return (
    <div className="min-h-screen pb-20 pt-20 print:pt-0" style={{ background: '#0a0a0f' }}>
      {/* Thanh công cụ — KHÔNG in ra giấy (`print:hidden`). */}
      <div className="mx-auto mb-6 max-w-4xl px-4 print:hidden">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-xl border border-darkborder bg-darkcard px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-neon-violet hover:text-neon-violet"
          >
            <ArrowLeft className="h-4 w-4" />
            {L('Giới thiệu', 'About')}
          </Link>

          <a
            href="/api/v1/cv/public/download/pdf"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-emerald-500/40 bg-darkcard px-4 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-emerald-400 hover:bg-emerald-500/5"
          >
            <Download className="h-4 w-4 text-emerald-400" />
            {L('Tải PDF', 'Download PDF')}
          </a>

          {formats.filter((f) => f !== 'pdf').map((f) => (
            <a
              key={f}
              href={`/api/v1/cv/public/download/${f}`}
              className="inline-flex items-center gap-2 rounded-xl border border-darkborder bg-darkcard px-4 py-2.5 text-sm font-medium text-text-muted transition-colors hover:border-neon-violet hover:text-neon-violet"
            >
              {f.toUpperCase()}
            </a>
          ))}

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl border border-darkborder bg-darkcard px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-neon-violet hover:text-neon-violet"
          >
            <Printer className="h-4 w-4" />
            {L('In', 'Print')}
          </button>

          <span className="ml-auto font-mono text-[11px] text-text-muted">
            {L('Cập nhật', 'Updated')} {dateStr}
          </span>
        </div>
      </div>

      {/* Tờ CV — nền sáng cố ý, xem giống bản in. */}
      <article className="mx-auto max-w-4xl px-4">
        <div className="rounded-2xl bg-white p-8 text-[#1a1a1a] shadow-2xl sm:p-12 print:rounded-none print:p-0 print:shadow-none">
          {/* Đầu trang */}
          <header className="border-b-2 border-[#1a1a1a] pb-5">
            <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{cv.fullName}</h1>
            {cv.headline && <p className="mt-1.5 text-lg text-[#444]">{cv.headline}</p>}

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-[#333]">
              {cv.email && (
                <a href={`mailto:${cv.email}`} className="inline-flex items-center gap-1.5 hover:underline">
                  <Mail className="h-3.5 w-3.5" /> {cv.email}
                </a>
              )}
              {/* phone/location chỉ hiện khi chủ site TẮT chế độ ẩn liên hệ —
                  mặc định chúng đã bị lược ở tầng service, không tới đây. */}
              {cv.phone && (
                <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {cv.phone}</span>
              )}
              {cv.location && (
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {cv.location}</span>
              )}
              {cv.links.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:underline"
                >
                  <Link2 className="h-3.5 w-3.5" /> {l.label}
                </a>
              ))}
            </div>
          </header>

          {cv.summary && (
            <section className="mt-6">
              <p className="text-[14.5px] leading-relaxed text-[#333]">{cv.summary}</p>
            </section>
          )}

          {sections.map((sec) => (
            <section key={sec.title} className="mt-7">
              <h2 className="border-b border-[#ccc] pb-1 font-heading text-[13px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a]">
                {sec.title}
              </h2>
              <div className="mt-4 space-y-5">
                {sec.items.map((it, i) => (
                  <div key={`${it.title}-${i}`}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <h3 className="font-heading text-[15px] font-bold">
                        {it.url ? (
                          <a href={it.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {it.title}
                          </a>
                        ) : it.title}
                        {it.organization && <span className="font-normal text-[#444]"> · {it.organization}</span>}
                      </h3>
                      {it.dateRange && (
                        <span className="whitespace-nowrap font-mono text-[12px] text-[#666]">{it.dateRange}</span>
                      )}
                    </div>

                    {(it.location || it.gpa) && (
                      <p className="mt-0.5 text-[12.5px] text-[#666]">
                        {[it.location, it.gpa && `GPA ${it.gpa}`].filter(Boolean).join(' · ')}
                      </p>
                    )}

                    {it.bullets.length > 0 && (
                      <ul className="mt-2 space-y-1.5">
                        {it.bullets.map((b, bi) => (
                          <li key={bi} className="flex gap-2.5 text-[14px] leading-relaxed text-[#333]">
                            <span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#666]" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {it.techStack.length > 0 && (
                      <p className="mt-2 text-[12.5px] text-[#555]">
                        <span className="font-semibold">{L('Công nghệ', 'Tech')}: </span>
                        {it.techStack.join(' · ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}

          {cv.skillGroups.length > 0 && (
            <section className="mt-7">
              <h2 className="border-b border-[#ccc] pb-1 font-heading text-[13px] font-bold uppercase tracking-[0.14em]">
                {L('Kỹ năng', 'Skills')}
              </h2>
              <dl className="mt-3 space-y-1.5">
                {cv.skillGroups.map((g) => (
                  <div key={g.category} className="flex flex-wrap gap-x-2 text-[14px]">
                    <dt className="font-semibold text-[#1a1a1a]">{g.category}:</dt>
                    <dd className="text-[#333]">{g.names.join(' · ')}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {(cv.certifications.length > 0 || cv.languageSkills.length > 0) && (
            <section className="mt-7 grid gap-6 sm:grid-cols-2">
              {cv.certifications.length > 0 && (
                <div>
                  <h2 className="border-b border-[#ccc] pb-1 font-heading text-[13px] font-bold uppercase tracking-[0.14em]">
                    {L('Chứng chỉ', 'Certifications')}
                  </h2>
                  <ul className="mt-3 space-y-1 text-[14px] text-[#333]">
                    {cv.certifications.map((c, i) => (
                      <li key={i}>{c.name}{c.issuer ? ` — ${c.issuer}` : ''}</li>
                    ))}
                  </ul>
                </div>
              )}
              {cv.languageSkills.length > 0 && (
                <div>
                  <h2 className="border-b border-[#ccc] pb-1 font-heading text-[13px] font-bold uppercase tracking-[0.14em]">
                    {L('Ngoại ngữ', 'Languages')}
                  </h2>
                  <ul className="mt-3 space-y-1 text-[14px] text-[#333]">
                    {cv.languageSkills.map((l, i) => (
                      <li key={i}>{l.language}{l.detail ? ` — ${l.detail}` : ''}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}
        </div>
      </article>
    </div>
  );
}
