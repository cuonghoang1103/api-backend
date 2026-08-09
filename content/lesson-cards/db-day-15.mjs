/**
 * Thẻ "100 Ngày Database" — Ngày 15: Correlated subquery & EXISTS.
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-15.mjs
 *
 * ⚠ Không có `verify`. `proof.lines` là OUTPUT THẬT của psql.
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433), DB hoc_db_day15:
 *   EXISTS -> An, Binh ; NOT EXISTS -> Chi (an toàn NULL)
 *   correlated (đơn > TB của chính khách): id2 An 800000, id3 Binh 900000
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 15,
  total: 100,
  titleLead: 'DB Day 15:',
  titleAccent: 'Subquery tương quan & EXISTS',
  subtitle: 'Subquery "nhìn" từng dòng ngoài — hỏi "có tồn tại không" 🔗',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. EXISTS + THAM CHIẾU DÒNG NGOÀI 🔗',
      code: `SELECT ten FROM khach_hang k
WHERE EXISTS (
  SELECT 1 FROM don_hang d WHERE d.khach_id = k.id
);`,
      notes: [
        { mark: 'ok', text: '`d.khach_id = k.id` = TƯƠNG QUAN: subquery nhìn `k` của mỗi dòng ngoài' },
        { mark: 'dot', text: '`EXISTS` chỉ hỏi "có ≥ 1 dòng không" → `SELECT 1` là đủ' },
      ],
    },
    {
      tone: 'green',
      title: '2. EXISTS vs NOT EXISTS ✅❌',
      code: `EXISTS     -> An, Binh   (có đơn)
NOT EXISTS -> Chi        (chưa có đơn)`,
      notes: [
        { mark: 'ok', text: 'Chạy cho TỪNG dòng ngoài: có khớp thì giữ (EXISTS) / loại (NOT EXISTS)' },
      ],
    },
    {
      tone: 'yellow',
      title: '3. NOT EXISTS — AN TOÀN VỚI NULL 🛡️',
      code: `-- Ngày 14: NOT IN dính NULL -> rỗng
-- NOT EXISTS: KHÔNG dính bẫy đó`,
      notes: [
        { mark: 'ok', text: 'Ưu tiên `NOT EXISTS` thay `NOT IN` khi cột có thể NULL' },
      ],
    },
    {
      tone: 'pink',
      title: '4. SO VỚI "CHÍNH MÌNH" 🪞',
      code: `WHERE d.tong_tien > (
  SELECT avg(d2.tong_tien) FROM don_hang d2
  WHERE d2.khach_id = d.khach_id );
-- đơn > TB CỦA CHÍNH khách đó -> An 800k, Binh 900k`,
      notes: [
        { mark: 'ok', text: 'Correlated cho phép so mỗi dòng với nhóm riêng của nó — điều JOIN phẳng khó làm' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'SQL Server: EXISTS/NOT EXISTS/correlated y hệt; NOT EXISTS cũng an toàn NULL' },
        { mark: 'next', text: '**Ngày 16**: CTE (`WITH`) — đặt tên subquery cho câu dài dễ đọc' },
      ],
    },
  ],

  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      '1) WHERE EXISTS (SELECT 1 FROM don_hang d WHERE d.khach_id = k.id) -> An, Binh',
      '2) WHERE NOT EXISTS (...) -> Chi  (chua co don; an toan voi NULL)',
      '3) correlated: tong_tien > (SELECT avg ... WHERE d2.khach_id = d.khach_id)',
      '     -> id2 An 800000, id3 Binh 900000  (don > TB cua chinh khach do)',
    ],
  },
};
