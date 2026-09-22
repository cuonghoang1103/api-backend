/**
 * cr-17.mjs — Content Creator, Chương 17: Chuyển cảnh, keyframe & tốc độ.
 *   node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/cr-17.mjs
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/cr-17.mjs --out <dir>
 */
import { S, cover, cards, box, table, vs, mindmap, two, timeline, storyboard, chart, cap, C, esc } from './_cr-chung.mjs';

export const deck = { key: 'cr-17', code: 'CR · CHƯƠNG 17', title: 'Chuyển cảnh, keyframe & tốc độ', sub: 'Content Creator · Chương 17' };

/**
 * Đồ thị giá trị thuộc tính theo thời gian: nội suy TUYẾN TÍNH vs EASING.
 * Vẽ bằng một cubic-bezier duy nhất — linear dùng control point (0,0,1,1) (đường thẳng),
 * ease in/out dùng đúng control point CSS chuẩn (.42,0,.58,1). 9 chấm đặt ĐỀU theo THỜI
 * GIAN (t = 0, 1/8 … 1) rồi chiếu lên đường cong — cho thấy khung hình dồn/giãn thế nào.
 */
const easeGraph = ({ kind = 'linear', c = C.blu, w = 470, h = 250 } = {}) => {
  const L = 28, Rm = 14, Tm = 14, B = 46;
  const X0 = L, X1 = w - Rm, Y0 = h - B, Y1 = Tm;
  const px = (t) => X0 + t * (X1 - X0);
  const py = (v) => Y0 - v * (Y0 - Y1);
  const [c1x, c1y, c2x, c2y] = kind === 'linear' ? [0, 0, 1, 1] : [0.42, 0, 0.58, 1];
  const bez = (t) => { const u = 1 - t; return u * u * u * py(0) + 3 * u * u * t * py(c1y) + 3 * u * t * t * py(c2y) + t * t * t * py(1); };
  const path = `M${px(0).toFixed(1)} ${py(0).toFixed(1)} C${px(c1x).toFixed(1)} ${py(c1y).toFixed(1)} ${px(c2x).toFixed(1)} ${py(c2y).toFixed(1)} ${px(1).toFixed(1)} ${py(1).toFixed(1)}`;
  let dots = '', strip = '';
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    const y = kind === 'linear' ? py(t) : bez(t);
    dots += `<circle cx="${px(t).toFixed(1)}" cy="${y.toFixed(1)}" r="4.2" fill="${c}"/>`;
    strip += `<circle cx="${px(t).toFixed(1)}" cy="${(Y0 + 20).toFixed(1)}" r="3.6" fill="${c}" opacity=".9"/>`;
  }
  return `<svg class="c-svg" viewBox="0 0 ${w} ${h}" width="${w}"><rect width="${w}" height="${h}" rx="12" fill="#0f131a" stroke="#2a3446"/>` +
    `<line x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}" stroke="#2a3446"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1}" stroke="#2a3446"/>` +
    `<path d="${path}" stroke="${c}" stroke-width="3.5" fill="none"/>${dots}` +
    `<line x1="${X0}" y1="${Y0 + 20}" x2="${X1}" y2="${Y0 + 20}" stroke="#3a4558" stroke-dasharray="3 4"/>${strip}` +
    `<text x="${X0}" y="${Y0 + 38}" font-size="12.5" fill="#8f9bb0" font-family="-apple-system,Arial">9 khung, cách ĐỀU nhau theo thời gian → vị trí thật trên đường cong</text>` +
    `</svg>`;
};

