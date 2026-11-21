'use client';
/**
 * Bảng "🎯 Dự án cuối khoá · Tiến độ" ở TRANG KHOÁ (/courses/[slug]). Trang khoá chạy được cả giao diện sáng lẫn tối
 * qua bảng biến `--k-*` của chuongTrinh.module.css — nên khối này dùng đúng các biến đó (khác các khối trong trang học,
 * vốn là đảo tối). Khoá không có dự án ⇒ không vẽ gì.
 */
import Link from 'next/link';
import { Target } from 'lucide-react';
import { pickLang } from '@/lib/utils';
import { soDiem } from '@/lib/duAn';
import { chuDuAn } from './chu';
import { useDuAn } from './useDuAn';
import s from '@/components/courses/chuong-trinh/chuongTrinh.module.css';

export default function TienDoDuAn({
  courseSlug, locale, baiTheoSlug = {}, coTheVaoHoc = true,
}: {
  courseSlug: string;
  locale: 'en' | 'vi';
  /** slug bài ⇒ id bài, để link thẳng tới bài mốc (`/learn?lessonId=`). */
  baiTheoSlug?: Record<string, number>;
  coTheVaoHoc?: boolean;
}) {
  const { data } = useDuAn(courseSlug);
  const t = chuDuAn(locale);
  if (!data?.coDuAn || !data.duAn) return null;
  const duAn = data.duAn;
  const ct = data.cuaToi;
  const lc = ct?.luaChon ?? null;
  const tien = ct?.tienDo;
  const linkBai = (slug: string) => {
    const id = baiTheoSlug[slug];
    return `/courses/${courseSlug}/learn${id ? `?lessonId=${id}` : ''}`;
  };
  const en = locale === 'en';
  const dangKy = duAn.bai.dangKy[0];

  return (
    <section aria-labelledby="du-an-tieu-de" className={`${s.the} rounded-2xl p-5 sm:p-6`}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <h2 id="du-an-tieu-de" className="flex min-w-0 items-center gap-2 font-heading text-xl font-bold text-[var(--k-ink)]">
          <Target className="h-5 w-5 shrink-0 text-[var(--k-accent)]" aria-hidden />
          {en ? 'Final project · progress' : 'Dự án cuối khoá · Tiến độ'}
        </h2>
        {tien && (
          <span className="rounded-full bg-[var(--k-accent-soft)] px-3 py-1 text-sm font-semibold text-[var(--k-accent)]">
            {tien.phanTram}%
          </span>
        )}
      </div>

      <p className="text-sm leading-relaxed text-[var(--k-ink-2)]">
        {en
          ? `One real project built chapter by chapter: ${duAn.deTai.length} suggested topics (or your own, AI-reviewed), ${duAn.moc.length} milestones, then a defence graded on a rubric.`
          : `Một dự án thật làm dần theo từng chương: ${duAn.deTai.length} đề tài gợi ý (hoặc tự chọn, AI duyệt), ${duAn.moc.length} mốc, cuối khoá bảo vệ chấm theo rubric.`}
      </p>

      {!data.daDangNhap ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--k-accent-line)] bg-[var(--k-accent-soft)] p-4">
          <p className="min-w-0 text-sm text-[var(--k-ink-2)]">{t.moiDangNhap}</p>
          <Link href={`/login?callbackUrl=${encodeURIComponent(`/courses/${courseSlug}`)}`}
            className="inline-flex min-h-[40px] items-center rounded-xl px-4 text-sm font-semibold text-white" style={{ background: 'var(--k-grad)' }}>
            {t.dangNhap}
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-4 rounded-xl border border-[var(--k-border)] bg-[var(--k-card-2)] p-4">
            {lc ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--k-ink-3)]">{t.deTaiCuaBan} · {lc.loai === 'GOI_Y' ? t.goiY : t.tuChon}</p>
                <p className="mt-0.5 break-words font-semibold text-[var(--k-ink)]">{pickLang(lc.ten, locale)}</p>
              </>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="min-w-0 text-sm text-[var(--k-ink-2)]">{en ? 'You have not chosen a topic yet.' : 'Bạn chưa chọn đề tài.'}</p>
                {coTheVaoHoc && dangKy && (
                  <Link href={linkBai(dangKy)} className="text-sm font-semibold text-[var(--k-accent)] hover:underline">
                    {en ? 'Choose a topic →' : 'Chọn đề tài →'}
                  </Link>
                )}
              </div>
            )}
            {tien && (
              <div className="mt-3">
                <div className="mb-1.5 flex items-center justify-between text-xs text-[var(--k-ink-3)]">
                  <span>{t.mocXong(tien.xong, tien.tong)}</span><span className="font-semibold">{tien.phanTram}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--k-border)]" role="progressbar" aria-valuenow={tien.phanTram} aria-valuemin={0} aria-valuemax={100}>
                  <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${tien.phanTram}%`, background: 'var(--k-grad)' }} />
                </div>
              </div>
            )}
          </div>

          {tien && (
            <ol className="mt-4 grid gap-2 sm:grid-cols-2">
              {tien.moc.map((m) => {
                const nhan = m.trangThai === 'XONG' ? '✓' : m.trangThai === 'DANG_LAM' ? '●' : '○';
                const mau = m.trangThai === 'XONG' ? 'text-[var(--k-green)] bg-[var(--k-green-soft)]'
                  : m.trangThai === 'DANG_LAM' ? 'text-[var(--k-amber)] bg-[var(--k-amber-soft)]' : 'text-[var(--k-ink-3)] bg-[var(--k-card-2)]';
                const noiDung = (
                  <>
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${mau}`} aria-hidden>{nhan}</span>
                    <span className="min-w-0 break-words text-sm text-[var(--k-ink-2)]">{pickLang(m.ten, locale)}</span>
                  </>
                );
                return (
                  <li key={m.slug}>
                    {coTheVaoHoc ? (
                      <Link href={linkBai(m.slug)} className="flex min-w-0 items-center gap-2.5 rounded-lg border border-[var(--k-border)] px-3 py-2 hover:bg-[var(--k-card-hover)]">{noiDung}</Link>
                    ) : (
                      <div className="flex min-w-0 items-center gap-2.5 rounded-lg border border-[var(--k-border)] px-3 py-2">{noiDung}</div>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
          {ct?.baoVe.diemCaoNhat != null && (
            <p className="mt-3 text-sm text-[var(--k-ink-2)]">🎓 {t.diemCaoNhat}: <span className="font-semibold text-[var(--k-green)]">{soDiem(ct.baoVe.diemCaoNhat, locale)}/10</span></p>
          )}
        </>
      )}
    </section>
  );
}
