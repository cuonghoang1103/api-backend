/**
 * Thẻ "100 Ngày Database" — Ngày 10: Khoá ngoại & quan hệ (khép Giai đoạn 1).
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-10.mjs
 *
 * ⚠ Không có `verify`. `proof.lines` là OUTPUT THẬT của psql.
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433), DB hoc_db_day10:
 *   chèn đơn cho khách_id=99 -> violates foreign key constraint "don_hang_khach_id_fkey"
 *   xoá khách còn đơn -> Key (id)=(1) is still referenced from table "don_hang"
 *   ON DELETE CASCADE: xoá tác giả -> 2 bài viết tự xoá theo (bai_con_lai = 0)
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 10,
  total: 100,
  titleLead: 'DB Day 10:',
  titleAccent: 'Khoá ngoại & quan hệ',
  subtitle: 'Nối hai bảng, chống "đơn hàng mồ côi" — khép Giai đoạn 1 🔗',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. FOREIGN KEY — LIÊN KẾT BẢNG 🔗',
      code: `CREATE TABLE don_hang (
  id        SERIAL PRIMARY KEY,
  khach_id  INT NOT NULL REFERENCES khach_hang(id),
  tong_tien INT NOT NULL
);`,
      notes: [
        { mark: 'ok', text: '`REFERENCES` = cột này phải trỏ tới một dòng CÓ THẬT ở bảng kia' },
        { mark: 'dot', text: 'Quan hệ 1–nhiều: một khách có nhiều đơn' },
      ],
    },
    {
      tone: 'green',
      title: '2. TOÀN VẸN THAM CHIẾU 🛡️',
      code: `INSERT INTO don_hang (khach_id, ...) VALUES (99, ...);
-> ERROR: violates foreign key constraint
   Key (khach_id)=(99) is not present in khach_hang`,
      notes: [
        { mark: 'ok', text: 'Không thể tạo đơn cho khách không tồn tại → không có "đơn mồ côi"' },
      ],
    },
    {
      tone: 'pink',
      title: '3. XOÁ CHA KHI CÒN CON? 🚫 / CASCADE',
      code: `DELETE khach_hang id=1 (còn đơn)
-> ERROR: Key (id)=(1) is still referenced ...
-- ON DELETE CASCADE: xoá cha -> con tự xoá theo`,
      notes: [
        { mark: 'ok', text: 'Mặc định: chặn xoá cha còn con. `ON DELETE CASCADE` để con xoá theo' },
      ],
    },
    {
      tone: 'yellow',
      title: '4. ✅ KHÉP GIAI ĐOẠN 1 (NỀN TẢNG)',
      code: `CSDL là gì -> cài PG -> SELECT -> kiểu ->
ràng buộc -> NULL -> ghi (CRUD) ->
WHERE -> ORDER BY/LIMIT -> KHOÁ NGOẠI`,
      notes: [
        { mark: 'ok', text: '10 ngày: bạn đã tạo, ràng buộc, ghi, lọc, sắp xếp & liên kết bảng' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'SQL Server: `FOREIGN KEY ... REFERENCES`, `ON DELETE CASCADE` y hệt (chuẩn SQL)' },
        { mark: 'next', text: '**Ngày 11 (mở Giai đoạn 2)**: `JOIN` — ghép dữ liệu từ nhiều bảng thành một' },
      ],
    },
  ],

  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      '1) 3 don hang tro ve khach co that (khach_id = 1, 1, 2)',
      '2) chen don cho khach_id=99 -> ERROR: violates foreign key constraint "don_hang_khach_id_fkey"',
      '   DETAIL: Key (khach_id)=(99) is not present in table "khach_hang"',
      '3) xoa khach id=1 (con don) -> ERROR: Key (id)=(1) is still referenced from table "don_hang"',
      '4) xoa khach id=3 (khong don) -> DELETE 1  (OK)',
      '5) ON DELETE CASCADE: xoa tac gia -> bai_con_lai = 0  (2 bai tu xoa theo)',
    ],
  },
};
