/** Content Creator · Deck cr-04 — Chương 4: Phân cảnh — shot list & storyboard. */
import { S, cover, cards, box, steps, flow, mindmap, bars, table, vs, seg, kpis, note, cap, tag, storyboard, timeline } from './_cr-chung.mjs';

export const deck = { key: 'cr-04', code: 'CR · CHƯƠNG 4', title: 'Phân cảnh — shot list & storyboard', sub: 'Content Creator · Chương 4' };

/* 25 clip ngắn rải trong 30 phút — mỗi clip một màu, không có nhãn (quá hẹp để đọc chữ). */
const MAU = ['red', 'ora', 'amb', 'grn', 'tea', 'blu', 'vio', 'pnk'];
const clip25 = Array.from({ length: 25 }, (_, i) => {
  const s = i * 1.14;
  return { s, e: s + 0.42, c: MAU[i % MAU.length] };
});

/* Thứ tự trong kịch bản (xen kẽ bối cảnh) đấu với thứ tự quay thật (gom theo bối cảnh). */
const theoKichBan = [
  { s: 0, e: 1, t: '1 · trong nhà', c: 'blu' },
  { s: 1, e: 2, t: '2 · ngoài trời', c: 'amb' },
  { s: 2, e: 3, t: '3 · trong nhà', c: 'blu' },
  { s: 3, e: 4, t: '4 · ngoài trời', c: 'amb' },
  { s: 4, e: 5, t: '5 · trong nhà', c: 'blu' },
];
const theoBoiCanh = [
  { s: 0, e: 1, t: '1', c: 'blu' },
  { s: 1, e: 2, t: '3', c: 'blu' },
  { s: 2, e: 3, t: '5', c: 'blu' },
  { s: 3, e: 4, t: '2', c: 'amb' },
  { s: 4, e: 5, t: '4', c: 'amb' },
];

