/**
 * Thẻ "100 Ngày Database" — Ngày 16: CTE (WITH).
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-16.mjs
 *
 * ⚠ Không có `verify`. `proof.lines` là OUTPUT THẬT của psql.
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433), DB hoc_db_day16:
 *   1 CTE -> Binh 900000, An 800000, Dung 700000, Chi 250000
 *   2 CTE (tổng + TB 662500) -> khách trên TB: Binh, An, Dung (Chi bị loại)
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 16,
  total: 100,
  titleLead: 'DB Day 16:',
  titleAccent: 'CTE — đặt tên truy vấn con',
  subtitle: 'WITH biến câu SQL lồng chằng chịt thành các bước đọc từ trên xuống 📖',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. WITH — ĐẶT TÊN MỘT TRUY VẤN 🏷️',
      code: `WITH tong_moi_khach AS (
  SELECT khach_id, sum(tong_tien) AS tong
  FROM don_hang GROUP BY khach_id
)
SELECT * FROM tong_moi_khach ...`,
      notes: [
        { mark: 'ok', text: '`WITH ten AS (...)` = đặt tên cho một truy vấn con, rồi dùng như một bảng' },
      ],
    },
    {
      tone: 'green',
      title: '2. DÙNG NHƯ MỘT BẢNG 📄',
      code: `SELECT k.ten, t.tong
FROM tong_moi_khach t
JOIN khach_hang k ON k.id = t.khach_id;
-- Binh 900k, An 800k, Dung 700k, Chi 250k`,
      notes: [
        { mark: 'ok', text: 'Câu chính JOIN/lọc/sắp xếp trên CTE y như trên một bảng thật' },
      ],
    },
    {
      tone: 'yellow',
      title: '3. NỐI NHIỀU CTE — BƯỚC NỐI BƯỚC ⛓️',
      code: `WITH tong_moi_khach AS (...),
     trung_binh AS (SELECT avg(tong) FROM tong_moi_khach)
SELECT ... WHERE tong > (SELECT tb FROM trung_binh)`,
      notes: [
        { mark: 'ok', text: 'CTE sau dùng được CTE trước → chia bài toán thành các bước rõ ràng' },
      ],
    },
    {
      tone: 'pink',
      title: '4. VÌ SAO CTE > SUBQUERY LỒNG 📖',
      code: `-- subquery lồng: đọc từ TRONG ra ngoài, rối
-- CTE: đọc từ TRÊN xuống, như từng bước`,
      notes: [
        { mark: 'ok', text: 'Cùng kết quả, nhưng CTE dễ đọc, đặt tên có nghĩa, tái dùng được' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'SQL Server: cũng dùng `WITH` y hệt (nên đặt `;` trước WITH cho chắc)' },
        { mark: 'next', text: '**Ngày 17**: recursive CTE — CTE tự gọi chính nó để duyệt cây/cấp bậc' },
      ],
    },
  ],

  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      '1) WITH tong_moi_khach AS (SUM ... GROUP BY khach_id) ->',
      '     Binh 900000, An 800000, Dung 700000, Chi 250000',
      '2) 2 CTE: tong_moi_khach + trung_binh (avg = 662500)',
      '     -> khach tren TB: Binh 900000, An 800000, Dung 700000 (Chi 250000 bi loai)',
    ],
  },
};
