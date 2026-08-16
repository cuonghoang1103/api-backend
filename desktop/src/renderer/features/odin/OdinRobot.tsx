/**
 * Odin — trợ lý của app, vẽ hoàn toàn bằng SVG nội tuyến.
 *
 * Nhân vật dựng theo bản thiết kế của chủ dự án: đầu dạng đám mây, mặt là một
 * màn hình tối với hai mắt xanh lam-lục, thân mang dấu nhắc `>_`. Cùng nhân vật
 * với con robot ESP32 tên Odin trong `firmware/mini-me-robot`.
 *
 * ─── TỈ LỆ (bản vẽ lại 16/08/2026) ───
 * Bản đầu bị chê "gầy, không cân đối, không dễ thương" — và đúng. Nguyên nhân
 * là tôi vẽ theo tỉ lệ người: đầu nhỏ, thân dài. Nhân vật dễ thương đi theo tỉ
 * lệ CHIBI, và ba con số quyết định điều đó:
 *
 *   • đầu chiếm ~58% chiều cao (người thật: ~13%)
 *   • đầu RỘNG gấp ~1,9 lần thân — thân càng nhỏ so với đầu càng "baby"
 *   • tay chân NGẮN và MẬP, bo tròn hết cỡ; chi dài mảnh đọc ra "người lớn"
 *
 * Vì sao SVG chứ không phải ảnh: không phụ thuộc file từ xa (CSP chặn, và mất
 * mạng là mất robot), đổi màu theo chủ đề chỉ bằng biến CSS, nét sắc ở mọi mức
 * zoom, và animation chạy bằng transform/opacity nên GPU lo.
 *
 * KHÔNG dùng `<script>` hay `<foreignObject>` bên trong SVG — cả hai là đường
 * chạy mã.
 */
import type { OdinMood } from './useOdin';

/** Bộ mắt. Mắt mang toàn bộ biểu cảm, nên mỗi trạng thái một hình dạng riêng. */
function Eyes({
  mood,
  blinking,
  happy,
}: {
  mood: OdinMood;
  blinking: boolean;
  happy: boolean;
}) {
  // Nháy mắt đè lên mọi biểu cảm: nhắm là nhắm, bất kể đang vui hay lo.
  if (blinking || mood === 'ngu') {
    return (
      <>
        <rect x="54" y="76" width="22" height="5" rx="2.5" fill="var(--odin-eye)" />
        <rect x="92" y="76" width="22" height="5" rx="2.5" fill="var(--odin-eye)" />
      </>
    );
  }

  if (happy || mood === 'vui') {
    // Mắt cười hình vòng cung ngược + hai má ửng. Má là chi tiết nhỏ nhưng nó
    // làm khác biệt lớn nhất giữa "robot đang cười" và "robot dễ thương".
    return (
      <>
        <path d="M54 82 Q65 66 76 82" stroke="var(--odin-eye)" strokeWidth="6"
          strokeLinecap="round" fill="none" />
        <path d="M92 82 Q103 66 114 82" stroke="var(--odin-eye)" strokeWidth="6"
          strokeLinecap="round" fill="none" />
        <ellipse cx="47" cy="88" rx="7" ry="4.5" fill="var(--odin-eye)" opacity="0.32" />
        <ellipse cx="121" cy="88" rx="7" ry="4.5" fill="var(--odin-eye)" opacity="0.32" />
      </>
    );
  }

  if (mood === 'lo') {
    // Mí xếch VÀO TRONG + mắt nhỏ lại: lo lắng, KHÔNG phải giận. Robot báo lỗi
    // mà trông hung hăng thì người dùng thấy như bị mắng.
    return (
      <>
        <rect x="56" y="76" width="18" height="13" rx="6.5" fill="var(--odin-eye)" />
        <rect x="94" y="76" width="18" height="13" rx="6.5" fill="var(--odin-eye)" />
        <path d="M52 66 L76 72" stroke="var(--odin-eye)" strokeWidth="4" strokeLinecap="round" />
        <path d="M116 66 L92 72" stroke="var(--odin-eye)" strokeWidth="4" strokeLinecap="round" />
      </>
    );
  }

  if (mood === 'nghe') {
    // Mắt mở to tròn + chấm sáng: dáng đang chú ý nghe.
    return (
      <>
        <rect x="54" y="68" width="22" height="26" rx="11" fill="var(--odin-eye)" />
        <rect x="92" y="68" width="22" height="26" rx="11" fill="var(--odin-eye)" />
        <circle cx="65" cy="76" r="4" fill="var(--odin-screen)" opacity="0.5" />
        <circle cx="103" cy="76" r="4" fill="var(--odin-screen)" opacity="0.5" />
      </>
    );
  }

  if (mood === 'nghi') {
    // Liếc sang một bên — dáng đang nghĩ.
    return (
      <>
        <rect x="59" y="72" width="19" height="19" rx="9.5" fill="var(--odin-eye)" />
        <rect x="97" y="72" width="19" height="19" rx="9.5" fill="var(--odin-eye)" />
      </>
    );
  }

  // Bình thường: mắt bo tròn kiểu ngái ngủ, đúng như bản thiết kế gốc.
  return (
    <>
      <path d="M54 74 h22 a2.5 2.5 0 0 1 2.5 2.5 v4 a13.5 13.5 0 0 1 -27 0 v-4 a2.5 2.5 0 0 1 2.5 -2.5 z"
        fill="var(--odin-eye)" />
      <path d="M92 74 h22 a2.5 2.5 0 0 1 2.5 2.5 v4 a13.5 13.5 0 0 1 -27 0 v-4 a2.5 2.5 0 0 1 2.5 -2.5 z"
        fill="var(--odin-eye)" />
    </>
  );
}

