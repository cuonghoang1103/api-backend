/**
 * cr-10.mjs — Content Creator, Chương 10: Quay một mình như dân chuyên.
 * A-cam/B-cam 2 máy đồng thời · B-roll (6 loại, chuỗi 5 shot) · tự quay một
 * mình (ActiveTrack 6.0, khoá AE/AF, màn hình xem mình) · ngày quay & checklist
 * · quay nơi công cộng ở Việt Nam.
 *
 *   node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/cr-10.mjs
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/cr-10.mjs --out <dir>
 *
 * Nguồn số liệu chính (đầy đủ trong báo cáo bàn giao):
 *  - DJI Osmo Pocket 3 — ActiveTrack 6.0, Face Auto-Detect, Dynamic Framing;
 *    chạm đúp vào chủ thể để bật, chạm ra ngoài khung hoặc bấm 5D Joystick một
 *    lần để tắt; KHÔNG hoạt động trong Panorama, Low-Light Video, Slow Motion,
 *    Timelapse, Motionlapse, SpinShot: dji.com/osmo-pocket-3/faq +
 *    support.dji.com (customId=01700006830, "Using ActiveTrack with Handheld
 *    Products"). Mini Tripod + ren 1/4" ở đáy tay cầm và battery grip:
 *    support.dji.com (customId=en-us03400009024, "A Beginner's Guide to Osmo
 *    Pocket 3"). Pin 166 phút / bitrate 130 Mbps / dải nhiệt 0–40°C đã kiểm ở
 *    Chương 4 và 6 (dji.com/osmo-pocket-3/specs) — dùng lại nguyên số, không
 *    đo lại ở chương này.
 *  - Apple — khoá AE/AF trên app Camera: giữ chạm vùng lấy nét tới khi thấy
 *    chữ "AE/AF Lock", chạm lại màn hình để mở khoá:
 *    support.apple.com/guide/iphone/set-up-your-shot-iph3dc593597/ios.
 *  - DJI Mimo trên iPad — "Designed for iPad", cần iPadOS 15.0+, xem trực
 *    tiếp HD, điều khiển Pocket 3 qua Bluetooth/Wi-Fi:
 *    apps.apple.com/us/app/dji-mimo/id1431720653.
 *  - Blackmagic Camera — một thiết bị đặt làm "controller", các máy còn lại
 *    chạy app cùng mạng, xem multiview + chỉnh thông số từ xa; hỗ trợ iPad
 *    chip Apple Silicon: blackmagicdesign.com/products/blackmagiccamera.
 *  - Điều 32 Bộ luật Dân sự số 91/2015/QH13 (quyền cá nhân đối với hình ảnh):
 *    vbpl.vn/TW/Pages/vbpq-toanvan.aspx?ItemID=95942 (Cơ sở dữ liệu quốc gia
 *    về văn bản pháp luật, Bộ Tư pháp).
 *  - Điều 21 Luật Trẻ em 2016 (quyền bí mật đời sống riêng tư): trích nguyên
 *    văn qua aigiaoduc.thuvienphapluat.vn.
 *  - Continuity Camera (iPhone làm webcam CHO MAC) đã kiểm ở Chương 6 — nhắc
 *    lại để loại trừ, không kiểm lại.
 */
import { S, cover, cards, box, steps, table, two, frame, mindmap, hud, storyboard, C } from './_cr-chung.mjs';

// Hình đứng một mình (SVG/HUD cố định bề ngang) thì dồn trái, bỏ trống nửa phải → căn giữa.
const giua = (h) => `<div style="display:flex;justify-content:center">${h}</div>`;

export const deck = {
  key: 'cr-10',
  code: 'CR · CHƯƠNG 10',
  title: 'Quay một mình như dân chuyên',
  sub: 'Content Creator · Chương 10',
};

/* ───────────────────── sơ đồ 2 máy nhìn từ trên xuống (tự vẽ) ───────────────────── */
const txt = (x, y, s, { size = 15, fill = C.tx, anchor = 'start', weight = 400, mono = false } = {}) =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}" font-family="${mono ? "'SF Mono',Menlo,monospace" : "-apple-system,'Segoe UI',Arial,sans-serif"}">${s}</text>`;

