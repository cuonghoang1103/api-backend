/** Content Creator · Deck cr-16 — Chương 16: Âm thanh hậu kỳ, chữ, đồ hoạ & phụ đề. */
import { two, steps, S, cover, cards, box, table, mindmap, bars, meter, chart, flow, code, note, C, esc } from './_cr-chung.mjs';

export const deck = { key: 'cr-16', code: 'CR · CHƯƠNG 16', title: 'Âm thanh hậu kỳ, chữ, đồ hoạ & phụ đề', sub: 'Content Creator · Chương 16' };

/* Chữ SVG dùng chung cho hình tự vẽ trong deck này (bản rút gọn của T() trong _cr-chung.mjs — không export nên khai lại). */
const t = (x, y, s, { size = 16, fill = C.tx, anchor = 'start', weight = 400, mono = false, op } = {}) =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}"` +
  ` font-family="${mono ? "'SF Mono',Menlo,monospace" : "-apple-system,'Segoe UI',Arial,sans-serif"}"${op ? ` opacity="${op}"` : ''}>${esc(s)}</text>`;

/* ── Phụ đề trong vùng an toàn: hai khung điện thoại 9:16, đặt SAI vs ĐÚNG. ─── */
const subtitleZones = () => {
  const W = 1160, H = 380, pw = 540, gap = 40;
  const panel = (x0, correct) => {
    let s = `<rect x="${x0}" y="20" width="${pw}" height="300" rx="14" fill="#11161f" stroke="#2a3446" stroke-width="2"/>`;
    const phW = 158, phH = 280, phX = x0 + (pw - phW) / 2, phY = 30;
    const topH = phH * 0.10, botH = phH * 0.22, rightW = phW * 0.16;
    // khung video tối
    s += `<rect x="${phX}" y="${phY}" width="${phW}" height="${phH}" rx="10" fill="#1b2230" stroke="#3a4558" stroke-width="1.5"/>`;
    // vùng UI nền tảng che (đỏ mờ): trên, dưới, phải
    s += `<rect x="${phX}" y="${phY}" width="${phW}" height="${topH.toFixed(1)}" fill="${C.red}" opacity=".38"/>`;
    s += `<rect x="${phX}" y="${(phY + phH - botH).toFixed(1)}" width="${phW}" height="${botH.toFixed(1)}" fill="${C.red}" opacity=".38"/>`;
    s += `<rect x="${(phX + phW - rightW).toFixed(1)}" y="${(phY + topH).toFixed(1)}" width="${rightW.toFixed(1)}" height="${(phH - topH - botH).toFixed(1)}" fill="${C.red}" opacity=".38"/>`;
    // vùng an toàn (nét đứt xanh)
    const sx = phX + 5, sy = phY + topH + 5, sw = phW - rightW - 10, sh = phH - topH - botH - 10;
    s += `<rect x="${sx.toFixed(1)}" y="${sy.toFixed(1)}" width="${sw.toFixed(1)}" height="${sh.toFixed(1)}" fill="none" stroke="${C.grn}" stroke-width="2" stroke-dasharray="5 4" rx="4"/>`;
    // viền icon phải (thích/bình luận) để trông giống UI thật
    [0.3, 0.45, 0.6].forEach((k) => { s += `<circle cx="${(phX + phW - rightW / 2).toFixed(1)}" cy="${(phY + phH * k).toFixed(1)}" r="6" fill="#e9eef6" opacity=".5"/>`; });
    // pill phụ đề
    const capW = correct ? sw - 6 : phW - 20;
    const capX = correct ? sx + 3 : phX + 10;
    const capY = correct ? sy + sh - 30 : phY + phH - botH / 2 - 11;
    const capC = correct ? C.grn : C.red;
    s += `<rect x="${capX.toFixed(1)}" y="${capY.toFixed(1)}" width="${capW.toFixed(1)}" height="22" rx="5" fill="#0b0e14" stroke="${capC}" stroke-width="2" opacity="${correct ? 1 : 0.95}"/>`;
    s += t(capX + capW / 2, capY + 15, 'Hôm nay mình sẽ…', { size: 11.5, anchor: 'middle', weight: 700, fill: '#f2f5fa' });
    // huy hiệu ✓ / ✕
    const bx = correct ? sx + sw + 14 : phX + phW + 14;
    const by = correct ? capY + 11 : capY + 11;
    s += `<circle cx="${bx}" cy="${by}" r="13" fill="${correct ? C.grn : C.red}"/>`;
    s += t(bx, by + 5, correct ? '✓' : '✕', { size: 15, anchor: 'middle', weight: 800, fill: '#0b0e14' });
    return s;
  };
  let s = `<svg class="c-svg" viewBox="0 0 ${W} ${H}" width="${W}">`;
  s += t(20 + pw / 2, 12, 'SAI — PHỤ ĐỀ ĐÈ LÊN VÙNG UI NỀN TẢNG', { size: 15, anchor: 'middle', weight: 800, fill: '#e9eef6' });
  s += `<g>${panel(20, false)}</g>`;
  s += t(20 + pw / 2, 350, '❌ Bị nút thích/bình luận/tên tài khoản che trên điện thoại thật', { size: 14.5, anchor: 'middle', fill: C.red, weight: 700 });
  s += t(20 + pw + gap + pw / 2, 12, 'ĐÚNG — PHỤ ĐỀ TRONG VÙNG AN TOÀN', { size: 15, anchor: 'middle', weight: 800, fill: '#e9eef6' });
  s += `<g>${panel(20 + pw + gap, true)}</g>`;
  s += t(20 + pw + gap + pw / 2, 350, '✅ Nằm trong khung nét đứt — đọc được trên mọi nền tảng', { size: 14.5, anchor: 'middle', fill: C.grn, weight: 700 });
  return s + `</svg>`;
};