export function OdinRobot({
  mood,
  blinking,
  hovering = false,
  size = 104,
}: {
  mood: OdinMood;
  blinking: boolean;
  /** Con trỏ đang ở trên robot — mặt vui và tay giơ lên như đang bay. */
  hovering?: boolean;
  size?: number;
}) {
  return (
    <svg
      className="odin-svg"
      width={size}
      height={size * 0.98}
      viewBox="0 0 168 165"
      // Robot là hình trang trí; ý nghĩa nằm ở nút bọc ngoài (có aria-label).
      aria-hidden
      focusable="false"
    >
      {/* ── Chân: NGẮN, MẬP, sát nhau ─────────────────────
          Vẽ trước thân để thân đè lên phần trên của chân — không có chỗ nối lộ. */}
      <g className="odin-legs">
        <rect className="odin-leg odin-leg-left" x="62" y="130" width="19" height="20" rx="9.5"
          fill="var(--odin-body-light)" />
        <rect className="odin-leg odin-leg-right" x="87" y="130" width="19" height="20" rx="9.5"
          fill="var(--odin-body-light)" />
      </g>

      {/* ── Thân: NHỎ hơn đầu nhiều, mập và bo mạnh ──────── */}
      <g className="odin-body">
        <rect x="52" y="103" width="64" height="36" rx="17" fill="var(--odin-body)" />
        {/* Ô nhắc lệnh `>_` — chi tiết nhận diện của nhân vật. */}
        <rect x="62" y="111" width="44" height="21" rx="8" fill="var(--odin-screen)" />
        <path d="M70 117 l5 4 l-5 4" stroke="var(--odin-eye)" strokeWidth="3"
          strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="80" y="123" width="14" height="3" rx="1.5" fill="var(--odin-eye)" />
      </g>

      {/* ── Đầu: TO, rộng, dạng mây ───────────────────────
          Chiếm phần lớn khung hình. Đây là chi tiết quyết định "dễ thương". */}
      <g className="odin-head">
        <path
          d="M30 62
             a26 26 0 0 1 20 -32
             a30 30 0 0 1 30 -18
             a30 30 0 0 1 30 16
             a26 26 0 0 1 26 30
             a24 24 0 0 1 -12 34
             h-84
             a24 24 0 0 1 -10 -30 z"
          fill="var(--odin-body-light)"
        />
        {/* Vệt sáng trên đầu — cho khối tròn có chiều sâu thay vì phẳng lì. */}
        <path d="M42 46 a20 20 0 0 1 17 -18 a22 22 0 0 1 15 4"
          stroke="var(--odin-highlight)" strokeWidth="5.5" strokeLinecap="round"
          fill="none" opacity="0.55" />

        {/* Màn hình mặt — lớn, chiếm gần hết bề ngang đầu. */}
        <rect x="40" y="50" width="88" height="54" rx="20" fill="var(--odin-screen)" />
        <rect x="40" y="50" width="88" height="54" rx="20"
          fill="none" stroke="var(--odin-outline)" strokeWidth="3" />
        <Eyes mood={mood} blinking={blinking} happy={hovering} />
      </g>

      {/* ── Tay: stub ngắn, bo tròn hết cỡ ─────────────────
          Vẽ SAU đầu là bắt buộc. Khi giơ lên (rê chuột), tay xoay tới ngang
          tầm đầu — vẽ trước đầu thì chúng chui ra sau và BIẾN MẤT hoàn toàn.
          Đã dính đúng lỗi này ở bản đầu: robot "bay" mà không có tay. */}
      <g className="odin-arms">
        <rect className="odin-arm odin-arm-left" x="36" y="104" width="18" height="31" rx="9"
          fill="var(--odin-body-light)" />
        <rect className="odin-arm odin-arm-right" x="114" y="104" width="18" height="31" rx="9"
          fill="var(--odin-body-light)" />
      </g>

      {/* Bóng đổ — co lại khi robot bay lên, nên cảm giác "nổi" rõ hơn hẳn. */}
      <ellipse className="odin-shadow" cx="84" cy="157" rx="30" ry="5.5"
        fill="var(--odin-outline)" opacity="0.22" />
    </svg>
  );
}