/** Icon máy quay, tâm (x,y), lens hướng theo góc rot (độ) đã tính bằng atan2. */
const camIcon = (x, y, rot, c) =>
  `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})">` +
  `<rect x="-16" y="-12" width="26" height="24" rx="4" fill="${c}"/>` +
  `<path d="M10 -7 L22 -13 L22 13 L10 7 Z" fill="${c}"/></g>`;

/** Người nhìn từ trên, mặt hướng theo góc facing (độ, 0 = xuống dưới khung). */
const personTop = (x, y, facing, c = '#3b82f6') =>
  `<g transform="translate(${x} ${y}) rotate(${facing})">` +
  `<ellipse cx="0" cy="0" rx="34" ry="16" fill="${c}"/>` +
  `<circle cx="0" cy="2" r="14" fill="#231c1a"/>` +
  `<path d="M-5 13 L0 22 L5 13 Z" fill="#f0c29e"/></g>`;

/** camPair() — sơ đồ A-cam (trục 0°) + B-cam (lệch angleDeg) nhìn từ trên xuống. */
const camPair = ({ w = 560, angleDeg = 38 } = {}) => {
  const subj = { x: 300, y: 178 };
  const dist = 196;
  const aCam = { x: subj.x, y: subj.y + dist };
  const rad = (angleDeg * Math.PI) / 180;
  const bCam = { x: subj.x + dist * Math.sin(rad), y: subj.y + dist * Math.cos(rad) };
  const arcR = 64;
  const arcEnd = { x: subj.x + arcR * Math.sin(rad), y: subj.y + arcR * Math.cos(rad) };
  const midA = (angleDeg / 2) * (Math.PI / 180);
  const lx = subj.x + (arcR + 28) * Math.sin(midA), ly = subj.y + (arcR + 28) * Math.cos(midA);
  const aRot = (Math.atan2(subj.y - aCam.y, subj.x - aCam.x) * 180) / Math.PI;
  const bRot = (Math.atan2(subj.y - bCam.y, subj.x - bCam.x) * 180) / Math.PI;

  let s = `<svg class="c-svg" viewBox="0 0 620 460" width="${w}"><rect width="620" height="460" rx="14" fill="#0f131a" stroke="#2a3446"/>`;
  s += `<rect x="30" y="16" width="560" height="10" rx="3" fill="#2a3446"/>` +
    txt(310, 44, 'TƯỜNG / NỀN — bố cục và ánh sáng nối Chương 7–8', { size: 12, anchor: 'middle', fill: C.dim, weight: 700 });
  // trục A-cam (đường chấm tham chiếu 0°)
  s += `<line x1="${subj.x}" y1="${subj.y}" x2="${aCam.x}" y2="${aCam.y}" stroke="${C.blu}" stroke-width="2" stroke-dasharray="6 5" opacity=".75"/>`;
  // đường B-cam
  s += `<line x1="${subj.x}" y1="${subj.y}" x2="${bCam.x.toFixed(1)}" y2="${bCam.y.toFixed(1)}" stroke="${C.amb}" stroke-width="2" stroke-dasharray="6 5" opacity=".75"/>`;
  // cung góc + nhãn
  s += `<path d="M${subj.x} ${(subj.y + arcR).toFixed(1)} A${arcR} ${arcR} 0 0 1 ${arcEnd.x.toFixed(1)} ${arcEnd.y.toFixed(1)}" fill="none" stroke="${C.grn}" stroke-width="2.5"/>`;
  s += txt(lx, ly, `${angleDeg}°`, { size: 18, anchor: 'middle', fill: C.grn, weight: 800, mono: true });
  s += txt(lx + 8, ly + 20, '(30–45° khuyến nghị)', { size: 12, anchor: 'start', fill: C.mu });
  // người nhìn từ trên
  s += personTop(subj.x, subj.y, 0, '#3b82f6');
  s += txt(subj.x, subj.y - 44, 'BẠN', { size: 15, anchor: 'middle', fill: '#fff', weight: 800 });
  // iPad teleprompter cạnh A-cam
  s += `<rect x="${aCam.x - 60}" y="${aCam.y - 11}" width="27" height="20" rx="3" fill="#1e2533" stroke="#4b5563" stroke-width="1.5"/>`;
  s += txt(aCam.x - 47, aCam.y + 3, 'iPad', { size: 10, anchor: 'middle', fill: '#9cdcfe', weight: 700, mono: true });
  // A-cam
  s += camIcon(aCam.x, aCam.y, aRot, C.blu);
  s += txt(aCam.x, aCam.y + 46, 'A-CAM · iPhone', { size: 15.5, anchor: 'middle', fill: C.blu, weight: 800 });
  s += txt(aCam.x, aCam.y + 64, 'chính diện · 0° · teleprompter iPad ngay dưới', { size: 12, anchor: 'middle', fill: C.mu });
  // B-cam
  s += camIcon(bCam.x, bCam.y, bRot, C.amb);
  s += txt(bCam.x, bCam.y + 46, 'B-CAM · Pocket 3', { size: 15.5, anchor: 'middle', fill: C.amb, weight: 800 });
  s += txt(bCam.x, bCam.y + 64, 'lệch trục · ActiveTrack bám bạn', { size: 12, anchor: 'middle', fill: C.mu });
  return s + `</svg>`;
};

