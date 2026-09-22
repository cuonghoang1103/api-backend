/**
 * cr-11.mjs — Content Creator, Chương 11: Quy trình hậu kỳ & dữ liệu.
 * Cấu trúc thư mục & đặt tên · sao chép có kiểm toàn vẹn · sao lưu 3-2-1 ·
 * chọn phần mềm dựng · vì sao H.265 nặng khi dựng · proxy (đo thật bằng ffmpeg).
 *
 *   node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/cr-11.mjs
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/cr-11.mjs --out <dir>
 *
 * Nguồn số liệu chính (đầy đủ trong báo cáo bàn giao):
 *  - Giá phần mềm, đã kiểm 22/09/2026: blackmagicdesign.com/products/davinciresolve
 *    (Free thật sự miễn phí; Studio 295 USD mua đứt) · apple.com/final-cut-pro
 *    (299,99 USD mua đứt Mac; hoặc gói Apple Creator Studio 12,99 USD/tháng ·
 *    129 USD/năm) · apple.com/final-cut-pro-for-ipad (FCP cho iPad nay CHỈ qua
 *    Creator Studio, không còn bán riêng) · adobe.com/products/premiere.html
 *    (gói 1 app từ 22,99 USD/tháng, trả theo năm) · apps.apple.com — LumaFusion
 *    (29,99 USD mua đứt; yêu cầu Mac nay là Apple Silicon) · capcut.com/help —
 *    CapCut Pro "giá tuỳ khu vực/thiết bị", KHÔNG niêm yết một mức USD chung
 *    nên bài học không bịa số.
 *  - DaVinci Resolve trên Linux: Rocky Linux 8.6 là distro CHÍNH THỨC DUY NHẤT
 *    (kiểm 22/09/2026) — Fedora không nằm trong danh sách; bản Free không giải
 *    mã H.264/HEVC/AAC trên Linux (đã kiểm sâu ở cr-13 / Chương 13.4, deck này
 *    chỉ nhắc lại ở mức trỏ sang, không lặp lại chi tiết trang/thiết bị).
 *  - "Generate Proxy Media" / "Generate Optimized Media": tên chức năng thật
 *    trong DaVinci Resolve (forum.blackmagicdesign.com + tài liệu cộng đồng
 *    hội tụ cùng một tên). CapCut desktop: "Proxy" nằm trong Settings →
 *    Performance (hội tụ nhiều nguồn, không có một trang capcut.com đơn lẻ để
 *    dẫn link — bài học nêu tính năng, không gắn link-card cho riêng mục này).
 *  - MỌI số trên bars() slide 12 là ffmpeg/ffprobe chạy THẬT trên máy này với
 *    clip lavfi testsrc2 tự sinh (3840×2160, 25fps, 5 giây, H.265 ~100Mbps mô
 *    phỏng máy quay) rồi chuyển sang ProRes Proxy và DNxHR LB — xem báo cáo bàn
 *    giao để có toàn bộ lệnh + output gốc. KHÔNG phải số liệu chính thức của
 *    DJI/Apple/Blackmagic.
 */
import { S, cover, cards, box, steps, table, vs, flow, mindmap, tree, bars, backup321, two } from './_cr-chung.mjs';

export const deck = {
  key: 'cr-11',
  code: 'CR · CHƯƠNG 11',
  title: 'Quy trình hậu kỳ & dữ liệu',
  sub: 'Content Creator · Chương 11',
};

