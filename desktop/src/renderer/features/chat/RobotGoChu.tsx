/**
 * ============================================================
 * ROBOT NGỒI GÕ "Welcome to CuongMini AI" — đầu trang AI (26/09/2026)
 * ============================================================
 *
 * Người dùng: *"thay chỗ `~/ai ❯ Trợ lý AI` bằng con robot gõ chữ mãi như con
 * robot ở trang / trên web — chỉ ngồi gõ thôi, không cần đá bóng. Làm nho nhỏ
 * thôi đừng to như trên web, để không gian làm việc cho thoải mái."*
 *
 * ─── CHÉP HÌNH TỪ WEB, KHÔNG CHÉP TIMELINE ───
 * Hình robot (toạ độ, góc 3/4, gáy, mặt nạ) lấy NGUYÊN từ
 * `frontend/src/components/home/landing/LandingRobotRail.tsx` để là CÙNG một
 * nhân vật. Nhưng timeline 48 giây hai cảnh của web thì không: ở đây robot
 * NGỒI SẴN (tư thế đọc từ mốc 51–78% của `globals.css` — đùi −86°/−78°, thân
 * nghiêng 9°, đầu cúi 14°), chỉ còn một vòng ngắn:
 *
 *   0 → 38%   gõ từng ký tự (tay gõ nhịp 0,3s, mắt nhìn màn hình)
 *   38 → 72%  dừng: tay nghỉ, ngẩng đầu nhìn dòng chữ, gật một cái
 *   72 → 84%  xoá lùi
 *   84 → 100% nghỉ rồi gõ lại
 *
 * ─── LUẬT GIỮ KHI SỬA ───
 *   · Chỉ `transform` và `opacity` (giống web) — không đụng bố cục mỗi khung.
 *   · Đổi CHUỖI thì đổi cả `SO_KY_TU` (số bước `steps()`) và `textLength`:
 *     cửa sổ trượt nhảy đúng mép từng ký tự nhờ bề rộng bị ÉP cứng.
 *   · Vòng con (0,3s gõ, 0,8s nháy con trỏ) không cần chia hết vòng lớn: chúng
 *     chạy độc lập và chỉ bật/tắt bằng opacity theo vòng lớn.
 *   · Tắt hết khi hệ thống bật "giảm chuyển động": hiện sẵn cả dòng chữ.
 */
const CHU_DAU = 'Welcome to ';
const CHU_NHAN = 'CuongMini AI';
/** Tổng số ký tự — PHẢI khớp `steps()` trong CSS (`--rgc-buoc`). */
export const SO_KY_TU = (CHU_DAU + CHU_NHAN).length;

