/**
 * Thẻ "100 Ngày Database" — Ngày 28: Quan hệ nhiều–nhiều & bảng nối.
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-28.mjs
 *
 * ⚠ Không có `verify`. `proof.lines` là OUTPUT THẬT của psql.
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433), DB hoc_db_day28:
 *   JOIN xuyên dang_ky: An-CSDL/Web, Binh-CSDL, Chi-CSDL/Mang
 *   số SV mỗi môn: CSDL 3, Mang 1, Web 1 ; điểm TB: CSDL 7.3, Mang 8.0, Web 9.0
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 28,
  total: 100,
  titleLead: 'DB Day 28:',
  titleAccent: 'Nhiều–nhiều & bảng nối',
  subtitle: 'Sinh viên ↔ môn học: mẫu thiết kế bạn gặp khắp nơi 🔗',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. VÌ SAO KHÔNG NỐI TRỰC TIẾP ❓',
      code: `-- 1 SV học N môn, 1 môn có N SV
-- đặt khoá ngoại ở đâu cũng chỉ diễn tả được 1 chiều
-> CẦN một bảng Ở GIỮA`,
      notes: [
        { mark: 'ok', text: 'Quan hệ N–N không thể biểu diễn bằng một khoá ngoại đơn — phải có bảng nối' },
      ],
    },
    {
      tone: 'green',
      title: '2. BẢNG NỐI = 2 FK + KHOÁ TỔNG HỢP 🌉',
      code: `CREATE TABLE dang_ky (
  sinh_vien_id INT REFERENCES sinh_vien(id),
  mon_hoc_id   INT REFERENCES mon_hoc(id),
  PRIMARY KEY (sinh_vien_id, mon_hoc_id));`,
      notes: [
        { mark: 'ok', text: 'Mỗi dòng bảng nối = một cặp (SV, môn); khoá tổng hợp chống trùng cặp' },
      ],
    },
    {
      tone: 'yellow',
      title: '3. THUỘC TÍNH CỦA QUAN HỆ 🏷️',
      code: `dang_ky(..., diem NUMERIC(3,1))
-- "điểm" không thuộc SV, không thuộc môn
-- mà thuộc CẶP (SV, môn) -> ở bảng nối`,
      notes: [
        { mark: 'ok', text: 'Dữ liệu mô tả chính mối quan hệ (điểm, ngày ghi danh…) sống ở bảng nối' },
      ],
    },
    {
      tone: 'pink',
      title: '4. TRUY VẤN XUYÊN BẢNG NỐI ↔️',
      code: `JOIN sinh_vien + dang_ky + mon_hoc
-- số SV mỗi môn: CSDL 3, Mang 1, Web 1
-- điểm TB: CSDL 7.3, Mang 8.0, Web 9.0`,
      notes: [
        { mark: 'ok', text: 'Nối 3 bảng để đi cả hai chiều + gộp trên thuộc tính quan hệ' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'SQL Server: bảng nối y hệt. Mẫu này ở khắp nơi: bài viết↔thẻ, đơn↔sản phẩm, phim↔diễn viên' },
        { mark: 'next', text: '**Ngày 29**: phi chuẩn hoá — khi nào CỐ Ý phá chuẩn để đọc nhanh' },
      ],
    },
  ],

  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      '1) JOIN xuyen dang_ky: An-CSDL(8.5), An-Web(9.0), Binh-CSDL(7.0), Chi-CSDL(6.5), Chi-Mang(8.0)',
      '2) so SV moi mon: CSDL 3, Mang 1, Web 1',
      '3) diem TB moi mon (thuoc tinh quan he): CSDL 7.3, Mang 8.0, Web 9.0',
    ],
  },
};