export const slides = S([
  cover({ t: 'Chương 16 — Âm thanh hậu kỳ, chữ, đồ hoạ & phụ đề', sub: 'LUFS & chuỗi xử lý giọng · chữ/đồ hoạ trên hình · phụ đề SRT · Whisper trên máy Linux', chap: 'CHƯƠNG 16' }),

  { t: 'Bản đồ chương', body: mindmap('Âm thanh hậu kỳ, chữ & phụ đề', 'Chương 16', [
    { t: '🎚️ Mix âm thanh', d: 'LUFS, true peak, chuỗi xử lý giọng', c: 'red' },
    { t: '🔤 Chữ & đồ hoạ', d: 'Lower third, callout, font tiếng Việt', c: 'ora' },
    { t: '📝 Phụ đề', d: 'SRT, cứng/mềm, vùng an toàn, song ngữ', c: 'amb' },
    { t: '🖥️ Whisper trên Linux', d: 'faster-whisper GPU → SRT VI/EN', c: 'tea' },
    { t: '✅ Nối từ', d: 'Ch9 (thu âm) · Ch12/13 (dựng) · Ch14.4 (ducking)', c: 'blu' },
    { t: '➡️ Nối tới', d: 'Ch17–19 hiệu ứng & VFX · Ch24 xuất & đăng', c: 'vio' },
  ]) },

  { t: 'Vì sao mix hậu kỳ khác lúc quay', body: cards([
    { ic: '🎙️', t: 'Ch9 lo lúc QUAY', d: 'Canh đỉnh −12…−6dBFS bằng ffmpeg volumedetect — không để vỡ tiếng ngay từ đầu.', c: 'blu' },
    { ic: '🎚️', t: 'Ch16 lo lúc MIX', d: 'Đỉnh đã sạch không có nghĩa là ĐỘ LỚN CẢM NHẬN đã đúng chuẩn nền tảng — đó là việc của LUFS.', c: 'amb' },
    { ic: '📏', t: 'dBFS đo tức thời', d: 'Nhảy theo từng mẫu âm — hữu ích để canh KHÔNG VỠ, không nói lên video "nghe to cỡ nào".', c: 'grn' },
    { ic: '👂', t: 'LUFS đo cảm nhận', d: 'Tích hợp theo thời gian, gần với tai người hơn — nền tảng dùng LUFS để tự cân bằng độ lớn giữa các video.', c: 'tea' },
  ], 2) },

  { t: 'dBFS tức thời vs LUFS cảm nhận (minh hoạ)', body: chart({
    series: [
      { t: 'dBFS tức thời (nhấp nhô)', c: 'red', wd: 2.5, dash: true, pts: [[0, -18], [1, -9], [2, -22], [3, -7], [4, -25], [5, -10], [6, -30], [7, -8], [8, -20], [9, -6], [10, -24], [11, -9], [12, -16]] },
      { t: 'LUFS tích hợp (mượt, gần tai người)', c: 'tea', wd: 4.5, at: 0, anchor: 'start', dx: 6, dy: -14, pts: [[0, -17], [2, -16.6], [4, -16.8], [6, -16.3], [8, -16.6], [10, -16.2], [12, -16.4]] },
    ],
    x: [0, 12, 'thời gian (giây) — minh hoạ'], y: [-35, 0, 'dB / LUFS'], xt: 6, yt: 5,
    notes: [{ x: 9, y: -6, t: 'đỉnh tức thời −6dBFS — phản ứng NGAY, khác LUFS', c: 'amb', dx: -14, dy: -14, anchor: 'end' }],
  }) },

  { t: 'Đo & chuẩn hoá thật bằng ffmpeg — 2 lượt', body: two(
    bars([
      { l: 'Trước chuẩn hoá (đo bằng ebur128)', v: 42.0, txt: '−42,0 LUFS', c: 'red' },
      { l: 'Sau loudnorm 2 lượt — mục tiêu −14 LUFS', v: 14.0, txt: '−14,0 LUFS', c: 'grn' },
    ], { lw: 340 }),
    code('# Lượt 1 — chỉ ĐO (measured_*)\nffmpeg -i in.wav -af loudnorm=I=-14:TP=-1:LRA=11:\\\n  print_format=json -f null -\n\n# Lượt 2 — ÁP dụng đúng số vừa đo, linear=true\nffmpeg -i in.wav -af loudnorm=I=-14:TP=-1:LRA=11:\\\n  measured_I=-42.05:measured_TP=-41.05:measured_LRA=0.00:\\\n  measured_thresh=-52.05:offset=-0.05:linear=true out.wav', 'bash')
    + note('Đo lại bằng ebur128 (độc lập với loudnorm) sau lượt 2: I = −14,0 LUFS — đúng mục tiêu. Số đo thật, chạy trên máy này.')
  ) },

  { t: 'True peak — trần −1 dBTP (EBU R128)', body: meter([
    { t: 'Sau loudnorm (đo thật)', peak: -13.1, v: 'good' },
    { t: 'Mix ẩu (minh hoạ)', peak: -0.4, v: 'clip' },
  ], { target: [-3, -1] }) + note('EBU R128 khuyến nghị true peak sản xuất KHÔNG vượt −1 dBTP (tech.ebu.ch/docs/r/r128.pdf) — chừa thêm 1dB dưới trần để an toàn cho méo liên-mẫu (inter-sample peak) khi nền tảng transcode lại.') },

  { t: 'Chuỗi xử lý giọng', body: flow([
    { e: '🔇', t: 'Khử ồn', d: 'Voice Isolation (Resolve Studio) · Reduce noise (CapCut Pro)', c: 'red' },
    { e: '🎚️', t: 'EQ', d: 'Cắt thấp ~80–100Hz — bớt ù, rung tay, gió nền', c: 'ora' },
    { e: '🗜️', t: 'Compressor', d: 'Đều chênh lệch to/nhỏ giữa các câu', c: 'amb' },
    { e: '🔤', t: 'De-esser', d: 'Giảm tiếng rít "s/x" gắt', c: 'tea' },
    { e: '🚧', t: 'Limiter', d: 'Chặn cứng trước trần −1dBTP', c: 'blu' },
    { e: '🎵', t: 'Nhạc nền', d: 'Ducking dưới giọng — đã học Ch12.3/14.4', c: 'vio' },
  ]) },

  { t: 'Fairlight: miễn phí hay Studio?', body: table(['Công cụ', 'Miễn phí', 'Studio'], [
    ['EQ 6-band · Compressor · Gate · De-esser · Limiter', '+Có', '+Có'],
    ['!Voice Isolation (AI tách giọng khỏi tạp âm)', '-Không', '+Có'],
    ['!AI noise reduction · Create Subtitles from Audio', '-Không', '+Có'],
    ['Ducking · Reduce noise · Enhance voice (CapCut)', 'xem lại Ch12.3', 'xem lại Ch12.3'],
  ]) + note('Công cụ TAY (EQ/Compressor/Gate/De-esser/Limiter) miễn phí đầy đủ trên Fairlight. Công cụ AI một-chạm (Voice Isolation, tạo phụ đề tự động) mới cần Studio.') },

  { t: 'Chữ & đồ hoạ cho video', body: cards([
    { ic: '🔤', t: 'Chữ đọc được', d: 'Không chân (sans-serif), đủ lớn, tương phản với nền, nằm trong lề an toàn.', c: 'blu' },
    { ic: '🪧', t: 'Lower third', d: 'Tên/chức danh góc dưới — vào/giữ/ra có chuyển động ease in-out, không giật.', c: 'amb' },
    { ic: '🎯', t: 'Callout cho video code', d: 'Mũi tên, khoanh vùng, zoom đúng dòng đang giảng — dẫn mắt người xem.', c: 'grn' },
    { ic: '🪪', t: 'Bộ nhận diện', d: 'Cùng font + cùng bảng màu lặp lại mỗi video → khán giả nhận ra kênh trong 1 giây.', c: 'pnk' },
  ], 2) },

  { t: 'Ba font tiếng Việt đủ dấu', body: table(['Font', 'Kiểu chữ', 'Hợp dùng cho'], [
    ['Be Vietnam Pro', 'Sans-serif, 18 kiểu đậm nhạt — thiết kế RIÊNG cho chữ Việt', 'Tiêu đề, lower third'],
    ['Inter', 'Sans-serif trung tính, rất nhiều độ đậm', 'Phụ đề, chữ nội dung dài'],
    ['Roboto', 'Sans-serif mặc định Android/Material', 'Chữ giao diện, callout ngắn'],
  ]) + note('Đã kiểm subset "Vietnamese" của cả 3 font trên fonts.google.com — 22/09/2026.') },

  { t: 'Phụ đề cứng (burn-in) và phụ đề mềm', body: table(['', 'Cứng (burn-in)', 'Mềm (soft/closed caption)'], [
    ['Bật/tắt được', '-Không — đã "in" vào hình', '+Có, người xem tự bật/tắt'],
    ['Sửa sau khi xuất', '-Phải render lại cả video', '+Sửa file phụ đề, không đụng video'],
    ['Dịch nhiều ngôn ngữ', '-Mỗi ngôn ngữ một bản video riêng', '+Một video, nhiều file/track phụ đề'],
    ['Khi nào dùng', 'Đăng nơi không hỗ trợ track riêng (một số video ngắn)', 'YouTube (upload .srt) — mặc định nên dùng'],
  ], { sm: true }) },

  { t: 'Cấu trúc file SRT thật', body: two(
    code('1\n00:00:00,000 --> 00:00:02,500\nChào mừng bạn quay lại kênh.\n\n2\n00:00:02,500 --> 00:00:05,200\nHôm nay mình sẽ nói về hậu kỳ âm thanh.\n\n3\n00:00:05,200 --> 00:00:08,000\nWelcome back to the channel.', 'plaintext'),
    table(['Phần', 'Ý nghĩa'], [
      ['Dòng 1', 'Số thứ tự cue, tăng dần'],
      ['Dòng 2', 'Mốc bắt đầu --> kết thúc, giờ:phút:giây,mili giây'],
      ['Dòng 3+', 'Văn bản hiển thị — tối đa 2 dòng'],
      ['Dòng trống', 'Ngăn cách các cue — bắt buộc'],
    ], { sm: true })
  ) + note('File .srt thật, viết tay đúng định dạng, kiểm được bằng mắt — YouTube xác nhận hỗ trợ .srt trong danh sách định dạng phụ đề chính thức.') },

  { t: 'Phụ đề trong vùng an toàn — đặt đúng/sai', body: subtitleZones() },

  { t: 'Whisper trên máy Linux → SRT VI/EN → Mac', body: flow([
    { e: '🎬', t: 'Clip quay', d: 'Pocket 3 / iPhone', c: 'blu' },
    { e: '🔊', t: 'Tách âm 16kHz mono', d: 'ffmpeg -vn -ac 1 -ar 16000 (đã chạy thật)', c: 'tea' },
    { e: '🖥️', t: 'faster-whisper GPU', d: 'RTX 3060 · medium · VAD · word_timestamps', c: 'amb' },
    { e: '📝', t: 'SRT VI + EN', d: 'task=translate cho bản dịch tiếng Anh', c: 'ora' },
    { e: '🔁', t: 'Đồng bộ về Mac', d: 'Chép qua mạng nhà → CapCut/Resolve', c: 'vio' },
  ]) + note('Đo trên máy nhà của bạn, 22/09/2026 (RTX 3060 12GB): VRAM rảnh chỉ ~1,3GB khi các dịch vụ khác đang chạy — không đủ cho model medium; tắt bớt một máy đọc TTS (2,9GB) → còn ~4,1GB, đủ chạy. 7 phút tiếng Anh → 1.003 từ trong 16 giây; 29 phút tiếng Hindi dịch sang Anh (task=translate) → 4.239 từ trong 91 giây.') },

  { t: 'Bảng tra nhanh trước khi làm hậu kỳ', body: table(['Việc', 'Con số / thao tác'], [
    ['Mục tiêu LUFS tích hợp', '≈ −14 LUFS (mức cộng đồng đo được — YouTube không công bố số này)'],
    ['!Trần true peak', '−1 dBTP (EBU R128) — canh cách trần ít nhất 1dB'],
    ['Chuỗi xử lý giọng', 'Khử ồn → EQ (cắt 80–100Hz) → Compressor → De-esser → Limiter'],
    ['Đo LUFS thật', '<code>ffmpeg -af ebur128=peak=true -f null -</code>'],
    ['Chuẩn hoá thật', '<code>ffmpeg -af loudnorm=I=-14:TP=-1:LRA=11 …</code> (2 lượt: đo → áp)'],
    ['Tách âm cho Whisper', '<code>ffmpeg -i clip.mp4 -vn -ac 1 -ar 16000 audio.wav</code>'],
    ['Whisper khuyến nghị', 'faster-whisper, model medium, device=cuda, vad_filter=True'],
  ]) },

  { t: '🎬 Thực hành', body: steps([
    ['Đo một clip đã xuất bằng <code>ffmpeg -af ebur128=peak=true</code>', 'Đọc đúng Integrated LUFS và True Peak — không đoán bằng tai'],
    ['Chuẩn hoá hai lượt về −14 LUFS, true peak −1 dBTP', 'Lượt 1 đo, lượt 2 áp đúng số vừa đo (linear=true), đo lại để chứng minh'],
    ['Làm một lower third bằng font đủ dấu tiếng Việt', 'Be Vietnam Pro / Inter / Roboto — gõ một câu thật nhiều dấu để thử'],
    ['Tạo file .srt cho 15–20 giây video', 'Viết tay hoặc chạy faster-whisper trên máy Linux, rồi tải lên một video không công khai để kiểm'],
  ]) + box('good', '<b>Đạt khi:</b> bạn đọc được số LUFS/true peak thật từ ffmpeg thay vì đoán, giải thích được vì sao công cụ AI một-chạm của Resolve cần Studio còn EQ/Compressor/De-esser tay thì không, và tạo được một file .srt hợp lệ từ Whisper hoặc viết tay.')
    + note('Các bước chi tiết nằm trong 4 bài học VIDEO của chương — chạy đúng lệnh ffmpeg đã in trong bài, không cần nhớ thuộc lòng.') },
]);
