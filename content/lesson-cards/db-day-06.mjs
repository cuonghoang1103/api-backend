/**
 * Thẻ "100 Ngày Database" — Ngày 6: NULL & logic ba giá trị.
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-06.mjs
 *
 * ⚠ Không có `verify`. `proof.lines` là OUTPUT THẬT của psql (\pset null '(null)').
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433), DB hoc_db_day06:
 *   NULL=NULL -> (null); NULL IS NULL -> t
 *   count(*)=4 nhưng count(thuong)=2
 *   WHERE thuong <> 300 -> CHỈ "An" (Binh/Dung NULL bị loại)
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 6,
  total: 100,
  titleLead: 'DB Day 6:',
  titleAccent: 'NULL — logic ba giá trị',
  subtitle: 'Vì sao NULL = NULL lại KHÔNG đúng — bẫy kinh điển của SQL ⚠️',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'pink',
      title: '1. NULL KHÔNG BẰNG GÌ CẢ 🕳️',
      code: `SELECT NULL = NULL;    -- (null), KHÔNG phải true!
SELECT NULL = 5;       -- (null)
SELECT NULL IS NULL;   -- t   (hỏi đúng cách)`,
      notes: [
        { mark: 'ok', text: 'NULL = "chưa biết". Hai cái chưa-biết không thể khẳng định bằng nhau' },
        { mark: 'dot', text: 'Muốn kiểm NULL: dùng `IS NULL` / `IS NOT NULL`, KHÔNG dùng `=`' },
      ],
    },
    {
      tone: 'blue',
      title: '2. LOGIC BA GIÁ TRỊ 🔀',
      code: `TRUE / FALSE / UNKNOWN
5 + NULL   -> (null)   -- phép tính bị "nuốt"
NULL = 5   -> UNKNOWN
WHERE chỉ giữ dòng cho ra TRUE`,
      notes: [
        { mark: 'ok', text: 'So sánh với NULL ra UNKNOWN, không phải TRUE/FALSE' },
      ],
    },
    {
      tone: 'yellow',
      title: '3. BẪY: <> CŨNG LOẠI NULL 🪤',
      code: `-- thuong: An=500, Binh=NULL, Chi=300, Dung=NULL
SELECT ten FROM nhan_vien WHERE thuong <> 300;
-- -> CHỈ "An"!  Binh & Dung (NULL) bị loại`,
      notes: [
        { mark: 'ok', text: '`NULL <> 300` ra UNKNOWN → dòng bị bỏ. Người "chưa có thưởng" biến mất' },
      ],
    },
    {
      tone: 'green',
      title: '4. LÀM VIỆC ĐÚNG VỚI NULL ✅',
      code: `count(*) = 4  vs  count(thuong) = 2  -- bỏ NULL
WHERE thuong IS NULL   -> Binh, Dung
COALESCE(thuong, 0)    -> thay NULL bằng 0`,
      notes: [
        { mark: 'ok', text: '`COUNT(cot)` bỏ NULL · `IS NULL` để lọc · `COALESCE` thay giá trị mặc định' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'SQL Server: hành xử NULL y hệt (chuẩn ANSI); thay NULL bằng `ISNULL(x,y)` hoặc `COALESCE(x,y)`' },
        { mark: 'next', text: '**Ngày 7**: ghi dữ liệu an toàn — INSERT/UPDATE/DELETE, luật WHERE, RETURNING' },
      ],
    },
  ],

  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      '1) NULL = NULL -> (null) ; NULL = 5 -> (null) ; NULL IS NULL -> t',
      '2) 5 + NULL -> (null) ; 100 * NULL -> (null)',
      '3) count(*) = 4  nhung  count(thuong) = 2  (bo qua 2 NULL)',
      '4) WHERE thuong <> 300 -> CHI "An"  (Binh/Dung NULL bi loai)',
      '5) WHERE thuong IS NULL -> Binh, Dung',
      '6) COALESCE(thuong,0) -> An 500, Binh 0, Chi 300, Dung 0',
    ],
  },
};
