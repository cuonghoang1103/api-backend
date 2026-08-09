/**
 * Thẻ "100 Ngày Database" — Ngày 11: JOIN (mở Giai đoạn 2 — Truy vấn).
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-11.mjs
 *
 * ⚠ Không có `verify`. `proof.lines` là OUTPUT THẬT của psql.
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433), DB hoc_db_day11:
 *   INNER JOIN -> 4 dòng (Dung không đơn -> BỊ LOẠI)
 *   LEFT JOIN  -> 5 dòng (giữ Dung, tong_tien = NULL)
 *   LEFT JOIN + WHERE d.id IS NULL -> Dung (khách chưa mua gì)
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 11,
  total: 100,
  titleLead: 'DB Day 11:',
  titleAccent: 'JOIN — nối nhiều bảng',
  subtitle: 'Ghép khách với đơn để trả lời "ai mua gì" — mở Giai đoạn 2 🔗',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. JOIN — GHÉP THEO KHOÁ 🔗',
      code: `SELECT k.ten, d.tong_tien
FROM khach_hang k
JOIN don_hang d ON d.khach_id = k.id;`,
      notes: [
        { mark: 'ok', text: '`ON` nêu điều kiện ghép: khoá ngoại của bảng này = khoá chính bảng kia' },
        { mark: 'dot', text: 'Bí danh bảng (`k`, `d`) cho câu ngắn gọn, rõ cột nào của bảng nào' },
      ],
    },
    {
      tone: 'green',
      title: '2. INNER JOIN — CHỈ DÒNG KHỚP ✅',
      code: `-- An(2 đơn), Binh(1), Chi(1), Dung(0 đơn)
JOIN don_hang ON ... -> 4 dòng
-- Dung KHÔNG có đơn -> BỊ LOẠI`,
      notes: [
        { mark: 'ok', text: '`JOIN` (= `INNER JOIN`) chỉ giữ dòng có cặp khớp ở CẢ HAI bảng' },
      ],
    },
    {
      tone: 'yellow',
      title: '3. LEFT JOIN — GIỮ MỌI DÒNG BÊN TRÁI ⬅️',
      code: `LEFT JOIN don_hang ON ... -> 5 dòng
-- Dung vẫn xuất hiện, tong_tien = (null)`,
      notes: [
        { mark: 'ok', text: '`LEFT JOIN` giữ HẾT dòng bảng trái; không khớp thì cột phải = NULL' },
        { mark: 'dot', text: 'Còn RIGHT JOIN (giữ phải) và FULL JOIN (giữ cả hai)' },
      ],
    },
    {
      tone: 'pink',
      title: '4. TÌM DÒNG KHÔNG KHỚP 🔍',
      code: `SELECT k.ten FROM khach_hang k
LEFT JOIN don_hang d ON d.khach_id = k.id
WHERE d.id IS NULL;   -- -> Dung`,
      notes: [
        { mark: 'ok', text: 'LEFT JOIN + `IS NULL` = "khách CHƯA mua gì" — mẫu cực hay dùng' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'SQL Server: cú pháp JOIN y hệt (INNER/LEFT/RIGHT/FULL JOIN ... ON) — chuẩn SQL' },
        { mark: 'next', text: '**Ngày 12**: nối 3+ bảng & self-join (bảng tự nối chính nó)' },
      ],
    },
  ],

  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      '1) INNER JOIN khach_hang + don_hang -> 4 dong (An x2, Binh, Chi); Dung BI LOAI',
      '2) LEFT JOIN -> 5 dong: giu ca Dung (tong_tien = (null))',
      '3) LEFT JOIN + WHERE d.id IS NULL -> Dung  (khach chua mua gi)',
    ],
  },
};
