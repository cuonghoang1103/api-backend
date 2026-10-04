/**
 * Logo CuongThai — CÙNG dấu hiệu với app iOS (`ios-app/.../LogoCuongThai.swift`,
 * 04/10/2026): chữ "CT" vẽ bằng MỘT nét liền (gạch ngang chữ T → chữ C ôm trái và
 * dưới → thân T dựng lên), dải màu thương hiệu tím → hồng.
 *
 * Người dùng: "dùng logo như App iOS, chữ hiệu ứng luôn chạy sáng liên tục". Nên
 * khác bản iOS (chỉ sáng khi bấm): một vệt sáng CHẠY VÒNG dọc nét không ngừng, và
 * chữ "CuongThai" có dải sáng lướt qua. `prefers-reduced-motion` ⇒ đứng yên.
 *
 * Toạ độ 100×100 chép nguyên từ `NetLogo` của iOS để hai app cùng một hình.
 */
const NET = 'M90 26 L40 26 C22 26 12 38 12 58 C12 80 38 92 66 92 L66 26';

export function LogoCuongThai({ coChu = true, phu }: { coChu?: boolean; phu?: string }) {
  return (
    <span className="ct-logo">
      <svg className="ct-logo-dau" viewBox="0 0 100 100" aria-hidden>
        <defs>
          <linearGradient id="ct-logo-mau" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8C5AF0" />
            <stop offset="1" stopColor="#F472B6" />
          </linearGradient>
        </defs>
        {/* Nét nền — luôn thấy. */}
        <path d={NET} pathLength={100} className="ct-logo-nen" />
        {/* Vệt sáng chạy vòng: quầng mờ + nét sắc. */}
        <path d={NET} pathLength={100} className="ct-logo-sang ct-logo-quang" />
        <path d={NET} pathLength={100} className="ct-logo-sang" />
      </svg>
      {coChu && (
        <span className="ct-logo-chu">
          <strong>CuongThai</strong>
          {phu && <small>{phu}</small>}
        </span>
      )}
    </span>
  );
}