export const slides = S([
  /* 1 — Bìa */
  cover({
    t: 'Chương 4 — Phân cảnh: Shot List & Storyboard',
    sub: 'Từ "bấm quay rồi tính sau" tới quay ĐÚNG THỨ cần, ĐÚNG THỜI LƯỢNG cần',
    chap: 'CHƯƠNG 4',
  }),

  /* 2 — Bản đồ chương */
  { t: 'Bản đồ chương', body: mindmap('Phân cảnh', 'Chương 4', [
    { t: '📼 Vì sao một lèo hỏng', d: 'Toán dung lượng thật + tỉ lệ quay/dùng', c: 'red' },
    { t: '🔤 Cảnh · Shot · Take', d: 'Từ vựng nền, A-roll/B-roll, coverage', c: 'ora' },
    { t: '📋 Shot list', d: 'Từ kịch bản ra bảng shot quay được', c: 'amb' },
    { t: '✏️ Storyboard', d: 'Vẽ tay trên iPad khi cảnh phức tạp', c: 'grn' },
    { t: '📅 Lịch quay', d: 'Theo bối cảnh/ánh sáng, không theo kịch bản', c: 'blu' },
    { t: '🎬 Kỷ luật một take', d: 'Bấm → đệm → diễn → đệm → dừng · slate', c: 'vio' },
  ]) },

  /* 3 — "Một lèo" vs "25 clip ngắn" */
  { t: '"Một lèo 30 phút" đấu với "25 clip ngắn"', body:
    box('bad', 'Bấm quay một lần, dừng sau 30 phút — không có điểm nào để tự hỏi <b>"đủ chưa?"</b>, chỉ có một file dài để tua tìm.') +
    timeline({ len: 30, step: 5, tracks: [
      { id: 'MỘT LÈO', clips: [{ s: 0, e: 30, t: '30 phút liền — 1 file, phải tua tìm', c: 'red' }] },
      { id: '25 CLIP', clips: clip25 },
    ], marks: [{ s: 22, t: 'đoạn hay ở đâu?', c: 'amb' }] }) +
    note('Mỗi lần bấm DỪNG giữa các clip là một lần tự quyết định NGAY lúc quay — không dồn hết việc chọn cảnh ra hậu kỳ.') },

  /* 4 — Toán dung lượng */
  { t: 'Toán dung lượng thẻ nhớ — Pocket 3', body:
    kpis([
      { v: '130 Mbps', l: 'bitrate 4K tối đa (dji.com)', c: 'red' },
      { v: '0,975 GB', l: 'mỗi phút quay', c: 'ora' },
      { v: '≈131 phút', l: 'thẻ 128GB đầy (≈2 giờ 11)', c: 'amb' },
      { v: '≈262 phút', l: 'thẻ 256GB đầy (≈4 giờ 23)', c: 'grn' },
    ]) +
    bars([
      { l: '10 phút', v: 9.75, txt: '9,75 GB', c: 'tea' },
      { l: '20 phút', v: 19.5, txt: '19,5 GB', c: 'blu' },
      { l: '30 phút', v: 29.25, txt: '29,25 GB', c: 'vio' },
      { l: '1 giờ', v: 58.5, txt: '58,5 GB', c: 'pnk' },
    ], { lw: 130 }) +
    note('Công thức: GB/phút = Mbps × 60 ÷ 8 ÷ 1000 → 130 × 60 ÷ 8 ÷ 1000 = 0,975 GB/phút. Nguồn: dji.com/osmo-pocket-3/specs (Max Video Bitrate 130 Mbps, microSD tới 1TB) — kiểm 09/2026.') },

  /* 5 — Từ vựng cảnh/shot/take */
  { t: 'Từ vựng: Scene · Sequence · Shot · Take · Setup', body:
    cards([
      { ic: '🎬', t: 'Scene', d: 'Cảnh — một bối cảnh, một thời điểm', c: 'red' },
      { ic: '🔗', t: 'Sequence', d: 'Trường đoạn — chuỗi cảnh kể trọn một ý', c: 'ora' },
      { ic: '📷', t: 'Shot', d: 'Cú máy — từ lúc bấm quay tới lúc dừng', c: 'amb' },
      { ic: '🔁', t: 'Take', d: 'Lần quay — một lần thử của CÙNG một shot', c: 'grn' },
      { ic: '📍', t: 'Setup', d: 'Vị trí máy — một chỗ đặt quay được nhiều shot', c: 'blu' },
    ], 5) +
    box('info', 'Ví dụ: cảnh "Vào lớp" có thể gồm 3 shot; shot "Mở cửa" có thể quay 2 take trước khi đạt.') },

  /* 6 — A-roll / B-roll */
  { t: 'A-roll và B-roll', body:
    storyboard([
      { s: 'A', t: 'A-roll', d: 'lời chính — mặt bạn đang nói', size: 'MCU', at: 0.5 },
      { s: 'B', t: 'B-roll', d: 'hình minh hoạ — tay, màn hình, vật', kind: 'hands' },
    ], { cols: 2, w: 300 }) +
    vs({
      no: { t: 'Chỉ quay A-roll', items: ['Mặt bạn nói suốt cả video', 'Cắt câu là thấy jump cut giật', 'Nói vấp không có gì che'] },
      yes: { t: 'A-roll + B-roll', items: ['Lời chính (A-roll) dẫn xuyên suốt', 'B-roll che mọi chỗ cắt, thêm nhịp', 'Cutaway/insert giấu jump cut'] },
    }) },

  /* 7 — Coverage: chuỗi 5 shot */
  { t: 'Coverage — một hành động, 5 cỡ cảnh', body:
    storyboard([
      { s: '1', t: 'Cận tay (CU)', d: 'gõ phím / cầm cốc cà phê', kind: 'hands' },
      { s: '2', t: 'Cận mặt (MCU)', d: 'biểu cảm lúc hiểu ra vấn đề', size: 'MCU' },
      { s: '3', t: 'Toàn cảnh (WS)', d: 'cả bàn làm việc, cả người', size: 'WS' },
      { s: '4', t: 'Qua vai (OTS)', d: 'nhìn màn hình từ sau lưng', kind: 'screen' },
      { s: '5', t: 'Góc lạ', d: 'lệch tâm, từ một phía bất ngờ', size: 'MS', at: 0.28 },
    ], { cols: 5, w: 220 }) +
    cap('5 cỡ cảnh cho MỘT hành động ⇒ lúc dựng, chỗ nào cũng có cảnh để cắt sang — không bị kẹt.') },

  /* 8 — Các cột của shot list */
  { t: 'Các cột của một shot list', body:
    table(['Cột', 'Ghi gì', 'Ví dụ'], [
      ['#', 'Số thứ tự shot', '7'],
      ['Cảnh', 'Scene / bối cảnh nào', 'Mở bài — bàn làm việc'],
      ['Cỡ cảnh', 'ECU / CU / MCU / MS / MWS / WS', 'MCU'],
      ['Mô tả', 'Hành động trong khung hình', 'Gõ phím, ngẩng lên cười'],
      ['Máy / góc', 'Thiết bị + vị trí đặt máy', 'Pocket 3, ngang tầm mắt'],
      ['Âm thanh', 'Lời thoại / tiếng động / nhạc', 'VO: "Một ngày code bắt đầu…"'],
      ['Thời lượng', 'Số giây dự kiến dùng', '4 giây'],
      ['Trạng thái', 'Chưa quay / Đã quay / Đạt', '✅ Đạt'],
    ]) },

  /* 9 — Ví dụ shot list thật */
  { t: 'Shot list thật — Vlog "Một ngày code ở FPTU"', body:
    table(['#', 'Cảnh', 'Cỡ', 'Mô tả', 'Máy'], [
      ['1', 'Mở đầu', 'WS', 'Toàn cảnh cổng trường, nắng sớm', 'Pocket 3'],
      ['4', 'Lên lớp', 'MS', 'Ngồi vào bàn, mở laptop', 'iPhone'],
      ['9', 'Code', 'MCU', 'Tay gõ phím + màn hình code', 'Pocket 3'],
      ['13', 'Bí ý tưởng', 'CU', 'Cận mặt cau mày, gãi đầu', 'iPhone'],
      ['16', 'Chạy đúng', 'ECU', 'Cận mắt sáng lên lúc hết lỗi', 'Pocket 3'],
      ['20', 'Kết', 'MWS', 'Đứng dậy, nhìn ra cửa sổ, cười', 'Pocket 3'],
    ], { sm: true }) +
    note('Trích 6/20 dòng. Bảng đầy đủ + mẫu chép được vào Google Sheets nằm trong bài học 4.3.') },

  /* 10 — Từ kịch bản ra shot list */
  { t: 'Từ kịch bản ra shot list', body:
    flow([
      { e: '📝', t: 'Kịch bản 2 cột', d: 'cột Hình (V) / cột Lời (A)', c: 'red' },
      { e: '🎯', t: 'Nhịp (beat)', d: 'mỗi ý nhỏ trong kịch bản', c: 'ora' },
      { e: '🎬', t: 'Shot', d: 'một hoặc nhiều shot / nhịp', c: 'amb' },
      { e: '📋', t: 'Shot list', d: 'gộp lại thành bảng để quay', c: 'grn' },
      { e: '📅', t: 'Lịch quay', d: 'sắp lại theo bối cảnh', c: 'blu' },
    ]) },

  /* 11 — Quay theo bối cảnh */
  { t: 'Quay theo bối cảnh, không theo kịch bản', body:
    timeline({ len: 5, step: 1, tracks: [
      { id: 'KB', clips: theoKichBan },
      { id: 'THẬT', clips: theoBoiCanh },
    ] }) +
    `<div style="text-align:center;margin-top:4px">${tag('■ trong nhà', 'blu')}${tag('■ ngoài trời', 'amb')}</div>` +
    note('Gom mọi cảnh CÙNG bối cảnh lại quay một lượt (1, 3, 5 rồi mới 2, 4) — dọn đồ, dời ánh sáng đúng MỘT lần thay vì năm lần.') },

  /* 12 — Kỷ luật một take */
  { t: 'Kỷ luật MỘT take', body:
    seg([
      { t: 'Bấm REC', w: 1, c: 'red' },
      { t: 'Đệm 2 giây', d: 'đứng yên, im lặng', w: 2, c: 'dim' },
      { t: 'Hành động / lời thoại', d: 'phần thật sự dùng', w: 5, c: 'grn' },
      { t: 'Đệm 2 giây', d: 'giữ khung, đừng cắt vội', w: 2, c: 'dim' },
      { t: 'Dừng', w: 1, c: 'red' },
    ], ['bấm REC', '+2s', '', '', '−2s', 'dừng']) +
    cards([
      { ic: '🗣️', t: 'Slate miệng', d: '"Cảnh 3, shot 2, lần 1" — nói trước mỗi take', c: 'amb' },
      { ic: '👏', t: 'Vỗ tay 1 cái', d: 'gần micro — dựng ghép 2 máy theo dạng sóng âm', c: 'tea' },
    ], 2) },

  /* 13 — Checklist ngày quay */
  { t: 'Checklist ngày quay', body:
    steps([
      ['Trước: sạc đầy pin, thẻ đủ trống', 'đối chiếu số phút cần với bảng dung lượng slide 4'],
      ['Trong: quay theo shot list, đánh dấu "Đạt"', 'không tự ý quay thêm ngoài kế hoạch'],
      ['Take hỏng: nói "làm lại", quay TAKE MỚI', 'không nói tiếp giữa một take đang chạy'],
      ['Sau mỗi cảnh: xem lại tại chỗ', 'phát hiện lỗi nét/rung ngay, đỡ phải quay lại hôm khác'],
      ['Cuối buổi: đổ thẻ ngay trong ngày', 'theo quy tắc sao lưu 3-2-1 (Chương 11)'],
    ]) },

  /* 14 — Thực hành */
  { t: '🎬 Thực hành 15–30 phút', body:
    cards([
      { ic: '📱', t: 'Pocket 3 hoặc iPhone', d: 'máy đang có sẵn, không cần mua thêm', c: 'blu' },
      { ic: '📝', t: 'Shot list viết tay', d: 'tối thiểu 5 dòng, viết TRƯỚC khi bấm quay', c: 'amb' },
    ], 2) +
    kpis([
      { v: '1 cảnh', l: '5 shot theo chuỗi coverage', c: 'grn' },
      { v: '≤ 60s', l: 'mỗi clip, không quay liền quá dài', c: 'tea' },
      { v: '100%', l: 'mỗi shot có mặt trong shot list', c: 'vio' },
    ]) +
    box('good', '<b>Đạt khi:</b> có shot list viết trước, quay đủ 5 shot đúng thứ tự trong list, và KHÔNG có clip nào dài quá 90 giây.') },
]);
