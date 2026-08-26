/**
 * ROBOT TRÊN THANH HEADER — HAI CẢNH, một vòng 48 giây.
 *
 *   Cảnh 1 (0→34,5%)  đá bóng: trồi lên → rê bóng → sút → ăn mừng → quay
 *                     người → đi ngược về cửa → chui xuống.
 *   Cảnh 2 (41→92%)   gõ code: trồi lên (ôm laptop) → ngồi bệt xuống thanh →
 *                     mở nắp → gõ đợt 1 → dừng ngẩng đầu nghĩ → gõ đợt 2 →
 *                     gật đầu → gập máy, đứng dậy → vẫy tay → chui xuống.
 *
 * ─── VÌ SAO CÓ BẢN NÀY (26/08/2026, lần 2) ───────────────────────────────────
 * Bản một cảnh bị chê đúng một điểm nữa: **mặt robot lúc nào cũng hướng thẳng
 * ra người xem**, kể cả lúc nó đi ngược lại. Đây KHÔNG phải lỗi hoạt hình mà
 * là lỗi VẼ: mặt nạ cũ là một hình chữ nhật ĐỐI XỨNG nằm chính giữa đầu, hai
 * mắt cân nhau. Một hình đối xứng thì `scaleX(-1)` cho ra đúng chính nó —
 * nghĩa là cả cú lật người chỉ đổi được hướng chân tay, còn cái đầu thì mãi
 * mãi nhìn vào ống kính.
 *
 * Nay đầu vẽ ở GÓC 3/4 nhìn sang phải, và chỗ sửa nằm ở BA thứ bất đối xứng:
 *   · GÁY — một khối tối thò ra ở phía SAU (bên trái). Đây là cái nói cho mắt
 *     biết "sau đầu ở đằng kia", mạnh hơn mọi thứ khác cộng lại.
 *   · MẶT NẠ dời hẳn về phía trước, sát mép trước của đầu; mắt xa (trái) nhỏ
 *     và hẹp hơn mắt gần (phải) — đó là phối cảnh, không phải trang trí.
 *   · MỘT tai duy nhất, nằm ở gáy; ăng-ten mọc từ gáy và ngả về sau.
 * Ba thứ đó đều lật theo `scaleX`, nên quay người là quay mặt theo thật.
 *
 * ─── HAI CẢNH TRÊN MỘT TIMELINE, KHÔNG PHẢI HAI ROBOT ────────────────────────
 * Cả hai cảnh dùng CHUNG một bộ xương. Nhân đôi bộ xương ra thì nhẹ đầu lúc
 * viết nhưng sau này sửa hình phải sửa hai chỗ, và hai bộ animation cùng chạy
 * kể cả khi một bộ đang ẩn. Nên: một vòng 48s, cảnh 1 chiếm nửa đầu, cảnh 2
 * nửa sau, mỗi khớp có mốc cho cả hai. Chỉ những thứ RIÊNG của một cảnh mới
 * thêm phần tử mới — quả bóng (cảnh 1) và cái laptop (cảnh 2) — và chúng tắt
 * bằng `opacity` ở cảnh kia.
 *
 * Ngồi gõ máy tái dùng đúng bộ chân đá bóng: `lt-lift` hạ cả người xuống 16
 * đơn vị, đùi xoay −86° (duỗi ngang ra trước), cẳng chân gần thẳng — thành ra
 * tư thế ngồi bệt duỗi chân, laptop đặt lên đùi.
 *
 * ─── BA THỦ THUẬT LÀM NÊN CẢNH NÀY ───────────────────────────────────────────
 *   · `clipPath#lt-above-rail` xén ĐÚNG tại đường kẻ (y=66). Nhờ vậy chỉ cần
 *     `translateY` xuống là thân bị xén dần từ chân lên đầu — mắt đọc ra "đang
 *     tụt xuống dưới sàn", chứ không phải "đang mờ đi".
 *   · Quay người bằng `scaleX: 1 → 0,14 → −1`. Bề ngang bóp về gần 0 rồi lật
 *     dấu; ở cỡ này mắt đọc y hệt một vòng xoay 3D.
 *   · Gõ phím dùng HAI BÀN TAY CHỒNG NHAU. Tay thường (`lt-hand-rest`) và tay
 *     gõ (`lt-hand-tap`) vẽ đè lên nhau, đổi vai bằng `opacity`. Lý do: nhịp gõ
 *     là vòng nhanh 0,3s, mà một phần tử chỉ nhận được MỘT animation cho mỗi
 *     thuộc tính — gắn nhịp gõ thẳng vào cẳng tay thì nó rung suốt cả cảnh đá
 *     bóng. Tách tay ra thì `opacity` (vòng 48s) và `transform` (vòng 0,3s)
 *     nằm trên hai animation khác thuộc tính, không giẫm nhau.
 *
 * ─── LUẬT GIỮ KHI SỬA TIẾP ───────────────────────────────────────────────────
 *   · Toạ độ ở đây ăn khớp CỨNG với `globals.css`: viewBox `0 -6 560 96`, mặt
 *     đất y=66, tâm x=280, cửa hầm x 254→306. Đổi số nào thì phải đổi cả
 *     `--lt-ground` và `--lt-hatch-half` bên CSS, không thì robot đứng lơ lửng.
 *   · Mọi vòng con phải CHIA HẾT 48s (0,3s · 0,75s · 2,4s · 3s) — không thì
 *     sau vài vòng nó lệch pha với timeline lớn và trông như bị giật.
 *   · CHỈ `transform` và `opacity`. Không filter, không rAF, không canvas.
 *   · Màu đi qua class trên `<stop>` (xem `.lt-stop-*` trong CSS), KHÔNG gán
 *     `stopColor` thẳng ở đây — có vậy nút đổi sáng/tối mới còn tác dụng.
 */
