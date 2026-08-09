/**
 * Thẻ "100 Ngày Database" — Ngày 8: Lọc dữ liệu (WHERE, AND/OR/NOT, IN, BETWEEN, LIKE).
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-08.mjs
 *
 * ⚠ Không có `verify`. `proof.lines` là OUTPUT THẬT của psql.
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433), DB hoc_db_day08:
 *   BETWEEN 500000 AND 1200000 -> gồm cả Tai nghe (đúng 1200000) — BAO GỒM 2 đầu
 *   Laptop OR Man hinh AND gia<3tr: KHÔNG ngoặc -> 3 dòng; CÓ ngoặc -> 1 dòng
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 8,
  total: 100,
  titleLead: 'DB Day 8:',
  titleAccent: 'Lọc dữ liệu với WHERE',
  subtitle: 'AND/OR/NOT, IN, BETWEEN, LIKE — và bẫy thứ tự ưu tiên 🔍',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. WHERE + AND / OR / NOT 🎯',
      code: `SELECT ten, gia FROM san_pham
WHERE danh_muc = 'Phu kien' AND gia < 1000000;
-- -> Chuot game (550k), Ban phim co (890k)`,
      notes: [
        { mark: 'ok', text: '`WHERE` giữ dòng cho ra TRUE · nối điều kiện bằng `AND`/`OR`/`NOT`' },
        { mark: 'dot', text: 'So sánh: `=  <>  >  <  >=  <=`' },
      ],
    },
    {
      tone: 'green',
      title: '2. IN & BETWEEN 📦',
      code: `WHERE danh_muc IN ('Man hinh', 'Laptop')   -- thuộc danh sách
WHERE gia BETWEEN 500000 AND 1200000       -- trong khoảng`,
      notes: [
        { mark: 'ok', text: '`IN` = thuộc một danh sách (gọn hơn nhiều `OR`)' },
        { mark: 'dot', text: '`BETWEEN` BAO GỒM cả hai đầu — 1200000 vẫn được tính' },
      ],
    },
    {
      tone: 'yellow',
      title: '3. LIKE — TÌM THEO MẪU 🔎',
      code: `WHERE ten LIKE 'Man%'    -- bắt đầu bằng "Man"
WHERE ten LIKE '%game%'  -- chứa "game"
-- % = nhiều ký tự bất kỳ ; _ = đúng 1 ký tự`,
      notes: [
        { mark: 'ok', text: '`%` khớp 0+ ký tự, `_` khớp đúng 1 ký tự' },
      ],
    },
    {
      tone: 'pink',
      title: '4. ⚠️ BẪY: AND MẠNH HƠN OR',
      code: `A OR B AND C   ==   A OR (B AND C)
-- Laptop OR Man hinh AND gia<3tr -> 3 dòng
-- (Laptop OR Man hinh) AND gia<3tr -> 1 dòng`,
      notes: [
        { mark: 'ok', text: '`AND` được tính trước `OR`. Dùng NGOẶC để nói đúng ý mình' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'SQL Server: WHERE/IN/BETWEEN/LIKE y hệt. Chỉ khác: PG `LIKE` phân biệt hoa/thường (dùng `ILIKE` nếu không), SQL Server thường KHÔNG phân biệt' },
        { mark: 'next', text: '**Ngày 9**: sắp xếp & phân trang — ORDER BY, LIMIT/OFFSET (vs TOP)' },
      ],
    },
  ],

  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      '1) WHERE gia >= 1000000 -> 5 dong (Tai nghe .. Laptop Dell)',
      '2) danh_muc=Phu kien AND gia<1000000 -> Chuot game, Ban phim co',
      '3) danh_muc IN (Man hinh, Laptop) -> 4 dong',
      '4) gia BETWEEN 500000 AND 1200000 -> Chuot, Ban phim, Tai nghe (2 dau BAO GOM)',
      '5) ten LIKE Man% -> Man hinh 24, 27 ; LIKE %game% -> Chuot game',
      '6a) Laptop OR Man hinh AND gia<3tr (khong ngoac) -> 3 dong (AND truoc)',
      '6b) (Laptop OR Man hinh) AND gia<3tr -> CHI Man hinh 24',
    ],
  },
};
