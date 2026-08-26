/**
 * ROBOT ĐÁ BÓNG TRÊN THANH HEADER — cảnh 2.5D, một vòng 24 giây.
 *
 * ─── VÌ SAO VIẾT LẠI (26/08/2026) ────────────────────────────────────────────
 * Bản trước bị chê đúng hai điểm, và cả hai đều là lỗi DỰNG CẢNH chứ không phải
 * lỗi "chưa đủ mượt":
 *
 *   1. NHÌN NHƯ ẢNH TĨNH. Các khớp có xoay thật, nhưng mọi mảng đều tô MỘT màu
 *      phẳng (`fill: var(--landing-robot-metal)`) nên mắt không đọc ra khối.
 *      Thiếu chiều sâu thì dù có xoay 8 khớp nó vẫn đọc thành một sprite dẹt.
 *   2. BIẾN MẤT ĐỘT NGỘT. `landing-mascot-cycle` chỉ hạ `opacity` về 0 ở mốc
 *      62%. Không có lý do nào trong cảnh giải thích vì sao nó biến mất — mắt
 *      người đọc đó là "hỏng", không phải "đi rồi".
 *
 * Bản này sửa cả hai bằng cách dựng CẢNH chứ không chỉ dựng NHÂN VẬT:
 *
 *   · KHỐI THẬT (2.5D): mỗi mảng có ba mặt — mặt trước sáng, mặt hông tối, một
 *     lát mặt trên sáng hơn — cộng gradient chung một hướng sáng
 *     (`gradientUnits="userSpaceOnUse"`, sáng từ trên-trái). Tay và chân tách
 *     LÀM HAI ĐỐT có khuỷu/gối riêng, nên bước chạy có gập chứ không phải một
 *     que xoay quanh hông. Quả bóng là mặt cầu (radialGradient lệch tâm) với
 *     đường chỉ khâu quay riêng — vỏ đứng yên dưới ánh sáng, chỉ hoa văn xoay,
 *     đó mới ra vòng lăn.
 *   · CÓ CỐT TRUYỆN: nó KHÔNG biến mất nữa mà CHUI XUỐNG một cửa hầm nằm ngay
 *     trên thanh. Trình tự: cửa mở → trồi lên → cửa đóng → bóng rơi xuống →
 *     chạy rê bóng → lấy đà → sút → ăn mừng → quay người → đi ngược về cửa →
 *     cửa mở → vẫy tay → chui xuống → cửa đóng → nghỉ 7,4 giây.
 *
 * ─── HAI THỦ THUẬT LÀM NÊN CẢNH NÀY ──────────────────────────────────────────
 *   · `clipPath#lt-above-rail` cắt nhân vật ĐÚNG tại đường kẻ (y=66). Nhờ vậy
 *     chỉ cần `translateY` xuống là thân bị xén dần từ chân lên đầu — mắt đọc
 *     ra "đang tụt xuống dưới sàn", không phải "đang mờ đi".
 *   · Quay người bằng `scaleX: 1 → 0.14 → -1`. Bề ngang bóp về gần 0 rồi lật
 *     dấu; ở kích thước này mắt đọc y hệt một vòng xoay 3D, mà vẫn chỉ là một
 *     phép biến hình phẳng (không WebGL, không runtime hoạt hình).
 *
 * ─── LUẬT GIỮ KHI SỬA TIẾP ───────────────────────────────────────────────────
 *   · Toạ độ ở đây ăn khớp CỨNG với `globals.css`: viewBox `0 -6 560 96`, mặt
 *     đất y=66, tâm x=280, cửa hầm rộng 52 (x 254→306). Đổi bất cứ số nào
 *     trong đó thì phải đổi cả `--lt-ground` và `--lt-hatch-half` bên CSS,
 *     không thì robot đứng lơ lửng hoặc lọt xuống dưới đường kẻ.
 *   · CHỈ `transform` và `opacity`. Không `filter`, không `box-shadow` động,
 *     không rAF, không canvas — trang chủ không được rước runtime nào vào.
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

          <linearGradient id="lt-visor" gradientUnits="userSpaceOnUse" x1="270" y1="12" x2="288" y2="23">
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
                    bật/tắt của vòng 24s — nhờ vậy không phải chép năm nhịp
                    bụi vào timeline lớn. Nằm trong nhóm lật mặt nên lúc đi
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
                      <rect className="lt-plate lt-plate-dim" x="269" y="49.8" width="7" height="4.6" rx="1.8" />
                    </g>
                  </g>

                  {/* ── Thân ─────────────────────────────────────────── */}
                  <g className="landing-robot-torso-group">
                    <rect className="lt-plate lt-plate-lit" x="267.5" y="28" width="25" height="19" rx="5" />
                    <path className="lt-plate lt-plate-side" d="M285.5 28h2a5 5 0 0 1 5 5v9a5 5 0 0 1-5 5h-2z" />
                    <rect className="lt-plate lt-plate-belt" x="268.5" y="42.6" width="23" height="4.6" rx="2.1" />
                    <path className="landing-robot-vent" d="M271.4 39.6h8.6" />
                    <circle className="landing-robot-core-ring" cx="278.4" cy="35.2" r="4.4" />
                    <circle className="landing-robot-core" cx="278.4" cy="35.2" r="2.1" />
                    <rect className="lt-plate lt-plate-neck" x="275.5" y="24.6" width="9" height="5" rx="1.8" />
                  </g>

                  {/* ── Đầu ─────────────────────────────────────────── */}
                  <g className="landing-robot-head-group">
                    <path className="landing-robot-antenna" d="M280 8V2.9" />
                    <circle className="landing-robot-antenna-bulb" cx="280" cy="1.4" r="2.2" />

                    <rect className="lt-plate lt-plate-dim" x="262.4" y="13.4" width="4.8" height="8.2" rx="1.7" />
                    <rect className="lt-plate lt-plate-dim" x="292.8" y="13.4" width="4.8" height="8.2" rx="1.7" />

                    <rect className="lt-plate lt-plate-lit" x="267" y="8" width="26" height="19" rx="5" />
                    <path className="lt-plate lt-plate-side" d="M285.6 8h2.4a5 5 0 0 1 5 5v9a5 5 0 0 1-5 5h-2.4z" />
                    <rect className="lt-plate lt-plate-crown" x="269.6" y="8.7" width="21" height="2.1" rx="1.05" />

                    <rect className="landing-robot-visor" x="270.5" y="12.6" width="18" height="9.4" rx="3" />
                    <g className="landing-robot-gaze">
                      <rect className="landing-robot-eye" x="273.6" y="14.9" width="4.4" height="4.8" rx="1.5" />
                      <rect className="landing-robot-eye landing-robot-eye-right" x="281.6" y="14.9" width="4.4" height="4.8" rx="1.5" />
                    </g>
                    <path className="landing-robot-visor-gloss" d="M272.6 22 279 12.6h3.1L275.7 22z" />
                    <path className="landing-robot-vent" d="M272.4 24.6h13.2" />
                  </g>

                  {/* ── Tay trước ────────────────────────────────────── */}
                  <g className="landing-robot-limb landing-robot-arm-front">
                    <rect className="lt-plate lt-plate-lit" x="284.9" y="31" width="6.2" height="12" rx="3" />
                    <g className="landing-robot-limb landing-robot-forearm-front">
                      <rect className="lt-plate lt-plate-lit" x="285.2" y="41.5" width="5.6" height="10" rx="2.8" />
                      <rect className="lt-plate lt-plate-lit" x="284.5" y="49.8" width="7" height="4.6" rx="1.8" />
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
          </g>
        </g>

        {/* ── Quả bóng ───────────────────────────────────────────────────── */}
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