export const slides = S([
  /* 1 — bìa */
  cover({
    t: 'Chương 10 — Quay một mình như dân chuyên',
    sub: 'Talking head 2 máy · B-roll · tự quay một mình · ngày quay & checklist',
    chap: 'CHƯƠNG 10',
  }),

  /* 2 — bản đồ chương */
  {
    t: 'Bản đồ chương',
    body: mindmap('CHƯƠNG 10', 'Không có ai giúp cầm máy', [
      { t: 'Talking head 2 máy', d: 'A-cam iPhone + B-cam Pocket 3, lệch 30–45°', c: 'red' },
      { t: 'B-roll', d: '6 loại, chuỗi 5 shot, quay gấp 3 lần bạn nghĩ', c: 'ora' },
      { t: 'Tự quay một mình', d: 'ActiveTrack, khoá AE/AF, màn hình xem mình', c: 'amb' },
      { t: 'Ngày quay & checklist', d: 'Trước · Trong · Sau, 3 cột', c: 'grn' },
      { t: 'Quay nơi công cộng', d: 'Quyền hình ảnh — Điều 32 BLDS 2015', c: 'vio' },
    ]),
  },

  /* 3 — sơ đồ 2 máy nhìn từ trên xuống */
  {
    t: 'A-cam + B-cam — bố trí nhìn từ trên xuống',
    body: giua(camPair({ w: 600 })) +
      `<p class="c-note" style="text-align:center;margin-top:2px">Quay ĐỒNG THỜI hai máy = một lần diễn, hai góc dựng — không cần quay lại để có coverage (nối Ch4.2).</p>`,
  },

  /* 4 — khung hình A-cam vs B-cam */
  {
    t: 'Khung hình A-cam đối chiếu B-cam',
    body: two(
      frame({ w: 520, ratio: '16:9', size: 'MCU', at: 0.5, label: 'A-cam (iPhone) — MCU chính diện, mắt nhìn thẳng ống kính' }),
      frame({ w: 520, ratio: '16:9', size: 'MWS', at: 0.4, label: 'B-cam (Pocket 3) — MWS lệch 30–45°, thấy thêm bàn tay/bối cảnh' }),
    ) + box('tip', 'Hai máy quay CÙNG một câu nói nhưng hai cỡ cảnh khác nhau — lúc dựng cắt giữa MCU và MWS là một cú cắt "an toàn" (đổi cỡ đủ lớn, không thành jump cut — nối Ch4.2).'),
  },

  /* 5 — HUD khoá trước khi quay */
  {
    t: 'Khoá trước khi quay — không có ai nhìn màn hình giúp bạn',
    body: giua(hud({
      w: 620, h: 348,
      top: [{ k: 'AE/AF LOCK', v: '🔒 ON', hi: true }, { k: 'WHITE BALANCE', v: '🔒 5000K' }],
      bot: [{ k: 'ĐỘ PHÂN GIẢI · FPS', v: '4K · 25' }, { k: 'MÀN TRẬP', v: '1/50' }, { k: 'ISO', v: '400' }],
    })) + `<p class="c-note" style="text-align:center;margin-top:8px">Giữ chạm vùng lấy nét trên app Camera tới khi thấy chữ "AE/AF Lock" — làm việc này TRƯỚC câu đầu tiên, mọi lần (nối Ch5.3).</p>`,
  },

  /* 6 — 6 loại B-roll */
  {
    t: 'Sáu loại B-roll',
    body: cards([
      { ic: '⚙️', t: 'Quy trình', d: 'Từng bước một hành động đang diễn ra — gõ phím, cầm cốc, mở ứng dụng.', c: 'red' },
      { ic: '🔎', t: 'Chi tiết (insert)', d: 'Cận một chi tiết vẫn nằm TRONG hành động chính — icon trên màn hình, ngón tay bấm nút.', c: 'ora' },
      { ic: '🏙️', t: 'Bối cảnh', d: 'Toàn cảnh nơi đang quay — cả bàn làm việc, cả căn phòng, cả con phố.', c: 'amb' },
      { ic: '✂️', t: 'Cutaway', d: 'Cú máy RA KHỎI hành động chính — chêm giữa hai khoảnh khắc A-roll để che chỗ cắt.', c: 'grn' },
      { ic: '😊', t: 'Phản ứng', d: 'Biểu cảm mặt — gật gù, cau mày, cười — cho thấy CẢM XÚC, không chỉ hành động.', c: 'tea' },
      { ic: '🌳', t: 'Môi trường', d: 'Không khí xung quanh — nắng qua cửa sổ, tách trà bốc hơi, sân trường FPTU.', c: 'blu' },
    ], 3),
  },

  /* 7 — chuỗi 5 shot B-roll */
  {
    t: 'Chuỗi 5 shot B-roll cho MỘT hành động',
    body: storyboard([
      { s: '1', t: 'Quy trình', d: 'Cận tay gõ phím', kind: 'hands' },
      { s: '2', t: 'Chi tiết', d: 'Insert dòng code trên màn hình', kind: 'screen' },
      { s: '3', t: 'Bối cảnh', d: 'Toàn cảnh bàn làm việc', kind: 'person', size: 'WS' },
      { s: '4', t: 'Phản ứng', d: 'Gật gù khi chạy đúng', kind: 'person', size: 'MCU' },
      { s: '5', t: 'Môi trường', d: 'Nắng qua cửa sổ phòng', kind: 'place' },
    ], { cols: 5, w: 210 }) +
      box('warn', 'Kinh nghiệm nghề, không phải số liệu đo được: quay B-roll GẤP BA LẦN bạn nghĩ mình cần. Lúc dựng bạn sẽ cắt bớt, không bao giờ ước có thêm mà quay lại được — B-roll rẻ lúc quay, đắt lúc thiếu.'),
  },

  /* 8 — B-roll cho nội dung lập trình */
  {
    t: 'B-roll cho nội dung lập trình',
    body: cards([
      { ic: '⌨️', t: 'Tay gõ phím', d: 'Cận cảnh ngón tay trên bàn phím — hành động thật, không cần quay mặt.', c: 'red' },
      { ic: '🖥️', t: 'Màn hình cận', d: 'Màn hình có tần số quét RIÊNG, khác 50Hz điện lưới (Ch5) — quay thử vài giây, thấy sọc cuộn thì đổi màn trập hoặc tần số quét rồi quay lại.', c: 'ora' },
      { ic: '✏️', t: 'Sơ đồ vẽ trên iPad', d: 'Vẽ tay bằng Pencil khi giải thích khái niệm — dễ hiểu hơn chỉ nói suông.', c: 'amb' },
      { ic: '🚶', t: 'Cảnh đời thật liên quan', d: 'Đi bộ tới trường, ngồi thư viện, một tách cà phê — gắn nội dung code với con người thật.', c: 'grn' },
    ], 4),
  },

  /* 9 — ActiveTrack / Face Auto-Detect / Dynamic Framing */
  {
    t: 'Pocket 3 tự bám bạn — ActiveTrack 6.0',
    body: cards([
      { ic: '👆', t: 'ActiveTrack 6.0', d: 'Chạm đúp vào bạn trên màn hình để bật bám theo; chạm ra ngoài khung hoặc bấm 5D Joystick một lần để tắt.', c: 'red' },
      { ic: '🙂', t: 'Face Auto-Detect', d: 'Không cần chạm gì — bấm quay là máy tự nhận diện và bám khuôn mặt ngay khi bạn vào khung. Hợp nhất khi tự quay một mình.', c: 'ora' },
      { ic: '🎯', t: 'Dynamic Framing', d: 'Giữ bạn ở giữa khung (hoặc một vị trí đã đặt) mà không cần ai cầm máy di chuyển theo.', c: 'amb' },
    ], 3) + box('warn', 'ActiveTrack KHÔNG hoạt động trong các chế độ Panorama, Low-Light Video, Slow Motion, Timelapse, Motionlapse và SpinShot (DJI công bố chính thức) — quay thử một đoạn ngắn trước khi giao cả buổi quay cho nó.'),
  },

  /* 10 — 3 cách dùng iPad làm màn hình xem mình */
  {
    t: 'iPad làm màn hình xem mình — cách nào thật sự dùng được',
    body: table(
      ['Cách', 'Quay bằng máy nào', 'Cần gì', 'Đã kiểm (09/2026)'],
      [
        ['DJI Mimo trên iPad', 'Pocket 3', 'iPadOS 15.0+, Bluetooth và Wi-Fi bật cả hai máy', '+Có — xem trực tiếp HD, không cần dây'],
        ['Blackmagic Camera — điều khiển từ xa', 'iPhone (chạy app Blackmagic Camera)', 'iPad cùng app, cùng mạng Wi-Fi, đặt iPad làm "controller"', '+Có — xem multiview, chỉnh phơi sáng/nét từ xa'],
        ['Continuity Camera', '—', '—', '-Không áp dụng — chỉ biến iPhone thành webcam CHO MAC, không phải màn hình xem lại khi tự quay'],
      ],
    ),
  },

  /* 11 — đánh dấu vị trí + chân máy mini + gậy nối */
  {
    t: 'Đánh dấu vị trí · chân máy mini · gậy nối',
    body: cards([
      { ic: '🩹', t: 'Băng dính đánh dấu chân đứng', d: 'Dán một chữ X dưới sàn đúng chỗ đã canh khung hình — liếc xuống một giây để đứng lại đúng chỗ, thay vì đoán và quay lại nhiều lần.', c: 'red' },
      { ic: '📐', t: 'Chân máy mini', d: 'Tay cầm và battery grip của Pocket 3 đều có ren 1/4 inch ở đáy — gắn thẳng Mini Tripod (phụ kiện chính hãng) để đặt máy cố định, không cần cầm tay.', c: 'ora' },
      { ic: '🦯', t: 'Gậy nối / gậy tự sướng', d: 'Nối dài Pocket 3 ra xa hơn sải tay — hữu ích cho toàn cảnh rộng hơn hoặc góc cao mà một mình không tự cầm tới.', c: 'amb' },
    ], 3),
  },

  /* 12 — checklist 3 cột trước/trong/sau */
  {
    t: 'Checklist ngày quay — Trước · Trong · Sau',
    body: steps([
      [`<b>TRƯỚC</b><ul style="margin:6px 0 0;padding-left:18px;font-size:15px;line-height:1.5;color:#d6deea">
        <li>Sạc đầy pin + mang pin/battery grip dự phòng</li>
        <li>Thẻ nhớ đã format TRONG máy (Ch6)</li>
        <li>Lau ống kính và cảm biến</li>
        <li>Cài fps/độ phân giải/WB/profile theo preset (Ch5–6)</li>
        <li>Thử mức thu âm + room tone 30 giây (Ch9)</li>
        </ul>`],
      [`<b>TRONG</b><ul style="margin:6px 0 0;padding-left:18px;font-size:15px;line-height:1.5;color:#d6deea">
        <li>Vỗ tay ngay khi cả hai máy đã bấm quay (nối Ch9.4, Ch13.3)</li>
        <li>Nói tên clip/số thứ tự trước mỗi shot (slate miệng)</li>
        <li>Xem lại ngay nếu nghi ngờ hỏng, đừng đợi tới lúc dựng</li>
        <li>Đổi pin/thẻ ở điểm dừng tự nhiên, không giữa hành động</li>
        </ul>`],
      [`<b>SAU</b><ul style="margin:6px 0 0;padding-left:18px;font-size:15px;line-height:1.5;color:#d6deea">
        <li>Đổ thẻ CẢ HAI máy ngay trong ngày (quy trình đủ ở Ch11)</li>
        <li>Sạc lại toàn bộ pin cho buổi sau</li>
        <li>Chỉ xoá thẻ SAU khi đã sao lưu</li>
        </ul>`],
    ], { row: true }),
  },

  /* 13 — quay nơi công cộng ở Việt Nam */
  {
    t: 'Quay nơi công cộng ở Việt Nam — quyền đối với hình ảnh',
    body: box('info', '<strong>Điều 32 Bộ luật Dân sự 2015</strong> — cá nhân có quyền đối với hình ảnh của mình; sử dụng hình ảnh của cá nhân phải được người đó đồng ý.') +
      `<div style="height:10px"></div>` +
      box('good', '<strong>Ngoại lệ</strong> — hình ảnh sử dụng từ hoạt động CÔNG CỘNG (hội nghị, hội thảo, thi đấu thể thao, biểu diễn nghệ thuật...) không cần xin phép từng người, miễn không làm tổn hại danh dự, nhân phẩm, uy tín của người có hình ảnh.') +
      `<div style="height:10px"></div>` +
      box('warn', '<strong>Trẻ em</strong> — Điều 21 Luật Trẻ em 2016: trẻ em có quyền bất khả xâm phạm về đời sống riêng tư, bí mật cá nhân. Không quay cận, không đăng hình trẻ em lạ mà chưa hỏi cha mẹ hoặc người giám hộ.') +
      `<p class="c-note" style="text-align:center;margin-top:10px">Thông tin tham khảo, không phải tư vấn pháp lý. Địa điểm cấm quay (khu quân sự, an ninh...) — hỏi tại chỗ, đừng đoán danh sách.</p>`,
  },

  /* 14 — bảng tra nhanh cả chương */
  {
    t: 'Bảng tra nhanh — Chương 10',
    body: table(
      ['Chủ đề', 'Chốt lại', 'Nguồn / ghi chú'],
      [
        ['Góc 2 máy', '30–45° lệch trục, quay ĐỒNG THỜI = coverage không cần quay lại', 'Bài 10.1'],
        ['Khoá trước khi quay', 'AE/AF Lock (giữ chạm), Lock White Balance', 'Apple · Ch5–6'],
        ['Tự động bám bạn', 'ActiveTrack 6.0 (chạm đúp) · Face Auto-Detect (tự động)', 'dji.com/osmo-pocket-3/faq'],
        ['Màn hình xem mình', 'DJI Mimo (Pocket 3) · Blackmagic Camera "controller" (iPhone)', 'KHÔNG phải Continuity Camera'],
        ['B-roll', 'Gấp 3 lần bạn nghĩ, chuỗi 5 shot cho một hành động', 'Nối Ch4.2 coverage'],
        ['Quay nơi công cộng', 'Cần sự đồng ý khi dùng hình ảnh, trừ hoạt động công cộng', 'Điều 32 BLDS 2015'],
      ],
      { sm: true },
    ),
  },

  /* 15 — thực hành */
  {
    t: 'Thực hành',
    body: steps([
      ['Dựng A-cam (iPhone) chính diện + B-cam (Pocket 3) lệch 30–45°, bấm quay cả hai cùng lúc', 'Một buổi nói 60 giây, hai góc dựng'],
      ['Khoá AE/AF trên iPhone (giữ chạm tới khi thấy chữ AE/AF Lock) TRƯỚC câu đầu tiên', 'Không đợi tới giữa cảnh mới khoá'],
      ['Bật ActiveTrack hoặc Face Auto-Detect trên Pocket 3, đứng dậy đi vài bước xem máy có bám không', 'Thử trước khi tin cho cả buổi quay'],
      ['Quay một chuỗi 5 shot B-roll cho đúng một hành động (gõ phím, mở laptop...)', 'Quy trình · chi tiết · bối cảnh · phản ứng · môi trường'],
      ['Chạy hết checklist Trước/Trong/Sau một lần thật, tính giờ xem mất bao lâu', 'Lần sau sẽ nhanh hơn nhiều'],
    ]),
  },
]);
