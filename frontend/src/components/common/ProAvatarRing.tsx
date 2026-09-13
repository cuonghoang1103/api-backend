'use client';

/**
 * Khung động cho avatar của thành viên PRO.
 * ─────────────────────────────────────────────────────────────────────────
 * Bọc quanh một avatar bất kỳ: viền gradient xoay + huy hiệu vương miện ở
 * góc. Dùng ở bình luận, nhưng không gắn chặt vào bình luận — chỗ nào có
 * avatar đều bọc được.
 *
 * ⚠️ KHÔNG hiện gì khi `isPro` sai. Trả thẳng `children` chứ không bọc một
 * lớp `<span>` rỗng: bọc thừa sẽ đổi layout của mọi avatar thường trên web
 * chỉ vì một tính năng mà đa số không có.
 *
 * ⚠️ Viền xoay bằng `@property --goc` + `conic-gradient`. Cách này chạy trên
 * luồng hợp thành (compositor) nên mượt và gần như không tốn CPU, khác hẳn
 * animation đổi `background-image` từng khung. Trình duyệt không hỗ trợ
 * `@property` (Firefox cũ) sẽ hiện viền TĨNH — vẫn đẹp, chỉ không xoay; đó
 * là suy biến có chủ ý, không phải lỗi.
 *
 * ⚠️ `prefers-reduced-motion`: dừng xoay. Một cái viền quay không ngừng ngay
 * cạnh chữ là thứ gây mệt mắt nhất trong một trang đầy bình luận.
 */
import { Crown } from 'lucide-react';

/** CSS dùng chung — nhúng MỘT lần cho cả trang, không phải mỗi avatar. */
const CSS_KHUNG = `
@property --pro-goc {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
@keyframes proXoayVien { to { --pro-goc: 360deg; } }
@keyframes proNhipHuyHieu {
  0%, 100% { transform: scale(1);    box-shadow: 0 0 0 0 rgba(251,191,36,.55); }
  50%      { transform: scale(1.08); box-shadow: 0 0 0 4px rgba(251,191,36,0); }
}
.pro-vien {
  background: conic-gradient(
    from var(--pro-goc),
    #f59e0b, #fbbf24, #a78bfa, #22d3ee, #a78bfa, #fbbf24, #f59e0b
  );
  animation: proXoayVien 4s linear infinite;
}
.pro-huy-hieu { animation: proNhipHuyHieu 2.6s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .pro-vien, .pro-huy-hieu { animation: none !important; }
}
`;

/** Bề dày viền theo cỡ avatar. Avatar nhỏ mà viền dày thì nuốt mất mặt người. */
const DAY: Record<NonNullable<Props['size']>, number> = { sm: 1.5, md: 2, lg: 2.5 };
const CO_HUY_HIEU: Record<NonNullable<Props['size']>, string> = {
  sm: 'w-3 h-3 -right-0.5 -bottom-0.5',
  md: 'w-4 h-4 -right-1 -bottom-1',
  lg: 'w-5 h-5 -right-1 -bottom-1',
};

interface Props {
  /** Sai → không bọc gì cả, trả thẳng children. */
  isPro?: boolean | null;
  size?: 'sm' | 'md' | 'lg';
  /** Tắt huy hiệu vương miện, chỉ giữ viền (chỗ chật). */
  hideBadge?: boolean;
  children: React.ReactNode;
}

export default function ProAvatarRing({ isPro, size = 'sm', hideBadge = false, children }: Props) {
  if (!isPro) return <>{children}</>;
  const day = DAY[size];

  return (
    <span className="relative inline-flex shrink-0" title="Thành viên PRO">
      <style>{CSS_KHUNG}</style>
      {/* Viền: một lớp gradient xoay, avatar nằm trên nền tối đè lên giữa —
          rẻ hơn nhiều so với vẽ vòng bằng SVG stroke. */}
      <span
        className="pro-vien inline-flex items-center justify-center rounded-full"
        style={{ padding: day }}
      >
        <span className="inline-flex rounded-full bg-[#0b0b12] p-[1px]">{children}</span>
      </span>

      {hideBadge || size === 'sm' ? null : (
        <span
          className={`pro-huy-hieu absolute ${CO_HUY_HIEU[size]} rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center ring-2 ring-[#0b0b12]`}
          aria-hidden="true"
        >
          <Crown className="w-[60%] h-[60%] text-black" strokeWidth={2.5} />
        </span>
      )}
      <span className="sr-only">Thành viên PRO</span>
    </span>
  );
}

/**
 * Nhãn chữ "PRO" đặt cạnh TÊN người bình luận.
 *
 * Viền avatar dễ bị bỏ qua khi lướt nhanh; một nhãn chữ ngay sau tên thì
 * không. Hai thứ bù cho nhau, không thừa.
 */
export function ProTag({ isPro, className = '' }: { isPro?: boolean | null; className?: string }) {
  if (!isPro) return null;
  return (
    <span
      className={`inline-flex items-center gap-0.5 px-1.5 py-[1px] rounded-full text-[9px] font-bold tracking-wide
                  bg-gradient-to-r from-amber-400/25 to-violet-500/25
                  text-amber-300 border border-amber-400/30 align-middle ${className}`}
      title="Thành viên PRO"
    >
      <Crown className="w-2.5 h-2.5" strokeWidth={2.5} />
      PRO
    </span>
  );
}
