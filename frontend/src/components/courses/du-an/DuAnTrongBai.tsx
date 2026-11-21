'use client';
/**
 * Cắm vào trang học (LearnPageClient) ngay dưới nội dung bài: đọc vai trò của bài trong dự án của khoá
 * (`duAn.bai.dangKy` / `duAn.moc[].slug` / `duAn.bai.baoVe`) rồi vẽ đúng khối. Khoá không có dự án hoặc bài không có
 * vai trò ⇒ không vẽ gì (và không làm gì thêm ngoài một GET dùng chung cho cả trang).
 */
import { Loader2 } from 'lucide-react';
import { vaiTroBai } from '@/lib/duAn';
import { chuDuAn } from './chu';
import KhoiBaoVe from './KhoiBaoVe';
import KhoiDangKyDeTai from './KhoiDangKyDeTai';
import KhoiNopMoc from './KhoiNopMoc';
import { useDuAn } from './useDuAn';
import { MoiDangNhap, NutPhu, The } from './ui';

export default function DuAnTrongBai({
  courseSlug, lessonSlug, locale, onXongMoc, denBai,
}: {
  courseSlug: string;
  lessonSlug: string | null | undefined;
  locale: 'en' | 'vi';
  /** Giữ cho tương thích chữ ký — KHÔNG dùng để gác (xem chú thích dưới). */
  daDangNhap?: boolean;
  onXongMoc?: () => void;
  denBai?: (lessonSlug: string) => void;
}) {
  const { data, dangTai, loi, taiLai, dat } = useDuAn(courseSlug);
  const t = chuDuAn(locale);
  const vaiTro = vaiTroBai(data?.duAn, lessonSlug);

  if (!data) {
    if (loi) {
      return (
        <The><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-text-muted">{t.loiTai}</p><NutPhu onClick={() => void taiLai()}>{t.thuLai}</NutPhu></div></The>
      );
    }
    return dangTai ? <p className="mb-8 flex items-center gap-2 text-sm text-text-muted"><Loader2 className="h-4 w-4 animate-spin" aria-hidden />{t.dangTai}</p> : null;
  }
  if (!data.coDuAn || !vaiTro) return null;
  // Nguồn sự thật là MÁY CHỦ: `cuaToi` chỉ có khi cookie đăng nhập hợp lệ. KHÔNG gác bằng `daDangNhap` (kho Zustand
  // ở trình duyệt có thể lệch cookie — đúng lỗi trang học từng kẹt, xem LearnPageClient). Phiên hết giữa chừng ⇒ mời đăng nhập.
  if (!data.cuaToi) {
    return <The><MoiDangNhap locale={locale} chu={t} /></The>;
  }
  if (vaiTro.loai === 'dangKy') return <KhoiDangKyDeTai slug={courseSlug} data={data} locale={locale} onData={dat} />;
  if (vaiTro.loai === 'moc') {
    return <KhoiNopMoc slug={courseSlug} data={data} moc={vaiTro.moc} locale={locale} onData={dat} onXong={onXongMoc} denBai={denBai} />;
  }
  return <KhoiBaoVe slug={courseSlug} data={data} locale={locale} taiLai={taiLai} />;
}