export function RobotGoChu({ title }: { title?: string }) {
  return (
    <div className="ct-rgc" title={title} style={{ ['--rgc-buoc' as string]: SO_KY_TU }}>
      <svg className="ct-rgc-svg" viewBox="252 14 262 56" focusable="false" aria-hidden="true">
        <defs>
          <clipPath id="rgc-chu">
            <rect className="rgc-mat-na" x="316" y="24" width="190" height="20" />
          </clipPath>
          <linearGradient id="rgc-vo" gradientUnits="userSpaceOnUse" x1="264" y1="2" x2="298" y2="62">
            <stop offset="0" stopColor="var(--rgc-lit)" />
            <stop offset="0.55" stopColor="var(--rgc-mid)" />
            <stop offset="1" stopColor="var(--rgc-dim)" />
          </linearGradient>
          <linearGradient id="rgc-canh" gradientUnits="userSpaceOnUse" x1="284" y1="6" x2="296" y2="52">
            <stop offset="0" stopColor="var(--rgc-side)" />
            <stop offset="1" stopColor="var(--rgc-panel)" />
          </linearGradient>
          <linearGradient id="rgc-kinh" gradientUnits="userSpaceOnUse" x1="274" y1="12" x2="290" y2="23">
            <stop offset="0" stopColor="var(--rgc-visor)" />
            <stop offset="1" stopColor="var(--rgc-panel)" />
          </linearGradient>
          <linearGradient id="rgc-man" gradientUnits="userSpaceOnUse" x1="283" y1="47" x2="295" y2="60">
            <stop offset="0" stopColor="var(--rgc-glass)" />
            <stop offset="1" stopColor="var(--rgc-panel)" />
          </linearGradient>
        </defs>

        {/* Mặt sàn + bóng đổ */}
        <path className="rgc-san" d="M256 66.4h60" />
        <ellipse className="rgc-bong" cx="284" cy="65.6" rx="17" ry="2.2" />

        {/* Tư thế ngồi: hạ cả người 16 đơn vị (mốc `lt-lift` 51–78% của web). */}
        <g transform="translate(0 16)">
          <g className="rgc-than" style={{ transformOrigin: '280px 66px' }}>
            {/* Chân sau */}
            <g transform="rotate(-78 275 46)" opacity="0.78">
              <rect className="rgc-tam rgc-toi" x="271.2" y="45" width="7.6" height="12" rx="3.4" />
              <g transform="rotate(-4 275 56.5)">
                <rect className="rgc-tam rgc-toi" x="271.6" y="55.5" width="6.8" height="10" rx="3" />
                <rect className="rgc-tam rgc-toi" x="270.4" y="61.6" width="11.6" height="4.4" rx="1.8" />
              </g>
            </g>
            {/* Tay sau */}
            <g transform="rotate(-27 272.5 32)" opacity="0.78">
              <rect className="rgc-tam rgc-toi" x="269.4" y="31" width="6.2" height="12" rx="3" />
              <g transform="rotate(-37 272.5 42.5)">
                <rect className="rgc-tam rgc-toi" x="269.7" y="41.5" width="5.6" height="10" rx="2.8" />
                <rect className="rgc-tam rgc-toi rgc-tay-nghi" x="269" y="49.8" width="7" height="4.6" rx="1.8" />
              </g>
            </g>
            {/* Thân */}
            <g>
              <rect className="rgc-tam rgc-sang" x="267.5" y="28" width="25" height="19" rx="5" />
              <path className="rgc-canh" d="M285.5 28h2a5 5 0 0 1 5 5v9a5 5 0 0 1-5 5h-2z" />
              <rect className="rgc-tam rgc-dai" x="268.5" y="42.6" width="23" height="4.6" rx="2.1" />
              <circle className="rgc-long-vien" cx="281.4" cy="35" r="4.4" />
              <circle className="rgc-long" cx="281.4" cy="35" r="2.1" />
              <rect className="rgc-tam rgc-toi" x="275.5" y="24.6" width="9" height="5" rx="1.8" />
            </g>
            {/* Đầu — góc 3/4 nhìn sang phải (giống hệt web) */}
            <g className="rgc-dau" style={{ transformOrigin: '280px 27px' }}>
              <path className="rgc-anten" d="M270.4 11 267.8 5.2" />
              <circle className="rgc-anten-den" cx="267.4" cy="3.8" r="2.2" />
              <rect className="rgc-tam rgc-gay" x="265.9" y="10.6" width="9.8" height="14" rx="3.2" />
              <rect className="rgc-tam rgc-toi" x="262" y="14" width="4.6" height="7.6" rx="1.6" />
              <rect className="rgc-tam rgc-sang" x="271" y="8" width="22" height="19" rx="5" />
              <path className="rgc-canh" d="M287.4 8h.6a5 5 0 0 1 5 5v9a5 5 0 0 1-5 5h-.6z" />
              <rect className="rgc-kinh" x="274.6" y="12.6" width="15.8" height="9.4" rx="3" />
              <g className="rgc-nhin">
                <rect className="rgc-mat" x="277.2" y="15.1" width="3.4" height="4.5" rx="1.2" style={{ transformOrigin: '278.9px 17.35px' }} />
                <rect className="rgc-mat" x="283.4" y="14.8" width="4.6" height="5" rx="1.5" style={{ transformOrigin: '285.7px 17.3px' }} />
              </g>
              <path className="rgc-bong-kinh" d="M276.4 22 282 12.6h2.8L279.2 22z" />
            </g>
            {/* Tay trước */}
            <g transform="rotate(14 288 32)">
              <rect className="rgc-tam rgc-sang" x="284.9" y="31" width="6.2" height="12" rx="3" />
              <g transform="rotate(-84 288 42.5)">
                <rect className="rgc-tam rgc-sang" x="285.2" y="41.5" width="5.6" height="10" rx="2.8" />
                <rect className="rgc-tam rgc-sang rgc-tay-nghi" x="284.5" y="49.8" width="7" height="4.6" rx="1.8" />
              </g>
            </g>
            {/* Chân trước */}
            <g transform="rotate(-86 285.5 46)">
              <rect className="rgc-tam rgc-sang" x="281.7" y="45" width="7.6" height="12" rx="3.4" />
              <g transform="rotate(-2 285.5 56.5)">
                <rect className="rgc-tam rgc-sang" x="282.1" y="55.5" width="6.8" height="10" rx="3" />
                <rect className="rgc-tam rgc-sang" x="280.9" y="61.6" width="11.6" height="4.4" rx="1.8" />
              </g>
            </g>
          </g>
        </g>

        {/* Laptop trên đùi (toạ độ đã ở tư thế ngồi, như web) */}
        <g>
          <path className="rgc-may-de" d="M281 64.2h18.4l-2.6-3h-13.2z" />
          <rect className="rgc-may-vo" x="282.4" y="46" width="15.6" height="15.6" rx="1.6" />
          <rect className="rgc-may-man" x="283.7" y="47.3" width="13" height="13" rx="0.8" fill="url(#rgc-man)" />
          <path className="rgc-ma rgc-ma-1" d="M285 50.2h5.6" />
          <path className="rgc-ma rgc-ma-2" d="M285 53.1h8.6" />
          <path className="rgc-ma rgc-ma-3" d="M286.6 56h6.4" />
          <path className="rgc-ma rgc-ma-4" d="M286.6 58.9h8" />
          <g className="rgc-tay-go rgc-tay-go-sau">
            <rect className="rgc-tam rgc-toi" x="282.5" y="59.7" width="7" height="4.6" rx="1.8" />
          </g>
          <g className="rgc-tay-go rgc-tay-go-truoc">
            <rect className="rgc-tam rgc-sang" x="290.7" y="59.7" width="7" height="4.6" rx="1.8" />
          </g>
        </g>

        {/* Dòng chữ gõ ra. `textLength` ÉP bề rộng ⇒ mỗi ký tự đúng 190/23
            đơn vị, `steps()` rơi trúng mép từng chữ kể cả khi font dự phòng. */}
        <path className="rgc-gach" d="M316 46.5h190" />
        <text
          className="rgc-chu"
          x="316"
          y="40"
          textLength="190"
          lengthAdjust="spacingAndGlyphs"
          clipPath="url(#rgc-chu)"
        >{CHU_DAU}<tspan className="rgc-chu-nhan">{CHU_NHAN}</tspan></text>
        <rect className="rgc-con-tro" x="316.6" y="28" width="1.8" height="14" rx="0.4" />
      </svg>
    </div>
  );
}
