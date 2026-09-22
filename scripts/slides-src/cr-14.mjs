/**
 * cr-14.mjs — Content Creator, Chương 14: Nghệ thuật cắt dựng.
 *   node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/cr-14.mjs
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/cr-14.mjs --out <dir>
 */
import { S, cover, cards, box, table, vs, flow, mindmap, bars, audioWave, chart, timeline, storyboard, two, personShot, note, cap, C } from './_cr-chung.mjs';

export const deck = { key: 'cr-14', code: 'CR · CHƯƠNG 14', title: 'Nghệ thuật cắt dựng', sub: 'Content Creator · Chương 14' };

/** Minh hoạ hiệu ứng Kuleshov: MỘT cảnh phản ứng giống hệt nhau, ghép với 3 cảnh sau khác nhau. */
const kuleshovDemo = () => {
  const face = personShot({ w: 190, h: 150, size: 'MCU', at: 0.5, bg: false, shirt: '#3b82f6' });
  const cols = [
    { ic: '💻❌', t: 'Cảnh sau: màn hình báo lỗi đỏ', emo: 'Bực bội', c: C.red },
    { ic: '✅', t: 'Cảnh sau: test pass toàn bộ', emo: 'Tự hào', c: C.grn },
    { ic: '⏳', t: 'Cảnh sau: thanh loading đứng yên', emo: 'Mất kiên nhẫn', c: C.amb },
  ];
  return `<div style="display:flex;gap:20px;justify-content:center;align-items:flex-start">${cols.map((x) => `<div style="text-align:center;width:230px">` +
    `<div style="border-radius:10px;overflow:hidden;border:2px solid #3a4558;display:inline-block"><div style="font-size:13px;color:${C.mu};padding:3px 0">Cảnh phản ứng — GIỐNG HỆT</div>${face}</div>` +
    `<div style="font-size:24px;margin:4px 0;color:${C.dim};font-weight:800">+</div>` +
    `<div style="height:88px;border-radius:10px;background:#141a24;border:1.5px solid ${x.c};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;padding:0 8px">` +
    `<span style="font-size:32px;line-height:1">${x.ic}</span><span style="font-size:13.5px;color:#d6deea;line-height:1.25">${x.t}</span></div>` +
    `<div style="font-size:24px;margin:4px 0;color:${C.dim};font-weight:800">=</div>` +
    `<div style="font-size:20px;font-weight:800;color:${x.c}">khán giả thấy: "${x.emo}"</div>` +
    `</div>`).join('')}</div>`;
};