export const slides = S([

  /* 1 — bìa */
  cover({
    t: 'Chương 17 — Chuyển cảnh, keyframe & tốc độ',
    sub: 'Ch.12–14 dạy cắt dựng cơ bản. Chương này nâng lên mức chuyên nghiệp: chuyển cảnh có lý do, easing mượt, và tốc độ/thời gian ĐÚNG kỹ thuật',
    chap: 'CHƯƠNG 17',
  }),

  /* 2 — mindmap */
  {
    t: 'Bản đồ chương',
    body: mindmap('Chuyển cảnh · Keyframe · Tốc độ', 'dựng như dân chuyên nghiệp', [
      { t: '🎬 17.1 Chuyển cảnh & quay để dựng', d: 'Dissolve, whip pan, vật cản, match, push — và QUAY sao cho ghép được', c: 'red' },
      { t: '🌀 17.2 Keyframe & easing', d: 'Nội suy tuyến tính vs easing, đồ thị tốc độ, motion blur', c: 'ora' },
      { t: '⏱ 17.3 Tốc độ & thời gian', d: 'Slow motion ĐÚNG vs giật, speed ramp, freeze/reverse, timelapse', c: 'amb' },
      { t: '🧩 17.4 Hệ thống hiệu ứng', d: 'Adjustment clip, thư viện effects, thứ tự, render cache — SAU picture lock', c: 'grn' },
      { t: '⬅️ Nối Ch.12–14', d: 'Punch-in, Speed/Curve, hard cut mặc định đã học — chương này ĐÀO SÂU', c: 'blu' },
      { t: '➡️ Ch.18 kế tiếp', d: 'Mask, tracking & VFX thực tế — dùng chung máy Adjustment/Effects vừa học', c: 'vio' },
    ]),
  },

  /* 3 — storyboard quay để dựng chuyển cảnh */
  {
    t: 'Quay ĐỂ dựng chuyển cảnh — không phải "để hậu kỳ lo"',
    body: storyboard([
      { s: '1', t: 'Cảnh A — lia máy sang phải, TĂNG tốc dần', kind: 'person' },
      { s: '2', t: 'Kết thúc A — tay/vật cản che KÍN ống kính', kind: 'hands' },
      { s: '3', t: 'Mở đầu B — tay/vật cản BUÔNG khỏi ống kính', kind: 'hands' },
      { s: '4', t: 'Cảnh B — lia tiếp CÙNG hướng, CÙNG tốc độ', kind: 'person' },
    ], { cols: 4, w: 262 }) + box('info', '<strong>Mini shot list whip pan / vật cản:</strong> quay cảnh A, lia tới khi che kín khung hình rồi mới dừng máy; bắt đầu cảnh B đã che kín, buông vật cản rồi lia tiếp. Theo hướng dẫn chính thức của CapCut (capcut.com/resource, chuyển cảnh AI): độ tin cậy của một whip pan đến từ <em>hướng khớp nhau, tốc độ khớp kỳ vọng, và một lý do rõ ràng để người xem tin đó là MỘT chuyển động liên tục</em> — quay đúng kỹ thuật này thì ghép trong CapCut/Resolve chỉ còn là việc cắt đúng khung, không cần hiệu ứng giả.'),
  },

  /* 4 — timeline đặt transition tại điểm cắt */
  {
    t: 'Đặt chuyển cảnh: độ dài & vị trí so với điểm cắt',
    body: timeline({ len: 20, step: 2, tracks: [
      { id: 'V1', clips: [{ s: 0, e: 10, t: 'Clip A', c: 'blu' }, { s: 10, e: 20, t: 'Clip B', c: 'amb' }] },
    ], braces: [{ s: 9, e: 11, t: 'Chuyển cảnh dài 1s — CĂN GIỮA điểm cắt (0.5s lấn vào mỗi clip)', c: 'grn' }] }) +
      box('tip', '<strong>DaVinci Resolve:</strong> kéo một hiệu ứng từ Effects Library → Video Transitions đè lên điểm cắt trên trang Edit; kéo mép icon chuyển cảnh trên timeline hoặc mở Inspector để chỉnh đúng thời lượng, mặc định căn giữa nhưng kéo lệch được về phía A hoặc B. <strong>CapCut:</strong> theo capcut.com/help — hai clip phải NẰM SÁT NHAU (không khoảng trống), trỏ chuột vào giữa hai clip và bấm icon chuyển cảnh (máy tính: tab <strong>Transitions</strong> ở trên, kéo hiệu ứng vào điểm cắt), rồi chỉnh thời lượng ngay trên timeline.'),
  },

  /* 5 — cards 6 kiểu chuyển cảnh chuyên nghiệp */
  {
    t: 'Sáu kiểu chuyển cảnh THẬT SỰ dùng được',
    body: cards([
      { ic: '🌫️', t: 'Dissolve / dip to black', d: 'Báo hiệu thời gian trôi qua — Ch.14 đã dạy khi nào dùng dissolve, đây là cách LÀM nó ở hai phần mềm', c: 'blu' },
      { ic: '💨', t: 'Whip pan (lia nhanh)', d: 'Nối 2 shot lia CÙNG hướng, CÙNG tốc độ — nhoè chuyển động che chỗ ghép (slide 3)', c: 'red' },
      { ic: '🔷', t: 'Match / shape transition', d: 'Hình dạng ở cuối cảnh A khớp hình dạng đầu cảnh B — họ hàng gần với match cut (Ch.14)', c: 'vio' },
      { ic: '✋', t: 'Qua vật cản', d: 'Vật thể đi ngang ống kính che hết khung hình — mask theo đúng vật đang che, không phải hình có sẵn', c: 'amb' },
      { ic: '🔎', t: 'Push / zoom', d: 'Đẩy máy hoặc zoom liên tục nối 2 cỡ cảnh khác nhau của CÙNG một chủ thể', c: 'grn' },
      { ic: '🔥', t: 'Light leak / film burn', d: 'Vệt sáng tràn qua khung hình — cảm giác hoài cổ, chỉ nên dùng TIẾT CHẾ, 1 lần/video', c: 'ora' },
    ], 3),
  },

  /* 6 — vs có lý do vs lạm dụng */
  {
    t: 'Chuyển cảnh có LÝ DO, hay chỉ vì "nhìn cho vui"?',
    body: vs({
      no: { t: 'Lạm dụng preset', items: [
        'Mỗi lần cắt một kiểu preset lòe loẹt khác nhau trong thư viện',
        'Dùng hiệu ứng để CHE một cú cắt dở, thay vì quay lại cho đúng',
        'Không quay theo hướng/tốc độ khớp nhau — ghép xong bị giật, phải kéo dài hiệu ứng để lấp',
      ] },
      yes: { t: 'Có chủ đích', items: [
        'Mặc định vẫn là hard cut (Ch.14) — chuyển cảnh dành cho lúc đổi CHỦ ĐỀ hoặc THỜI GIAN thật sự',
        'Một video chỉ nên có 1 kiểu chuyển cảnh "chữ ký", dùng nhất quán',
        'Quay ĐỂ ghép (slide 3) — hiệu ứng chỉ tinh chỉnh khung/thời lượng, không phải cứu một cú quay hỏng',
      ] },
    }),
  },

  /* 7 — easing vs linear */
  {
    t: 'Keyframe: nội suy tuyến tính vs easing',
    body: two(
      `<div style="text-align:center"><div style="font-size:19px;font-weight:800;color:#fff;margin-bottom:6px">📏 Tuyến tính (linear)</div>${easeGraph({ kind: 'linear', c: C.amb })}<div style="font-size:14.5px;color:#a3aec0;margin-top:6px;line-height:1.35">Tốc độ ĐỀU suốt quãng đường — 9 khung cách đều nhau trên cả trục giá trị. Đây là mặc định của cả CapCut lẫn Resolve khi chưa chỉnh gì.</div></div>`,
      `<div style="text-align:center"><div style="font-size:19px;font-weight:800;color:#fff;margin-bottom:6px">🌀 Easing (ease in/out)</div>${easeGraph({ kind: 'ease', c: C.tea })}<div style="font-size:14.5px;color:#a3aec0;margin-top:6px;line-height:1.35">Khung DỒN gần điểm đầu/cuối, GIÃN ra ở giữa — chậm → nhanh → chậm. Đây là "slow in / slow out", một trong 12 nguyên lý hoạt hình kinh điển (Thomas &amp; Johnston, <em>The Illusion of Life</em>, 1981).</div></div>`,
    ),
  },

  /* 8 — bảng Resolve vs CapCut keyframe controls */
  {
    t: 'Bảng tra: điều khiển keyframe ở đâu (kiểm 09/2026)',
    body: table(['Việc cần làm', 'DaVinci Resolve', 'CapCut (máy tính)'], [
      ['Bật ghi keyframe trên 1 thuộc tính', 'Bấm icon ⏱ cạnh thuộc tính trong Inspector', 'Bấm icon ◆ (kim cương) cạnh thuộc tính'],
      ['Xem/sửa đường cong theo thời gian', 'Keyframe / Curve Editor kéo lên từ mép dưới timeline', 'Đồ thị hiện khi mở keyframe animation trên clip'],
      ['Đổi kiểu nội suy 1 keyframe', '!Chuột phải vào keyframe → Linear / Ease In / Ease Out / Ease In and Out', '!Ease In / Ease Out khi sửa keyframe (theo capcut.com)'],
      ['Speed ramp (đổi tốc độ NHIỀU điểm)', 'Retime Controls → Retime Curve (Ch.13 đã giới thiệu)', 'Speed → tab Curve, kéo điểm hoặc dùng preset'],
      ['Motion blur khớp chuyển động keyframe', 'Bật ở thuộc tính clip — khớp màn trập đã quay (Ch.5, quy tắc 180°)', 'Kiểm trong bản đang dùng — không phải máy nào cũng có nút riêng'],
    ], { sm: true }) + cap('"Ease In"/"Ease Out" trên keyframe của CapCut xác nhận từ capcut.com/resource (bài hướng dẫn keyframe chính thức) — tên nút có thể đổi theo bản, luôn kiểm lại trong app trước khi dạy học viên bấm đâu.'),
  },

  /* 9 — cards ứng dụng keyframe thực tế */
  {
    t: 'Keyframe dùng vào việc gì — 5 ứng dụng thật',
    body: cards([
      { ic: '🔍', t: 'Punch-in MƯỢT', d: 'Ch.12 đã dạy 2 keyframe zoom — thêm easing để cú zoom bắt đầu/kết thúc êm, không "khựng"', c: 'red' },
      { ic: '🖼️', t: 'Ken Burns trên ảnh chụp màn hình', d: 'Zoom + pan chậm rãi trên một ảnh tĩnh (lỗi code, sơ đồ) để ảnh "sống" trên timeline', c: 'ora' },
      { ic: '📛', t: 'Lower third trượt vào', d: 'Keyframe Position từ ngoài khung vào đúng chỗ, ease out khi dừng — không giật khi tới nơi', c: 'amb' },
      { ic: '🎯', t: 'Mũi tên / khung khoanh code', d: 'Keyframe Opacity + Scale cho mũi tên/khung xuất hiện đúng lúc đang giảng dòng đó', c: 'grn' },
      { ic: '🖱️', t: 'Zoom theo con trỏ khi quay màn hình', d: 'Nối Ch.22 (quay màn hình) — keyframe Scale/Position bám theo vị trí con trỏ đang thao tác', c: 'blu' },
    ], 3) + box('warn', '<strong>Vẫn là lời khuyên của Ch.12:</strong> hai keyframe là đủ cho một cú nhấn; animate mọi thứ trên màn hình thì hiệu ứng thôi là điểm nhấn mà thành một tật gây mỏi mắt.'),
  },

  /* 10 — chart speed ramp / retime curve */
  {
    t: 'Speed ramp — đường cong tốc độ theo thời gian',
    body: chart({
      series: [
        { t: '% tốc độ phát', c: 'tea', pts: [[0, 100], [2, 100], [3.2, 25], [5.5, 25], [6.8, 100], [9, 100]] },
      ],
      x: [0, 9, 'giây trên timeline'], y: [0, 120, '% tốc độ so với lúc quay'], xt: 9, yt: 4,
      notes: [{ x: 3.2, y: 25, t: 'ramp xuống 25% — slow-mo nhấn khoảnh khắc', c: 'amb', dx: 14, dy: 18 }],
    }) + box('tip', '<strong>Resolve:</strong> Retime Controls → kéo lên <strong>Retime Curve</strong> trên timeline, thêm điểm bằng Ctrl/Cmd-click rồi kéo % tốc độ (Ch.13 đã giới thiệu Retime Controls cho tốc độ CỐ ĐỊNH — đây là bản NHIỀU điểm). <strong>CapCut:</strong> Speed → tab <strong>Curve</strong>, dùng preset (Montage, Bullet, Jump Cut, Hero — theo capcut.com/tools/speed-ramp) hoặc bấm <strong>Add Point</strong> để tự kéo đường cong như hình trên.'),
  },

  /* 11 — table fps quay → hệ số chậm */
  {
    t: 'fps lúc quay → hệ số chậm trên timeline 25fps',
    body: table(['fps lúc quay', 'Hệ số chậm (÷25fps)', 'Máy nào quay được'], [
      ['25fps', '1× (tốc độ thường)', 'Cả hai — mặc định khoá (Ch.5)'],
      ['50fps', '2×', 'Pocket 3 (4K/1080p tới 50fps)'],
      ['60fps', '2.4×', 'Pocket 3, iPhone (4K Dolby Vision tới 60fps)'],
      ['100fps', '4×', 'iPhone (4K Dolby Vision, ống Fusion)'],
      ['120fps', '!4.8×', 'Pocket 3 (4K/2.7K), iPhone (4K Dolby Vision, ống Fusion)'],
      ['240fps', '9.6×', 'Pocket 3, iPhone — CHỈ ở 1080p'],
    ], { sm: true }) + cap('Số liệu quay: dji.com/osmo-pocket-3/specs và support.apple.com/en-us/121032 (mục Slo-mo video support), kiểm 09/2026. Công thức hệ số chậm = fps quay ÷ fps timeline, giống hệt Ch.5 (120÷25 = 4,8× đã dùng làm ví dụ ở đó).'),
  },

  /* 12 — vs true vs fake slow motion, số đo ffmpeg thật */
  {
    t: 'Slow motion ĐÚNG vs làm chậm clip quay thường',
    body: vs({
      no: { t: 'Kéo dài clip 25fps (SAI)', items: [
        'setpts=4*PTS trên clip vốn quay 25fps (chỉ 75 khung/3s)',
        'Không có khung MỚI nào — phần mềm chỉ LẶP khung cũ để lấp thời gian',
        'Đo thật bằng ffmpeg: ra 299 khung/11.96s từ 75 khung gốc — mỗi khung thật bị lặp ~4 lần → giật',
      ] },
      yes: { t: 'Conform từ fps cao (ĐÚNG)', items: [
        'Quay 100fps (300 khung/3s thật) rồi đưa vào timeline 25fps',
        'KHÔNG khung nào bị sinh ra hay lặp — chỉ đổi nhãn thời gian phát',
        'Đo thật bằng ffmpeg: đúng 300 khung gốc, phát ra 12.0s mượt — khớp hệ số 100÷25 = 4×',
      ] },
    }) + box('info', 'Số liệu đo trực tiếp trên máy này bằng <code>ffmpeg</code>/<code>ffprobe</code> với clip thử <code>testsrc2</code> — không phải ước lượng. Muốn khung MỚI thật (không chỉ lặp) từ clip đã quay 25fps, dùng nội suy khung: Resolve — <strong>Optical Flow</strong> (Retime Process, có các mức Standard/Enhanced, và <strong>Speed Warp</strong> chỉ ở bản Studio, dùng Neural Engine); CapCut — chưa xác nhận được nút nội suy khung riêng, kiểm lại trong app.'),
  },

  /* 13 — timelapse / hyperlapse / motionlapse */
  {
    t: 'Nén thời gian: timelapse, hyperlapse, motionlapse',
    body: cards([
      { ic: '⏳', t: 'Timelapse (Pocket 3)', d: 'Máy ĐỨNG YÊN, chụp theo khoảng cách (interval) rồi ghép — chỉnh độ phân giải, fps, interval, thời lượng', c: 'blu' },
      { ic: '🚶', t: 'Hyperlapse (Pocket 3)', d: 'Vừa DI CHUYỂN vừa quay, gimbal tự ổn định — chỉnh độ phân giải, fps, tốc độ phát', c: 'amb' },
      { ic: '🎯', t: 'Motionlapse (Pocket 3)', d: 'Như timelapse nhưng máy tự di chuyển qua các waypoint đã đặt trước — thêm chỉnh interval + thời lượng', c: 'vio' },
      { ic: '📱', t: 'Time-lapse (iPhone)', d: 'Chế độ Time-lapse có sẵn trong app Camera — khoảng chụp tự giãn theo tổng thời gian quay', c: 'grn' },
      { ic: '🎵', t: 'Montage theo nhịp nhạc', d: 'Đặt marker tại mỗi phách mạnh (Ch.12: ⌘J đánh dấu beat trong CapCut) rồi cắt/đổi cảnh đúng marker', c: 'red' },
    ], 3) + cap('Ba chế độ của Pocket 3 và các thông số chỉnh được: xác nhận từ dji.com/osmo-pocket-3/faq, kiểm 09/2026.'),
  },

  /* 14 — hệ thống hiệu ứng khi dựng */
  {
    t: 'Hệ thống hiệu ứng — một lớp phủ, không sửa từng clip',
    body: table(['Việc', 'DaVinci Resolve', 'CapCut'], [
      ['Một lớp hiệu ứng phủ NHIỀU clip', 'Adjustment Clip — Effects Library → Toolbox → kéo lên timeline, đè lên các clip cần chung hiệu ứng', 'Track/hiệu ứng trong tab Adjustment — kiểm thao tác trong bản đang dùng'],
      ['Thư viện hiệu ứng', 'Effects Library — OpenFX + plugin bên thứ 3 cài thêm được', 'Tab Effects (chuyển động, phong cách) + Filters (màu/tông) riêng biệt'],
      ['Lưu tổ hợp hiệu ứng để dùng lại', '!Power Bins — lưu Adjustment Clip/preset, dùng chung mọi dự án', 'Templates — kiểm tên & phạm vi trong bản đang dùng'],
      ['Giữ timeline mượt khi hiệu ứng nặng', 'Render Cache: Playback → Render Cache → None/User/!Smart', 'Proxy khi nhập liệu (Ch.11) — không phải cache riêng cho hiệu ứng'],
    ], { sm: true }) + box('warn', '<strong>Nối Ch.14:</strong> hiệu ứng — kể cả Adjustment Clip — vẫn làm SAU picture lock, cùng lúc với màu (Ch.15) và âm thanh hậu kỳ (Ch.16). Thêm hiệu ứng trước khi khoá hình nghĩa là mỗi lần cắt lại phải canh lại vị trí Adjustment Clip trên timeline.'),
  },

  /* 15 — bảng tra nhanh kỹ thuật -> công cụ */
  {
    t: 'Bảng tra nhanh — muốn làm gì thì mở công cụ nào',
    body: table(['Muốn làm', 'CapCut', 'DaVinci Resolve'], [
      ['Chuyển cảnh dissolve/wipe có sẵn', 'Tab Transitions, kéo vào điểm cắt', 'Effects Library → Video Transitions'],
      ['Zoom punch-in mượt có easing', 'Keyframe ◆ + Ease In/Out', 'Inspector ⏱ + chuột phải → Ease In/Out'],
      ['Đổi tốc độ nhiều điểm (speed ramp)', 'Speed → tab Curve', 'Retime Controls → Retime Curve'],
      ['Đóng băng một khung', 'Speed → Freeze (Ch.12)', 'Chuột phải clip → Freeze Frame'],
      ['Phát ngược', 'Speed → Reverse (Ch.12)', 'Chuột phải clip → Reverse Clip'],
      ['Nội suy khung khi làm chậm', '-Kiểm lại trong app — chưa xác nhận nút riêng', '+Optical Flow / Speed Warp (Studio) trong Retime Process'],
      ['Một hiệu ứng phủ nhiều clip', 'Track/Adjustment', 'Adjustment Clip'],
    ], { sm: true }),
  },

  /* 16 — thực hành */
  {
    t: '🎬 Thực hành chương 17',
    body: cards([
      { ic: '🎥', t: '1. Quay 1 cặp whip pan', d: 'Theo mini shot list slide 3: lia + vật cản che ống kính, cùng hướng cùng tốc độ ở cả 2 shot.', c: 'red' },
      { ic: '🌀', t: '2. Ghép + easing', d: 'Ghép cặp shot đó bằng chuyển cảnh thật (không phải cắt cứng), thêm 1 punch-in có Ease In/Out.', c: 'ora' },
      { ic: '⏱', t: '3. Một đoạn slow-mo ĐÚNG', d: 'Quay ở fps cao nhất máy bạn có, conform vào timeline 25fps — không dùng setpts/kéo dài clip thường.', c: 'amb' },
      { ic: '🧩', t: '4. Adjustment Clip/track', d: 'Thêm 1 hiệu ứng màu nhẹ qua Adjustment Clip (Resolve) hoặc track Adjustment (CapCut) phủ cả đoạn.', c: 'grn' },
    ], 2) + box('good', '<strong>Đạt khi:</strong> chỉ ra được ĐÚNG kiểu chuyển cảnh đã dùng và VÌ SAO (không phải "chọn đại"), đoạn slow-motion mượt không giật khi xem toàn màn hình, và không có quá 1 kiểu chuyển cảnh "chữ ký" lặp lại trong cả đoạn dựng thử.'),
  },
]);
