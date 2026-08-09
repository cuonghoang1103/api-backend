/**
 * Thẻ "100 Ngày Database" — Ngày 13: GROUP BY & HAVING.
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-13.mjs
 *
 * ⚠ Không có `verify`. `proof.lines` là OUTPUT THẬT của psql.
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433), DB hoc_db_day13:
 *   count=6, sum=2750000, round(avg)=458333
 *   GROUP BY thanh_pho -> HCM 1700000, Ha Noi 1050000 ; HAVING >1.5tr -> chỉ HCM
 *   WHERE tong>=300k + HAVING count>=2 -> chỉ An (800000)
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 13,
  total: 100,
  titleLead: 'DB Day 13:',
  titleAccent: 'GROUP BY & HAVING',
  subtitle: 'Gộp nhiều dòng thành con số: đếm, tổng, trung bình từng nhóm 📊',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. HÀM GỘP 🧮',
      code: `SELECT count(*), sum(tong_tien),
       round(avg(tong_tien)), min(...), max(...)
FROM don_hang;
-- -> 6 đơn, tổng 2.750.000, TB 458.333`,
      notes: [
        { mark: 'ok', text: '`COUNT SUM AVG MIN MAX` nén nhiều dòng thành MỘT con số' },
      ],
    },
    {
      tone: 'green',
      title: '2. GROUP BY — MỖI NHÓM MỘT DÒNG 📦',
      code: `SELECT thanh_pho, count(*), sum(tong_tien)
FROM don_hang GROUP BY thanh_pho;
-- HCM     | 3 | 1700000
-- Ha Noi  | 3 | 1050000`,
      notes: [
        { mark: 'ok', text: '`GROUP BY cot` chia dòng theo giá trị cột đó, tính hàm gộp cho từng nhóm' },
        { mark: 'dot', text: 'Cột trong SELECT phải nằm trong GROUP BY hoặc là hàm gộp' },
      ],
    },
    {
      tone: 'yellow',
      title: '3. HAVING — LỌC NHÓM ✂️',
      code: `... GROUP BY thanh_pho
HAVING sum(tong_tien) > 1500000;
-- -> chỉ HCM (1.700.000)`,
      notes: [
        { mark: 'ok', text: '`HAVING` lọc theo KẾT QUẢ GỘP; `WHERE` không dùng được hàm gộp' },
      ],
    },
    {
      tone: 'pink',
      title: '4. THỨ TỰ: WHERE → GROUP BY → HAVING 🔢',
      code: `WHERE tong_tien >= 300000   -- lọc DÒNG (trước gộp)
GROUP BY khach
HAVING count(*) >= 2        -- lọc NHÓM (sau gộp)
-- -> chỉ An (2 đơn, 800000)`,
      notes: [
        { mark: 'ok', text: '`WHERE` lọc dòng TRƯỚC khi gộp · `HAVING` lọc nhóm SAU khi gộp' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'SQL Server: hàm gộp + GROUP BY + HAVING y hệt (chuẩn SQL)' },
        { mark: 'next', text: '**Ngày 14**: subquery — truy vấn lồng trong truy vấn' },
      ],
    },
  ],

  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      '1) count(*)=6, sum=2750000, round(avg)=458333',
      '2) GROUP BY khach ORDER BY tong DESC -> Binh 1000000(2), An 800000(2), Dung 700000, Chi 250000',
      '3) GROUP BY thanh_pho -> HCM 1700000(3), Ha Noi 1050000(3)',
      '4) HAVING sum(tong_tien) > 1500000 -> chi HCM (1700000)',
      '5) WHERE tong_tien>=300000 + HAVING count(*)>=2 -> chi An (2 don, 800000)',
    ],
  },
};