export const slides = S([

  /* 1 — bìa */
  cover({
    t: 'Chương 14 — Nghệ thuật cắt dựng',
    sub: 'Chương 12–13 dạy CÔNG CỤ. Chương này dạy TƯ DUY — áp được cho cả CapCut lẫn DaVinci Resolve',
    chap: 'CHƯƠNG 14',
  }),

  /* 2 — mindmap */
  {
    t: 'Bản đồ chương',
    body: mindmap('Nghệ thuật dựng', 'tư duy, không phải nút bấm', [
      { t: '🔁 14.1 Quy trình theo lượt', d: 'Assembly → rough cut → fine cut → picture lock', c: 'red' },
      { t: '✂️ 14.2 Kiểu cắt & lý thuyết', d: 'Jump/J/L/match/cutaway… + hiệu ứng Kuleshov + Rule of Six', c: 'ora' },
      { t: '⏱ 14.3 Nhịp & giữ chân', d: 'Độ dài shot, ngắt mẫu, tránh dựng quá tay', c: 'amb' },
      { t: '🎵 14.4 Nhạc & thiết kế âm thanh', d: 'Chọn nhạc, ducking, SFX, im lặng có chủ đích', c: 'grn' },
      { t: '🎬 Áp dụng cả hai phần mềm', d: 'Mọi kỹ thuật đều làm được ở CapCut lẫn Resolve — Ch.12/13 đã dạy thao tác', c: 'blu' },
      { t: '➡️ Ch.15–16 kế tiếp', d: 'Màu rồi âm thanh hậu kỳ — cả hai đều làm SAU khi hình đã khoá', c: 'vio' },
    ]),
  },

  /* 3 — flow 4 lượt dựng */
  {
    t: 'Dựng theo LƯỢT, không dựng một lèo từ đầu tới cuối',
    body: flow([
      { e: '📼', t: '1. Assembly cut', d: 'Ráp mọi "selects" theo đúng thứ tự kịch bản — chưa cắt gọt, còn dài gấp đôi bản cuối', c: 'red' },
      { e: '✂️', t: '2. Rough cut', d: 'Cắt bớt phần thừa, thử vị trí B-roll, nhịp còn thô', c: 'ora' },
      { e: '🎯', t: '3. Fine cut', d: 'Tinh từng khung hình: jump cut mượt, J/L-cut, khớp nhạc', c: 'amb' },
      { e: '🔒', t: '4. Picture lock', d: 'Chốt thời lượng & thứ tự — từ đây mới làm màu, âm, phụ đề', c: 'grn' },
    ]) + box('tip', '<strong>Selects / string-out:</strong> trước khi ráp, xem hết footage và đánh dấu các take tốt (Resolve: phím <b>M</b> — Ch.13) — chuỗi các selects nối thô lại với nhau, chưa cắt gì, gọi là <b>string-out</b>. Assembly cut ráp từ string-out đó.'),
  },

  /* 4 — vs: chốt đúng cách */
  {
    t: 'Trước khi khoá (picture lock)',
    body: vs({
      no: { t: 'Chốt ẩu', items: [
        'Dựng xong trên màn Mac to là xuất luôn',
        'Xem đúng một lần rồi tin vì "nhìn ổn"',
        'Đã làm màu/phụ đề rồi mới đổi ý cắt lại một đoạn',
      ] },
      yes: { t: 'Chốt đúng cách', items: [
        'Xuất bản nháp, xem trên CHÍNH điện thoại — nơi khán giả thật sẽ xem',
        'Để qua một đêm, xem lại bằng "mắt mới" trước khi khoá',
        'Cắt xong mới bắt đầu màu/âm/phụ đề (Ch.15–16) — đổi cắt sau đó nghĩa là canh lại toàn bộ phụ đề (Ch.12) và chỉnh lại node màu (Ch.15)',
      ] },
    }),
  },

  /* 5 — cards 8 kiểu cắt tổng quan */
  {
    t: 'Tám kiểu cắt — bản đồ thuật ngữ',
    body: cards([
      { ic: '✂️', t: 'Hard cut', d: 'Đổi cảnh dứt khoát, không hiệu ứng — mặc định của phần lớn thời lượng video', c: 'blu' },
      { ic: '⚡', t: 'Jump cut', d: 'Cùng cỡ cảnh/góc máy, chỉ khác thời điểm — chủ thể "nhảy" vị trí nhẹ', c: 'amb' },
      { ic: '🔊➡️', t: 'J-cut', d: 'Nghe cảnh sau TRƯỚC khi thấy — kéo người xem tới bằng tai', c: 'grn' },
      { ic: '➡️🔊', t: 'L-cut', d: 'Vẫn nghe cảnh trước SAU khi hình đã đổi — giữ cảm xúc ở lại', c: 'tea' },
      { ic: '🔗', t: 'Match cut', d: 'Nối hai cảnh khác lúc/khác nơi bằng hình dạng hoặc chuyển động giống nhau', c: 'vio' },
      { ic: '👀', t: 'Cutaway', d: 'Rời khỏi hành động chính một chút — thường để CHE một chỗ nhảy lớn', c: 'pnk' },
      { ic: '🔀', t: 'Cross-cut', d: 'Cắt xen kẽ hai dòng hành động cùng lúc, khác chỗ — tạo căng thẳng/so sánh', c: 'red' },
      { ic: '💥', t: 'Smash cut', d: 'Cắt đột ngột, tương phản mạnh về hình/tiếng — gây sốc hoặc gây cười', c: 'ora' },
    ], 4),
  },

  /* 6 — hard cut vs jump cut */
  {
    t: 'Hard cut và jump cut — khác nhau ở việc mắt có bị "lừa" không',
    body:
      timeline({ len: 18, tracks: [{ id: 'V1', clips: [{ s: 0, e: 9, t: 'MS — bạn nói', c: 'blu' }, { s: 9, e: 18, t: 'CU — tay gõ phím (B-roll)', c: 'amb' }] }] }) + cap('Hard cut — đổi cỡ cảnh rõ ràng, người xem thấy "đúng là cảnh mới"') +
      timeline({ len: 18, tracks: [{ id: 'V1', clips: [{ s: 0, e: 9, t: 'MS — câu 1', c: 'blu' }, { s: 9, e: 18, t: 'MS — câu 3 (bỏ câu 2)', c: 'blu' }] }] }) + cap('Jump cut — cùng cỡ cảnh, cùng góc — bạn "nhảy" vị trí nhẹ') +
      box('info', 'Jump cut không phải lỗi — Ch.12 đã dạy dùng Q/W để tạo nó. Vấn đề của chương này là PHÁN ĐOÁN: dùng liên tục được cho video ngắn tiết tấu nhanh, nhưng lạm dụng trong phỏng vấn trang trọng thì gây khó chịu — lúc đó nên chêm cutaway hoặc B-roll để đổi nhịp.'),
  },

  /* 7 — J-cut vs L-cut, khung cảnh phỏng vấn */
  {
    t: 'J-cut và L-cut — cùng kỹ thuật, khác chủ đích cảm xúc',
    body:
      timeline({ len: 20, step: 4, tracks: [
        { id: 'V1', clips: [{ s: 0, e: 10, t: 'Bạn hỏi (hình)', c: 'blu' }, { s: 10, e: 20, t: 'Bạn học trả lời (hình)', c: 'amb' }] },
        { id: 'A1', a: true, clips: [{ s: 0, e: 7, t: 'Bạn hỏi (tiếng)', c: 'blu' }, { s: 7, e: 20, t: 'Bạn học trả lời (tiếng)', c: 'amb' }] },
      ], braces: [{ s: 7, e: 10, t: 'nghe giọng bạn học trước 3s — tạo sự chờ đợi', c: 'amb' }] }) + cap('J-cut — kéo người xem TỚI câu trả lời bằng tai trước') +
      timeline({ len: 20, step: 4, tracks: [
        { id: 'V1', clips: [{ s: 0, e: 10, t: 'Bạn hỏi (hình)', c: 'blu' }, { s: 10, e: 20, t: 'Phản ứng bạn học (hình)', c: 'grn' }] },
        { id: 'A1', a: true, clips: [{ s: 0, e: 13, t: 'Bạn hỏi (tiếng)', c: 'blu' }, { s: 13, e: 20, t: 'Bạn học trả lời (tiếng)', c: 'grn' }] },
      ], braces: [{ s: 10, e: 13, t: 'còn nghe câu hỏi khi đã thấy phản ứng — cảm xúc ở lại 3s', c: 'grn' }] }) + cap('L-cut — giữ cảm xúc của câu vừa nói thêm một nhịp'),
  },

  /* 8 — cutaway timeline */
  {
    t: 'Cutaway — che một khoảng nhảy quá lớn để lộ ra',
    body: timeline({ len: 24, step: 4, tracks: [
      { id: 'V1', clips: [
        { s: 0, e: 9, t: 'Bạn lắp robot — phần 1', c: 'blu' },
        { s: 9, e: 13, t: 'Cutaway — đồng hồ trên tường', c: 'pnk' },
        { s: 13, e: 24, t: 'Bạn lắp robot — phần 2 (đã xong 80%)', c: 'blu' },
      ] },
    ], braces: [{ s: 0, e: 24, t: 'Giữa phần 1 và phần 2 thật ra đã trôi qua 40 phút lắp ráp — 4s nhìn đồng hồ che trọn chỗ nhảy', c: 'amb' }] }) +
      box('tip', '<strong>Khác jump cut ở đâu:</strong> jump cut để LỘ chỗ nhảy (chấp nhận được, có chủ đích). Cutaway CHE chỗ nhảy bằng một cảnh RỜI khỏi hành động chính — dùng khi khoảng nhảy quá lớn để lộ ra được. Nhớ lại Ch.4: cutaway rời khỏi hành động, insert vẫn ở trong đó.'),
  },

  /* 9 — storyboard match cut */
  {
    t: 'Match cut — nối hai khoảnh khắc bằng hình dạng hoặc chuyển động',
    body: storyboard([
      { s: 'A', t: 'Terminal build — vòng xoay loading', kind: 'screen' },
      { s: 'B', t: 'Bánh xe đạp quay — mở đầu vlog đi học', kind: 'object' },
      { s: 'C', t: 'Tay gõ Enter, dòng lệnh cuối cùng', kind: 'hands' },
      { s: 'D', t: 'Tay gấp trang vở ở giảng đường FPTU', kind: 'hands' },
    ], { cols: 4, w: 260 }) + box('info', '<strong>A→B</strong> và <strong>C→D</strong> là hai cặp match cut: hai vòng tròn đang xoay (A/B), hai bàn tay khép lại cùng tốc độ (C/D). Icon dùng để thể hiện LOẠI cảnh — cái khớp nhau thật là hình dạng/chuyển động, không phải nội dung. Não người xem tự nối hai khoảnh khắc khác lúc, khác nơi thành một mạch liền.'),
  },

  /* 10 — Kuleshov */
  {
    t: 'Hiệu ứng Kuleshov — cùng một khuôn mặt, ba cách hiểu',
    body: kuleshovDemo() + box('warn', 'Ba cột dùng ĐÚNG MỘT cảnh phản ứng — chỉ cảnh SAU nó đổi. Khán giả tự gán cảm xúc cho khuôn mặt theo cảnh vừa xem. Lịch sử thật của thí nghiệm (Lev Kuleshov, thập niên 1920) — xem bài học.'),
  },

  /* 11 — bars Rule of Six */
  {
    t: 'Rule of Six của Walter Murch — sáu tiêu chí, không cân nhau',
    body: bars([
      { l: 'Cảm xúc (Emotion)', v: 51, txt: '51%', c: 'red' },
      { l: 'Câu chuyện (Story)', v: 23, txt: '23%', c: 'ora' },
      { l: 'Nhịp điệu (Rhythm)', v: 10, txt: '10%', c: 'amb' },
      { l: 'Hướng nhìn (Eye-trace)', v: 7, txt: '7%', c: 'grn' },
      { l: 'Mặt phẳng 2D màn hình', v: 5, txt: '5%', c: 'blu' },
      { l: 'Không gian 3D hành động', v: 4, txt: '4%', c: 'vio' },
    ], { lw: 300 }) + box('info', 'Trích từ sách <em>In the Blink of an Eye</em> (Walter Murch, Silman-James Press, 1995/2001). Khi phải chọn giữa hai cách cắt, hai tiêu chí ĐẦU quan trọng hơn bốn tiêu chí SAU cộng lại — đừng hy sinh cảm xúc chỉ để giữ đúng trục 180° hay hướng nhìn.'),
  },

  /* 12 — audioWave nhịp cắt: giữ vs cắt */
  {
    t: 'Không phải khoảng dừng nào cũng nên cắt',
    body: audioWave({
      len: 34,
      parts: [
        { s: 6, e: 8, t: 'dừng trước ý chính — GIỮ', k: 'breath' },
        { s: 13, e: 14.5, t: '"à…" — CẮT', k: 'filler' },
        { s: 19, e: 21.5, t: 'im lặng dài — CẮT còn ~0.5s', k: 'pause' },
        { s: 27, e: 29, t: 'dừng trước câu chốt — GIỮ', k: 'breath' },
      ],
    }) + box('tip', 'Ch.12 dạy CÁCH cắt khoảng chết bằng Q/W. Ở đây là phán đoán: một khoảng dừng ĐÚNG LÚC là công cụ nhịp điệu, không phải lỗi — cắt sạch mọi khoảng lặng làm giọng nói nghe gấp gáp, mệt mỏi. Giữ lại những chỗ dừng có chủ đích, chỉ cắt chỗ vô nghĩa.'),
  },

  /* 13 — chart giữ chân minh hoạ */
  {
    t: 'Đọc đồ thị giữ chân để sửa nhịp dựng',
    body: chart({
      series: [
        { t: 'Trước khi thêm ngắt mẫu', c: 'red', pts: [[0, 100], [5, 55], [15, 48], [30, 40], [45, 33], [60, 28]] },
        { t: 'Sau khi thêm ngắt mẫu', c: 'grn', pts: [[0, 100], [5, 72], [15, 66], [30, 60], [45, 54], [60, 50]] },
      ],
      x: [0, 60, 'giây'], y: [0, 100, '% người xem còn ở lại'], xt: 6, yt: 4,
    }) + note('Số liệu MINH HOẠ — chỉ để thấy HÌNH DẠNG đường cong đổi ra sao khi thêm ngắt mẫu (B-roll, punch-in, đồ hoạ, SFX) mỗi vài giây, không phải số liệu thật của một video cụ thể. Đồ thị giữ chân THẬT nằm trong YouTube Studio/TikTok Studio — Chương 26 dạy đọc nó.'),
  },

  /* 14 — timeline nhạc + SFX + ducking */
  {
    t: 'Nhạc, hiệu ứng âm thanh và ducking cùng lúc',
    body: timeline({
      len: 30,
      tracks: [
        { id: 'A1', a: true, clips: [{ s: 0, e: 30, t: 'Giọng bạn', c: 'grn' }] },
        { id: 'A2', a: true, clips: [{ s: 0, e: 30, t: 'Nhạc nền', c: 'vio', quiet: [[2, 12], [16, 28]] }] },
        { id: 'SFX', a: true, clips: [{ s: 12, e: 13.5, t: 'click', c: 'amb' }, { s: 27, e: 28.8, t: 'whoosh', c: 'amb' }] },
      ],
      marks: [{ s: 2, t: 'nói', c: 'amb' }, { s: 16, t: 'nói', c: 'amb' }],
    }) + box('tip', '<strong>Ducking</strong> (A2 hạ xuống khi A1 có giọng): CapCut — kéo Volume xuống ~−15…−20dB đúng đoạn có giọng, thêm keyframe đầu/cuối để lên/xuống mượt (Ch.12). DaVinci Resolve — cùng nguyên lý bằng đường tự động hoá âm lượng trên Fairlight (đi sâu ở Ch.16). Track SFX chỉ nên xuất hiện ở điểm CẮT hoặc điểm NHẤN, không rải đều — rải đều thì tai người xem hết nhạy với nó.'),
  },

  /* 15 — bảng tra nhanh */
  {
    t: 'Bảng tra nhanh — muốn gì thì dùng kiểu cắt nào',
    body: table(['Muốn đạt điều gì', 'Dùng kiểu cắt nào'], [
      ['Đổi cảnh bình thường, không ai để ý', '!Hard cut'],
      ['Cắt gọn talking head, chấp nhận chủ thể "nhảy" nhẹ', 'Jump cut (+ B-roll che bớt nếu dùng nhiều)'],
      ['Kéo người xem TỚI câu trả lời bằng tai trước khi thấy', 'J-cut'],
      ['Giữ cảm xúc câu vừa nói ở lại thêm một nhịp', 'L-cut'],
      ['Nối 2 cảnh khác lúc/khác nơi bằng hình/chuyển động giống nhau', 'Match cut'],
      ['Che một khoảng nhảy lớn trong hành động chính', 'Cutaway'],
      ['So sánh/tạo căng thẳng giữa 2 dòng hành động cùng lúc', 'Cross-cut'],
      ['Gây sốc hoặc gây cười bằng tương phản đột ngột', 'Smash cut'],
      ['Giữ mắt người xem không nhận ra chỗ nối', 'Cut on action'],
      ['Đổi thời gian/địa điểm lớn, đổi mood mượt hơn hard cut', 'Dissolve'],
    ], { sm: true }),
  },

  /* 16 — thực hành */
  {
    t: '🎬 Thực hành chương 14',
    body: cards([
      { ic: '🔁', t: '1. Bốn lượt rõ ràng', d: 'Lấy một talking head ≥ 3 phút, lưu bản riêng ở mỗi lượt: assembly → rough → fine → lock.', c: 'red' },
      { ic: '✂️', t: '2. Đủ bộ kiểu cắt', d: 'Trong bản fine cut phải có: ít nhất 1 J-cut, 1 L-cut, 1 cutaway hoặc match cut.', c: 'amb' },
      { ic: '🎵', t: '3. Nhạc có ducking', d: 'Thêm nhạc nền, hạ dưới giọng nói bằng keyframe/automation, canh SFX vào đúng điểm cắt.', c: 'grn' },
      { ic: '📱', t: '4. Kiểm bằng mắt mới', d: 'Xuất nháp, xem trên điện thoại, để qua một đêm rồi mới khoá hình.', c: 'blu' },
    ], 2) + box('good', '<strong>Đạt khi:</strong> chỉ ra được TỪNG chỗ cắt thuộc kiểu gì và VÌ SAO chọn kiểu đó (không phải "cắt vì nó vừa"), và bản dựng đã qua ít nhất một lần xem lại bằng mắt mới trước khi gọi là "xong".'),
  },
]);
