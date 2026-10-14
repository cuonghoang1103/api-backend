'use client';

/**
 * 🏋️ "Luyện tập trên Code Lab" — thẻ NGAY DƯỚI khung video bài giảng (Code Lab đợt 1).
 *
 * Cuối mỗi video, giọng đọc nói "bấm vào link Code Lab ngay dưới bài giảng này,
 * luyện các bài từ dễ đến khó" ⇒ với khoá trong chương trình luyện tập
 * (`coBoLuyen`, hoặc `KHOA_CO_BO_LUYEN` khi API chưa trả/lỗi) thẻ KHÔNG BAO GIỜ
 * biến mất: có bộ ⇒ "N bài · Dễ → Khó" + nút mở; chưa có ⇒ "Bài luyện đang soạn"
 * + link track gần nhất. Khoá ngoài chương trình chỉ hiện thẻ khi thật sự có bộ.
 *
 * Dữ liệu: `layBoLuyenTap` (lib/codelabPractice.ts) → GET /code-lab/practice/:khoá/:bài.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Dumbbell, ArrowRight, Hourglass, CheckCircle2 } from 'lucide-react';
import {
  KHOA_CO_BO_LUYEN,
  layBoLuyenTap,
  duongBoLuyen,
  duongBaiTrongBo,
  thamSoVe,
  type BoLuyenTap,
} from '@/lib/codelabPractice';

const NHAN_DO_KHO: Record<string, { vi: string; en: string; cls: string }> = {
  EASY: { vi: 'dễ', en: 'easy', cls: 'text-emerald-500' },
  MEDIUM: { vi: 'vừa', en: 'medium', cls: 'text-amber-500' },
  HARD: { vi: 'khó', en: 'hard', cls: 'text-rose-500' },
  EXPERT: { vi: 'chuyên gia', en: 'expert', cls: 'text-fuchsia-500' },
};

export default function LuyenTapCodeLab({
  courseSlug,
  lessonSlug,
  lessonId,
  lessonTitle,
  locale,
}: {
  courseSlug: string;
  lessonSlug?: string | null;
  lessonId: number;
  /** Tên bài (đã chọn ngôn ngữ) — làm nhãn nút "Quay lại" bên Code Lab. */
  lessonTitle: string;
  locale: string;
}) {
  const en = locale === 'en';
  const [bo, datBo] = useState<BoLuyenTap | null>(null);
  const [loi, datLoi] = useState(false);

  useEffect(() => {
    let huy = false;
    datBo(null);
    datLoi(false);
    if (!lessonSlug) return;
    layBoLuyenTap(courseSlug, lessonSlug)
      .then((d) => { if (!huy) datBo(d); })
      .catch(() => { if (!huy) datLoi(true); });
    return () => { huy = true; };
  }, [courseSlug, lessonSlug]);

  const khoaCoBo = KHOA_CO_BO_LUYEN.has(courseSlug);
  // Thẻ hiện khi: khoá trong chương trình (kể cả lúc đang tải / lỗi), hoặc API báo có bộ.
  const hien = khoaCoBo || !!bo?.coBoLuyen || (bo?.items.length ?? 0) > 0;
  if (!hien) return null;

  const duongVe = `/courses/${courseSlug}/learn?lessonId=${lessonId}`;
  const nhan = lessonTitle || (en ? 'lesson' : 'bài học');

  const khung = 'mt-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3';
  const tieuDe = (
    <span className="inline-flex items-center gap-2 font-semibold text-text-primary">
      <Dumbbell className="h-4 w-4 text-emerald-500" />
      {en ? 'Practice on Code Lab' : 'Luyện tập trên Code Lab'}
    </span>
  );

  // Đang tải (hoặc bài chưa có slug — dữ liệu cũ): giữ chỗ để thẻ không "nhảy" ra sau.
  if (!bo && !loi && lessonSlug) {
    return (
      <div className={khung} aria-busy="true">
        <div className="flex items-center justify-between gap-3">
          {tieuDe}
          <span className="h-4 w-24 animate-pulse rounded bg-emerald-500/20" />
        </div>
      </div>
    );
  }

  // Có bộ.
  if (bo && bo.items.length > 0) {
    const thuTu = (['EASY', 'MEDIUM', 'HARD', 'EXPERT'] as const).filter((k) => bo.byDifficulty[k] > 0);
    const baiDau = bo.items[0];
    return (
      <div className={khung}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            {tieuDe}
            <p className="mt-1 text-sm text-text-secondary">
              {bo.total} {en ? (bo.total === 1 ? 'exercise' : 'exercises') : 'bài'}
              {thuTu.map((k) => (
                <span key={k}>
                  {' · '}
                  <span className={NHAN_DO_KHO[k].cls}>
                    {bo.byDifficulty[k]} {en ? NHAN_DO_KHO[k].en : NHAN_DO_KHO[k].vi}
                  </span>
                </span>
              ))}
              {' · '}{en ? 'Easy → Hard' : 'Dễ → Khó'}
              {bo.estimatedMinutes > 0 && <> · ≈{bo.estimatedMinutes} {en ? 'min' : 'phút'}</>}
              {bo.scope === 'chapter' && <> · {en ? 'whole chapter' : 'cả chương'}</>}
              {bo.banNhap && <span className="ml-1 rounded bg-amber-500/20 px-1.5 text-xs text-amber-500">DRAFT</span>}
            </p>
            {bo.solvedCount != null && (
              <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-text-muted">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                {bo.solvedCount}/{bo.total} {en ? 'solved' : 'đã giải'}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={duongBoLuyen(bo, duongVe, nhan)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
            >
              {en ? 'Start practising' : 'Vào luyện tập'} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={duongBaiTrongBo(bo, baiDau.slug, duongVe, nhan)}
              className="text-xs font-medium text-emerald-600 underline-offset-2 hover:underline"
            >
              {en ? 'or jump to exercise 1' : 'hoặc vào thẳng bài 1'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Chưa có bộ (hoặc lỗi mạng): vẫn hiện, trỏ track gần nhất.
  const goiY = bo?.goiY ?? null;
  const ve = thamSoVe(duongVe, nhan);
  return (
    <div className={khung}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          {tieuDe}
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-text-secondary">
            <Hourglass className="h-3.5 w-3.5 text-amber-500" />
            {en ? 'The practice set for this lesson is being written.' : 'Bài luyện của bài này đang soạn.'}
            {goiY && (en ? ` Warm up meanwhile on ${goiY.trackName}:` : ` Trong lúc chờ, luyện tạm ở ${goiY.trackName}:`)}
          </p>
          {goiY && goiY.items.length > 0 && (
            <ul className="mt-1.5 flex flex-wrap gap-1.5">
              {goiY.items.map((it) => (
                <li key={it.slug}>
                  <Link
                    href={`/code-lab/${encodeURIComponent(goiY.trackSlug)}/${encodeURIComponent(it.slug)}?${ve}`}
                    className="inline-block max-w-[18rem] truncate rounded-lg border border-darkborder bg-darkcard px-2 py-1 text-xs text-text-secondary hover:text-text-primary"
                    title={it.title}
                  >
                    <span className={NHAN_DO_KHO[it.difficulty]?.cls}>●</span> {it.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Link
          href={goiY ? `/code-lab/${encodeURIComponent(goiY.trackSlug)}?${ve}` : `/code-lab?${ve}`}
          className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/50 px-3.5 py-2 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-500/10"
        >
          {goiY ? goiY.trackName : 'Code Lab'} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