export const slides = S([
  /* 1 — bìa */
  cover({
    t: 'Chương 11 — Quy trình hậu kỳ & dữ liệu',
    sub: 'Đặt tên & nhập liệu · Sao lưu 3-2-1 · Chọn phần mềm dựng · Proxy & máy Linux',
    chap: 'CHƯƠNG 11',
  }),

  /* 2 — bản đồ chương */
  {
    t: 'Bản đồ chương',
    body: mindmap('CHƯƠNG 11', 'giai đoạn 3 — hậu kỳ bắt đầu ở đây, trước khi mở phần mềm dựng', [
      { t: '🗂 Nhập liệu & đặt tên', d: 'Cấu trúc thư mục, sao chép có kiểm toàn vẹn', c: 'red' },
      { t: '🔐 Sao lưu 3-2-1', d: 'SSD làm việc · HDD · máy Linux ở nhà · cloud', c: 'ora' },
      { t: '🎬 Chọn phần mềm dựng', d: 'CapCut · Resolve · FCP · Premiere · LumaFusion', c: 'amb' },
      { t: '🐢 Vì sao H.265 nặng', d: 'Long-GOP (máy quay) so với all-intra (proxy)', c: 'tea' },
      { t: '🧊 Proxy — đo thật', d: 'ffmpeg tạo ProRes Proxy & DNxHR LB, cân đo thật', c: 'blu' },
      { t: '🐧 Máy Linux & Resolve free', d: 'Giới hạn codec thật — Chương 13.4 nói đầy đủ', c: 'vio' },
    ]),
  },

  /* 3 — cấu trúc thư mục */
  {
    t: 'Cấu trúc thư mục dự án — đặt tên trước khi bấm quay',
    body: tree(`2026-09-22_vlog-thu-vien-fptu/
├── 01_footage/              # cảnh quay gốc, KHÔNG sửa
│   ├── A-cam/                 # Pocket 3 — máy A
│   │   ├── A001_C001_0922XY.MP4
│   │   └── A001_C002_0922XY.MP4
│   └── B-cam/                 # iPhone — máy B
│       ├── B001_0922AB.MP4
│       └── B002_0922AB.MP4
├── 02_audio/                # DJI Mic ghi rời, nếu có
│   └── B001_0922AB.WAV
├── 03_project/               # file .drp / project CapCut
│   └── vlog-thu-vien-fptu.drp
├── 04_export/                 # bản xuất cuối
└── 05_thumbnail/              # ảnh đại diện .psd/.png`) +
      box('info', '<code>YYYY-MM-DD_slug</code> tự SẮP XẾP theo thời gian trong Finder/Explorer mà không cần đổi tên sau — script tạo cây này ở Bài 11.1 chạy thật, dán output <code>tree</code> thật.'),
  },

  /* 4 — sao chép có kiểm toàn vẹn */
  {
    t: 'Sao chép có kiểm toàn vẹn — đừng tin vào mắt',
    body: steps([
      ['rsync -a --checksum bản gốc → ổ sao lưu', 'So khớp theo NỘI DUNG từng byte — không tin ngày-giờ sửa đổi hay dung lượng file'],
      ['shasum -a 256 cả hai bên, đối chiếu', 'Cách kiểm "đã sao y hệt chưa" đúng nghĩa — không đoán bằng mắt hay phát thử vài giây'],
      ['Lệch một hash → chạy lại rsync --checksum', 'Đo thật: rsync THƯỜNG (thiếu --checksum) bỏ sót đúng file hỏng vì size/mtime vẫn giống hệt bản gốc'],
      ['Khớp lại 100% → mới được format thẻ nhớ', 'Điều kiện xoá thẻ là "khớp checksum", không phải "thấy thanh copy chạy xong"'],
    ]),
  },

  /* 5 — quy trình đổ thẻ */
  {
    t: 'Quy trình đổ thẻ — bốn bước, đúng thứ tự',
    body: flow([
      { e: '💳', t: '1 · Đổ thẻ', d: 'Copy vào 01_footage theo đúng cây thư mục', c: 'red' },
      { e: '🔍', t: '2 · Kiểm', d: 'rsync --checksum + shasum — khớp mới đi tiếp', c: 'ora' },
      { e: '🔐', t: '3 · Sao lưu', d: 'Bản thứ 2 và 3 theo luật 3-2-1', c: 'grn' },
      { e: '✂️', t: '4 · Dựng', d: 'Chỉ mở phần mềm dựng SAU khi có ≥ 2 bản', c: 'blu' },
    ]) + box('warn', 'Đảo bước 3 và 4 là thói quen gây mất cảnh quay phổ biến nhất: dựng xong trên bản DUY NHẤT trên thẻ, format thẻ để quay tiếp, rồi ổ cứng dựng hỏng đúng tuần đó.'),
  },

  /* 6 — sao lưu 3-2-1 */
  {
    t: 'Sao lưu 3-2-1',
    body: backup321(),
  },

  /* 7 — giữ gì xoá gì */
  {
    t: 'Sau khi đã đăng — giữ gì, xoá gì',
    body: two(
      box('good', '<b>Giữ lại</b><br>Dự án dựng (.drp…) · cảnh ĐÃ CHỌN dùng trong bản final (selects) · file xuất cuối cùng · nhạc/SFX có bản quyền · LUT/preset màu riêng của bạn'),
      box('warn', '<b>Cân nhắc xoá (chỉ SAU khi đã có ≥ 2 bản sao)</b><br>Cảnh hỏng/trùng/rung nặng · proxy đã hết cần dùng · footage gốc — KHÔNG xoá nếu chưa chắc còn bản sao khác đọc được'),
    ),
  },

  /* 8 — bảng so sánh phần mềm */
  {
    t: 'Chọn phần mềm dựng — 5 lựa chọn, một bảng',
    body: table(
      ['Phần mềm', 'Giá (đã kiểm 09/2026)', 'Chạy trên máy nào', 'Độ khó'],
      [
        ['CapCut', '+Miễn phí · CapCut Pro trả phí, giá tuỳ khu vực/thiết bị', 'Mac·Win·iPad·điện thoại·web', 'Dễ'],
        ['DaVinci Resolve', '+Miễn phí · Studio 295 USD mua đứt', 'Mac·Win·Linux (giới hạn)·iPad (app riêng)', 'Trung bình–khó'],
        ['Final Cut Pro', '299,99 USD mua đứt (Mac) · hoặc Creator Studio 12,99 USD/tháng', 'Mac (Intel lẫn Apple Silicon) · iPad chỉ qua Creator Studio', 'Trung bình'],
        ['Premiere Pro', 'Từ 22,99 USD/tháng (gói 1 app, trả theo năm)', 'Mac·Win', 'Trung bình–khó'],
        ['LumaFusion', '29,99 USD mua đứt', 'iPad·iPhone·Mac (Apple Silicon)·Android·ChromeOS', 'Trung bình'],
      ],
    ),
  },

  /* 9 — khuyến nghị cho Cường */
  {
    t: 'Khuyến nghị cho đúng đồ nghề của bạn',
    body: cards([
      { ic: '⚡', t: 'Video ngắn, cần nhanh', d: 'CapCut trên Mac — phụ đề tự động, xuất tối ưu TikTok/Reels/Shorts. Chương 12 dạy trọn vẹn.', c: 'amb' },
      { ic: '🎨', t: 'Video dài, cần màu & âm sâu', d: 'DaVinci Resolve trên Mac — một app cho cả dựng, màu (Ch15), mix âm (Ch16). Chương 13 dạy trọn vẹn.', c: 'blu' },
      { ic: '📱', t: 'Dựng thô khi không có Mac', d: 'CapCut hoặc DaVinci Resolve for iPad — Blackmagic Cloud đồng bộ dự án, không đồng bộ footage (Ch13.4).', c: 'grn' },
      { ic: '🐧', t: 'Máy Linux ở nhà', d: 'Sao lưu · chuyển mã ffmpeg · Whisper phụ đề (Ch16) là chính; dựng được nhưng có giới hạn codec thật (11.4).', c: 'vio' },
    ], 2) + box('info', 'FCP và Premiere không nằm trong lộ trình bắt buộc của khoá — biết chúng tồn tại, có giá, và chạy được ở đâu là đủ để không hoang mang khi đồng nghiệp/khách hàng nhắc tới.'),
  },

  /* 10 — Long-GOP vs all-intra */
  {
    t: 'Vì sao dựng thẳng trên file máy quay hay bị giật',
    body: vs({
      no: { t: 'Dựng thẳng trên Long-GOP gốc (H.264/HEVC)', items: [
        'Phần lớn khung là P/B — CHỈ lưu phần khác so với khung trước/sau',
        'Tua tới một khung giữa GOP = phải giải hết chuỗi khung trước nó',
        'CPU gồng liên tục khi tua timeline — vẫn đúng codec để LƯU TRỮ, chỉ sai để DỰNG',
      ] },
      yes: { t: 'Dựng trên proxy all-intra (ProRes/DNxHR)', items: [
        'MỌI khung tự đủ dữ liệu — không tham chiếu khung khác',
        'Tua tới khung bất kỳ = giải đúng một khung đó',
        'Đổi lại: file proxy có thể NẶNG HƠN bản gốc về dung lượng — số đo thật ở slide 12',
      ] },
    }),
  },

  /* 11 — proxy vs optimized media, tên thật */
  {
    t: 'Proxy khác Optimized Media — tên chức năng thật',
    body: table(
      ['Phần mềm', 'Tên chức năng', 'Làm gì'],
      [
        ['DaVinci Resolve', '!Generate Proxy Media', 'Tạo file RIÊNG, độ phân giải/codec tự chọn — mang đi máy khác, chia sẻ được'],
        ['DaVinci Resolve', 'Generate Optimized Media', 'Bản nội bộ trong chính dự án (.dvcc) — nhanh hơn để tạo, KHÔNG mang đi nơi khác'],
        ['CapCut (máy tính)', 'Settings → Performance → Proxy', 'Chỉ giảm độ phân giải XEM TRƯỚC tạm thời — bản xuất cuối vẫn full chất lượng gốc'],
      ],
    ) + box('warn', 'Optimized Media KHÔNG phải file di động được — copy dự án Resolve sang máy khác mà không mang theo Media Cache là mất luôn bản tối ưu đó, phải tạo lại.'),
  },

  /* 12 — đo thật: dung lượng & tốc độ giải mã */
  {
    t: 'Dung lượng & tốc độ giải mã — số đo thật bằng ffmpeg',
    body: `<p class="c-note" style="margin:0 0 4px"><b style="color:#fff">Dung lượng thật — clip 4K25 5 giây, HEVC ~100Mbps mô phỏng máy quay</b></p>` +
      bars([
        { l: 'Gốc — HEVC Long-GOP', sub: '~99,3 Mbps đo được', v: 62.2, txt: '62,2 MB', c: 'amb' },
        { l: 'ProRes Proxy', sub: '~62,4 Mbps đo được', v: 39.5, txt: '39,5 MB (nhẹ hơn 36%)', c: 'grn' },
        { l: 'DNxHR LB', sub: '~149,9 Mbps đo được', v: 94.2, txt: '94,2 MB (nặng hơn 51%)', c: 'red' },
      ], { lw: 300, max: 100 }) +
      `<p class="c-note" style="margin:14px 0 4px"><b style="color:#fff">Tốc độ GIẢI MÃ thật — cùng ba file, &#96;ffmpeg -i … -f null -&#96;, đồng hồ thật</b></p>` +
      bars([
        { l: 'Gốc — HEVC Long-GOP', v: 1.31, txt: '1,31 giây', c: 'amb' },
        { l: 'ProRes Proxy', v: 0.56, txt: '0,56 giây (nhanh 2,3×)', c: 'grn' },
        { l: 'DNxHR LB', v: 0.35, txt: '0,35 giây (nhanh 3,7×)', c: 'tea' },
      ], { lw: 300, max: 1.4 }),
  },

  /* 13 — Resolve free trên Linux */
  {
    t: 'DaVinci Resolve free trên máy Linux — giới hạn thật',
    body: box('danger', '<b>Bản MIỄN PHÍ trên Linux không giải mã được H.264/HEVC hay AAC</b> — đúng codec Pocket 3 và iPhone ghi ra. Mở thẳng file gốc = clip đen hoặc không tiếng, không phải cài đặt hỏng.') +
      box('warn', '<b>Rocky Linux 8.6 là distro CHÍNH THỨC DUY NHẤT</b> (đã kiểm 09/2026) — Fedora ở máy bạn KHÔNG nằm trong danh sách đó. Chạy được không có nghĩa là được hỗ trợ chính thức.') +
      box('info', 'Cách sửa giống hệt slide 12: chuyển mã bằng ffmpeg sang ProRes/DNxHR + audio PCM trước khi dựng trên máy Linux. Bài 13.4 nói đầy đủ yêu cầu GPU/RAM và quy trình 10 bước trên cả ba máy.'),
  },

  /* 14 — bảng tra nhanh */
  {
    t: 'Bảng tra nhanh cả chương',
    body: table(
      ['Bạn muốn', 'Làm gì', 'Công cụ'],
      [
        ['Không lẫn lộn cảnh quay giữa các buổi', 'Đặt tên YYYY-MM-DD_slug ngay khi tạo thư mục', 'Script Bài 11.1'],
        ['Chắc chắn bản sao không hỏng', 'rsync -a --checksum rồi đối chiếu shasum -a 256', 'Terminal'],
        ['Không mất trắng nếu hỏng một ổ', 'Luật 3-2-1 — không dừng ở 1 bản trên thẻ', 'SSD·HDD·máy Linux'],
        ['Dựng video ngắn thật nhanh', 'CapCut — miễn phí, giao diện đơn giản', 'Chương 12'],
        ['Dựng video dài, chỉnh màu/âm sâu', 'DaVinci Resolve — một app cho cả quy trình', 'Chương 13'],
        ['Timeline hết giật với clip 4K', 'Tạo proxy all-intra trước khi dựng', 'ffmpeg / Generate Proxy Media'],
      ],
    ),
  },

  /* 15 — thực hành */
  {
    t: '🎬 Thực hành',
    body: steps([
      ['Viết một script bash tự tạo cây thư mục YYYY-MM-DD_slug cho buổi quay tiếp theo', 'Chạy thử, dán output &#96;tree&#96; hoặc &#96;find&#96; thật vào ghi chú của bạn.'],
      ['Đổ một thẻ nhớ thật bằng rsync -a --checksum, rồi đối chiếu shasum -a 256 hai bên', 'Chỉ format thẻ SAU khi khớp 100% — không phải sau khi thanh copy chạy xong.'],
      ['Dựng một bảng 3-2-1 cho chính bộ đồ nghề của bạn: đâu là ổ 1, ổ 2, "nơi khác"', 'Máy Linux ở nhà đóng vai bản thứ 3 — ghi rõ tần suất bạn thật sự đồng bộ tới đó.'],
      ['Tạo thử một proxy ProRes hoặc DNxHR từ một clip 4K của chính bạn', 'So dung lượng trước/sau bằng &#96;ls -l&#96; — đừng tin con số trong bài này thay cho số của chính bạn.'],
    ]) + box('good', '<b>Đạt khi:</b> bạn có một cây thư mục thật đã tạo bằng script của mình, một cặp bản sao đã đối chiếu checksum khớp 100%, và giải thích được vì sao proxy "nặng hơn nhưng nhẹ hơn" không phải nghịch lý.'),
  },
]);