export default function LandingRobotRail() {
  return (
    <div className="landing-robot-rail" aria-hidden="true">
      <span className="landing-rail-line" />

      <svg className="landing-robot-scene" viewBox="0 -6 560 96" focusable="false" role="presentation">
        <defs>
          {/* Xén mọi thứ từ mặt đất trở lên. Rộng dư hai bên để nhân vật còn
              chạy được ±110 đơn vị mà không chạm mép vùng xén. */}
          <clipPath id="lt-above-rail">
            <rect x="-220" y="-90" width="1000" height="156" />
          </clipPath>

          {/* Một hướng sáng duy nhất cho cả nhân vật: trên-trái xuống dưới-phải. */}
          <linearGradient id="lt-shell" gradientUnits="userSpaceOnUse" x1="264" y1="2" x2="298" y2="62">
            <stop className="lt-stop-shell-lit" offset="0" />
            <stop className="lt-stop-shell-mid" offset="0.55" />
            <stop className="lt-stop-shell-dim" offset="1" />
          </linearGradient>

          <linearGradient id="lt-shell-side" gradientUnits="userSpaceOnUse" x1="284" y1="6" x2="296" y2="52">
            <stop className="lt-stop-side-a" offset="0" />
            <stop className="lt-stop-side-b" offset="1" />
          </linearGradient>

          <linearGradient id="lt-visor" gradientUnits="userSpaceOnUse" x1="274" y1="12" x2="290" y2="23">
            <stop className="lt-stop-visor-a" offset="0" />
            <stop className="lt-stop-visor-b" offset="1" />
          </linearGradient>

          <radialGradient id="lt-ball" gradientUnits="userSpaceOnUse" cx="322" cy="59" r="9.4" fx="318.4" fy="55.2">
            <stop className="lt-stop-ball-a" offset="0" />
            <stop className="lt-stop-ball-b" offset="0.62" />
            <stop className="lt-stop-ball-c" offset="1" />
          </radialGradient>

          <linearGradient id="lt-shaft" gradientUnits="userSpaceOnUse" x1="280" y1="66" x2="280" y2="71.6">
            <stop className="lt-stop-shaft-a" offset="0" />
            <stop className="lt-stop-shaft-b" offset="1" />
          </linearGradient>

          <linearGradient id="lt-door" gradientUnits="userSpaceOnUse" x1="280" y1="66" x2="280" y2="69.4">
            <stop className="lt-stop-door-a" offset="0" />
            <stop className="lt-stop-door-b" offset="1" />
          </linearGradient>

          <linearGradient id="lt-glass" gradientUnits="userSpaceOnUse" x1="283" y1="47" x2="295" y2="60">
            <stop className="lt-stop-glass-a" offset="0" />
            <stop className="lt-stop-glass-b" offset="1" />
          </linearGradient>
        </defs>

        {/* ── Cửa hầm: hốc tối, hai cánh trượt, vệt sáng ở mép ───────────── */}
        <g className="landing-hatch">
          <g className="landing-hatch-shaft">
            <rect x="254" y="66" width="52" height="5.6" fill="url(#lt-shaft)" />
            <path className="landing-hatch-wall" d="M254.7 66v3.4M305.3 66v3.4" />
            <path className="landing-hatch-lip" d="M254 66.4h52" />
          </g>

          <g className="landing-hatch-door landing-hatch-door-left">
            <rect x="253.4" y="66" width="26.4" height="3.4" rx="1.1" fill="url(#lt-door)" />
            <path className="landing-hatch-door-edge" d="M253.4 66.5h26.4" />
          </g>
          <g className="landing-hatch-door landing-hatch-door-right">
            <rect x="280.2" y="66" width="26.4" height="3.4" rx="1.1" fill="url(#lt-door)" />
            <path className="landing-hatch-door-edge" d="M280.2 66.5h26.4" />
          </g>

          <circle className="landing-hatch-latch" cx="280" cy="67.7" r="0.9" />
        </g>

        {/* ── Bóng đổ: nằm ngoài vùng xén vì nó thuộc về mặt sàn ─────────── */}
        <g className="landing-robot-travel">
          <ellipse className="landing-robot-shadow" cx="280" cy="65.4" rx="17" ry="2.4" />

          <g clipPath="url(#lt-above-rail)">
            <g className="landing-robot-lift">
              <g className="landing-robot-facing">
                {/* Bụi tung dưới chân. Vòng nhanh 0,75s LỒNG trong cửa sổ
                    bật/tắt của vòng 48s. Nằm trong nhóm lật mặt nên lúc đi
                    ngược về bụi cũng tung ngược lại. */}
                <g className="landing-robot-dust">
                  <g className="landing-robot-dust-puff">
                    <circle cx="268" cy="63.4" r="2.4" />
                    <circle cx="262.6" cy="64.6" r="1.6" />
                  </g>
                </g>

                <g className="landing-robot-body">
                  {/* ── Chân sau (vẽ trước để nằm sau thân) ───────────── */}
                  <g className="landing-robot-limb landing-robot-thigh-back">
                    <rect className="lt-plate lt-plate-dim" x="271.2" y="45" width="7.6" height="12" rx="3.4" />
                    <g className="landing-robot-limb landing-robot-shin-back">
                      <rect className="lt-plate lt-plate-dim" x="271.6" y="55.5" width="6.8" height="10" rx="3" />
                      <rect className="lt-plate lt-plate-dim" x="270.4" y="61.6" width="11.6" height="4.4" rx="1.8" />
                    </g>
                  </g>

                  {/* ── Tay sau ───────────────────────────────────────── */}
                  <g className="landing-robot-limb landing-robot-arm-back">
                    <rect className="lt-plate lt-plate-dim" x="269.4" y="31" width="6.2" height="12" rx="3" />
                    <g className="landing-robot-limb landing-robot-forearm-back">
                      <rect className="lt-plate lt-plate-dim" x="269.7" y="41.5" width="5.6" height="10" rx="2.8" />
                      <rect className="lt-plate lt-plate-dim lt-hand-rest" x="269" y="49.8" width="7" height="4.6" rx="1.8" />
                    </g>
                  </g>

                  {/* ── Thân ─────────────────────────────────────────── */}
                  <g className="landing-robot-torso-group">
                    <rect className="lt-plate lt-plate-lit" x="267.5" y="28" width="25" height="19" rx="5" />
                    <path className="lt-plate lt-plate-side" d="M285.5 28h2a5 5 0 0 1 5 5v9a5 5 0 0 1-5 5h-2z" />
                    <rect className="lt-plate lt-plate-belt" x="268.5" y="42.6" width="23" height="4.6" rx="2.1" />
                    <path className="landing-robot-vent" d="M270.6 39.6h7.4" />
                    <circle className="landing-robot-core-ring" cx="281.4" cy="35" r="4.4" />
                    <circle className="landing-robot-core" cx="281.4" cy="35" r="2.1" />
                    <rect className="lt-plate lt-plate-neck" x="275.5" y="24.6" width="9" height="5" rx="1.8" />
                  </g>

                  {/* ── Đầu: GÓC 3/4 nhìn sang phải ────────────────────
                      Thứ tự vẽ quan trọng: gáy TRƯỚC để nó thò ra sau mặt,
                      mặt nạ SAU CÙNG và dời hẳn về mép trước. */}
                  <g className="landing-robot-head-group">
                    <path className="landing-robot-antenna" d="M270.4 11 267.8 5.2" />
                    <circle className="landing-robot-antenna-bulb" cx="267.4" cy="3.8" r="2.2" />

                    <rect className="lt-plate lt-plate-nape" x="265.9" y="10.6" width="9.8" height="14" rx="3.2" />
                    <rect className="lt-plate lt-plate-dim" x="262" y="14" width="4.6" height="7.6" rx="1.6" />

                    <rect className="lt-plate lt-plate-lit" x="271" y="8" width="22" height="19" rx="5" />
                    <path className="lt-plate lt-plate-side" d="M287.4 8h.6a5 5 0 0 1 5 5v9a5 5 0 0 1-5 5h-.6z" />
                    <rect className="lt-plate lt-plate-crown" x="274.4" y="8.7" width="15.4" height="2.1" rx="1.05" />

                    <rect className="landing-robot-visor" x="274.6" y="12.6" width="15.8" height="9.4" rx="3" />
                    <g className="landing-robot-gaze">
                      <rect className="landing-robot-eye" x="277.2" y="15.1" width="3.4" height="4.5" rx="1.2" />
                      <rect className="landing-robot-eye landing-robot-eye-right" x="283.4" y="14.8" width="4.6" height="5" rx="1.5" />
                    </g>
                    <path className="landing-robot-visor-gloss" d="M276.4 22 282 12.6h2.8L279.2 22z" />
                    <path className="landing-robot-vent" d="M275.4 24.6h11.6" />
                  </g>

                  {/* ── Tay trước ────────────────────────────────────── */}
                  <g className="landing-robot-limb landing-robot-arm-front">
                    <rect className="lt-plate lt-plate-lit" x="284.9" y="31" width="6.2" height="12" rx="3" />
                    <g className="landing-robot-limb landing-robot-forearm-front">
                      <rect className="lt-plate lt-plate-lit" x="285.2" y="41.5" width="5.6" height="10" rx="2.8" />
                      <rect className="lt-plate lt-plate-lit lt-hand-rest" x="284.5" y="49.8" width="7" height="4.6" rx="1.8" />
                    </g>
                  </g>

                  {/* ── Chân trước (chân sút) ───────────────────────── */}
                  <g className="landing-robot-limb landing-robot-thigh-front">
                    <rect className="lt-plate lt-plate-lit" x="281.7" y="45" width="7.6" height="12" rx="3.4" />
                    <g className="landing-robot-limb landing-robot-shin-front">
                      <rect className="lt-plate lt-plate-lit" x="282.1" y="55.5" width="6.8" height="10" rx="3" />
                      <rect className="lt-plate lt-plate-lit" x="280.9" y="61.6" width="11.6" height="4.4" rx="1.8" />
                    </g>
                  </g>
                </g>
              </g>
            </g>

            {/* ── Cảnh 2: cái laptop ───────────────────────────────────
                Toạ độ vẽ ở tư thế ĐÃ NGỒI (đùi duỗi ngang, y≈62), nên lúc
                trồi lên / chui xuống chỉ cần dịch theo trục Y. Vẽ SAU robot
                để nằm trước mặt nó; hai bàn tay gõ hạ tới mép gần của bàn
                phím nên không bị nắp máy che. */}
            <g className="landing-laptop">
              <path className="lt-laptop-deck" d="M281 64.2h18.4l-2.6-3h-13.2z" />
              <path className="lt-laptop-keys" d="M284.4 63.1h3.4M289.2 63.1h3.4M294 63.1h2.6M285.3 62.1h3M289.5 62.1h3M293.7 62.1h2.2" />

              <g className="landing-laptop-lid">
                <rect className="lt-laptop-shell" x="282.4" y="46" width="15.6" height="15.6" rx="1.6" />
                <rect className="lt-laptop-screen" x="283.7" y="47.3" width="13" height="13" rx="0.8" fill="url(#lt-glass)" />
                {/* BỐN dòng, không phải năm. Ở cỡ thật màn hình chỉ cao ~13px:
                    năm nét mảnh sát nhau đọc ra một vệt mờ, bốn nét dày giãn
                    đều mới đọc ra "mấy dòng chữ". Hai dòng cuối bị ẩn dưới
                    960px — xem `@media` trong globals.css. */}
                <g className="lt-laptop-code">
                  <path className="lt-code lt-code-1" d="M285 50.2h5.6" />
                  <path className="lt-code lt-code-2" d="M285 53.1h8.6" />
                  <path className="lt-code lt-code-3" d="M286.6 56h6.4" />
                  <path className="lt-code lt-code-4" d="M286.6 58.9h8" />
                </g>
                <rect className="lt-laptop-caret" x="295.4" y="58" width="1.1" height="1.9" />
              </g>

              {/* Hai bàn tay GÕ. Chúng thuộc nhóm laptop chứ không thuộc cẳng
                  tay, vì laptop vẽ sau robot nên tay gắn ở cẳng tay sẽ bị nắp
                  máy che mất — mà che mất thì cả nhịp gõ coi như không tồn
                  tại. Toạ độ đặt đúng nơi cổ tay dừng lại (nghiệm ngược hai
                  đốt), nên nhìn vẫn liền một cánh tay. */}
              <g className="lt-hand-tap lt-hand-tap-back">
                <rect className="lt-plate lt-plate-dim" x="282.5" y="59.7" width="7" height="4.6" rx="1.8" />
              </g>
              <g className="lt-hand-tap lt-hand-tap-front">
                <rect className="lt-plate lt-plate-lit" x="290.7" y="59.7" width="7" height="4.6" rx="1.8" />
              </g>
            </g>
          </g>
        </g>

        {/* ── Quả bóng (cảnh 1) ──────────────────────────────────────────── */}
        <g className="landing-football">
          <circle className="landing-football-shell" cx="322" cy="59" r="7" fill="url(#lt-ball)" />
          <g className="landing-football-seams">
            <path d="m322 54.4 3.6 2.6-1.4 4.3h-4.4l-1.4-4.3z" />
            <path d="M318.4 57 314.6 56m11 1 3.8-1m-8.2 5.3-1.6 3.8m6-3.8 1.6 3.8M322 54.4V51" />
          </g>
          <ellipse className="landing-football-gloss" cx="319" cy="55.6" rx="2.4" ry="1.7" />
        </g>

        {/* Vệt gió kéo SAU quả bóng: vẽ ở bên trái vị trí bóng lúc bị sút
            (322 + 104 = 426) rồi dịch cùng một lượng, nên nó luôn nằm phía
            sau chứ không chạy trước quả bóng. */}
        <g className="landing-football-speed">
          <path d="M294 55h20" />
          <path d="M298 60h15" />
          <path d="M296 65h11" />
        </g>
      </svg>
    </div>
  );
}
