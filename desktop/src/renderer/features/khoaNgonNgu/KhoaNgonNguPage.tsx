/**
 * JP và CH — hai mục RIÊNG trên thanh bên, ngay dưới IELTS (05/10/2026).
 * Người dùng: "dựa vào bản IELTS… làm 1 ngôn ngữ nữa là Nhật và Trung, tách riêng
 * như IELTS, all chức năng như IELTS". Cùng cách với IeltsPage: dùng lại trang khoá
 * học của web (components/sach-hoc) qua TrangWebTheoTuyen.
 *
 *   /jp           → khoá JP (tiếng Nhật 0 → N1)      = web /language/ja/jp
 *   /jp/tren-lop  → Bài giảng trên lớp (Dekiru)      = web /language/ja/dekiru
 *   /ch           → khoá CH (tiếng Trung 0 → HSK 6) = web /language/zh/ch
 * Link web trong khoá được shim `doiDuongApp` đổi về đúng mục này.
 */
import type { ComponentProps, Ref } from 'react';
import { forwardRef } from 'react';
import type { LucideIcon, LucideProps } from 'lucide-react';
import { TrangWebTheoTuyen } from '../web/TrangWeb';
import { KhungVideo } from '../academy/KhungVideo';

(globalThis as { __CT_KHUNG_VIDEO__?: unknown }).__CT_KHUNG_VIDEO__ = KhungVideo;

function KhoaNgonNgu({ ten }: { ten: string }) {
  // Khung không cuộn mang container `ctnoidung` — cùng lý do như IeltsPage (đo vùng nội dung, lớp phủ fixed).
  return (
    <div className="ct-ielts-khung">
      <TrangWebTheoTuyen ten={ten} />
    </div>
  );
}
export function JpPage() { return <KhoaNgonNgu ten="JP" />; }
export function ChPage() { return <KhoaNgonNgu ten="CH" />; }

/** Biểu tượng chữ (あ / 中) cùng kiểu với icon lucide của thanh bên. */
function bieuTuongChu(chu: string): LucideIcon {
  const C = forwardRef(function BieuTuongChu({ size = 24, color = 'currentColor', strokeWidth: _s, absoluteStrokeWidth: _a, ...rest }: LucideProps, ref: Ref<SVGSVGElement>) {
    void _s; void _a;
    return (
      <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" {...(rest as ComponentProps<'svg'>)}>
        <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke={color} strokeWidth="1.8" />
        <text x="12" y="16.6" textAnchor="middle" fontSize="12.5" fontWeight="700" fill={color} fontFamily="'Hiragino Sans','PingFang SC','Noto Sans CJK JP',sans-serif">{chu}</text>
      </svg>
    );
  });
  return C as unknown as LucideIcon;
}
export const IconJp = bieuTuongChu('あ');
export const IconCh = bieuTuongChu('中');
